import React, { useState, useEffect } from 'react';
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
    const [searchLocation, setSearchLocation] = useState('');
    const [trendingSpots, setTrendingSpots] = useState([]);
    const [mostVisited, setMostVisited] = useState([]);
    const [toast, setToast] = useState(null);

    useEffect(() => {
        fetchSpots();
        fetchTrendingSpots();
        fetchMostVisited();
    }, []);

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

    const handleSearch = async () => {
        if (!searchTerm.trim() && !searchLocation.trim()) return;

        setLoading(true);
        let query = supabase
            .from('spots')
            .select('*')
            .eq('is_verified', true);

        // Search by dish name
        if (searchTerm.trim()) {
            query = query.ilike('name', searchTerm);
        }

        // Search by location
        if (searchLocation.trim()) {
            query = query.ilike('location', searchLocation);
        }

        const { data, error } = await query;
        
        if (error) {
            console.error('Search error:', error);
            setToast({ message: 'Search failed', type: 'error' });
        } else {
            setSpots(data || []);
        }
        setLoading(false);
    };

    const filteredSpots = spots.filter(spot => {
        const matchesSearch = !searchTerm || spot.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesLocation = !searchLocation || spot.location?.toLowerCase().includes(searchLocation.toLowerCase());
        return matchesSearch && matchesLocation;
    });

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
                            placeholder="Search for dishes..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
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
                    <div style={{ flex: 1, position: 'relative' }}>
                        <MapPin size={20} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                        <input
                            type="text"
                            placeholder="Search by location..."
                            value={searchLocation}
                            onChange={(e) => setSearchLocation(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
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
                <button
                    onClick={handleSearch}
                    style={{
                        padding: '12px 24px',
                        borderRadius: '16px',
                        background: 'var(--primary)',
                        color: 'white',
                        border: 'none',
                        fontWeight: '600',
                        cursor: 'pointer',
                        width: '100%'
                    }}
                >
                    Search
                </button>
            </motion.div>

            {/* Trending Spots */}
            {trendingSpots.length > 0 && (
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
                            <SpotCard key={spot.id} spot={spot} lang={lang} />
                        ))}
                    </div>
                </motion.div>
            )}

            {/* Most Visited */}
            {mostVisited.length > 0 && (
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
                            <SpotCard key={spot.id} spot={spot} lang={lang} />
                        ))}
                    </div>
                </motion.div>
            )}

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
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
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
