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

    // Hide main nav bar when user navigates to main app sections (but not home page)
    useEffect(() => {
        const shouldHideMainNav = location.pathname.includes('/explore') || 
                                  location.pathname.includes('/club-leaderboard') ||
                                  location.pathname.includes('/community') ||
                                  location.pathname.includes('/map') ||
                                  location.pathname.includes('/add-spot') ||
                                  location.pathname.includes('/profile');
        
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
            {/* New Navigation Bar - Shows when main nav is hidden */}
            {showNewNav && (
                <motion.div
                    initial={{ opacity: 0, y: -80 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    style={{
                        position: 'fixed',
                        top: '0',
                        left: '0',
                        right: '0',
                        background: 'var(--primary)',
                        padding: '12px 20px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        zIndex: 1000,
                        boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Users size={20} color="white" />
                            <span style={{ color: 'white', fontWeight: '600', fontSize: '1rem' }}>Club</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Crown size={20} color="white" />
                            <span style={{ color: 'white', fontWeight: '600', fontSize: '1rem' }}>Leaderboard</span>
                        </div>
                    </div>
                    <button
                        onClick={() => setShowNewNav(false)}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: 'white',
                            cursor: 'pointer',
                            padding: '4px'
                        }}
                    >
                        <X size={20} />
                    </button>
                </motion.div>
            )}

            {/* Original Top Navigation Bar - Hidden when new nav is shown */}
            <div className="mobile-only" style={{ transition: 'opacity 0.3s ease' }}>
                <AppBar />
            </div>

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
