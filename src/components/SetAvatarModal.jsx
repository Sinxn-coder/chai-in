import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';
import { Upload, X, User, Camera } from 'lucide-react';
import Toast from './Toast';

const SetAvatarModal = () => {
    const { user } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        checkStatus();
    }, [user]);

    const checkStatus = async () => {
        if (!user) return;

        // Check if user has suppressed this recently
        const suppressed = localStorage.getItem(`suppress_avatar_${user.id}`);
        if (suppressed) return;

        // Check if user already has a custom avatar
        const { data } = await supabase
            .from('user_preferences')
            .select('avatar_url')
            .eq('user_id', user.id)
            .single();

        // If no custom avatar (or it's null), show modal
        if (!data?.avatar_url) {
            // Also check metadata? Usually metadata has Google avatar.
            // Requirement: "ask to upload profile... show a later option"
            // If they have Google avatar, maybe we don't ask? 
            // The user phrasing "ask to upload profile when user login" implies they want custom avatars.
            // But let's be less annoying: if they have NO avatar at all, ask.
            // If they have Google avatar, maybe skip?
            // "ask to upload profile... old users"
            // I'll show it if preference avatar is Missing.
            setIsOpen(true);
        }
    };

    const handleUpload = async (e) => {
        try {
            setUploading(true);
            const file = e.target.files[0];
            if (!file) return;

            if (file.size > 10 * 1024 * 1024) {
                alert("File too large. Max 10MB");
                setUploading(false);
                return;
            }

            const fileExt = file.name.split('.').pop();
            const fileName = `${user.id}-${Math.random()}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
            const publicUrl = data.publicUrl;

            // Update Profile
            await supabase
                .from('user_preferences')
                .upsert({
                    user_id: user.id,
                    avatar_url: publicUrl,
                    updated_at: new Date()
                }, { onConflict: 'user_id' });

            setIsOpen(false);
            window.location.reload();

        } catch (error) {
            console.error(error);
            alert("Error uploading image");
        } finally {
            setUploading(false);
        }
    };

    const handleLater = () => {
        setIsOpen(false);
        // Suppress for 24 hours? Or just this session.
        // User said "show a later option". 
        // I'll suppress for 1 hour to avoid spamming on refresh.
        // Actually session is fine.
        localStorage.setItem(`suppress_avatar_${user.id}`, 'true');
    };

    if (!isOpen) return null;

    return (
        <div style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(5px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '20px'
        }}>
            <div className="glass-card" style={{
                width: '100%', maxWidth: '350px', padding: '30px',
                textAlign: 'center', position: 'relative', background: 'white', border: 'none'
            }}>
                <button onClick={handleLater} style={{ position: 'absolute', right: '15px', top: '15px', background: 'none', border: 'none', cursor: 'pointer' }}>
                    <X color="#999" />
                </button>

                <div style={{
                    width: '100px', height: '100px', borderRadius: '50%', background: '#f0f0f0',
                    margin: '0 auto 20px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    position: 'relative'
                }}>
                    <User size={50} color="#ccc" />
                    <div style={{ position: 'absolute', bottom: 0, right: 0, background: 'var(--primary)', padding: '6px', borderRadius: '50%', color: 'white' }}>
                        <Camera size={16} />
                    </div>
                </div>

                <h2 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '10px' }}>
                    Add a Profile Photo 📸
                </h2>
                <p style={{ color: '#666', marginBottom: '24px', fontSize: '0.95rem' }}>
                    Stand out in the community! Upload a cool avatar.
                </p>

                <label style={{
                    display: 'block',
                    width: '100%', padding: '14px',
                    background: 'var(--primary)', color: 'white',
                    fontWeight: '700', borderRadius: '14px',
                    cursor: uploading ? 'wait' : 'pointer',
                    marginBottom: '10px'
                }}>
                    {uploading ? 'Uploading...' : 'Choose Photo'}
                    <input type="file" accept="image/*" onChange={handleUpload} style={{ display: 'none' }} disabled={uploading} />
                </label>

                <button
                    onClick={handleLater}
                    style={{
                        background: 'none', border: 'none',
                        color: '#888', fontWeight: '600', fontSize: '0.9rem',
                        padding: '10px'
                    }}
                >
                    Maybe Later
                </button>
            </div>
        </div>
    );
};

export default SetAvatarModal;
