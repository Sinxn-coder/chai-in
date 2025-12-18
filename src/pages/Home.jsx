import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import SpotCard from '../components/SpotCard';
import { Search, MapPin, Filter, X, Bell } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import NotificationsSheet from '../components/NotificationsSheet';
// import { getDistanceFromLatLonInKm } from '../utils/mapUtils';
// Assuming mapUtils exists, if not I will inline the function or import from MapScreen logic if available.
// Actually safer to inline to avoid import errors if util file not verified.

import { useNavigate } from 'react-router-dom';

const Home = ({ lang }) => {
    const navigate = useNavigate();
    const { user } = useAuth();

    const [spots, setSpots] = useState([]);
    const [filteredSpots, setFilteredSpots] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    // Notification state
    const [showNotifications, setShowNotifications] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);

    // Location State
    const [userLocation, setUserLocation] = useState(null); // Actual GPS (for distance calculation)
    const [activeLocation, setActiveLocation] = useState(null); // Selected filter location { lat, lng }
    const [locationName, setLocationName] = useState('All Kerala');
    const [isSearchingLocation, setIsSearchingLocation] = useState(false);
    const [locationQuery, setLocationQuery] = useState('');

    const [nearbyAreas, setNearbyAreas] = useState([]);
    const [activeCategory, setActiveCategory] = useState('All');

    // Check Streaks
    useEffect(() => {
        if (user) checkStreak();
    }, [user]);

    // Notification Logic
    useEffect(() => {
        if (!user) return;
        const fetchUnread = async () => {
            const { count } = await supabase
                .from('notifications')
                .select('*', { count: 'exact', head: true })
                .eq('user_id', user.id)
                .eq('is_read', false);
            setUnreadCount(count || 0);
        };
        fetchUnread();

        // Realtime listener for new notifications
        const channel = supabase
            .channel('public:notifications')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'notifications', filter: `user_id=eq.${user.id}` }, () => {
                setUnreadCount(c => c + 1);
            })
            .subscribe();

        return () => supabase.removeChannel(channel);
    }, [user]);

    const checkStreak = async () => {
        const today = new Date().toISOString().split('T')[0];
        const lastActive = localStorage.getItem('last_active_date');

        if (lastActive !== today) {
            localStorage.setItem('last_active_date', today);
            // Increment streak in DB
            if (user) {
                const { data } = await supabase.from('user_preferences').select('streak').eq('user_id', user.id).single();
                const newStreak = (data?.streak || 0) + 1;
                await supabase.from('user_preferences').update({ streak: newStreak }).eq('user_id', user.id);
            }
        }
    };

    useEffect(() => {
        // Initial Geolocation
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const { latitude, longitude } = pos.coords;
                setUserLocation({ lat: latitude, lng: longitude });
                setLocationName("Current Location");
            },
            (err) => {
                console.error(err);
                setLocationName("Kerala"); // Default
                setUserLocation({ lat: 10.8505, lng: 76.2711 }); // Kerala Center
            }
        );
    }, []);

    useEffect(() => {
        fetchSpots();
    }, [activeLocation]); // Re-fetch/filter when active location changes

    // Actual user GPS for distance sorting/display
    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            (pos) => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
            (err) => console.error(err)
        );
    }, []);

    // Search Location (Nominatim)
    const handleLocationSearch = async () => {
        if (!locationQuery.trim()) return;
        setIsSearchingLocation(true);
        try {
            const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(locationQuery)}`);
            const data = await res.json();
            if (data && data.length > 0) {
                const { lat, lon, display_name } = data[0];
                const parts = display_name.split(',');
                const shortName = parts[0];

                setActiveLocation({ lat: parseFloat(lat), lng: parseFloat(lon) });
                setLocationName(shortName);
                setIsSearchingLocation(false);
                setSearchTerm('');
            } else {
                alert("Location not found!");
            }
        } catch (e) {
            console.error(e);
            alert("Failed to search location");
        }
        setIsSearchingLocation(false);
    };

    const fetchSpots = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('spots')
            .select('*')
            .eq('is_verified', true)
            .order('created_at', { ascending: false });

        if (error) {
            console.error(error);
        } else {
            let allSpots = data || [];

            // 1. Filter by 30km Radius Logic (ONLY if activeLocation is set)
            if (activeLocation) {
                const nearby = [];
                const areas = {};

                allSpots.forEach(spot => {
                    const dist = getDistanceFromLatLonInKm(activeLocation.lat, activeLocation.lng, spot.latitude, spot.longitude);
                    spot.distance = dist; // Attach distance for sorting

                    if (dist <= 30) {
                        nearby.push(spot);
                        // Extract Area Name
                        if (spot.location_text) {
                            const area = spot.location_text.split(',')[0].trim();
                            areas[area] = (areas[area] || 0) + 1;
                        }
                    }
                });

                // Update Nearby Areas List
                setNearbyAreas(Object.keys(areas).slice(0, 5));
                allSpots = nearby;
            } else if (userLocation) {
                // Background distance calculation if userLocation exists but no filter
                allSpots.forEach(spot => {
                    spot.distance = getDistanceFromLatLonInKm(userLocation.lat, userLocation.lng, spot.latitude, spot.longitude);
                });
            }

            setSpots(allSpots);
            setFilteredSpots(allSpots);
        }
        setLoading(false);
    };

    // Filter Logic (Search Term + Category)
    useEffect(() => {
        let results = spots;

        if (searchTerm) {
            results = results.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()));
        }

        if (activeCategory !== 'All') {
            results = results.filter(s => s.category === activeCategory);
        }

        setFilteredSpots(results);
    }, [searchTerm, activeCategory, spots]);

    // Helper (Inline)
    function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
        if (!lat1 || !lon1 || !lat2 || !lon2) return 9999;
        var R = 6371;
        var dLat = deg2rad(lat2 - lat1);
        var dLon = deg2rad(lon2 - lon1);
        var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = R * c;
        return d;
    }
    function deg2rad(deg) { return deg * (Math.PI / 180); }

    // Notifications Effect
    useEffect(() => {
        if (!user) return;
        const fetchUnread = async () => {
            const { count } = await supabase
                .from('notifications')
                .select('*', { count: 'exact', head: true })
                .eq('user_id', user.id)
                .eq('is_read', false);
            setUnreadCount(count || 0);
        };
        fetchUnread();

        // Realtime listener for new notifications
        const channel = supabase
            .channel('public:notifications')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'notifications', filter: `user_id=eq.${user.id}` }, () => {
                setUnreadCount(c => c + 1);
            })
            .subscribe();

        return () => supabase.removeChannel(channel);
    }, [user]);

    // Hash navigation for #admin shortcut
    useEffect(() => {
        if (window.location.hash === '#admin') {
            navigate(`/${lang || 'en'}/admin`);
        }
    }, [navigate, lang]);

    const handleSearchInput = (val) => {
        setSearchTerm(val);
        if (val.toLowerCase().trim() === '#admin') {
            navigate(`/${lang || 'en'}/admin`);
        }
    };

    const handleUseCurrentLocation = () => {
        setIsSearchingLocation(false);
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const { latitude, longitude } = pos.coords;
                const newLocation = { lat: latitude, lng: longitude };
                setActiveLocation(newLocation);
                setLocationName("Nearby You");
            },
            (err) => {
                console.error(err);
            }
        );
    };

    const handleClearLocation = () => {
        setActiveLocation(null);
        setLocationName('All Kerala');
        setIsSearchingLocation(false);
    };

    return (
        <div style={{ padding: '20px', paddingBottom: '100px' }}>
            <NotificationsSheet isOpen={showNotifications} onClose={() => { setShowNotifications(false); setUnreadCount(0); }} userId={user?.id} />

            {/* Header: Location Search */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <div>
                    <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)' }}>Exploring</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }} onClick={() => setIsSearchingLocation(!isSearchingLocation)}>
                        <h2 style={{ margin: 0, fontSize: '1.4rem', color: 'var(--e23744)' }}>{locationName} <span style={{ fontSize: '0.8rem' }}>▼</span></h2>
                    </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <button
                        onClick={() => setShowNotifications(true)}
                        style={{ position: 'relative', background: 'white', border: 'none', borderRadius: '50%', width: '40px', height: '40px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                    >
                        <Bell size={20} color="#333" />
                        {unreadCount > 0 && (
                            <span style={{
                                position: 'absolute', top: '2px', right: '2px',
                                background: 'var(--primary)', color: 'white',
                                fontSize: '0.7rem', fontWeight: 'bold',
                                width: '16px', height: '16px', borderRadius: '50%',
                                display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}>
                                {unreadCount}
                            </span>
                        )}
                    </button>

                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#eee', overflow: 'hidden', border: '2px solid white', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                        <img src={user?.user_metadata?.avatar_url || `https://ui-avatars.com/api/?name=${user?.email}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                </div>
            </div>

            {/* Location Search Input (Collapsible) */}
            {isSearchingLocation && (
                <div
                    className="glass-card"
                    style={{
                        padding: '16px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '12px',
                        marginBottom: '20px',
                        animation: 'fadeIn 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        zIndex: 10
                    }}
                >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                        <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: '700' }}>Change Location</h3>
                        <button onClick={() => setIsSearchingLocation(false)} style={{ background: 'none', border: 'none', color: '#999' }}><X size={20} /></button>
                    </div>

                    <button
                        onClick={handleUseCurrentLocation}
                        style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                            background: 'linear-gradient(135deg, #E0F2F1 0%, #B2DFDB 100%)',
                            color: '#00796b',
                            padding: '12px', borderRadius: '12px', border: 'none',
                            fontWeight: '700', cursor: 'pointer', transition: 'transform 0.2s'
                        }}
                        onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.98)'}
                        onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    >
                        <MapPin size={18} /> Use Current Location
                    </button>

                    <div style={{ display: 'flex', gap: '8px' }}>
                        <div style={{ position: 'relative', flex: 1 }}>
                            <Search size={16} color="#999" style={{ position: 'absolute', left: '12px', top: '12px' }} />
                            <input
                                placeholder="Search city or area..."
                                value={locationQuery}
                                onChange={(e) => setLocationQuery(e.target.value)}
                                style={{
                                    width: '100%',
                                    border: '1px solid #eee',
                                    background: '#f9f9f9',
                                    padding: '10px 10px 10px 36px',
                                    borderRadius: '12px',
                                    fontSize: '0.95rem'
                                }}
                                onKeyDown={(e) => e.key === 'Enter' && handleLocationSearch()}
                            />
                        </div>
                        <button
                            onClick={handleLocationSearch}
                            style={{
                                background: 'var(--primary)',
                                color: 'white',
                                border: 'none',
                                padding: '10px 20px',
                                borderRadius: '12px',
                                fontWeight: '700',
                                boxShadow: '0 4px 12px rgba(226, 55, 68, 0.2)'
                            }}
                        >
                            Go
                        </button>
                    </div>

                    {activeLocation && (
                        <button
                            onClick={handleClearLocation}
                            style={{
                                marginTop: '4px',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                                background: 'white', color: '#666',
                                padding: '10px', borderRadius: '12px', border: '1px solid #eee',
                                fontSize: '0.9rem', fontWeight: '600'
                            }}
                        >
                            <X size={16} /> Clear Location Filter
                        </button>
                    )}
                </div>
            )}

            {/* Active Location Chip (Visible when filtering) */}
            {activeLocation && !isSearchingLocation && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '15px', animation: 'fadeIn 0.3s' }}>
                    <div
                        style={{
                            display: 'flex', alignItems: 'center', gap: '6px',
                            background: 'linear-gradient(135deg, #FF6B6B 0%, #E23744 100%)',
                            color: 'white', padding: '6px 14px', borderRadius: '20px',
                            fontSize: '0.85rem', fontWeight: '700',
                            boxShadow: '0 4px 12px rgba(226, 55, 68, 0.25)'
                        }}
                    >
                        <MapPin size={14} /> {locationName}
                        <button
                            onClick={handleClearLocation}
                            style={{
                                marginLeft: '4px', background: 'rgba(255,255,255,0.2)',
                                border: 'none', borderRadius: '50%', width: '18px', height: '18px',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                color: 'white', cursor: 'pointer'
                            }}
                        >
                            <X size={12} strokeWidth={3} />
                        </button>
                    </div>
                    <span style={{ fontSize: '0.8rem', color: '#999' }}>within 30km</span>
                </div>
            )}

            {/* Main Search Bar (Name) */}
            <div style={{ position: 'relative', marginBottom: '20px' }}>
                <Search style={{ position: 'absolute', left: '15px', top: '12px', color: '#999' }} size={20} />
                <input
                    type="text"
                    placeholder="Search dishes, restaurants..."
                    value={searchTerm}
                    onChange={(e) => handleSearchInput(e.target.value)}
                    style={{
                        width: '100%', padding: '12px 12px 12px 45px',
                        borderRadius: '12px', border: 'none',
                        background: 'white', boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
                        fontSize: '1rem'
                    }}
                />
            </div>

            {/* Nearby Pills */}
            <div className="hide-scrollbar" style={{ display: 'flex', gap: '10px', overflowX: 'auto', marginBottom: '20px' }}>
                {activeCategory !== 'All' && (
                    <button onClick={() => setActiveCategory('All')} style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '6px 12px', borderRadius: '20px', background: '#e23744', color: 'white', border: 'none' }}>
                        <X size={14} /> Clear
                    </button>
                )}
                {['Trending', 'Arabian', 'Burger', 'Cafes', ...nearbyAreas].map(tag => (
                    <button
                        key={tag}
                        onClick={() => {
                            if (tag === 'Trending') return; // Logic for trending sort?
                            setActiveCategory(tag === activeCategory ? 'All' : tag);
                        }}
                        style={{
                            padding: '8px 16px', borderRadius: '20px',
                            background: activeCategory === tag ? 'var(--e23744)' : 'white',
                            color: activeCategory === tag ? 'white' : '#555',
                            border: '1px solid #eee', whiteSpace: 'nowrap'
                        }}
                    >
                        {tag}
                    </button>
                ))}
            </div>

            {/* Content Grid */}
            {loading ? (
                <div style={{ textAlign: 'center', padding: '40px' }}>Searching...</div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                    {filteredSpots.length > 0 ? (
                        filteredSpots.map(spot => (
                            <SpotCard key={spot.id} spot={spot} />
                        ))
                    ) : (
                        <div style={{ textAlign: 'center', gridColumn: '1/-1', padding: '40px' }}>
                            <p style={{ color: '#888' }}>No spots found within 30km of {locationName}.</p>
                            <button onClick={() => setIsSearchingLocation(true)} style={{ color: 'var(--primary)', fontWeight: 'bold', background: 'none', border: 'none' }}>
                                Try changing location
                            </button>
                        </div>
                    )}
                </div>
            )}

            <style>{`
                @keyframes fadeIn { from { opacity: 0; transform: translateY(-5px); } to { opacity: 1; transform: translateY(0); } }
            `}</style>
        </div>
    );
};


export default Home;
