import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';
import { Check, X, CircleAlert, Camera, User } from 'lucide-react';
import Toast from './Toast';

const SetUsernameModal = () => {
    const { user } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [username, setUsername] = useState('');
    const [loading, setLoading] = useState(false);
    const [available, setAvailable] = useState(null); // true, false, null
    const [error, setError] = useState(null);
    const [isOldUser, setIsOldUser] = useState(false);
    const [avatarUrl, setAvatarUrl] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [skipAvatar, setSkipAvatar] = useState(false);

    useEffect(() => {
        if (user?.created_at) {
            const created = new Date(user.created_at);
            const now = new Date();
            const diffHours = (now - created) / (1000 * 60 * 60);
            if (diffHours > 1) setIsOldUser(true); // Account created more than 1 hour ago
        }
        checkStatus();
        
        // Set initial avatar from Google profile
        if (user?.user_metadata?.avatar_url) {
            setAvatarUrl(user.user_metadata.avatar_url);
        }
    }, [user]);

    const checkStatus = async () => {
        if (!user) return;
        const { data, error } = await supabase
            .from('user_preferences')
            .select('username')
            .eq('user_id', user.id)
            .single();

        if (data && !data.username) {
            setIsOpen(true);
        } else if (!data) {
            // Profile doesn't exist yet, should be created by other flows, but fail-safe:
            setIsOpen(true);
        }
    };

    const checkAvailability = async (val) => {
        if (val.length < 3) {
            setAvailable(null);
            return;
        }

        // Check uniqueness
        const { data } = await supabase
            .from('user_preferences')
            .select('user_id')
            .eq('username', val)
            .maybeSingle();

        setAvailable(!data); // If data exists, not available
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setUploading(true);
        try {
            const fileName = `${user.id}-${Date.now()}.${file.name.split('.').pop()}`;
            await supabase.storage.from('avatars').upload(`avatars/${fileName}`, file);
            const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(`avatars/${fileName}`);
            setAvatarUrl(publicUrl);
            setSkipAvatar(false);
        } catch (error) {
            console.error('Error uploading avatar:', error);
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async () => {
        if (!available || username.length < 3) return;
        setLoading(true);
        setError(null);

        try {
            // Determine final avatar URL
            let finalAvatarUrl = avatarUrl;
            if (skipAvatar && user?.user_metadata?.avatar_url) {
                finalAvatarUrl = user.user_metadata.avatar_url;
            } else if (skipAvatar) {
                finalAvatarUrl = null;
            }

            const { error: updateError } = await supabase
                .from('user_preferences')
                .upsert({
                    user_id: user.id,
                    username: username,
                    display_name: username, // Use the username as display name
                    avatar_url: finalAvatarUrl,
                    notifications_enabled: true,
                    notify_new_spots: true,
                    notify_review_replies: true,
                    notify_weekly_digest: false,
                    updated_at: new Date()
                }, { onConflict: 'user_id' });

            if (updateError) throw updateError;

            // Success
            setIsOpen(false);
            window.location.reload(); // Refresh to propagate changes
        } catch (err) {
            console.error(err);
            setError("Failed to save profile. Try again.");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '20px'
        }}>
            <div className="glass-card" style={{
                width: '100%', maxWidth: '400px', padding: '30px',
                textAlign: 'center', position: 'relative'
            }}>
                <h2 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '10px' }}>
                    {isOldUser ? "Update Required 🚀" : "Welcome to Chai-in!"}
                </h2>
                <p style={{ color: '#666', marginBottom: '24px' }}>
                    {isOldUser
                        ? "We've introduced usernames! Please choose a unique handle to continue."
                        : "Please choose a unique username to continue."}
                </p>

                {/* Avatar Section */}
                <div style={{ marginBottom: '24px' }}>
                    <div style={{ position: 'relative', display: 'inline-block', marginBottom: '16px' }}>
                        <div style={{ 
                            width: '80px', height: '80px', borderRadius: '50%', 
                            border: '3px solid var(--primary)', overflow: 'hidden',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            background: 'var(--secondary)'
                        }}>
                            {avatarUrl ? (
                                <img src={avatarUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                                <User size={40} color="var(--text-muted)" />
                            )}
                        </div>
                        <label htmlFor="avatar-upload" style={{ 
                            position: 'absolute', bottom: '-5px', right: '-5px', 
                            background: 'var(--primary)', color: 'white', 
                            padding: '8px', borderRadius: '12px', cursor: 'pointer',
                            boxShadow: 'var(--shadow-md)'
                        }}>
                            <Camera size={16} />
                        </label>
                        <input id="avatar-upload" type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
                    </div>
                    
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginBottom: '16px' }}>
                        <button
                            onClick={() => setSkipAvatar(false)}
                            style={{
                                padding: '6px 12px', borderRadius: '8px', border: '1px solid var(--primary)',
                                background: !skipAvatar ? 'var(--primary)' : 'white', color: !skipAvatar ? 'white' : 'var(--primary)',
                                fontSize: '0.75rem', fontWeight: '600', cursor: 'pointer'
                            }}
                        >
                            Upload Photo
                        </button>
                        <button
                            onClick={() => setSkipAvatar(true)}
                            style={{
                                padding: '6px 12px', borderRadius: '8px', border: '1px solid var(--secondary)',
                                background: skipAvatar ? 'var(--secondary)' : 'white', color: skipAvatar ? 'var(--text-main)' : 'var(--text-muted)',
                                fontSize: '0.75rem', fontWeight: '600', cursor: 'pointer'
                            }}
                        >
                            Maybe Later
                        </button>
                    </div>
                    {skipAvatar && user?.user_metadata?.avatar_url && (
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>
                            Using your Google profile picture
                        </p>
                    )}
                </div>

                <div style={{ position: 'relative', marginBottom: '20px' }}>
                    <span style={{ position: 'absolute', left: '16px', top: '14px', color: '#999', fontWeight: 'bold' }}>@</span>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => {
                            const val = e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '');
                            setUsername(val);
                            checkAvailability(val);
                        }}
                        placeholder="username"
                        style={{
                            width: '100%', padding: '12px 16px 12px 36px',
                            fontSize: '1.1rem', fontWeight: 'bold',
                            borderRadius: '12px', border: '2px solid #eee',
                            outline: 'none', background: '#fafafa'
                        }}
                    />
                    <div style={{ position: 'absolute', right: '16px', top: '14px' }}>
                        {username.length >= 3 && (
                            available ? <Check color="green" size={20} /> : <X color="red" size={20} />
                        )}
                    </div>
                </div>

                {error && <p style={{ color: 'red', fontSize: '0.9rem', marginBottom: '10px' }}>{error}</p>}

                <button
                    onClick={handleSubmit}
                    disabled={!available || loading}
                    style={{
                        width: '100%', padding: '14px',
                        background: 'var(--primary)', color: 'white',
                        fontWeight: '700', fontSize: '1.1rem',
                        border: 'none', borderRadius: '14px',
                        opacity: (!available || loading) ? 0.5 : 1,
                        cursor: (!available || loading) ? 'not-allowed' : 'pointer'
                    }}
                >
                    {loading ? 'Saving...' : "Let's Go!"}
                </button>
            </div>
        </div>
    );
};

export default SetUsernameModal;
