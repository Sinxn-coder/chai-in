import React, { useState, useRef } from 'react';
import {
    ChevronLeft, ChevronRight, Upload, MapPin, Check,
    Loader, Crosshair, Map, Sparkles, XCircle,
    Instagram, MessageCircle, Info, Tag, Camera, Youtube, AlertCircle
} from 'lucide-react';
import Button from '../components/Button';
import Toast from '../components/Toast';
import MapPicker from '../components/MapPicker';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const AddSpot = ({ lang }) => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const fileInputRef = useRef(null);

    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [showMapPicker, setShowMapPicker] = useState(false);
    const [mapCenter, setMapCenter] = useState([11.2588, 75.7804]);
    const [toast, setToast] = useState(null);

    const [formData, setFormData] = useState({
        name: '',
        category: '',
        price: 2,
        location_text: '',
        latitude: null,
        longitude: null,
        description: '',
        instagram: '',
        whatsapp: '',
        google_maps: '',
        tags: [],
        images: []
    });

    const categories = ['Cafe', 'Restaurant', 'Street Food', 'Bakery', 'Juice Shop', 'Tea Stall'];
    const popularTags = ['Biriyani', 'Mandhi', 'Burger', 'Coffee', 'Desserts', 'Spicy', 'Budget-friendly', 'Late Night', 'Outdoor'];

    const showToast = (msg, type = 'success') => {
        setToast({ message: msg, type });
    };

    const handleNext = () => {
        if (step === 1 && !formData.name) return showToast('Please enter a name', 'error');
        if (step === 1 && !formData.category) return showToast('Please select a category', 'error');
        if (step === 2 && !formData.location_text) return showToast('Please set a location', 'error');
        setStep(s => s + 1);
    };

    const handleBack = () => setStep(s => s - 1);

    const handleGetLocation = () => {
        setLoading(true);
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const lat = position.coords.latitude;
                    const lng = position.coords.longitude;
                    setFormData({
                        ...formData,
                        latitude: lat,
                        longitude: lng,
                        location_text: `${lat.toFixed(4)}, ${lng.toFixed(4)}`
                    });
                    setMapCenter([lat, lng]);
                    setLoading(false);
                    showToast('Location updated!');
                },
                (error) => {
                    showToast("Could not get location.", 'error');
                    setLoading(false);
                }
            );
        } else {
            showToast("Geolocation not supported", 'error');
            setLoading(false);
        }
    };

    const handleMapClick = (lat, lng) => {
        setFormData({
            ...formData,
            latitude: lat,
            longitude: lng,
            location_text: `${lat.toFixed(4)}, ${lng.toFixed(4)}`
        });
        setShowMapPicker(false);
        showToast('Location selected from map!');
    };

    const handleImageUpload = async (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;
        if (formData.images.length + files.length > 5) return showToast("Max 5 images allowed", 'error');

        setUploading(true);
        try {
            for (const file of files) {
                const fileName = `${Math.random()}.${file.name.split('.').pop()}`;
                await supabase.storage.from('food-images').upload(fileName, file);
                const { data } = supabase.storage.from('food-images').getPublicUrl(fileName);
                setFormData(prev => ({ ...prev, images: [...prev.images, data.publicUrl] }));
            }
            showToast(`${files.length} images uploaded!`);
        } catch (error) {
            showToast("Error uploading images.", 'error');
        } finally {
            setUploading(false);
        }
    };

    const toggleTag = (tag) => {
        if (formData.tags.includes(tag)) {
            setFormData(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tag) }));
        } else {
            if (formData.tags.length >= 5) return showToast("Max 5 tags allowed", 'error');
            setFormData(prev => ({ ...prev, tags: [...prev.tags, tag] }));
        }
    };

    const handleSubmit = async () => {
        if (!user) return showToast("Please login first", "error");
        setLoading(true);
        try {
            const { error } = await supabase.from('spots').insert([{
                ...formData,
                price_level: formData.price,
                instagram_handle: formData.instagram,
                whatsapp_number: formData.whatsapp,
                google_maps_link: formData.google_maps,
                created_by: user.id
            }]);
            if (error) throw error;
            showToast("Spot shared! Redirecting...", 'success');
            setTimeout(() => navigate(`/${lang}/home`), 2000);
        } catch (error) {
            showToast("Error saving spot", 'error');
            setLoading(false);
        }
    };

    return (
        <div style={{ minHeight: '100vh', background: 'var(--secondary)', paddingBottom: '100px' }}>
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

            <MapPicker isOpen={showMapPicker} onClose={() => setShowMapPicker(false)} onSelectLocation={handleMapClick} initialCenter={mapCenter} />

            {/* Red Header */}
            <div style={{ height: '140px', background: 'var(--primary)', borderBottomLeftRadius: '40px', borderBottomRightRadius: '40px', padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <button onClick={() => navigate(-1)} style={{ position: 'absolute', left: '20px', background: 'rgba(255,255,255,0.2)', border: 'none', padding: '10px', borderRadius: '15px', color: 'white' }}>
                    <ChevronLeft size={24} />
                </button>
                <h1 style={{ color: 'white', fontSize: '1.4rem', fontWeight: '900' }}>Add New Spot</h1>
            </div>

            <div className="container" style={{ marginTop: '-40px', padding: '0 20px' }}>
                {/* Step Indicator */}
                <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', justifyContent: 'center' }}>
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} style={{ width: i === step ? '32px' : '10px', height: '10px', borderRadius: '5px', background: i <= step ? 'var(--primary)' : '#ddd', transition: 'all 0.3s' }} />
                    ))}
                </div>

                {/* Important Note */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                        background: 'rgba(239, 42, 57, 0.05)',
                        padding: '16px',
                        borderRadius: '20px',
                        marginBottom: '16px',
                        border: '2px dashed var(--primary)'
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '12px' }}>
                        <AlertCircle size={20} color="var(--primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                        <div>
                            <h3 style={{ fontSize: '0.95rem', fontWeight: '800', color: 'var(--primary)', margin: '0 0 4px 0' }}>
                                ⚠️ Verification Required
                            </h3>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0, lineHeight: '1.5' }}>
                                Your spot will be added to Chai.in only after our admin team verifies it. This helps maintain quality and accuracy!
                            </p>
                        </div>
                    </div>
                    <a
                        href="https://www.youtube.com/watch?v=PLACEHOLDER_VIDEO_ID"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            background: '#FF0000',
                            color: 'white',
                            padding: '10px 16px',
                            borderRadius: '12px',
                            textDecoration: 'none',
                            fontWeight: '700',
                            fontSize: '0.85rem',
                            justifyContent: 'center'
                        }}
                    >
                        <Youtube size={18} />
                        Watch Tutorial: How to Add a Spot
                    </a>
                </motion.div>

                <motion.div
                    layout
                    style={{ background: 'white', borderRadius: '32px', padding: '24px', boxShadow: 'var(--shadow-md)' }}
                >
                    <AnimatePresence mode="wait">
                        {step === 1 && (
                            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                                <h2 style={{ fontSize: '1.25rem', fontWeight: '900', marginBottom: '16px', color: 'var(--text-main)' }}>The Basics 🍽️</h2>
                                <label style={{ fontSize: '0.85rem', fontWeight: '800', color: 'var(--text-muted)', marginBottom: '8px', display: 'block' }}>SPOT NAME</label>
                                <input
                                    type="text"
                                    placeholder="Enter spot name..."
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    style={{ width: '100%', padding: '16px', borderRadius: '18px', border: '2px solid var(--secondary)', background: 'var(--secondary)', fontSize: '1rem', fontWeight: '700', outline: 'none', marginBottom: '20px' }}
                                />
                                <label style={{ fontSize: '0.85rem', fontWeight: '800', color: 'var(--text-muted)', marginBottom: '12px', display: 'block' }}>CATEGORY</label>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', marginBottom: '24px' }}>
                                    {categories.map(cat => (
                                        <button
                                            key={cat}
                                            onClick={() => setFormData({ ...formData, category: cat })}
                                            style={{ padding: '14px', borderRadius: '18px', border: 'none', background: formData.category === cat ? 'var(--primary)' : 'var(--secondary)', color: formData.category === cat ? 'white' : 'var(--text-main)', fontWeight: '800', transition: 'all 0.2s' }}
                                        >
                                            {cat}
                                        </button>
                                    ))}
                                </div>
                                <Button onClick={handleNext} style={{ width: '100%', padding: '18px', borderRadius: '24px', justifyContent: 'center' }}>Continue</Button>
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                                <h2 style={{ fontSize: '1.25rem', fontWeight: '900', marginBottom: '16px', color: 'var(--text-main)' }}>Location 📍</h2>
                                <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
                                    <button onClick={handleGetLocation} style={{ flex: 1, padding: '14px', borderRadius: '18px', border: 'none', background: '#ECFDF5', color: '#10B981', fontWeight: '800', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                        <Crosshair size={18} /> GPS
                                    </button>
                                    <button onClick={() => setShowMapPicker(true)} style={{ flex: 1, padding: '14px', borderRadius: '18px', border: 'none', background: '#EFF6FF', color: '#3B82F6', fontWeight: '800', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                        <Map size={18} /> Map
                                    </button>
                                </div>
                                <input
                                    type="text"
                                    placeholder="Location address..."
                                    value={formData.location_text}
                                    onChange={e => setFormData({ ...formData, location_text: e.target.value })}
                                    style={{ width: '100%', padding: '16px', borderRadius: '18px', border: '2px solid var(--secondary)', background: 'var(--secondary)', fontSize: '1rem', fontWeight: '700', outline: 'none', marginBottom: '20px' }}
                                />
                                <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                                    <button onClick={handleBack} style={{ flex: 1, padding: '18px', borderRadius: '24px', background: 'var(--secondary)', border: 'none', fontWeight: '800' }}>Back</button>
                                    <Button onClick={handleNext} style={{ flex: 2, padding: '18px', borderRadius: '24px', justifyContent: 'center' }}>Next</Button>
                                </div>
                            </motion.div>
                        )}

                        {step === 3 && (
                            <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                                <h2 style={{ fontSize: '1.25rem', fontWeight: '900', marginBottom: '16px', color: 'var(--text-main)' }}>Socials 💬</h2>
                                <textarea
                                    placeholder="Add a juicy description..."
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    style={{ width: '100%', padding: '16px', borderRadius: '18px', border: '2px solid var(--secondary)', background: 'var(--secondary)', fontSize: '1rem', fontWeight: '700', outline: 'none', marginBottom: '16px', minHeight: '100px' }}
                                />
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px' }}>
                                    <input placeholder="Insta @user" value={formData.instagram} onChange={e => setFormData({ ...formData, instagram: e.target.value })} style={{ padding: '14px', borderRadius: '16px', background: 'var(--secondary)', border: 'none', fontWeight: '700' }} />
                                    <input placeholder="WhatsApp" value={formData.whatsapp} onChange={e => setFormData({ ...formData, whatsapp: e.target.value })} style={{ padding: '14px', borderRadius: '16px', background: 'var(--secondary)', border: 'none', fontWeight: '700' }} />
                                </div>
                                <div style={{ display: 'flex', gap: '12px' }}>
                                    <button onClick={handleBack} style={{ flex: 1, padding: '18px', borderRadius: '24px', background: 'var(--secondary)', border: 'none', fontWeight: '800' }}>Back</button>
                                    <Button onClick={handleNext} style={{ flex: 2, padding: '18px', borderRadius: '24px', justifyContent: 'center' }}>Next</Button>
                                </div>
                            </motion.div>
                        )}

                        {step === 4 && (
                            <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                                <h2 style={{ fontSize: '1.25rem', fontWeight: '900', marginBottom: '16px', color: 'var(--text-main)' }}>Photos 📸</h2>
                                <div onClick={() => fileInputRef.current.click()} style={{ border: '2px dashed #ddd', borderRadius: '24px', padding: '30px', textAlign: 'center', background: 'var(--secondary)', cursor: 'pointer', marginBottom: '20px' }}>
                                    <input type="file" multiple ref={fileInputRef} onChange={handleImageUpload} style={{ display: 'none' }} />
                                    {uploading ? <Loader className="animate-spin" size={30} color="var(--primary)" /> : <Camera size={40} color="var(--primary)" />}
                                    <p style={{ fontWeight: '800', marginTop: '10px', fontSize: '0.9rem' }}>Upload up to 5 photos</p>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '20px' }}>
                                    {formData.images.map((img, i) => (
                                        <div key={i} style={{ width: '100%', paddingTop: '100%', position: 'relative', borderRadius: '14px', overflow: 'hidden' }}>
                                            <img src={img} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                                        </div>
                                    ))}
                                </div>
                                <div style={{ display: 'flex', gap: '12px' }}>
                                    <button onClick={handleBack} style={{ flex: 1, padding: '18px', borderRadius: '24px', background: 'var(--secondary)', border: 'none', fontWeight: '800' }}>Back</button>
                                    <button onClick={handleSubmit} disabled={loading} style={{ flex: 2, padding: '18px', borderRadius: '24px', background: 'var(--primary)', color: 'white', border: 'none', fontWeight: '900', fontSize: '1.1rem', boxShadow: 'var(--shadow-md)' }}>
                                        {loading ? 'Submitting...' : 'Post Spot ✨'}
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </div>
        </div>
    );
};

export default AddSpot;
