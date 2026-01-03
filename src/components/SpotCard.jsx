import React from 'react';
import { Star, MapPin, Heart, Check, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';
import ImageSlider from './ImageSlider';

const SpotCard = ({ spot }) => {
    const { name, rating, reviews_count, images, distance, tags, price_level, id, instagram_handle, whatsapp_number } = spot;
    const navigate = useNavigate();
    const { user } = useAuth();
    const [visited, setVisited] = React.useState(false);

    // Price Level Gradient Palettes
    const getPriceTheme = (level) => {
        if (level <= 1) return {
            gradient: 'linear-gradient(135deg, #00d2ff 0%, #3a7bd5 100%)',
            shadow: 'rgba(0, 210, 255, 0.2)',
            text: '#0056b3'
        };
        if (level === 2) return {
            gradient: 'linear-gradient(135deg, #8e2de2 0%, #4a00e0 100%)',
            shadow: 'rgba(142, 45, 226, 0.2)',
            text: '#4a00e0'
        };
        return {
            gradient: 'linear-gradient(135deg, #f2994a 0%, #f2c94c 100%)',
            shadow: 'rgba(242, 153, 74, 0.2)',
            text: '#8a5e00'
        };
    };

    const theme = getPriceTheme(price_level || 1);
    const [visitCount, setVisitCount] = React.useState(0);
    const [visitLoading, setVisitLoading] = React.useState(true);
    const [isOpen, setIsOpen] = React.useState(null); // null = unknown, true = open, false = closed
    const [lastVisitorTime, setLastVisitorTime] = React.useState(null);

    React.useEffect(() => {
        if (id) {
            fetchVisitStats();
            calculateAvailability();
        }
    }, [id, user]);

    const calculateAvailability = async () => {
        // 1. Check Recent Visits (Intelligence)
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
            setLastVisitorTime(diffInMinutes);

            if (diffInMinutes < 60) {
                setIsOpen(true); // Verified Open by recent visit
                return;
            }
        }

        // 2. Default Time Patterns (Intelligence)
        // Most spots in Kerala are open from 10 AM to 10:30 PM
        if (hour >= 10 && hour <= 22) {
            setIsOpen(true);
        } else {
            setIsOpen(false);
        }
    };

    const fetchVisitStats = async () => {
        try {
            // Fetch total count
            const { count } = await supabase
                .from('visited_spots')
                .select('*', { count: 'exact', head: true })
                .eq('spot_id', id);
            setVisitCount(count || 0);

            // Fetch if current user visited
            if (user) {
                const { data } = await supabase
                    .from('visited_spots')
                    .select('user_id')
                    .eq('spot_id', id)
                    .eq('user_id', user.id)
                    .maybeSingle();
                setVisited(!!data);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setVisitLoading(false);
        }
    };

    const handleVisitToggle = async (e) => {
        e.stopPropagation();
        if (!user) {
            alert("Please login to mark as visited!");
            return;
        }

        try {
            if (visited) {
                // Remove visit
                const { error } = await supabase
                    .from('visited_spots')
                    .delete()
                    .eq('spot_id', id)
                    .eq('user_id', user.id);
                if (error) throw error;
                setVisited(false);
                setVisitCount(prev => Math.max(0, prev - 1));
            } else {
                // Add visit
                const { error } = await supabase
                    .from('visited_spots')
                    .insert({ spot_id: id, user_id: user.id });
                if (error) throw error;
                setVisited(true);
                setVisitCount(prev => prev + 1);
            }
        } catch (e) {
            console.error(e);
            alert("Action failed. Try again.");
        }
    };

    const checkStreak = async () => {
        if (!user) return;

        try {
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
                }
            }
        } catch (e) {
            console.error("Streak check failed", e);
        }
    };

    const handleCardClick = (e) => {
        // Run streak check in background
        checkStreak();

        // Prevent click if scrolling images
        if (e.target.tagName !== 'IMG' && !e.target.classList.contains('image-scroll-container')) {
            const currentLang = window.location.hash.includes('/ml/') ? 'ml' : 'en';
            navigate(`/${currentLang}/spot/${id}`);
        } else {
            // Logic for image area click
            const currentLang = window.location.hash.includes('/ml/') ? 'ml' : 'en';
            navigate(`/${currentLang}/spot/${id}`);
        }
    };

    return (
        <div
            onClick={handleCardClick}
            style={{
                background: 'white',
                borderRadius: '24px', // More rounded for premium feel
                overflow: 'hidden',
                boxShadow: `0 10px 40px ${theme.shadow}, 0 4px 12px rgba(0,0,0,0.03)`,
                transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                cursor: 'pointer',
                marginBottom: '28px',
                border: '1px solid rgba(0,0,0,0.03)',
                position: 'relative'
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.02)';
                e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.1)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.06)';
            }}
        >
            {/* Premium Gradient Top Accents */}
            <div style={{
                position: 'absolute',
                top: 0, left: 0, right: 0,
                height: '6px',
                background: theme.gradient,
                zIndex: 10
            }} />

            {/* Image Area - Automatic Slider */}
            <div
                style={{
                    position: 'relative',
                    height: '240px',
                    background: '#f0f0f0'
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <ImageSlider images={images} interval={3000} />

                {/* Availability Badge (Intelligence) */}
                <div style={{
                    position: 'absolute',
                    top: '12px',
                    left: '12px',
                    background: isOpen ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : 'linear-gradient(135deg, #64748b 0%, #475569 100%)',
                    color: 'white',
                    padding: '6px 12px',
                    borderRadius: '20px',
                    fontSize: '0.75rem',
                    fontWeight: '800',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    zIndex: 21,
                    backdropFilter: 'blur(10px)'
                }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'white', animation: isOpen ? 'pulse 2s infinite' : 'none' }} />
                    {isOpen ? 'OPEN NOW' : 'CLOSED'}
                </div>

                {/* Rating Badge - Using Theme Gradient */}
                <div style={{
                    position: 'absolute',
                    bottom: '12px',
                    right: '12px',
                    background: theme.gradient,
                    color: 'white',
                    padding: '6px 10px',
                    borderRadius: '10px',
                    fontSize: '0.85rem',
                    fontWeight: '800',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    zIndex: 21
                }}>
                    {rating} <Star size={12} fill="white" strokeWidth={0} />
                </div>

                {/* Promoted / Verified Badge */}
                {spot.is_verified && (
                    <div style={{
                        position: 'absolute',
                        top: '12px',
                        left: '12px',
                        background: 'rgba(255,255,255,0.9)',
                        backdropFilter: 'blur(4px)',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '0.65rem',
                        fontWeight: '700',
                        color: 'var(--text-muted)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                    }}>
                        Verified
                    </div>
                )}

                {/* Visited Button (Layered on Image) */}
                <button
                    onClick={handleVisitToggle}
                    style={{
                        position: 'absolute',
                        top: '12px',
                        right: '12px',
                        background: visited ? 'var(--primary)' : 'rgba(255,255,255,0.9)',
                        color: visited ? 'white' : 'var(--text-main)',
                        border: 'none',
                        padding: '6px 10px',
                        borderRadius: '8px',
                        fontSize: '0.75rem',
                        fontWeight: '700',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        cursor: 'pointer',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                        zIndex: 2,
                        transition: 'all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                    }}
                    onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.9)'}
                    onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                    <Check size={14} strokeWidth={3} />
                    {visited ? 'Visited' : 'I Visited'}
                </button>
            </div>

            {/* Info Area */}
            <div style={{ padding: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <div style={{ flex: 1 }}>
                        <h3 style={{
                            fontSize: '1.25rem',
                            fontWeight: '900',
                            margin: 0,
                            color: '#1a1a1a',
                            lineHeight: '1.2',
                            letterSpacing: '-0.3px'
                        }}>
                            {name}
                        </h3>
                        {/* Social Action Group */}
                        <div style={{ display: 'flex', gap: '8px', mt: '6px', marginTop: '6px' }} onClick={(e) => e.stopPropagation()}>
                            {instagram_handle && (
                                <a
                                    href={`https://instagram.com/${instagram_handle.replace('@', '')}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                        padding: '6px', borderRadius: '10px', background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
                                        color: 'white', display: 'flex'
                                    }}
                                >
                                    <Instagram size={14} />
                                </a>
                            )}
                            {whatsapp_number && (
                                <a
                                    href={`https://wa.me/${whatsapp_number.replace(/\D/g, '')}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                        padding: '6px', borderRadius: '10px', background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
                                        color: 'white', display: 'flex'
                                    }}
                                >
                                    <MessageCircle size={14} />
                                </a>
                            )}
                        </div>
                    </div>
                    <span style={{
                        backgroundColor: '#f8f8f8',
                        color: '#555',
                        fontSize: '0.75rem',
                        padding: '3px 8px',
                        borderRadius: '6px',
                        fontWeight: '700',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                    }}>
                        <User size={12} /> {visitCount} visited
                    </span>
                    <span style={{
                        backgroundColor: '#f8f8f8',
                        color: '#555',
                        fontSize: '0.8rem',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        fontWeight: '600'
                    }}>
                        {reviews_count} reviews
                    </span>
                </div>

                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    color: '#666',
                    fontSize: '0.9rem',
                    marginBottom: '12px',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                }}>
                    <MapPin size={16} color="#E23744" />
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {distance} km • {spot.location_text?.split(',')[0] || 'Nearby'}
                    </span>
                </div>

                {/* Tags & Price */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
                    <div style={{ display: 'flex', gap: '6px', overflow: 'hidden' }}>
                        {(tags || []).slice(0, 3).map((tag, i) => (
                            <span key={i} style={{
                                fontSize: '0.75rem',
                                color: '#64748b',
                                background: 'rgba(0,0,0,0.04)',
                                padding: '4px 10px',
                                borderRadius: '10px',
                                fontWeight: '700',
                                whiteSpace: 'nowrap'
                            }}>
                                #{tag}
                            </span>
                        ))}
                    </div>
                    <span style={{
                        fontSize: '0.9rem',
                        fontWeight: '950',
                        padding: '8px 14px',
                        borderRadius: '16px',
                        background: theme.gradient,
                        color: 'white',
                        boxShadow: `0 8px 20px ${theme.shadow}`,
                        transform: 'rotate(-2deg) translateY(-2px)',
                        transition: 'all 0.3s ease'
                    }}>
                        {'₹'.repeat(price_level)}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default SpotCard;
