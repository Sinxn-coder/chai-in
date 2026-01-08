import React, { useState } from 'react';
import { Trophy, Users, Crown } from 'lucide-react';
import { motion } from 'framer-motion';

const ClubLeaderboard = ({ lang }) => {
    const [activeTab, setActiveTab] = useState('club');

    const tabs = [
        { id: 'club', label: 'Club', icon: Users },
        { id: 'leaderboard', label: 'Leaderboard', icon: Crown }
    ];

    return (
        <div style={{ 
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #fef3c7 0%, #fbbf24 50%, #f59e0b 100%)',
            padding: '20px'
        }}>
            <div style={{ 
                padding: '20px',
                background: '#ffffff',
                borderRadius: '20px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                margin: '20px',
                minHeight: '80vh'
            }}>
                {/* Tab Navigation */}
                <div style={{ 
                    display: 'flex', 
                    gap: '8px', 
                    marginBottom: '20px',
                    borderBottom: '2px solid #f3f4f6'
                }}>
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
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

                {/* Tab Content */}
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    style={{
                        minHeight: '400px'
                    }}
                >
                    {activeTab === 'club' && (
                        <div style={{ textAlign: 'center', padding: '40px' }}>
                            <motion.div
                                animate={{ scale: [1, 1.05, 1] }}
                                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                            >
                                <Users size={48} color="#ef4444" />
                            </motion.div>
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
                            <motion.div
                                animate={{ scale: [1, 1.05, 1] }}
                                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                            >
                                <Trophy size={48} color="#ef4444" />
                            </motion.div>
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
                </motion.div>
            </div>
        </div>
    );
};

export default ClubLeaderboard;
