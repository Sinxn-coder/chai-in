import React, { useState } from 'react';
import { Trophy, Users, Crown, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Community from './Community';
import Leaderboard from './Leaderboard';

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
                    <div style={{ 
                        minHeight: 'calc(100vh - 60px)',
                        paddingBottom: '80px' // Account for bottom nav
                    }}>
                        <Community />
                    </div>
                )}

                {activeTab === 'leaderboard' && (
                    <div style={{ 
                        minHeight: 'calc(100vh - 60px)',
                        paddingBottom: '80px' // Account for bottom nav
                    }}>
                        <Leaderboard />
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
                            } else {
                                // Stay on same page, just change active tab
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
