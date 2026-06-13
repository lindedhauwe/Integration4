import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router';
import { supabase } from '../supabase';
import './map.css';

import swirlMapPage from '../assets/images/swirlMapPage.png';
import rectTopMap from '../assets/images/rectTopMap.png';
import rectBottomMap from '../assets/images/rectBottomMap.png';
import shareIcon from '../assets/icons/iconupload.svg';
import fullHeart from '../assets/icons/fullheart.svg';
import emptyHeart from '../assets/icons/emptyheart.svg';
import fullHeartPink from '../assets/full-heart-pink.svg';
import arrowRight from '../assets/icons/arrow-right.svg';
import locationPin from '../assets/location-pink.svg';
import bgNav from '../assets/bg-nav.svg';
import closeIcon from '../assets/close.svg';
import aanhalingstekens from '../assets/icons/aanhalingstekens.svg';
import handtap from '../assets/icons/handtap.svg';

import coasterPink from '../assets/icons/coasterPink.png';
import coasterPinkHeart from '../assets/icons/coasterPinkHeart.png';
import coasterBrown from '../assets/icons/coasterBrown.png';
import coasterBrownHeart from '../assets/icons/coasterBrownHeart.png';
import coasterGrey from '../assets/icons/coasterGrey.png';
import coasterGreyHeart from '../assets/icons/coasterGrayHeart.png';

function getMapSpots() {
    try {
        const liked = JSON.parse(localStorage.getItem('liked_cafes') || '[]');
        const likedIds = new Set(liked.map((c) => String(c.cafe_id)));
        const spots = [];
        const addedIds = new Set();

        const current = JSON.parse(localStorage.getItem('current_cafe') || 'null');
        if (current?.lat && current?.lng) {
            spots.push({ id: `current-${current.id}`, cafeId: current.id, name: current.name, adress: current.adress || '', position: [current.lat, current.lng], type: likedIds.has(String(current.id)) ? 'currentLiked' : 'current' });
            addedIds.add(String(current.id));
        }

        const visited = JSON.parse(localStorage.getItem('visited_cafes') || '[]');
        visited.forEach((c) => {
            if (!c.lat || !c.lng) return;
            spots.push({ id: `visited-${c.id}`, cafeId: c.id, name: c.name, adress: c.adress || '', position: [c.lat, c.lng], type: likedIds.has(String(c.id)) ? 'visitedLiked' : 'visited' });
            addedIds.add(String(c.id));
        });

        const rec = JSON.parse(sessionStorage.getItem('rec_cafe') || 'null');
        if (rec?.lat && rec?.lng && !addedIds.has(String(rec.id))) {
            spots.push({ id: `rec-${rec.id}`, cafeId: rec.id, name: rec.name, adress: rec.adress || '', position: [rec.lat, rec.lng], type: likedIds.has(String(rec.id)) ? 'recLiked' : 'rec' });
            addedIds.add(String(rec.id));
        }

        liked.forEach((c) => {
            if (!c.lat || !c.lng || addedIds.has(String(c.cafe_id))) return;
            spots.push({ id: `liked-${c.cafe_id}`, cafeId: c.cafe_id, name: c.name, adress: c.adress || '', position: [c.lat, c.lng], type: 'recLiked' });
            addedIds.add(String(c.cafe_id));
        });

        return spots;
    } catch { return []; }
}

const ICON_MAP = {
    current: coasterPink, currentLiked: coasterPinkHeart,
    visited: coasterBrown, visitedLiked: coasterBrownHeart,
    rec: coasterGrey, recLiked: coasterGreyHeart,
};

function parsePhotos(raw) {
    if (!raw) return [];
    try {
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed.filter(Boolean) : (raw ? [raw] : []);
    } catch { return raw ? [raw] : []; }
}

export default function Map() {
    const mapRef = useRef(null);
    const instanceRef = useRef(null);
    const markersRef = useRef({});
    const leafletRef = useRef(null);
    const navigate = useNavigate();

    const [showIntro, setShowIntro] = useState(true);

    function dismissIntro() {
        setShowIntro(false);
    }

    const [panel, setPanel] = useState(null);
    const [panelView, setPanelView] = useState('story');
    const [photoIdx, setPhotoIdx] = useState(0);
    const [isLiked, setIsLiked] = useState(false);
    const setPanelRef = useRef(setPanel);
    setPanelRef.current = setPanel;

    useEffect(() => { setPanelView('story'); setPhotoIdx(0); }, [panel?.name, panel?.type]);

    useEffect(() => {
        if (!panel?.cafeId) { setIsLiked(false); return; }
        const liked = JSON.parse(localStorage.getItem('liked_cafes') || '[]');
        setIsLiked(liked.some((c) => String(c.cafe_id) === String(panel.cafeId)));
    }, [panel?.cafeId]);

    function togglePanelLike() {
        if (!panel?.cafeId) return;
        const liked = JSON.parse(localStorage.getItem('liked_cafes') || '[]');
        const cafeIdStr = String(panel.cafeId);
        const wasLiked = liked.some((c) => String(c.cafe_id) === cafeIdStr);

        let newLiked;
        if (wasLiked) {
            newLiked = liked.filter((c) => String(c.cafe_id) !== cafeIdStr);
        } else {
            const latlng = markersRef.current[cafeIdStr]?.marker?.getLatLng();
            newLiked = [...liked, { cafe_id: panel.cafeId, name: panel.name, adress: panel.adress, lat: latlng?.lat ?? null, lng: latlng?.lng ?? null }];
        }
        localStorage.setItem('liked_cafes', JSON.stringify(newLiked));
        setIsLiked(!wasLiked);

        const markerData = markersRef.current[cafeIdStr];
        if (markerData && leafletRef.current) {
            const L = leafletRef.current;
            const LIKED_TYPE = { current: 'currentLiked', visited: 'visitedLiked', rec: 'recLiked' };
            const BASE_TYPE = { currentLiked: 'current', visitedLiked: 'visited', recLiked: 'rec' };
            const nextType = wasLiked ? (BASE_TYPE[markerData.type] || markerData.type) : (LIKED_TYPE[markerData.type] || markerData.type);
            markerData.type = nextType;
            markerData.marker.setIcon(L.icon({ iconUrl: ICON_MAP[nextType], iconSize: [56, 56], iconAnchor: [28, 56] }));
        }
    }

    // Fetch rec from DB when panel type is 'pending'
    useEffect(() => {
        if (panel?.type !== 'pending') return;
        let cancelled = false;

        async function fetchRec() {
            const { data } = await supabase
                .from('recommendations')
                .select('*')
                .eq('cafe_id', panel.cafeId)
                .limit(5);

            if (cancelled) return;
            if (data && data.length > 0) {
                setPanel((prev) => ({ ...prev, type: 'rec', rec: data[0] }));
            } else {
                setPanel((prev) => ({ ...prev, type: 'add' }));
            }
        }

        fetchRec();
        return () => { cancelled = true; };
    }, [panel?.type, panel?.cafeId]);

    // Leaflet init
    useEffect(() => {
        if (!mapRef.current || instanceRef.current) return;
        let cancelled = false;

        async function init() {
            const L = (await import('leaflet')).default;
            await import('leaflet/dist/leaflet.css');
            if (cancelled || !mapRef.current) return;
            leafletRef.current = L;

            const antwerpenBounds = L.latLngBounds([51.15, 4.28], [51.31, 4.52]);
            const current = (() => { try { return JSON.parse(localStorage.getItem('current_cafe') || 'null'); } catch { return null; } })();
            const center = (current?.lat && current?.lng) ? [current.lat, current.lng] : [51.2194, 4.4025];

            const map = L.map(mapRef.current, {
                zoomControl: false, scrollWheelZoom: true,
                minZoom: 13, maxZoom: 18,
                maxBounds: antwerpenBounds, maxBoundsViscosity: 1.0,
            }).setView(center, 15);
            instanceRef.current = map;

            L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
                attribution: '&copy; OpenStreetMap &copy; CARTO', subdomains: 'abcd', maxZoom: 19,
            }).addTo(map);

            const newMarkers = {};
            getMapSpots().forEach((spot) => {
                const icon = L.icon({ iconUrl: ICON_MAP[spot.type], iconSize: [56, 56], iconAnchor: [28, 56] });
                const marker = L.marker(spot.position, { icon }).on('click', () => {
                    const t = spot.type;

                    if (t === 'current' || t === 'currentLiked') {
                        setPanelRef.current({ type: 'current', name: spot.name, adress: spot.adress, cafeId: spot.cafeId });
                        return;
                    }

                    if (t === 'rec' || t === 'recLiked') {
                        try {
                            const homeRec = JSON.parse(sessionStorage.getItem('home_rec') || 'null');
                            const recCafe = JSON.parse(sessionStorage.getItem('rec_cafe') || 'null');
                            setPanelRef.current({ type: 'rec', name: spot.name, adress: recCafe?.adress || spot.adress, rec: homeRec, cafeId: spot.cafeId });
                        } catch {
                            setPanelRef.current({ type: 'rec', name: spot.name, adress: spot.adress, rec: null, cafeId: spot.cafeId });
                        }
                        return;
                    }

                    if (t === 'visited' || t === 'visitedLiked') {
                        setPanelRef.current({ type: 'pending', name: spot.name, adress: spot.adress, cafeId: spot.cafeId });
                    }
                }).addTo(map);
                newMarkers[String(spot.cafeId)] = { marker, type: spot.type };
            });
            markersRef.current = newMarkers;

            setTimeout(() => map.invalidateSize(), 100);
        }

        init();
        return () => { cancelled = true; if (instanceRef.current) { instanceRef.current.remove(); instanceRef.current = null; } };
    }, []);

    const photos = panel?.rec ? parsePhotos(panel.rec.photo_url) : [];
    const hasPhotos = photos.length > 0;
    const panelOpen = !!panel;
    const isFullPanel = panel?.type === 'pending' || panel?.type === 'rec' || panel?.type === 'add';

    // Close button — geportald naar document.body zodat het ALTIJD boven de hamburger staat
    const closeBtn = panelOpen ? createPortal(
        <button className="mpp__close" onClick={() => setPanel(null)}>
            <img src={bgNav} alt="" className="mpp__close-bg" />
            <img src={closeIcon} alt="sluit" className="mpp__close-icon" />
        </button>,
        document.body
    ) : null;

    return (
        <div className="map-page">
            <div ref={mapRef} className="map-canvas" />

            {/* Close button geportald naar body */}
            {closeBtn}

            {/* ── INTRO OVERLAY ── */}
            {showIntro && (
                <div className="map-intro">
                    <div className="map-intro__topbar">
                        <button className="map-intro__back" onClick={() => navigate(-1)}>
                            <img src={arrowRight} alt="" className="map-intro__back-arrow" />
                            Go back
                        </button>
                    </div>

                    <div className="map-intro__body">
                        {/* <h1 className="map-header__title">YOUR PUB CRAWL</h1> */}
                        <div className="map-intro__legend">
                            <div className="map-intro__item">
                                <img src={coasterGrey} alt="" className="map-intro__coaster" />
                                <span>Active recommended bar</span>
                            </div>
                            <div className="map-intro__item">
                                <img src={coasterBrown} alt="" className="map-intro__coaster" />
                                <span>Bars you've visited</span>
                            </div>
                            <div className="map-intro__item">
                                <img src={coasterPink} alt="" className="map-intro__coaster" />
                                <span>Your current bar location</span>
                            </div>
                            <div className="map-intro__item">
                                <img src={fullHeartPink} alt="" className="map-intro__heart" />
                                <span>Liked bars</span>
                            </div>
                        </div>

                        <p className="map-intro__text">
                            Tap a coaster to read more about the bar or revisit your own story.<br />
                            Build your own pub crawl through Antwerp!
                        </p>

                        <button className="map-intro__start" onClick={dismissIntro}>
                            Start Pub Crawl
                        </button>
                    </div>
                </div>
            )}

            {/* ── NORMALE KAART ── */}
            {!panelOpen && !showIntro && (
                <>
                    <header className="map-header">
                        <img src={rectTopMap} alt="" className="map-header__bg" />
                        <img src={swirlMapPage} alt="" className="map-header__swirl" />
                        <h1 className="map-header__title">YOUR PUB CRAWL</h1>
                    </header>
                    <div className="map-bottom">
                        <img src={rectBottomMap} alt="" className="map-bottom__deco" />
                        <div className="map-bottom__actions">
                            <button className="map-bottom__finish">Finish Pub Crawl</button>
                            <button className="map-bottom__share"><img src={shareIcon} alt="share" /></button>
                        </div>
                        <div className="map-bottom__legend">
                            <div className="map-legend-item"><img src={coasterBrown} alt="" /><span>visited</span></div>
                            <div className="map-legend-item"><img src={coasterPink} alt="" /><span>currently</span></div>
                            <div className="map-legend-item"><img src={coasterGrey} alt="" /><span>your rec</span></div>
                            <div className="map-legend-item"><img src={fullHeart} alt="" className="map-legend-item__heart" /><span>liked</span></div>
                        </div>
                    </div>
                </>
            )}

            {/* ── CURRENT TOAST ── */}
            {!showIntro && panel?.type === 'current' && (
                <>
                    <header className="map-header">
                        <img src={rectTopMap} alt="" className="map-header__bg" />
                        <img src={swirlMapPage} alt="" className="map-header__swirl" />
                        <h1 className="map-header__title">YOUR PUB CRAWL</h1>
                    </header>
                    <div className="map-toast">
                        <p className="map-toast__label">You are now at:</p>
                        <p className="map-toast__name">{panel.name}</p>
                        {panel.adress && <p className="map-toast__adress">{panel.adress}</p>}
                    </div>
                </>
            )}

            {/* ── FULL PANEL ── */}
            {!showIntro && isFullPanel && (
                <div className="mpp">
                    {/* Body */}
                    <div className="mpp__body">

                        {/* Cafénaam — donkergroene rechthoek */}
                        <div className="mpp__bar-header">
                            <div className="mpp__bar-tab">
                                <div className="mpp__name-row">
                                    <h2 className="mpp__bar-name">{panel.name}</h2>
                                    <button className="mpp__heart-btn" onClick={togglePanelLike}>
                                        <img src={isLiked ? fullHeartPink : emptyHeart} alt="like" className={`mpp__heart${isLiked ? ' mpp__heart--liked' : ''}`} />
                                    </button>
                                </div>
                            </div>
                            {/* Locatie — roze balk los onder naam */}
                            {panel.adress && (
                                <div className="mpp__location">
                                    <img src={locationPin} alt="" />
                                    <span>{panel.adress}</span>
                                </div>
                            )}
                        </div>

                        {/* Grote beige cirkel */}
                        <div className="mpp__blob-wrap">
                            <div className="mpp__blob">

                                {panel.type === 'pending' && (
                                    <div className="mpp__spinner" />
                                )}

                                {panel.type === 'rec' && panel.rec && (
                                    panelView === 'story' ? (
                                        <div className="mpp__story">
                                            <img src={aanhalingstekens} alt="" className="mpp__quotes" />
                                            <p className="mpp__desc">{panel.rec.description}</p>
                                        </div>
                                    ) : (
                                        hasPhotos
                                            ? <img src={photos[photoIdx]} alt="" className="mpp__photo-full" onClick={() => setPanelView('story')} style={{ cursor: 'pointer' }} />
                                            : <div className="mpp__no-photo" />
                                    )
                                )}

                                {(panel.type === 'add' || (panel.type === 'rec' && !panel.rec)) && (
                                    <div className="mpp__empty">
                                        <p className="mpp__empty-text">
                                            You've visited this bar but left no recommendation yet.
                                        </p>
                                        <button className="mpp__add-circle" onClick={() => navigate('/recommendations')}>+</button>
                                    </div>
                                )}
                            </div>

                            {/* Pijlen in photo view — buiten cirkel zodat ze niet geclipped worden */}
                            {panelView === 'photos' && hasPhotos && (
                                <>
                                    <button className="mpp__arrow mpp__arrow--left" onClick={() => setPhotoIdx((i) => (i - 1 + photos.length) % photos.length)}>
                                        <img src={arrowRight} alt="vorige" className="mpp__arrow-icon mpp__arrow-icon--flip" />
                                    </button>
                                    <button className="mpp__arrow mpp__arrow--right" onClick={() => setPhotoIdx((i) => (i + 1) % photos.length)}>
                                        <img src={arrowRight} alt="volgende" className="mpp__arrow-icon" />
                                    </button>
                                </>
                            )}

                            {/* Dots — buiten cirkel, centraal onderaan */}
                            {panelView === 'photos' && photos.length > 1 && (
                                <div className="mpp__dots">
                                    {photos.map((_, i) => (
                                        <button key={i} className={`mpp__dot ${i === photoIdx ? 'mpp__dot--active' : ''}`} onClick={() => setPhotoIdx(i)} />
                                    ))}
                                </div>
                            )}

                            {/* Foto thumbnail — centraal onderaan cirkel */}
                            {panel.type === 'rec' && panel.rec && panelView === 'story' && hasPhotos && (
                                <button className="mpp__thumb-wrap" onClick={() => setPanelView('photos')} aria-label="Bekijk foto's">
                                    <img src={photos[0]} alt="" className="mpp__thumb" />
                                    <img src={handtap} alt="" className="mpp__handtap" />
                                </button>
                            )}
                        </div>

                        {/* Flip knop */}
                        {panel.type === 'rec' && panel.rec && hasPhotos && (
                            <button className="mpp__flip" onClick={() => setPanelView((v) => v === 'story' ? 'photos' : 'story')}>
                                {panelView === 'story' ? "Flip to see your photo's" : 'Flip to see your story'}
                                <img src={arrowRight} alt="" />
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
