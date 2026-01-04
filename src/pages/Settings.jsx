import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Camera, Save, Bell, User, Mail, Shield, Info } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import Toast from '../components/Toast';
import { motion } from 'framer-motion';

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
        if (user) fetchUserPreferences();
    }, [user]);

    const fetchUserPreferences = async () => {
        setLoading(true);
        const { data: prefs } = await supabase.from('user_preferences').select('*').eq('user_id', user.id).single();
        if (prefs) {
            setFormData({
                displayName: prefs.display_name || user.user_metadata?.full_name || '',
                avatarUrl: prefs.avatar_url || user.user_metadata?.avatar_url || '',
                notificationsEnabled: prefs.notifications_enabled,
                notifyNewSpots: prefs.notify_new_spots,
                notifyReviewReplies: prefs.notify_review_replies,
                notifyWeeklyDigest: prefs.notify_weekly_digest
            });
        }
        setLoading(false);
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setUploading(true);
        try {
            const fileName = `${user.id}-${Date.now()}.${file.name.split('.').pop()}`;
            await supabase.storage.from('avatars').upload(`avatars/${fileName}`, file);
            const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(`avatars/${fileName}`);
            setFormData({ ...formData, avatarUrl: publicUrl });
            setToast({ message: 'Avatar updated! Ready to save.', type: 'success' });
        } catch (error) {
            setToast({ message: 'Upload failed', type: 'error' });
        } finally {
            setUploading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const prefsData = {
                user_id: user.id,
                display_name: formData.displayName,
                avatar_url: formData.avatarUrl,
                notifications_enabled: formData.notificationsEnabled,
                notify_new_spots: formData.notifyNewSpots,
                notify_review_replies: formData.notifyReviewReplies,
                notify_weekly_digest: formData.notifyWeeklyDigest
            };
            await supabase.from('user_preferences').upsert(prefsData, { onConflict: 'user_id' });
            setToast({ message: 'Settings saved successfully! ✨', type: 'success' });
            setTimeout(() => navigate(-1), 1500);
        } catch (error) {
            setToast({ message: 'Failed to save', type: 'error' });
        } finally {
            setSaving(false);
        }
    };

    return (
        <div style={{ minHeight: '100vh', background: 'var(--secondary)', paddingBottom: '120px' }}>
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

            {/* Red Header */}
            <div style={{ height: '140px', background: 'var(--primary)', borderBottomLeftRadius: '40px', borderBottomRightRadius: '40px', padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                <button onClick={() => navigate(-1)} style={{ position: 'absolute', left: '20px', background: 'rgba(255,255,255,0.2)', border: 'none', padding: '10px', borderRadius: '15px', color: 'white' }}>
                    <ChevronLeft size={24} />
                </button>
                <h1 style={{ color: 'white', fontWeight: '900', fontSize: '1.4rem', margin: 0 }}>App Settings</h1>
            </div>

            <div className="container" style={{ padding: '0 20px', marginTop: '-40px' }}>
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '40px' }}><motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}><Info size={30} color="var(--primary)" /></motion.div></div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

                        {/* Profile Card */}
                        <div style={{ background: 'white', borderRadius: '32px', padding: '24px', boxShadow: 'var(--shadow-md)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                                <User size={20} color="var(--primary)" />
                                <h2 style={{ fontSize: '1.1rem', fontWeight: '900', color: 'var(--text-main)', margin: 0 }}>Account Details</h2>
                            </div>

                            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                                <div style={{ position: 'relative', display: 'inline-block' }}>
                                    <div style={{ width: '100px', height: '100px', borderRadius: '32px', border: '4px solid var(--secondary)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
                                        {formData.avatarUrl ? <img src={formData.avatarUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--secondary)' }}><User size={40} color="var(--text-muted)" /></div>}
                                    </div>
                                    <label htmlFor="avatar-upload" style={{ position: 'absolute', bottom: '-5px', right: '-5px', background: 'var(--primary)', color: 'white', padding: '8px', borderRadius: '12px', cursor: 'pointer', boxShadow: 'var(--shadow-md)' }}>
                                        <Camera size={18} />
                                    </label>
                                    <input id="avatar-upload" type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
                                </div>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <div>
                                    <label style={{ fontSize: '0.8rem', fontWeight: '800', color: 'var(--text-muted)', marginBottom: '8px', display: 'block' }}>DISPLAY NAME</label>
                                    <input
                                        type="text"
                                        value={formData.displayName}
                                        onChange={e => setFormData({ ...formData, displayName: e.target.value })}
                                        style={{ width: '100%', padding: '14px', borderRadius: '16px', background: 'var(--secondary)', border: 'none', fontWeight: '700', outline: 'none' }}
                                    />
                                </div>
                                <div>
                                    <label style={{ fontSize: '0.8rem', fontWeight: '800', color: 'var(--text-muted)', marginBottom: '8px', display: 'block' }}>EMAIL ADDRESS</label>
                                    <div style={{ width: '100%', padding: '14px', borderRadius: '16px', background: 'var(--secondary)', color: 'var(--text-muted)', fontWeight: '700', opacity: 0.8 }}>{user?.email}</div>
                                </div>
                            </div>
                        </div>

                        {/* Notifications Card */}
                        <div style={{ background: 'white', borderRadius: '32px', padding: '24px', boxShadow: 'var(--shadow-md)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                                <Bell size={20} color="var(--primary)" />
                                <h2 style={{ fontSize: '1.1rem', fontWeight: '900', color: 'var(--text-main)', margin: 0 }}>Notifications</h2>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                {[
                                    { id: 'notificationsEnabled', label: 'Push Notifications', desc: 'Main alert switch' },
                                    { id: 'notifyNewSpots', label: 'New Spots', desc: 'Alerts for nearby additions' },
                                    { id: 'notifyReviewReplies', label: 'Review Replies', desc: 'When someone chats back' }
                                ].map(notif => (
                                    <div key={notif.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div>
                                            <div style={{ fontWeight: '800', fontSize: '0.95rem' }}>{notif.label}</div>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '600' }}>{notif.desc}</div>
                                        </div>
                                        <input
                                            type="checkbox"
                                            checked={formData[notif.id]}
                                            onChange={e => setFormData({ ...formData, [notif.id]: e.target.checked })}
                                            style={{ width: '22px', height: '22px', accentColor: 'var(--primary)' }}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Actions */}
                        <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={handleSave}
                            disabled={saving}
                            style={{ width: '100%', padding: '20px', borderRadius: '24px', background: 'var(--primary)', color: 'white', border: 'none', fontWeight: '900', fontSize: '1rem', boxShadow: 'var(--shadow-md)', opacity: saving ? 0.6 : 1 }}
                        >
                            {saving ? 'Saving...' : 'Save Settings ✨'}
                        </motion.button>

                    </div>
                )}
            </div>
        </div>
    );
};

export default Settings;
