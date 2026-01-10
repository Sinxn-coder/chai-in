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

    // Check if current page should hide all navigation (like AddSpot)
    const hideAllNavigation = useMemo(() => {
        return location.pathname.includes('/add-spot');
    }, [location.pathname]);

    // Memoize the navigation state to prevent unnecessary re-renders
    const shouldHideMainNav = useMemo(() => {
        return location.pathname.includes('/club-leaderboard');
    }, [location.pathname]);

    // Check if current page needs special padding (like AddSpot)
    const needsSpecialPadding = useMemo(() => {
        return location.pathname.includes('/add-spot');
    }, [location.pathname]);

    // Check if current page should skip animations (like AddSpot)
    const skipAnimations = useMemo(() => {
        return location.pathname.includes('/add-spot');
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
            initial: { opacity: 0, y: -20 },
            animate: { opacity: 1, y: 0 },
            exit: { opacity: 0, y: -20 },
            transition: { duration: 0.25, ease: [0.4, 0, 0.2, 1] }
        },
        desktopNav: {
            initial: { opacity: 0, x: -20 },
            animate: { opacity: 1, x: 0 },
            exit: { opacity: 0, x: -20 },
            transition: { duration: 0.25, ease: [0.4, 0, 0.2, 1] }
        },
        bottomNav: {
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            exit: { opacity: 0, y: 20 },
            transition: { duration: 0.25, ease: [0.4, 0, 0.2, 1] }
        },
        content: {
            initial: { opacity: 0, y: 10 },
            animate: { opacity: 1, y: 0 },
            exit: { opacity: 0, y: -10 },
            transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] }
        }
    }), []);

    return (
        <>
            {/* Original Top Navigation Bar - Fixed outside wrapper with animation */}
            <AnimatePresence>
                {!showNewNav && !hideAllNavigation && (
                    <motion.div 
                        key="main-nav"
                        className="mobile-only"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                    >
                        <AppBar />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Desktop Navigation - Fixed outside wrapper with animation */}
            <AnimatePresence>
                {!showNewNav && !hideAllNavigation && (
                    <motion.div 
                        key="desktop-nav"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
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
                <AnimatePresence>
                    <motion.div
                        key={location.pathname}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ 
                            duration: 0.3, 
                            ease: [0.4, 0, 0.2, 1]
                        }}
                        style={{ 
                            willChange: 'transform',
                            paddingTop: showNewNav ? '0px' : (needsSpecialPadding ? '0px' : '70px'), // No top padding for ClubLeaderboard and AddSpot
                            paddingBottom: '70px', // Always account for fixed BottomNav
                            minHeight: '100vh'
                        }}
                    >
                        <Outlet />
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Bottom Navigation - Fixed outside wrapper with animation */}
            <AnimatePresence>
                {!showNewNav && !hideAllNavigation && (
                    <motion.div 
                        key="bottom-nav"
                        className="mobile-only"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                    >
                        <BottomNav lang={lang} />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ClubLeaderboard Navigation - Fixed outside wrapper with animation */}
            <AnimatePresence>
                {showNewNav && (
                    <>
                        {/* Mobile ClubLeaderboardNav */}
                        <motion.div 
                            key="club-leaderboard-nav-mobile"
                            className="mobile-only"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                        >
                            <ClubLeaderboardNav lang={lang} />
                        </motion.div>
                        
                        {/* Desktop ClubLeaderboardNav */}
                        <motion.div 
                            key="club-leaderboard-nav-desktop"
                            className="desktop-nav"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
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
