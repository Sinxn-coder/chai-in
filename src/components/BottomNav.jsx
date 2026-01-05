import React from 'react';
import { Home, Map, Plus, Flame, Crown } from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

const BottomNav = ({ lang }) => {
    const location = useLocation();
    const currentLang = lang || 'en';

    const navItems = [
        { to: '/home', icon: Home, label: 'Home' },
        { to: '/map', icon: Map, label: 'Map' },
        { to: '/add-spot', icon: Plus, label: 'Add', isFab: true },
        { to: '/community', icon: Flame, label: 'Club' },
        { to: '/leaderboard', icon: Crown, label: 'Top' },
    ];

    return (
        <div style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            height: '90px',
            background: 'transparent',
            zIndex: 1000,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-end',
            pointerEvents: 'none'
        }}>
            {/* The Curved Background SVG */}
            <div style={{
                position: 'absolute',
                bottom: 0,
                width: '100%',
                height: '75px',
                pointerEvents: 'auto'
            }}>
                <svg width="100%" height="75" viewBox="0 0 400 75" preserveAspectRatio="none" style={{ display: 'block' }}>
                    <path
                        d="M0 25C0 11.1929 11.1929 0 25 0H150C165 0 170 15 180 20C190 25 210 25 220 20C230 15 235 0 250 0H375C388.807 0 400 11.1929 400 25V75H0V25Z"
                        fill="#EF2A39"
                    />
                </svg>
            </div>

            <div style={{
                position: 'relative',
                width: '100%',
                maxWidth: '500px',
                height: '75px',
                display: 'flex',
                justifyContent: 'space-around',
                alignItems: 'center',
                padding: '0 10px',
                pointerEvents: 'auto'
            }}>
                {navItems.map((item, index) => {
                    const isActive = location.pathname.includes(`/${currentLang}${item.to}`) ||
                        (item.to === '/home' && (location.pathname === `/${currentLang}` || location.pathname === `/${currentLang}/`));

                    if (item.isFab) {
                        return (
                            <div key={item.to} style={{ position: 'relative', top: '-35px', zIndex: 1001 }}>
                                <NavLink
                                    to={`/${currentLang}${item.to}`}
                                    style={{ textDecoration: 'none' }}
                                >
                                    <motion.div
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        style={{
                                            width: '64px',
                                            height: '64px',
                                            borderRadius: '50%',
                                            background: '#EF2A39',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            boxShadow: '0 8px 25px rgba(239, 42, 57, 0.4)'
                                        }}
                                    >
                                        <Plus size={32} color="white" strokeWidth={3} />
                                    </motion.div>
                                </NavLink>
                            </div>
                        );
                    }

                    return (
                        <NavLink
                            key={item.to}
                            to={`/${currentLang}${item.to}`}
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                textDecoration: 'none',
                                opacity: isActive ? 1 : 0.6,
                                transition: 'all 0.3s ease'
                            }}
                        >
                            <item.icon
                                size={26}
                                color="white"
                                strokeWidth={isActive ? 2.5 : 2}
                            />
                            {isActive && (
                                <motion.div
                                    layoutId="navDot"
                                    style={{
                                        width: '4px',
                                        height: '4px',
                                        background: 'white',
                                        borderRadius: '50%',
                                        marginTop: '4px'
                                    }}
                                />
                            )}
                        </NavLink>
                    );
                })}
            </div>
        </div>
    );
};

export default BottomNav;
