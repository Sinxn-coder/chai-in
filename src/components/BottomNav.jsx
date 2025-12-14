import React, { useState, useEffect, useRef } from 'react';
import { Home, Map, Plus, Users, User } from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';
import './BottomNav.css';

const BottomNav = ({ lang }) => {
    const location = useLocation();
    const [activeIndex, setActiveIndex] = useState(0);
    const navRef = useRef(null);

    // Calculate position based on active index (assumes 4 items + FAB)
    // Indexes: 0=Eat, 1=Map, (2=FAB), 3=Social, 4=Chef
    // We Map routes to these abstract indexes for the liquid blob
    const routeToIndex = {
        '/home': 0,
        '/map': 1,
        '/community': 3,
        '/profile': 4,
        '/add-spot': 2
    };

    useEffect(() => {
        const path = location.pathname.replace(`/${lang}`, '');
        const idx = routeToIndex[path] !== undefined ? routeToIndex[path] : 0;
        setActiveIndex(idx);
    }, [location.pathname, lang]);

    const navItems = [
        { to: '/home', icon: Home, label: 'Eat', id: 'eat' },
        { to: '/map', icon: Map, label: 'Map', id: 'map' },
        { to: '/add-spot', icon: Plus, label: '', id: 'add', isFab: true },
        { to: '/community', icon: Users, label: 'Social', id: 'rank' },
        { to: '/profile', icon: User, label: 'Chef', id: 'chef' },
    ];

    // Liquid Curve Math
    // We have 5 slots. Each is roughly 20% width.
    // The "Hole" needs to move to: (100% / 5) * activeIndex
    // We'll use CSS transform for the blob.

    return (
        <div className="bottom-nav-container" style={{
            position: 'fixed', bottom: 0, left: 0, right: 0,
            height: '80px', background: 'transparent',
            zIndex: 1000, display: 'flex', justifyContent: 'center'
        }}>
            {/* SVG Filter for Gooey Effect (Optional, currently sticking to clean Bezier) */}

            <div style={{
                position: 'relative',
                width: '100%', maxWidth: '500px',
                background: 'white',
                borderRadius: '24px 24px 0 0',
                boxShadow: '0 -4px 20px rgba(0,0,0,0.05)',
                display: 'flex',
                justifyContent: 'space-between',
                padding: '0 10px'
            }}>
                {/* Visual "Hole" / Active Liquid Background */}
                <div style={{
                    position: 'absolute',
                    top: '-50%', // Move up
                    left: `calc(${(activeIndex * 20)}% + 10px)`, // 20% per item roughly, + padding
                    width: 'calc((100% - 20px) / 5)', // Width of one item
                    height: '80px',
                    background: 'var(--primary)',
                    borderRadius: '50%',
                    border: '6px solid var(--bg-color, #f8f9fa)', // Match page bg for "cutout" look
                    transition: 'left 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
                    transform: 'translateY(10px)',
                    zIndex: 10,
                    boxShadow: '0 4px 10px rgba(226, 55, 68, 0.4)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                    {/* Active Icon Rendering inside the blob */}
                    {navItems.map((item, idx) => {
                        const Icon = item.icon;
                        if (idx !== activeIndex) return null;
                        return <Icon key={idx} size={28} color="white" strokeWidth={2.5} style={{ animation: 'fadeIn 0.3s' }} />;
                    })}
                </div>

                {/* Nav Items */}
                {navItems.map((item, index) => {
                    const isActive = index === activeIndex;
                    const Icon = item.icon;
                    return (
                        <NavLink
                            key={item.id}
                            to={`/${lang}${item.to}`}
                            onClick={(e) => setActiveIndex(index)}
                            style={{
                                flex: 1,
                                height: '100%',
                                display: 'flex', flexDirection: 'column',
                                alignItems: 'center', justifyContent: 'center',
                                textDecoration: 'none',
                                zIndex: 20,
                                position: 'relative'
                            }}
                        >
                            <div style={{
                                transition: 'all 0.3s ease',
                                transform: isActive ? 'translateY(100px)' : 'translateY(0)', // Move OUT if active (blob takes over)
                                opacity: isActive ? 0 : 1
                            }}>
                                <Icon size={24} color="#888" strokeWidth={2} />
                            </div>

                            <span style={{
                                position: 'absolute',
                                bottom: '12px',
                                fontSize: '0.7rem',
                                fontWeight: '700',
                                color: isActive ? 'var(--primary)' : '#888',
                                opacity: isActive ? 1 : 0,
                                transition: 'all 0.3s ease 0.1s',
                                transform: isActive ? 'translateY(0)' : 'translateY(10px)'
                            }}>
                                {item.label}
                            </span>
                        </NavLink>
                    );
                })}
            </div>

            <style>{`
                @keyframes fadeIn { from { opacity: 0; transform: scale(0.5); } to { opacity: 1; transform: scale(1); } }
            `}</style>
        </div>
    );
};

export default BottomNav;
