import React, { useState } from 'react';
import { Star } from 'lucide-react';

const StarRating = ({ 
    rating = 0, 
    onRatingChange, 
    readonly = false, 
    size = 24,
    color = '#f59e0b',
    showValue = false 
}) => {
    const [hoverRating, setHoverRating] = useState(0);
    const [currentRating, setCurrentRating] = useState(rating);

    const handleMouseEnter = (value) => {
        if (!readonly) {
            setHoverRating(value);
        }
    };

    const handleMouseLeave = () => {
        if (!readonly) {
            setHoverRating(0);
        }
    };

    const handleClick = (value) => {
        if (!readonly && onRatingChange) {
            setCurrentRating(value);
            onRatingChange(value);
        }
    };

    const displayRating = hoverRating || currentRating;

    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <div style={{ display: 'flex', gap: '2px' }}>
                {[1, 2, 3, 4, 5].map((star) => {
                    const isFilled = star <= displayRating;
                    const isHalfFilled = star === Math.ceil(displayRating) && displayRating % 1 !== 0;
                    
                    return (
                        <div
                            key={star}
                            onMouseEnter={() => handleMouseEnter(star)}
                            onMouseLeave={handleMouseLeave}
                            onClick={() => handleClick(star)}
                            style={{
                                cursor: readonly ? 'default' : 'pointer',
                                transition: 'transform 0.2s ease',
                                transform: hoverRating === star && !readonly ? 'scale(1.1)' : 'scale(1)'
                            }}
                        >
                            <Star
                                size={size}
                                fill={isFilled ? color : 'none'}
                                color={isFilled ? color : '#d1d5db'}
                                strokeWidth={isHalfFilled ? 0 : 2}
                                style={{
                                    filter: isFilled ? 'drop-shadow(0 2px 4px rgba(245, 158, 11, 0.3))' : 'none'
                                }}
                            />
                        </div>
                    );
                })}
            </div>
            {showValue && (
                <span style={{
                    fontSize: size * 0.6,
                    fontWeight: '600',
                    color: '#374151',
                    marginLeft: '8px'
                }}>
                    {currentRating.toFixed(1)}
                </span>
            )}
        </div>
    );
};

export default StarRating;
