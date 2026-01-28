import React, { memo, useEffect, useState } from 'react';
import { Star, MapPin, Heart, Check, User, Instagram, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';
import ImageSlider from './ImageSlider';
import StarRating from './StarRating';
import { motion } from 'framer-motion';

const SpotCard = memo(({ spot }) => {
    const { name, average_rating, total_ratings, images, distance, tags, price_level, id, instagram_handle, whatsapp_number } = spot;
    const navigate = useNavigate();
    const { user } = useAuth();
    const [visited, setVisited] = React.useState(false);
    const [isFavorite, setIsFavorite] = React.useState(false);
    const [visitCount, setVisitCount] = React.useState(0);
    const [isOpen, setIsOpen] = React.useState(null);

    // Price range mapping
    const getPriceRange = (level) => {
        const ranges = {
            1: '₹50-150',
            2: '₹150-300',
            3: '₹300-600',
            4: '₹600+'
        };
        return ranges[level] || '₹50-150';
    };

    useEffect(() => {
        let isMounted = true;
        if (id) {
            fetchVisitStats(isMounted);
            checkFavorite(isMounted);
            if (spot.opening_hours) {
                setIsOpen(computeOpenStatus(spot.opening_hours));
            } else {
                setIsOpen(null);
            }
        }
        return () => { isMounted = false; };
    }, [id, user, spot.opening_hours]);

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

    const getKeralaDate = () => new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));

    const computeOpenStatus = (opening_hours) => {
        if (!opening_hours || !opening_hours.open || !opening_hours.close) return null;
        const now = getKeralaDate();
        const [openH, openM = 0] = opening_hours.open.split(':').map(Number);
        const [closeH, closeM = 0] = opening_hours.close.split(':').map(Number);

        const openTime = new Date(now);
        openTime.setHours(openH, openM, 0, 0);
        const closeTime = new Date(now);
        closeTime.setHours(closeH, closeM, 0, 0);

        if (closeTime <= openTime) {
            if (now < openTime) {
                openTime.setDate(openTime.getDate() - 1);
            } else {
                closeTime.setDate(closeTime.getDate() + 1);
            }
        }

        return now >= openTime && now <= closeTime;
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
            whileHover={{ y: -5, boxShadow: 'var(--shadow-hover)' }}
            transition={{ duration: 0.3 }}
            onClick={handleCardClick}
            style={{
                background: 'var(--bg-card)',
                borderRadius: 'var(--radius-lg)',
                padding: '8px',
                boxShadow: 'var(--shadow-normal)',
                cursor: 'pointer',
                marginBottom: '8px',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
                width: '100%',
                maxWidth: '100%',
                boxSizing: 'border-box',
                transition: 'all 0.3s ease'
            }}
        >
            <div style={{ position: 'relative', height: '120px', borderRadius: '20px', overflow: 'hidden' }} onClick={(e) => e.stopPropagation()}>
                <ImageSlider images={images} interval={4000} />
                <div style={{
                    position: 'absolute', top: '6px', left: '50%', transform: 'translateX(-50%)',
                    background: isOpen === null ? 'rgba(100, 116, 139, 0.7)' : (isOpen ? 'rgba(16, 185, 129, 0.9)' : 'rgba(239, 68, 68, 0.9)'),
                    backdropFilter: 'blur(8px)', color: 'white', padding: '3px 8px', borderRadius: '16px', fontSize: '0.55rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '3px'
                }}>
                    <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'white' }} />
                    {isOpen === null ? 'HOURS N/A' : isOpen ? 'OPEN' : 'CLOSED'}
                </div>
                <div style={{ position: 'absolute', bottom: '6px', left: '6px', background: 'white', padding: '2px 6px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '3px', fontSize: '0.65rem', fontWeight: '800' }}>
                    {average_rating && total_ratings > 0 ? (
                        <>
                            <Star size={8} fill="#FFB800" color="#FFB800" />
                            <span style={{ marginLeft: '2px' }}>{average_rating.toFixed(1)}</span>
                        </>
                    ) : (
                        <>
                            <Star size={8} fill="#FFB800" color="#FFB800" />
                            <span>New</span>
                        </>
                    )}
                </div>
            </div>

            <div style={{ padding: '0 2px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1, minWidth: 0, marginRight: '8px' }}>
                        <h3 style={{ fontSize: '0.85rem', fontWeight: '900', margin: '0 0 2px 0', color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', lineHeight: '1.2' }}>{name}</h3>
                        <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', margin: 0, lineHeight: '1.2' }}>{distance} km</p>
                    </div>
                    <motion.button whileTap={{ scale: 0.8 }} onClick={toggleFavorite} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px', flexShrink: 0 }}>
                        <Heart size={18} fill={isFavorite ? 'var(--primary)' : 'none'} color={isFavorite ? 'var(--primary)' : 'var(--text-muted)'} style={{ filter: isFavorite ? 'var(--icon-glow)' : 'none' }} />
                    </motion.button>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
                    <div style={{ display: 'flex', gap: '4px' }}>
                        {(tags || []).slice(0, 1).map((tag, i) => (
                            <span key={i} style={{ fontSize: '0.65rem', color: 'var(--text-highlight)', fontWeight: '700' }}>#{tag}</span>
                        ))}
                    </div>
                    <span style={{ fontSize: '0.8rem', fontWeight: '900', color: 'var(--primary)', background: 'var(--bg-light-red)', padding: '4px 8px', borderRadius: '8px' }}>{getPriceRange(price_level)}</span>
                </div>
                <div style={{ marginTop: '6px', fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: '700' }}>
                    {spot.opening_hours?.open && spot.opening_hours?.close
                        ? `Kerala time: ${spot.opening_hours.open} - ${spot.opening_hours.close}`
                        : 'Hours not set'}
                </div>
            </div>
        </motion.div >
    );
});

export default SpotCard;
