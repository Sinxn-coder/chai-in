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

    const isActivePath = (item) =>
        location.pathname.includes(`/${currentLang}${item.to}`) ||
        (item.to === '/home' && (location.pathname === `/${currentLang}` || location.pathname === `/${currentLang}/`));

    const baseBarHeight = 90;

    return (
        <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, height: '120px', pointerEvents: 'none', zIndex: 1000 }}>
            <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: baseBarHeight,
                background: '#EF2A39',
                borderRadius: '28px 28px 0 0',
                boxShadow: '0 -6px 24px rgba(0,0,0,0.12)',
                pointerEvents: 'auto'
            }} />

            <div style={{
                position: 'absolute',
                top: -18,
                left: '50%',
                transform: 'translateX(-50%)',
                pointerEvents: 'auto'
            }}>
                <NavLink to={`/${currentLang}/add-spot`} style={{ textDecoration: 'none' }}>
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.9 }}
                        style={{
                            width: 78,
                            height: 78,
                            borderRadius: '50%',
                            background: 'white',
                            boxShadow: '0 10px 28px rgba(239, 42, 57, 0.35)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: '6px solid #EF2A39'
                        }}
                    >
                        <div style={{
                            width: 60,
                            height: 60,
                            borderRadius: '50%',
                            background: '#EF2A39',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <Plus size={30} color="white" strokeWidth={3} />
                        </div>
                    </motion.div>
                </NavLink>
            </div>

            <div style={{
                position: 'absolute',
                bottom: 14,
                left: 0,
                right: 0,
                display: 'flex',
                justifyContent: 'space-around',
                alignItems: 'center',
                padding: '0 28px',
                height: baseBarHeight - 12,
                pointerEvents: 'auto'
            }}>
                {navItems.filter(item => !item.isFab).map(item => {
                    const active = isActivePath(item);
                    return (
                        <NavLink
                            key={item.to}
                            to={`/${currentLang}${item.to}`}
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: 6,
                                textDecoration: 'none',
                                color: 'white',
                                opacity: active ? 1 : 0.7,
                                fontWeight: 800,
                                fontSize: '0.8rem',
                                transition: 'all 0.25s ease'
                            }}
                        >
                            <item.icon size={26} color="white" strokeWidth={active ? 2.6 : 2} />
                            <span>{item.label}</span>
                        </NavLink>
                    );
                })}
            </div>
        </div>
    );
};

export default BottomNav;
