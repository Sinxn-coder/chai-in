import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { supabase } from '../lib/supabaseClient';
import L from 'leaflet';

// Custom Marker Icon (Fix for default Leaflet icon missing)
const icon = L.icon({
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
});

const MapScreen = ({ lang }) => {
    const [spots, setSpots] = useState([]);
    const defaultPosition = [9.9312, 76.2673]; // Kochi, Kerala

    useEffect(() => {
        const fetchSpots = async () => {
            const { data } = await supabase.from('spots').select('*');
            if (data) setSpots(data);
        };
        fetchSpots();
    }, []);

    return (
        <div style={{ height: '100vh', position: 'relative', paddingBottom: '80px' }}>
            {/* Local Header removed to use global AppBar */}

            <div style={{ height: 'calc(100% - 60px)', width: '100%', zIndex: 0 }}>
                <MapContainer center={defaultPosition} zoom={13} style={{ height: '100%', width: '100%' }}>
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                    />

                    {spots.map(spot => (
                        <Marker
                            key={spot.id}
                            position={[spot.latitude || 9.9312, spot.longitude || 76.2673]}
                            icon={icon}
                        >
                            <Popup>
                                <strong>{spot.name}</strong><br />
                                {spot.category} • {'$'.repeat(spot.price_level || 1)}
                            </Popup>
                        </Marker>
                    ))}
                </MapContainer>
            </div>
        </div>
    );
};

export default MapScreen;
