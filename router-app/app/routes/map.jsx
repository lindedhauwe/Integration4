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

function getMapSpots() {
    try {
        const liked = JSON.parse(localStorage.getItem("liked_cafes") || "[]");
        const likedIds = new Set(liked.map((c) => c.cafe_id));

        const seen = new Set();
        const spots = [];

        function addSpot(id, name, lat, lng) {
            if (!lat || !lng || seen.has(id)) return;
            seen.add(id);
            spots.push({
                id,
                name,
                position: [lat, lng],
                type: likedIds.has(id) ? 'recLiked' : 'rec',
            });
        }

        // Huidig café
        const current = JSON.parse(localStorage.getItem("current_cafe") || "null");
        if (current) addSpot(current.id, current.name, current.lat, current.lng);

        // Eerder bezochte cafés
        const visited = JSON.parse(localStorage.getItem("visited_cafes") || "[]");
        visited.forEach((c) => addSpot(c.id, c.name, c.lat, c.lng));

        // Gelikte cafés die nog niet op de map staan
        liked.forEach((c) => addSpot(c.cafe_id, c.name, c.lat, c.lng));

        return spots;
    } catch {
        return [];
    }
}

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

            const antwerpenBounds = L.latLngBounds(
                [51.15, 4.28],
                [51.31, 4.52]
            );

            const map = L.map(mapRef.current, {
                zoomControl: false,
                scrollWheelZoom: true,
                minZoom: 13,
                maxZoom: 18,
                maxBounds: antwerpenBounds,
                maxBoundsViscosity: 1.0,
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

            const allSpots = getMapSpots();

            allSpots.forEach((spot) => {
                const key = spot.type;
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
