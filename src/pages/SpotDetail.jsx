import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, MapPin, Star, Heart, Share2, Send, Navigation, X } from 'lucide-react';
import Button from '../components/Button';
import Toast from '../components/Toast';
import ImageSlider from '../components/ImageSlider';

const SpotDetail = ({ lang }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [spot, setSpot] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [isFavorite, setIsFavorite] = useState(false);
    const [loading, setLoading] = useState(true);
    const [newReview, setNewReview] = useState('');
    const [rating, setRating] = useState(5);
    const [toast, setToast] = useState(null);
    const [showGallery, setShowGallery] = useState(false);

    useEffect(() => {
        fetchSpotDetails();
    }, [id]);

    const fetchSpotDetails = async () => {
        setLoading(true);
        // 1. Fetch Spot
        const { data: spotData, error } = await supabase
            .from('spots')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            console.error("Error fetching spot", error);
            setLoading(false);
            return;
        }

        setSpot(spotData);

        // 2. Fetch Reviews
        fetchReviews();

        // 3. Check Favorite Status
        if (user) {
            const { data: fav } = await supabase
                .from('favourites')
                .select('*')
                .eq('spot_id', id)
                .eq('user_id', user.id)
                .single();
            setIsFavorite(!!fav);
        }

        setLoading(false);
    };

    const fetchReviews = async () => {
        const { data: reviewsData } = await supabase
            .from('reviews')
            .select('*, user_id') // We just get ID, ideally we join profiles if available
            .eq('spot_id', id)
            .order('created_at', { ascending: false });
        setReviews(reviewsData || []);
    };

    const toggleFavorite = async () => {
        if (!user) return alert("Please login to favorite!");

        if (isFavorite) {
            await supabase.from('favourites').delete().eq('spot_id', id).eq('user_id', user.id);
            setIsFavorite(false);
            setToast({ message: "Removed from favorites", type: "success" });
        } else {
            await supabase.from('favourites').insert([{ spot_id: id, user_id: user.id }]);
            setIsFavorite(true);
            setToast({ message: "Added to favorites ❤️", type: "success" });
        }
    };

    const submitReview = async () => {
        if (!user) return alert("Please login to review!");
        if (!newReview.trim()) return;

        const { error } = await supabase.from('reviews').insert([{
            spot_id: id,
            user_id: user.id,
            rating: rating,
            comment: newReview
        }]);

        if (error) {
            setToast({ message: "Failed to post review", type: "error" });
        } else {
            setToast({ message: "Review posted!", type: "success" });
            setNewReview('');
            fetchReviews();
        }
    };

    const getDirections = () => {
        if (!spot || !spot.latitude || !spot.longitude) {
            setToast({ message: 'Location not available for this spot', type: 'error' });
            return;
        }

        const lat = spot.latitude;
        const lng = spot.longitude;
        const label = encodeURIComponent(spot.name);

        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
        const isAndroid = /Android/.test(navigator.userAgent);

        let mapsUrl;

        if (isIOS) {
            mapsUrl = `maps://maps.apple.com/?q=${label}&ll=${lat},${lng}&dirflg=d`;
        } else if (isAndroid) {
            mapsUrl = `google.navigation:q=${lat},${lng}`;
        } else {
            mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&destination_place_id=${label}`;
        }

        window.open(mapsUrl, '_blank');
    };

    if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>;
    if (!spot) return <div style={{ padding: '2rem', textAlign: 'center' }}>Spot not found</div>;

    return (
        <div style={{ paddingBottom: '20px', background: 'transparent' }}>
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

            {/* Header Image Container */}
            <div
                className="hide-scrollbar"
                style={{
                    position: 'relative',
                    height: '350px',
                    // display: 'flex', // Removed flex as ImageSlider takes full space
                    // overflowX: 'auto', // Removed scroll
                    // scrollSnapType: 'x mandatory', // Removed scroll snap
                    background: '#000'
                }}
            >
                <ImageSlider images={spot.images} />

                {/* View All Button - Positioned absolutely by parent container */}
                <button
                    onClick={() => setShowGallery(true)}
                    style={{
                        position: 'absolute', bottom: '20px', right: '20px',
                        background: 'rgba(0,0,0,0.6)', color: 'white', border: 'none',
                        padding: '6px 12px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: '600',
                        display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', zIndex: 30
                    }}
                >
                    View All ({spot.images?.length || 1})
                </button>

                {/* Back Button */}
                <button
                    onClick={() => navigate(-1)}
                    style={{
                        position: 'absolute', top: '20px', left: '20px',
                        background: 'rgba(255,255,255,0.9)', borderRadius: '50%',
                        padding: '10px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                        zIndex: 30
                    }}
                >
                    <ArrowLeft size={24} color="black" />
                </button>

                {/* Favorite & Share */}
                <div style={{ position: 'absolute', top: '20px', right: '20px', display: 'flex', gap: '10px', zIndex: 30 }}>
                    <button
                        onClick={toggleFavorite}
                        style={{
                            background: 'rgba(255,255,255,0.9)', borderRadius: '50%',
                            padding: '10px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                        }}
                    >
                        <Heart size={24} fill={isFavorite ? "#E23744" : "none"} color={isFavorite ? "#E23744" : "black"} />
                    </button>
                    <button
                        style={{
                            background: 'rgba(255,255,255,0.9)', borderRadius: '50%',
                            padding: '10px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                        }}
                    >
                        <Share2 size={24} color="black" />
                    </button>
                </div>
            </div>

            {/* Gallery Modal Portal */}
            {showGallery && (
                <div style={{
                    position: 'fixed', inset: 0, background: 'black', zIndex: 3000,
                    display: 'flex', flexDirection: 'column'
                }}>
                    <button
                        onClick={() => setShowGallery(false)}
                        style={{
                            position: 'absolute', top: '20px', right: '20px',
                            background: 'rgba(255,255,255,0.2)', color: 'white',
                            borderRadius: '50%', padding: '10px', border: 'none', zIndex: 10
                        }}
                    >
                        <X size={24} />
                    </button>
                    <div className="hide-scrollbar" style={{ padding: '20px', overflowY: 'auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '10px', marginTop: '60px' }}>
                        {(spot.images || ['https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80']).map((img, i) => (
                            <img key={i} src={img} style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '8px' }} />
                        ))}
                    </div>
                </div>
            )}

            {/* Content Body */}
            <div style={{
                marginTop: '-40px',
                background: 'white',
                borderTopLeftRadius: '30px',
                borderTopRightRadius: '30px',
                padding: '2rem',
                position: 'relative',
                minHeight: '60vh'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                    <div style={{ flex: 1 }}>
                        <h1 style={{ fontSize: '1.8rem', fontWeight: '800', margin: 0 }}>{spot.name}</h1>
                        <p style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '8px' }}>
                            <MapPin size={16} /> {spot.location_text || 'Kerala'}
                        </p>
                        {/* Get Directions Button */}
                        {spot.latitude && spot.longitude && (
                            <button
                                onClick={getDirections}
                                style={{
                                    marginTop: '8px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    padding: '8px 16px',
                                    background: 'linear-gradient(135deg, #4285F4 0%, #34A853 100%)',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    fontSize: '0.9rem',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    boxShadow: '0 2px 8px rgba(66, 133, 244, 0.3)',
                                    transition: 'all 0.2s ease'
                                }}
                                onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
                                onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
                            >
                                <Navigation size={16} />
                                Get Directions
                            </button>
                        )}
                        {/* Edit Spot Button - Available for all logged-in users */}
                        {user && (
                            <button
                                onClick={() => navigate(`/${lang}/edit-spot/${spot.id}`)}
                                style={{
                                    marginTop: '8px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    padding: '8px 16px',
                                    background: 'white',
                                    color: '#1a1a1a',
                                    border: '1px solid #e2e8f0',
                                    borderRadius: '8px',
                                    fontSize: '0.9rem',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                                    transition: 'all 0.2s ease'
                                }}
                                onMouseEnter={(e) => e.target.style.background = '#f8fafc'}
                                onMouseLeave={(e) => e.target.style.background = 'white'}
                            >
                                <Edit3 size={16} />
                                Suggest Edits
                            </button>
                        )}
                    </div>
                    <div style={{
                        background: 'var(--bg-cream)', padding: '6px 12px',
                        borderRadius: '12px', fontWeight: 'bold', color: 'var(--secondary)'
                    }}>
                        ${spot.price_level}/4
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '10px', marginTop: '1rem' }}>
                    {spot.tags && spot.tags.map(tag => (
                        <span key={tag} style={{
                            background: '#f3f4f6', padding: '4px 12px',
                            borderRadius: '20px', fontSize: '0.8rem', color: '#666'
                        }}>
                            {tag}
                        </span>
                    ))}
                </div>

                <p style={{ marginTop: '1.5rem', lineHeight: '1.6', color: '#444' }}>
                    {spot.description || "No description provided for this spot."}
                </p>

                <hr style={{ margin: '2rem 0', borderColor: '#eee' }} />

                {/* Reviews Section */}
                <div>
                    <h3 style={{ fontSize: '1.4rem', fontWeight: '700', marginBottom: '1rem' }}>Reviews ({reviews.length})</h3>

                    {/* Add Review */}
                    <div style={{ background: '#f9fafb', padding: '1rem', borderRadius: '16px', marginBottom: '2rem' }}>
                        <div style={{ display: 'flex', gap: '5px', marginBottom: '10px' }}>
                            {[1, 2, 3, 4, 5].map(star => (
                                <Star
                                    key={star}
                                    size={24}
                                    fill={star <= rating ? "#F2C94C" : "none"}
                                    color={star <= rating ? "#F2C94C" : "#ccc"}
                                    onClick={() => setRating(star)}
                                    style={{ cursor: 'pointer' }}
                                />
                            ))}
                        </div>
                        <textarea
                            placeholder="Write your review..."
                            value={newReview}
                            onChange={(e) => setNewReview(e.target.value)}
                            style={{
                                width: '100%', padding: '10px',
                                border: '1px solid #ddd', borderRadius: '8px',
                                minHeight: '80px', marginBottom: '10px',
                                fontFamily: 'inherit'
                            }}
                        />
                        <Button onClick={submitReview} style={{ width: '100%', justifyContent: 'center' }}>
                            Post Review <Send size={16} style={{ marginLeft: '8px' }} />
                        </Button>
                    </div>

                    {/* Review List */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {reviews.length === 0 ? (
                            <p style={{ fontStyle: 'italic', color: '#999' }}>No reviews yet. Be the first!</p>
                        ) : (
                            reviews.map(rev => (
                                <div key={rev.id} style={{ borderBottom: '1px solid #eee', paddingBottom: '1rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span style={{ fontWeight: '600' }}>User {rev.user_id?.substring(0, 6)}</span>
                                        <div style={{ display: 'flex' }}>
                                            {[...Array(rev.rating)].map((_, i) => (
                                                <Star key={i} size={12} fill="#F2C94C" color="#F2C94C" />
                                            ))}
                                        </div>
                                    </div>
                                    <p style={{ marginTop: '4px', fontSize: '0.9rem', color: '#555' }}>
                                        {rev.comment}
                                    </p>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SpotDetail;
