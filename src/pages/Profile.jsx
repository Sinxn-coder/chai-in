import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Settings, LogOut, Award, Star, MapPin, Zap, Share2 } from 'lucide-react';
import Button from '../components/Button';
import SpotCard from '../components/SpotCard';
import LoadingAnimation from '../components/LoadingAnimation';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

// Helper Icon for Default State (Moved to top to avoid ReferenceError)
const Heart = ({ size, style }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
    </svg>
)

const Profile = ({ lang }) => {
    const { user, signOut } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('favourites');
    const [loading, setLoading] = useState(true);

    // User data state
    const [userPreferences, setUserPreferences] = useState(null);
    const [stats, setStats] = useState({ spots: 0, reviews: 0, xp: 0 });
    const [favouriteSpots, setFavouriteSpots] = useState([]);
    const [userReviews, setUserReviews] = useState([]);
    const [userSpots, setUserSpots] = useState([]);

    useEffect(() => {
        if (user) {
            fetchAllData();
        }
    }, [user]);

    const fetchAllData = async () => {
        setLoading(true);

        // Fetch user preferences first
        const { data: prefs } = await supabase
            .from('user_preferences')
            .select('*')
            .eq('user_id', user.id)
            .single();

        setUserPreferences(prefs);

        // Fetch user's spots count for stats
        const { count: spotsCount } = await supabase
            .from('spots')
            .select('*', { count: 'exact', head: true })
            .eq('created_by', user.id);

        // Fetch user's reviews count for stats
        const { count: reviewsCount } = await supabase
            .from('reviews')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', user.id);

        setStats({
            spots: spotsCount || 0,
            reviews: reviewsCount || 0,
            xp: ((spotsCount || 0) * 100) + ((reviewsCount || 0) * 10)
        });

        // Fetch favourites with spot details
        const { data: favData } = await supabase
            .from('favourites')
            .select('spot_id')
            .eq('user_id', user.id);

        if (favData && favData.length > 0) {
            const spotIds = favData.map(f => f.spot_id);
            const { data: spots } = await supabase
                .from('spots')
                .select('*')
                .in('id', spotIds);
            setFavouriteSpots(spots || []);
        }

        // Fetch user's reviews with spot details
        const { data: reviewsData } = await supabase
            .from('reviews')
            .select('*, spot_id')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

        if (reviewsData && reviewsData.length > 0) {
            const spotIds = reviewsData.map(r => r.spot_id);
            const { data: spots } = await supabase
                .from('spots')
                .select('*')
                .in('id', spotIds);

            // Merge reviews with spot data
            const reviewsWithSpots = reviewsData.map(review => ({
                ...review,
                spot: spots?.find(s => s.id === review.spot_id)
            }));
            setUserReviews(reviewsWithSpots);
        }

        // Fetch user's created spots
        const { data: userSpotsData } = await supabase
            .from('spots')
            .select('*')
            .eq('created_by', user.id)
            .order('created_at', { ascending: false });

        setUserSpots(userSpotsData || []);
        setLoading(false);
        setLoading(false);
    };

    const handleShare = () => {
        const link = `${window.location.origin}/login?ref=${user.id}`;
        const text = "Join me on chai. 🍵 to discover the best food spots in Kerala!";

        if (navigator.share) {
            navigator.share({
                title: 'Join chai.',
                text: text,
                url: link,
            }).catch(console.error);
        } else {
            // WhatsApp Fallback
            window.open(`https://wa.me/?text=${encodeURIComponent(text + " " + link)}`, '_blank');
            navigator.clipboard.writeText(link);
            // Assuming showToast is available or inherited (it was in the previous state, but let's check profile state)
            alert('Referral link copied & WhatsApp opened!');
        }
    };

    // Use custom name and avatar from preferences if available
    const userData = {
        name: userPreferences?.username || userPreferences?.display_name || user?.user_metadata?.full_name || "Chai Lover",
        avatar: userPreferences?.avatar_url || user?.user_metadata?.avatar_url || user?.user_metadata?.picture,
        bio: "Exploring the best tastes around Kerala!",
        stats: [
            { label: 'Spots Added', value: stats.spots, icon: <MapPin size={20} color="#E23744" /> },
            { label: 'Reviews', value: stats.reviews, icon: <Star size={20} color="#F2C94C" /> },
            { label: 'XP Points', value: stats.xp, icon: <Award size={20} color="#9B51E0" /> },
            { label: 'Day Streak', value: userPreferences?.streak_current || 0, icon: <Zap size={20} color="#FF6B35" /> },
        ]
    };

    return (
        <div style={{ paddingBottom: '80px', minHeight: '100vh' }}>
            {/* Header */}
            <div style={{
                background: 'var(--bg-white)',
                padding: '2rem 1rem',
                textAlign: 'center',
                borderBottomLeftRadius: '30px',
                borderBottomRightRadius: '30px',
                boxShadow: 'var(--shadow-md)',
                position: 'relative'
            }}>
                {/* Local Actions Removed - Use AppBar or Settings Page */}

                <div style={{
                    width: '100px',
                    height: '100px',
                    borderRadius: '50%',
                    overflow: 'hidden',
                    margin: '0 auto 1rem',
                    border: '4px solid var(--primary)',
                    padding: '2px',
                    background: 'white'
                }}>
                    {userData.avatar ? (
                        <img src={userData.avatar} alt="Profile" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                    ) : (
                        <div style={{ width: '100%', height: '100%', background: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <User size={40} color="#999" />
                        </div>
                    )}
                </div>

                <h1 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '0.25rem' }}>{userData.name}</h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{userData.bio}</p>

                {/* Stats - Render Safe */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '1.5rem',
                    marginTop: '1rem'
                }}>
                    {userData.stats && userData.stats.map((stat, index) => (
                        <div key={index} className="stat-item" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                {stat.icon}
                                <span style={{ fontWeight: '800', fontSize: '1.2rem', color: stat.color || 'inherit' }}>
                                    {stat.value}
                                </span>
                            </div>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{stat.label}</span>
                        </div>
                    ))}
                </div>

                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
                    <button
                        onClick={handleShare}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '8px',
                            background: '#f0f9ff', color: '#0284c7',
                            padding: '8px 16px', borderRadius: '20px',
                            fontWeight: '600', border: '1px solid #bae6fd',
                            fontSize: '0.9rem'
                        }}
                    >
                        <Share2 size={18} />
                        Invite Friends (+50 XP)
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div style={{
                display: 'flex',
                padding: '1rem',
                gap: '1rem',
                justifyContent: 'center'
            }}>
                {['favourites', 'reviews', 'spots'].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        style={{
                            padding: '8px 16px',
                            borderRadius: 'var(--radius-full)',
                            background: activeTab === tab ? 'var(--text-main)' : 'transparent',
                            color: activeTab === tab ? 'white' : 'var(--text-muted)',
                            fontWeight: '600',
                            textTransform: 'capitalize',
                            transition: 'all 0.2s ease'
                        }}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Content Area */}
            <div className="container" style={{ minHeight: '300px', padding: '0 1rem' }}>
                {loading ? (
                    <LoadingAnimation />
                ) : (
                    <>
                        {activeTab === 'favourites' && (
                            <>
                                {favouriteSpots.length > 0 ? (
                                    <div className="spots-grid">
                                        {favouriteSpots.map(spot => (
                                            <SpotCard key={spot.id} spot={spot} />
                                        ))}
                                    </div>
                                ) : (
                                    <div style={{ textAlign: 'center', marginTop: '3rem', color: 'var(--text-muted)' }}>
                                        <Heart size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
                                        <p>No favourites yet. Start exploring!</p>
                                    </div>
                                )}
                            </>
                        )}

                        {activeTab === 'reviews' && (
                            <>
                                {userReviews.length > 0 ? (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                        {userReviews.map(review => (
                                            <div key={review.id} style={{
                                                background: 'white',
                                                borderRadius: 'var(--radius-lg)',
                                                padding: '1rem',
                                                boxShadow: 'var(--shadow-sm)'
                                            }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem' }}>
                                                    <h3 style={{ fontSize: '1.1rem', fontWeight: '700', margin: 0 }}>
                                                        {review.spot?.name || 'Unknown Spot'}
                                                    </h3>
                                                    <div style={{ display: 'flex', gap: '2px' }}>
                                                        {[...Array(review.rating)].map((_, i) => (
                                                            <Star key={i} size={14} fill="#F2C94C" color="#F2C94C" />
                                                        ))}
                                                    </div>
                                                </div>
                                                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>
                                                    {review.comment}
                                                </p>
                                                <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '0.5rem' }}>
                                                    {new Date(review.created_at).toLocaleDateString()}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div style={{ textAlign: 'center', marginTop: '3rem', color: 'var(--text-muted)' }}>
                                        <Star size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
                                        <p>You haven't reviewed any spots yet.</p>
                                    </div>
                                )}
                            </>
                        )}

                        {activeTab === 'spots' && (
                            <>
                                {userSpots.length > 0 ? (
                                    <div className="spots-grid">
                                        {userSpots.map(spot => (
                                            <SpotCard key={spot.id} spot={spot} />
                                        ))}
                                    </div>
                                ) : (
                                    <div style={{ textAlign: 'center', marginTop: '3rem', color: 'var(--text-muted)' }}>
                                        <MapPin size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
                                        <p>You haven't added any spots yet.</p>
                                        <Button variant="outline" style={{ margin: '1rem auto' }} onClick={() => navigate(`/${lang}/add-spot`)}>Add a Spot</Button>
                                    </div>
                                )}
                            </>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default Profile;
