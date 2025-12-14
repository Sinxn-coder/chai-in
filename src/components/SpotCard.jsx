import React from 'react';
import { Star, MapPin, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';

const SpotCard = ({ spot }) => {
    const { name, rating, reviews_count, images, distance, tags, price_level, id } = spot;
    const navigate = useNavigate();
    const { user } = useAuth();

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
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: '0 8px 30px rgba(0,0,0,0.06)',
                transition: 'transform 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                cursor: 'pointer',
                marginBottom: '24px',
                border: '1px solid rgba(0,0,0,0.02)'
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
            {/* Image Area - Horizontal Scroll */}
            <div
                className="hide-scrollbar"
                style={{
                    position: 'relative',
                    height: '240px',
                    display: 'flex',
                    overflowX: 'auto',
                    scrollSnapType: 'x mandatory',
                    background: '#f0f0f0'
                }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Images */}
                {(images && images.length > 0 ? images : ['https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80']).map((img, i) => (
                    <img
                        key={i}
                        src={img}
                        alt={`${name} ${i + 1}`}
                        style={{
                            minWidth: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            scrollSnapAlign: 'center'
                        }}
                    />
                ))}

                {/* Rating Badge */}
                <div style={{
                    position: 'absolute',
                    bottom: '12px',
                    right: '12px',
                    background: rating >= 4.0 ? '#267E3E' : '#f59e0b',
                    color: 'white',
                    padding: '4px 8px',
                    borderRadius: '6px',
                    fontSize: '0.85rem',
                    fontWeight: '800',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
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
            </div>

            {/* Info Area */}
            <div style={{ padding: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <h3 style={{
                        fontSize: '1.25rem',
                        fontWeight: '800',
                        margin: 0,
                        color: '#1c1c1c',
                        lineHeight: '1.3'
                    }}>
                        {name}
                    </h3>
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
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', gap: '6px', overflow: 'hidden' }}>
                        {tags.slice(0, 3).map((tag, i) => (
                            <span key={i} style={{
                                fontSize: '0.75rem',
                                color: '#888',
                                border: '1px solid #eee',
                                padding: '2px 8px',
                                borderRadius: '12px',
                                whiteSpace: 'nowrap'
                            }}>
                                {tag}
                            </span>
                        ))}
                    </div>
                    <span style={{ fontSize: '0.9rem', fontWeight: '600', color: '#333' }}>
                        {'₹'.repeat(price_level)}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default SpotCard;
