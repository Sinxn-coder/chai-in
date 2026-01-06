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

    return (
        <div
            style={{
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
                height: 130,
                pointerEvents: 'none',
                zIndex: 1000,
            }}
        >
            {/* Flat bar with soft valley */}
            <div style={{ position: 'absolute', inset: 0, pointerEvents: 'auto' }}>
                <svg
                    width="100%"
                    height="130"
                    viewBox="0 0 400 130"
                    preserveAspectRatio="none"
                >
                    <path
                        d="
                          M0 48
                          C110 48 150 48 175 52
                          C190 55 195 62 200 66
                          C205 62 210 55 225 52
                          C250 48 290 48 400 48
                          L400 130
                          L0 130
                          Z
                        "
                        fill="#EF2A39"
                    />
                </svg>
            </div>

            {/* Floating action button (NOT embedded) */}
            <div
                style={{
                    position: 'absolute',
                    top: -4,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    pointerEvents: 'auto',
                }}
            >
                <NavLink to={`/${currentLang}/add-spot`} style={{ textDecoration: 'none' }}>
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        style={{
                            width: 72,
                            height: 72,
                            borderRadius: '50%',
                            background: '#EF2A39',
                            boxShadow: '0 10px 24px rgba(0,0,0,0.35)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <Plus size={30} color="white" strokeWidth={3} />
                    </motion.div>
                </NavLink>
            </div>

            {/* Nav items */}
            <div
                style={{
                    position: 'absolute',
                    bottom: 16,
                    left: 0,
                    right: 0,
                    display: 'grid',
                    gridTemplateColumns: 'repeat(5, 1fr)',
                    padding: '0 28px',
                    pointerEvents: 'auto',
                }}
            >
                {navItems.map((item, idx) => {
                    const active = isActivePath(item);
                    const gridColumn = idx < 2 ? idx + 1 : idx + 3;

                    return (
                        <div key={item.to} style={{ gridColumn }}>
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
                                    fontWeight: 700,
                                    fontSize: '0.75rem',
                                }}
                            >
                                <item.icon size={24} strokeWidth={active ? 2.6 : 2} />
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
