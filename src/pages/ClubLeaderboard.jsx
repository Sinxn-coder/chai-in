import React, { useState } from 'react';
import { Trophy, Users, Crown, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

const ClubLeaderboard = ({ lang }) => {
    const [activeTab, setActiveTab] = useState('club');

    const tabs = [
        { id: 'club', label: 'Club', icon: Users },
        { id: 'leaderboard', label: 'Leaderboard', icon: Crown }
    ];

    return (
        <div style={{ 
            padding: '20px',
            background: 'var(--bg-white)',
            borderRadius: '20px',
            boxShadow: 'var(--shadow-md)',
            margin: '20px'
        }}>
            {/* Tab Navigation */}
            <div style={{ 
                display: 'flex', 
                gap: '8px', 
                marginBottom: '20px',
                borderBottom: '2px solid var(--secondary)'
            }}>
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        style={{
                            flex: 1,
                            padding: '12px',
                            border: 'none',
                            background: activeTab === tab.id ? 'var(--primary)' : 'transparent',
                            color: activeTab === tab.id ? 'white' : 'var(--text-muted)',
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
                            <Users size={48} color="var(--primary)" />
                        </motion.div>
                        <h3 style={{ 
                            marginTop: '20px', 
                            fontSize: '1.5rem', 
                            fontWeight: '800', 
                            color: 'var(--text-main)' 
                        }}>
                            Join the Community
                        </h3>
                        <p style={{ 
                            color: 'var(--text-muted)', 
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
                            <Trophy size={48} color="var(--primary)" />
                        </motion.div>
                        <h3 style={{ 
                            marginTop: '20px', 
                            fontSize: '1.5rem', 
                            fontWeight: '800', 
                            color: 'var(--text-main)' 
                        }}>
                            Top Contributors
                        </h3>
                        <p style={{ 
                            color: 'var(--text-muted)', 
                            fontSize: '1rem', 
                            lineHeight: '1.5' 
                        }}>
                            Celebrate our most active community members and their contributions.
                        </p>
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default ClubLeaderboard;
