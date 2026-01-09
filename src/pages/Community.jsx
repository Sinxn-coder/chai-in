import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Heart, MessageCircle, Plus, User as UserIcon, Loader, Camera, Image as ImageIcon, X } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '../context/AuthContext';
import Toast from '../components/Toast';
import { motion, AnimatePresence } from 'framer-motion';

const Community = () => {
    const { user } = useAuth();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreate, setShowCreate] = useState(false);
    const [toast, setToast] = useState(null);
    const [selectedPost, setSelectedPost] = useState(null);
    const [createStep, setCreateStep] = useState('initial');
    const [selectedImage, setSelectedImage] = useState(null);
    const [caption, setCaption] = useState('');
    const [uploading, setUploading] = useState(false);

    const fetchPosts = async () => {
        console.log('Fetching posts...');
        setLoading(true);
        
        try {
            const { data: postsData, error: postsError } = await supabase
                .from('community_posts')
                .select('*')
                .order('created_at', { ascending: false });

            if (postsError) {
                console.error('Error fetching posts:', postsError);
                setToast({ message: 'Failed to load posts', type: 'error' });
                setLoading(false);
                return;
            }

            console.log('Raw posts data:', postsData);

            if (postsData && postsData.length > 0) {
                const userIds = [...new Set(postsData.map(p => p.user_id))];
                console.log('User IDs to fetch:', userIds);
                
                const { data: usersData, error: usersError } = await supabase
                    .from('user_preferences')
                    .select('user_id, username, display_name, avatar_url')
                    .in('user_id', userIds);
                
                if (usersError) {
                    console.error('Error fetching users:', usersError);
                }
                
                console.log('Users data:', usersData);
                
                const userMap = {};
                usersData?.forEach(u => userMap[u.user_id] = u);

                // Fetch all likes for these posts
                const postIds = postsData.map(p => p.id);
                const { data: allLikesData, error: likesError } = await supabase
                    .from('post_likes')
                    .select('post_id, user_id')
                    .in('post_id', postIds);

                if (likesError) {
                    console.error('Error fetching likes:', likesError);
                }

                console.log('Likes data:', allLikesData);

                // Count likes per post
                const likesCountMap = {};
                const userLikesMap = {};
                allLikesData?.forEach(like => {
                    likesCountMap[like.post_id] = (likesCountMap[like.post_id] || 0) + 1;
                    if (like.user_id === user?.id) {
                        userLikesMap[like.post_id] = true;
                    }
                });

                const processedPosts = postsData.map(p => ({
                    ...p,
                    likes_count: likesCountMap[p.id] || 0,
                    author: userMap[p.user_id] || { display_name: 'Foodie', username: null },
                    isLikedByUser: !!userLikesMap[p.id]
                }));

                console.log('Processed posts:', processedPosts);
                setPosts(processedPosts);
            } else {
                console.log('No posts found');
                setPosts([]);
            }
        } catch (error) {
            console.error('Error in fetchPosts:', error);
            setToast({ message: 'Failed to load posts', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
        
        // Listen for profile updates to refresh post author names
        const handleProfileUpdate = () => {
            fetchPosts();
        };
        window.addEventListener('userProfileUpdated', handleProfileUpdate);
        
        // Set up real-time subscription for community_posts changes
        const subscription = supabase
            .channel('community_posts_changes')
            .on('postgres_changes', 
                { 
                    event: 'INSERT', 
                    schema: 'public', 
                    table: 'community_posts' 
                }, 
                (payload) => {
                    console.log('New post detected:', payload);
                    fetchPosts();
                }
            )
            .subscribe();
        
        return () => {
            window.removeEventListener('userProfileUpdated', handleProfileUpdate);
            supabase.removeChannel(subscription);
        };
    }, [user]);

    const handlePostComplete = async (imageFile, caption) => {
        console.log('Starting post creation...', { imageFile: imageFile.name, caption });
        
        try {
            // Check if user already has preferences
            const { data: existingPrefs, error: prefsError } = await supabase
                .from('user_preferences')
                .select('*')
                .eq('user_id', user.id)
                .maybeSingle();
            
            if (prefsError) {
                console.error('Error checking user preferences:', prefsError);
            }
            
            console.log('User preferences check:', existingPrefs);
            
            if (!existingPrefs) {
                console.log('Creating user preferences...');
                // Only create preferences if they don't exist
                const { data: newPrefs, error: createPrefsError } = await supabase
                    .from('user_preferences')
                    .insert({
                        user_id: user.id,
                        display_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
                        avatar_url: user.user_metadata?.avatar_url || null,
                        notifications_enabled: true,
                        notify_new_spots: true,
                        notify_review_replies: true,
                        notify_weekly_digest: false
                    })
                    .select()
                    .single();
                
                if (createPrefsError) {
                    console.error('Error creating user preferences:', createPrefsError);
                    throw createPrefsError;
                }
                
                console.log('User preferences created:', newPrefs);
            }

            console.log('Uploading image...');
            const fileName = `${user.id}-${Date.now()}.${imageFile.name.split('.').pop()}`;
            const { error: uploadError } = await supabase.storage
                .from('food-images')
                .upload(`community/${fileName}`, imageFile);
            
            if (uploadError) {
                console.error('Image upload error:', uploadError);
                throw uploadError;
            }
            
            const { data: { publicUrl } } = supabase.storage
                .from('food-images')
                .getPublicUrl(`community/${fileName}`);
            console.log('Image uploaded successfully:', publicUrl);

            console.log('Creating post in database...');
            const { data: postData, error: postError } = await supabase
                .from('community_posts')
                .insert({ 
                    user_id: user.id, 
                    image_url: publicUrl, 
                    caption: caption
                })
                .select()
                .single();
            
            if (postError) {
                console.error('Post creation error:', postError);
                throw postError;
            }
            
            console.log('Post created successfully:', postData);
            
            setToast({ message: "Shared with community! ✨", type: 'success' });
            setShowCreate(false);
            setCreateStep('initial');
            setSelectedImage(null);
            setCaption('');
            
            console.log('Refreshing posts...');
            await fetchPosts();
            
        } catch (error) {
            console.error('Complete post creation error:', error);
            setToast({ message: "Failed to share post: " + error.message, type: 'error' });
        }
    };

    const handleLike = async (postId, currentLikes) => {
        if (!user) {
            setToast({ message: 'Please login to like posts', type: 'error' });
            return;
        }

        try {
            // Check if user already liked this post
            const { data: existingLike } = await supabase
                .from('post_likes')
                .select('*')
                .eq('post_id', postId)
                .eq('user_id', user.id)
                .maybeSingle();

            if (existingLike) {
                // Unlike
                await supabase.from('post_likes').delete().eq('id', existingLike.id);
                // Update local state immediately without full reload
                setPosts(posts.map(post => 
                    post.id === postId 
                        ? { ...post, likes_count: Math.max(0, post.likes_count - 1), isLikedByUser: false }
                        : post
                ));
            } else {
                // Like
                await supabase.from('post_likes').insert({ post_id: postId, user_id: user.id });
                // Update local state immediately without full reload
                setPosts(posts.map(post => 
                    post.id === postId 
                        ? { ...post, likes_count: (post.likes_count || 0) + 1, isLikedByUser: true }
                        : post
                ));
            }
        } catch (error) {
            console.error('Error toggling like:', error);
            setToast({ message: 'Failed to update like', type: 'error' });
        }
    };

    const Comments = ({ post, onClose }) => {
        const [comments, setComments] = useState([]);
        const [newComment, setNewComment] = useState('');
        const [loading, setLoading] = useState(true);

        const fetchComments = async () => {
            setLoading(true);
            const { data: commentsData } = await supabase
                .from('post_comments')
                .select('*')
                .eq('post_id', post.id)
                .order('created_at', { ascending: false });
            
            if (commentsData) {
                const userIds = [...new Set(commentsData.map(c => c.user_id))];
                const { data: usersData } = await supabase
                    .from('user_preferences')
                    .select('user_id, display_name, avatar_url')
                    .in('user_id', userIds);
                const userMap = {};
                usersData?.forEach(u => userMap[u.user_id] = u);
                
                setComments(commentsData.map(c => ({
                    ...c,
                    user: userMap[c.user_id] || { display_name: 'User', avatar_url: null }
                })));
            } else {
                setComments([]);
            }
            setLoading(false);
        };

        useEffect(() => {
            fetchComments();
        }, [post.id]);

        const handleCommentSubmit = async () => {
            if (!newComment.trim() || !user) return;
            
            try {
                await supabase.from('post_comments').insert({
                    post_id: post.id,
                    user_id: user.id,
                    comment: newComment.trim()
                });
                
                setNewComment('');
                fetchComments();
                setToast({ message: 'Comment added!', type: 'success' });
            } catch (error) {
                console.error('Error adding comment:', error);
                setToast({ message: 'Failed to add comment', type: 'error' });
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
                    background: 'rgba(0,0,0,0.7)',
                    zIndex: 9999,
                    display: 'flex',
                    alignItems: 'flex-end'
                }}
                onClick={onClose}
            >
                <motion.div
                    initial={{ y: '100%' }}
                    animate={{ y: 0 }}
                    exit={{ y: '100%' }}
                    style={{
                        background: 'linear-gradient(135deg, #fef3c7 0%, #fbbf24 50%, #f59e0b 100%)',
                        width: '100%',
                        borderTopLeftRadius: '24px',
                        borderTopRightRadius: '24px',
                        padding: '20px',
                        maxHeight: '70vh',
                        overflowY: 'auto'
                    }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#1f2937', margin: 0 }}>Comments</h3>
                        <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                            <X size={24} color="#6b7280" />
                        </button>
                    </div>

                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '20px' }}>
                            <Loader className="animate-spin" color="#f59e0b" />
                        </div>
                    ) : (
                        <>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px', maxHeight: '300px', overflowY: 'auto' }}>
                                {comments.length === 0 ? (
                                    <div style={{ textAlign: 'center', padding: '20px', color: '#6b7280' }}>
                                        No comments yet. Be the first to comment!
                                    </div>
                                ) : (
                                    comments.map(c => (
                                        <div key={c.id} style={{ display: 'flex', gap: '12px', padding: '12px', background: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}>
                                            <div style={{ 
                                                width: '32px', 
                                                height: '32px', 
                                                borderRadius: '50%', 
                                                background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                                                overflow: 'hidden',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                flexShrink: 0
                                            }}>
                                                {c.user?.avatar_url ? (
                                                    <img src={c.user.avatar_url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                ) : (
                                                    <UserIcon size={16} color="white" />
                                                )}
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <div style={{ fontWeight: '700', fontSize: '0.9rem', color: '#1f2937', marginBottom: '4px' }}>
                                                    {c.user?.display_name || 'User'}
                                                </div>
                                                <div style={{ color: '#6b7280', fontSize: '0.85rem', lineHeight: '1.4' }}>
                                                    {c.comment}
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            <div style={{ display: 'flex', gap: '8px' }}>
                                <input
                                    type="text"
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    placeholder="Add a comment..."
                                    style={{ 
                                        flex: 1, 
                                        padding: '12px', 
                                        borderRadius: '20px', 
                                        border: '1px solid rgba(255,255,255,0.3)', 
                                        outline: 'none', 
                                        fontWeight: '500',
                                        background: 'rgba(255,255,255,0.1)',
                                        backdropFilter: 'blur(10px)',
                                        color: '#1f2937'
                                    }}
                                />
                                <button 
                                    onClick={handleCommentSubmit} 
                                    style={{ 
                                        padding: '12px 16px', 
                                        borderRadius: '20px', 
                                        background: 'linear-gradient(135deg, #ef4444, #dc2626)', 
                                        color: 'white', 
                                        border: 'none', 
                                        fontWeight: '700',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Send
                                </button>
                            </div>
                        </>
                    )}
                </motion.div>
            </motion.div>
        );
    };

    const CreatePostModal = () => {
        const handleImageSelect = (file) => {
            if (file) {
                setSelectedImage(file);
                setCreateStep('caption');
            }
        };

        const handleFileInput = (e) => {
            const file = e.target.files[0];
            handleImageSelect(file);
        };

        const handleSubmit = async () => {
            if (!selectedImage || !caption.trim()) {
                setToast({ message: 'Please add image and caption', type: 'error' });
                return;
            }

            setUploading(true);
            await handlePostComplete(selectedImage, caption.trim());
            setUploading(false);
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
                onClick={() => setShowCreate(false)}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    style={{
                        background: 'linear-gradient(135deg, #fef3c7 0%, #fbbf24 50%, #f59e0b 100%)',
                        borderRadius: '24px',
                        padding: '24px',
                        width: '90%',
                        maxWidth: '400px',
                        boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
                    }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <h3 style={{ fontSize: '1.3rem', fontWeight: '800', color: '#1f2937', margin: 0 }}>Create Post</h3>
                        <button onClick={() => setShowCreate(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                            <X size={24} color="#6b7280" />
                        </button>
                    </div>

                    {createStep === 'initial' && (
                        <div style={{ textAlign: 'center' }}>
                            <div style={{
                                width: '120px',
                                height: '120px',
                                border: '3px dashed rgba(255,255,255,0.3)',
                                borderRadius: '20px',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto 20px',
                                cursor: 'pointer',
                                background: 'rgba(255,255,255,0.05)'
                            }}
                            onClick={() => document.getElementById('fileInput').click()}
                            >
                                <ImageIcon size={32} color="#6b7280" />
                                <span style={{ color: '#6b7280', fontSize: '0.9rem', marginTop: '8px' }}>Add Photo</span>
                            </div>
                            
                            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                                <button
                                    onClick={() => document.getElementById('fileInput').click()}
                                    style={{
                                        padding: '12px 20px',
                                        borderRadius: '20px',
                                        background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                                        color: 'white',
                                        border: 'none',
                                        fontWeight: '700',
                                        cursor: 'pointer'
                                    }}
                                >
                                    <ImageIcon size={18} style={{ marginRight: '8px' }} />
                                    Gallery
                                </button>
                                <input
                                    id="fileInput"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileInput}
                                    style={{ display: 'none' }}
                                />
                            </div>
                        </div>
                    )}

                    {createStep === 'caption' && selectedImage && (
                        <div>
                            <div style={{
                                width: '100%',
                                height: '200px',
                                borderRadius: '16px',
                                overflow: 'hidden',
                                marginBottom: '16px',
                                background: 'rgba(255,255,255,0.1)'
                            }}>
                                <img 
                                    src={URL.createObjectURL(selectedImage)} 
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                                />
                            </div>
                            
                            <textarea
                                value={caption}
                                onChange={(e) => setCaption(e.target.value)}
                                placeholder="Share your food experience..."
                                style={{
                                    width: '100%',
                                    padding: '16px',
                                    borderRadius: '16px',
                                    border: '1px solid rgba(255,255,255,0.3)',
                                    outline: 'none',
                                    fontWeight: '500',
                                    background: 'rgba(255,255,255,0.1)',
                                    backdropFilter: 'blur(10px)',
                                    color: '#1f2937',
                                    fontSize: '1rem',
                                    minHeight: '100px',
                                    resize: 'vertical',
                                    marginBottom: '16px'
                                }}
                            />
                            
                            <div style={{ display: 'flex', gap: '12px' }}>
                                <button
                                    onClick={() => setCreateStep('initial')}
                                    style={{
                                        padding: '12px 20px',
                                        borderRadius: '20px',
                                        background: 'rgba(255,255,255,0.1)',
                                        color: '#6b7280',
                                        border: '1px solid rgba(255,255,255,0.3)',
                                        fontWeight: '700',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Back
                                </button>
                                <button
                                    onClick={handleSubmit}
                                    disabled={uploading}
                                    style={{
                                        padding: '12px 24px',
                                        borderRadius: '20px',
                                        background: uploading ? 'rgba(255,255,255,0.3)' : 'linear-gradient(135deg, #ef4444, #dc2626)',
                                        color: 'white',
                                        border: 'none',
                                        fontWeight: '700',
                                        cursor: uploading ? 'not-allowed' : 'pointer',
                                        flex: 1
                                    }}
                                >
                                    {uploading ? (
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <Loader className="animate-spin" size={16} />
                                            <span style={{ marginLeft: '8px' }}>Posting...</span>
                                        </div>
                                    ) : (
                                        'Share Post'
                                    )}
                                </button>
                            </div>
                        </div>
                    )}
                </motion.div>
            </motion.div>
        );
    };

    return (
        <div style={{ 
            minHeight: '100vh', 
            background: 'linear-gradient(135deg, #fef3c7 0%, #fbbf24 50%, #f59e0b 100%)',
            paddingBottom: '80px'
        }}>
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

            {/* Header */}
            <div style={{ 
                padding: '20px', 
                background: 'rgba(255,255,255,0.1)', 
                backdropFilter: 'blur(10px)',
                borderBottom: '1px solid rgba(255,255,255,0.2)',
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h1 style={{ fontSize: '1.8rem', fontWeight: '900', color: '#1f2937', margin: '0 0 4px 0' }}>Community</h1>
                        <p style={{ fontSize: '0.95rem', color: '#6b7280', margin: 0 }}>Share your food experiences</p>
                    </div>
                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowCreate(true)}
                        style={{ 
                            background: 'linear-gradient(135deg, #ef4444, #dc2626)', 
                            color: 'white', 
                            border: 'none', 
                            padding: '14px 20px', 
                            borderRadius: '24px', 
                            fontWeight: '700',
                            cursor: 'pointer',
                            boxShadow: '0 4px 20px rgba(239, 68, 68, 0.3)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                        }}
                    >
                        <Plus size={20} />
                        Create Post
                    </motion.button>
                </div>
            </div>

            {/* Posts */}
            <div style={{ padding: '20px' }}>
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '40px' }}>
                        <Loader className="animate-spin" color="#f59e0b" size={32} />
                        <p style={{ color: '#6b7280', marginTop: '16px' }}>Loading posts...</p>
                    </div>
                ) : posts.length === 0 ? (
                    <div style={{ 
                        textAlign: 'center', 
                        padding: '60px 20px',
                        background: 'rgba(255,255,255,0.1)',
                        borderRadius: '20px',
                        backdropFilter: 'blur(10px)'
                    }}>
                        <div style={{ 
                            width: '80px', 
                            height: '80px', 
                            background: 'linear-gradient(135deg, #f59e0b, #d97706)', 
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 20px'
                        }}>
                            <ImageIcon size={32} color="white" />
                        </div>
                        <h3 style={{ color: '#1f2937', fontWeight: '800', margin: '0 0 12px 0' }}>No posts yet</h3>
                        <p style={{ color: '#6b7280', fontSize: '1rem', lineHeight: '1.5' }}>
                            Be the first to share your food experience with the community! 🍽
                        </p>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        {posts.map((post, index) => (
                            <motion.div
                                key={post.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                style={{ 
                                    background: 'rgba(255,255,255,0.1)', 
                                    borderRadius: '20px', 
                                    overflow: 'hidden',
                                    boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                                    backdropFilter: 'blur(10px)',
                                    border: '1px solid rgba(255,255,255,0.2)'
                                }}
                            >
                                {/* Post Header */}
                                <div style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div style={{ 
                                        width: '44px', 
                                        height: '44px', 
                                        borderRadius: '50%', 
                                        background: 'linear-gradient(135deg, #f59e0b, #d97706)', 
                                        overflow: 'hidden',
                                        flexShrink: 0
                                    }}>
                                        {post.author.avatar_url ? (
                                            <img src={post.author.avatar_url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        ) : (
                                            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <UserIcon size={20} color="white" />
                                            </div>
                                        )}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontWeight: '800', fontSize: '1rem', color: '#1f2937', marginBottom: '2px' }}>
                                            {post.author.username || post.author.display_name}
                                        </div>
                                        <div style={{ fontSize: '0.85rem', color: '#6b7280' }}>
                                            {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
                                        </div>
                                    </div>
                                </div>

                                {/* Post Image */}
                                <div style={{ position: 'relative', width: '100%', paddingTop: '75%' }}>
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
                                <div style={{ padding: '16px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '12px' }}>
                                        <motion.button
                                            whileTap={{ scale: 0.9 }}
                                            onClick={() => handleLike(post.id, post.likes_count)}
                                            style={{ 
                                                background: 'none', 
                                                border: 'none', 
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '6px'
                                            }}
                                        >
                                            <Heart 
                                                size={22} 
                                                color={post.isLikedByUser ? "#ef4444" : "#6b7280"} 
                                                fill={post.isLikedByUser ? "#ef4444" : "none"} 
                                            />
                                            <span style={{ 
                                                fontSize: '0.9rem', 
                                                fontWeight: '600',
                                                color: post.isLikedByUser ? "#ef4444" : "#6b7280"
                                            }}>
                                                {post.likes_count || 0}
                                            </span>
                                        </motion.button>
                                        
                                        <motion.button
                                            whileTap={{ scale: 0.9 }}
                                            onClick={() => setSelectedPost(post)}
                                            style={{ 
                                                background: 'none', 
                                                border: 'none', 
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '6px'
                                            }}
                                        >
                                            <MessageCircle size={22} color="#6b7280" />
                                            <span style={{ 
                                                fontSize: '0.9rem', 
                                                fontWeight: '600',
                                                color: '#6b7280'
                                            }}>
                                                Comment
                                            </span>
                                        </motion.button>
                                    </div>
                                    
                                    {post.caption && (
                                        <div style={{ 
                                            fontSize: '0.95rem', 
                                            lineHeight: '1.5', 
                                            color: '#1f2937',
                                            fontWeight: '500'
                                        }}>
                                            <span style={{ fontWeight: '800', marginRight: '6px' }}>
                                                {post.author.username || post.author.display_name}
                                            </span>
                                            {post.caption}
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            {/* Modals */}
            <AnimatePresence>
                {showCreate && <CreatePostModal />}
                {selectedPost && <Comments post={selectedPost} onClose={() => setSelectedPost(null)} />}
            </AnimatePresence>
        </div>
    );
};

export default Community;
