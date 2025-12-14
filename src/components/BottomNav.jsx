import React, { useState, useEffect, useRef } from 'react';
import { Home, Map, Plus, Users, User } from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';
import './BottomNav.css';

const BottomNav = ({ lang }) => {
    const location = useLocation();
    const [indicatorStyle, setIndicatorStyle] = useState({});
    const navRef = useRef(null);
    const itemRefs = useRef({});

    const navItems = [
        { to: '/home', icon: Home, label: 'Eat', color: '#E23744', id: 'eat' },
        { to: '/map', icon: Map, label: 'Map', color: '#2D9CDB', id: 'map' },
        { to: '/community', icon: Users, label: 'Social', color: '#F2C94C', id: 'rank' },
        { to: '/profile', icon: User, label: 'Chef', color: '#9B51E0', id: 'chef' },
    ];

    useEffect(() => {
        updateIndicator();
    }, [location.pathname]);

    const updateIndicator = () => {
        const currentPath = location.pathname;
        const activeItem = navItems.find(item => currentPath.includes(item.to));

        if (activeItem && itemRefs.current[activeItem.id]) {
            const element = itemRefs.current[activeItem.id];
            const rect = element.getBoundingClientRect();
            const navRect = navRef.current?.getBoundingClientRect();

            if (navRect) {
                setIndicatorStyle({
                    width: `${rect.width + 8}px`,
                    left: `${rect.left - navRect.left - 4}px`,
                });
            }
        }
    };

    const NavItem = ({ to, icon: Icon, label, color, id }) => {
        const isActive = location.pathname.includes(to);

        return (
            <div
                className={`nav-item-wrapper ${isActive ? 'active' : ''}`}
                style={{ flex: 1, display: 'flex', justifyContent: 'center' }}
            >
                <NavLink
                    to={`/${lang}${to}`}
                    className={`nav-item nav-item-${id} ${isActive ? 'active' : ''}`}
                    style={{
                        color: isActive ? color : '#757575',
                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', textDecoration: 'none'
                    }}
                >
                    <div style={{
                        padding: '4px 16px',
                        borderRadius: '16px',
                        background: isActive ? `${color}20` : 'transparent', // Light tint pill
                        transition: 'all 0.2s ease'
                    }}>
                        <Icon size={24} strokeWidth={isActive ? 2.5 : 2} fill={isActive ? color : 'none'} />
                    </div>
                    <span style={{ fontSize: '0.75rem', fontWeight: isActive ? '700' : '500' }}>{label}</span>
                </NavLink>
            </div>
        );
    };

    return (
        <div ref={navRef} className="bottom-nav" style={{
            background: 'white',
            borderTop: '1px solid #eee',
            padding: '8px 0',
            paddingBottom: '20px', // Safe area
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'center',
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 1000,
            boxShadow: '0 -2px 10px rgba(0,0,0,0.03)'
        }}>
            <NavItem {...navItems[0]} />
            <NavItem {...navItems[1]} />

            {/* Central FAB */}
            <div className="fab-container" style={{ position: 'relative', top: '-24px' }}>
                <NavLink
                    to={`/${lang}/add-spot`}
                    className={({ isActive }) => `fab ${isActive ? 'active' : ''}`}
                    style={{
                        background: 'var(--primary)',
                        color: 'white',
                        width: '56px', height: '56px',
                        borderRadius: '50%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 4px 12px rgba(226, 55, 68, 0.4)',
                        transform: 'scale(1)',
                        transition: 'transform 0.2s ease'
                    }}
                >
                    <Plus size={32} strokeWidth={3} />
                </NavLink>
            </div>

            <NavItem {...navItems[2]} />
            <NavItem {...navItems[3]} />
        </div>
    );
};

export default BottomNav;
