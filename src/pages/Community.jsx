import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Heart, MessageCircle, Plus, Image as ImageIcon, Send, X, User as UserIcon, Loader } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import Toast from '../components/Toast';

const Community = () => {
    const { user } = useAuth();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreate, setShowCreate] = useState(false);
    const [toast, setToast] = useState(null);
    const [activeTab, setActiveTab] = useState('feed'); // 'feed' or 'leaderboard'

    // Comment State
    const [activePost, setActivePost] = useState(null); // Post ID for comment modal
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [loadingComments, setLoadingComments] = useState(false);

    // Create Post State
    const [newImage, setNewImage] = useState(null);
    const [newCaption, setNewCaption] = useState('');
    const [uploading, setUploading] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);

    useEffect(() => {
        fetchPosts();

        // Realtime Subscription
        const channel = supabase
            .channel('public:community_posts')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'community_posts' }, () => {
                fetchPosts();
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    const fetchPosts = async () => {
        setLoading(true);
        // Join with user_preferences to get creator names/avatars
        // Note: Supabase JS joins are tricky without foreign keys viewed as objects. 
        // We often fetch raw then enrich. Or use a View. 
        // For simplicity: Fetch posts, then fetch users.

        const { data: postsData, error } = await supabase
            .from('community_posts')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error(error);
            setLoading(false);
            return;
        }

        // Fetch authors
        const userIds = [...new Set((postsData || []).map(p => p.user_id))];
        const { data: usersData, error: userError } = await supabase
            .from('user_preferences')
            .select('user_id, username, display_name, avatar_url')
            .in('user_id', userIds);

        if (userError) console.error("Error fetching users:", userError);

        const userMap = {};
        if (usersData) {
            usersData.forEach(u => userMap[u.user_id] = u);
        }

        // Fetch my likes
        let myLikes = new Set();
        if (user) {
            // Auto-Sync: Ensure MY profile exists if I'm viewing
            // This fixes "Unknown User" for myself immediately
            if (!userMap[user.id]) {
                const myProfile = {
                    display_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Quizzy User',
                    avatar_url: user.user_metadata?.avatar_url
                };
                userMap[user.id] = myProfile; // Client-side hydration

                // Silent Upsert to DB
                supabase.from('user_preferences').upsert({
                    user_id: user.id,
                    display_name: myProfile.display_name,
                    avatar_url: myProfile.avatar_url
                }, { onConflict: 'user_id' }).then(() => console.log("Profile synced"));
            }

            const { data: likesData } = await supabase
                .from('post_likes')
                .select('post_id')
                .eq('user_id', user.id);
            if (likesData) {
                likesData.forEach(l => myLikes.add(l.post_id));
            }
        }

        // Enrich posts
        const enriched = postsData.map(p => ({
            ...p,
            author: userMap[p.user_id] || {
                // Better fallback using email prefix if available (tricky without auth)
                display_name: 'Foodie Member',
                username: null,
                avatar_url: null
            },
            name: userMap[p.user_id]?.username || userMap[p.user_id]?.display_name || 'Foodie Member',
            isLiked: myLikes.has(p.id)
        }));

        setPosts(enriched);
        setLoading(false);
    };

    const handleLike = async (post) => {
        if (!user) return; // Should prompt login

        // Optimistic UI
        const isLiked = post.isLiked;
        const newPosts = posts.map(p =>
            p.id === post.id
                ? { ...p, isLiked: !isLiked, likes_count: p.likes_count + (isLiked ? -1 : 1) }
                : p
        );
        setPosts(newPosts);

        if (isLiked) {
            // Unlike
            await supabase.from('post_likes').delete().match({ user_id: user.id, post_id: post.id });
            // Use RPC for atomic reliable update
            await supabase.rpc('decrement_likes', { row_id: post.id });
        } else {
            // Like
            await supabase.from('post_likes').insert({ user_id: user.id, post_id: post.id });
            // Use RPC for atomic reliable update
            await supabase.rpc('increment_likes', { row_id: post.id });
        }
    };

    const handleCreatePost = async () => {
        if (!newImage) return;
        setUploading(true);

        try {
            // Upload Image
            const fileExt = newImage.name.split('.').pop();
            const fileName = `${user.id}-${Date.now()}.${fileExt}`;
            const filePath = `community/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('food-images')
                .upload(filePath, newImage);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('food-images')
                .getPublicUrl(filePath);

            // Create Post
            const { error: dbError } = await supabase
                .from('community_posts')
                .insert([{
                    user_id: user.id,
                    image_url: publicUrl,
                    caption: newCaption,
                    likes_count: 0
                }]);

            if (dbError) throw dbError;

            // Upsert User Profile to ensure name is known
            await supabase.from('user_preferences').upsert({
                user_id: user.id,
                display_name: user.user_metadata?.full_name || 'Anonymous Foodie',
                avatar_url: user.user_metadata?.avatar_url
            }, { onConflict: 'user_id' });

            setToast({ message: "Posted!", type: 'success' });
            setShowCreate(false);
            setNewImage(null);
            setImagePreview(null);
            setNewCaption('');
            fetchPosts();

        } catch (error) {
            console.error(error);
            setToast({ message: "Failed to post", type: 'error' });
        } finally {
            setUploading(false);
        }
    };

    const openComments = async (post) => {
        setActivePost(post);
        setComments([]);
        setLoadingComments(true);

        // Fetch comments
        const { data, error } = await supabase
            .from('post_comments')
            .select('*')
            .eq('post_id', post.id)
            .order('created_at', { ascending: true });

        if (data) {
            // Enrich with user names (simple fetch for now)
            const uids = [...new Set(data.map(c => c.user_id))];
            const { data: users } = await supabase.from('user_preferences').select('user_id, username, display_name').in('user_id', uids);
            const uMap = {};
            users?.forEach(u => uMap[u.user_id] = u);

            setComments(data.map(c => ({
                ...c,
                authorName: uMap[c.user_id]?.username || uMap[c.user_id]?.display_name || 'User'
            })));
        }
        setLoadingComments(false);
    };

    const submitComment = async () => {
        if (!newComment.trim() || !user) return;

        const { error } = await supabase.from('post_comments').insert({
            post_id: activePost.id,
            user_id: user.id,
            comment: newComment
        });

        if (error) {
            setToast({ message: "Failed to comment", type: 'error' });
        } else {
            setNewComment('');
            openComments(activePost); // Visual refresh
            // Update local post comment count if tracked? (Ideally yes)
        }
    };

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            setNewImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    return (
        <div style={{ paddingBottom: '100px', background: '#fafafa', minHeight: '100vh' }}>
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

            {/* Local Header removed to use global AppBar */}

            {/* Content */}
            {/* Content - Feed Only */}
            <div className="container" style={{ padding: '16px', maxWidth: '500px', margin: '0 auto' }}>
                {loading && <p style={{ textAlign: 'center', padding: '20px' }}>Loading feed...</p>}
                {!loading && posts.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '40px 20px', color: '#888' }}>
                        <p style={{ fontSize: '1.2rem', marginBottom: '10px' }}>No posts yet 🍃</p>
                        <p>Be the first to share a moment!</p>
                    </div>
                )}
                {posts.map(post => (
                    <div key={post.id} style={{
                        background: 'white', borderRadius: '20px',
                        marginBottom: '24px', overflow: 'hidden',
                        boxShadow: '0 10px 40px -10px rgba(0,0,0,0.08)'
                    }}>
                        {/* Post Header */}
                        <div style={{ padding: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{
                                width: '36px', height: '36px', borderRadius: '50%',
                                background: '#eee', overflow: 'hidden',
                                border: '2px solid #fff', boxShadow: '0 0 0 2px #f09433'
                            }}>
                                {post.author.avatar_url ? (
                                    <img src={post.author.avatar_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#eee' }}>
                                        <UserIcon size={20} color="#999" />
                                    </div>
                                )}
                            </div>
                            <span style={{ fontWeight: '700', fontSize: '0.95rem' }}>
                                {post.author.username || post.author.display_name || 'User'}
                            </span>
                            <span style={{ marginLeft: 'auto', fontSize: '0.75rem', color: '#999' }}>
                                {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
                            </span>
                        </div>

                        {/* Image */}
                        <div style={{ position: 'relative', width: '100%', paddingTop: '100%' }}>
                            <img
                                src={post.image_url}
                                alt=""
                                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                        </div>

                        {/* Actions */}
                        <div style={{ padding: '12px 16px' }}>
                            <div style={{ display: 'flex', gap: '16px', marginBottom: '12px' }}>
                                <button
                                    onClick={() => handleLike(post)}
                                    style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                                >
                                    <Heart
                                        size={28}
                                        fill={post.isLiked ? "#dc2743" : "none"}
                                        color={post.isLiked ? "#dc2743" : "#262626"}
                                        style={{ transition: 'all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)' }}
                                    />
                                </button>
                                <button
                                    onClick={() => openComments(post)}
                                    style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                                >
                                    <MessageCircle size={28} color="#262626" />
                                </button>
                            </div>

                            <div style={{ fontWeight: '700', fontSize: '0.9rem', marginBottom: '6px' }}>
                                {post.likes_count} likes
                            </div>

                            <div style={{ fontSize: '0.95rem', lineHeight: '1.4' }}>
                                <span style={{ fontWeight: '700', marginRight: '6px' }}>{post.author.username || post.author.display_name}</span>
                                {post.caption}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Create Post Modal */}
            {showCreate && (
                <div style={{
                    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)',
                    zIndex: 2000, display: 'flex', alignItems: 'flex-end', justifyContent: 'center'
                }}>
                    <div className="slide-up-enter" style={{
                        background: 'white', width: '100%', maxWidth: '600px',
                        borderRadius: '24px 24px 0 0', overflow: 'hidden',
                        height: '90vh', display: 'flex', flexDirection: 'column'
                    }}>
                        {/* Modal Header */}
                        <div style={{ padding: '16px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <button onClick={() => setShowCreate(false)} style={{ border: 'none', background: 'none', padding: '8px' }}>
                                <X size={24} />
                            </button>
                            <h3 style={{ margin: 0, fontWeight: '700' }}>New Post</h3>
                            <button
                                onClick={handleCreatePost}
                                disabled={!newImage || uploading}
                                style={{
                                    border: 'none', background: 'none', color: 'var(--primary)',
                                    fontWeight: '700', fontSize: '1rem', opacity: (!newImage || uploading) ? 0.5 : 1
                                }}
                            >
                                {uploading ? 'Posting...' : 'Share'}
                            </button>
                        </div>

                        {/* Content */}
                        <div style={{ padding: '20px', flex: 1, overflowY: 'auto' }}>
                            {imagePreview ? (
                                <div style={{ marginBottom: '20px', borderRadius: '12px', overflow: 'hidden', position: 'relative' }}>
                                    <img src={imagePreview} alt="Preview" style={{ width: '100%', maxHeight: '400px', objectFit: 'cover' }} />
                                    <button
                                        onClick={() => { setNewImage(null); setImagePreview(null); }}
                                        style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(0,0,0,0.6)', color: 'white', borderRadius: '50%', width: '32px', height: '32px', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                            ) : (
                                <label style={{
                                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                                    height: '200px', border: '2px dashed #ddd', borderRadius: '16px',
                                    cursor: 'pointer', background: '#fafafa', marginBottom: '20px'
                                }}>
                                    <ImageIcon size={48} color="#ccc" style={{ marginBottom: '10px' }} />
                                    <span style={{ color: '#999', fontWeight: '600' }}>Upload Photo</span>
                                    <input type="file" accept="image/*" onChange={handleFileSelect} style={{ display: 'none' }} />
                                </label>
                            )}

                            <textarea
                                placeholder="Write a caption..."
                                value={newCaption}
                                onChange={e => setNewCaption(e.target.value)}
                                style={{ width: '100%', border: 'none', fontSize: '1rem', outline: 'none', resize: 'none', fontFamily: 'inherit' }}
                                rows={4}
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Comments Modal */}
            {activePost && (
                <div style={{
                    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
                    zIndex: 2000, display: 'flex', alignItems: 'flex-end', justifyContent: 'center'
                }}>
                    <div className="slide-up-enter" style={{
                        background: 'white', width: '100%', maxWidth: '600px',
                        borderRadius: '24px 24px 0 0', height: '70vh',
                        display: 'flex', flexDirection: 'column', overflow: 'hidden'
                    }}>
                        <div style={{ padding: '16px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3 style={{ margin: 0 }}>Comments</h3>
                            <button onClick={() => setActivePost(null)} style={{ border: 'none', background: 'none' }}><X /></button>
                        </div>

                        <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
                            {loadingComments ? <p>Loading...</p> : comments.length === 0 ? <p style={{ color: '#999', textAlign: 'center' }}>No comments yet.</p> : (
                                comments.map(c => (
                                    <div key={c.id} style={{ marginBottom: '16px', display: 'flex', gap: '10px' }}>
                                        <div style={{ width: '32px', height: '32px', background: '#eee', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <span style={{ fontWeight: 'bold', fontSize: '12px' }}>{c.authorName?.[0]}</span>
                                        </div>
                                        <div>
                                            <span style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>{c.authorName}</span>
                                            <p style={{ margin: '2px 0 0', fontSize: '0.95rem', color: '#333' }}>{c.comment}</p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        <div style={{ padding: '16px', borderTop: '1px solid #eee', display: 'flex', gap: '10px' }}>
                            <input
                                type="text"
                                placeholder="Add a comment..."
                                value={newComment}
                                onChange={e => setNewComment(e.target.value)}
                                style={{ flex: 1, padding: '10px', borderRadius: '20px', border: '1px solid #ddd', outline: 'none' }}
                                onKeyDown={e => e.key === 'Enter' && submitComment()}
                            />
                            <button onClick={submitComment} style={{ border: 'none', background: 'none', color: 'var(--primary)' }}>
                                <Send size={24} />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Community;
