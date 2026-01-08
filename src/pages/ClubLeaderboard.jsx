import React, { useState } from 'react';
import { Trophy, Users, Crown, Home } from 'lucide-react';

const ClubLeaderboard = ({ lang }) => {
    const [activeTab, setActiveTab] = useState('club');

    const tabs = [
        { id: 'club', label: 'Club', icon: Users },
        { id: 'leaderboard', label: 'Leaderboard', icon: Crown },
        { id: 'home', label: 'Home', icon: Home }
    ];

    return (
        <div style={{ 
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #fef3c7 0%, #fbbf24 50%, #f59e0b 100%)',
            padding: '20px',
            marginTop: '-60px' // Compensate for hidden main nav
        }}>
            {/* Tab Navigation - Fixed in main nav space */}
            <div style={{ 
                position: 'fixed',
                top: '0',
                left: '0',
                right: '0',
                display: 'flex', 
                gap: '8px', 
                padding: '12px 20px',
                background: 'rgba(255,255,255,0.95)',
                backdropFilter: 'blur(10px)',
                zIndex: 1000,
                borderBottom: '2px solid #f3f4f6',
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
            }}>
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => {
                            if (tab.id === 'home') {
                                window.location.href = '/en/home';
                            } else if (tab.id === 'leaderboard') {
                                window.location.href = '/en/leaderboard';
                            } else if (tab.id === 'club') {
                                window.location.href = '/en/community';
                            } else {
                                setActiveTab(tab.id);
                            }
                        }}
                        style={{
                            flex: 1,
                            padding: '12px',
                            border: 'none',
                            background: activeTab === tab.id ? '#ef4444' : 'transparent',
                            color: activeTab === tab.id ? 'white' : '#6b7280',
                            borderRadius: '12px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            transition: 'all 0.3s ease'
                        }}
                    >
                        <tab.icon size={18} />
                        <span>{tab.label}</span>
                    </button>
                ))}
            </div>

            {/* Tab Content - Full Page */}
            <div
                style={{
                    minHeight: '100vh',
                    paddingTop: '80px', // Space for fixed nav
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
        </div>
    );
};

export default ClubLeaderboard;
