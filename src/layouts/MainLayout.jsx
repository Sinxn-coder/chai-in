import React, { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import BottomNav from '../components/BottomNav';
import DesktopNav from '../components/DesktopNav';
import FoodParticles from '../components/FoodParticles';
import SetUsernameModal from '../components/SetUsernameModal';
import SetAvatarModal from '../components/SetAvatarModal';
import AppBar from '../components/AppBar';
import { Users, Crown, MapPin, Plus, X } from 'lucide-react';

const MainLayout = ({ lang }) => {
    const location = useLocation();
    const [showNewNav, setShowNewNav] = useState(false);

    // Hide main nav bar only when user navigates to club-leaderboard page
    useEffect(() => {
        const shouldHideMainNav = location.pathname.includes('/club-leaderboard');
        
        setShowNewNav(shouldHideMainNav);
    }, [location.pathname]);

    useEffect(() => {
        // Scroll to top when route changes
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'smooth'
        });
    }, [location.pathname]);

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-cream)', position: 'relative' }}>
            {/* Original Top Navigation Bar - Hidden when new nav is shown */}
            {!showNewNav && (
                <div className="mobile-only" style={{ transition: 'opacity 0.3s ease' }}>
                    <AppBar />
                </div>
            )}

            {/* Desktop Navigation - Right Side */}
            <DesktopNav />

            {/* Animated Food Particles Background */}
            <FoodParticles />

            {/* Force Username Set */}
            <SetUsernameModal />
            <SetAvatarModal />

            {/* Content Area */}
            <Outlet />

            {/* Bottom Navigation - Mobile Only */}
            <div className="mobile-only">
                <BottomNav lang={lang} />
            </div>
        </div>
    );
};

export default MainLayout;
