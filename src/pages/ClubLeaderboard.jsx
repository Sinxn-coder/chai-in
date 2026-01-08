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
            padding: '20px'
        }}>
            {/* Tab Navigation */}
            <div style={{ 
                display: 'flex', 
                gap: '8px', 
                marginBottom: '20px',
                borderBottom: '2px solid #f3f4f6',
                background: 'rgba(255,255,255,0.9)',
                padding: '20px',
                borderRadius: '20px 20px 0 0',
                backdropFilter: 'blur(10px)'
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
                    minHeight: 'calc(100vh - 120px)',
                    background: 'rgba(255,255,255,0.95)',
                    borderRadius: '0 0 20px 20px',
                    padding: '40px',
                    backdropFilter: 'blur(10px)'
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
