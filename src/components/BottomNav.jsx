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
                ref={el => itemRefs.current[id] = el}
                className={`nav-item-wrapper ${isActive ? 'active' : ''}`}
            >
                <NavLink
                    to={`/${lang}${to}`}
                    className={`nav-item nav-item-${id} ${isActive ? 'active' : ''}`}
                    style={{ color: isActive ? color : '#aaa' }}
                >
                    <Icon size={24} strokeWidth={isActive ? 2.5 : 2} fill={isActive ? color : 'none'} />
                    <span>{label}</span>
                </NavLink>
            </div>
        );
    };

    return (
        <div ref={navRef} className="bottom-nav">
            {/* Liquid background indicator */}
            <div className="liquid-indicator" style={indicatorStyle}></div>

            <NavItem {...navItems[0]} />
            <NavItem {...navItems[1]} />

            {/* Central FAB */}
            <div className="fab-container">
                <NavLink
                    to={`/${lang}/add-spot`}
                    className={({ isActive }) => `fab ${isActive ? 'active' : ''}`}
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
