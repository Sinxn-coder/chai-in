import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Bell, User, MapPin, Home, Map, Users, Crown, Settings } from 'lucide-react';
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
            }
            @media (max-width: 767px) {
                .desktop-nav {
                    display: none !important;
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
        { to: '/home', icon: Home, label: 'Home' },
        { to: '/map', icon: Map, label: 'Map' },
        { to: '/community', icon: Users, label: 'Club' },
        { to: '/leaderboard', icon: Crown, label: 'Top' },
        { to: '/profile', icon: User, label: 'Profile' },
        { to: '/settings', icon: Settings, label: 'Settings' },
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
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)',
                borderRadius: '16px',
                padding: '8px',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                zIndex: 1000,
                display: 'none' // Hidden by default, shown on desktop
            }} className="desktop-nav">
                
                {/* Logo */}
                <div
                    style={{ 
                        display: 'flex', alignItems: 'center', gap: '8px', 
                        padding: '8px 12px', cursor: 'pointer',
                        borderRadius: '12px', marginBottom: '8px'
                    }}
                    onClick={() => navigate('/en/home')}
                >
                    <img
                        src="/chai-in/chai_icon.png"
                        alt="Chai-in"
                        style={{
                            height: '24px',
                            width: '24px',
                            objectFit: 'contain',
                            borderRadius: '6px'
                        }}
                    />
                    <span style={{ 
                        fontSize: '0.9rem', color: 'var(--text-main)', 
                        fontWeight: '800', fontFamily: "'Outfit', sans-serif" 
                    }}>Chai.in</span>
                </div>

                {/* Navigation Items */}
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
                                    gap: '10px',
                                    padding: '10px 14px',
                                    borderRadius: '12px',
                                    border: 'none',
                                    background: isActive ? 'var(--primary)' : 'transparent',
                                    color: isActive ? 'white' : 'var(--text-main)',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease',
                                    fontSize: '0.85rem',
                                    fontWeight: '700',
                                    width: '100%',
                                    textAlign: 'left'
                                }}
                                onMouseEnter={(e) => {
                                    if (!isActive) {
                                        e.target.style.background = 'var(--secondary)';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (!isActive) {
                                        e.target.style.background = 'transparent';
                                    }
                                }}
                            >
                                <item.icon size={18} />
                                <span>{item.label}</span>
                            </button>
                        );
                    })}
                </div>

                {/* User Actions */}
                <div style={{ 
                    borderTop: '1px solid rgba(0,0,0,0.1)', 
                    paddingTop: '8px', marginTop: '8px' 
                }}>
                    {/* Notifications */}
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
                            boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                            marginBottom: '8px'
                        }}
                    >
                        <Bell size={18} color="#333" />
                        {unreadCount > 0 && (
                            <span style={{
                                position: 'absolute', top: '2px', right: '2px',
                                background: '#EF2A39', color: 'white',
                                fontSize: '0.6rem', fontWeight: '900',
                                minWidth: '16px', height: '16px',
                                borderRadius: '50%',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                padding: '0 3px',
                                border: '1px solid white',
                                boxShadow: '0 2px 4px rgba(239, 42, 57, 0.3)'
                            }}>
                                {unreadCount > 9 ? '9+' : unreadCount}
                            </span>
                        )}
                    </button>

                    {/* Profile Avatar */}
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
        </>
    );
};

export default DesktopNav;
