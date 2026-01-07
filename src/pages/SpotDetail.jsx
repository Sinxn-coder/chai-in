import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, MapPin, Star, Heart, Share2, Navigation, Edit3, Instagram, MessageCircle, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ImageSlider from '../components/ImageSlider';

const SpotDetail = ({ lang }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [spot, setSpot] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [newReview, setNewReview] = useState('');
    const [isFavorite, setIsFavorite] = useState(false);
    const [loading, setLoading] = useState(true);
    const [isOpen, setIsOpen] = useState(null);
    const [visited, setVisited] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [visitCount, setVisitCount] = useState(0);
    const [prevVisitCount, setPrevVisitCount] = useState(0);
    const [isCountAnimating, setIsCountAnimating] = useState(false);

    useEffect(() => {
        fetchSpotDetails();
        
        // Listen for profile updates to refresh review names
        const handleProfileUpdate = () => {
            fetchReviews();
        };
        window.addEventListener('userProfileUpdated', handleProfileUpdate);
        
        // Set up real-time subscription for user_preferences changes
        const subscription = supabase
            .channel('user_preferences_changes_reviews')
            .on('postgres_changes', 
                { 
                    event: 'UPDATE', 
                    schema: 'public', 
                    table: 'user_preferences' 
                }, 
                (payload) => {
                    // When any user updates their profile, refresh reviews
                    fetchReviews();
                }
            )
            .subscribe();
        
        return () => {
            window.removeEventListener('userProfileUpdated', handleProfileUpdate);
            supabase.removeChannel(subscription);
        };
    }, [id]);

    const formatNumber = (num) => {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toString();
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
            // Overnight schedule
            if (now < openTime) {
                openTime.setDate(openTime.getDate() - 1);
            } else {
                closeTime.setDate(closeTime.getDate() + 1);
            }
        }

        return now >= openTime && now <= closeTime;
    };

    const formatTime = (timeString) => {
        if (!timeString) return '—';
        const [h, m = '00'] = timeString.split(':');
        const date = new Date();
        date.setHours(Number(h), Number(m), 0, 0);
        return date.toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit', hour12: true });
    };

    const fetchSpotDetails = async () => {
        setLoading(true);
        setErrorMessage('');
        try {
            const { data: spotData, error } = await supabase.from('spots').select('*').eq('id', parseInt(id)).single();
            if (error) throw error;
            if (!spotData) {
                setErrorMessage('Spot not found');
                setLoading(false);
                return;
            }

            setSpot(spotData);
            setIsOpen(computeOpenStatus(spotData.opening_hours));
            fetchReviews();
            fetchVisitCount();
            if (user) {
                const { data: fav } = await supabase.from('user_favorites').select('*').eq('spot_id', parseInt(id)).eq('user_id', user.id).maybeSingle();
                setIsFavorite(!!fav);
                const { data: vis } = await supabase.from('visited_spots').select('*').eq('spot_id', parseInt(id)).eq('user_id', user.id).maybeSingle();
                setVisited(!!vis);
            }
        } catch (err) {
            console.error('Error fetching spot:', err);
            setErrorMessage('Unable to load this spot right now. Please try again.');
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
                user: userMap[r.user_id] || { display_name: 'User', avatar_url: null }
            })));
        } else {
            setReviews([]);
        }
    };

    const fetchVisitCount = async () => {
        try {
            const { count } = await supabase.from('visited_spots').select('*', { count: 'exact', head: true }).eq('spot_id', parseInt(id));
            setVisitCount(count || 0);
        } catch (error) {
            console.error('Error fetching visit count:', error);
        }
    };

    const toggleFavorite = async () => {
        if (!user) return alert("Please login!");
        const prevFavorite = isFavorite;
        setIsFavorite(!prevFavorite); // Optimistic update
        try {
            if (prevFavorite) {
                await supabase.from('user_favorites').delete().eq('spot_id', parseInt(id)).eq('user_id', user.id);
            } else {
                await supabase.from('user_favorites').insert({ spot_id: parseInt(id), user_id: user.id });
            }
        } catch (error) {
            console.error('Error toggling favorite:', error);
            setIsFavorite(prevFavorite); // Revert on error
        }
    };

    const handleVisitToggle = async () => {
        if (!user) return alert("Please login!");
        const prevVisited = visited;
        const newVisited = !prevVisited;
        const newCount = prevVisited ? visitCount - 1 : visitCount + 1;
        
        setVisited(newVisited);
        setPrevVisitCount(visitCount);
        setVisitCount(newCount);
        
        // Trigger animation when count increases
        if (!prevVisited) {
            setIsCountAnimating(true);
            setTimeout(() => setIsCountAnimating(false), 600);
        }
        
        try {
            if (prevVisited) {
                await supabase.from('visited_spots').delete().eq('spot_id', parseInt(id)).eq('user_id', user.id);
            } else {
                await supabase.from('visited_spots').insert({ spot_id: parseInt(id), user_id: user.id });
            }
            
            // Emit event to update profile stats in real-time
            window.dispatchEvent(new CustomEvent('visitUpdated', { 
                detail: { userId: user.id, visited: newVisited } 
            }));
        } catch (error) {
            console.error('Error toggling visit:', error);
            setVisited(prevVisited);
            setVisitCount(prevVisited ? visitCount + 1 : visitCount - 1);
        }
    };

    const handleReviewSubmit = async () => {
        if (!user) return alert("Please login to submit a review!");
        if (!newReview.trim()) return;

        // Ensure user has preferences entry
        await supabase.from('user_preferences').upsert({
            user_id: user.id,
            display_name: user.user_metadata?.full_name || 'User',
            avatar_url: user.user_metadata?.avatar_url || null,
            notifications_enabled: true,
            notify_new_spots: true,
            notify_review_replies: true,
            notify_weekly_digest: false
        }, { onConflict: 'user_id' });

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
        
        // Navigate to directions page first
        const directionsUrl = `/${window.location.pathname.includes('/ml/') ? 'ml' : 'en'}/directions/${id}`;
        
        if (isIOS) {
            // For iOS: navigate to directions page, then open maps
            navigate(directionsUrl);
            setTimeout(() => {
                window.open(`maps://?daddr=${lat},${lng}&q=${spotName}`, '_blank');
            }, 100);
        } else {
            // For Android/desktop: open maps first, then navigate
            window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&destination_place_id=${spotName}`, '_blank');
            setTimeout(() => {
                navigate(directionsUrl);
            }, 100);
        }
    };

    if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Wait a moment...</div>;
    if (errorMessage) return <div style={{ padding: '40px', textAlign: 'center' }}>{errorMessage}</div>;
    if (!spot) return <div style={{ padding: '40px', textAlign: 'center' }}>Spot disappeared...</div>;

    return (
        <div style={{ background: 'var(--bg-white)', minHeight: '100vh', position: 'relative', paddingBottom: '140px' }}>

            {/* Header Image */}
            <div style={{ height: '45vh', position: 'relative', background: '#000' }}>
                <ImageSlider images={spot.images && spot.images.length ? spot.images : ['https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=900&q=80']} />

                {/* Visit Count Overlay */}
                <div style={{
                    position: 'absolute',
                    top: '20px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: 'rgba(0, 0, 0, 0.6)',
                    backdropFilter: 'blur(8px)',
                    padding: '6px 12px',
                    borderRadius: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    zIndex: 5
                }}>
                    <span style={{ color: 'white', fontSize: '0.75rem', fontWeight: '700' }}>
                        {formatNumber(visitCount)} visits
                    </span>
                </div>

                {/* Back Button */}
                <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => navigate(-1)}
                    style={{ position: 'absolute', top: '24px', left: '20px', background: 'white', border: 'none', borderRadius: '16px', padding: '12px', boxShadow: 'var(--shadow-md)', zIndex: 10 }}
                >
                    <ArrowLeft size={24} color="var(--text-main)" />
                </motion.button>

                {/* Favorite */}
                <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={toggleFavorite}
                    style={{ position: 'absolute', top: '24px', right: '20px', background: 'white', border: 'none', borderRadius: '16px', padding: '12px', boxShadow: 'var(--shadow-md)', zIndex: 10 }}
                >
                    <Heart size={24} fill={isFavorite ? 'var(--primary)' : 'none'} color={isFavorite ? 'var(--primary)' : 'var(--text-main)'} />
                </motion.button>
            </div>

            {/* Content Body */}
            <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                style={{
                    background: 'white',
                    marginTop: '-40px',
                    borderRadius: '40px 40px 0 0',
                    padding: '30px 20px',
                    position: 'relative',
                    boxShadow: '0 -10px 30px rgba(0,0,0,0.05)'
                }}
            >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                    <div>
                        <h1 style={{ fontSize: '1.8rem', fontWeight: '900', margin: 0, color: 'var(--text-main)' }}>{spot.name}</h1>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                            <span style={{
                                background: isOpen === null ? '#E5E7EB' : (isOpen ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)'),
                                color: isOpen === null ? '#4B5563' : (isOpen ? '#0F9F6E' : '#B91C1C'),
                                padding: '6px 12px',
                                borderRadius: '12px',
                                fontWeight: '800',
                                fontSize: '0.8rem'
                            }}>
                                {isOpen === null ? 'HOURS NOT SET' : isOpen ? 'OPEN NOW' : 'CLOSED'}
                            </span>
                            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: '700' }}>
                                {formatTime(spot.opening_hours?.open)} - {formatTime(spot.opening_hours?.close)} (Kerala)
                            </span>
                        </div>
                    </div>
                    <div style={{ background: 'var(--secondary)', padding: '10px 16px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Star size={18} fill="#FFB800" color="#FFB800" />
                        <span style={{ fontWeight: '800', fontSize: '1.1rem' }}>{spot.rating || '4.5'}</span>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '10px', marginBottom: '24px' }}>
                    {spot.tags && spot.tags.map(tag => (
                        <span key={tag} style={{ background: 'var(--secondary)', color: 'var(--text-muted)', padding: '6px 14px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: '700' }}>#{tag}</span>
                    ))}
                </div>

                <p style={{ lineHeight: '1.6', color: 'var(--text-main)', fontSize: '1rem', marginBottom: '30px' }}>
                    {spot.description || "Indulge in an exquisite culinary journey at this magnificent location. Known for its exceptional service and vibrant atmosphere."}
                </p>

                {/* Social Links */}
                <div style={{ display: 'flex', gap: '12px', marginBottom: '40px' }}>
                    {spot.instagram_handle && (
                        <a href={`https://instagram.com/${spot.instagram_handle}`} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '14px', borderRadius: '16px', background: 'linear-gradient(45deg, #f09433 0%, #dc2743 100%)', color: 'white', textDecoration: 'none', fontWeight: '800' }}>
                            <Instagram size={20} /> Instagram
                        </a>
                    )}
                    {spot.whatsapp_number && (
                        <a href={`https://wa.me/${spot.whatsapp_number}`} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '14px', borderRadius: '16px', background: '#25D366', color: 'white', textDecoration: 'none', fontWeight: '800' }}>
                            <MessageCircle size={20} /> WhatsApp
                        </a>
                    )}
                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={handleGetDirections}
                        style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '14px', borderRadius: '16px', background: 'var(--primary)', color: 'white', border: 'none', textDecoration: 'none', fontWeight: '800', cursor: 'pointer' }}
                    >
                        <Navigation size={20} /> Directions
                    </motion.button>
                </div>

                {/* Primary Action */}
                <div style={{ position: 'sticky', bottom: '20px', left: 0, right: 0, zIndex: 10, padding: '0 4px', marginBottom: '40px' }}>
                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={handleVisitToggle}
                        style={{
                            width: '100%',
                            padding: '18px',
                            borderRadius: '24px',
                            background: visited ? '#10B981' : '#EF4444',
                            color: 'white',
                            border: 'none',
                            fontSize: '1.1rem',
                            fontWeight: '900',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '10px',
                            boxShadow: 'var(--shadow-lg)'
                        }}
                    >
                        <MapPin size={24} />
                        VISITED
                        <AnimatePresence mode="wait">
                            {isCountAnimating && (
                                <motion.span
                                    key={visitCount}
                                    initial={{ scale: 0.5, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    exit={{ scale: 1.5, opacity: 0 }}
                                    transition={{ duration: 0.5, ease: 'easeOut' }}
                                    style={{ background: 'rgba(255,255,255,0.2)', padding: '2px 8px', borderRadius: '12px', fontSize: '0.9rem' }}
                                >
                                    {formatNumber(visitCount)}
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </motion.button>
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
    );
};

export default SpotDetail;
