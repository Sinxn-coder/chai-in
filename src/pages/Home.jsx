import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import TopBar from '../components/TopBar';
import SpotCard from '../components/SpotCard';
import LoadingAnimation from '../components/LoadingAnimation';
import { Search, Sparkles, TrendingUp, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const getDistanceFromLatLonInKm = (lat1, lon1, lat2, lon2) => {
    if (!lat1 || !lon1 || !lat2 || !lon2) return 999;
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2 - lat1);
    var dLon = deg2rad(lon2 - lon1);
    var a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km
    return parseFloat(d.toFixed(1));
};

const deg2rad = (deg) => {
    return deg * (Math.PI / 180);
};

const Home = ({ lang }) => {
    const navigate = useNavigate();
    const [spots, setSpots] = useState([]);
    const [trendingSpots, setTrendingSpots] = useState([]);
    const [nearbyAreas, setNearbyAreas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeFilter, setActiveFilter] = useState('All');
    const [selectedArea, setSelectedArea] = useState(null);
    const [userLoc, setUserLoc] = useState(null);

    const { user } = useAuth();

    useEffect(() => {
        // Streak Logic
        if (user) checkStreak();

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const loc = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };
                    setUserLoc(loc);
                    // Fetch spots AFTER we have location to filter areas correctly
                    fetchSpots(loc);
                },
                (error) => {
                    console.error("Location access denied");
                    fetchSpots(null); // Fetch without location filtering
                }
            );
        } else {
            fetchSpots(null);
        }
    }, [user]);

    const checkStreak = async () => {
        const { data: prefs } = await supabase.from('user_preferences').select('streak_current, last_active_at').eq('user_id', user.id).single();

        if (prefs) {
            const lastActive = prefs.last_active_at ? new Date(prefs.last_active_at) : new Date(0);
            const today = new Date();
            const isSameDay = lastActive.toDateString() === today.toDateString();

            if (!isSameDay) {
                const yesterday = new Date();
                yesterday.setDate(yesterday.getDate() - 1);
                const isConsecutive = lastActive.toDateString() === yesterday.toDateString();

                const newStreak = isConsecutive ? (prefs.streak_current || 0) + 1 : 1;

                await supabase.from('user_preferences').update({
                    streak_current: newStreak,
                    last_active_at: new Date().toISOString()
                }).eq('user_id', user.id);

                if (isConsecutive) {
                    showToast(`🔥 Streak kept! ${newStreak} days in a row!`);
                } else if (prefs.streak_current > 0) {
                    showToast(`Streak reset. Start a new one today!`);
                }
            }
        }
    };

    const fetchSpots = async (location) => {
        setLoading(true);
        // Fetch verified spots
        const { data, error } = await supabase
            .from('spots')
            .select('*')
            .eq('is_verified', true)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching spots:', error);
        } else {
            setSpots(data || []);

            // Extract and analyze nearby areas from spot locations
            // STRICT REQUIREMENT: Only show areas within 30km if user location is available
            if (data && data.length > 0 && location) {
                const areaCount = {};

                data.forEach(spot => {
                    const dist = getDistanceFromLatLonInKm(location.lat, location.lng, spot.latitude, spot.longitude);

                    if (dist <= 30 && spot.location_text) {
                        const parts = spot.location_text.split(',');
                        if (parts.length > 0) {
                            const area = parts[0].trim();
                            if (area.length < 30 && area.length > 2) {
                                areaCount[area] = (areaCount[area] || 0) + 1;
                            }
                        }
                    }
                });

                const topAreas = Object.entries(areaCount)
                    .sort((a, b) => b[1] - a[1])
                    .slice(0, 5)
                    .map(([area]) => area);

                setNearbyAreas(topAreas);
            } else {
                setNearbyAreas([]); // Don't show areas if no location or no spots nearby
            }
        }

        setLoading(false);
        fetchTrendingSpots();
    };

    const fetchTrendingSpots = async () => {
        try {
            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

            const { data: recentReviews } = await supabase
                .from('reviews')
                .select('spot_id')
                .gte('created_at', sevenDaysAgo.toISOString());

            if (recentReviews && recentReviews.length > 0) {
                // Count reviews per spot
                const reviewCounts = {};
                recentReviews.forEach(review => {
                    reviewCounts[review.spot_id] = (reviewCounts[review.spot_id] || 0) + 1;
                });

                // Get top 5 trending spot IDs
                const trendingIds = Object.entries(reviewCounts)
                    .sort((a, b) => b[1] - a[1])
                    .slice(0, 5)
                    .map(([id]) => id);

                // Fetch full spot data for trending
                if (trendingIds.length > 0) {
                    const { data: trending } = await supabase
                        .from('spots')
                        .select('*')
                        .in('id', trendingIds)
                        .eq('is_verified', true);

                    setTrendingSpots(trending || []);
                }
            }
        } catch (error) {
            console.error('Error fetching trending:', error);
            // Don't show error to user, trending is optional
        }
    };

    const surpriseMe = () => {
        if (filteredSpots.length === 0) return;
        const randomSpot = filteredSpots[Math.floor(Math.random() * filteredSpots.length)];
        navigate(`/${lang}/spot/${randomSpot.id}`);
    };

    const filteredSpots = spots.map(spot => {
        // Calculate dynamic distance
        const dist = userLoc
            ? getDistanceFromLatLonInKm(userLoc.lat, userLoc.lng, spot.latitude, spot.longitude)
            : (spot.distance || 0);
        return { ...spot, distance: dist };
    })
        .filter(spot => {
            const matchesSearch = spot.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (spot.tags && spot.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())));

            const matchesArea = !selectedArea ||
                (spot.location_text && spot.location_text.toLowerCase().includes(selectedArea.toLowerCase()));

            if (activeFilter === 'All') return matchesSearch && matchesArea;
            return matchesSearch && matchesArea && spot.tags && spot.tags.some(tag => tag.toLowerCase() === activeFilter.toLowerCase());
        })
        .sort((a, b) => a.distance - b.distance); // Sort by nearest

    return (
        <div style={{ paddingBottom: '90px' }}>
            <TopBar location={userLoc ? "Current Location" : "Kochi, Kerala"} />

            {/* Search Bar */}
            <div style={{ padding: '0 var(--space-md) var(--space-md)' }}>
                <div className="glass-card" style={{
                    padding: '12px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    background: 'white'
                }}>
                    <Search size={20} color="var(--primary)" />
                    <input
                        type="text"
                        placeholder={lang === 'en' ? "Search for biriyani, cafes..." : "ബിരിയാണി, കഫേ, തിരയുക..."}
                        value={searchTerm}
                        onChange={(e) => {
                            const val = e.target.value;
                            setSearchTerm(val);
                            if (val === '#admin') {
                                const pwd = prompt("Enter Admin Password:");
                                if (pwd === 'Sinu@12345') {
                                    navigate(`/${lang}/admin`);
                                } else if (pwd !== null) {
                                    alert("Wrong Password!");
                                }
                            }
                        }}
                        style={{
                            border: 'none',
                            outline: 'none',
                            width: '100%',
                            fontSize: '1rem',
                            color: 'var(--text-main)',
                            background: 'transparent'
                        }}
                    />
                </div>
            </div>

            {/* Filters */}
            <div className="hide-scrollbar" style={{
                display: 'flex',
                gap: '10px',
                padding: '0 var(--space-md) var(--space-md)',
                overflowX: 'auto',
                whiteSpace: 'nowrap'
            }}>
                {['All', 'Cafe', 'Restaurant', 'Fast Food', 'Veg'].map((filter, i) => (
                    <button key={i} onClick={() => setActiveFilter(filter)} style={{
                        padding: '8px 18px',
                        borderRadius: 'var(--radius-full)',
                        background: activeFilter === filter ? 'var(--primary)' : 'rgba(255,255,255,0.8)',
                        color: activeFilter === filter ? 'white' : 'var(--text-muted)',
                        border: activeFilter === filter ? 'none' : '1px solid rgba(0,0,0,0.05)',
                        fontSize: '0.9rem',
                        fontWeight: '600',
                        boxShadow: 'var(--shadow-sm)',
                        transition: 'all 0.2s ease'
                    }}>
                        {filter}
                    </button>
                ))}
            </div>

            {/* Surprise Me Button */}
            <div style={{ padding: '0 var(--space-md) var(--space-md)' }}>
                <button
                    onClick={surpriseMe}
                    disabled={filteredSpots.length === 0}
                    style={{
                        width: '100%',
                        padding: '14px',
                        background: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '12px',
                        fontSize: '1rem',
                        fontWeight: '700',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        boxShadow: '0 4px 12px rgba(255, 107, 53, 0.3)',
                        cursor: filteredSpots.length === 0 ? 'not-allowed' : 'pointer',
                        opacity: filteredSpots.length === 0 ? 0.5 : 1,
                        transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                        if (filteredSpots.length > 0) {
                            e.target.style.transform = 'translateY(-2px)';
                            e.target.style.boxShadow = '0 6px 16px rgba(255, 107, 53, 0.4)';
                        }
                    }}
                    onMouseLeave={(e) => {
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = '0 4px 12px rgba(255, 107, 53, 0.3)';
                    }}
                >
                    <Sparkles size={20} />
                    Surprise Me!
                </button>
            </div>

            {/* Trending This Week */}
            {trendingSpots.length > 0 && (
                <div style={{ padding: '0 var(--space-md) var(--space-md)' }}>
                    <h3 style={{
                        fontSize: '1.2rem',
                        fontWeight: '700',
                        marginBottom: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                    }}>
                        <TrendingUp size={20} color="var(--primary)" />
                        Trending This Week 🔥
                    </h3>
                    <div className="hide-scrollbar" style={{
                        display: 'flex',
                        gap: '12px',
                        overflowX: 'auto',
                        paddingBottom: '8px'
                    }}>
                        {trendingSpots.map(spot => (
                            <div
                                key={spot.id}
                                onClick={() => navigate(`/${lang}/spot/${spot.id}`)}
                                style={{
                                    minWidth: '200px',
                                    borderRadius: '12px',
                                    overflow: 'hidden',
                                    boxShadow: 'var(--shadow-md)',
                                    cursor: 'pointer',
                                    transition: 'transform 0.2s ease'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                            >
                                <img
                                    src={spot.images?.[0] || 'https://via.placeholder.com/200x120'}
                                    alt={spot.name}
                                    style={{ width: '100%', height: '120px', objectFit: 'cover' }}
                                />
                                <div style={{ padding: '12px', background: 'white' }}>
                                    <h4 style={{ fontSize: '0.9rem', fontWeight: '600', margin: '0 0 4px 0' }}>
                                        {spot.name}
                                    </h4>
                                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>
                                        ⭐ {spot.rating || 4.5} • {spot.reviews_count || 0} reviews
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Nearby Areas */}
            <div style={{ padding: '0 var(--space-md) var(--space-md)' }}>
                <h3 style={{
                    fontSize: '1.2rem',
                    fontWeight: '700',
                    marginBottom: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                }}>
                    <MapPin size={20} color="var(--primary)" />
                    Nearby Areas
                </h3>
                <div className="hide-scrollbar" style={{
                    display: 'flex',
                    gap: '8px',
                    overflowX: 'auto',
                    paddingBottom: '8px'
                }}>
                    <button
                        onClick={() => setSelectedArea(null)}
                        style={{
                            padding: '8px 16px',
                            borderRadius: '20px',
                            background: !selectedArea ? 'var(--primary)' : 'white',
                            color: !selectedArea ? 'white' : 'var(--text-muted)',
                            border: !selectedArea ? 'none' : '1px solid #ddd',
                            fontSize: '0.85rem',
                            fontWeight: '600',
                            whiteSpace: 'nowrap',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease'
                        }}
                    >
                        All Areas
                    </button>
                    {nearbyAreas.map((area, i) => (
                        <button
                            key={i}
                            onClick={() => setSelectedArea(area)}
                            style={{
                                padding: '8px 16px',
                                borderRadius: '20px',
                                background: selectedArea === area ? 'var(--primary)' : 'white',
                                color: selectedArea === area ? 'white' : 'var(--text-muted)',
                                border: selectedArea === area ? 'none' : '1px solid #ddd',
                                fontSize: '0.85rem',
                                fontWeight: '600',
                                whiteSpace: 'nowrap',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease'
                            }}
                        >
                            {area}
                        </button>
                    ))}
                </div>
            </div>

            {/* Feed */}
            <div className="container" style={{ padding: '0 var(--space-md)' }}>
                <h2 className="animate-fade-in" style={{
                    marginBottom: 'var(--space-md)',
                    fontSize: '1.4rem',
                    fontWeight: '800',
                    color: 'var(--text-main)',
                    opacity: 0,
                    animationDelay: '0s'
                }}>
                    {lang === 'en' ? 'Fresh Drops 🔥' : 'പുതിയ സ്പോട്ടുകൾ 🔥'}
                </h2>

                {loading ? (
                    <LoadingAnimation />
                ) : filteredSpots.length > 0 ? (
                    <div className="spots-grid">
                        {filteredSpots.map(spot => (
                            <SpotCard key={spot.id} spot={spot} />
                        ))}
                    </div>
                ) : (
                    <div className="animate-fade-in" style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
                        <p>No spots found.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Home;
