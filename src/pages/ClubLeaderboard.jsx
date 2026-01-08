import React, { useState, useEffect } from 'react';
import { Trophy, Users, Crown, Home, Plus, Heart, MessageCircle, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabaseClient';
import Community from './Community';
import Leaderboard from './Leaderboard';

// Completely new styled Community component with gradient background
const StyledCommunity = () => {
    const { user } = useAuth();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreate, setShowCreate] = useState(false);
    const [toast, setToast] = useState(null);

    useEffect(() => {
        const fetchPosts = async () => {
            setLoading(true);
            try {
                const { data: postsData, error: postsError } = await supabase.from('community_posts').select('*').order('created_at', { ascending: false });
                if (postsError) {
                    console.error('Error fetching posts:', postsError);
                } else {
                    setPosts(postsData || []);
                }
            } catch (error) {
                console.error('Error:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchPosts();
    }, []);

    return (
        <div style={{
            minHeight: 'calc(100vh - 60px)',
            background: 'linear-gradient(135deg, #fef3c7 0%, #fbbf24 50%, #f59e0b 100%)',
            paddingBottom: '80px'
        }}>
            {/* Community Header */}
            <div style={{
                textAlign: 'center',
                marginBottom: '30px',
                padding: '20px',
                background: 'rgba(255,255,255,0.1)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.2)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
            }}>
                <div style={{
                    width: '60px',
                    height: '60px',
                    background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 16px',
                    boxShadow: '0 4px 20px rgba(239, 68, 68, 0.3)'
                }}>
                    <Users size={30} color="white" />
                </div>
                <h2 style={{
                    fontSize: '1.8rem',
                    fontWeight: '800',
                    color: '#1f2937',
                    marginBottom: '8px'
                }}>
                    Community
                </h2>
                <p style={{
                    color: '#6b7280',
                    fontSize: '1rem',
                    margin: 0
                }}>
                    Share your food experiences with community
                </p>
            </div>

            {/* Create Post Button */}
            <div style={{ padding: '0 20px', marginBottom: '20px' }}>
                <button
                    onClick={() => setShowCreate(true)}
                    style={{
                        width: '100%',
                        background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                        color: 'white',
                        border: 'none',
                        padding: '16px',
                        borderRadius: '16px',
                        fontSize: '1rem',
                        fontWeight: '600',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        boxShadow: '0 4px 20px rgba(239, 68, 68, 0.3)',
                        cursor: 'pointer'
                    }}
                >
                    <Plus size={20} />
                    Create Post
                </button>
            </div>

            {/* Posts */}
            <div style={{ padding: '0 20px' }}>
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '40px' }}>
                        <div style={{
                            width: '40px',
                            height: '40px',
                            border: '4px solid rgba(239, 68, 68, 0.3)',
                            borderTop: '4px solid #ef4444',
                            borderRadius: '50%',
                            animation: 'spin 1s linear infinite',
                            margin: '0 auto'
                        }}></div>
                    </div>
                ) : posts.length === 0 ? (
                    <div style={{
                        textAlign: 'center',
                        padding: '40px',
                        background: 'rgba(255,255,255,0.1)',
                        borderRadius: '16px',
                        backdropFilter: 'blur(10px)'
                    }}>
                        <p style={{ color: '#6b7280', fontSize: '1rem' }}>No posts yet. Be the first to share!</p>
                    </div>
                ) : (
                    posts.map(post => (
                        <div key={post.id} style={{
                            background: 'rgba(255,255,255,0.1)',
                            borderRadius: '16px',
                            padding: '20px',
                            marginBottom: '16px',
                            backdropFilter: 'blur(10px)',
                            border: '1px solid rgba(255,255,255,0.2)',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
                                <div style={{
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: '50%',
                                    background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginRight: '12px'
                                }}>
                                    <User size={20} color="white" />
                                </div>
                                <div>
                                    <h4 style={{ color: '#1f2937', fontWeight: '700', margin: 0 }}>{post.user_name || 'Anonymous'}</h4>
                                    <p style={{ color: '#6b7280', fontSize: '0.9rem', margin: 0 }}>
                                        {new Date(post.created_at).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                            <p style={{ color: '#1f2937', lineHeight: '1.5', marginBottom: '12px' }}>{post.content}</p>
                            <div style={{ display: 'flex', gap: '16px' }}>
                                <button style={{
                                    background: 'none',
                                    border: 'none',
                                    color: '#ef4444',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '4px',
                                    cursor: 'pointer'
                                }}>
                                    <Heart size={16} />
                                    {post.likes || 0}
                                </button>
                                <button style={{
                                    background: 'none',
                                    border: 'none',
                                    color: '#6b7280',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '4px',
                                    cursor: 'pointer'
                                }}>
                                    <MessageCircle size={16} />
                                    {post.comments || 0}
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <style>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

// Completely new styled Leaderboard component with gradient background
const StyledLeaderboard = () => {
    const [leaders, setLeaders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            setLoading(true);
            try {
                // Fetch user statistics
                const { data: spots } = await supabase.from('spots').select('created_by');
                const { data: reviews } = await supabase.from('reviews').select('user_id');

                const stats = {};
                spots?.forEach(s => {
                    const uid = s.created_by;
                    if (uid) {
                        if (!stats[uid]) stats[uid] = { spots: 0, reviews: 0, xp: 0 };
                        stats[uid].spots += 1;
                        stats[uid].xp += 100;
                    }
                });
                reviews?.forEach(r => {
                    const uid = r.user_id;
                    if (uid) {
                        if (!stats[uid]) stats[uid] = { spots: 0, reviews: 0, xp: 0 };
                        stats[uid].reviews += 1;
                        stats[uid].xp += 10;
                    }
                });

                const userIds = Object.keys(stats);
                const { data: userPrefs } = await supabase.from('user_preferences').select('user_id, username, display_name, avatar_url').in('user_id', userIds);
                
                const prefsMap = {};
                userPrefs?.forEach(p => prefsMap[p.user_id] = p);

                const leaderboard = Object.keys(stats)
                    .map(uid => ({
                        id: uid,
                        name: prefsMap[uid]?.display_name || prefsMap[uid]?.username || 'Foodie',
                        avatar: prefsMap[uid]?.avatar_url,
                        ...stats[uid]
                    }))
                    .sort((a, b) => b.xp - a.xp)
                    .slice(0, 10);

                setLeaders(leaderboard);
            } catch (error) {
                console.error('Error fetching leaderboard:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchLeaderboard();
    }, []);

    return (
        <div style={{
            minHeight: 'calc(100vh - 60px)',
            background: 'linear-gradient(135deg, #fef3c7 0%, #fbbf24 50%, #f59e0b 100%)',
            paddingBottom: '80px'
        }}>
            {/* Leaderboard Header */}
            <div style={{
                textAlign: 'center',
                marginBottom: '30px',
                padding: '20px',
                background: 'rgba(255,255,255,0.1)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.2)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
            }}>
                <div style={{
                    width: '60px',
                    height: '60px',
                    background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 16px',
                    boxShadow: '0 4px 20px rgba(245, 158, 11, 0.3)'
                }}>
                    <Trophy size={30} color="white" />
                </div>
                <h2 style={{
                    fontSize: '1.8rem',
                    fontWeight: '800',
                    color: '#1f2937',
                    marginBottom: '8px'
                }}>
                    Leaderboard
                </h2>
                <p style={{
                    color: '#6b7280',
                    fontSize: '1rem',
                    margin: 0
                }}>
                    Top contributors in our food community
                </p>
            </div>

            {/* Leaderboard Content */}
            <div style={{ padding: '0 20px' }}>
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '40px' }}>
                        <div style={{
                            width: '40px',
                            height: '40px',
                            border: '4px solid rgba(245, 158, 11, 0.3)',
                            borderTop: '4px solid #f59e0b',
                            borderRadius: '50%',
                            animation: 'spin 1s linear infinite',
                            margin: '0 auto'
                        }}></div>
                    </div>
                ) : leaders.length === 0 ? (
                    <div style={{
                        textAlign: 'center',
                        padding: '40px',
                        background: 'rgba(255,255,255,0.1)',
                        borderRadius: '16px',
                        backdropFilter: 'blur(10px)'
                    }}>
                        <p style={{ color: '#6b7280', fontSize: '1rem' }}>No contributors yet. Start contributing!</p>
                    </div>
                ) : (
                    leaders.map((leader, index) => (
                        <div key={leader.id} style={{
                            background: index === 0 ? 'linear-gradient(135deg, rgba(254, 243, 199, 0.8), rgba(251, 191, 36, 0.8))' : 
                                       index === 1 ? 'linear-gradient(135deg, rgba(229, 231, 235, 0.8), rgba(209, 213, 219, 0.8))' :
                                       'rgba(255,255,255,0.1)',
                            borderRadius: '16px',
                            padding: '20px',
                            marginBottom: '16px',
                            backdropFilter: 'blur(10px)',
                            border: index === 0 ? '2px solid #f59e0b' : '1px solid rgba(255,255,255,0.2)',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <div style={{
                                    width: '50px',
                                    height: '50px',
                                    borderRadius: '50%',
                                    background: index === 0 ? 'linear-gradient(135deg, #f59e0b, #d97706)' : 
                                               index === 1 ? 'linear-gradient(135deg, #6b7280, #4b5563)' :
                                               'linear-gradient(135deg, #9ca3af, #6b7280)',
                                    color: 'white',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontWeight: '700',
                                    fontSize: '1.2rem',
                                    marginRight: '16px'
                                }}>
                                    {index + 1}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <h4 style={{ 
                                        fontWeight: '700', 
                                        color: '#1f2937',
                                        marginBottom: '4px'
                                    }}>
                                        {leader.name}
                                    </h4>
                                    <p style={{ 
                                        color: '#6b7280', 
                                        fontSize: '0.9rem',
                                        margin: 0
                                    }}>
                                        {leader.xp} XP • {leader.spots} spots • {leader.reviews} reviews
                                    </p>
                                </div>
                                <div style={{
                                    background: index === 0 ? '#f59e0b' : 
                                               index === 1 ? '#6b7280' : '#9ca3af',
                                    color: 'white',
                                    padding: '6px 12px',
                                    borderRadius: '20px',
                                    fontSize: '0.8rem',
                                    fontWeight: '600'
                                }}>
                                    {index === 0 ? '🏆 Champion' : 
                                     index === 1 ? '🥈 Rising Star' : 
                                     index === 2 ? '🥉 Contender' : '⭐ Contributor'}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <style>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

const ClubLeaderboard = ({ lang }) => {
    const [activeTab, setActiveTab] = useState('club');
    const navigate = useNavigate();

    const tabs = [
        { id: 'club', label: 'Club', icon: Users },
        { id: 'leaderboard', label: 'Leaderboard', icon: Crown },
        { id: 'home', label: 'Home', icon: Home }
    ];

    return (
        <div style={{ 
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #fef3c7 0%, #fbbf24 50%, #f59e0b 100%)',
            padding: '20px'
        }}>
            {/* Tab Content - Full Page */}
            <div
                style={{
                    minHeight: 'calc(100vh - 60px)', // Account for bottom nav
                    paddingBottom: '20px',
                    background: 'transparent'
                }}
            >
                {activeTab === 'club' && <StyledCommunity />}

                {activeTab === 'leaderboard' && <StyledLeaderboard />}
            </div>

            {/* Tab Navigation - Fixed at bottom with transparency */}
            <div style={{ 
                position: 'fixed',
                bottom: '20px',
                left: '50%',
                transform: 'translateX(-50%)',
                height: '60px',
                width: '90%',
                maxWidth: '400px',
                display: 'flex', 
                alignItems: 'center',
                justifyContent: 'space-around',
                padding: '0 20px',
                background: 'rgba(239, 68, 68, 0.8)', // Semi-transparent red
                backdropFilter: 'blur(10px)',
                borderRadius: '20px',
                zIndex: 1000,
                boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
                border: '1px solid rgba(255,255,255,0.2)'
            }}>
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => {
                            if (tab.id === 'home') {
                                navigate(`/${lang}/home`);
                            } else {
                                // Stay on same page, just change active tab
                                setActiveTab(tab.id);
                            }
                        }}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: 'white',
                            cursor: 'pointer',
                            padding: '8px',
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.3s ease',
                            opacity: activeTab === tab.id ? 1 : 0.7
                        }}
                    >
                        <tab.icon size={24} />
                    </button>
                ))}
            </div>
        </div>
    );
};

export default ClubLeaderboard;
