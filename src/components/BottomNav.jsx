import React from 'react';
import { UtensilsCrossed, Map, Plus, Trophy, ChefHat } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const BottomNav = ({ lang }) => {
    const navStyle = {
        position: 'fixed',
        bottom: 20,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '90%',
        maxWidth: '400px',
        background: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(10px)',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        padding: '12px 20px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
        borderRadius: '30px',
        zIndex: 1000,
        border: '1px solid rgba(255,255,255,0.5)'
    };

    const linkStyle = ({ isActive }) => ({
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        color: isActive ? 'var(--primary)' : '#999',
        textDecoration: 'none',
        fontSize: '0.7rem',
        gap: '4px',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        transform: isActive ? 'scale(1.1)' : 'none'
    });

    // Central floating button style
    const fabStyle = {
        background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)',
        color: 'white',
        width: '48px',
        height: '48px',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 4px 12px rgba(255, 107, 53, 0.4)',
        transform: 'translateY(-20%)',
        border: 'none'
    };

    return (
        <div style={navStyle}>
            <NavLink to={`/${lang}/home`} style={linkStyle}>
                <UtensilsCrossed size={22} />
                <span style={{ fontWeight: 600 }}>Eat</span>
            </NavLink>

            <NavLink to={`/${lang}/map`} style={linkStyle}>
                <Map size={22} />
                <span style={{ fontWeight: 600 }}>Map</span>
            </NavLink>

            <NavLink to={`/${lang}/add-spot`} style={({ isActive }) => isActive ? { ...fabStyle, transform: 'translateY(-20%) scale(0.95)' } : fabStyle}>
                <Plus size={28} />
            </NavLink>

            <NavLink to={`/${lang}/leaderboard`} style={linkStyle}>
                <Trophy size={22} />
                <span style={{ fontWeight: 600 }}>Rank</span>
            </NavLink>

            <NavLink to={`/${lang}/profile`} style={linkStyle}>
                <ChefHat size={22} />
                <span style={{ fontWeight: 600 }}>Chef</span>
            </NavLink>
        </div>
    );
};

export default BottomNav;
