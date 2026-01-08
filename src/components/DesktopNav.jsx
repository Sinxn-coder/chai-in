import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Bell, User, MapPin, Home, Users, Crown, Settings, Plus, Compass } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import NotificationsSheet from './NotificationsSheet';
import { supabase } from '../lib/supabaseClient';

// Add CSS to head
const addDesktopNavCSS = () => {
    const styleId = 'desktop-nav-css';
    if (!document.getElementById(styleId)) {
        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
            @media (min-width: 768px) {
                .desktop-nav {
                    display: block !important;
                }
                .mobile-only {
                    display: none !important;
                }
            }
            @media (max-width: 767px) {
                .desktop-nav {
                    display: none !important;
                }
                .mobile-only {
                    display: block !important;
                }
            }
        `;
        document.head.appendChild(style);
    }
};

const DesktopNav = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [showNotifications, setShowNotifications] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const [userPreferences, setUserPreferences] = useState(null);

    // Check if current page is home
    const isHome = location.pathname.includes('/home');

    useEffect(() => {
        if (!user) return;
        addDesktopNavCSS();
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

    const navItems = [
        { to: '/home', icon: Home },
        { to: '/explore', icon: Compass },
        { to: '/map', icon: MapPin },
        { to: '/add-spot', icon: Plus },
        { to: '/club-leaderboard', icon: Users },
        { to: '/profile', icon: User },
    ];

    return (
        <>
            {/* Notifications Sheet */}
            <NotificationsSheet
                isOpen={showNotifications}
                onClose={() => { setShowNotifications(false); setUnreadCount(0); }}
                userId={user?.id}
            />

            {/* Desktop Navigation - Right Side */}
            <div style={{
                position: 'fixed',
                top: '50%',
                right: '20px',
                transform: 'translateY(-50%)',
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(20px)',
                borderRadius: '20px',
                padding: '8px',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                zIndex: 1000,
                display: 'none',
                width: 'fit-content'
            }} className="desktop-nav">
                
                {/* Navigation Items - Icons Only */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {navItems.map((item, idx) => {
                        const isActive = location.pathname.includes(item.to);
                        return (
                            <button
                                key={item.to}
                                onClick={() => navigate(`/en${item.to}`)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    padding: '10px',
                                    borderRadius: '12px',
                                    border: 'none',
                                    background: isActive ? 'rgba(239, 42, 57, 0.8)' : 'transparent',
                                    color: isActive ? 'white' : '#333333',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease',
                                    width: '40px',
                                    height: '40px'
                                }}
                                onMouseEnter={(e) => {
                                    if (!isActive) {
                                        e.target.style.background = 'rgba(255, 255, 255, 0.2)';
                                        e.target.style.color = '#333333';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (!isActive) {
                                        e.target.style.background = 'transparent';
                                        e.target.style.color = '#333333';
                                    }
                                }}
                            >
                                <item.icon size={18} />
                            </button>
                        );
                    })}
                </div>
            </div>
        </>
    );
};

export default DesktopNav;
