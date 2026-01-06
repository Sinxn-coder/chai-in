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
            {/* Curved sides + flat center top edge */}
            <div style={{ position: 'absolute', inset: 0, pointerEvents: 'auto' }}>
                <svg
                    width="100%"
                    height="140"
                    viewBox="0 0 400 140"
                    preserveAspectRatio="none"
                    style={{ display: 'block' }}
                >
                    {/* 
                      Path notes:
                        - left & right are smooth curves (rounded edges)
                        - center is flat (straight line) across the middle top
                        - there is no notch: the center is flat so the button stays separate (floating)
                    */}
                    <path
                        d="
                          M0 68
                          C60 40 120 40 150 50
                          L250 50
                          C280 40 340 40 400 68
                          L400 140
                          L0 140
                          Z
                        "
                        fill="#EF2A39"
                    />
                </svg>
            </div>

            {/* Floating center button - intentionally separated (space) from the bar */}
            <div
                style={{
                    position: 'absolute',
                    /* negative top floats button above the bar, leaving a visible gap */
                    top: -18,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    pointerEvents: 'auto',
                }}
            >
                <NavLink to={`/${currentLang}/add-spot`} style={{ textDecoration: 'none' }}>
                    <motion.div
                        whileHover={{ scale: 1.06 }}
                        whileTap={{ scale: 0.96 }}
                        style={{
                            width: 78,
                            height: 78,
                            borderRadius: '50%',
                            background: '#EF2A39',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 18px 36px rgba(0,0,0,0.28)',
                            border: '4px solid rgba(255,255,255,0.06)',
                        }}
                    >
                        <Plus size={30} color="white" strokeWidth={3} />
                    </motion.div>
                </NavLink>
            </div>

            {/* Nav icons (center column left empty) */}
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
                                    opacity: active ? 1 : 0.75,
                                    fontWeight: 700,
                                    fontSize: '0.78rem',
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
