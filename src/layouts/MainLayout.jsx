import React, { useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import BottomNav from '../components/BottomNav';
import FoodParticles from '../components/FoodParticles';
import SetUsernameModal from '../components/SetUsernameModal';
import SetAvatarModal from '../components/SetAvatarModal';
import AppBar from '../components/AppBar';

const MainLayout = ({ lang }) => {
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        // Scroll to top when route changes
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'smooth'
        });

        // Handle returning from maps - redirect to last spot page or home
        if (location.pathname === '/' || location.pathname === `/${lang}`) {
            const lastSpotPage = sessionStorage.getItem('lastSpotPage');
            if (lastSpotPage) {
                sessionStorage.removeItem('lastSpotPage');
                navigate(lastSpotPage, { replace: true });
            } else {
                navigate(`/${lang}/home`, { replace: true });
            }
        }
    }, [location.pathname, navigate, lang]);

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
