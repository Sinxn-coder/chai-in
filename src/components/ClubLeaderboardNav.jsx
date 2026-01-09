import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Crown, Home } from 'lucide-react';
import { motion } from 'framer-motion';

const ClubLeaderboardNav = ({ lang }) => {
    const [activeTab, setActiveTab] = useState('club');
    const navigate = useNavigate();

    const tabs = [
        { id: 'club', label: 'Club', icon: Users },
        { id: 'leaderboard', label: 'Leaderboard', icon: Crown },
        { id: 'home', label: 'Home', icon: Home }
    ];

    return (
        <motion.div 
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            style={{ 
                position: 'fixed',
                bottom: '20px',
                left: '0',
                right: '0',
                marginLeft: 'auto',
                marginRight: 'auto',
                height: '60px',
                width: '90%',
                maxWidth: '400px',
                display: 'flex', 
                alignItems: 'center',
                justifyContent: 'space-around',
                padding: '0 20px',
                background: 'rgba(239, 68, 68, 0.9)', // More opaque
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)', // Safari support
                borderRadius: '20px',
                zIndex: 9999, // Highest z-index to stay on top
                boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
                border: '1px solid rgba(255,255,255,0.2)',
                willChange: 'transform', // Performance optimization
                transform: 'translateZ(0)' // Hardware acceleration
            }}>
            {tabs.map(tab => (
                <button
                    key={tab.id}
                    onClick={() => {
                        if (tab.id === 'home') {
                            navigate(`/${lang}/home`);
                        } else {
                            // Update the active tab in the ClubLeaderboard component
                            // This will be handled by the parent component
                            window.dispatchEvent(new CustomEvent('clubLeaderboardTabChange', { detail: { tabId: tab.id } }));
                        }
                    }}
                    style={{
                        background: 'none',
                        border: 'none',
                        color: 'white',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '4px',
                        padding: '8px',
                        borderRadius: '12px',
                        transition: 'all 0.2s',
                        opacity: activeTab === tab.id ? 1 : 0.7,
                        transform: activeTab === tab.id ? 'scale(1.1)' : 'scale(1)'
                    }}
                >
                    <tab.icon size={20} strokeWidth={2} />
                    <span style={{ fontSize: '0.7rem', fontWeight: '600' }}>
                        {tab.label}
                    </span>
                </button>
            ))}
        </motion.div>
    );
};

export default ClubLeaderboardNav;
