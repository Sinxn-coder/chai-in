import React, { useState } from 'react';
import { Trophy, Users, Crown, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Community from './Community';
import Leaderboard from './Leaderboard';

// Styled Community component that matches ClubLeaderboard design
const StyledCommunity = () => {
    return (
        <div style={{
            minHeight: 'calc(100vh - 60px)',
            background: 'linear-gradient(135deg, #fef3c7 0%, #fbbf24 50%, #f59e0b 100%)',
            paddingBottom: '80px'
        }}>
            {/* Community Header */}
            <div style={{
                textAlign: 'center',
                marginBottom: '30px',
                padding: '20px',
                background: 'rgba(255,255,255,0.9)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.2)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
            }}>
                <div style={{
                    width: '60px',
                    height: '60px',
                    background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 16px',
                    boxShadow: '0 4px 20px rgba(239, 68, 68, 0.3)'
                }}>
                    <Users size={30} color="white" />
                </div>
                <h2 style={{
                    fontSize: '1.8rem',
                    fontWeight: '800',
                    color: '#1f2937',
                    marginBottom: '8px'
                }}>
                    Community
                </h2>
                <p style={{
                    color: '#6b7280',
                    fontSize: '1rem',
                    margin: 0
                }}>
                    Share your food experiences with community
                </p>
            </div>

            {/* Community Content - Override styles */}
            <div style={{
                background: 'transparent',
                minHeight: 'calc(100vh - 200px)'
            }}>
                <style>
                    {`
                        div[style*="var(--secondary)"] {
                            background: transparent !important;
                        }
                        div[style*="borderBottomLeftRadius"] {
                            display: none !important;
                        }
                    `}
                </style>
                <Community />
            </div>
        </div>
    );
};

// Styled Leaderboard component that matches ClubLeaderboard design  
const StyledLeaderboard = () => {
    return (
        <div style={{
            minHeight: 'calc(100vh - 60px)',
            background: 'linear-gradient(135deg, #fef3c7 0%, #fbbf24 50%, #f59e0b 100%)',
            paddingBottom: '80px'
        }}>
            {/* Leaderboard Header */}
            <div style={{
                textAlign: 'center',
                marginBottom: '30px',
                padding: '20px',
                background: 'rgba(255,255,255,0.9)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.2)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
            }}>
                <div style={{
                    width: '60px',
                    height: '60px',
                    background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 16px',
                    boxShadow: '0 4px 20px rgba(245, 158, 11, 0.3)'
                }}>
                    <Trophy size={30} color="white" />
                </div>
                <h2 style={{
                    fontSize: '1.8rem',
                    fontWeight: '800',
                    color: '#1f2937',
                    marginBottom: '8px'
                }}>
                    Leaderboard
                </h2>
                <p style={{
                    color: '#6b7280',
                    fontSize: '1rem',
                    margin: 0
                }}>
                    Top contributors in our food community
                </p>
            </div>

            {/* Leaderboard Content - Override styles */}
            <div style={{
                background: 'transparent',
                minHeight: 'calc(100vh - 200px)'
            }}>
                <style>
                    {`
                        div[style*="var(--secondary)"] {
                            background: transparent !important;
                        }
                        div[style*="var(--primary)"] {
                            display: none !important;
                        }
                        button[onclick*="navigate(-1)"] {
                            display: none !important;
                        }
                    `}
                </style>
                <Leaderboard />
            </div>
        </div>
    );
};

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
                {activeTab === 'club' && <StyledCommunity />}

                {activeTab === 'leaderboard' && <StyledLeaderboard />}
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
