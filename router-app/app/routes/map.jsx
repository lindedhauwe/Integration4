import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router';
import { supabase } from '../supabase';
import './map.css';

import swirlMapPage from '../assets/images/swirlMapPage.png';
import rectTopMap from '../assets/images/rectTopMap.png';
import rectBottomMap from '../assets/images/rectBottomMap.png';
import shareIcon from '../assets/icons/share.svg';
import fullHeart from '../assets/icons/fullheartbeige.svg';
import emptyHeart from '../assets/icons/emptyheart.svg';
import fullHeartPink from '../assets/icons/full-heart-pink.svg';
import arrowRight from '../assets/icons/arrow-right.svg';
import locationPin from '../assets/icons/location-pink.svg';
import currenttapbg from '../assets/icons/currenttapbg.svg';
import locationpingreen from '../assets/icons/locationpingreen.svg';
import bgNav from '../assets/icons/bg-nav.svg';
import closeIcon from '../assets/icons/close-orange.svg';
import aanhalingstekens from '../assets/icons/aanhalingstekens.svg';
import handtap from '../assets/icons/handtap.svg';
import addrecIcon from '../assets/icons/addrec.svg';

import pubcrawlVb from '../assets/images/pubcrawl-vb.png';
import langeWapper from '../assets/images/lange-wapper.png';

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

    const [showFinish, setShowFinish] = useState(false);
    const [clock, setClock] = useState(() =>
        new Date().toLocaleTimeString('nl-BE', { timeZone: 'Europe/Brussels', hour: '2-digit', minute: '2-digit' })
    );

    const getAntwerpHour = () => {
        const h = new Date().toLocaleString('nl-BE', { timeZone: 'Europe/Brussels', hour: 'numeric', hour12: false });
        return parseInt(h, 10);
    };

    const [isNight, setIsNight] = useState(() => {
        const h = getAntwerpHour();
        return h < 6 || h >= 21;
    });

    const [wapper, setWapper] = useState(null); // { side: 'left'|'right' }

    useEffect(() => {
        if (!isNight) return;
        let timeout;
        function scheduleWapper() {
            const delay = 8000 + Math.random() * 20000; // 8-28s
            timeout = setTimeout(() => {
                const side = Math.random() < 0.5 ? 'left' : 'right';
                const top = 35 + Math.random() * 35; // 35% - 70%
                setWapper({ side, top });
                setTimeout(() => {
                    setWapper(null);
                    scheduleWapper();
                }, 2500 + Math.random() * 2000); // visible 2.5-4.5s
            }, delay);
        }
        scheduleWapper();
        return () => clearTimeout(timeout);
    }, [isNight]);

    useEffect(() => {
        const tick = setInterval(() => {
            const now = new Date().toLocaleTimeString('nl-BE', { timeZone: 'Europe/Brussels', hour: '2-digit', minute: '2-digit' });
            setClock(now);
            const h = getAntwerpHour();
            setIsNight(h < 6 || h >= 21);
        }, 1000);
        return () => clearInterval(tick);
    }, []);
    const [showAuthGate, setShowAuthGate] = useState(() => {
        try { return !localStorage.getItem('user'); } catch { return true; }
    });
    const [showIntro, setShowIntro] = useState(true);

    function dismissIntro() {
        setShowIntro(false);
        setTimeout(() => {
            Object.values(markersRef.current).forEach(({ marker }, idx) => {
                const el = marker.getElement();
                if (!el) return;
                el.classList.remove('coaster-bounce');
                void el.offsetWidth; // reflow om animatie te resetten
                el.style.animationDelay = `${idx * 0.15}s`;
                el.classList.add('coaster-bounce');
            });
        }, 100);
    }

    const [panel, setPanel] = useState(null);
    const [panelView, setPanelView] = useState('story');
    const [photoIdx, setPhotoIdx] = useState(0);
    const [isLiked, setIsLiked] = useState(false);
    const [toastPos, setToastPos] = useState(null);
    const setPanelRef = useRef(setPanel);
    setPanelRef.current = setPanel;

    useEffect(() => { setPanelView('story'); setPhotoIdx(0); }, [panel?.name, panel?.type]);

    // Pin de toast boven de roze marker door Leaflet pixel-coördinaten bij te houden
    useEffect(() => {
        if (panel?.type !== 'current' || !panel.position || !instanceRef.current) {
            setToastPos(null);
            return;
        }
        const map = instanceRef.current;
        function updatePos() {
            const pt = map.latLngToContainerPoint(panel.position);
            setToastPos({ x: pt.x, y: pt.y });
        }
        updatePos();
        map.on('move zoom viewreset', updatePos);
        return () => { map.off('move zoom viewreset', updatePos); };
    }, [panel?.type, panel?.position]);

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

            const tileUrl = isNight
                ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
                : 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';

            L.tileLayer(tileUrl, {
                attribution: '&copy; OpenStreetMap &copy; CARTO', subdomains: 'abcd', maxZoom: 19,
            }).addTo(map);

            const newMarkers = {};
            getMapSpots().forEach((spot, idx) => {
                const icon = L.icon({ iconUrl: ICON_MAP[spot.type], iconSize: [56, 56], iconAnchor: [28, 56] });
                const marker = L.marker(spot.position, { icon }).on('click', () => {
                    const t = spot.type;

                    if (t === 'current' || t === 'currentLiked') {
                        setPanelRef.current({ type: 'current', name: spot.name, adress: spot.adress, cafeId: spot.cafeId, position: spot.position });
                        return;
                    }

                    if (t === 'rec' || t === 'recLiked') {
                        const recCafe = (() => { try { return JSON.parse(sessionStorage.getItem('rec_cafe') || 'null'); } catch { return null; } })();
                        setPanelRef.current({ type: 'not-visited', name: spot.name, adress: recCafe?.adress || spot.adress, cafeId: spot.cafeId });
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
    const isFullPanel = panel?.type === 'pending' || panel?.type === 'rec' || panel?.type === 'add' || panel?.type === 'not-visited';

    // Close button — enkel bij full panel, niet bij de current toast
    const closeBtn = isFullPanel ? createPortal(
        <button className="mpp__close" onClick={() => setPanel(null)}>
            <img src={bgNav} alt="" className="mpp__close-bg" />
            <img src={closeIcon} alt="sluit" className="mpp__close-icon" />
        </button>,
        document.body
    ) : null;

    return (
        <div className={`map-page${isNight ? ' map-page--night' : ''}`}>
            <div ref={mapRef} className="map-canvas" />

            {/* ── WAPPER ── */}
            {isNight && wapper && (
                <img
                    src={langeWapper}
                    alt=""
                    className={`map-wapper map-wapper--${wapper.side}`}
                    style={{ top: `${wapper.top}%` }}
                />
            )}

            {/* ── NIGHT LIGHTS ── */}
            {isNight && (
                <div className="map-night-lights" aria-hidden="true">
                    {Array.from({ length: 30 }).map((_, i) => (
                        <span key={i} className="map-night-lights__dot" />
                    ))}
                </div>
            )}

            {/* Close button geportald naar body */}
            {closeBtn}

            {/* ── AUTH GATE — alleen als niet ingelogd ── */}
            {showAuthGate && (
                <div className="map-auth-gate">
                    <div className="map-auth-gate__topbar">
                        <button className="map-auth-gate__back" onClick={() => navigate(-1)}>
                            <img src={arrowRight} alt="" className="map-auth-gate__back-icon" />
                            home
                        </button>
                    </div>
<div className="map-auth-gate__content">
                        <h1 className="map-auth-gate__title" onClick={() => setShowAuthGate(false)} style={{ cursor: 'pointer' }}>Start your own pub crawl!</h1>
                        <p className="map-auth-gate__text">
                            Save all the spots you've visited, the places you plan to visit, and your current recommendations. Later, you can share your personal pub crawl with your friends!
                        </p>
                        <p className="map-auth-gate__text">
                            To save your pub crawl, you'll need to create an account.
                        </p>
                        <div className="map-auth-gate__actions">
                            <button className="map-auth-gate__login" onClick={() => navigate('/login')}>Log in</button>
                            <button className="map-auth-gate__register" onClick={() => navigate('/create-profile')}>Create account</button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── INTRO OVERLAY ── */}
            {!showAuthGate && showIntro && (
                <div className="map-intro">
                    <div className="map-intro__topbar">
                        <button className="map-intro__back" onClick={() => navigate(-1)}>
                            <img src={arrowRight} alt="" className="map-intro__back-arrow" />
                            home
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

            {/* ── HEADER + BOTTOM — altijd zichtbaar op de achtergrond ── */}
            <>
                    <header className="map-header">
                        <img src={rectTopMap} alt="" className="map-header__bg" />
                        <img src={swirlMapPage} alt="" className="map-header__swirl" />
                        <h1 className="map-header__title">YOUR PUB CRAWL</h1>
                        <div className="map-header__clock">
                            <span className="map-header__clock-time">{clock}</span>
                            <span className="map-header__clock-city">Antwerp</span>
                        </div>
                    </header>
                    <div className="map-bottom">
                        <img src={rectBottomMap} alt="" className="map-bottom__deco" />
                        <div className="map-bottom__actions">
                            <button className="map-bottom__finish" onClick={() => setShowFinish(true)}>Finish Pub Crawl</button>
                            <button className="map-bottom__share"><img src={shareIcon} alt="share" /></button>
                        </div>
                        <div className="map-bottom__legend" onClick={() => setShowIntro(true)} style={{ cursor: 'pointer' }}>
                            <div className="map-legend-item"><img src={coasterBrown} alt="" /><span>visited</span></div>
                            <div className="map-legend-item"><img src={coasterPink} alt="" /><span>currently</span></div>
                            <div className="map-legend-item"><img src={coasterGrey} alt="" /><span>recommendation</span></div>
                            <div className="map-legend-item"><img src={fullHeart} alt="" className="map-legend-item__heart" /><span>liked</span></div>
                        </div>
                    </div>
            </>

            {/* ── CURRENT TOAST ── */}
            {!showIntro && panel?.type === 'current' && toastPos && (
                <>
                    <div className="map-toast__dismiss" onClick={() => setPanel(null)} />
                    <div
                        className="map-toast"
                        style={{
                            left: toastPos.x,
                            top: toastPos.y - 56 - 12,
                            transform: 'translateX(-50%) translateY(-100%)',
                        }}
                    >
                        <img src={currenttapbg} alt="" className="map-toast__bg" />
                        <div className="map-toast__content">
                            <p className="map-toast__label">Your latest tap:</p>
                            <div className="map-toast__name-row">
                                <img src={locationpingreen} alt="" className="map-toast__pin" />
                                <p className="map-toast__name">{panel.name}</p>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* ── FULL PANEL ── */}
            {!showIntro && isFullPanel && (
                <div className="mpp" onClick={() => setPanel(null)}>
                    {/* Body */}
                    <div className="mpp__body" onClick={(e) => e.stopPropagation()}>

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
                                            You've visited this bar but left no recommendations for others or to look back at.
                                        </p>
                                    </div>
                                )}

                                {panel.type === 'not-visited' && (
                                    <div className="mpp__empty">
                                        <p className="mpp__empty-text">
                                            You haven't visited this bar yet. Once you have, you can write a recommendation for others!
                                        </p>
                                    </div>
                                )}

                                {/* Pijlen BINNEN de blob — circular clip geeft halve-button look op de rand */}
                                {panelView === 'photos' && photos.length > 1 && (
                                    <>
                                        <button className="mpp__arrow mpp__arrow--left" onClick={() => setPhotoIdx((i) => (i - 1 + photos.length) % photos.length)}>
                                            <img src={arrowRight} alt="vorige" className="mpp__arrow-icon mpp__arrow-icon--flip" />
                                        </button>
                                        <button className="mpp__arrow mpp__arrow--right" onClick={() => setPhotoIdx((i) => (i + 1) % photos.length)}>
                                            <img src={arrowRight} alt="volgende" className="mpp__arrow-icon" />
                                        </button>
                                    </>
                                )}
                            </div>

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

                            {/* Add rec knop — onderaan cirkel, zelfde positie als thumb */}
                            {(panel.type === 'add' || (panel.type === 'rec' && !panel.rec)) && (
                                <button className="mpp__addrec-wrap" onClick={() => navigate('/recommendations')} aria-label="Voeg aanbeveling toe">
                                    <img src={addrecIcon} alt="+" className="mpp__addrec-icon" />
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

            {/* ── FINISH OVERLAY ── */}
            {showFinish && createPortal(
                <button className="mpp__close" onClick={() => setShowFinish(false)}>
                    <img src={bgNav} alt="" className="mpp__close-bg" />
                    <img src={closeIcon} alt="sluit" className="mpp__close-icon" />
                </button>,
                document.body
            )}
            {showFinish && (
                <div className="map-finish">
                    <div className="map-finish__content">
                        <div className="map-finish__header">
                            <div className="map-finish__card">
                                <h2 className="map-finish__title">
                                    {(() => { try { const u = JSON.parse(localStorage.getItem('user') || 'null'); return u?.name ? <><span className="map-finish__username">{u.name}</span>'s pub crawl in...</> : <>My pub crawl in...</>; } catch { return <>My pub crawl in...</>; } })()}
                                </h2>
                            </div>
                            <div className="map-finish__location">
                                <img src={locationPin} alt="" className="map-finish__location-pin" />
                                <span>ANTWERP</span>
                            </div>
                        </div>

                        <div className="map-finish__circle">
                            <img src={pubcrawlVb} alt="pub crawl" className="map-finish__map-img" />
                        </div>

                        <button className="map-finish__share" onClick={async () => {
                            if (navigator.share) {
                                await navigator.share({ title: 'My Antwerp Pub Crawl', url: window.location.origin });
                            } else {
                                await navigator.clipboard.writeText(window.location.origin);
                            }
                        }}>
                            Share your pub crawl
                            <img src={shareIcon} alt="" className="map-finish__share-icon" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
