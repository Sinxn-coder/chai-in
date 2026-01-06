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
        (item.to === '/home' &&
            (location.pathname === `/${currentLang}` ||
                location.pathname === `/${currentLang}/`));

    const baseBarHeight = 120;

    return (
        <div
            style={{
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
                height: '150px',
                pointerEvents: 'none',
                zIndex: 1000,
            }}
        >
            {/* Sculpted wave bar */}
            <div style={{ position: 'absolute', inset: 0, pointerEvents: 'auto' }}>
                <svg
                    width="100%"
                    height="150"
                    viewBox="0 0 400 150"
                    preserveAspectRatio="none"
                    style={{ display: 'block' }}
                >
                    <path
                        d="
                          M0 60
                          C60 40 120 40 155 52
                          C175 60 182 82 200 90
                          C218 82 225 60 245 52
                          C280 40 340 40 400 60
                          L400 150
                          L0 150
                          Z
                        "
                        fill="#EF2A39"
                    />
                </svg>
            </div>

            {/* Embedded center action button */}
            <div
                style={{
                    position: 'absolute',
                    top: 14,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    pointerEvents: 'auto',
                }}
            >
                <NavLink to={`/${currentLang}/add-spot`} style={{ textDecoration: 'none' }}>
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.92 }}
                        style={{
                            width: 82,
                            height: 82,
                            borderRadius: '50%',
                            background: '#EF2A39',
                            boxShadow:
                                '0 14px 28px rgba(239,42,57,0.45), inset 0 3px 8px rgba(255,255,255,0.35)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: '3px solid rgba(255,255,255,0.35)',
                        }}
                    >
                        <Plus size={30} color="white" strokeWidth={3} />
                    </motion.div>
                </NavLink>
            </div>

            {/* Navigation items */}
            <div
                style={{
                    position: 'absolute',
                    bottom: 18,
                    left: 0,
                    right: 0,
                    display: 'grid',
                    gridTemplateColumns: 'repeat(5, 1fr)',
                    alignItems: 'center',
                    padding: '0 28px',
                    height: baseBarHeight,
                    pointerEvents: 'auto',
                }}
            >
                {navItems.map((item, idx) => {
                    const active = isActivePath(item);
                    const isLeft = idx < 2;
                    const gridPosition = isLeft ? idx + 1 : idx + 3;

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
                                    opacity: active ? 1 : 0.72,
                                    fontWeight: 800,
                                    fontSize: '0.8rem',
                                    transition: 'all 0.25s ease',
                                }}
                            >
                                <item.icon
                                    size={26}
                                    color="white"
                                    strokeWidth={active ? 2.6 : 2}
                                />
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
