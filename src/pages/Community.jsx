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
        const userIds = [...new Set(postsData.map(p => p.user_id))];
        const { data: usersData } = await supabase
            .from('user_preferences')
            .select('user_id, display_name, avatar_url')
            .in('user_id', userIds);

        const userMap = {};
        if (usersData) {
            usersData.forEach(u => userMap[u.user_id] = u);
        }

        // Fetch my likes
        let myLikes = new Set();
        if (user) {
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
            author: userMap[p.user_id] || { display_name: 'Unknown User', avatar_url: null },
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
            await supabase.rpc('decrement_likes', { row_id: post.id }); // Using atomic numeric update if function exists, else raw update
            // Fallback raw update if RPC not set
            await supabase.from('community_posts').update({ likes_count: post.likes_count - 1 }).eq('id', post.id);
        } else {
            // Like
            await supabase.from('post_likes').insert({ user_id: user.id, post_id: post.id });
            await supabase.from('community_posts').update({ likes_count: post.likes_count + 1 }).eq('id', post.id);
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
                .from('spots') // Reusing spots bucket for now, or use 'community' if created
                .upload(filePath, newImage);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('spots')
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

            {/* Header */}
            <div className="glass-card" style={{
                position: 'sticky', top: 0, zIndex: 100,
                padding: '16px', borderRadius: '0 0 20px 20px',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center'
            }}>
                <h1 style={{ fontSize: '1.5rem', fontWeight: '800', margin: 0, background: 'linear-gradient(to right, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    Community
                </h1>
                <button
                    onClick={() => setShowCreate(true)}
                    style={{
                        background: 'var(--primary)', color: 'white',
                        border: 'none', borderRadius: '50%', width: '40px', height: '40px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 4px 12px rgba(226, 55, 68, 0.3)'
                    }}
                >
                    <Plus size={24} />
                </button>
            </div>

            {/* Feed */}
            <div className="container" style={{ padding: '16px', maxWidth: '500px', margin: '0 auto' }}>
                {loading && <p style={{ textAlign: 'center', padding: '20px' }}>Loading feed...</p>}

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
                                {post.author.display_name || 'User'}
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
                                <button style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}>
                                    <MessageCircle size={28} color="#262626" />
                                </button>
                            </div>

                            <div style={{ fontWeight: '700', fontSize: '0.9rem', marginBottom: '6px' }}>
                                {post.likes_count} likes
                            </div>

                            <div style={{ fontSize: '0.95rem', lineHeight: '1.4' }}>
                                <span style={{ fontWeight: '700', marginRight: '6px' }}>{post.author.display_name}</span>
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
                                style={{ wwidth: '100%', border: 'none', fontSize: '1.rem', outline: 'none', resize: 'none', fontFamily: 'inherit' }}
                                rows={4}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Community;
