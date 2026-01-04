import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';
import SpotCard from '../components/SpotCard';
import { Search, MapPin, Filter, X } from 'lucide-react';
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
    const [activeCategory, setActiveCategory] = useState('All');

    useEffect(() => {
        fetchSpots();
    }, [activeLocation]);

    const fetchSpots = async () => {
        setLoading(true);
        const { data, error } = await supabase.from('spots').select('*').eq('is_verified', true).order('created_at', { ascending: false });
        if (error) {
            console.error(error);
        } else {
            let all = data || [];
            if (activeLocation) {
                all = all.filter(s => getDistanceFromLatLonInKm(activeLocation.lat, activeLocation.lng, s.latitude, s.longitude) <= 30);
            }
            setSpots(all);
        }
        setLoading(false);
    };

    const filteredSpots = useMemo(() => {
        return spots.filter(s => {
            const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCategory = activeCategory === 'All' || s.category === activeCategory;
            return matchesSearch && matchesCategory;
        });
    }, [spots, searchTerm, activeCategory]);

    function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
        var R = 6371;
        var dLat = (lat2 - lat1) * Math.PI / 180;
        var dLon = (lon2 - lon1) * Math.PI / 180;
        var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
        return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
    }

    return (
        <div style={{ padding: '20px', paddingBottom: '120px', background: 'var(--bg-white)', minHeight: '100vh' }}>
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

            <div className="hide-scrollbar" style={{ display: 'flex', gap: '12px', overflowX: 'auto', marginBottom: '30px', padding: '4px 0' }}>
                {['All', 'Trending', 'Arabian', 'Burger', 'Cafes', 'Desserts'].map(cat => (
                    <motion.button
                        key={cat}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setActiveCategory(cat)}
                        style={{
                            padding: '10px 24px',
                            borderRadius: '16px',
                            background: activeCategory === cat ? 'var(--primary)' : 'var(--secondary)',
                            color: activeCategory === cat ? 'white' : 'var(--text-muted)',
                            border: 'none',
                            fontWeight: '800',
                            whiteSpace: 'nowrap',
                            boxShadow: activeCategory === cat ? 'var(--shadow-sm)' : 'none',
                            transition: 'all 0.3s ease'
                        }}
                    >
                        {cat}
                    </motion.button>
                ))}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
                <div style={{ background: 'rgba(239, 42, 57, 0.1)', color: 'var(--primary)', padding: '6px 12px', borderRadius: '12px', fontSize: '0.85rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <MapPin size={16} /> {locationName}
                </div>
            </div>

            {loading ? (
                <FoodLoader message="Finding delicious spots..." />
            ) : (
                <motion.div
                    layout
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(2, 1fr)',
                        gap: '16px'
                    }}
                >
                    <AnimatePresence>
                        {filteredSpots.map(spot => (
                            <SpotCard key={spot.id} spot={spot} />
                        ))}
                    </AnimatePresence>
                </motion.div>
            )}
            <style>{`
                @keyframes pulse {
                    0% { opacity: 0.6; }
                    50% { opacity: 0.3; }
                    100% { opacity: 0.6; }
                }
            `}</style>
        </div>
    );
};

export default Home;
