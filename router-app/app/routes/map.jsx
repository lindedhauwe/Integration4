import { useEffect, useRef } from 'react';
import './map.css';

import swirlMapPage from '../assets/images/swirlMapPage.png';
import rectTopMap from '../assets/images/rectTopMap.png';
import rectBottomMap from '../assets/images/rectBottomMap.png';
import shareIcon from '../assets/icons/iconupload.svg';
import fullHeart from '../assets/icons/fullheart.svg';

import coasterPink from '../assets/icons/coasterPink.png';
import coasterPinkHeart from '../assets/icons/coasterPinkHeart.png';
import coasterBrown from '../assets/icons/coasterBrown.png';
import coasterBrownHeart from '../assets/icons/coasterBrownHeart.png';
import coasterGrey from '../assets/icons/coasterGrey.png';
import coasterGreyHeart from '../assets/icons/coasterGrayHeart.png';

const testSpots = [
    { id: 1, name: 'Café Beveren',   position: [51.2194, 4.3980], type: 'current', liked: false },
    { id: 2, name: 'De Muze',        position: [51.2210, 4.4050], type: 'visited', liked: false },
    { id: 3, name: 'Kulminator',     position: [51.2150, 4.4100], type: 'visited', liked: true  },
    { id: 4, name: 'Café Den Engel', position: [51.2230, 4.3990], type: 'visited', liked: true  },
    { id: 5, name: 'Bier Central',   position: [51.2170, 4.4200], type: 'visited', liked: false },
    { id: 6, name: 'Pelgrom',        position: [51.2260, 4.4010], type: 'rec',     liked: false },
];

const ICON_MAP = {
    current:      coasterPink,
    currentLiked: coasterPinkHeart,
    visited:      coasterBrown,
    visitedLiked: coasterBrownHeart,
    rec:          coasterGrey,
    recLiked:     coasterGreyHeart,
};

export default function Map() {
    const mapRef = useRef(null);
    const instanceRef = useRef(null);

    useEffect(() => {
        if (!mapRef.current || instanceRef.current) return;

        let cancelled = false;

        async function init() {
            const L = (await import('leaflet')).default;
            await import('leaflet/dist/leaflet.css');
            if (cancelled || !mapRef.current) return;

            const map = L.map(mapRef.current, {
                zoomControl: false,
                scrollWheelZoom: true,
                minZoom: 12,
                maxZoom: 18,
            }).setView([51.2194, 4.4025], 14);

            instanceRef.current = map;

            L.tileLayer(
                'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
                {
                    attribution: '&copy; OpenStreetMap &copy; CARTO',
                    subdomains: 'abcd',
                    maxZoom: 19,
                }
            ).addTo(map);

            testSpots.forEach((spot) => {
                const key = spot.type + (spot.liked ? 'Liked' : '');
                const icon = L.icon({
                    iconUrl: ICON_MAP[key],
                    iconSize: [56, 56],
                    iconAnchor: [28, 28],
                    popupAnchor: [0, -32],
                });
                L.marker(spot.position, { icon })
                    .bindPopup(`<strong>${spot.name}</strong>`)
                    .addTo(map);
            });

            // fix for map not rendering correctly on first load
            setTimeout(() => map.invalidateSize(), 100);
        }

        init();

        return () => {
            cancelled = true;
            if (instanceRef.current) {
                instanceRef.current.remove();
                instanceRef.current = null;
            }
        };
    }, []);

    return (
        <div className="map-page">
            <div ref={mapRef} className="map-canvas" />

            <header className="map-header">
                <img src={rectTopMap} alt="" className="map-header__bg" />
                <img src={swirlMapPage} alt="" className="map-header__swirl" />
                <h1 className="map-header__title">YOUR PUB CRAWL</h1>
            </header>

            <div className="map-bottom">
                <img src={rectBottomMap} alt="" className="map-bottom__deco" />
                <div className="map-bottom__actions">
                    <button className="map-bottom__finish">Finish Pub Crawl</button>
                    <button className="map-bottom__share">
                        <img src={shareIcon} alt="share" />
                    </button>
                </div>
                <div className="map-bottom__legend">
                    <div className="map-legend-item">
                        <img src={coasterBrown} alt="" />
                        <span>visited</span>
                    </div>
                    <div className="map-legend-item">
                        <img src={coasterPink} alt="" />
                        <span>currently</span>
                    </div>
                    <div className="map-legend-item">
                        <img src={coasterGrey} alt="" />
                        <span>your rec</span>
                    </div>
                    <div className="map-legend-item">
                        <img src={fullHeart} alt="" className="map-legend-item__heart" />
                        <span>liked</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
