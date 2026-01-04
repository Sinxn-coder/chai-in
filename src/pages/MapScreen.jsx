import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { supabase } from '../lib/supabaseClient';
import L from 'leaflet';
import { ChevronLeft, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

// Premium Red Marker
const createCustomIcon = () => {
    return L.divIcon({
        html: `<div style="background: var(--primary); width: 32px; height: 32px; border-radius: 12px; border: 3px solid white; display: flex; align-items: center; justify-content: center; box-shadow: var(--shadow-md); transform: rotate(45deg);"><div style="transform: rotate(-45deg);"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg></div></div>`,
        className: 'custom-div-icon',
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32]
    });
};

const MapScreen = () => {
    const navigate = useNavigate();
    const [spots, setSpots] = useState([]);
    const defaultPosition = [11.2588, 75.7804]; // Calicut

    useEffect(() => {
        const fetchSpots = async () => {
            const { data } = await supabase.from('spots').select('*');
            if (data) setSpots(data);
        };
        fetchSpots();
    }, []);

    return (
        <div style={{ height: '100vh', width: '100%', position: 'relative' }}>
            {/* Overlay UI */}
            <div style={{ position: 'absolute', top: '20px', left: '20px', zIndex: 1000, display: 'flex', gap: '12px' }}>
                <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => navigate(-1)}
                    style={{ background: 'white', border: 'none', padding: '12px', borderRadius: '18px', boxShadow: 'var(--shadow-md)', cursor: 'pointer' }}
                >
                    <ChevronLeft size={24} color="var(--text-main)" />
                </motion.button>
                <div style={{ background: 'white', padding: '12px 24px', borderRadius: '18px', boxShadow: 'var(--shadow-md)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <MapPin size={20} color="var(--primary)" />
                    <span style={{ fontWeight: '800', fontSize: '0.95rem' }}>Eats Around You</span>
                </div>
            </div>

            <MapContainer center={defaultPosition} zoom={13} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                />

                {spots.map(spot => (
                    <Marker
                        key={spot.id}
                        position={[spot.latitude || 11.2588, spot.longitude || 75.7804]}
                        icon={createCustomIcon()}
                    >
                        <Popup className="chai-in-popup">
                            <div style={{ padding: '4px' }}>
                                <div style={{ fontWeight: '900', fontSize: '1rem', color: 'var(--primary)', marginBottom: '4px' }}>{spot.name}</div>
                                <div style={{ fontWeight: '700', fontSize: '0.8rem', color: 'var(--text-muted)' }}>{spot.category}</div>
                                <button
                                    onClick={() => navigate(`/spot/${spot.id}`)}
                                    style={{ marginTop: '10px', width: '100%', background: 'var(--text-main)', color: 'white', border: 'none', padding: '8px', borderRadius: '10px', fontWeight: '800', fontSize: '0.8rem', cursor: 'pointer' }}
                                >
                                    View Details
                                </button>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>

            <style>{`
                .chai-in-popup .leaflet-popup-content-wrapper {
                    border-radius: 20px !important;
                    padding: 4px !important;
                }
                .chai-in-popup .leaflet-popup-tip-container {
                    display: none !important;
                }
            `}</style>
        </div>
    );
};

export default MapScreen;
