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
        fetchUnread();

        // Optional: Realtime sync could go here for global unread
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
                style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
                onClick={() => navigate('/en/home')}
            >
                <img
                    src="chai_icon.png"
                    alt="chai."
                    style={{ height: '48px', objectFit: 'contain', mixBlendMode: 'multiply' }}
                    onError={(e) => {
                        const path = window.location.pathname;
                        const base = path.split('/')[1];
                        if (base && !e.target.src.includes(base)) {
                            e.target.src = `/${base}/chai_icon.png`;
                        } else {
                            e.target.src = "/chai_icon.png";
                        }
                    }}
                />
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
                            position: 'absolute', top: '2px', right: '2px',
                            background: 'var(--primary)', color: 'white',
                            fontSize: '0.7rem', fontWeight: 'bold',
                            width: '16px', height: '16px', borderRadius: '50%',
                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                            {unreadCount}
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
                        src={user?.user_metadata?.avatar_url || `https://ui-avatars.com/api/?name=${user?.email}`}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                </div>
            </div>
        </div>
    );
};

export default AppBar;
