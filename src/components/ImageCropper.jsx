import React, { useState, useRef, useCallback } from 'react';
import { X, Crop, RotateCw } from 'lucide-react';

const ImageCropper = ({ imageFile, onCrop, onCancel }) => {
    const [crop, setCrop] = useState({ x: 0, y: 0, width: 100, height: 100 });
    const [zoom, setZoom] = useState(1);
    const [rotation, setRotation] = useState(0);
    const canvasRef = useRef(null);
    const imageRef = useRef(null);

    const handleImageLoad = useCallback(() => {
        const { naturalWidth, naturalHeight } = imageRef.current;
        const aspectRatio = naturalWidth / naturalHeight;
        
        // Set initial crop to square (1:1) like Instagram
        const size = Math.min(naturalWidth, naturalHeight);
        setCrop({
            x: (naturalWidth - size) / 2,
            y: (naturalHeight - size) / 2,
            width: size,
            height: size
        });
    }, []);

    const getCroppedImage = useCallback(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const image = imageRef.current;

        if (!crop || !canvas || !image) return null;

        // Set canvas size to crop size (square for Instagram-like posts)
        canvas.width = crop.width;
        canvas.height = crop.height;

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Save context state
        ctx.save();

        // Apply transformations
        const centerX = crop.width / 2;
        const centerY = crop.height / 2;

        // Move to center
        ctx.translate(centerX, centerY);

        // Apply rotation
        ctx.rotate((rotation * Math.PI) / 180);

        // Apply zoom
        ctx.scale(zoom, zoom);

        // Draw image (centered at origin)
        ctx.drawImage(
            image,
            crop.x / zoom - centerX,
            crop.y / zoom - centerY,
            crop.width / zoom,
            crop.height / zoom
        );

        // Restore context state
        ctx.restore();

        return canvas.toDataURL('image/jpeg', 0.9);
    }, [crop, zoom, rotation]);

    const handleConfirmCrop = () => {
        const croppedDataUrl = getCroppedImage();
        if (croppedDataUrl) {
            // Convert data URL to blob
            fetch(croppedDataUrl)
                .then(res => res.blob())
                .then(blob => {
                    const file = new File([blob], 'cropped-image.jpg', { type: 'image/jpeg' });
                    onCrop(file);
                });
        }
    };

    const handleRotate = () => {
        setRotation((prev) => (prev + 90) % 360);
    };

    const handleZoomIn = () => {
        setZoom((prev) => Math.min(prev + 0.1, 3));
    };

    const handleZoomOut = () => {
        setZoom((prev) => Math.max(prev - 0.1, 0.5));
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
        }}>
            <div style={{
                background: 'white',
                borderRadius: '20px',
                padding: '20px',
                maxWidth: '90%',
                maxHeight: '90%',
                display: 'flex',
                flexDirection: 'column',
                gap: '20px'
            }}>
                {/* Header */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: '900' }}>Crop Photo</h3>
                    <button
                        onClick={onCancel}
                        style={{
                            background: 'none',
                            border: 'none',
                            padding: '8px',
                            borderRadius: '8px',
                            cursor: 'pointer'
                        }}
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Image Preview */}
                <div style={{
                    position: 'relative',
                    width: '300px',
                    height: '300px',
                    border: '2px solid var(--secondary)',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    margin: '0 auto'
                }}>
                    <img
                        ref={imageRef}
                        src={URL.createObjectURL(imageFile)}
                        onLoad={handleImageLoad}
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'contain'
                        }}
                    />
                </div>

                {/* Controls */}
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px'
                }}>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: '10px'
                    }}>
                        <button
                            onClick={handleZoomOut}
                            style={{
                                background: 'var(--secondary)',
                                border: 'none',
                                padding: '8px 12px',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontSize: '0.9rem',
                                fontWeight: '600'
                            }}
                        >
                            Zoom -
                        </button>
                        <button
                            onClick={handleZoomIn}
                            style={{
                                background: 'var(--secondary)',
                                border: 'none',
                                padding: '8px 12px',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontSize: '0.9rem',
                                fontWeight: '600'
                            }}
                        >
                            Zoom +
                        </button>
                        <button
                            onClick={handleRotate}
                            style={{
                                background: 'var(--secondary)',
                                border: 'none',
                                padding: '8px 12px',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontSize: '0.9rem',
                                fontWeight: '600',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px'
                            }}
                        >
                            <RotateCw size={16} />
                            Rotate
                        </button>
                    </div>

                    <button
                        onClick={handleConfirmCrop}
                        style={{
                            background: 'var(--primary)',
                            color: 'white',
                            border: 'none',
                            padding: '12px 24px',
                            borderRadius: '12px',
                            cursor: 'pointer',
                            fontSize: '1rem',
                            fontWeight: '800',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                        }}
                    >
                        <Crop size={18} />
                        Confirm Crop
                    </button>
                </div>

                {/* Hidden canvas for cropping */}
                <canvas
                    ref={canvasRef}
                    style={{ display: 'none' }}
                />
            </div>
        </div>
    );
};

export default ImageCropper;
