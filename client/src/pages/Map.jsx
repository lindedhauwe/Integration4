import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './Map.css';

const mapThemes = {
    voyager: {
        label: 'Voyager',
        url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
        attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    },
    darkMatter: {
        label: 'Dark Matter',
        url: 'https://{s}.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}{r}.png',
        attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    },
};

const mapSpots = [
    {
        id: 'central',
        name: 'Central spot',
        description: 'Hoofdlocatie om mee te testen.',
        position: [51.217, 4.421],
        tone: 'coral',
    },
    {
        id: 'north',
        name: 'Noordelijke pin',
        description: 'Extra marker om verschillende punten te tonen.',
        position: [51.236, 4.405],
        tone: 'mint',
    },
    {
        id: 'river',
        name: 'Rivierzona',
        description: 'Nog een pin met een andere kleur en popup.',
        position: [51.222, 4.387],
        tone: 'amber',
    },
];

function createPinIcon(tone) {
    return L.divIcon({
        className: 'map-pin-wrapper',
        html: `<span class="map-pin map-pin--${tone}"></span>`,
        iconSize: [28, 36],
        iconAnchor: [14, 34],
        popupAnchor: [0, -30],
    });
}

export default function Map() {
    const [activeTheme, setActiveTheme] = useState('voyager');
    const mapElementRef = useRef(null);
    const mapInstanceRef = useRef(null);
    const tileLayerRef = useRef(null);
    const markersLayerRef = useRef(null);

    const theme = mapThemes[activeTheme];

    useEffect(() => {
        if (!mapElementRef.current || mapInstanceRef.current) {
            return undefined;
        }

        const map = L.map(mapElementRef.current, {
            zoomControl: true,
            scrollWheelZoom: true,
        }).setView([51.2194, 4.4025], 13);

        mapInstanceRef.current = map;
        tileLayerRef.current = L.tileLayer(theme.url, {
            attribution: theme.attribution,
        }).addTo(map);

        markersLayerRef.current = L.layerGroup().addTo(map);

        mapSpots.forEach((spot) => {
            const marker = L.marker(spot.position, {
                icon: createPinIcon(spot.tone),
            });

            marker.bindPopup(`
                <strong>${spot.name}</strong><br />
                ${spot.description}
            `);

            marker.addTo(markersLayerRef.current);
        });

        return () => {
            map.remove();
            mapInstanceRef.current = null;
            tileLayerRef.current = null;
            markersLayerRef.current = null;
        };
    }, []);

    useEffect(() => {
        if (!tileLayerRef.current || !mapInstanceRef.current) {
            return;
        }

        tileLayerRef.current.setUrl(theme.url);
        tileLayerRef.current.options.attribution = theme.attribution;
        mapInstanceRef.current.attributionControl.setPrefix(false);
    }, [theme]);

    return (
        <section className="map-page">
            <div className="map-page__intro">
                <p className="map-page__eyebrow">Map</p>
                <h1>Interactieve kaart</h1>
                <p>
                    Deze kaart gebruikt Leaflet met eigen styling en pinpoints. Je kan
                    de locaties, kleuren en achtergrondstijl makkelijk aanpassen in
                    deze component.
                </p>

                <div className="map-page__controls" role="tablist" aria-label="Map style selector">
                    {Object.entries(mapThemes).map(([key, value]) => (
                        <button
                            key={key}
                            type="button"
                            className={key === activeTheme ? 'is-active' : ''}
                            onClick={() => setActiveTheme(key)}
                        >
                            {value.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="map-frame">
                <div ref={mapElementRef} className="map-frame__canvas" />
            </div>
        </section>
    );
}
