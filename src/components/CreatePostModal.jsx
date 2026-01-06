import React, { useState, useRef } from 'react';
import { X, Camera, Image as ImageIcon, Crop, RotateCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CreatePostModal = ({ onClose, onPostComplete }) => {
    const [step, setStep] = useState('select'); // 'select', 'edit', 'caption'
    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [zoom, setZoom] = useState(1);
    const [rotation, setRotation] = useState(0);
    const [caption, setCaption] = useState('');
    const [uploading, setUploading] = useState(false);
    
    const fileInputRef = useRef(null);
    const imageRef = useRef(null);
    const canvasRef = useRef(null);

    const handleImageSelect = (file) => {
        setSelectedImage(file);
        setImagePreview(URL.createObjectURL(file));
        setStep('edit');
        
        // Initialize zoom and rotation
        setZoom(1);
        setRotation(0);
    };

    const handleFileInput = (e) => {
        const file = e.target.files[0];
        if (file) {
            handleImageSelect(file);
        }
    };

    const handleCameraCapture = () => {
        // Create camera input
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.capture = 'camera';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                handleImageSelect(file);
            }
        };
        input.click();
    };

    const handleZoomIn = () => {
        setZoom((prev) => Math.min(prev + 0.1, 3));
    };

    const handleZoomOut = () => {
        setZoom((prev) => Math.max(prev - 0.1, 0.5));
    };

    const handleRotate = () => {
        setRotation((prev) => (prev + 90) % 360);
    };

    const handleCropConfirm = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const image = imageRef.current;

        if (!canvas || !image) return;

        // Set canvas to Instagram square size (1080x1080)
        const size = 1080;
        canvas.width = size;
        canvas.height = size;

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Save context state
        ctx.save();

        // Apply transformations
        const centerX = size / 2;
        const centerY = size / 2;

        // Move to center
        ctx.translate(centerX, centerY);

        // Apply rotation
        ctx.rotate((rotation * Math.PI) / 180);

        // Apply zoom
        ctx.scale(zoom, zoom);

        // Draw image centered and scaled to fit square
        const imgSize = Math.min(image.naturalWidth, image.naturalHeight);
        
        ctx.drawImage(
            image,
            -imgSize / 2,
            -imgSize / 2,
            imgSize,
            imgSize
        );

        // Restore context state
        ctx.restore();

        const croppedDataUrl = canvas.toDataURL('image/jpeg', 0.9);
        if (croppedDataUrl) {
            fetch(croppedDataUrl)
                .then(res => res.blob())
                .then(blob => {
                    const file = new File([blob], 'cropped-image.jpg', { type: 'image/jpeg' });
                    setSelectedImage(file);
                    setImagePreview(URL.createObjectURL(file));
                    setStep('caption');
                });
        }
    };

    const handlePostSubmit = async () => {
        if (!selectedImage || !caption.trim()) return;
        
        setUploading(true);
        try {
            await onPostComplete(selectedImage, caption.trim());
            onClose();
        } catch (error) {
            console.error('Error posting:', error);
        } finally {
            setUploading(false);
        }
    };

    const handleClose = () => {
        if (uploading) return;
        onClose();
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
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                style={{
                    background: 'white',
                    borderRadius: '20px',
                    width: '90%',
                    maxWidth: '400px',
                    maxHeight: '80vh',
                    overflow: 'hidden',
                    position: 'relative'
                }}
            >
                {/* Header */}
                <div style={{
                    padding: '20px',
                    borderBottom: '1px solid var(--secondary)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: '900' }}>
                        {step === 'select' && 'Create Post'}
                        {step === 'edit' && 'Edit Photo'}
                        {step === 'caption' && 'Add Caption'}
                    </h3>
                    <button
                        onClick={handleClose}
                        style={{
                            background: 'var(--secondary)',
                            border: 'none',
                            padding: '8px',
                            borderRadius: '8px',
                            cursor: 'pointer'
                        }}
                        disabled={uploading}
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div style={{ padding: '20px' }}>
                    {/* Step 1: Select Image */}
                    {step === 'select' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div style={{
                                height: '200px',
                                border: '2px dashed var(--secondary)',
                                borderRadius: '12px',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                background: 'var(--secondary)'
                            }}>
                                <ImageIcon size={40} color="var(--primary)" />
                                <p style={{ margin: '10px 0 0 0', fontWeight: '600', color: 'var(--text-muted)' }}>
                                    Choose photo source
                                </p>
                            </div>
                            
                            <div style={{ display: 'flex', gap: '12px' }}>
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    style={{
                                        flex: 1,
                                        padding: '16px',
                                        borderRadius: '12px',
                                        background: 'var(--primary)',
                                        color: 'white',
                                        border: 'none',
                                        fontSize: '1rem',
                                        fontWeight: '800',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '8px'
                                    }}
                                >
                                    <ImageIcon size={20} />
                                    Gallery
                                </button>
                                
                                <button
                                    onClick={handleCameraCapture}
                                    style={{
                                        flex: 1,
                                        padding: '16px',
                                        borderRadius: '12px',
                                        background: 'var(--primary)',
                                        color: 'white',
                                        border: 'none',
                                        fontSize: '1rem',
                                        fontWeight: '800',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '8px'
                                    }}
                                >
                                    <Camera size={20} />
                                    Camera
                                </button>
                            </div>
                            
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                style={{ display: 'none' }}
                                onChange={handleFileInput}
                            />
                        </div>
                    )}

                    {/* Step 2: Edit Photo */}
                    {step === 'edit' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div style={{
                                width: '100%',
                                height: '250px',
                                borderRadius: '12px',
                                overflow: 'hidden',
                                border: '2px solid var(--primary)',
                                position: 'relative',
                                background: 'black'
                            }}>
                                <img 
                                    ref={imageRef}
                                    src={imagePreview} 
                                    style={{ 
                                        width: '100%', 
                                        height: '100%', 
                                        objectFit: 'contain',
                                        transform: `scale(${zoom}) rotate(${rotation}deg)`,
                                        transition: 'transform 0.3s ease'
                                    }} 
                                />
                            </div>
                            
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
                            
                            <div style={{
                                display: 'flex',
                                justifyContent: 'center',
                                gap: '10px'
                            }}>
                                <button
                                    onClick={() => setStep('select')}
                                    style={{
                                        background: 'var(--secondary)',
                                        border: 'none',
                                        padding: '12px 20px',
                                        borderRadius: '12px',
                                        cursor: 'pointer',
                                        fontSize: '0.9rem',
                                        fontWeight: '600'
                                    }}
                                >
                                    Back
                                </button>
                                <button
                                    onClick={handleCropConfirm}
                                    style={{
                                        background: 'var(--primary)',
                                        color: 'white',
                                        border: 'none',
                                        padding: '12px 20px',
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
                                    Confirm
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Add Caption */}
                    {step === 'caption' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div style={{
                                width: '100%',
                                height: '200px',
                                borderRadius: '12px',
                                overflow: 'hidden',
                                border: '2px solid var(--secondary)'
                            }}>
                                <img 
                                    src={imagePreview} 
                                    style={{ 
                                        width: '100%', 
                                        height: '100%', 
                                        objectFit: 'cover'
                                    }} 
                                />
                            </div>
                            
                            <textarea
                                placeholder="Write a caption..."
                                value={caption}
                                onChange={e => setCaption(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '16px',
                                    borderRadius: '12px',
                                    background: 'var(--secondary)',
                                    border: 'none',
                                    fontSize: '1rem',
                                    fontWeight: '600',
                                    minHeight: '100px',
                                    outline: 'none',
                                    resize: 'vertical'
                                }}
                            />
                            
                            <div style={{
                                display: 'flex',
                                justifyContent: 'center',
                                gap: '10px'
                            }}>
                                <button
                                    onClick={() => setStep('edit')}
                                    style={{
                                        background: 'var(--secondary)',
                                        border: 'none',
                                        padding: '12px 20px',
                                        borderRadius: '12px',
                                        cursor: 'pointer',
                                        fontSize: '0.9rem',
                                        fontWeight: '600'
                                    }}
                                >
                                    Back
                                </button>
                                <button
                                    onClick={handlePostSubmit}
                                    disabled={uploading || !caption.trim()}
                                    style={{
                                        background: 'var(--primary)',
                                        color: 'white',
                                        border: 'none',
                                        padding: '12px 20px',
                                        borderRadius: '12px',
                                        cursor: 'pointer',
                                        fontSize: '1rem',
                                        fontWeight: '800',
                                        opacity: (uploading || !caption.trim()) ? 0.6 : 1
                                    }}
                                >
                                    {uploading ? 'Sharing...' : 'Share Post'}
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Hidden canvas for cropping */}
                <canvas
                    ref={canvasRef}
                    style={{ display: 'none' }}
                />
            </motion.div>
        </div>
    );
};

export default CreatePostModal;
