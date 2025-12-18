import React, { useState, useEffect, useRef } from 'react';
import { Home, Map, Plus, Users, User, Trophy } from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';
import './BottomNav.css';

const BottomNav = ({ lang }) => {
    const location = useLocation();

    // Mapping for active states
    const navItems = [
        { to: '/home', icon: Home, label: 'Home' },
        { to: '/map', icon: Map, label: 'Map' },
        { to: '/add-spot', icon: Plus, label: 'Add', isFab: true },
        { to: '/leaderboard', icon: Trophy, label: 'Leaders' },
        { to: '/profile', icon: User, label: 'Profile' },
    ];

    return (
        <div className="bottom-nav-container" style={{
            position: 'fixed', bottom: '30px', left: 0, right: 0,
            display: 'flex', justifyContent: 'center', zIndex: 1000,
            pointerEvents: 'none'
        }}>
            <div style={{
                pointerEvents: 'auto',
                // Crystal / Water Drop Effect
                background: 'rgba(255, 255, 255, 0.3)', // Ultra-clear base
                backdropFilter: 'blur(25px) saturate(180%)', // Heavy frost
                WebkitBackdropFilter: 'blur(25px) saturate(180%)',
                borderRadius: '50px',
                padding: '8px 24px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                // Complex shadow for depth + "Glass Bevel" border
                boxShadow: `
                    0 20px 40px rgba(0,0,0,0.1), 
                    0 0 0 1px rgba(255,255,255,0.4), 
                    inset 0 1px 0 rgba(255,255,255,0.6)
                `,
                width: 'auto',
                minWidth: '320px',
                justifyContent: 'space-between'
            }}>
                {navItems.map((item) => {
                    const currentLang = lang || 'en';
                    const isActive = location.pathname.includes(`/${currentLang}${item.to}`) ||
                        (item.to === '/home' && location.pathname === `/${currentLang}`);

                    if (item.isFab) {
                        return (
                            <NavLink
                                key={item.to}
                                to={`/${currentLang}${item.to}`}
                                style={{
                                    width: '52px', height: '52px',
                                    borderRadius: '50%',
                                    // Liquid Gradient FAB
                                    background: 'linear-gradient(135deg, #E23744, #FF6B6B)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    textDecoration: 'none',
                                    boxShadow: '0 8px 20px rgba(226, 55, 68, 0.4)',
                                    transform: isActive ? 'scale(1.1)' : 'scale(1)',
                                    transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)'
                                }}
                            >
                                <Plus size={26} color="white" strokeWidth={3} />
                            </NavLink>
                        )
                    }

                    return (
                        <NavLink
                            to={`/${currentLang}${item.to}`}
                            style={{
                                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                                padding: '10px',
                                borderRadius: '50%',
                                width: '48px', height: '48px',
                                textDecoration: 'none',
                                transition: 'all 0.3s ease',
                                position: 'relative'
                            }}
                        >
                            <item.icon
                                size={24}
                                // Darker icons for contrast on light glass
                                color={isActive ? '#E23744' : 'rgba(0,0,0,0.5)'}
                                strokeWidth={isActive ? 2.5 : 2}
                                fill={isActive ? "currentColor" : "none"}
                            />
                            {isActive && (
                                <div style={{
                                    position: 'absolute', bottom: '4px',
                                    width: '4px', height: '4px', borderRadius: '50%',
                                    background: '#E23744'
                                }} />
                            )}
                        </NavLink>
                    );
                })}
            </div>
        </div>
    );
};

export default BottomNav;
