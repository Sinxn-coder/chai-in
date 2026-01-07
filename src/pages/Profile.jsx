import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Settings, LogOut, Award, Star, MapPin, Zap, ChevronRight, Heart, MessageSquare, Plus, Shield, MessageCircle, Trash2, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { motion } from 'framer-motion';
import SpotCard from '../components/SpotCard';
import FoodLoader from '../components/FoodLoader';

const Profile = ({ lang }) => {
    const { user, signOut } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [userPreferences, setUserPreferences] = useState(null);
    const [stats, setStats] = useState({ spots: 0, reviews: 0, xp: 0 });
    const [activeTab, setActiveTab] = useState('favorites');
    const [tabData, setTabData] = useState([]);
    const [tabLoading, setTabLoading] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);

    useEffect(() => {
        if (user) {
            fetchProfileData();
            window.addEventListener('focus', fetchProfileData);
            // Listen for profile updates
            window.addEventListener('userProfileUpdated', fetchProfileData);
            // Listen for visit updates to refresh stats in real-time
            window.addEventListener('visitUpdated', fetchProfileData);
        }
        return () => {
            if (user) {
                window.removeEventListener('focus', fetchProfileData);
                window.removeEventListener('userProfileUpdated', fetchProfileData);
                window.removeEventListener('visitUpdated', fetchProfileData);
            }
        };
    }, [user]);

    useEffect(() => {
        if (user) fetchTabData();
    }, [activeTab, user]);

    const fetchProfileData = async () => {
        setLoading(true);
        const { data: prefs } = await supabase.from('user_preferences').select('*').eq('user_id', user.id).maybeSingle();
        setUserPreferences(prefs);

        const { count: spotsCount } = await supabase.from('spots').select('*', { count: 'exact', head: true }).eq('created_by', user.id);
        const { count: reviewsCount } = await supabase.from('reviews').select('*', { count: 'exact', head: true }).eq('user_id', user.id);
        const { count: favCount } = await supabase.from('user_favorites').select('*', { count: 'exact', head: true }).eq('user_id', user.id);
        const { count: visitsCount } = await supabase.from('visited_spots').select('*', { count: 'exact', head: true }).eq('user_id', user.id);

        setStats({
            spots: spotsCount || 0,
            reviews: reviewsCount || 0,
            favorites: favCount || 0,
            visits: visitsCount || 0,
            xp: ((spotsCount || 0) * 100) + ((reviewsCount || 0) * 10) + ((visitsCount || 0) * 5)
        });
        setLoading(false);
    };

    const fetchTabData = async () => {
        setTabLoading(true);
        if (activeTab === 'favorites') {
            const { data: favData } = await supabase.from('user_favorites').select('spot_id').eq('user_id', user.id);
            if (favData && favData.length > 0) {
                const spotIds = favData.map(f => f.spot_id);
                const { data: spotsData } = await supabase.from('spots').select('*').in('id', spotIds);
                setTabData(spotsData || []);
            } else {
                setTabData([]);
            }
        } else if (activeTab === 'reviews') {
            const { data: reviewsData } = await supabase.from('reviews').select('*, spots(name)').eq('user_id', user.id).order('created_at', { ascending: false });
            setTabData(reviewsData || []);
        } else if (activeTab === 'added') {
            const { data: spotsData } = await supabase.from('spots').select('*').eq('created_by', user.id).order('created_at', { ascending: false });
            setTabData(spotsData || []);
        }
        setTabLoading(false);
    };

    const handleSignOut = async () => {
        await signOut();
        navigate(`/${lang || 'en'}/login`);
    };

    const handleDeleteAccount = async () => {
        if (!user) return;
        
        setDeleteLoading(true);
        try {
            // Get admin user ID (you'll need to set this up)
            const { data: adminUser } = await supabase
                .from('user_preferences')
                .select('user_id')
                .eq('username', 'admin')
                .maybeSingle();
            
            const adminId = adminUser?.user_id || user.id; // fallback to current user if no admin
            
            // 1. Delete user's community posts
            await supabase
                .from('community_posts')
                .delete()
                .eq('user_id', user.id);
            
            // 2. Delete user's post comments
            await supabase
                .from('post_comments')
                .delete()
                .eq('user_id', user.id);
            
            // 3. Delete user's reviews
            await supabase
                .from('reviews')
                .delete()
                .eq('user_id', user.id);
            
            // 4. Delete user's favorites
            await supabase
                .from('user_favorites')
                .delete()
                .eq('user_id', user.id);
            
            // 5. Delete user's visit records
            await supabase
                .from('visited_spots')
                .delete()
                .eq('user_id', user.id);
            
            // 6. Update user's spots to admin
            await supabase
                .from('spots')
                .update({ created_by: adminId })
                .eq('created_by', user.id);
            
            // 7. Delete user preferences
            await supabase
                .from('user_preferences')
                .delete()
                .eq('user_id', user.id);
            
            // 8. Delete auth user
            await supabase.auth.admin.deleteUser(user.id);
            
            // Sign out and redirect
            await signOut();
            navigate(`/${lang || 'en'}/login`);
            
        } catch (error) {
            console.error('Error deleting account:', error);
            alert('Error deleting account. Please contact admin.');
        } finally {
            setDeleteLoading(false);
            setShowDeleteConfirm(false);
        }
    };

    const tabs = [
        { id: 'favorites', label: 'Favorites', icon: Heart, count: stats.favorites },
        { id: 'reviews', label: 'Reviews', icon: MessageSquare, count: stats.reviews },
        { id: 'added', label: 'Added', icon: Plus, count: stats.spots },
    ];

    return (
        <div style={{ paddingBottom: '120px', background: 'var(--bg-white)', minHeight: '100vh' }}>

            {/* Header Pattern */}
            <div style={{
                height: '180px',
                background: 'linear-gradient(135deg, var(--primary) 0%, #FF6B6B 100%)',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <div style={{ position: 'absolute', inset: 0, opacity: 0.1, backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }} />
            </div>

            {/* Profile Info */}
            <div style={{ marginTop: '-60px', textAlign: 'center', padding: '0 20px', position: 'relative' }}>
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    style={{
                        width: '120px', height: '120px',
                        borderRadius: '40px',
                        background: 'white',
                        margin: '0 auto',
                        padding: '6px',
                        boxShadow: 'var(--shadow-lg)'
                    }}
                >
                    <div style={{ width: '100%', height: '100%', borderRadius: '34px', overflow: 'hidden', background: 'var(--secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {userPreferences?.avatar_url ? (
                            <img src={userPreferences.avatar_url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                            <User size={50} color="var(--text-muted)" />
                        )}
                    </div>
                </motion.div>

                <h1 style={{ marginTop: '16px', fontSize: '1.6rem', fontWeight: '900', color: 'var(--text-main)', margin: '16px 0 4px 0' }}>
                    {userPreferences?.display_name || user?.user_metadata?.full_name || 'Foodie Voyager'}
                </h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', fontWeight: '500' }}>
                    Elite Level Discoverer • Kerala, IN
                </p>
            </div>

            {/* Stats Deck */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', padding: '24px 20px' }}>
                {[
                    { label: 'Visits', value: stats.visits, icon: MapPin },
                    { label: 'Reviews', value: stats.reviews, icon: Star },
                    { label: 'Added', value: stats.spots, icon: Plus },
                    { label: 'XP', value: stats.xp, icon: Zap },
                ].map((stat, i) => (
                    <div key={i} style={{ background: 'var(--secondary)', padding: '16px 8px', borderRadius: '24px', textAlign: 'center' }}>
                        <stat.icon size={20} color="var(--primary)" style={{ marginBottom: '8px' }} />
                        <div style={{ fontSize: '1.2rem', fontWeight: '900', color: 'var(--text-main)' }}>{stat.value}</div>
                        <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', marginTop: '2px' }}>{stat.label}</div>
                    </div>
                ))}
            </div>

            {/* Navigation Buttons */}
            <div style={{ padding: '0 20px', marginBottom: '20px' }}>
                <div style={{ display: 'flex', gap: '8px', background: 'var(--secondary)', padding: '6px', borderRadius: '20px' }}>
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => navigate(`/${lang}/profile/${tab.id}`)}
                            style={{
                                flex: 1,
                                padding: '12px',
                                borderRadius: '16px',
                                background: 'transparent',
                                border: 'none',
                                fontWeight: '800',
                                fontSize: '0.85rem',
                                color: 'var(--text-muted)',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '6px'
                            }}
                        >
                            <tab.icon size={16} />
                            {tab.label} ({tab.count})
                        </button>
                    ))}
                </div>
            </div>

            {/* Quick Actions */}
            <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '20px' }}>
                <motion.div
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate(`/${lang}/settings`)}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '16px 20px',
                        background: 'white',
                        borderRadius: '24px',
                        boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
                        cursor: 'pointer',
                        border: '1px solid var(--secondary)'
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{ padding: '10px', borderRadius: '14px', background: '#EEF2FF' }}>
                            <Settings size={22} color="#4F46E5" />
                        </div>
                        <span style={{ fontWeight: '800', fontSize: '1.05rem', color: 'var(--text-main)' }}>Settings</span>
                    </div>
                    <ChevronRight size={20} color="var(--text-muted)" />
                </motion.div>

                <motion.div
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate(`/${lang}/leaderboard`)}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '16px 20px',
                        background: 'white',
                        borderRadius: '24px',
                        boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
                        cursor: 'pointer',
                        border: '1px solid var(--secondary)'
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{ padding: '10px', borderRadius: '14px', background: '#FFFBEB' }}>
                            <Award size={22} color="#F59E0B" />
                        </div>
                        <span style={{ fontWeight: '800', fontSize: '1.05rem', color: 'var(--text-main)' }}>Leaderboard</span>
                    </div>
                    <ChevronRight size={20} color="var(--text-muted)" />
                </motion.div>

                <motion.div
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate(`/${lang}/privacy-policy`)}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '16px 20px',
                        background: 'white',
                        borderRadius: '24px',
                        boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
                        cursor: 'pointer',
                        border: '1px solid var(--secondary)'
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{ padding: '10px', borderRadius: '14px', background: '#F0FDF4' }}>
                            <Shield size={22} color="#10B981" />
                        </div>
                        <span style={{ fontWeight: '800', fontSize: '1.05rem', color: 'var(--text-main)' }}>Privacy Policy</span>
                    </div>
                    <ChevronRight size={20} color="var(--text-muted)" />
                </motion.div>

                <motion.div
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate(`/${lang}/contact-admin`)}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '16px 20px',
                        background: 'white',
                        borderRadius: '24px',
                        boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
                        cursor: 'pointer',
                        border: '1px solid var(--secondary)'
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{ padding: '10px', borderRadius: '14px', background: '#FEF2F2' }}>
                            <MessageCircle size={22} color="#EF4444" />
                        </div>
                        <span style={{ fontWeight: '800', fontSize: '1.05rem', color: 'var(--text-main)' }}>Contact Admin</span>
                    </div>
                    <ChevronRight size={20} color="var(--text-muted)" />
                </motion.div>

                <motion.div
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSignOut}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '16px 20px',
                        background: 'white',
                        borderRadius: '24px',
                        boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
                        cursor: 'pointer',
                        border: '1px solid var(--secondary)'
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{ padding: '10px', borderRadius: '14px', background: '#F3F4F6' }}>
                            <LogOut size={22} color="#6B7280" />
                        </div>
                        <span style={{ fontWeight: '800', fontSize: '1.05rem', color: 'var(--text-main)' }}>Logout</span>
                    </div>
                    <ChevronRight size={20} color="var(--text-muted)" />
                </motion.div>

                <motion.div
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowDeleteConfirm(true)}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '16px 20px',
                        background: 'white',
                        borderRadius: '24px',
                        boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
                        cursor: 'pointer',
                        border: '1px solid #FEE2E2'
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{ padding: '10px', borderRadius: '14px', background: '#FEE2E2' }}>
                            <Trash2 size={22} color="#DC2626" />
                        </div>
                        <span style={{ fontWeight: '800', fontSize: '1.05rem', color: '#DC2626' }}>Delete Account</span>
                    </div>
                    <ChevronRight size={20} color="#DC2626" />
                </motion.div>
            </div>

            {/* Delete Account Confirmation Modal */}
            {showDeleteConfirm && (
                <div style={{
                    position: 'fixed',
                    inset: 0,
                    background: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 9999,
                    padding: '20px'
                }}>
                    <div style={{
                        background: 'white',
                        borderRadius: '24px',
                        padding: '32px',
                        maxWidth: '400px',
                        width: '100%',
                        textAlign: 'center'
                    }}>
                        <div style={{
                            width: '60px',
                            height: '60px',
                            borderRadius: '50%',
                            background: '#FEE2E2',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 20px'
                        }}>
                            <AlertTriangle size={30} color="#DC2626" />
                        </div>
                        
                        <h2 style={{ fontSize: '1.5rem', fontWeight: '900', color: 'var(--text-main)', marginBottom: '12px' }}>
                            Delete Account?
                        </h2>
                        
                        <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '24px' }}>
                            This action cannot be undone. All your data including posts, reviews, favorites, and visits will be permanently deleted. Your added spots will be transferred to admin.
                        </p>
                        
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button
                                onClick={() => setShowDeleteConfirm(false)}
                                disabled={deleteLoading}
                                style={{
                                    flex: 1,
                                    padding: '16px',
                                    borderRadius: '16px',
                                    border: '2px solid var(--secondary)',
                                    background: 'white',
                                    color: 'var(--text-main)',
                                    fontWeight: '800',
                                    cursor: deleteLoading ? 'not-allowed' : 'pointer'
                                }}
                            >
                                Cancel
                            </button>
                            
                            <button
                                onClick={handleDeleteAccount}
                                disabled={deleteLoading}
                                style={{
                                    flex: 1,
                                    padding: '16px',
                                    borderRadius: '16px',
                                    border: 'none',
                                    background: '#DC2626',
                                    color: 'white',
                                    fontWeight: '800',
                                    cursor: deleteLoading ? 'not-allowed' : 'pointer',
                                    opacity: deleteLoading ? 0.7 : 1
                                }}
                            >
                                {deleteLoading ? 'Deleting...' : 'Delete Forever'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile;
