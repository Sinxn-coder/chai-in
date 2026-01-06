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
                height: 140,
                pointerEvents: 'none',
                zIndex: 1000,
            }}
        >
            {/* PERFECT sculpted wave */}
            <div style={{ position: 'absolute', inset: 0, pointerEvents: 'auto' }}>
                <svg
                    width="100%"
                    height="140"
                    viewBox="0 0 400 140"
                    preserveAspectRatio="none"
                >
                    <path
                        d="
                          M0 58
                          C90 30 140 30 168 42
                          C182 48 188 66 200 72
                          C212 66 218 48 232 42
                          C260 30 310 30 400 58
                          L400 140
                          L0 140
                          Z
                        "
                        fill="#EF2A39"
                    />
                </svg>
            </div>

            {/* LOCKED center button */}
            <div
                style={{
                    position: 'absolute',
                    top: 6,
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
                            width: 76,
                            height: 76,
                            borderRadius: '50%',
                            background: '#EF2A39',
                            boxShadow:
                                '0 18px 32px rgba(0,0,0,0.28), inset 0 3px 6px rgba(255,255,255,0.35)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: '3px solid rgba(255,255,255,0.35)',
                        }}
                    >
                        <Plus size={28} color="white" strokeWidth={3} />
                    </motion.div>
                </NavLink>
            </div>

            {/* Nav icons */}
            <div
                style={{
                    position: 'absolute',
                    bottom: 14,
                    left: 0,
                    right: 0,
                    display: 'grid',
                    gridTemplateColumns: 'repeat(5, 1fr)',
                    padding: '0 30px',
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
                                    gap: 4,
                                    textDecoration: 'none',
                                    color: 'white',
                                    opacity: active ? 1 : 0.75,
                                    fontWeight: 700,
                                    fontSize: '0.75rem',
                                }}
                            >
                                <item.icon
                                    size={24}
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
