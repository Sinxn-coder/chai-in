import React from 'react';
import { Outlet } from 'react-router-dom';
import BottomNav from '../components/BottomNav';
import FoodParticles from '../components/FoodParticles';
import SetUsernameModal from '../components/SetUsernameModal';
import SetAvatarModal from '../components/SetAvatarModal';
import AppBar from '../components/AppBar';

const MainLayout = ({ lang }) => {
    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-cream)', position: 'relative' }}>
            {/* Top Navigation Bar */}
            <AppBar />

            {/* Animated Food Particles Background */}
            <FoodParticles />

            {/* Force Username Set */}
            <SetUsernameModal />
            <SetAvatarModal />

            {/* Content Area */}
            <Outlet />

            {/* Bottom Navigation */}
            <BottomNav lang={lang} />
        </div>
    );
};

export default MainLayout;
