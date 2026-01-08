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
                    <div style={{ 
                        padding: '40px 20px',
                        maxWidth: '800px',
                        margin: '0 auto'
                    }}>
                        <div style={{ 
                            textAlign: 'center', 
                            marginBottom: '40px' 
                        }}>
                            <div style={{
                                width: '80px',
                                height: '80px',
                                background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto 20px',
                                boxShadow: '0 8px 32px rgba(239, 68, 68, 0.3)'
                            }}>
                                <Users size={40} color="white" />
                            </div>
                            <h2 style={{ 
                                fontSize: '2rem', 
                                fontWeight: '800', 
                                color: '#1f2937',
                                marginBottom: '16px'
                            }}>
                                Join Our Community
                            </h2>
                            <p style={{ 
                                color: '#6b7280', 
                                fontSize: '1.1rem', 
                                lineHeight: '1.6',
                                maxWidth: '600px',
                                margin: '0 auto'
                            }}>
                                Connect with fellow food lovers, share your experiences, 
                                and discover new dining spots together in our vibrant community.
                            </p>
                        </div>

                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                            gap: '20px',
                            marginTop: '40px'
                        }}>
                            <div style={{
                                background: 'rgba(255,255,255,0.9)',
                                padding: '24px',
                                borderRadius: '16px',
                                backdropFilter: 'blur(10px)',
                                border: '1px solid rgba(255,255,255,0.2)',
                                boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                            }}>
                                <h3 style={{ 
                                    color: '#ef4444', 
                                    fontSize: '1.2rem',
                                    fontWeight: '700',
                                    marginBottom: '12px'
                                }}>
                                    Share Reviews
                                </h3>
                                <p style={{ 
                                    color: '#6b7280', 
                                    fontSize: '0.95rem',
                                    lineHeight: '1.5'
                                }}>
                                    Write detailed reviews and help others discover amazing places.
                                </p>
                            </div>

                            <div style={{
                                background: 'rgba(255,255,255,0.9)',
                                padding: '24px',
                                borderRadius: '16px',
                                backdropFilter: 'blur(10px)',
                                border: '1px solid rgba(255,255,255,0.2)',
                                boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                            }}>
                                <h3 style={{ 
                                    color: '#ef4444', 
                                    fontSize: '1.2rem',
                                    fontWeight: '700',
                                    marginBottom: '12px'
                                }}>
                                    Earn Points
                                </h3>
                                <p style={{ 
                                    color: '#6b7280', 
                                    fontSize: '0.95rem',
                                    lineHeight: '1.5'
                                }}>
                                    Get rewarded for your contributions and climb the leaderboard.
                                </p>
                            </div>

                            <div style={{
                                background: 'rgba(255,255,255,0.9)',
                                padding: '24px',
                                borderRadius: '16px',
                                backdropFilter: 'blur(10px)',
                                border: '1px solid rgba(255,255,255,0.2)',
                                boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                            }}>
                                <h3 style={{ 
                                    color: '#ef4444', 
                                    fontSize: '1.2rem',
                                    fontWeight: '700',
                                    marginBottom: '12px'
                                }}>
                                    Connect
                                </h3>
                                <p style={{ 
                                    color: '#6b7280', 
                                    fontSize: '0.95rem',
                                    lineHeight: '1.5'
                                }}>
                                    Follow other food enthusiasts and build your network.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'leaderboard' && (
                    <div style={{ 
                        padding: '40px 20px',
                        maxWidth: '800px',
                        margin: '0 auto'
                    }}>
                        <div style={{ 
                            textAlign: 'center', 
                            marginBottom: '40px' 
                        }}>
                            <div style={{
                                width: '80px',
                                height: '80px',
                                background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto 20px',
                                boxShadow: '0 8px 32px rgba(245, 158, 11, 0.3)'
                            }}>
                                <Trophy size={40} color="white" />
                            </div>
                            <h2 style={{ 
                                fontSize: '2rem', 
                                fontWeight: '800', 
                                color: '#1f2937',
                                marginBottom: '16px'
                            }}>
                                Top Contributors
                            </h2>
                            <p style={{ 
                                color: '#6b7280', 
                                fontSize: '1.1rem', 
                                lineHeight: '1.6',
                                maxWidth: '600px',
                                margin: '0 auto'
                            }}>
                                Celebrate our most active community members and their 
                                amazing contributions to the food community.
                            </p>
                        </div>

                        <div style={{
                            background: 'rgba(255,255,255,0.9)',
                            borderRadius: '20px',
                            padding: '30px',
                            backdropFilter: 'blur(10px)',
                            border: '1px solid rgba(255,255,255,0.2)',
                            boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
                        }}>
                            {/* Leaderboard entries */}
                            {[1, 2, 3].map((rank) => (
                                <div key={rank} style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    padding: '16px',
                                    marginBottom: rank < 3 ? '16px' : '0',
                                    background: rank === 1 ? 'linear-gradient(135deg, #fef3c7, #fbbf24)' : 
                                               rank === 2 ? 'linear-gradient(135deg, #e5e7eb, #d1d5db)' :
                                               'linear-gradient(135deg, #f3f4f6, #e5e7eb)',
                                    borderRadius: '12px',
                                    border: rank === 1 ? '2px solid #f59e0b' : '1px solid rgba(0,0,0,0.1)'
                                }}>
                                    <div style={{
                                        width: '40px',
                                        height: '40px',
                                        borderRadius: '50%',
                                        background: rank === 1 ? '#f59e0b' : 
                                                   rank === 2 ? '#6b7280' : '#9ca3af',
                                        color: 'white',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontWeight: '700',
                                        fontSize: '1.1rem',
                                        marginRight: '16px'
                                    }}>
                                        {rank}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <h4 style={{ 
                                            fontWeight: '700', 
                                            color: '#1f2937',
                                            marginBottom: '4px'
                                        }}>
                                            {rank === 1 ? 'Food Explorer' : 
                                             rank === 2 ? 'Taste Hunter' : 'Flavor Seeker'}
                                        </h4>
                                        <p style={{ 
                                            color: '#6b7280', 
                                            fontSize: '0.9rem',
                                            margin: 0
                                        }}>
                                            {rank === 1 ? '1,250 points • 85 reviews' : 
                                             rank === 2 ? '980 points • 72 reviews' : 
                                             '750 points • 58 reviews'}
                                        </p>
                                    </div>
                                    <div style={{
                                        background: rank === 1 ? '#f59e0b' : 
                                                   rank === 2 ? '#6b7280' : '#9ca3af',
                                        color: 'white',
                                        padding: '6px 12px',
                                        borderRadius: '20px',
                                        fontSize: '0.8rem',
                                        fontWeight: '600'
                                    }}>
                                        {rank === 1 ? '🏆 Top' : 
                                         rank === 2 ? '🥈 Rising' : '🥉 Growing'}
                                    </div>
                                </div>
                            ))}
                        </div>
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
