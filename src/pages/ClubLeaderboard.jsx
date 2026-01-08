import React, { useState } from 'react';
import { Trophy, Users, Crown, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ClubLeaderboard = ({ lang }) => {
    const [activeTab, setActiveTab] = useState('club');
    const navigate = useNavigate();

    const tabs = [
        { id: 'club', label: 'Club', icon: Users },
        { id: 'leaderboard', label: 'Leaderboard', icon: Crown },
        { id: 'home', label: 'Home', icon: Home }
    ];

    return (
        <div style={{ 
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #fef3c7 0%, #fbbf24 50%, #f59e0b 100%)',
            padding: '20px'
        }}>
            {/* Tab Content - Full Page */}
            <div
                style={{
                    minHeight: 'calc(100vh - 60px)', // Account for bottom nav
                    paddingBottom: '20px',
                    background: 'transparent'
                }}
            >
                {activeTab === 'club' && (
                    <div style={{ textAlign: 'center', padding: '40px' }}>
                        <div>
                            <Users size={48} color="#ef4444" />
                        </div>
                        <h3 style={{ 
                            marginTop: '20px', 
                            fontSize: '1.5rem', 
                            fontWeight: '800', 
                            color: '#1f2937' 
                        }}>
                            Join Community
                        </h3>
                        <p style={{ 
                            color: '#6b7280', 
                            fontSize: '1rem', 
                            lineHeight: '1.5' 
                        }}>
                            Connect with fellow food lovers, share experiences, and discover new spots together.
                        </p>
                    </div>
                )}

                {activeTab === 'leaderboard' && (
                    <div style={{ textAlign: 'center', padding: '40px' }}>
                        <div>
                            <Trophy size={48} color="#ef4444" />
                        </div>
                        <h3 style={{ 
                            marginTop: '20px', 
                            fontSize: '1.5rem', 
                            fontWeight: '800', 
                            color: '#1f2937' 
                        }}>
                            Top Contributors
                        </h3>
                        <p style={{ 
                            color: '#6b7280', 
                            fontSize: '1rem', 
                            lineHeight: '1.5' 
                        }}>
                            Celebrate our most active community members and their contributions.
                        </p>
                    </div>
                )}
            </div>

            {/* Tab Navigation - Fixed at bottom with transparency */}
            <div style={{ 
                position: 'fixed',
                bottom: '20px',
                left: '50%',
                transform: 'translateX(-50%)',
                height: '60px',
                width: '90%',
                maxWidth: '400px',
                display: 'flex', 
                alignItems: 'center',
                justifyContent: 'space-around',
                padding: '0 20px',
                background: 'rgba(239, 68, 68, 0.8)', // Semi-transparent red
                backdropFilter: 'blur(10px)',
                borderRadius: '20px',
                zIndex: 1000,
                boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
                border: '1px solid rgba(255,255,255,0.2)'
            }}>
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => {
                            if (tab.id === 'home') {
                                navigate(`/${lang}/home`);
                            } else if (tab.id === 'leaderboard') {
                                navigate(`/${lang}/leaderboard`);
                            } else if (tab.id === 'club') {
                                navigate(`/${lang}/community`);
                            } else {
                                setActiveTab(tab.id);
                            }
                        }}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: 'white',
                            cursor: 'pointer',
                            padding: '8px',
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.3s ease',
                            opacity: activeTab === tab.id ? 1 : 0.7
                        }}
                    >
                        <tab.icon size={24} />
                    </button>
                ))}
            </div>
        </div>
    );
};

export default ClubLeaderboard;
