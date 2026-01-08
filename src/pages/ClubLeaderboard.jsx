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
            {/* Tab Navigation - Fixed in main nav space with only icons */}
            <div style={{ 
                position: 'fixed',
                top: '0',
                left: '0',
                right: '0',
                height: '60px', // Same height as main nav
                display: 'flex', 
                alignItems: 'center',
                justifyContent: 'space-around',
                padding: '0 20px',
                background: 'var(--primary)', // Same as main nav
                zIndex: 1000,
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
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
