import React from 'react';
import { MapPin, Bell, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const TopBar = ({ location = "Kochi, Kerala" }) => {
    const { user } = useAuth();

    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: 'var(--space-md)',
            background: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(8px)',
            position: 'sticky',
            top: 0,
            zIndex: 100,
            boxShadow: 'var(--shadow-sm)',
            borderBottom: '1px solid rgba(255,255,255,0.5)'
        }}>
            {/* Location Selector (Left/Center) */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                    background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)',
                    padding: '8px',
                    borderRadius: '50%',
                    display: 'flex',
                    color: 'white',
                    boxShadow: '0 2px 8px rgba(255, 107, 53, 0.3)'
                }}>
                    <MapPin size={16} />
                </div>
                <div>
                    <span style={{
                        fontSize: '0.75rem',
                        color: 'var(--text-muted)',
                        display: 'block',
                        lineHeight: 1
                    }}>Current Location</span>
                    <span style={{
                        fontWeight: '700',
                        fontSize: '0.9rem',
                        color: 'var(--text-main)'
                    }}>{location}</span>
                </div>
            </div>

            {/* Right Actions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <button style={{ position: 'relative', padding: '4px' }}>
                    <Bell size={20} color="var(--text-main)" />
                    <span style={{
                        position: 'absolute',
                        top: '2px',
                        right: '2px',
                        width: '8px',
                        height: '8px',
                        background: 'var(--danger)',
                        borderRadius: '50%',
                        border: '2px solid white'
                    }} />
                </button>
                <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: '#eee',
                    overflow: 'hidden',
                    border: '2px solid var(--secondary)',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}>
                    {user?.user_metadata?.avatar_url ? (
                        <img src={user.user_metadata.avatar_url} alt="Profile" />
                    ) : (
                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <User size={16} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TopBar;
