import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';
import { Heart, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import SpotCard from '../components/SpotCard';
import FoodLoader from '../components/FoodLoader';
import { motion } from 'framer-motion';

const Favorites = ({ lang }) => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) fetchFavorites();
    }, [user]);

    const fetchFavorites = async () => {
        setLoading(true);
        const { data: favData } = await supabase
            .from('user_favorites')
            .select('spot_id')
            .eq('user_id', user.id);

        if (favData && favData.length > 0) {
            const spotIds = favData.map(f => f.spot_id);
            const { data: spotsData } = await supabase
                .from('spots')
                .select('*')
                .in('id', spotIds);
            setFavorites(spotsData || []);
        }
        setLoading(false);
    };

    return (
        <div style={{ minHeight: '100vh', background: 'var(--secondary)', paddingBottom: '120px' }}>
            <div style={{ height: '180px', background: 'var(--primary)', borderBottomLeftRadius: '40px', borderBottomRightRadius: '40px', padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                <button onClick={() => navigate(-1)} style={{ position: 'absolute', left: '20px', top: '30px', background: 'rgba(255,255,255,0.2)', border: 'none', padding: '10px', borderRadius: '15px', color: 'white', cursor: 'pointer' }}>
                    <ArrowLeft size={24} />
                </button>
                <Heart size={48} color="white" fill="white" style={{ marginBottom: '8px' }} />
                <h1 style={{ color: 'white', fontWeight: '900', fontSize: '1.6rem', margin: 0 }}>My Favorites</h1>
                <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem', fontWeight: '600' }}>Your saved spots</p>
            </div>

            <div className="container" style={{ padding: '20px', marginTop: '-30px' }}>
                {loading ? (
                    <FoodLoader message="Loading your favorites..." />
                ) : favorites.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                        <Heart size={64} color="var(--text-muted)" style={{ marginBottom: '20px', opacity: 0.3 }} />
                        <h3 style={{ color: 'var(--text-main)', fontWeight: '800', marginBottom: '8px' }}>No favorites yet</h3>
                        <p style={{ color: 'var(--text-muted)' }}>Start exploring and save your favorite spots!</p>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                        {favorites.map(spot => (
                            <SpotCard key={spot.id} spot={spot} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Favorites;
