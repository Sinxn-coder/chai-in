import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { MessageSquare, ArrowLeft, Star } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import FoodLoader from '../components/FoodLoader';
import { motion } from 'framer-motion';

const ProfileReviews = ({ lang }) => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        if (user) fetchReviews();
    }, [user]);

    const fetchReviews = async () => {
        setLoading(true);
        try {
            const { data: reviewsData } = await supabase
                .from('reviews')
                .select('*, spots(name)')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });
            
            if (reviewsData) {
                // Fetch user preferences for display names
                const userIds = [...new Set(reviewsData.map(r => r.user_id))];
                const { data: usersData } = await supabase
                    .from('user_preferences')
                    .select('user_id, display_name, avatar_url')
                    .in('user_id', userIds);
                const userMap = {};
                usersData?.forEach(u => userMap[u.user_id] = u);
                
                setReviews(reviewsData.map(r => ({
                    ...r,
                    user: userMap[r.user_id] || { display_name: 'User' }
                })));
            } else {
                setReviews([]);
            }
        } catch (error) {
            console.error('Error fetching reviews:', error);
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
                <h1 style={{ color: 'white', fontWeight: '900', fontSize: '1.4rem', margin: 0 }}>My Reviews</h1>
            </div>

            {/* Content */}
            <div className="container" style={{ padding: '0 20px', marginTop: '-40px' }}>
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '40px' }}>
                        <FoodLoader message="Loading reviews..." />
                    </div>
                ) : reviews.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
                        <MessageSquare size={48} style={{ marginBottom: '12px', opacity: 0.3 }} />
                        <p>No reviews yet</p>
                        <p style={{ fontSize: '0.9rem', marginTop: '8px' }}>Start reviewing spots to share your thoughts!</p>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {reviews.map(review => (
                            <div key={review.id} style={{ 
                                background: 'white', 
                                padding: '16px', 
                                borderRadius: '20px', 
                                boxShadow: 'var(--shadow-sm)' 
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                                    <img 
                                        src={review.user?.avatar_url || 'https://i.pravatar.cc/40'} 
                                        style={{ 
                                            width: '40px', 
                                            height: '40px', 
                                            borderRadius: '50%' 
                                        }} 
                                    />
                                    <div>
                                        <p style={{ fontWeight: '800', margin: 0 }}>
                                            {review.user?.display_name || 'Anonymous'}
                                        </p>
                                        <p style={{ 
                                            margin: '4px 0 0 0', 
                                            color: 'var(--text-muted)', 
                                            fontSize: '0.85rem' 
                                        }}>
                                            at {review.spots?.name}
                                        </p>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '4px', marginBottom: '8px' }}>
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} size={14} fill={i < review.rating ? '#FFB800' : 'none'} color={i < review.rating ? '#FFB800' : '#ddd'} />
                                    ))}
                                </div>
                                <p style={{ 
                                    fontSize: '0.9rem', 
                                    color: 'var(--text-main)', 
                                    marginBottom: '8px' 
                                }}>
                                    {review.comment}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProfileReviews;
