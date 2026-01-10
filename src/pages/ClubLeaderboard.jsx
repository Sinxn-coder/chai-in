import React, { useState, useEffect } from 'react';
import { Trophy, Users, Crown, Home, Plus, Heart, MessageCircle, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabaseClient';
import Community from './Community';
import Leaderboard from './Leaderboard';
import { motion, AnimatePresence } from 'framer-motion';

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

const ClubLeaderboard = ({ lang }) => {
    const [activeTab, setActiveTab] = useState('club');
    const navigate = useNavigate();

    // Listen for tab changes from the ClubLeaderboardNav component
    useEffect(() => {
        const handleTabChange = (event) => {
            setActiveTab(event.detail.tabId);
        };

        window.addEventListener('clubLeaderboardTabChange', handleTabChange);
        return () => {
            window.removeEventListener('clubLeaderboardTabChange', handleTabChange);
        };
    }, []);

    return (
        <div style={{ 
            minHeight: '100vh',
            background: activeTab === 'club' ? '#f8f9fa' : 'linear-gradient(135deg, #fef3c7 0%, #fbbf24 50%, #f59e0b 100%)',
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
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ 
                            duration: 0.3, 
                            ease: [0.4, 0, 0.2, 1]
                        }}
                        style={{ width: '100%' }}
                    >
                        {activeTab === 'club' && <Community />}
                        {activeTab === 'leaderboard' && <Leaderboard />}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
};

export default ClubLeaderboard;
