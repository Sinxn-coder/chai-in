import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';
import SpotCard from '../components/SpotCard';
import { Search, MapPin, X, TrendingUp, Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import FoodLoader from '../components/FoodLoader';

const Home = ({ lang }) => {
    const navigate = useNavigate();
    const { user } = useAuth();

    const [spots, setSpots] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeLocation, setActiveLocation] = useState(null);
    const [locationName, setLocationName] = useState('All Kerala');
    const [showLocationSearch, setShowLocationSearch] = useState(false);
    const [locationSearchTerm, setLocationSearchTerm] = useState('');
    const [searchingLocation, setSearchingLocation] = useState(false);
    const [trendingSpots, setTrendingSpots] = useState([]);
    const [mostVisited, setMostVisited] = useState([]);

    useEffect(() => {
        fetchSpots();
        fetchTrendingSpots();
        fetchMostVisited();
        
        // Set up real-time subscription for spots
        const spotsSubscription = supabase
            .channel('home_spots_changes')
            .on('postgres_changes', 
                { event: 'UPDATE', schema: 'public', table: 'spots', filter: 'is_verified=eq.true' },
                (payload) => {
                    console.log('Home page received real-time update:', payload);
                    if (payload.new.is_verified) {
                        fetchSpots(); // Refresh spots when a spot is verified
                        fetchTrendingSpots(); // Refresh trending spots
                        fetchMostVisited(); // Refresh most visited spots
                    }
                }
            )
            .subscribe();
            
        // Set up real-time subscription for rating changes
        const ratingsSubscription = supabase
            .channel('home_ratings_changes')
            .on('postgres_changes',
                { event: '*', schema: 'public', table: 'spot_ratings' },
                (payload) => {
                    console.log('Home page received rating change:', payload);
                    fetchSpots(); // Refresh spots to update ratings
                    fetchTrendingSpots(); // Refresh trending spots
                    fetchMostVisited(); // Refresh most visited spots
                }
            )
            .subscribe();
            
        // Listen for custom verification events from admin
        const handleSpotVerified = (event) => {
            console.log('Home page received custom verification event:', event.detail);
            fetchSpots(); // Refresh when admin verifies a spot
        };
        
        window.addEventListener('spotVerified', handleSpotVerified);
            
        return () => {
            spotsSubscription.unsubscribe();
            ratingsSubscription.unsubscribe();
            window.removeEventListener('spotVerified', handleSpotVerified);
        };
    }, [activeLocation]);

    const fetchTrendingSpots = async () => {
        // Simple trending logic: spots with most reviews in last 7 days
        const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        
        const { data } = await supabase
            .from('spots')
            .select('*, reviews(count)')
            .eq('is_verified', true)
            .gte('created_at', sevenDaysAgo.toISOString())
            .order('reviews.count', { ascending: false })
            .limit(5);

        setTrendingSpots(data || []);
    };

    const fetchMostVisited = async () => {
        // This would require a visits table - for now, show recently added spots
        const { data } = await supabase
            .from('spots')
            .select('*')
            .eq('is_verified', true)
            .order('created_at', { ascending: false })
            .limit(5);

        setMostVisited(data || []);
    };

    const fetchSpots = async () => {
        setLoading(true);
        const { data, error } = await supabase.from('spots').select('*').eq('is_verified', true).order('created_at', { ascending: false });
        if (error) {
            console.error('Error fetching spots:', error);
        } else {
            console.log('Total spots fetched:', data?.length || 0);
            // Log sample spots with tags
            if (data && data.length > 0) {
                console.log('Sample spots data:');
                data.slice(0, 3).forEach((spot, index) => {
                    console.log(`Spot ${index + 1}:`, {
                        name: spot.name,
                        tags: spot.tags,
                        location: spot.location
                    });
                });
            }
            let all = data || [];
            if (activeLocation) {
                console.log('Active location:', activeLocation);
                console.log('Filtering spots within 30km...');
                all = all.filter(s => {
                    const distance = getDistanceFromLatLonInKm(activeLocation.lat, activeLocation.lng, s.latitude, s.longitude);
                    console.log(`Spot: ${s.name} (${s.latitude}, ${s.longitude}) - Distance: ${distance.toFixed(2)}km`);
                    return distance <= 30;
                });
                console.log('Spots within 30km:', all.length);
            }
            setSpots(all);
        }
        setLoading(false);
    };

    const filteredSpots = useMemo(() => {
        console.log('Filtering spots with search term:', searchTerm);
        console.log('Total spots before filtering:', spots.length);
        
        if (!searchTerm.trim()) {
            console.log('No search term, returning all spots');
            return spots;
        }
        
        const searchLower = searchTerm.toLowerCase().trim();
        console.log('Search term processed:', searchLower);
        
        const filtered = spots.filter(s => {
            // Search by name
            const nameMatch = s.name && s.name.toLowerCase().includes(searchLower);
            
            // Search by location
            const locationMatch = s.location && s.location.toLowerCase().includes(searchLower);
            
            // Search by tags
            let tagMatch = false;
            if (s.tags && Array.isArray(s.tags) && s.tags.length > 0) {
                tagMatch = s.tags.some(tag => {
                    if (!tag) return false;
                    
                    const tagLower = tag.toLowerCase();
                    const tagWithoutSpaces = tagLower.replace(/\s+/g, '');
                    const tagWithHyphens = tagLower.replace(/\s+/g, '-');
                    const tagWithoutHyphens = tagLower.replace(/-/g, '');
                    
                    const searchWithoutSpaces = searchLower.replace(/\s+/g, '');
                    const searchWithHyphens = searchLower.replace(/\s+/g, '-');
                    
                    // Multiple matching strategies
                    const matches = 
                        tagLower.includes(searchLower) ||
                        tagWithoutSpaces.includes(searchWithoutSpaces) ||
                        tagWithHyphens.includes(searchWithHyphens) ||
                        tagWithoutHyphens.includes(searchWithoutSpaces) ||
                        searchLower.includes(tagLower) ||
                        searchWithoutSpaces.includes(tagWithoutSpaces) ||
                        searchWithHyphens.includes(tagWithHyphens);
                    
                    if (matches) {
                        console.log(`Tag match: "${tag}" matches "${searchTerm}"`);
                    }
                    
                    return matches;
                });
            }
            
            const matches = nameMatch || locationMatch || tagMatch;
            if (matches) {
                console.log(`Spot matched: "${s.name}" - Name: ${nameMatch}, Location: ${locationMatch}, Tags: ${tagMatch}`);
                console.log('Spot details:', { name: s.name, tags: s.tags, location: s.location });
            }
            
            return matches;
        });
        
        console.log('Filtered spots count:', filtered.length);
        return filtered;
    }, [spots, searchTerm]);

    function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
        var R = 6371; // Radius of the earth in km
        var dLat = (lat2 - lat1) * Math.PI / 180;  // deg2rad below
        var dLon = (lon2 - lon1) * Math.PI / 180;
        var a = 
            Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
            Math.sin(dLon/2) * Math.sin(dLon/2)
        ; 
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
        var d = R * c; // Distance in km
        return d;
    }

    const searchLocation = async () => {
        if (!locationSearchTerm.trim()) return;
        
        setSearchingLocation(true);
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(locationSearchTerm + ', Kerala, India')}&limit=1`);
            const data = await response.json();
            
            if (data && data.length > 0) {
                const location = {
                    lat: parseFloat(data[0].lat),
                    lng: parseFloat(data[0].lon),
                    name: data[0].display_name.split(',')[0]
                };
                console.log('Location found:', location);
                setActiveLocation(location);
                setLocationName(location.name);
                setShowLocationSearch(false);
                // Don't clear search term so clear button appears
                // Manually trigger fetchSpots to ensure filtering happens
                fetchSpots();
            } else {
                console.log('No location found for:', locationSearchTerm);
            }
        } catch (error) {
            console.error('Error searching location:', error);
        } finally {
            setSearchingLocation(false);
        }
    };

    const resetToAllKerala = () => {
        setActiveLocation(null);
        setLocationName('All Kerala');
        setLocationSearchTerm('');
    };

    return (
        <div style={{ paddingBottom: '100px', background: 'var(--bg-main)', minHeight: '100vh' }}>
            <div className="container" style={{ padding: '0 16px', maxWidth: '100%', boxSizing: 'border-box' }}>
                <header style={{ marginBottom: '24px' }}>
                    <p style={{ margin: 0, fontSize: '1rem', color: 'var(--text-muted)' }}>Hello {user?.user_metadata?.full_name?.split(' ')[0] || 'Foodie'},</p>
                    <h1 style={{ margin: '4px 0', fontSize: '1.6rem', fontWeight: '900', color: 'var(--text-main)' }}>What do you want to eat today?</h1>
                </header>

                <div style={{ position: 'relative', marginBottom: '24px' }}>
                    <input
                        type="text"
                        placeholder="Search dishes, restaurants..."
                        value={searchTerm}
                        onChange={(e) => {
                            const value = e.target.value;
                            if (value === '#admin') {
                                navigate(`/${lang}/admin`);
                                setSearchTerm('');
                            } else {
                                setSearchTerm(value);
                            }
                        }}
                        style={{
                            width: '100%',
                            padding: '16px 20px 16px 50px',
                            borderRadius: 'var(--radius-lg)',
                            border: 'none',
                            background: 'var(--secondary)',
                            fontSize: '1rem',
                            fontWeight: '600'
                        }}
                    />
                    <Search size={22} color="var(--text-muted)" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowLocationSearch(!showLocationSearch)}
                        style={{
                            background: 'rgba(239, 42, 57, 0.1)',
                            color: 'var(--primary)',
                            padding: '8px 16px',
                            borderRadius: '12px',
                            fontSize: '0.85rem',
                            fontWeight: '800',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            border: 'none',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            flexShrink: 0
                        }}
                    >
                        <MapPin size={16} /> {locationName}
                    </motion.button>
                    
                    <div style={{ flex: 1, minWidth: '200px' }}>
                        <div style={{ position: 'relative' }}>
                            <input
                                type="text"
                                placeholder="Search location in Kerala..."
                                value={locationSearchTerm}
                                onChange={(e) => setLocationSearchTerm(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && searchLocation()}
                                style={{
                                    width: '100%',
                                    padding: '0 70px 0 45px',
                                    borderRadius: '25px',
                                    border: '2px solid var(--primary)',
                                    background: 'var(--bg-white)',
                                    fontSize: '0.85rem',
                                    fontWeight: '600',
                                    boxShadow: '0 4px 15px rgba(239, 42, 57, 0.15)',
                                    transition: 'all 0.3s ease',
                                    boxSizing: 'border-box',
                                    lineHeight: '44px'
                                }}
                            />
                            <Search size={20} color="var(--primary)" style={{ position: 'absolute', left: '15px', top: '12px', zIndex: 2 }} />
                            <motion.button
                                whileTap={{ scale: 0.95 }}
                                onClick={searchLocation}
                                disabled={searchingLocation}
                                style={{
                                    position: 'absolute',
                                    right: '8px',
                                    top: '7px',
                                    background: 'var(--primary)',
                                    color: 'white',
                                    border: 'none',
                                    padding: '8px 16px',
                                    borderRadius: '20px',
                                    fontSize: '0.75rem',
                                    fontWeight: '700',
                                    cursor: searchingLocation ? 'not-allowed' : 'pointer',
                                    opacity: searchingLocation ? 0.6 : 1,
                                    boxShadow: '0 2px 8px rgba(239, 42, 57, 0.3)',
                                    zIndex: 2,
                                    height: '30px'
                                }}
                            >
                                {searchingLocation ? '...' : 'Go'}
                            </motion.button>
                            {locationSearchTerm && (
                                <motion.button
                                    whileTap={{ scale: 0.95 }}
                                    onClick={resetToAllKerala}
                                    style={{
                                        position: 'absolute',
                                        right: '70px',
                                        top: '7px',
                                        background: 'transparent',
                                        color: '#6b7280',
                                        border: 'none',
                                        padding: '8px',
                                        borderRadius: '20px',
                                        fontSize: '0.75rem',
                                        fontWeight: '700',
                                        cursor: 'pointer',
                                        zIndex: 2,
                                        height: '30px'
                                    }}
                                >
                                    <X size={16} />
                                </motion.button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Trending Spots Section */}
                {trendingSpots.length > 0 && !activeLocation && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        style={{ marginBottom: '30px' }}
                    >
                        <div style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '12px', 
                            marginBottom: '16px' 
                        }}>
                            <TrendingUp size={24} color="var(--primary)" />
                            <h3 style={{ 
                                fontSize: '1.3rem', 
                                fontWeight: '800', 
                                color: 'var(--text-main)' 
                            }}>
                                Trending This Week
                            </h3>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
                            {trendingSpots.map(spot => (
                                <SpotCard key={spot.id} spot={spot} />
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* Most Visited Section */}
                {mostVisited.length > 0 && !activeLocation && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.6 }}
                        style={{ marginBottom: '30px' }}
                    >
                        <div style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '12px', 
                            marginBottom: '16px' 
                        }}>
                            <Clock size={24} color="var(--primary)" />
                            <h3 style={{ 
                                fontSize: '1.3rem', 
                                fontWeight: '800', 
                                color: 'var(--text-main)' 
                            }}>
                                Popular Spots
                            </h3>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
                            {mostVisited.map(spot => (
                                <SpotCard key={spot.id} spot={spot} />
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* All Spots Section */}
                {loading ? (
                    <FoodLoader />
                ) : filteredSpots.length > 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.8 }}
                    >
                        {!activeLocation && (
                            <div style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: '12px', 
                                marginBottom: '16px' 
                            }}>
                                <Search size={24} color="var(--primary)" />
                                <h3 style={{ 
                                    fontSize: '1.3rem', 
                                    fontWeight: '800', 
                                    color: 'var(--text-main)' 
                                }}>
                                    All Spots
                                </h3>
                            </div>
                        )}
                        {activeLocation && (
                            <div style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: '12px', 
                                marginBottom: '16px' 
                            }}>
                                <MapPin size={24} color="var(--primary)" />
                                <h3 style={{ 
                                    fontSize: '1.3rem', 
                                    fontWeight: '800', 
                                    color: 'var(--text-main)' 
                                }}>
                                    Spots within 30km of {locationName}
                                </h3>
                            </div>
                        )}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
                            {filteredSpots.map(spot => (
                                <SpotCard key={spot.id} spot={spot} />
                            ))}
                        </div>
                    </motion.div>
                ) : !loading && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        style={{ textAlign: 'center', padding: '60px 20px' }}
                    >
                        <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
                            {activeLocation 
                                ? `No spots found within 30km of ${locationName}` 
                                : 'No spots found matching your search'}
                        </p>
                        {activeLocation && (
                            <motion.button
                                whileTap={{ scale: 0.95 }}
                                onClick={resetToAllKerala}
                                style={{
                                    background: 'var(--primary)',
                                    color: 'white',
                                    padding: '12px 24px',
                                    borderRadius: '12px',
                                    border: 'none',
                                    fontSize: '0.9rem',
                                    fontWeight: '600',
                                    cursor: 'pointer'
                                }}
                            >
                                Show All Kerala Spots
                            </motion.button>
                        )}
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default Home;
