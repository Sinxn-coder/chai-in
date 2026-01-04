import React, { useState, useEffect } from 'react';
import { Pause, Play } from 'lucide-react';

const ImageSlider = ({ images, interval = 3000, showControls = false }) => {
    // Limit to 5 images as requested
    const displayImages = images && images.length > 0 ? images.slice(0, 5) : ['https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80'];

    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(true);

    useEffect(() => {
        let timer;
        if (isPlaying && displayImages.length > 1) {
            timer = setInterval(() => {
                setCurrentIndex((prevIndex) => (prevIndex + 1) % displayImages.length);
            }, interval);
        }
        return () => clearInterval(timer);
    }, [isPlaying, displayImages.length, interval]);

    const togglePlay = (e) => {
        e.stopPropagation(); // Prevent triggering parent clicks if any
        setIsPlaying(!isPlaying);
    };

    if (displayImages.length === 0) return null;

    return (
        <div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}>
            {displayImages.map((img, index) => (
                <div
                    key={index}
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        opacity: index === currentIndex ? 1 : 0,
                        transition: 'opacity 0.5s ease-in-out',
                        pointerEvents: 'none' // Let clicks pass through to parent container if needed
                    }}
                >
                    <img
                        src={img}
                        alt={`Slide ${index + 1}`}
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                        }}
                    />
                </div>
            ))}

            {/* Pause/Play Toggle - Positioned at bottom left nicely */}
            {showControls && displayImages.length > 1 && (
                <button
                    onClick={togglePlay}
                    style={{
                        position: 'absolute',
                        bottom: '20px',
                        left: '20px',
                        background: 'rgba(0, 0, 0, 0.5)',
                        border: 'none',
                        borderRadius: '50%',
                        width: '36px',
                        height: '36px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        zIndex: 20, // Ensure it's above images but below other overlays if needed
                        color: 'white',
                        backdropFilter: 'blur(4px)'
                    }}
                >
                    {isPlaying ? <Pause size={16} fill="white" /> : <Play size={16} fill="white" />}
                </button>
            )}

            {/* Slide Indicators */}
            {displayImages.length > 1 && (
                <div style={{
                    position: 'absolute',
                    bottom: '10px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    display: 'flex',
                    gap: '6px',
                    zIndex: 20
                }}>
                    {displayImages.map((_, idx) => (
                        <div
                            key={idx}
                            style={{
                                width: '6px',
                                height: '6px',
                                borderRadius: '50%',
                                background: idx === currentIndex ? 'white' : 'rgba(255,255,255,0.4)',
                                transition: 'background 0.3s'
                            }}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default ImageSlider;
