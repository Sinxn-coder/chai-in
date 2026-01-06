import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Heart, MessageCircle, Plus, Image as ImageIcon, Send, X, User as UserIcon, Loader, Camera, Crop, RotateCw } from 'lucide-react';
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
    const [uploading, setUploading] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);
    const [newImage, setNewImage] = useState(null);
    const [newCaption, setNewCaption] = useState('');
    const [selectedPost, setSelectedPost] = useState(null);
    const [showCropper, setShowCropper] = useState(false);
    const [originalImageFile, setOriginalImageFile] = useState(null);
    const [crop, setCrop] = useState({ x: 0, y: 0, width: 100, height: 100 });
    const [zoom, setZoom] = useState(1);
    const [rotation, setRotation] = useState(0);
    const canvasRef = useRef(null);
    const imageRef = useRef(null);

    const fetchPosts = async () => {
        setLoading(true);
        const { data: postsData } = await supabase.from('community_posts').select('*').order('created_at', { ascending: false });

        if (postsData) {
            const userIds = [...new Set(postsData.map(p => p.user_id))];
            const { data: usersData } = await supabase.from('user_preferences').select('user_id, username, display_name, avatar_url').in('user_id', userIds);
            const userMap = {};
            usersData?.forEach(u => userMap[u.user_id] = u);

            // Fetch all likes for these posts
            const postIds = postsData.map(p => p.id);
            const { data: allLikesData } = await supabase
                .from('post_likes')
                .select('post_id, user_id')
                .in('post_id', postIds);

            // Count likes per post
            const likesCountMap = {};
            const userLikesMap = {};
            allLikesData?.forEach(like => {
                likesCountMap[like.post_id] = (likesCountMap[like.post_id] || 0) + 1;
                if (like.user_id === user?.id) {
                    userLikesMap[like.post_id] = true;
                }
            });

            setPosts(postsData.map(p => ({
                ...p,
                likes_count: likesCountMap[p.id] || 0,
                author: userMap[p.user_id] || { display_name: 'Foodie' },
                isLikedByUser: !!userLikesMap[p.id]
            })));
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchPosts();
        
        // Listen for profile updates to refresh post author names
        const handleProfileUpdate = () => {
            fetchPosts();
        };
        window.addEventListener('userProfileUpdated', handleProfileUpdate);
        
        return () => {
            window.removeEventListener('userProfileUpdated', handleProfileUpdate);
        };
    }, []);

    const handleImageSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            setOriginalImageFile(file);
            setImagePreview(URL.createObjectURL(file));
            setShowCropper(true);
            
            // Initialize crop to square (1:1) like Instagram
            const img = new Image();
            img.onload = () => {
                const aspectRatio = img.naturalWidth / img.naturalHeight;
                const size = Math.min(img.naturalWidth, img.naturalHeight);
                setCrop({
                    x: (img.naturalWidth - size) / 2,
                    y: (img.naturalHeight - size) / 2,
                    width: size,
                    height: size
                });
            };
            img.src = URL.createObjectURL(file);
        }
    };

    const handleCropComplete = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const image = imageRef.current;

        if (!crop || !canvas || !image) return;

        // Set canvas size to crop size (square for Instagram-like posts)
        canvas.width = crop.width;
        canvas.height = crop.height;

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Save context state
        ctx.save();

        // Apply transformations
        const centerX = crop.width / 2;
        const centerY = crop.height / 2;

        // Move to center
        ctx.translate(centerX, centerY);

        // Apply rotation
        ctx.rotate((rotation * Math.PI) / 180);

        // Apply zoom
        ctx.scale(zoom, zoom);

        // Draw image (centered at origin)
        ctx.drawImage(
            image,
            crop.x / zoom - centerX,
            crop.y / zoom - centerY,
            crop.width / zoom,
            crop.height / zoom
        );

        // Restore context state
        ctx.restore();

        const croppedDataUrl = canvas.toDataURL('image/jpeg', 0.9);
        if (croppedDataUrl) {
            // Convert data URL to blob
            fetch(croppedDataUrl)
                .then(res => res.blob())
                .then(blob => {
                    const file = new File([blob], 'cropped-image.jpg', { type: 'image/jpeg' });
                    setNewImage(file);
                    setImagePreview(URL.createObjectURL(file));
                    setShowCropper(false);
                    setOriginalImageFile(null);
                });
        }
    };

    const handleCropCancel = () => {
        setShowCropper(false);
        setOriginalImageFile(null);
    };

    const handleRotate = () => {
        setRotation((prev) => (prev + 90) % 360);
    };

    const handleZoomIn = () => {
        setZoom((prev) => Math.min(prev + 0.1, 3));
    };

    const handleZoomOut = () => {
        setZoom((prev) => Math.max(prev - 0.1, 0.5));
    };

    const handleCreatePost = async () => {
        if (!newImage || !newCaption) return;
        setUploading(true);
        try {
            const fileName = `${user.id}-${Date.now()}.${newImage.name.split('.').pop()}`;
            await supabase.storage.from('food-images').upload(`community/${fileName}`, newImage);
            const { data: { publicUrl } } = supabase.storage.from('food-images').getPublicUrl(`community/${fileName}`);

            await supabase.from('community_posts').insert([{ user_id: user.id, image_url: publicUrl, caption: newCaption, likes_count: 0 }]);

            setToast({ message: "Shared with community! ✨", type: 'success' });
            setShowCreate(false);
            setNewImage(null);
            setImagePreview(null);
            setNewCaption('');
            fetchPosts();
        } catch (error) {
            setToast({ message: "Failed to post", type: 'error' });
        } finally {
            setUploading(false);
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

            {/* Create Post Overlay */}
            <AnimatePresence>
                {showCreate && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1100, display: 'flex', alignItems: 'flex-end' }}
                    >
                        <motion.div
                            initial={{ y: '100%' }}
                            animate={{ y: 0 }}
                            exit={{ y: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            style={{ background: 'white', width: '100%', borderTopLeftRadius: '40px', borderTopRightRadius: '40px', padding: '24px', maxHeight: '90vh', overflowY: 'auto' }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                                <h3 style={{ fontSize: '1.4rem', fontWeight: '900', margin: 0 }}>New Post</h3>
                                <button onClick={() => setShowCreate(false)} style={{ background: 'var(--secondary)', border: 'none', padding: '8px', borderRadius: '12px' }}><X size={20} /></button>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                {imagePreview && (
                                    <div style={{ width: '100%', borderRadius: '24px', overflow: 'hidden', position: 'relative' }}>
                                        <img 
                                            ref={imageRef}
                                            src={imagePreview} 
                                            style={{ 
                                                width: '100%', 
                                                height: '300px', 
                                                objectFit: 'contain',
                                                display: showCropper ? 'none' : 'block'
                                            }} 
                                        />
                                        
                                        {/* Cropping Controls Overlay */}
                                        {showCropper && (
                                            <div style={{
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                                right: 0,
                                                bottom: 0,
                                                background: 'rgba(0, 0, 0, 0.8)',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                padding: '20px',
                                                gap: '12px'
                                            }}>
                                                <div style={{
                                                    display: 'flex',
                                                    justifyContent: 'center',
                                                    gap: '10px',
                                                    marginBottom: '16px'
                                                }}>
                                                    <button
                                                        onClick={handleZoomOut}
                                                        style={{
                                                            background: 'var(--secondary)',
                                                            border: 'none',
                                                            padding: '8px 12px',
                                                            borderRadius: '8px',
                                                            cursor: 'pointer',
                                                            fontSize: '0.9rem',
                                                            fontWeight: '600'
                                                        }}
                                                    >
                                                        Zoom -
                                                    </button>
                                                    <button
                                                        onClick={handleZoomIn}
                                                        style={{
                                                            background: 'var(--secondary)',
                                                            border: 'none',
                                                            padding: '8px 12px',
                                                            borderRadius: '8px',
                                                            cursor: 'pointer',
                                                            fontSize: '0.9rem',
                                                            fontWeight: '600'
                                                        }}
                                                    >
                                                        Zoom +
                                                    </button>
                                                    <button
                                                        onClick={handleRotate}
                                                        style={{
                                                            background: 'var(--secondary)',
                                                            border: 'none',
                                                            padding: '8px 12px',
                                                            borderRadius: '8px',
                                                            cursor: 'pointer',
                                                            fontSize: '0.9rem',
                                                            fontWeight: '600',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: '6px'
                                                        }}
                                                    >
                                                        <RotateCw size={16} />
                                                        Rotate
                                                    </button>
                                                </div>
                                                
                                                <div style={{
                                                    display: 'flex',
                                                    justifyContent: 'center',
                                                    gap: '10px'
                                                }}>
                                                    <button
                                                        onClick={handleCropComplete}
                                                        style={{
                                                            background: 'var(--primary)',
                                                            color: 'white',
                                                            border: 'none',
                                                            padding: '12px 24px',
                                                            borderRadius: '12px',
                                                            cursor: 'pointer',
                                                            fontSize: '1rem',
                                                            fontWeight: '800',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: '8px'
                                                        }}
                                                    >
                                                        <Crop size={18} />
                                                        Apply Crop
                                                    </button>
                                                    <button
                                                        onClick={handleCropCancel}
                                                        style={{
                                                            background: 'var(--secondary)',
                                                            border: 'none',
                                                            padding: '8px 16px',
                                                            borderRadius: '12px',
                                                            cursor: 'pointer',
                                                            fontSize: '0.9rem',
                                                            fontWeight: '600'
                                                        }}
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                        
                                        {!showCropper && (
                                            <button 
                                                onClick={() => { setImagePreview(null); setNewImage(null) }} 
                                                style={{ 
                                                    position: 'absolute', 
                                                    top: '10px', 
                                                    right: '10px', 
                                                    background: 'rgba(0,0,0,0.5)', 
                                                    color: 'white', 
                                                    border: 'none', 
                                                    borderRadius: '50%', 
                                                    padding: '6px' 
                                                }}
                                            >
                                                <X size={16} />
                                            </button>
                                        )}
                                    </div>
                                )} : (
                                    <label style={{ width: '100%', height: '200px', border: '3px dashed var(--secondary)', borderRadius: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', background: 'var(--secondary)' }}>
                                        <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageSelect} />
                                        <Camera size={40} color="var(--primary)" />
                                        <span style={{ fontWeight: '800', marginTop: '10px', color: 'var(--text-muted)' }}>Tap to Upload & Crop Photo</span>
                                    </label>
                                )}

                                <textarea
                                    placeholder="Write a caption..."
                                    value={newCaption}
                                    onChange={e => setNewCaption(e.target.value)}
                                    style={{ width: '100%', padding: '20px', borderRadius: '24px', background: 'var(--secondary)', border: 'none', fontSize: '1rem', fontWeight: '600', minHeight: '120px', outline: 'none' }}
                                />

                                <motion.button
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleCreatePost}
                                    disabled={uploading || !newImage}
                                    style={{ width: '100%', padding: '20px', borderRadius: '24px', background: 'var(--primary)', color: 'white', border: 'none', fontSize: '0.9rem', fontWeight: '900', boxShadow: 'var(--shadow-md)', opacity: (uploading || !newImage) ? 0.6 : 1 }}
                                >
                                    {uploading ? 'Sharing...' : 'Share Post'}
                                </motion.button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Image Cropper Overlay */}
            <AnimatePresence>
                {showCropper && originalImageFile && (
                    <ImageCropper
                        imageFile={originalImageFile}
                        onCrop={handleCropComplete}
                        onCancel={handleCropCancel}
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
                user: userMap[c.user_id] || { display_name: 'User' }
            })));
        } else {
            setComments([]);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchComments();
    }, []);

    const handleCommentSubmit = async () => {
        if (!user) return;
        if (!newComment.trim()) return;

        await supabase.from('post_comments').insert({
            post_id: post.id,
            user_id: user.id,
            comment: newComment
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
