import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Bell, User, MapPin } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import NotificationsSheet from './NotificationsSheet';
import { supabase } from '../lib/supabaseClient';

const AppBar = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [showNotifications, setShowNotifications] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const [userPreferences, setUserPreferences] = useState(null);

    // Dynamic title/subtitle based on location
    const isHome = location.pathname.includes('/home');

    useEffect(() => {
        if (!user) return;
        const fetchUnread = async () => {
            const { count } = await supabase
                .from('notifications')
                .select('*', { count: 'exact', head: true })
                .or(`user_id.eq.${user.id},user_id.is.null`)
                .eq('is_read', false);
            setUnreadCount(count || 0);
        };
        
        const fetchUserPrefs = async () => {
            const { data: prefs } = await supabase.from('user_preferences').select('*').eq('user_id', user.id).maybeSingle();
            setUserPreferences(prefs);
        };
        
        const handleProfileUpdate = () => {
            fetchUserPrefs();
        };
        
        fetchUnread();
        fetchUserPrefs();
        
        // Listen for profile updates
        window.addEventListener('userProfileUpdated', handleProfileUpdate);
        
        return () => {
            window.removeEventListener('userProfileUpdated', handleProfileUpdate);
        };
    }, [user]);

    return (
        <div style={{
            position: 'sticky',
            top: 0,
            left: 0,
            right: 0,
            height: '70px',
            background: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(10px)',
            borderBottom: '1px solid rgba(0,0,0,0.05)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 20px',
            zIndex: 1000,
            boxShadow: '0 4px 20px rgba(0,0,0,0.03)'
        }}>
            <NotificationsSheet
                isOpen={showNotifications}
                onClose={() => { setShowNotifications(false); setUnreadCount(0); }}
                userId={user?.id}
            />

            {/* Brand / Logo */}
            <div
                style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
                onClick={() => navigate('/en/home')}
            >
                <img
                    src="./chai_icon.png"
                    alt="Chai-in"
                    style={{
                        height: '40px',
                        width: '40px',
                        objectFit: 'contain',
                        borderRadius: '10px'
                    }}
                    onError={(e) => { e.target.src = 'https://ui-avatars.com/api/?name=C&background=EF2A39&color=fff&rounded=true&size=40' }}
                />
                <span style={{ fontSize: '1.3rem', color: 'var(--text-main)', fontWeight: '900', fontFamily: "'Outfit', sans-serif" }}>Chai.in</span>
            </div>

            {/* Right Actions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <button
                    onClick={() => setShowNotifications(true)}
                    style={{
                        position: 'relative',
                        background: 'white',
                        border: 'none',
                        borderRadius: '12px',
                        width: '40px',
                        height: '40px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                    }}
                >
                    <Bell size={20} color="#333" />
                    {unreadCount > 0 && (
                        <span style={{
                            position: 'absolute', top: '4px', right: '4px',
                            background: '#EF2A39', color: 'white',
                            fontSize: '0.65rem', fontWeight: '900',
                            minWidth: '18px', height: '18px',
                            borderRadius: '50%',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            padding: '0 4px',
                            border: '2px solid white',
                            boxShadow: '0 2px 4px rgba(239, 42, 57, 0.3)'
                        }}>
                            {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                    )}
                </button>

                <div
                    onClick={() => navigate('/en/profile')}
                    style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '12px',
                        background: '#eee',
                        overflow: 'hidden',
                        border: '2px solid white',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                        cursor: 'pointer'
                    }}
                >
                    <img
                        src={userPreferences?.avatar_url || user?.user_metadata?.avatar_url || `https://ui-avatars.com/api/?name=${user?.email}`}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                </div>
            </div>
        </div>
    );
};

export default AppBar;
