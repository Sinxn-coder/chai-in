import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Navigation, MapPin, Star, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';

const DirectionsPage = ({ lang }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [spot, setSpot] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [newReview, setNewReview] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSpotDetails();
        fetchReviews();
    }, [id]);

    const fetchSpotDetails = async () => {
        try {
            const { data: spotData, error } = await supabase.from('spots').select('*').eq('id', parseInt(id)).single();
            if (error) throw error;
            setSpot(spotData);
        } catch (error) {
            console.error('Error fetching spot:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchReviews = async () => {
        const { data: reviewsData, error } = await supabase.from('reviews').select('*').eq('spot_id', id).order('created_at', { ascending: false });
        if (error) {
            console.error('Error loading reviews:', error);
            setReviews([]);
            return;
        }

        if (reviewsData) {
            const userIds = [...new Set(reviewsData.map(r => r.user_id))];
            const { data: usersData } = await supabase.from('user_preferences').select('user_id, display_name, avatar_url').in('user_id', userIds);
            const userMap = {};
            usersData?.forEach(u => userMap[u.user_id] = u);
            
            setReviews(reviewsData.map(r => ({
                ...r,
                user: userMap[r.user_id] || { display_name: 'User' }
            })));
        } else {
            setReviews([]);
        }
    };

    const handleReviewSubmit = async () => {
        if (!user) return alert("Please login to submit a review!");
        if (!newReview.trim()) return;

        const { error } = await supabase.from('reviews').insert({
            spot_id: parseInt(id),
            user_id: user.id,
            comment: newReview,
            rating: 5 // Default rating
        });

        if (error) {
            console.error('Error adding review:', error);
        } else {
            setNewReview('');
            fetchReviews(); // Re-fetch reviews to show the new one
        }
    };

    const handleGetDirections = () => {
        if (!spot?.latitude || !spot?.longitude) {
            alert('Location coordinates not available for this spot.');
            return;
        }

        const lat = spot.latitude;
        const lng = spot.longitude;
        const spotName = encodeURIComponent(spot.name || 'Spot');
        
        // Check if device is iOS
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
        
        if (isIOS) {
            // For iOS devices, use Apple Maps
            window.open(`maps://?daddr=${lat},${lng}&q=${spotName}`, '_blank');
        } else {
            // For Android and desktop, use Google Maps
            window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&destination_place_id=${spotName}`, '_blank');
        }
    };

    const handleGoBack = () => {
        // Set refresh trigger for SpotDetail
        sessionStorage.setItem('refreshSpotDetail', 'true');
        navigate(`/${lang}/spot/${id}`);
    };

    if (loading) {
        return (
            <div style={{ 
                height: '100vh', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                background: 'var(--bg-white)' 
            }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ 
                        width: '40px', 
                        height: '40px', 
                        border: '4px solid var(--primary)', 
                        borderTop: '4px solid transparent', 
                        borderRadius: '50%', 
                        animation: 'spin 1s linear infinite',
                        margin: '0 auto 20px'
                    }}></div>
                    <p style={{ color: 'var(--text-main)', fontWeight: '600' }}>Loading directions...</p>
                </div>
            </div>
        );
    }

    if (!spot) {
        return (
            <div style={{ 
                height: '100vh', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                background: 'var(--bg-white)' 
            }}>
                <div style={{ textAlign: 'center' }}>
                    <MapPin size={48} color="var(--primary)" style={{ marginBottom: '20px' }} />
                    <h2 style={{ color: 'var(--text-main)', margin: 0 }}>Spot not found</h2>
                </div>
            </div>
        );
    }

    return (
        <div style={{ 
            minHeight: '100vh', 
            background: 'var(--bg-white)', 
            position: 'relative' 
        }}>
            {/* Header */}
            <div style={{ 
                background: 'var(--primary)', 
                padding: '20px', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '16px' 
            }}>
                <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={handleGoBack}
                    style={{ 
                        background: 'rgba(255,255,255,0.2)', 
                        border: 'none', 
                        borderRadius: '12px', 
                        padding: '10px', 
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                    }}
                >
                    <ArrowLeft size={20} color="white" />
                    <span style={{ color: 'white', fontWeight: '600', fontSize: '0.9rem' }}>Go Back</span>
                </motion.button>
            </div>

            {/* Content */}
            <div style={{ 
                padding: '40px 20px', 
                textAlign: 'center',
                maxWidth: '600px',
                margin: '0 auto'
            }}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div style={{ 
                        background: 'var(--secondary)', 
                        padding: '30px', 
                        borderRadius: '20px', 
                        marginBottom: '30px' 
                    }}>
                        <h1 style={{ 
                            fontSize: '1.8rem', 
                            fontWeight: '900', 
                            margin: '0 0 16px 0', 
                            color: 'var(--text-main)' 
                        }}>
                            {spot.name}
                        </h1>
                        <p style={{ 
                            color: 'var(--text-muted)', 
                            margin: '0 0 20px 0', 
                            fontSize: '1rem' 
                        }}>
                            {spot.location_text || 'Kerala, India'}
                        </p>
                        
                        <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={handleGetDirections}
                            style={{
                                width: '100%',
                                padding: '20px',
                                borderRadius: '16px',
                                background: 'var(--primary)',
                                color: 'white',
                                border: 'none',
                                fontSize: '1.2rem',
                                fontWeight: '900',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '12px',
                                cursor: 'pointer',
                                boxShadow: 'var(--shadow-lg)'
                            }}
                        >
                            <Navigation size={28} />
                            Get Directions
                        </motion.button>
                    </div>

                    <div style={{ 
                        background: 'var(--secondary)', 
                        padding: '20px', 
                        borderRadius: '16px' 
                    }}>
                        <h3 style={{ 
                            margin: '0 0 12px 0', 
                            color: 'var(--text-main)', 
                            fontSize: '1.1rem',
                            fontWeight: '800' 
                        }}>
                            📍 Spot Information
                        </h3>
                        <div style={{ 
                            display: 'flex', 
                            flexDirection: 'column', 
                            gap: '8px',
                            textAlign: 'left'
                        }}>
                            {spot.opening_hours?.open && (
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ color: 'var(--text-muted)' }}>Hours:</span>
                                    <span style={{ fontWeight: '600' }}>
                                        {spot.opening_hours.open} - {spot.opening_hours.close}
                                    </span>
                                </div>
                            )}
                            {spot.rating && (
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ color: 'var(--text-muted)' }}>Rating:</span>
                                    <span style={{ fontWeight: '600' }}>⭐ {spot.rating}</span>
                                </div>
                            )}
                            {spot.tags && spot.tags.length > 0 && (
                                <div>
                                    <span style={{ color: 'var(--text-muted)' }}>Tags:</span>
                                    <div style={{ marginTop: '8px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                        {spot.tags.map(tag => (
                                            <span key={tag} style={{ 
                                                background: 'var(--primary)', 
                                                color: 'white', 
                                                padding: '4px 8px', 
                                                borderRadius: '8px', 
                                                fontSize: '0.8rem',
                                                fontWeight: '600'
                                            }}>
                                                #{tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Reviews Section */}
                    <div style={{ marginBottom: '40px' }}>
                        <h2 style={{ fontSize: '1.4rem', fontWeight: '900', marginBottom: '20px' }}>Reviews ({reviews.length})</h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {reviews.map(review => (
                                <div key={review.id} style={{ display: 'flex', gap: '12px' }}>
                                    <img src={review.user?.avatar_url || 'https://i.pravatar.cc/40'} style={{ width: '40px', height: '40px', borderRadius: '50%' }} />
                                    <div>
                                        <p style={{ fontWeight: '800', margin: 0 }}>{review.user?.display_name || 'Anonymous'}</p>
                                        <p style={{ margin: '4px 0 0 0', color: 'var(--text-main)' }}>{review.comment}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div style={{ marginTop: '24px', display: 'flex', gap: '10px' }}>
                            <input
                                type="text"
                                value={newReview}
                                onChange={(e) => setNewReview(e.target.value)}
                                placeholder="Add a review..."
                                style={{ flex: 1, padding: '14px', borderRadius: '16px', border: '2px solid var(--secondary)', outline: 'none', fontWeight: '700' }}
                            />
                            <button onClick={handleReviewSubmit} style={{ padding: '14px 20px', borderRadius: '16px', background: 'var(--primary)', color: 'white', border: 'none', fontWeight: '800' }}>Send</button>
                        </div>
                    </div>
                </motion.div>
            </div>

            <style jsx>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

export default DirectionsPage;
