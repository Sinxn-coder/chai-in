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

    useEffect(() => {
        fetchSpotDetails();
    }, [id, user]);

    const fetchSpotDetails = async () => {
        setLoading(true);
        const { data: spotData, error } = await supabase.from('spots').select('*').eq('id', parseInt(id)).single();
        if (error) { 
            console.error('Error fetching spot:', error); 
            setLoading(false); 
            return; 
        }
        if (!spotData) {
            console.error('Spot not found');
            setLoading(false);
            return;
        }
        setSpot(spotData);
        calculateAvailability(spotData);
        fetchReviews();
        if (user) {
            const { data: fav } = await supabase.from('user_favorites').select('*').eq('spot_id', parseInt(id)).eq('user_id', user.id).maybeSingle();
            setIsFavorite(!!fav);
            const { data: vis } = await supabase.from('visited_spots').select('*').eq('spot_id', parseInt(id)).eq('user_id', user.id).maybeSingle();
            setVisited(!!vis);
        }
        setLoading(false);
    };

    const calculateAvailability = (spotData) => {
        const now = new Date();
        const hour = (now.getUTCHours() + 5.5) % 24;
        setIsOpen(hour >= 10 && hour <= 22);
    };

    const fetchReviews = async () => {
        const { data: reviewsData } = await supabase.from('reviews').select('*').eq('spot_id', id).order('created_at', { ascending: false });
        
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

    const toggleFavorite = async () => {
        if (!user) return alert("Please login!");
        if (isFavorite) {
            await supabase.from('user_favorites').delete().eq('spot_id', parseInt(id)).eq('user_id', user.id);
            setIsFavorite(false);
        } else {
            await supabase.from('user_favorites').insert({ spot_id: parseInt(id), user_id: user.id });
            setIsFavorite(true);
        }
    };

    const handleVisitToggle = async () => {
        if (!user) return alert("Please login!");
        if (visited) {
            await supabase.from('visited_spots').delete().eq('spot_id', parseInt(id)).eq('user_id', user.id);
            setVisited(false);
        } else {
            await supabase.from('visited_spots').insert({ spot_id: parseInt(id), user_id: user.id });
            setVisited(true);
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

    if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Wait a moment...</div>;
    if (!spot) return <div style={{ padding: '40px', textAlign: 'center' }}>Spot disappeared...</div>;

    return (
        <div style={{ background: 'var(--bg-white)', minHeight: '100vh', position: 'relative' }}>

            {/* Header Image */}
            <div style={{ height: '45vh', position: 'relative', background: '#000' }}>
                <ImageSlider images={spot.images} />

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
                    style={{ position: 'absolute', top: '24px', right: '20px', background: 'white', border: 'none', borderRadius: '16px', padding: '12px', boxShadow: 'var(--shadow-md)', zIndex: 10, display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                    <Heart size={24} fill={isFavorite ? 'var(--primary)' : 'none'} color={isFavorite ? 'var(--primary)' : 'var(--text-main)'} />
                    <span style={{ fontWeight: '800' }}>{spot.favorites_count || 0}</span>
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
                        <p style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '0.95rem', margin: '8px 0' }}>
                            <MapPin size={18} color="var(--primary)" /> {spot.location_text || 'Kerala, India'}
                        </p>
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

                {/* Primary Action */}
                <div style={{ position: 'sticky', bottom: '20px', left: 0, right: 0, zIndex: 10 }}>
                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={handleVisitToggle}
                        style={{
                            width: '100%',
                            padding: '18px',
                            borderRadius: '24px',
                            background: visited ? 'var(--text-main)' : 'var(--primary)',
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
                        {visited ? <Check size={24} /> : <MapPin size={24} />}
                        {visited ? 'VISITED' : 'VISIT NOW'}
                    </motion.button>
                </div>
            </motion.div>
        </div>
    );
};

export default SpotDetail;
