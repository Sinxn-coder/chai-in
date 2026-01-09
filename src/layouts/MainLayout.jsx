import React, { useEffect, useState, useMemo } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import BottomNav from '../components/BottomNav';
import DesktopNav from '../components/DesktopNav';
import FoodParticles from '../components/FoodParticles';
import SetUsernameModal from '../components/SetUsernameModal';
import SetAvatarModal from '../components/SetAvatarModal';
import AppBar from '../components/AppBar';
import ClubLeaderboardNav from '../components/ClubLeaderboardNav';
import { Users, Crown, MapPin, Plus, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MainLayout = ({ lang }) => {
    const location = useLocation();
    const [showNewNav, setShowNewNav] = useState(false);

    // Memoize the navigation state to prevent unnecessary re-renders
    const shouldHideMainNav = useMemo(() => {
        return location.pathname.includes('/club-leaderboard');
    }, [location.pathname]);

    // Hide main nav bar only when user navigates to club-leaderboard page
    useEffect(() => {
        setShowNewNav(shouldHideMainNav);
    }, [shouldHideMainNav]);

    useEffect(() => {
        // Scroll to top when route changes - optimized
        window.scrollTo(0, 0);
    }, [location.pathname]);

    // Memoize animation variants to prevent recreation
    const navVariants = useMemo(() => ({
        mainNav: {
            initial: { opacity: 0, y: -100 },
            animate: { opacity: 1, y: 0 },
            exit: { opacity: 0, y: -100 },
            transition: { duration: 0.2, ease: "easeInOut" }
        },
        desktopNav: {
            initial: { opacity: 0, x: -100 },
            animate: { opacity: 1, x: 0 },
            exit: { opacity: 0, x: -100 },
            transition: { duration: 0.2, ease: "easeInOut" }
        },
        bottomNav: {
            initial: { opacity: 0, y: 100 },
            animate: { opacity: 1, y: 0 },
            exit: { opacity: 0, y: 100 },
            transition: { duration: 0.2, ease: "easeInOut" }
        },
        content: {
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            exit: { opacity: 0, y: -20 },
            transition: { duration: 0.15, ease: "easeInOut" }
        }
    }), []);

    return (
        <>
            {/* Original Top Navigation Bar - Fixed outside wrapper with animation */}
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

            {/* Desktop Navigation - Fixed outside wrapper with animation */}
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

            {/* Main Content Wrapper */}
            <div style={{ 
                minHeight: '100vh', 
                background: 'var(--bg-cream)', 
                position: 'relative',
                willChange: 'transform' // Performance optimization
            }}>
                {/* Animated Food Particles Background - Optimized */}
                <FoodParticles />

                {/* Force Username Set */}
                <SetUsernameModal />
                <SetAvatarModal />

                {/* Content Area - Optimized with proper padding for fixed nav */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={location.pathname}
                        {...navVariants.content}
                        style={{ 
                            willChange: 'transform',
                            paddingTop: showNewNav ? '0px' : '70px', // No top padding in ClubLeaderboard
                            paddingBottom: '70px', // Always account for fixed BottomNav
                            minHeight: '100vh'
                        }}
                    >
                        <Outlet />
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Bottom Navigation - Fixed outside wrapper with animation */}
            <AnimatePresence mode="wait">
                {!showNewNav && (
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
                )}
            </AnimatePresence>

            {/* ClubLeaderboard Navigation - Fixed outside wrapper with animation */}
            <AnimatePresence mode="wait">
                {showNewNav && (
                    <>
                        {/* Mobile ClubLeaderboardNav */}
                        <motion.div 
                            key="club-leaderboard-nav-mobile"
                            className="mobile-only"
                            initial={{ opacity: 0, y: 100 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 100 }}
                            transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }} // Cool spring animation
                        >
                            <ClubLeaderboardNav lang={lang} />
                        </motion.div>
                        
                        {/* Desktop ClubLeaderboardNav */}
                        <motion.div 
                            key="club-leaderboard-nav-desktop"
                            className="desktop-nav"
                            initial={{ opacity: 0, x: 100 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 100 }}
                            transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
                            style={{
                                position: 'fixed',
                                top: '50%',
                                right: '20px',
                                transform: 'translateY(-50%)',
                                zIndex: 1000
                            }}
                        >
                            <ClubLeaderboardNav lang={lang} />
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
};

export default MainLayout;
