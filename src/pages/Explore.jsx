import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabaseClient';
import SpotCard from '../components/SpotCard';
import SkeletonLoader from '../components/SkeletonLoader';
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
    const [detectedLocation, setDetectedLocation] = useState(null);
    const [locationCache, setLocationCache] = useState({});
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
    const [locationSuggestions, setLocationSuggestions] = useState([]);
    const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);

    // Debounce search term to reduce API calls
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
        }, 300); // 300ms delay

        return () => clearTimeout(timer);
    }, [searchTerm]);

    useEffect(() => {
        // Fetch all data in parallel for faster loading
        const fetchAllData = async () => {
            setLoading(true);
            try {
                await Promise.all([
                    fetchSpots(),
                    fetchTrendingSpots(),
                    fetchMostVisited()
                ]);
            } finally {
                setLoading(false);
            }
        };
        
        fetchAllData();
    }, []);

    // Effect to fetch location suggestions
    useEffect(() => {
        const fetchSuggestions = async () => {
            if (searchTerm.trim() && searchTerm.trim().length >= 2) {
                const suggestions = await getLocationSuggestions(searchTerm);
                setLocationSuggestions(suggestions);
                setShowLocationSuggestions(suggestions.length > 0);
            } else {
                setLocationSuggestions([]);
                setShowLocationSuggestions(false);
            }
        };
        
        fetchSuggestions();
    }, [searchTerm]);

    // Effect to detect location when debounced search term changes
    useEffect(() => {
        const detectLocation = async () => {
            if (debouncedSearchTerm.trim() && debouncedSearchTerm.trim().length >= 2) {
                // Check cache first
                if (locationCache[debouncedSearchTerm.toLowerCase()]) {
                    setDetectedLocation(locationCache[debouncedSearchTerm.toLowerCase()]);
                    return;
                }

                setSearchingLocation(true);
                const location = await getLocationCoordinates(debouncedSearchTerm);
                setDetectedLocation(location);
                
                // Cache the result
                if (location) {
                    setLocationCache(prev => ({
                        ...prev,
                        [debouncedSearchTerm.toLowerCase()]: location
                    }));
                }
                setSearchingLocation(false);
            } else {
                setDetectedLocation(null);
            }
        };
        
        detectLocation();
    }, [debouncedSearchTerm, locationCache]);

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
            setSpots(data || []);
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

    function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
        var R = 6371; // Radius of earth in km
        var dLat = (lat2 - lat1) * Math.PI / 180;  // deg2rad below
        var dLon = (lon2 - lon1) * Math.PI / 180;
        var a = 
            Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
            Math.sin(dLon/2) * Math.sin(dLon/2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        var d = R * c; // Distance in km
        return d;
    }

    // Function to get location suggestions for autocomplete
    const getLocationSuggestions = async (query) => {
        if (!query || query.length < 2) return [];
        
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query + ', Kerala, India')}&limit=5&addressdetails=1`);
            const data = await response.json();
            
            if (data && data.length > 0) {
                return data.map(item => ({
                    display_name: item.display_name,
                    lat: parseFloat(item.lat),
                    lng: parseFloat(item.lon),
                    name: item.display_name.split(',')[0].trim()
                }));
            }
        } catch (error) {
            console.error('Error getting location suggestions:', error);
        }
        return [];
    };

    // Function to detect if search term is a location and get coordinates
    const getLocationCoordinates = async (locationName) => {
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(locationName + ', Kerala, India')}&limit=1`);
            const data = await response.json();
            if (data && data.length > 0) {
                return {
                    lat: parseFloat(data[0].lat),
                    lng: parseFloat(data[0].lon)
                };
            }
        } catch (error) {
            console.error('Error getting location coordinates:', error);
        }
        return null;
    };

    // Enhanced search logic with location detection
    const filteredSpots = useMemo(() => {
        if (!debouncedSearchTerm.trim() || debouncedSearchTerm.trim().length < 2) {
            return spots;
        }
        
        const searchLower = debouncedSearchTerm.toLowerCase().trim();
        
        // If location is detected, filter by distance
        if (detectedLocation) {
            const locationFiltered = spots.filter(s => {
                const distance = getDistanceFromLatLonInKm(s.latitude, s.longitude, detectedLocation.lat, detectedLocation.lng);
                return distance <= 30; // Filter spots within 30km radius
            });
            return locationFiltered;
        } else {
            // Regular search by name, location, and tags
            const normalFiltered = spots.filter(s => {
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
            
            return normalFiltered;
        }
    }, [spots, debouncedSearchTerm, detectedLocation]);

    // Handle location suggestion selection
    const handleLocationSelect = (location) => {
        setDetectedLocation(location);
        setSearchTerm(location.name);
        setShowLocationSuggestions(false);
        setLocationSuggestions([]);
        
        // Cache the selected location
        setLocationCache(prev => ({
            ...prev,
            [location.name.toLowerCase()]: location
        }));
    };

    // Handle input focus
    const handleInputFocus = () => {
        if (searchTerm.trim() && searchTerm.trim().length >= 2 && locationSuggestions.length > 0) {
            setShowLocationSuggestions(true);
        }
    };

    // Handle input blur
    const handleInputBlur = () => {
        // Delay hiding suggestions to allow click events
        setTimeout(() => {
            setShowLocationSuggestions(false);
        }, 200);
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
                {!debouncedSearchTerm.trim() ? (
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
                            {detectedLocation ? 'Nearby Spots' : 'Search Results'}
                        </h1>
                        <p style={{ 
                            color: 'var(--text-muted)', 
                            fontSize: '1rem' 
                        }}>
                            {detectedLocation 
                                ? `Showing ${filteredSpots.length} spots within 30km of "${debouncedSearchTerm}"`
                                : `Showing ${filteredSpots.length} spots for "${debouncedSearchTerm}"`
                            }
                        </p>
                    </>
                )}
            </motion.div>

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
                            onFocus={handleInputFocus}
                            onBlur={handleInputBlur}
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
                        
                        {/* Location Suggestions Dropdown */}
                        {showLocationSuggestions && locationSuggestions.length > 0 && (
                            <div style={{
                                position: 'absolute',
                                top: '100%',
                                left: '0',
                                right: '0',
                                background: 'white',
                                border: '2px solid var(--secondary)',
                                borderTop: 'none',
                                borderRadius: '0 0 16px 16px',
                                maxHeight: '200px',
                                overflowY: 'auto',
                                zIndex: 1000,
                                boxShadow: 'var(--shadow-md)'
                            }}>
                                {locationSuggestions.map((suggestion, index) => (
                                    <div
                                        key={index}
                                        onClick={() => handleLocationSelect(suggestion)}
                                        onMouseDown={(e) => e.preventDefault()} // Prevent blur before click
                                        style={{
                                            padding: '12px 16px',
                                            cursor: 'pointer',
                                            borderBottom: '1px solid var(--border)',
                                            transition: 'background-color 0.2s',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px'
                                        }}
                                        onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--bg-cream)'}
                                        onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
                                    >
                                        <MapPin size={16} color="var(--primary)" />
                                        <div>
                                            <div style={{ 
                                                fontWeight: '600', 
                                                color: 'var(--text-main)',
                                                fontSize: '0.9rem'
                                            }}>
                                                {suggestion.name}
                                            </div>
                                            <div style={{ 
                                                fontSize: '0.8rem', 
                                                color: 'var(--text-muted)',
                                                marginTop: '2px'
                                            }}>
                                                {suggestion.display_name.split(',').slice(1).join(',').trim()}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
                {debouncedSearchTerm.trim() && debouncedSearchTerm.trim().length >= 2 && (
                    <div style={{ 
                        fontSize: '0.9rem', 
                        color: 'var(--text-muted)', 
                        marginTop: '8px',
                        fontStyle: 'italic'
                    }}>
                        {searchingLocation ? (
                            'Detecting location...'
                        ) : (
                            detectedLocation 
                                ? `Found ${filteredSpots.length} spots within 30km of "${debouncedSearchTerm}"`
                                : `Found ${filteredSpots.length} results for "${debouncedSearchTerm}"`
                        )
                        }
                    </div>
                )}
            </motion.div>

            {/* All Spots */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
            >
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                        {loading ? (
                            // Show skeleton loaders while loading
                            Array.from({ length: 6 }).map((_, index) => (
                                <SkeletonLoader key={`skeleton-${index}`} type="card" />
                            ))
                        ) : (
                            filteredSpots.map(spot => (
                                <SpotCard key={spot.id} spot={spot} lang={lang} />
                            ))
                        )}
                    </div>
            </motion.div>
        </div>
    );
};

export default Explore;
