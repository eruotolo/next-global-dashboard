'use client';

import { MapPin } from 'lucide-react';
import { useEffect, useState } from 'react';
import { MapContainer, Marker, TileLayer, useMap, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import type { LeafletEvent, LeafletMouseEvent } from 'leaflet';
import L from 'leaflet';
import { renderToStaticMarkup } from 'react-dom/server';

// Crear un icono personalizado usando Lucide React
const createCustomIcon = () => {
    const iconHtml = renderToStaticMarkup(
        <div className="relative">
            <MapPin
                size={32}
                className="text-primary fill-primary/20"
                style={{
                    filter: 'drop-shadow(0 2px 2px rgb(0 0 0 / 0.2))',
                }}
            />
        </div>,
    );

    return L.divIcon({
        html: iconHtml,
        className: 'custom-marker-icon',
        iconSize: [32, 32],
        iconAnchor: [16, 32],
    });
};

interface MapComponentProps {
    latitude?: number;
    longitude?: number;
    onLocationChangeAction: (lat: number, lng: number) => void;
    className?: string;
}

// Componente para controlar el centro del mapa sin cambiar el zoom
function MapController({ center }: { center: [number, number] }) {
    const map = useMap();

    useEffect(() => {
        map.setView(center, map.getZoom(), {
            animate: true,
            duration: 1,
        });
    }, [center, map]);

    return null;
}

function MapEvents({ onLocationSelect }: { onLocationSelect: (lat: number, lng: number) => void }) {
    useMapEvents({
        click(e: LeafletMouseEvent) {
            onLocationSelect(e.latlng.lat, e.latlng.lng);
        },
    });
    return null;
}

export default function MapComponent({
    latitude = 0,
    longitude = 0,
    onLocationChangeAction,
}: MapComponentProps) {
    const [position, setPosition] = useState<[number, number]>([latitude || 0, longitude || 0]);
    const [customIcon] = useState(() => createCustomIcon());

    useEffect(() => {
        if (typeof latitude === 'number' && typeof longitude === 'number') {
            setPosition([latitude, longitude]);
        }
    }, [latitude, longitude]);

    const handleLocationSelect = (lat: number, lng: number) => {
        setPosition([lat, lng]);
        onLocationChangeAction(lat, lng);
    };

    return (
        <div className="h-full w-full overflow-hidden rounded-lg">
            <MapContainer center={position} zoom={13} zoomControl={true} className="h-full w-full">
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker
                    position={position}
                    icon={customIcon}
                    draggable={true}
                    eventHandlers={{
                        dragend: (e: LeafletEvent) => {
                            const marker = e.target;
                            const position = marker.getLatLng();
                            handleLocationSelect(position.lat, position.lng);
                        },
                    }}
                />
                <MapController center={position} />
                <MapEvents onLocationSelect={handleLocationSelect} />
            </MapContainer>
        </div>
    );
}
