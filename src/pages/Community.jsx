import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Heart, MessageCircle, Plus, User as UserIcon, Loader } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '../context/AuthContext';
import Toast from '../components/Toast';
import { motion, AnimatePresence } from 'framer-motion';
import CreatePostModal from '../components/CreatePostModal';

const Community = () => {
    const { user } = useAuth();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreate, setShowCreate] = useState(false);
    const [toast, setToast] = useState(null);
    const [selectedPost, setSelectedPost] = useState(null);

    const fetchPosts = async () => {
        console.log('Fetching posts...');
        setLoading(true);
        
        try {
            const { data: postsData, error: postsError } = await supabase.from('community_posts').select('*').order('created_at', { ascending: false });

            if (postsError) {
                console.error('Error fetching posts:', postsError);
                setLoading(false);
                return;
            }

            console.log('Raw posts data:', postsData);

            if (postsData && postsData.length > 0) {
                const userIds = [...new Set(postsData.map(p => p.user_id))];
                console.log('User IDs to fetch:', userIds);
                
                const { data: usersData, error: usersError } = await supabase.from('user_preferences').select('user_id, username, display_name, avatar_url').in('user_id', userIds);
                
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
        
        // Set up real-time subscription for user_preferences changes
        const subscription = supabase
            .channel('user_preferences_changes')
            .on('postgres_changes', 
                { 
                    event: 'UPDATE', 
                    schema: 'public', 
                    table: 'user_preferences' 
                }, 
                (payload) => {
                    // When any user updates their profile, refresh posts
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
            const { data: existingPrefs, error: prefsError } = await supabase.from('user_preferences').select('*').eq('user_id', user.id).maybeSingle();
            
            if (prefsError) {
                console.error('Error checking user preferences:', prefsError);
            }
            
            console.log('User preferences check:', existingPrefs);
            
            if (!existingPrefs) {
                console.log('Creating user preferences...');
                // Only create preferences if they don't exist
                const { data: newPrefs, error: createPrefsError } = await supabase.from('user_preferences').insert({
                    user_id: user.id,
                    display_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
                    avatar_url: user.user_metadata?.avatar_url || null,
                    notifications_enabled: true,
                    notify_new_spots: true,
                    notify_review_replies: true,
                    notify_weekly_digest: false
                }).select().single();
                
                if (createPrefsError) {
                    console.error('Error creating user preferences:', createPrefsError);
                    throw createPrefsError;
                }
                
                console.log('User preferences created:', newPrefs);
            }

            console.log('Uploading image...');
            const fileName = `${user.id}-${Date.now()}.${imageFile.name.split('.').pop()}`;
            const { error: uploadError } = await supabase.storage.from('food-images').upload(`community/${fileName}`, imageFile);
            
            if (uploadError) {
                console.error('Image upload error:', uploadError);
                throw uploadError;
            }
            
            const { data: { publicUrl } } = supabase.storage.from('food-images').getPublicUrl(`community/${fileName}`);
            console.log('Image uploaded successfully:', publicUrl);

            console.log('Creating post in database...');
            const { data: postData, error: postError } = await supabase.from('community_posts').insert([{ 
                user_id: user.id, 
                image_url: publicUrl, 
                caption: caption, 
                likes: 0 
            }]).select().single();
            
            if (postError) {
                console.error('Post creation error:', postError);
                throw postError;
            }
            
            console.log('Post created successfully:', postData);
            
            setToast({ message: "Shared with community! ✨", type: 'success' });
            
            console.log('Refreshing posts...');
            await fetchPosts();
            
        } catch (error) {
            console.error('Complete post creation error:', error);
            setToast({ message: "Failed to share post: " + error.message, type: 'error' });
        }
    };

    const handleLike = async (postId, currentLikes) => {
        if (!user) return;

        // Check if already liked
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
    };

    return (
        <div style={{ paddingBottom: '120px', background: 'var(--secondary)', minHeight: '100vh' }}>
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

            {/* Header Area */}
            <div style={{ padding: '24px 20px', background: 'white', borderBottomLeftRadius: '32px', borderBottomRightRadius: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: 'var(--shadow-sm)' }}>
                <div>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: '900', color: 'var(--text-main)', margin: 0 }}>Community</h1>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600', margin: 0 }}>Discover Kerala's tastes</p>
                </div>
                <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowCreate(true)}
                    style={{ background: 'var(--primary)', color: 'white', border: 'none', padding: '12px', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                    <Plus size={24} />
                </motion.button>
            </div>

            <div className="container" style={{ padding: '20px', maxWidth: '500px', margin: '0 auto' }}>
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '40px' }}><Loader className="animate-spin" color="var(--primary)" /></div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        {posts.map((post, i) => (
                            <motion.div
                                key={post.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                style={{ background: 'white', borderRadius: '32px', overflow: 'hidden', boxShadow: 'var(--shadow-md)' }}
                            >
                                {/* Post Header */}
                                <div style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div style={{ width: '40px', height: '40px', borderRadius: '14px', background: 'var(--secondary)', overflow: 'hidden' }}>
                                        {post.author.avatar_url ? (
                                            <img src={post.author.avatar_url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        ) : (
                                            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><UserIcon size={20} color="var(--text-muted)" /></div>
                                        )}
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: '800', fontSize: '0.95rem' }}>{post.author.username || post.author.display_name}</div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '600' }}>{formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}</div>
                                    </div>
                                </div>

                                {/* Image */}
                                <div style={{ position: 'relative', width: '100%', paddingTop: '100%' }}>
                                    <img src={post.image_url} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                                </div>

                                {/* Post Body */}
                                <div style={{ padding: '20px' }}>
                                    <div style={{ display: 'flex', gap: '16px', marginBottom: '12px' }}>
                                        <motion.div whileTap={{ scale: 0.8 }} onClick={() => handleLike(post.id, post.likes_count)} style={{ cursor: 'pointer' }}>
                                            <Heart size={26} color="var(--primary)" fill={post.isLikedByUser ? "var(--primary)" : "none"} />
                                        </motion.div>
                                        <motion.div whileTap={{ scale: 0.8 }} onClick={() => setSelectedPost(post)} style={{ cursor: 'pointer' }}>
                                            <MessageCircle size={26} color="var(--text-main)" />
                                        </motion.div>
                                    </div>
                                    <div style={{ fontWeight: '850', fontSize: '0.9rem', marginBottom: '8px' }}>{post.likes_count || 0} likes</div>
                                    <div style={{ fontSize: '0.95rem', lineHeight: '1.5', color: 'var(--text-main)' }}>
                                        <span style={{ fontWeight: '900', marginRight: '6px' }}>{post.author.username || post.author.display_name}</span>
                                        {post.caption}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            {selectedPost && <Comments post={selectedPost} onClose={() => setSelectedPost(null)} />}

            {/* Create Post Modal */}
            <AnimatePresence>
                {showCreate && (
                    <CreatePostModal
                        onClose={() => setShowCreate(false)}
                        onPostComplete={handlePostComplete}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

const Comments = ({ post, onClose }) => {
    const { user } = useAuth();
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(true);

    const fetchComments = async () => {
        setLoading(true);
        const { data: commentsData } = await supabase.from('post_comments').select('*').eq('post_id', post.id).order('created_at', { ascending: false });
        
        if (commentsData) {
            const userIds = [...new Set(commentsData.map(c => c.user_id))];
            const { data: usersData } = await supabase.from('user_preferences').select('user_id, display_name, avatar_url').in('user_id', userIds);
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
        
        // Listen for profile updates to refresh comment names
        const handleProfileUpdate = () => {
            fetchComments();
        };
        window.addEventListener('userProfileUpdated', handleProfileUpdate);
        
        // Set up real-time subscription for user_preferences changes
        const subscription = supabase
            .channel('user_preferences_changes_comments')
            .on('postgres_changes', 
                { 
                    event: 'UPDATE', 
                    schema: 'public', 
                    table: 'user_preferences' 
                }, 
                (payload) => {
                    // When any user updates their profile, refresh comments
                    fetchComments();
                }
            )
            .subscribe();
        
        return () => {
            window.removeEventListener('userProfileUpdated', handleProfileUpdate);
            supabase.removeChannel(subscription);
        };
    }, [post.id]);

    const handleCommentSubmit = async () => {
        if (!newComment.trim() || !user) return;
        
        // Check if user already has preferences
        const { data: existingPrefs } = await supabase.from('user_preferences').select('*').eq('user_id', user.id).maybeSingle();
        
        if (!existingPrefs) {
            // Only create preferences if they don't exist
            await supabase.from('user_preferences').insert({
                user_id: user.id,
                display_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
                avatar_url: user.user_metadata?.avatar_url || null,
                notifications_enabled: true,
                notify_new_spots: true,
                notify_review_replies: true,
                notify_weekly_digest: false
            });
        }
        
        await supabase.from('post_comments').insert({
            post_id: post.id,
            user_id: user.id,
            comment: newComment.trim()
        });
        
        setNewComment('');
        fetchComments();
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1100, display: 'flex', alignItems: 'flex-end' }}
            onClick={onClose}
        >
            <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                style={{ background: 'white', width: '100%', borderTopLeftRadius: '40px', borderTopRightRadius: '40px', padding: '24px', maxHeight: '80vh', overflowY: 'auto' }}
                onClick={(e) => e.stopPropagation()}
            >
                <h3 style={{ fontSize: '1.4rem', fontWeight: '900', margin: '0 0 24px 0', textAlign: 'center' }}>Comments</h3>

                {loading ? <Loader className="animate-spin" /> : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
                        {comments.map(c => (
                            <div key={c.id} style={{ display: 'flex', gap: '12px' }}>
                                <img src={c.user?.avatar_url || 'https://i.pravatar.cc/40'} style={{ width: '40px', height: '40px', borderRadius: '14px' }} />
                                <div>
                                    <span style={{ fontWeight: '800' }}>{c.user?.display_name || 'User'}</span>
                                    <p style={{ margin: '2px 0 0 0' }}>{c.comment}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <div style={{ display: 'flex', gap: '10px' }}>
                    <input
                        type="text"
                        value={newComment}
                        onChange={e => setNewComment(e.target.value)}
                        placeholder="Add a comment..."
                        style={{ flex: 1, padding: '14px', borderRadius: '16px', border: '2px solid var(--secondary)', outline: 'none', fontWeight: '700' }}
                    />
                    <button onClick={handleCommentSubmit} style={{ padding: '14px 20px', borderRadius: '16px', background: 'var(--primary)', color: 'white', border: 'none', fontWeight: '800' }}>Send</button>
                </div>
            </motion.div>
        </motion.div>
    )
};

export default Community;
