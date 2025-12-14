import React from 'react';
import { Outlet } from 'react-router-dom';
import BottomNav from '../components/BottomNav';
import FoodParticles from '../components/FoodParticles';

const MainLayout = ({ lang }) => {
    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-cream)', position: 'relative' }}>
            {/* Animated Food Particles Background */}
            <FoodParticles />

            {/* Content Area */}
            <Outlet />

            {/* Bottom Navigation */}
            <BottomNav lang={lang} />
        </div>
    );
};

export default MainLayout;
