import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Heart, MessageCircle, User as UserIcon, Loader, X, ArrowLeft, Bookmark } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '../context/AuthContext';
import Toast from '../components/Toast';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const SavedPostsPage = ({ lang = 'en' }) => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [savedPosts, setSavedPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState(null);

    const fetchSavedPosts = async () => {
        if (!user) {
            setLoading(false);
            return;
        }

        try {
            console.log('🔍 Fetching saved posts for user:', user.id);
            
            // First fetch saved posts references
            const { data: savedPostsData, error: savedError } = await supabase
                .from('saved_posts')
                .select('post_id, created_at')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (savedError) {
                console.error('❌ Error fetching saved posts references:', savedError);
                setToast({ message: 'Failed to load saved posts', type: 'error' });
                setLoading(false);
                return;
            }

            console.log('📊 Saved posts references:', savedPostsData);

            if (savedPostsData && savedPostsData.length > 0) {
                // Get the post IDs
                const postIds = savedPostsData.map(item => item.post_id);
                
                // Fetch the actual posts with user details
                const { data: postsData, error: postsError } = await supabase
                    .from('community_posts')
                    .select(`
                        id,
                        image_url,
                        caption,
                        created_at,
                        user_id,
                        user_preferences (
                            username,
                            display_name,
                            avatar_url
                        )
                    `)
                    .in('id', postIds)
                    .order('created_at', { ascending: false });

                if (postsError) {
                    console.error('❌ Error fetching posts:', postsError);
                    setToast({ message: 'Failed to load posts', type: 'error' });
                    setLoading(false);
                    return;
                }

                console.log('📝 Posts data:', postsData);

                // Process the data
                const processedPosts = postsData.map(post => ({
                    ...post,
                    author: post.user_preferences || { 
                        display_name: 'Foodie', 
                        username: null, 
                        avatar_url: null 
                    }
                }));

                console.log('✨ Processed saved posts:', processedPosts);
                setSavedPosts(processedPosts);
            } else {
                console.log('📭 No saved posts found');
                setSavedPosts([]);
            }
        } catch (error) {
            console.error('💥 Error in fetchSavedPosts:', error);
            setToast({ message: 'Failed to load saved posts', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSavedPosts();
    }, [user]);

    const handleUnsave = async (postId) => {
        try {
            await supabase
                .from('saved_posts')
                .delete()
                .eq('user_id', user.id)
                .eq('post_id', postId);

            setSavedPosts(savedPosts.filter(post => post.id !== postId));
            setToast({ message: 'Post removed from saved', type: 'success' });
        } catch (error) {
            console.error('Error unsaving post:', error);
            setToast({ message: 'Failed to unsave post', type: 'error' });
        }
    };

    return (
        <div style={{ 
            minHeight: '100vh', 
            background: '#f8f9fa',
            paddingBottom: '80px'
        }}>
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

            {/* Header with Curves */}
            <div style={{ 
                padding: '20px', 
                background: '#ffffff',
                borderBottom: '1px solid #e9ecef',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                borderRadius: '0 0 30px 30px',
                position: 'relative',
                overflow: 'hidden'
            }}>
                <div style={{ 
                    position: 'absolute',
                    top: '-50px',
                    left: '-50px',
                    width: '150px',
                    height: '150px',
                    background: 'linear-gradient(135deg, #007bff, #0056b3)',
                    borderRadius: '50%',
                    opacity: 0.1
                }} />
                <div style={{ 
                    position: 'absolute',
                    top: '-30px',
                    right: '-30px',
                    width: '100px',
                    height: '100px',
                    background: 'linear-gradient(135deg, #007bff, #0056b3)',
                    borderRadius: '50%',
                    opacity: 0.1
                }} />
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', zIndex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={() => navigate(-1)}
                            style={{ 
                                background: 'rgba(0,123,255,0.1)', 
                                border: 'none', 
                                padding: '10px', 
                                borderRadius: '15px', 
                                cursor: 'pointer'
                            }}
                        >
                            <ArrowLeft size={20} color="#007bff" />
                        </motion.button>
                        <div>
                            <h1 style={{ fontSize: '1.8rem', fontWeight: '700', color: '#1a1a1a', margin: '0 0 4px 0' }}>Saved Posts</h1>
                            <p style={{ fontSize: '0.95rem', color: '#666', margin: 0 }}>Your favorite food memories</p>
                        </div>
                    </div>
                    <div style={{
                        width: '50px',
                        height: '50px',
                        background: 'linear-gradient(135deg, #007bff, #0056b3)',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 4px 12px rgba(0,123,255,0.3)'
                    }}>
                        <Bookmark size={24} color="white" />
                    </div>
                </div>
            </div>

            {/* Posts */}
            <div style={{ padding: '20px' }}>
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                        <Loader className="animate-spin" color="#666" size={32} />
                        <p style={{ color: '#666', marginTop: '16px', fontSize: '1rem' }}>Loading saved posts...</p>
                    </div>
                ) : savedPosts.length === 0 ? (
                    <div style={{ 
                        textAlign: 'center', 
                        padding: '80px 20px',
                        background: '#ffffff',
                        borderRadius: '16px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
                    }}>
                        <div style={{ 
                            width: '100px', 
                            height: '100px', 
                            background: '#f8f9fa', 
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 24px',
                            border: '2px solid #e9ecef'
                        }}>
                            <Bookmark size={36} color="#666" />
                        </div>
                        <h3 style={{ color: '#1a1a1a', fontWeight: '700', margin: '0 0 12px 0', fontSize: '1.3rem' }}>No saved posts</h3>
                        <p style={{ color: '#666', fontSize: '1rem', lineHeight: '1.6', marginBottom: '24px' }}>
                            Start saving posts you love to see them here! 🍽️
                        </p>
                        <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={() => navigate('/community')}
                            style={{
                                padding: '14px 28px',
                                borderRadius: '20px',
                                background: '#007bff',
                                color: 'white',
                                border: 'none',
                                fontWeight: '600',
                                cursor: 'pointer',
                                fontSize: '1rem',
                                boxShadow: '0 4px 12px rgba(0,123,255,0.3)'
                            }}
                        >
                            Explore Community
                        </motion.button>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                        {savedPosts.map((post, index) => (
                            <motion.div
                                key={post.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                style={{ 
                                    background: '#ffffff', 
                                    borderRadius: '16px', 
                                    overflow: 'hidden',
                                    boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
                                    border: '1px solid #e9ecef'
                                }}
                            >
                                {/* Post Header */}
                                <div style={{ padding: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <div style={{ 
                                        width: '32px', 
                                        height: '32px', 
                                        borderRadius: '50%', 
                                        background: '#f8f9fa', 
                                        overflow: 'hidden',
                                        flexShrink: 0
                                    }}>
                                        {post.author.avatar_url ? (
                                            <img src={post.author.avatar_url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        ) : (
                                            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <UserIcon size={16} color="#666" />
                                            </div>
                                        )}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontWeight: '600', fontSize: '0.85rem', color: '#1a1a1a' }}>
                                            {post.author.username || post.author.display_name}
                                        </div>
                                        <div style={{ fontSize: '0.75rem', color: '#666' }}>
                                            {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
                                        </div>
                                    </div>
                                </div>

                                {/* Post Image */}
                                <div style={{ position: 'relative', width: '100%', paddingTop: '100%' }}>
                                    <img 
                                        src={post.image_url} 
                                        style={{ 
                                            position: 'absolute', 
                                            top: 0, 
                                            left: 0, 
                                            width: '100%', 
                                            height: '100%', 
                                            objectFit: 'cover' 
                                        }} 
                                        onError={(e) => {
                                            e.target.style.display = 'none';
                                        }}
                                    />
                                </div>

                                {/* Post Actions */}
                                <div style={{ padding: '12px' }}>
                                    {post.caption && (
                                        <div style={{ 
                                            fontSize: '0.85rem', 
                                            lineHeight: '1.4', 
                                            color: '#1a1a1a',
                                            marginBottom: '8px'
                                        }}>
                                            {post.caption.length > 50 ? post.caption.substring(0, 50) + '...' : post.caption}
                                        </div>
                                    )}
                                    
                                    <button
                                        onClick={() => handleUnsave(post.id)}
                                        style={{
                                            background: '#dc3545',
                                            color: 'white',
                                            border: 'none',
                                            padding: '8px 16px',
                                            borderRadius: '12px',
                                            fontWeight: '600',
                                            cursor: 'pointer',
                                            fontSize: '0.8rem',
                                            width: '100%'
                                        }}
                                    >
                                        Remove from Saved
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SavedPostsPage;
