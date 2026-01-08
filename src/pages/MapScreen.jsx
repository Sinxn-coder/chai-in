import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { supabase } from '../lib/supabaseClient';
import L from 'leaflet';
import { ChevronLeft, MapPin, Navigation, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

// Premium Red Marker for spots
const createCustomIcon = () => {
    return L.divIcon({
        html: `<div style="background: var(--primary); width: 32px; height: 32px; border-radius: 12px; border: 3px solid white; display: flex; align-items: center; justify-content: center; box-shadow: var(--shadow-md); transform: rotate(45deg);"><div style="transform: rotate(-45deg);"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg></div></div>`,
        className: 'custom-div-icon',
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32]
    });
};

// Blue User Location Marker
const createUserIcon = () => {
    return L.divIcon({
        html: `<div style="background: #3B82F6; width: 40px; height: 40px; border-radius: 50%; border: 4px solid white; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></div>`,
        className: 'custom-user-icon',
        iconSize: [40, 40],
        iconAnchor: [20, 20],
        popupAnchor: [0, -20]
    });
};

const MapScreen = () => {
    const navigate = useNavigate();
    const [spots, setSpots] = useState([]);
    const [userLocation, setUserLocation] = useState(null);
    const [isLoadingLocation, setIsLoadingLocation] = useState(false);
    const defaultPosition = [11.2588, 75.7804]; // Calicut

    useEffect(() => {
        const fetchSpots = async () => {
            const { data } = await supabase.from('spots').select('*').eq('is_verified', true);
            if (data) setSpots(data);
        };
        fetchSpots();
    }, []);

    const handleFindMe = () => {
        setIsLoadingLocation(true);
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setUserLocation([latitude, longitude]);
                    setIsLoadingLocation(false);
                },
                (error) => {
                    console.error('Error getting location:', error);
                    setIsLoadingLocation(false);
                    alert('Unable to get your location. Please enable location services.');
                }
            );
        } else {
            setIsLoadingLocation(false);
            alert('Geolocation is not supported by your browser.');
        }
    };

    const calculateDistance = (lat1, lon1, lat2, lon2) => {
        const R = 6371; // Earth's radius in km
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                  Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                  Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    };

    const formatDistance = (distance) => {
        if (distance < 0.1) {
            return `${(distance * 1000).toFixed(0)} m away`;
        } else if (distance < 1) {
            return `${(distance * 1000).toFixed(0)} m away`;
        } else if (distance < 10) {
            return `${distance.toFixed(1)} km away`;
        } else {
            return `${distance.toFixed(0)} km away`;
        }
    };

    const handleViewDetails = (spotId) => {
        const currentLang = window.location.pathname.includes('/ml/') ? 'ml' : 'en';
        navigate(`/${currentLang}/spot/${spotId}`);
    };

    return (
        <div style={{ height: '100vh', width: '100%', position: 'relative' }}>
            {/* Overlay UI */}
            <div style={{ position: 'absolute', top: '20px', left: '20px', zIndex: 1000, display: 'flex', gap: '12px', alignItems: 'center' }}>
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
                <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={handleFindMe}
                    disabled={isLoadingLocation}
                    style={{ 
                        background: 'white', 
                        border: 'none', 
                        padding: '12px 20px', 
                        borderRadius: '18px', 
                        boxShadow: 'var(--shadow-md)', 
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                    }}
                >
                    <Navigation size={20} color={isLoadingLocation ? '#9CA3AF' : '#3B82F6'} />
                    <span style={{ fontWeight: '800', fontSize: '0.9rem', color: isLoadingLocation ? '#9CA3AF' : '#3B82F6' }}>
                        {isLoadingLocation ? 'Finding...' : 'Find Me'}
                    </span>
                </motion.button>
            </div>

            <MapContainer center={userLocation || defaultPosition} zoom={13} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                />

                {/* User Location Marker */}
                {userLocation && (
                    <Marker
                        position={userLocation}
                        icon={createUserIcon()}
                    >
                        <Popup className="chai-in-popup">
                            <div style={{ padding: '8px', textAlign: 'center' }}>
                                <div style={{ fontWeight: '900', fontSize: '0.9rem', color: '#3B82F6', marginBottom: '4px' }}>Your Location</div>
                                <div style={{ fontWeight: '600', fontSize: '0.8rem', color: 'var(--text-muted)' }}>You are here</div>
                            </div>
                        </Popup>
                    </Marker>
                )}

                {/* Spot Markers */}
                {spots.map(spot => {
                    const distance = userLocation ? 
                        calculateDistance(userLocation[0], userLocation[1], spot.latitude || 11.2588, spot.longitude || 75.7804) : 
                        null;
                    
                    return (
                        <Marker
                            key={spot.id}
                            position={[spot.latitude || 11.2588, spot.longitude || 75.7804]}
                            icon={createCustomIcon()}
                        >
                            <Popup className="chai-in-popup">
                                <div style={{ padding: '8px', minWidth: '200px' }}>
                                    <div style={{ fontWeight: '900', fontSize: '1rem', color: 'var(--primary)', marginBottom: '4px' }}>{spot.name}</div>
                                    <div style={{ fontWeight: '700', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '8px' }}>{spot.category}</div>
                                    {distance !== null && (
                                        <div style={{ fontWeight: '600', fontSize: '0.8rem', color: '#059669', marginBottom: '8px' }}>
                                            📍 {formatDistance(distance)}
                                        </div>
                                    )}
                                    <button
                                        onClick={() => handleViewDetails(spot.id)}
                                        style={{ marginTop: '8px', width: '100%', background: 'var(--text-main)', color: 'white', border: 'none', padding: '10px', borderRadius: '10px', fontWeight: '800', fontSize: '0.8rem', cursor: 'pointer' }}
                                    >
                                        View Details
                                    </button>
                                </div>
                            </Popup>
                        </Marker>
                    );
                })}
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
