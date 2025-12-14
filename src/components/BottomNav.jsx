import React, { useState, useEffect, useRef } from 'react';
import { Home, Map, Plus, Users, User } from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';
import './BottomNav.css';

const BottomNav = ({ lang }) => {
    const location = useLocation();

    // Mapping for active states
    const navItems = [
        { to: '/home', icon: Home, label: 'Home' },
        { to: '/map', icon: Map, label: 'Map' },
        { to: '/add-spot', icon: Plus, label: 'Add', isFab: true },
        { to: '/community', icon: Users, label: 'Social' },
        { to: '/profile', icon: User, label: 'Profile' },
    ];

    return (
        <div className="bottom-nav-container" style={{
            position: 'fixed', bottom: '30px', left: 0, right: 0,
            display: 'flex', justifyContent: 'center', zIndex: 1000,
            pointerEvents: 'none' // Allow clicking through empty sidebar areas
        }}>
            <div style={{
                pointerEvents: 'auto',
                background: 'rgba(25, 25, 25, 0.85)', // Dark glass for "futuristic" feel
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)', // Safari support
                borderRadius: '40px',
                padding: '10px 20px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 10px 40px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.1)',
                width: 'auto',
                minWidth: '320px',
                justifyContent: 'space-between'
            }}>
                {navItems.map((item) => {
                    const isActive = location.pathname.includes(`/${lang}${item.to}`) ||
                        (item.to === '/home' && location.pathname === `/${lang}`); // exact match for home sometimes

                    if (item.isFab) {
                        return (
                            <NavLink
                                key={item.to}
                                to={`/${lang}${item.to}`}
                                style={{
                                    width: '48px', height: '48px',
                                    borderRadius: '50%',
                                    background: 'linear-gradient(135deg, #FF3D3D, #FF0055)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    textDecoration: 'none',
                                    boxShadow: '0 4px 15px rgba(255, 0, 85, 0.4)',
                                    transition: 'transform 0.2s ease'
                                }}
                            >
                                <Plus size={24} color="white" strokeWidth={3} />
                            </NavLink>
                        )
                    }

                    return (
                        <NavLink
                            key={item.to}
                            to={`/${lang}${item.to}`}
                            style={{
                                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                                padding: '10px',
                                borderRadius: '50%',
                                width: '44px', height: '44px',
                                textDecoration: 'none',
                                transition: 'all 0.3s ease',
                                background: isActive ? 'rgba(255,255,255,0.15)' : 'transparent'
                            }}
                        >
                            <item.icon
                                size={22}
                                color={isActive ? '#fff' : 'rgba(255,255,255,0.5)'}
                                strokeWidth={isActive ? 2.5 : 2}
                                fill={isActive ? "white" : "none"} // Filled style for active
                            />
                        </NavLink>
                    );
                })}
            </div>
        </div>
    );
};

export default BottomNav;
