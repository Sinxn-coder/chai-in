import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Plus, ArrowLeft } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import SpotCard from '../components/SpotCard';
import FoodLoader from '../components/FoodLoader';
import { motion } from 'framer-motion';

const ProfileAdded = ({ lang }) => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [addedSpots, setAddedSpots] = useState([]);

    useEffect(() => {
        if (user) fetchAddedSpots();
    }, [user]);

    const fetchAddedSpots = async () => {
        setLoading(true);
        try {
            const { data: spotsData } = await supabase
                .from('spots')
                .select('*')
                .eq('created_by', user.id)
                .order('created_at', { ascending: false });
            setAddedSpots(spotsData || []);
        } catch (error) {
            console.error('Error fetching added spots:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-white)', paddingBottom: '120px' }}>
            {/* Header */}
            <div style={{ 
                height: '140px', 
                background: 'var(--primary)', 
                borderBottomLeftRadius: '40px', 
                borderBottomRightRadius: '40px', 
                padding: '24px', 
                display: 'flex', 
                alignItems: 'center', 
                position: 'relative' 
            }}>
                <button 
                    onClick={() => navigate(`/${lang}/profile`)} 
                    style={{ 
                        position: 'absolute', 
                        left: '20px', 
                        background: 'rgba(255,255,255,0.2)', 
                        border: 'none', 
                        padding: '10px', 
                        borderRadius: '15px', 
                        color: 'white' 
                    }}
                >
                    <ArrowLeft size={24} />
                </button>
                <h1 style={{ color: 'white', fontWeight: '900', fontSize: '1.4rem', margin: 0 }}>My Added Spots</h1>
            </div>

            {/* Content */}
            <div className="container" style={{ padding: '0 20px', marginTop: '-40px' }}>
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '40px' }}>
                        <FoodLoader message="Loading added spots..." />
                    </div>
                ) : addedSpots.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
                        <Plus size={48} style={{ marginBottom: '12px', opacity: 0.3 }} />
                        <p>No spots added yet</p>
                        <p style={{ fontSize: '0.9rem', marginTop: '8px' }}>Start adding spots to contribute to the community!</p>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                        {addedSpots.map(spot => <SpotCard key={spot.id} spot={spot} />)}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProfileAdded;
