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
        { to: '/community', icon: Flame, label: 'Club' },
        { to: '/leaderboard', icon: Crown, label: 'Top' },
    ];

    const isActivePath = (item) =>
        location.pathname.includes(`/${currentLang}${item.to}`) ||
        (item.to === '/home' && (location.pathname === `/${currentLang}` || location.pathname === `/${currentLang}/`));

    const baseBarHeight = 110;

    return (
        <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, height: '140px', pointerEvents: 'none', zIndex: 1000 }}>
            {/* Red bar with concave cutout */}
            <div style={{ position: 'absolute', inset: 0, pointerEvents: 'auto' }}>
                <svg width="100%" height="140" viewBox="0 0 400 140" preserveAspectRatio="none" style={{ display: 'block' }}>
                    <path
                        d="M0 40 C60 40 120 40 170 30 C190 26 200 14 200 0 C200 14 210 26 230 30 C280 40 340 40 400 40 L400 140 L0 140 Z"
                        fill="#EF2A39"
                    />
                </svg>
            </div>

            {/* Floating action button */}
            <div style={{
                position: 'absolute',
                top: -4,
                left: '50%',
                transform: 'translateX(-50%)',
                pointerEvents: 'auto'
            }}>
                <NavLink to={`/${currentLang}/add-spot`} style={{ textDecoration: 'none' }}>
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.9 }}
                        style={{
                            width: 82,
                            height: 82,
                            borderRadius: '50%',
                            background: 'white',
                            boxShadow: '0 14px 30px rgba(0,0,0,0.18)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: '6px solid #EF2A39'
                        }}
                    >
                        <div style={{
                            width: 64,
                            height: 64,
                            borderRadius: '50%',
                            background: '#EF2A39',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 8px 18px rgba(239,42,57,0.35)'
                        }}>
                            <Plus size={30} color="white" strokeWidth={3} />
                        </div>
                    </motion.div>
                </NavLink>
            </div>

            {/* Nav items, spaced with center gap */}
            <div style={{
                position: 'absolute',
                bottom: 18,
                left: 0,
                right: 0,
                display: 'grid',
                gridTemplateColumns: 'repeat(5, 1fr)',
                alignItems: 'center',
                padding: '0 28px',
                height: baseBarHeight,
                pointerEvents: 'auto'
            }}>
                {navItems.map((item, idx) => {
                    const active = isActivePath(item);
                    const isLeft = idx < 2;
                    const gridPosition = isLeft ? idx + 1 : idx + 2; // skip center slot
                    return (
                        <div key={item.to} style={{ gridColumn: gridPosition }}>
                            <NavLink
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
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default BottomNav;
