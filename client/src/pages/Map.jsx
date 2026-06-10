import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './Map.css';
import hetSteenImage from '../assets/images/hetSteen.jpg';
import centraalStationImage from '../assets/images/centraal-station.jpeg';
import masMuseumImage from '../assets/images/mas-museum.jpg';
import coasterOnMapIcon from '../assets/icons/coasterOnMap.png';

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
        id: 'hetsteen',
        name: 'Het Steen',
        description: 'Historisch kasteel aan de Schelde.',
        // Wikipedia: 51.2227°N 4.3974°E
        position: [51.2227, 4.3974],
        iconUrl: hetSteenImage,
    },
    {
        id: 'centraal',
        name: 'Antwerpen-Centraal',
        description: 'Het hoofdstation van Antwerpen.',
        // Wikipedia: 51°13′02″N 4°25′16″E -> 51.217222, 4.421111
        position: [51.217222, 4.421111],
        iconUrl: centraalStationImage,
    },
    {
        id: 'mas',
        name: 'MAS (Museum aan de Stroom)',
        description: 'Museum en uitzichtpunt aan de kaaien.',
        // Wikipedia: 51.2290°N 4.4048°E
        position: [51.2290, 4.4048],
        iconUrl: masMuseumImage,
    },
];

// 3 bierkaartjes om te testen (random locaties)
const extraSpots = [
    { id: 'rand1', name: 'Random spot 1', position: [51.2250, 4.4100] },
    { id: 'rand2', name: 'Random spot 2', position: [51.2100, 4.4020] },
    { id: 'rand3', name: 'Random spot 3', position: [51.2180, 4.4350] },
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

function createCoasterIcon() {
    return L.icon({
        iconUrl: coasterOnMapIcon,
        iconSize: [40, 40],
        iconAnchor: [20, 40],
        popupAnchor: [0, -36],
        className: 'map-coaster-icon',
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

        // Antwerp bounds (approx). Map will be restricted to this box.
        const antwerpSouthWest = L.latLng(51.150, 4.300);
        const antwerpNorthEast = L.latLng(51.260, 4.520);
        const antwerpBounds = L.latLngBounds(antwerpSouthWest, antwerpNorthEast);

        const map = L.map(mapElementRef.current, {
            zoomControl: true,
            scrollWheelZoom: true,
            // restrict panning outside Antwerp
            maxBounds: antwerpBounds,
            // how strictly the user is restricted to the bounds (0-1)
            maxBoundsViscosity: 0.85,
            // sensible zoom limits for city view
            minZoom: 12,
            maxZoom: 18,
        }).setView([51.2194, 4.4025], 13);

        mapInstanceRef.current = map;
        tileLayerRef.current = L.tileLayer(theme.url, {
            attribution: theme.attribution,
        }).addTo(map);

        markersLayerRef.current = L.layerGroup().addTo(map);

        const coasterIcon = createCoasterIcon();

        mapSpots.forEach((spot) => {
            let iconToUse = coasterIcon || createPinIcon('coral');
            if (spot.iconUrl) {
                iconToUse = L.icon({
                    iconUrl: spot.iconUrl,
                    iconSize: [48, 48],
                    iconAnchor: [24, 48],
                    popupAnchor: [0, -40],
                    className: 'map-landmark-icon',
                });
            }

            const marker = L.marker(spot.position, {
                icon: iconToUse,
            });

            const popupHtml = spot.iconUrl
                ? `<img src="${spot.iconUrl}" alt="${spot.name}" style="width:140px;display:block;margin-bottom:6px;border-radius:6px;"/><strong>${spot.name}</strong><br/>${spot.description}`
                : `<strong>${spot.name}</strong><br/>${spot.description}`;

            marker.bindPopup(popupHtml);

            marker.addTo(markersLayerRef.current);
        });

            // add extra random markers and collect coordinates for polyline
            const extraCoords = [];
            extraSpots.forEach((spot) => {
                const marker = L.marker(spot.position, {
                    icon: coasterIcon || createPinIcon('mint'),
                });

                marker.bindPopup(`<strong>${spot.name}</strong>`);
                marker.addTo(markersLayerRef.current);
                extraCoords.push(spot.position);
            });

            // draw dotted polyline connecting the extra markers
            if (extraCoords.length > 1) {
                L.polyline(extraCoords, {
                    color: '#fb923c',
                    weight: 3,
                    dashArray: '8 6',
                    opacity: 0.95,
                }).addTo(markersLayerRef.current);
            }

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
