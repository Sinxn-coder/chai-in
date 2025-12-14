import React from 'react';
import './LoadingAnimation.css';

const LoadingAnimation = ({ size = 80 }) => {
    return (
        <div className="loading-container">
            <div className="frying-pan" style={{ width: size, height: size }}>
                {/* Pan */}
                <div className="pan">
                    <div className="pan-body"></div>
                    <div className="pan-handle"></div>
                </div>

                {/* Food items jumping */}
                <div className="food-items">
                    <div className="food-item food-1">🍳</div>
                    <div className="food-item food-2">🥘</div>
                    <div className="food-item food-3">🍛</div>
                </div>
            </div>
            <p className="loading-text">Cooking up something delicious...</p>
        </div>
    );
};

export default LoadingAnimation;
