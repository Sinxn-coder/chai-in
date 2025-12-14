import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { MapPin, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabaseClient';
import Logo from './Logo';
import NotificationBell from './NotificationBell';

// Imports fixed

const TopBar = ({ location = "Kochi, Kerala" }) => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [userAvatar, setUserAvatar] = useState(null);

    // Try to get lang from params, fallback to 'en'
    const { "*": splat } = useParams();
    const lang = window.location.hash.includes('/ml/') ? 'ml' : 'en';

    // Fetch user preferences for custom avatar
    useEffect(() => {
        if (user) {
            fetchUserAvatar();
        }
    }, [user]);

    const fetchUserAvatar = async () => {
        const { data: prefs } = await supabase
            .from('user_preferences')
            .select('avatar_url')
            .eq('user_id', user.id)
            .single();

        if (prefs?.avatar_url) {
            setUserAvatar(prefs.avatar_url);
        }
    };

    // Default location to show if prop isn't updated
    const displayLocation = location || "Kochi";

    // Use custom avatar if available, otherwise fall back to Google avatar
    const avatarUrl = userAvatar || user?.user_metadata?.avatar_url;

    return (
        <div className="glass-card" style={{
            position: 'sticky',
            top: 0,
            zIndex: 1000,
            margin: '0',
            borderRadius: '0 0 var(--radius-lg) var(--radius-lg)',
            borderTop: 'none',
            padding: '12px 16px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: 'rgba(255, 255, 255, 0.7)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.05)'
        }}>

            {/* Brand & Location */}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <Logo size={24} color="var(--primary)" />
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginLeft: '2px', marginTop: '2px' }}>
                    <MapPin size={12} color="var(--primary)" fill="currentColor" style={{ opacity: 0.8 }} />
                    <span style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-muted)' }}>
                        {displayLocation}
                    </span>
                </div>
            </div>

            {/* Right Actions */}
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <NotificationBell />

                {avatarUrl ? (
                    <img
                        onClick={() => navigate(`/${lang}/profile`)}
                        src={avatarUrl}
                        alt="Profile"
                        style={{
                            width: '36px', height: '36px',
                            borderRadius: '50%',
                            border: '2px solid white',
                            boxShadow: 'var(--shadow-sm)',
                            objectFit: 'cover',
                            cursor: 'pointer'
                        }}
                    />
                ) : (
                    <div
                        onClick={() => navigate(`/${lang}/profile`)}
                        style={{
                            width: '36px', height: '36px',
                            borderRadius: '50%',
                            background: '#f0f0f0',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            cursor: 'pointer',
                            border: '1px solid #ddd'
                        }}>
                        <span style={{ fontSize: '0.9rem', fontWeight: 'bold', color: 'var(--text-muted)' }}>
                            {user?.email ? user.email[0].toUpperCase() : <User size={18} />}
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TopBar;
