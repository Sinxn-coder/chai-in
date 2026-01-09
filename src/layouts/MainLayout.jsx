import React, { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import BottomNav from '../components/BottomNav';
import DesktopNav from '../components/DesktopNav';
import FoodParticles from '../components/FoodParticles';
import SetUsernameModal from '../components/SetUsernameModal';
import SetAvatarModal from '../components/SetAvatarModal';
import AppBar from '../components/AppBar';
import { Users, Crown, MapPin, Plus, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
            {/* Original Top Navigation Bar - Animated */}
            <AnimatePresence mode="wait">
                {!showNewNav && (
                    <motion.div 
                        key="main-nav"
                        className="mobile-only" 
                        initial={{ opacity: 0, y: -100 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -100 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                        <AppBar />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Desktop Navigation - Animated */}
            <AnimatePresence mode="wait">
                {!showNewNav && (
                    <motion.div 
                        key="desktop-nav"
                        initial={{ opacity: 0, x: -100 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -100 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                        <DesktopNav />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Animated Food Particles Background */}
            <FoodParticles />

            {/* Force Username Set */}
            <SetUsernameModal />
            <SetAvatarModal />

            {/* Content Area */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={location.pathname}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                >
                    <Outlet />
                </motion.div>
            </AnimatePresence>

            {/* Bottom Navigation - Animated */}
            <AnimatePresence mode="wait">
                <motion.div 
                    key="bottom-nav"
                    className="mobile-only"
                    initial={{ opacity: 0, y: 100 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 100 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                    <BottomNav lang={lang} />
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

export default MainLayout;
