import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Heart, MessageCircle, User as UserIcon, Loader, X } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '../context/AuthContext';
import Toast from '../components/Toast';
import { motion, AnimatePresence } from 'framer-motion';

const SavedPosts = ({ onClose }) => {
    const { user } = useAuth();
    const [savedPosts, setSavedPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState(null);

    const fetchSavedPosts = async () => {
        if (!user) {
            setLoading(false);
            return;
        }

        try {
            // Fetch saved posts with post details
            const { data: savedPostsData, error: savedError } = await supabase
                .from('saved_posts')
                .select(`
                    post_id,
                    community_posts (
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
                    )
                `)
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (savedError) {
                console.error('Error fetching saved posts:', savedError);
                setToast({ message: 'Failed to load saved posts', type: 'error' });
                return;
            }

            // Process the data
            const processedPosts = savedPostsData.map(item => ({
                ...item.community_posts,
                author: item.community_posts.user_preferences || { 
                    display_name: 'Foodie', 
                    username: null, 
                    avatar_url: null 
                }
            }));

            console.log('Saved posts:', processedPosts);
            setSavedPosts(processedPosts);
        } catch (error) {
            console.error('Error:', error);
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
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0,0,0,0.8)',
                zIndex: 9999,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                style={{
                    background: '#ffffff',
                    borderRadius: '20px',
                    padding: '24px',
                    width: '90%',
                    maxWidth: '800px',
                    maxHeight: '80vh',
                    overflowY: 'auto',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <h3 style={{ fontSize: '1.4rem', fontWeight: '700', color: '#1a1a1a', margin: 0 }}>Saved Posts</h3>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}>
                        <X size={24} color="#666" />
                    </button>
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                        <Loader className="animate-spin" color="#666" size={32} />
                        <p style={{ color: '#666', marginTop: '16px', fontSize: '1rem' }}>Loading saved posts...</p>
                    </div>
                ) : savedPosts.length === 0 ? (
                    <div style={{ 
                        textAlign: 'center', 
                        padding: '80px 20px',
                        background: '#f8f9fa',
                        borderRadius: '16px'
                    }}>
                        <div style={{ 
                            width: '80px', 
                            height: '80px', 
                            background: '#e9ecef', 
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 20px'
                        }}>
                            <Heart size={32} color="#666" />
                        </div>
                        <h3 style={{ color: '#1a1a1a', fontWeight: '700', margin: '0 0 12px 0', fontSize: '1.2rem' }}>No saved posts</h3>
                        <p style={{ color: '#666', fontSize: '0.95rem', lineHeight: '1.5' }}>
                            Start saving posts you love to see them here!
                        </p>
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
            </motion.div>
        </motion.div>
    );
};

export default SavedPosts;
