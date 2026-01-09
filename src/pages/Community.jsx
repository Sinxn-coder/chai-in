import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Heart, MessageCircle, Plus, User as UserIcon, Loader, Camera, Image as ImageIcon, X, Share2, Bookmark } from 'lucide-react';
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
    const [debugInfo, setDebugInfo] = useState('');

    const fetchPosts = async () => {
        console.log('🔍 Fetching posts...');
        setLoading(true);
        setDebugInfo('Fetching posts...');
        
        try {
            // First check if user is authenticated
            if (!user) {
                console.log('❌ No user authenticated');
                setDebugInfo('No user logged in');
                setPosts([]);
                setLoading(false);
                return;
            }
            
            console.log('✅ User authenticated:', user.id);
            setDebugInfo('User authenticated, fetching posts...');

            const { data: postsData, error: postsError } = await supabase
                .from('community_posts')
                .select('*')
                .order('created_at', { ascending: false });

            if (postsError) {
                console.error('❌ Error fetching posts:', postsError);
                setToast({ message: 'Failed to load posts: ' + postsError.message, type: 'error' });
                setDebugInfo('Error: ' + postsError.message);
                setLoading(false);
                return;
            }

            console.log('📊 Raw posts data:', postsData);
            setDebugInfo(`Found ${postsData?.length || 0} posts`);

            if (postsData && postsData.length > 0) {
                const userIds = [...new Set(postsData.map(p => p.user_id))];
                console.log('👥 User IDs to fetch:', userIds);
                
                const { data: usersData, error: usersError } = await supabase
                    .from('user_preferences')
                    .select('user_id, username, display_name, avatar_url')
                    .in('user_id', userIds);
                
                if (usersError) {
                    console.error('❌ Error fetching users:', usersError);
                }
                
                console.log('👤 Users data:', usersData);
                
                const userMap = {};
                usersData?.forEach(u => userMap[u.user_id] = u);

                // Fetch all likes for these posts
                const postIds = postsData.map(p => p.id);
                const { data: allLikesData, error: likesError } = await supabase
                    .from('post_likes')
                    .select('post_id, user_id')
                    .in('post_id', postIds);

                // Fetch saved posts for current user
                const { data: savedPostsData, error: savedError } = user ? await supabase
                    .from('saved_posts')
                    .select('post_id')
                    .eq('user_id', user.id) : { data: [] };

                if (likesError) {
                    console.error('❌ Error fetching likes:', likesError);
                }

                if (savedError) {
                    console.error('❌ Error fetching saved posts:', savedError);
                }

                console.log('❤️ Likes data:', allLikesData);
                console.log('🔖 Saved posts data:', savedPostsData);

                // Count likes per post
                const likesCountMap = {};
                const userLikesMap = {};
                allLikesData?.forEach(like => {
                    likesCountMap[like.post_id] = (likesCountMap[like.post_id] || 0) + 1;
                    if (like.user_id === user?.id) {
                        userLikesMap[like.post_id] = true;
                    }
                });

                // Create saved posts map
                const savedPostsMap = {};
                savedPostsData?.forEach(save => {
                    savedPostsMap[save.post_id] = true;
                });

                const processedPosts = postsData.map(p => ({
                    ...p,
                    likes_count: likesCountMap[p.id] || 0,
                    author: userMap[p.user_id] || { display_name: 'Foodie', username: null, avatar_url: null },
                    isLikedByUser: !!userLikesMap[p.id],
                    isSavedByUser: !!savedPostsMap[p.id]
                }));

                console.log('✨ Processed posts:', processedPosts);
                setPosts(processedPosts);
                setDebugInfo(`Successfully loaded ${processedPosts.length} posts`);
            } else {
                console.log('📭 No posts found');
                setDebugInfo('No posts in database');
                setPosts([]);
            }
        } catch (error) {
            console.error('💥 Error in fetchPosts:', error);
            setToast({ message: 'Failed to load posts: ' + error.message, type: 'error' });
            setDebugInfo('Unexpected error: ' + error.message);
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
                    console.log('🆕 New post detected:', payload);
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
        console.log('🚀 Starting post creation...', { imageFile: imageFile.name, caption });
        
        try {
            if (!user) {
                setToast({ message: 'Please login to create posts', type: 'error' });
                return;
            }

            // Check if user already has preferences
            const { data: existingPrefs, error: prefsError } = await supabase
                .from('user_preferences')
                .select('*')
                .eq('user_id', user.id)
                .maybeSingle();
            
            if (prefsError) {
                console.error('❌ Error checking user preferences:', prefsError);
            }
            
            console.log('👤 User preferences check:', existingPrefs);
            
            if (!existingPrefs) {
                console.log('🆕 Creating user preferences...');
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
                    console.error('❌ Error creating user preferences:', createPrefsError);
                    throw createPrefsError;
                }
                
                console.log('✅ User preferences created:', newPrefs);
            }

            console.log('📤 Uploading image...');
            const fileName = `${user.id}-${Date.now()}.${imageFile.name.split('.').pop()}`;
            const { error: uploadError } = await supabase.storage
                .from('food-images')
                .upload(`community/${fileName}`, imageFile);
            
            if (uploadError) {
                console.error('❌ Image upload error:', uploadError);
                throw uploadError;
            }
            
            const { data: { publicUrl } } = supabase.storage
                .from('food-images')
                .getPublicUrl(`community/${fileName}`);
            console.log('✅ Image uploaded successfully:', publicUrl);

            console.log('💾 Creating post in database...');
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
                console.error('❌ Post creation error:', postError);
                throw postError;
            }
            
            console.log('🎉 Post created successfully:', postData);
            
            setToast({ message: "Post shared successfully! 🎉", type: 'success' });
            setShowCreate(false);
            setCreateStep('initial');
            setSelectedImage(null);
            setCaption('');
            
            console.log('🔄 Refreshing posts...');
            await fetchPosts();
            
        } catch (error) {
            console.error('💥 Complete post creation error:', error);
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
            console.error('❌ Error toggling like:', error);
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
                setToast({ message: 'Comment added! 💬', type: 'success' });
            } catch (error) {
                console.error('❌ Error adding comment:', error);
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
                    background: 'rgba(0,0,0,0.8)',
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
                        background: '#ffffff',
                        width: '100%',
                        borderTopLeftRadius: '24px',
                        borderTopRightRadius: '24px',
                        padding: '20px',
                        maxHeight: '80vh',
                        overflowY: 'auto',
                        boxShadow: '0 -4px 20px rgba(0,0,0,0.15)'
                    }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#1a1a1a', margin: 0 }}>Comments</h3>
                        <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}>
                            <X size={20} color="#666" />
                        </button>
                    </div>

                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '40px' }}>
                            <Loader className="animate-spin" color="#666" />
                        </div>
                    ) : (
                        <>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px', maxHeight: '400px', overflowY: 'auto' }}>
                                {comments.length === 0 ? (
                                    <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
                                        No comments yet. Be the first to comment! 💭
                                    </div>
                                ) : (
                                    comments.map(c => (
                                        <div key={c.id} style={{ display: 'flex', gap: '12px', padding: '12px', background: '#f8f9fa', borderRadius: '12px' }}>
                                            <div style={{ 
                                                width: '36px', 
                                                height: '36px', 
                                                borderRadius: '50%', 
                                                background: '#e9ecef',
                                                overflow: 'hidden',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                flexShrink: 0
                                            }}>
                                                {c.user?.avatar_url ? (
                                                    <img src={c.user.avatar_url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                ) : (
                                                    <UserIcon size={18} color="#666" />
                                                )}
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <div style={{ fontWeight: '600', fontSize: '0.9rem', color: '#1a1a1a', marginBottom: '4px' }}>
                                                    {c.user?.display_name || 'User'}
                                                </div>
                                                <div style={{ color: '#666', fontSize: '0.85rem', lineHeight: '1.4' }}>
                                                    {c.comment}
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            <div style={{ display: 'flex', gap: '8px', padding: '12px', background: '#f8f9fa', borderRadius: '20px' }}>
                                <input
                                    type="text"
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    placeholder="Add a comment..."
                                    style={{ 
                                        flex: 1, 
                                        padding: '12px 16px', 
                                        borderRadius: '16px', 
                                        border: 'none', 
                                        outline: 'none', 
                                        fontWeight: '500',
                                        background: '#ffffff',
                                        color: '#1a1a1a',
                                        fontSize: '0.9rem'
                                    }}
                                />
                                <button 
                                    onClick={handleCommentSubmit} 
                                    style={{ 
                                        padding: '12px 20px', 
                                        borderRadius: '16px', 
                                        background: '#007bff', 
                                        color: 'white', 
                                        border: 'none', 
                                        fontWeight: '600',
                                        cursor: 'pointer',
                                        fontSize: '0.9rem'
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
                        background: '#ffffff',
                        borderRadius: '20px',
                        padding: '24px',
                        width: '90%',
                        maxWidth: '450px',
                        boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
                    }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                        <h3 style={{ fontSize: '1.4rem', fontWeight: '700', color: '#1a1a1a', margin: 0 }}>Create Post</h3>
                        <button onClick={() => setShowCreate(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}>
                            <X size={24} color="#666" />
                        </button>
                    </div>

                    {createStep === 'initial' && (
                        <div style={{ textAlign: 'center' }}>
                            <div style={{
                                width: '140px',
                                height: '140px',
                                border: '3px dashed #ddd',
                                borderRadius: '20px',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto 24px',
                                cursor: 'pointer',
                                background: '#f8f9fa',
                                transition: 'all 0.3s ease'
                            }}
                            onClick={() => document.getElementById('fileInput').click()}
                            onMouseOver={(e) => e.target.style.borderColor = '#007bff'}
                            onMouseOut={(e) => e.target.style.borderColor = '#ddd'}
                            >
                                <ImageIcon size={36} color="#666" />
                                <span style={{ color: '#666', fontSize: '0.95rem', marginTop: '8px' }}>Add Photo</span>
                            </div>
                            
                            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                                <button
                                    onClick={() => document.getElementById('fileInput').click()}
                                    style={{
                                        padding: '14px 24px',
                                        borderRadius: '20px',
                                        background: '#007bff',
                                        color: 'white',
                                        border: 'none',
                                        fontWeight: '600',
                                        cursor: 'pointer',
                                        fontSize: '0.95rem',
                                        transition: 'background 0.3s ease'
                                    }}
                                    onMouseOver={(e) => e.target.style.background = '#0056b3'}
                                    onMouseOut={(e) => e.target.style.background = '#007bff'}
                                >
                                    <ImageIcon size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                                    Choose Photo
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
                                height: '220px',
                                borderRadius: '16px',
                                overflow: 'hidden',
                                marginBottom: '20px',
                                background: '#f8f9fa',
                                border: '1px solid #e9ecef'
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
                                    border: '1px solid #e9ecef',
                                    outline: 'none',
                                    fontWeight: '500',
                                    background: '#ffffff',
                                    color: '#1a1a1a',
                                    fontSize: '1rem',
                                    minHeight: '120px',
                                    resize: 'vertical',
                                    marginBottom: '20px',
                                    fontFamily: 'inherit'
                                }}
                            />
                            
                            <div style={{ display: 'flex', gap: '12px' }}>
                                <button
                                    onClick={() => setCreateStep('initial')}
                                    style={{
                                        padding: '14px 20px',
                                        borderRadius: '20px',
                                        background: '#f8f9fa',
                                        color: '#666',
                                        border: '1px solid #e9ecef',
                                        fontWeight: '600',
                                        cursor: 'pointer',
                                        fontSize: '0.95rem'
                                    }}
                                >
                                    Back
                                </button>
                                <button
                                    onClick={handleSubmit}
                                    disabled={uploading}
                                    style={{
                                        padding: '14px 24px',
                                        borderRadius: '20px',
                                        background: uploading ? '#6c757d' : '#007bff',
                                        color: 'white',
                                        border: 'none',
                                        fontWeight: '600',
                                        cursor: uploading ? 'not-allowed' : 'pointer',
                                        fontSize: '0.95rem',
                                        flex: 1,
                                        transition: 'background 0.3s ease'
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
            background: '#f8f9fa', 
            paddingBottom: '80px'
        }}>
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

            {/* Fixed Header */}
            <div style={{ 
                position: 'fixed',
                top: '0',
                left: '0',
                right: '0',
                padding: '20px', 
                background: '#ffffff', 
                borderBottom: '1px solid #e9ecef',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                borderRadius: '0 0 30px 30px',
                overflow: 'hidden',
                zIndex: 1001 // Increased z-index to appear above Comments modal
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
                    <div>
                        <h1 style={{ fontSize: '1.8rem', fontWeight: '700', color: '#1a1a1a', margin: '0 0 4px 0' }}>Community</h1>
                        <p style={{ fontSize: '0.95rem', color: '#666', margin: 0 }}>Share your food experiences</p>
                    </div>
                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowCreate(true)}
                        style={{ 
                            background: '#007bff', 
                            color: 'white', 
                            border: 'none', 
                            padding: '14px 20px', 
                            borderRadius: '20px', 
                            fontWeight: '600',
                            cursor: 'pointer',
                            boxShadow: '0 4px 12px rgba(0,123,255,0.3)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            fontSize: '0.95rem'
                        }}
                    >
                        <Plus size={20} />
                        Create Post
                    </motion.button>
                </div>
            </div>

            {/* Posts with top padding to account for fixed header */}
            <div style={{ padding: '20px', paddingTop: '120px' }}>
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                        <Loader className="animate-spin" color="#666" size={32} />
                        <p style={{ color: '#666', marginTop: '16px', fontSize: '1rem' }}>Loading posts...</p>
                    </div>
                ) : posts.length === 0 ? (
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
                            <ImageIcon size={36} color="#666" />
                        </div>
                        <h3 style={{ color: '#1a1a1a', fontWeight: '700', margin: '0 0 12px 0', fontSize: '1.3rem' }}>No posts yet</h3>
                        <p style={{ color: '#666', fontSize: '1rem', lineHeight: '1.6', marginBottom: '24px' }}>
                            Be the first to share your food experience with the community! 🍽️
                        </p>
                        <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setShowCreate(true)}
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
                            Create First Post
                        </motion.button>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        {posts.map((post, index) => (
                            <motion.div
                                key={post.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                style={{ 
                                    background: '#ffffff', 
                                    borderRadius: '20px', 
                                    overflow: 'hidden',
                                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                                    border: '1px solid #e9ecef',
                                    width: '100%',
                                    maxWidth: '500px'
                                }}
                            >
                                {/* Post Header */}
                                <div style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div style={{ 
                                        width: '48px', 
                                        height: '48px', 
                                        borderRadius: '50%', 
                                        background: '#f8f9fa', 
                                        overflow: 'hidden',
                                        flexShrink: 0,
                                        border: '2px solid #e9ecef'
                                    }}>
                                        {post.author.avatar_url ? (
                                            <img src={post.author.avatar_url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        ) : (
                                            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <UserIcon size={22} color="#666" />
                                            </div>
                                        )}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontWeight: '700', fontSize: '1.1rem', color: '#1a1a1a', marginBottom: '2px' }}>
                                            {post.author.username || post.author.display_name}
                                        </div>
                                        <div style={{ fontSize: '0.9rem', color: '#666' }}>
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
                                <div style={{ padding: '20px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '16px' }}>
                                        <motion.button
                                            whileTap={{ scale: 0.9 }}
                                            onClick={() => handleLike(post.id, post.likes_count)}
                                            style={{ 
                                                background: 'none', 
                                                border: 'none', 
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '8px'
                                            }}
                                        >
                                            <Heart 
                                                size={24} 
                                                color={post.isLikedByUser ? "#e74c3c" : "#666"} 
                                                fill={post.isLikedByUser ? "#e74c3c" : "none"} 
                                            />
                                            <span style={{ 
                                                fontSize: '1rem', 
                                                fontWeight: '600',
                                                color: post.isLikedByUser ? "#e74c3c" : "#666"
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
                                            <MessageCircle size={22} color="#666" />
                                            <span style={{ 
                                                fontSize: '0.9rem', 
                                                fontWeight: '600',
                                                color: '#666'
                                            }}>
                                                Comment
                                            </span>
                                        </motion.button>

                                        <motion.button
                                            whileTap={{ scale: 0.9 }}
                                            style={{ 
                                                background: 'none', 
                                                border: 'none', 
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '6px'
                                            }}
                                        >
                                            <Share2 size={22} color="#666" />
                                            <span style={{ 
                                                fontSize: '0.9rem', 
                                                fontWeight: '600',
                                                color: '#666'
                                            }}>
                                                Share
                                            </span>
                                        </motion.button>

                                        <motion.button
                                            whileTap={{ scale: 0.9 }}
                                            onClick={async () => {
                                                if (!user) {
                                                    setToast({ message: 'Please login to save posts', type: 'error' });
                                                    return;
                                                }
                                                
                                                try {
                                                    // Check if already saved
                                                    const { data: existingSave } = await supabase
                                                        .from('saved_posts')
                                                        .select('*')
                                                        .eq('user_id', user.id)
                                                        .eq('post_id', post.id)
                                                        .maybeSingle();
                                                    
                                                    if (existingSave) {
                                                        // Unsave
                                                        await supabase.from('saved_posts').delete().eq('id', existingSave.id);
                                                        setToast({ message: 'Post removed from saved', type: 'success' });
                                                    } else {
                                                        // Save
                                                        await supabase.from('saved_posts').insert({
                                                            user_id: user.id,
                                                            post_id: post.id
                                                        });
                                                        setToast({ message: 'Post saved to profile!', type: 'success' });
                                                    }
                                                    
                                                    // Update UI immediately
                                                    setPosts(posts.map(p => 
                                                        p.id === post.id 
                                                            ? { ...p, isSavedByUser: !existingSave }
                                                            : p
                                                    ));
                                                } catch (error) {
                                                    console.error('Error saving post:', error);
                                                    setToast({ message: 'Failed to save post', type: 'error' });
                                                }
                                            }}
                                            style={{ 
                                                background: 'none', 
                                                border: 'none', 
                                                cursor: 'pointer',
                                                marginLeft: 'auto'
                                            }}
                                        >
                                            <Bookmark 
                                                size={22} 
                                                color={post.isSavedByUser ? "#007bff" : "#666"} 
                                                fill={post.isSavedByUser ? "#007bff" : "none"} 
                                            />
                                        </motion.button>
                                    </div>
                                    
                                    {post.caption && (
                                        <div style={{ 
                                            fontSize: '0.95rem', 
                                            lineHeight: '1.5', 
                                            color: '#1a1a1a',
                                            fontWeight: '500'
                                        }}>
                                            <span style={{ fontWeight: '700', marginRight: '6px' }}>
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
