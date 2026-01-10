import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabaseClient';
import SpotCard from '../components/SpotCard';
import { Search, MapPin, TrendingUp, Clock } from 'lucide-react';
import Toast from '../components/Toast';

const Explore = ({ lang }) => {
    const navigate = useNavigate();
    const [spots, setSpots] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [trendingSpots, setTrendingSpots] = useState([]);
    const [mostVisited, setMostVisited] = useState([]);
    const [toast, setToast] = useState(null);
    const [activeLocation, setActiveLocation] = useState(null);
    const [locationName, setLocationName] = useState('All Kerala');
    const [showLocationSearch, setShowLocationSearch] = useState(false);
    const [locationSearchTerm, setLocationSearchTerm] = useState('');
    const [searchingLocation, setSearchingLocation] = useState(false);

    useEffect(() => {
        fetchSpots();
        fetchTrendingSpots();
        fetchMostVisited();
    }, [activeLocation]);

    const fetchSpots = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('spots')
            .select('*')
            .eq('is_verified', true)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching spots:', error);
            setToast({ message: 'Failed to load spots', type: 'error' });
        } else {
            let all = data || [];
            if (activeLocation) {
                all = all.filter(s => {
                    const distance = getDistanceFromLatLonInKm(activeLocation.lat, activeLocation.lng, s.latitude, s.longitude);
                    return distance <= 30;
                });
            }
            setSpots(all);
        }
        setLoading(false);
    };

    const fetchTrendingSpots = async () => {
        // Simple trending logic: spots created in last7 days
        const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        
        const { data } = await supabase
            .from('spots')
            .select('*')
            .eq('is_verified', true)
            .gte('created_at', sevenDaysAgo.toISOString())
            .order('created_at', { ascending: false })
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

    // Remove the old handleSearch function - we'll use real-time filtering instead

    const filteredSpots = useMemo(() => {
        if (!searchTerm.trim() || searchTerm.trim().length < 2) {
            return spots;
        }
        
        const searchLower = searchTerm.toLowerCase().trim();
        
        const filtered = spots.filter(s => {
            // Search by name
            const nameMatch = s.name && s.name.toLowerCase().includes(searchLower);
            
            // Search by location
            const locationMatch = s.location && s.location.toLowerCase().includes(searchLower);
            
            // Search by tags (more strict matching)
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
                    
                    // More strict matching - require at least 2 characters or exact match
                    const matches = 
                        (searchLower.length >= 2 && tagLower.includes(searchLower)) ||
                        (searchWithoutSpaces.length >= 2 && tagWithoutSpaces.includes(searchWithoutSpaces)) ||
                        (searchWithHyphens.length >= 2 && tagWithHyphens.includes(searchWithHyphens)) ||
                        (searchLower.length >= 2 && tagWithoutHyphens.includes(searchLower)) ||
                        (searchLower.length >= 2 && searchLower.includes(tagLower)) ||
                        (searchWithoutSpaces.length >= 2 && searchWithoutSpaces.includes(tagWithoutSpaces)) ||
                        (searchWithHyphens.length >= 2 && searchWithHyphens.includes(tagWithHyphens));
                    
                    return matches;
                });
            }
            
            return nameMatch || locationMatch || tagMatch;
        });
        
        return filtered;
    }, [spots, searchTerm]);

    function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
        var R = 6371; // Radius of earth in km
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
                setActiveLocation(location);
                setLocationName(location.name);
                setShowLocationSearch(false);
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
        fetchSpots();
    };

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-cream)', padding: '20px' }}>
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                style={{ 
                    textAlign: 'center', 
                    marginBottom: '30px' 
                }}
            >
                {!searchTerm.trim() ? (
                    <>
                        <h1 style={{ 
                            fontSize: '2rem', 
                            fontWeight: '900', 
                            color: 'var(--primary)', 
                            marginBottom: '10px' 
                        }}>
                            Explore All Spots
                        </h1>
                        <p style={{ 
                            color: 'var(--text-muted)', 
                            fontSize: '1rem' 
                        }}>
                            Discover amazing food spots across Kerala
                        </p>
                    </>
                ) : (
                    <>
                        <h1 style={{ 
                            fontSize: '2rem', 
                            fontWeight: '900', 
                            color: 'var(--primary)', 
                            marginBottom: '10px' 
                        }}>
                            {activeLocation ? `Spots near ${locationName}` : 'Search Results'}
                        </h1>
                        <p style={{ 
                            color: 'var(--text-muted)', 
                            fontSize: '1rem' 
                        }}>
                            {activeLocation 
                                ? `Showing ${filteredSpots.length} spots within 30km of ${locationName}`
                                : `Showing ${filteredSpots.length} spots for "${searchTerm}"`
                            }
                        </p>
                    </>
                )}
            </motion.div>

            {/* Location Search Section */}
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
                
                {showLocationSearch && (
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
                )}
            </div>

            {/* Search Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                style={{ 
                    background: 'white', 
                    padding: '20px', 
                    borderRadius: '20px', 
                    boxShadow: 'var(--shadow-md)', 
                    marginBottom: '30px' 
                }}
            >
                <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                    <div style={{ flex: 1, position: 'relative' }}>
                        <Search size={20} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                        <input
                            type="text"
                            placeholder="Search dishes, restaurants, tags, locations..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '12px 12px 12px 40px',
                                borderRadius: '16px',
                                border: '2px solid var(--secondary)',
                                background: 'var(--bg-cream)',
                                fontSize: '1rem',
                                outline: 'none'
                            }}
                        />
                    </div>
                </div>
                {searchTerm.trim() && searchTerm.trim().length >= 2 && (
                    <div style={{ 
                        fontSize: '0.9rem', 
                        color: 'var(--text-muted)', 
                        marginTop: '8px',
                        fontStyle: 'italic'
                    }}>
                        Found {filteredSpots.length} results for "{searchTerm}"
                    </div>
                )}
            </motion.div>

            {/* All Spots */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
            >
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '40px' }}>
                        <div style={{ fontSize: '1.1rem', color: 'var(--text-muted)' }}>Loading spots...</div>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                        {filteredSpots.map(spot => (
                            <SpotCard key={spot.id} spot={spot} lang={lang} />
                        ))}
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default Explore;
