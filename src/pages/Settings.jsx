import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Camera, Save, Bell, User, Mail } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import Toast from '../components/Toast';

const Settings = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [toast, setToast] = useState(null);

    const [formData, setFormData] = useState({
        displayName: '',
        avatarUrl: '',
        notificationsEnabled: true,
        notifyNewSpots: true,
        notifyReviewReplies: true,
        notifyWeeklyDigest: false
    });

    useEffect(() => {
        if (user) {
            fetchUserPreferences();
        }
    }, [user]);

    const fetchUserPreferences = async () => {
        setLoading(true);

        // Fetch user preferences
        const { data: prefs, error } = await supabase
            .from('user_preferences')
            .select('*')
            .eq('user_id', user.id)
            .single();

        if (prefs) {
            setFormData({
                displayName: prefs.display_name || user.user_metadata?.full_name || '',
                avatarUrl: prefs.avatar_url || user.user_metadata?.avatar_url || '',
                notificationsEnabled: prefs.notifications_enabled,
                notifyNewSpots: prefs.notify_new_spots,
                notifyReviewReplies: prefs.notify_review_replies,
                notifyWeeklyDigest: prefs.notify_weekly_digest
            });
        } else {
            // No preferences yet, use defaults from user metadata
            setFormData({
                displayName: user.user_metadata?.full_name || '',
                avatarUrl: user.user_metadata?.avatar_url || '',
                notificationsEnabled: true,
                notifyNewSpots: true,
                notifyReviewReplies: true,
                notifyWeeklyDigest: false
            });
        }

        setLoading(false);
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            setToast({ message: 'Please upload an image file', type: 'error' });
            return;
        }

        // Validate file size (max 2MB)
        if (file.size > 2 * 1024 * 1024) {
            setToast({ message: 'Image must be less than 2MB', type: 'error' });
            return;
        }

        setUploading(true);

        try {
            // Create unique filename
            const fileExt = file.name.split('.').pop();
            const fileName = `${user.id}-${Date.now()}.${fileExt}`;
            const filePath = `avatars/${fileName}`;

            // Upload to Supabase Storage
            const { data: uploadData, error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(filePath, file, {
                    cacheControl: '3600',
                    upsert: true
                });

            if (uploadError) {
                console.error('Upload error:', uploadError);
                // Check if it's a bucket not found error
                if (uploadError.message?.includes('not found') || uploadError.message?.includes('Bucket')) {
                    setToast({
                        message: 'Storage not set up. Please create "avatars" bucket in Supabase Storage first.',
                        type: 'error'
                    });
                } else {
                    setToast({ message: `Upload failed: ${uploadError.message}`, type: 'error' });
                }
                setUploading(false);
                return;
            }

            // Get public URL
            const { data: { publicUrl } } = supabase.storage
                .from('avatars')
                .getPublicUrl(filePath);

            setFormData({ ...formData, avatarUrl: publicUrl });
            setToast({ message: 'Photo uploaded successfully!', type: 'success' });
        } catch (error) {
            console.error('Upload error:', error);
            setToast({ message: 'Failed to upload photo. Check console for details.', type: 'error' });
        } finally {
            setUploading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);

        try {
            // Check if preferences exist
            const { data: existing } = await supabase
                .from('user_preferences')
                .select('id')
                .eq('user_id', user.id)
                .single();

            const prefsData = {
                user_id: user.id,
                display_name: formData.displayName,
                avatar_url: formData.avatarUrl,
                notifications_enabled: formData.notificationsEnabled,
                notify_new_spots: formData.notifyNewSpots,
                notify_review_replies: formData.notifyReviewReplies,
                notify_weekly_digest: formData.notifyWeeklyDigest
            };

            if (existing) {
                // Update existing preferences
                const { error } = await supabase
                    .from('user_preferences')
                    .update(prefsData)
                    .eq('user_id', user.id);

                if (error) throw error;
            } else {
                // Insert new preferences
                const { error } = await supabase
                    .from('user_preferences')
                    .insert([prefsData]);

                if (error) throw error;
            }

            setToast({ message: 'Settings saved successfully!', type: 'success' });

            // Navigate back to profile after a short delay
            setTimeout(() => {
                navigate(-1);
            }, 1500);
        } catch (error) {
            console.error('Save error:', error);
            setToast({ message: 'Failed to save settings', type: 'error' });
        } finally {
            setSaving(false);
        }
    };

    if (!user) {
        navigate('/');
        return null;
    }

    return (
        <div style={{ minHeight: '100vh', paddingBottom: '100px', background: '#f9f9f9' }}>
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

            {/* Header */}
            <div className="glass-card" style={{
                position: 'sticky',
                top: 0,
                zIndex: 100,
                padding: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                borderRadius: '0 0 16px 16px'
            }}>
                <button onClick={() => navigate(-1)} style={{ padding: '8px' }}>
                    <ArrowLeft size={24} />
                </button>
                <h1 style={{ fontSize: '1.5rem', fontWeight: '800', margin: 0 }}>Settings</h1>
            </div>

            <div className="container" style={{ padding: '1rem', maxWidth: '600px', margin: '0 auto' }}>
                {loading ? (
                    <p style={{ textAlign: 'center', padding: '2rem', color: '#999' }}>Loading settings...</p>
                ) : (
                    <>
                        {/* Profile Section */}
                        <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '1rem' }}>
                            <h2 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <User size={20} color="var(--primary)" />
                                Profile Information
                            </h2>

                            {/* Profile Photo */}
                            <div style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
                                <div style={{ position: 'relative', display: 'inline-block' }}>
                                    <img
                                        src={formData.avatarUrl || 'https://via.placeholder.com/120'}
                                        alt="Profile"
                                        style={{
                                            width: '120px',
                                            height: '120px',
                                            borderRadius: '50%',
                                            objectFit: 'cover',
                                            border: '4px solid white',
                                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                                        }}
                                    />
                                    <label
                                        htmlFor="avatar-upload"
                                        style={{
                                            position: 'absolute',
                                            bottom: 0,
                                            right: 0,
                                            background: 'var(--primary)',
                                            color: 'white',
                                            width: '40px',
                                            height: '40px',
                                            borderRadius: '50%',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            cursor: 'pointer',
                                            border: '3px solid white',
                                            boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                                        }}
                                    >
                                        <Camera size={20} />
                                    </label>
                                    <input
                                        id="avatar-upload"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        style={{ display: 'none' }}
                                        disabled={uploading}
                                    />
                                </div>
                                {uploading && (
                                    <p style={{ marginTop: '0.5rem', color: 'var(--primary)', fontSize: '0.9rem' }}>
                                        Uploading...
                                    </p>
                                )}
                            </div>

                            {/* Display Name */}
                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', fontSize: '0.9rem' }}>
                                    Display Name
                                </label>
                                <input
                                    type="text"
                                    value={formData.displayName}
                                    onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                                    placeholder="Enter your name"
                                    style={{
                                        width: '100%',
                                        padding: '12px',
                                        border: '1px solid #ddd',
                                        borderRadius: '8px',
                                        fontSize: '1rem',
                                        fontFamily: 'inherit'
                                    }}
                                />
                            </div>

                            {/* Email (Read-only) */}
                            <div>
                                <label style={{ marginBottom: '0.5rem', fontWeight: '600', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <Mail size={16} />
                                    Email
                                </label>
                                <input
                                    type="email"
                                    value={user.email}
                                    readOnly
                                    style={{
                                        width: '100%',
                                        padding: '12px',
                                        border: '1px solid #ddd',
                                        borderRadius: '8px',
                                        fontSize: '1rem',
                                        fontFamily: 'inherit',
                                        background: '#f5f5f5',
                                        color: '#999'
                                    }}
                                />
                            </div>
                        </div>

                        {/* Notification Preferences */}
                        <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '1rem' }}>
                            <h2 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Bell size={20} color="var(--primary)" />
                                Notification Preferences
                            </h2>

                            {/* Master Toggle */}
                            <div style={{ marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid #eee' }}>
                                <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
                                    <div>
                                        <div style={{ fontWeight: '600', marginBottom: '4px' }}>Enable Notifications</div>
                                        <div style={{ fontSize: '0.85rem', color: '#999' }}>Receive all notifications</div>
                                    </div>
                                    <input
                                        type="checkbox"
                                        checked={formData.notificationsEnabled}
                                        onChange={(e) => setFormData({ ...formData, notificationsEnabled: e.target.checked })}
                                        style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                                    />
                                </label>
                            </div>

                            {/* Individual Notification Types */}
                            <div style={{ opacity: formData.notificationsEnabled ? 1 : 0.5, pointerEvents: formData.notificationsEnabled ? 'auto' : 'none' }}>
                                <div style={{ marginBottom: '1rem' }}>
                                    <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
                                        <div>
                                            <div style={{ fontWeight: '600', marginBottom: '4px' }}>New Spots Nearby</div>
                                            <div style={{ fontSize: '0.85rem', color: '#999' }}>Get notified about new spots in your area</div>
                                        </div>
                                        <input
                                            type="checkbox"
                                            checked={formData.notifyNewSpots}
                                            onChange={(e) => setFormData({ ...formData, notifyNewSpots: e.target.checked })}
                                            style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                                        />
                                    </label>
                                </div>

                                <div style={{ marginBottom: '1rem' }}>
                                    <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
                                        <div>
                                            <div style={{ fontWeight: '600', marginBottom: '4px' }}>Review Replies</div>
                                            <div style={{ fontSize: '0.85rem', color: '#999' }}>When someone replies to your reviews</div>
                                        </div>
                                        <input
                                            type="checkbox"
                                            checked={formData.notifyReviewReplies}
                                            onChange={(e) => setFormData({ ...formData, notifyReviewReplies: e.target.checked })}
                                            style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                                        />
                                    </label>
                                </div>

                                <div>
                                    <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
                                        <div>
                                            <div style={{ fontWeight: '600', marginBottom: '4px' }}>Weekly Digest</div>
                                            <div style={{ fontSize: '0.85rem', color: '#999' }}>Summary of activity and new spots</div>
                                        </div>
                                        <input
                                            type="checkbox"
                                            checked={formData.notifyWeeklyDigest}
                                            onChange={(e) => setFormData({ ...formData, notifyWeeklyDigest: e.target.checked })}
                                            style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                                        />
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Save Button */}
                        <Button
                            onClick={handleSave}
                            disabled={saving || uploading}
                            style={{
                                width: '100%',
                                justifyContent: 'center',
                                padding: '16px',
                                fontSize: '1.1rem',
                                opacity: (saving || uploading) ? 0.6 : 1
                            }}
                        >
                            <Save size={20} />
                            {saving ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </>
                )}
            </div>
        </div>
    );
};

export default Settings;
