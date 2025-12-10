import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Settings, LogOut, Award, Star, MapPin } from 'lucide-react';
import Button from '../components/Button';
import SpotCard from '../components/SpotCard';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

const Profile = ({ lang }) => {
    const { user, signOut } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('favourites');

    const [stats, setStats] = useState({ spots: 0, reviews: 0, xp: 0 });

    useEffect(() => {
        if (user) {
            const fetchStats = async () => {
                const { count } = await supabase
                    .from('spots')
                    .select('*', { count: 'exact', head: true })
                    .eq('created_by', user.id);

                setStats(prev => ({ ...prev, spots: count || 0, xp: (count || 0) * 100 }));
            };
            fetchStats();
        }
    }, [user]);

    const userData = {
        name: user?.user_metadata?.full_name || "Foodie",
        avatar: user?.user_metadata?.avatar_url, // Keep existing avatar
        bio: "Exploring the best tastes around Kerala!",
        stats: [
            { label: 'Spots Added', value: stats.spots, icon: <MapPin size={20} /> },
            { label: 'Reviews', value: stats.reviews, icon: <Star size={20} /> },
            { label: 'XP Points', value: stats.xp, icon: <Award size={20} /> },
        ]
    };

    return (
        <div style={{ paddingBottom: '80px' }}>
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
                <div style={{ position: 'absolute', top: '1rem', right: '1rem' }}>
                    <button onClick={signOut} style={{ padding: '8px' }}>
                        <LogOut size={20} color="var(--danger)" />
                    </button>
                </div>

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
                        <img src={userData.avatar} alt="Profile" style={{ borderRadius: '50%' }} />
                    ) : (
                        <div style={{ width: '100%', height: '100%', background: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <User size={40} color="#999" />
                        </div>
                    )}
                </div>

                <h1 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '0.25rem' }}>{userData.name}</h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{userData.bio}</p>

                {/* Stats */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '2rem',
                    marginTop: '1.5rem'
                }}>
                    <div className="stat-item">
                        <span style={{ fontWeight: '800', fontSize: '1.2rem', display: 'block' }}>{userData.stats.spots}</span>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Spots</span>
                    </div>
                    <div className="stat-item">
                        <span style={{ fontWeight: '800', fontSize: '1.2rem', display: 'block' }}>{userData.stats.reviews}</span>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Reviews</span>
                    </div>
                    <div className="stat-item">
                        <span style={{ fontWeight: '800', fontSize: '1.2rem', display: 'block', color: 'var(--secondary)' }}>{userData.stats.xp}</span>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>XP Points</span>
                    </div>
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
            <div className="container" style={{ minHeight: '300px' }}>
                {activeTab === 'favourites' && (
                    <div style={{ textAlign: 'center', marginTop: '3rem', color: 'var(--text-muted)' }}>
                        <Heart size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
                        <p>No favourites yet. Start exploring!</p>
                    </div>
                )}

                {activeTab === 'reviews' && (
                    <div style={{ textAlign: 'center', marginTop: '3rem', color: 'var(--text-muted)' }}>
                        <Star size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
                        <p>You haven't reviewed any spots yet.</p>
                    </div>
                )}

                {activeTab === 'spots' && (
                    <div style={{ textAlign: 'center', marginTop: '3rem', color: 'var(--text-muted)' }}>
                        <MapPin size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
                        <p>You haven't added any spots yet.</p>
                        <Button variant="outline" style={{ margin: '1rem auto' }} onClick={() => navigate(`/${lang}/add-spot`)}>Add a Spot</Button>

                        <div style={{ marginTop: '2rem', borderTop: '1px solid #eee', paddingTop: '1rem' }}>
                            <p style={{ fontSize: '0.8rem', marginBottom: '8px' }}>Developer Options</p>
                            <button
                                onClick={() => navigate(`/${lang}/admin`)}
                                style={{ color: 'var(--primary)', fontWeight: 'bold', fontSize: '0.9rem' }}
                            >
                                Go to Admin Dashboard
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

// Helper Icon for Default State
const Heart = ({ size, style }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
    </svg>
)

export default Profile;
