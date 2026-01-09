import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Crown, Home } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            transition={{ 
                duration: 0.5, 
                ease: [0.25, 0.46, 0.45, 0.94], // Spring easing
                type: "spring",
                stiffness: 300,
                damping: 25
            }}
            whileHover={{ 
                scale: 1.02,
                transition: { duration: 0.2 }
            }}
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
            <AnimatePresence mode="wait">
                {tabs.map(tab => (
                    <motion.button
                        key={tab.id}
                        layoutId={`club-nav-${tab.id}`}
                        onClick={() => {
                            if (tab.id === 'home') {
                                navigate(`/${lang}/home`);
                            } else {
                                // Update the active tab in the ClubLeaderboard component
                                // This will be handled by the parent component
                                window.dispatchEvent(new CustomEvent('clubLeaderboardTabChange', { detail: { tabId: tab.id } }));
                                setActiveTab(tab.id);
                            }
                        }}
                        whileHover={{ 
                            scale: 1.1,
                            transition: { duration: 0.2 }
                        }}
                        whileTap={{ 
                            scale: 0.95,
                            transition: { duration: 0.1 }
                        }}
                        style={{
                            background: activeTab === tab.id ? 'rgba(255,255,255,0.2)' : 'none',
                            border: 'none',
                            color: 'white',
                            cursor: 'pointer',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '4px',
                            padding: '8px',
                            borderRadius: '12px',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            opacity: activeTab === tab.id ? 1 : 0.7,
                            transform: activeTab === tab.id ? 'scale(1.1)' : 'scale(1)',
                            position: 'relative'
                        }}
                    >
                        <motion.div
                            animate={{
                                rotate: activeTab === tab.id ? [0, 10, -10, 0] : 0,
                            }}
                            transition={{
                                duration: 0.5,
                                repeat: activeTab === tab.id ? Infinity : 0,
                                repeatDelay: 2
                            }}
                        >
                            <tab.icon size={20} strokeWidth={2} />
                        </motion.div>
                        <motion.span 
                            animate={{
                                y: activeTab === tab.id ? [0, -2, 0] : 0
                            }}
                            transition={{
                                duration: 0.5,
                                repeat: activeTab === tab.id ? Infinity : 0,
                                repeatDelay: 2
                            }}
                            style={{ 
                                fontSize: '0.7rem', 
                                fontWeight: '600',
                                textShadow: activeTab === tab.id ? '0 2px 4px rgba(0,0,0,0.2)' : 'none'
                            }}
                        >
                            {tab.label}
                        </motion.span>
                        
                        {/* Active indicator */}
                        {activeTab === tab.id && (
                            <motion.div
                                layoutId="active-indicator"
                                style={{
                                    position: 'absolute',
                                    bottom: '-2px',
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    width: '4px',
                                    height: '4px',
                                    background: 'white',
                                    borderRadius: '50%',
                                    boxShadow: '0 2px 8px rgba(255,255,255,0.5)'
                                }}
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                exit={{ scale: 0 }}
                            />
                        )}
                    </motion.button>
                ))}
            </AnimatePresence>
        </motion.div>
    );
};

export default ClubLeaderboardNav;
