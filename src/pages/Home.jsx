import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import SpotCard from '../components/SpotCard';
import { Search, MapPin, Filter, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getDistanceFromLatLonInKm } from '../utils/mapUtils';
// Assuming mapUtils exists, if not I will inline the function or import from MapScreen logic if available.
// Actually safer to inline to avoid import errors if util file not verified.

const Home = ({ lang }) => {
    const { user } = useAuth();
    const [spots, setSpots] = useState([]);
    const [filteredSpots, setFilteredSpots] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    // Location State
    const [userLocation, setUserLocation] = useState(null); // { lat, lng }
    const [locationName, setLocationName] = useState('Locating...');
    const [isSearchingLocation, setIsSearchingLocation] = useState(false);
    const [locationQuery, setLocationQuery] = useState('');

    const [nearbyAreas, setNearbyAreas] = useState([]);
    const [activeCategory, setActiveCategory] = useState('All');

    // Check Streaks
    useEffect(() => {
        if (user) checkStreak();
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
    }, [userLocation]); // Re-fetch/filter when location changes

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

                setUserLocation({ lat: parseFloat(lat), lng: parseFloat(lon) });
                setLocationName(shortName);
                setSearchTerm(''); // Clear name search to show all spots in new area
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

            // 1. Filter by 30km Radius Logic
            if (userLocation) {
                const nearby = [];
                const areas = {};

                allSpots.forEach(spot => {
                    const dist = getDistanceFromLatLonInKm(userLocation.lat, userLocation.lng, spot.latitude, spot.longitude);
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

                // If searching a location specifically, maybe we want to restrict to "nearby" only?
                // Requirements: "Search location... show spots within 30 km".
                // So we REPLACE allSpots with nearbySpots?
                // Yes, otherwise the dashboard shows global spots.
                allSpots = nearby;
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


    return (
        <div style={{ padding: '20px', paddingBottom: '100px' }}>

            {/* Header: Location Search */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <div>
                    <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)' }}>Exploring</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }} onClick={() => setIsSearchingLocation(!isSearchingLocation)}>
                        <h2 style={{ margin: 0, fontSize: '1.4rem', color: 'var(--e23744)' }}>{locationName} <span style={{ fontSize: '0.8rem' }}>▼</span></h2>
                    </div>
                </div>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#eee', overflow: 'hidden' }}>
                    <img src={user?.user_metadata?.avatar_url || `https://ui-avatars.com/api/?name=${user?.email}`} style={{ width: '100%', height: '100%' }} />
                </div>
            </div>

            {/* Location Search Input (Collapsible) */}
            {isSearchingLocation && (
                <div className="glass-card" style={{ padding: '10px', display: 'flex', gap: '8px', marginBottom: '15px', animation: 'fadeIn 0.3s' }}>
                    <input
                        placeholder="Enter City (e.g. Kochi)"
                        value={locationQuery}
                        onChange={(e) => setLocationQuery(e.target.value)}
                        style={{ border: 'none', background: '#f5f5f5', padding: '8px 12px', borderRadius: '8px', flex: 1 }}
                        onKeyDown={(e) => e.key === 'Enter' && handleLocationSearch()}
                    />
                    <button onClick={handleLocationSearch} style={{ background: 'var(--primary)', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '8px' }}>
                        Go
                    </button>
                </div>
            )}

            {/* Main Search Bar (Name) */}
            <div style={{ position: 'relative', marginBottom: '20px' }}>
                <Search style={{ position: 'absolute', left: '15px', top: '12px', color: '#999' }} size={20} />
                <input
                    type="text"
                    placeholder="Search dishes, restaurants..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
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
