import React, { memo, useEffect, useState } from 'react';
import { Star, MapPin, Heart, Check, User, Instagram, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';
import ImageSlider from './ImageSlider';
import { motion } from 'framer-motion';

const SpotCard = memo(({ spot }) => {
    const { name, rating, reviews_count, images, distance, tags, price_level, id, instagram_handle, whatsapp_number } = spot;
    const navigate = useNavigate();
    const { user } = useAuth();
    const [visited, setVisited] = React.useState(false);
    const [isFavorite, setIsFavorite] = React.useState(false);
    const [visitCount, setVisitCount] = React.useState(0);
    const [isOpen, setIsOpen] = React.useState(null);

    useEffect(() => {
        let isMounted = true;
        if (id) {
            fetchVisitStats(isMounted);
            calculateAvailability(isMounted);
            checkFavorite(isMounted);
        }
        return () => { isMounted = false; };
    }, [id, user]);

    const checkFavorite = async (isMounted) => {
        if (!user) return;
        const { data } = await supabase.from('user_favorites').select('*').eq('spot_id', id).eq('user_id', user.id).maybeSingle();
        if (isMounted) setIsFavorite(!!data);
    };

    const toggleFavorite = async (e) => {
        e.stopPropagation();
        if (!user) return;
        const prev = isFavorite;
        setIsFavorite(!prev); // Optimistic update
        try {
            if (prev) {
                await supabase.from('user_favorites').delete().eq('spot_id', id).eq('user_id', user.id);
            } else {
                await supabase.from('user_favorites').insert({ spot_id: id, user_id: user.id });
            }
        } catch (e) {
            setIsFavorite(prev);
        }
    };

    const calculateAvailability = async (isMounted) => {
        const { data: recentVisits } = await supabase
            .from('visited_spots')
            .select('created_at')
            .eq('spot_id', id)
            .order('created_at', { ascending: false })
            .limit(1);

        const now = new Date();
        const keralaOffset = 5.5 * 60 * 60 * 1000;
        const keralaTime = new Date(now.getTime() + keralaOffset);
        const hour = keralaTime.getUTCHours();

        if (recentVisits && recentVisits.length > 0) {
            const lastVisit = new Date(recentVisits[0].created_at);
            const diffInMinutes = (now - lastVisit) / (1000 * 60);
            if (diffInMinutes < 60) {
                if (isMounted) setIsOpen(true);
                return;
            }
        }
        if (isMounted) setIsOpen(hour >= 10 && hour <= 22);
    };

    const fetchVisitStats = async (isMounted) => {
        try {
            const { count } = await supabase.from('visited_spots').select('*', { count: 'exact', head: true }).eq('spot_id', id);
            if (isMounted) setVisitCount(count || 0);
            if (user) {
                const { data } = await supabase.from('visited_spots').select('user_id').eq('spot_id', id).eq('user_id', user.id).maybeSingle();
                if (isMounted) setVisited(!!data);
            }
        } catch (e) {
            console.error(e);
        }
    };

    const handleVisitToggle = async (e) => {
        e.stopPropagation();
        if (!user) return alert("Please login!");
        const prevVisited = visited;
        setVisited(!prevVisited);
        setVisitCount(c => prevVisited ? c - 1 : c + 1);
        try {
            if (prevVisited) {
                await supabase.from('visited_spots').delete().eq('spot_id', id).eq('user_id', user.id);
            } else {
                await supabase.from('visited_spots').insert({ spot_id: id, user_id: user.id });
            }
        } catch (e) {
            setVisited(prevVisited);
            setVisitCount(c => prevVisited ? c + 1 : c - 1);
        }
    };

    const handleCardClick = () => {
        const currentLang = window.location.pathname.includes('/ml/') ? 'ml' : 'en';
        navigate(`/${currentLang}/spot/${id}`);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -5 }}
            transition={{ duration: 0.3 }}
            onClick={handleCardClick}
            style={{
                background: 'var(--bg-white)',
                borderRadius: 'var(--radius-lg)',
                padding: '10px',
                boxShadow: 'var(--shadow-md)',
                cursor: 'pointer',
                marginBottom: '10px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
            }}
        >
            <div style={{ position: 'relative', height: '140px', borderRadius: '24px', overflow: 'hidden' }} onClick={(e) => e.stopPropagation()}>
                <ImageSlider images={images} interval={4000} />
                <div style={{
                    position: 'absolute', top: '8px', left: '50%', transform: 'translateX(-50%)',
                    background: isOpen ? 'rgba(16, 185, 129, 0.9)' : 'rgba(100, 116, 139, 0.9)',
                    backdropFilter: 'blur(8px)', color: 'white', padding: '4px 10px', borderRadius: '20px', fontSize: '0.6rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '4px'
                }}>
                    <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'white' }} />
                    {isOpen ? 'OPEN' : 'CLOSED'}
                </div>
                <div style={{ position: 'absolute', bottom: '8px', left: '8px', background: 'white', padding: '3px 7px', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.7rem', fontWeight: '800' }}>
                    <Star size={10} fill="#FFB800" color="#FFB800" /> {rating}
                </div>
            </div>

            <div style={{ padding: '0 4px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <h3 style={{ fontSize: '0.95rem', fontWeight: '900', margin: '0 0 2px 0', color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{name}</h3>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>{distance} km</p>
                    </div>
                    <motion.button whileTap={{ scale: 0.8 }} onClick={toggleFavorite} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px' }}>
                        <Heart size={20} fill={isFavorite ? 'var(--primary)' : 'none'} color={isFavorite ? 'var(--primary)' : 'var(--text-muted)'} />
                    </motion.button>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
                    <div style={{ display: 'flex', gap: '4px' }}>
                        {(tags || []).slice(0, 1).map((tag, i) => (
                            <span key={i} style={{ fontSize: '0.65rem', color: 'var(--primary)', fontWeight: '700' }}>#{tag}</span>
                        ))}
                    </div>
                    <span style={{ fontSize: '0.8rem', fontWeight: '900', color: 'var(--primary)' }}>{'₹'.repeat(price_level)}</span>
                </div>
            </div>
        </motion.div>
    );
});

export default SpotCard;
