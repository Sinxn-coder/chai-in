import React, { useState, useRef } from 'react';
import { MapPin, Star, Users, Layout } from 'lucide-react';
import AdminLoginPage from './AdminLoginPage';
import './MobileIntro.css';

const MobileIntro = ({ onLogin }) => {
    const [showLogin, setShowLogin] = useState(false);
    const [clickCount, setClickCount] = useState(0);
    const timerRef = useRef(null);

    const handleAdminClick = () => {
        // Increment click count
        const newCount = clickCount + 1;
        setClickCount(newCount);

        // Clear existing timer
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }

        // Check if triple click achieved
        if (newCount === 3) {
            setShowLogin(true);
            setClickCount(0);
        } else {
            // Reset count if no follow-up click within 500ms
            timerRef.current = setTimeout(() => {
                setClickCount(0);
            }, 500);
        }
    };

    if (showLogin) {
        return <AdminLoginPage onBack={() => setShowLogin(false)} onLogin={onLogin} />;
    }

    return (
        <div className="mobile-intro-container">
            <div className="bg-blobs">
                <div className="blob blob-1"></div>
                <div className="blob blob-2"></div>
            </div>

            <div className="mobile-intro-content">
                <div className="mobile-logo">
                    🍵
                </div>

                <h1>BytSpot</h1>
                <p className="slogan">Your ultimate guide to finding the best food spots.</p>

                <div className="features-grid">
                    <div className="feature-item">
                        <div className="feature-icon">
                            <MapPin size={24} />
                        </div>
                        <div className="feature-text">
                            <h3>Discover Spots</h3>
                            <p>Explore verified cafes and restaurants near you.</p>
                        </div>
                    </div>

                    <div className="feature-item">
                        <div className="feature-icon">
                            <Star size={24} />
                        </div>
                        <div className="feature-text">
                            <h3>Trust Reviews</h3>
                            <p>Read honest feedback from our food community.</p>
                        </div>
                    </div>

                    <div className="feature-item">
                        <div className="feature-icon">
                            <Users size={24} />
                        </div>
                        <div className="feature-text">
                            <h3>Join Community</h3>
                            <p>Share photos and your own food experiences.</p>
                        </div>
                    </div>
                </div>

                <div className="desktop-note" onClick={handleAdminClick}>
                    <Layout size={18} />
                    <span>Switch To desktop</span>
                </div>
            </div>
        </div>
    );
};

export default MobileIntro;

