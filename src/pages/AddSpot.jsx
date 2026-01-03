import React, { useState, useRef } from 'react';
import {
    ChevronLeft, ChevronRight, Upload, MapPin, Check,
    Loader, Crosshair, Map, Sparkles, XCircle,
    Instagram, MessageCircle, Info, Tag, Camera
} from 'lucide-react';
import Button from '../components/Button';
import Toast from '../components/Toast';
import MapPicker from '../components/MapPicker';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';

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

    // --- Modern Multi-Image Upload Logic ---
    const handleImageUpload = async (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        const totalImages = formData.images.length + files.length;
        if (totalImages > 5) {
            showToast("Maximum 5 images allowed in total", 'error');
            return;
        }

        setUploading(true);
        const uploadedUrls = [];

        try {
            for (const file of files) {
                const fileExt = file.name.split('.').pop();
                const fileName = `${Math.random()}.${fileExt}`;
                const filePath = `${fileName}`;

                const { error: uploadError } = await supabase.storage
                    .from('food-images')
                    .upload(filePath, file);

                if (uploadError) throw uploadError;

                const { data } = supabase.storage.from('food-images').getPublicUrl(filePath);
                uploadedUrls.push(data.publicUrl);
            }

            setFormData(prev => ({
                ...prev,
                images: [...prev.images, ...uploadedUrls]
            }));
            showToast(`${uploadedUrls.length} images uploaded!`);

        } catch (error) {
            console.error("Upload error:", error);
            showToast("Error uploading images.", 'error');
        } finally {
            setUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    const removeImage = (indexToRemove) => {
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== indexToRemove)
        }));
    };

    const toggleTag = (tag) => {
        if (formData.tags.includes(tag)) {
            setFormData(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tag) }));
        } else {
            if (formData.tags.length >= 5) {
                showToast("Maximum 5 tags allowed", 'error');
                return;
            }
            setFormData(prev => ({ ...prev, tags: [...prev.tags, tag] }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) return showToast("Please login first", "error");
        setLoading(true);

        try {
            const { error } = await supabase.from('spots').insert([{
                name: formData.name,
                category: formData.category,
                price_level: formData.price,
                location_text: formData.location_text,
                latitude: formData.latitude || 0,
                longitude: formData.longitude || 0,
                description: formData.description,
                instagram_handle: formData.instagram,
                whatsapp_number: formData.whatsapp,
                tags: formData.tags,
                images: formData.images,
                created_by: user?.id,
                is_verified: false
            }]);

            if (error) throw error;

            showToast("Spot Submitted Successfully! ✨", 'success');
            setTimeout(() => navigate(`/${lang}/home`), 2000);
        } catch (error) {
            console.error("Submit error:", error);
            showToast("Failed to save spot.", 'error');
            setLoading(false);
        }
    };

    const StepIndicator = () => (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginBottom: '2.5rem' }}>
            {[1, 2, 3, 4].map(i => (
                <div key={i} style={{
                    width: i === step ? '32px' : '10px',
                    height: '10px',
                    borderRadius: '5px',
                    background: i <= step ? 'var(--primary)' : 'rgba(255,255,255,0.3)',
                    transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                }} />
            ))}
        </div>
    );

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #FF6B6B 0%, #E23744 100%)',
            paddingBottom: '120px',
            color: 'white'
        }}>
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

            <MapPicker
                isOpen={showMapPicker}
                onClose={() => setShowMapPicker(false)}
                onSelectLocation={handleMapClick}
                initialCenter={mapCenter}
            />

            <div className="container" style={{ padding: '2rem 1rem', maxWidth: '550px', margin: '0 auto' }}>
                {/* Header Section */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
                    <button
                        onClick={() => navigate(-1)}
                        style={{
                            background: 'rgba(255,255,255,0.2)',
                            backdropFilter: 'blur(10px)',
                            border: '1px solid rgba(255,255,255,0.3)',
                            padding: '10px',
                            borderRadius: '16px',
                            cursor: 'pointer',
                            color: 'white'
                        }}
                    >
                        <ChevronLeft size={24} />
                    </button>
                    <div style={{ textAlign: 'center' }}>
                        <h1 style={{ fontSize: '1.5rem', fontWeight: '900', margin: 0 }}>Step {step} of 4</h1>
                    </div>
                    <div style={{ width: '44px' }}></div>
                </div>

                <StepIndicator />

                <div style={{
                    background: 'rgba(255,255,255,1)',
                    borderRadius: '32px',
                    padding: '2rem',
                    color: '#1a1a1a',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
                }}>

                    {/* Step 1: Identity & Category */}
                    {step === 1 && (
                        <div className="animate-fade-in">
                            <h2 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '1.5rem', color: '#E23744' }}>
                                What's the name? 🏷️
                            </h2>

                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '700', marginBottom: '8px', opacity: 0.6 }}>SPOT NAME</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Grandma's Famous Biriyani"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    style={{
                                        width: '100%', padding: '16px', borderRadius: '16px', border: '1px solid #eee',
                                        fontSize: '1rem', background: '#f8fafc', fontWeight: '600', outline: 'none'
                                    }}
                                />
                            </div>

                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '700', marginBottom: '12px', opacity: 0.6 }}>CATEGORY</label>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                                    {categories.map(cat => (
                                        <button
                                            key={cat} type="button"
                                            onClick={() => setFormData({ ...formData, category: cat })}
                                            style={{
                                                padding: '14px', borderRadius: '16px', border: formData.category === cat ? 'none' : '2px solid #f1f5f9',
                                                background: formData.category === cat ? 'linear-gradient(135deg, #FF6B6B 0%, #E23744 100%)' : 'white',
                                                color: formData.category === cat ? 'white' : '#64748b',
                                                fontWeight: '800', fontSize: '0.9rem', cursor: 'pointer',
                                                transition: 'all 0.3s'
                                            }}
                                        >
                                            {cat}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <Button onClick={handleNext} style={{ width: '100%', padding: '18px', borderRadius: '20px', justifyContent: 'center', fontSize: '1.1rem' }}>
                                Continue <ChevronRight size={20} style={{ marginLeft: '8px' }} />
                            </Button>
                        </div>
                    )}

                    {/* Step 2: Location & Price */}
                    {step === 2 && (
                        <div className="animate-fade-in">
                            <h2 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '1.5rem', color: '#E23744' }}>
                                Where is it? 📍
                            </h2>

                            <div style={{ marginBottom: '1.5rem' }}>
                                <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                                    <button
                                        type="button"
                                        onClick={handleGetLocation}
                                        style={{
                                            flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                                            padding: '14px', background: '#ecfdf5', color: '#10b981', border: 'none', borderRadius: '16px', fontWeight: '700'
                                        }}
                                    >
                                        <Crosshair size={18} /> GPS
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setShowMapPicker(true)}
                                        style={{
                                            flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                                            padding: '14px', background: '#eff6ff', color: '#3b82f6', border: 'none', borderRadius: '16px', fontWeight: '700'
                                        }}
                                    >
                                        <Map size={18} /> Map Pin
                                    </button>
                                </div>
                                <input
                                    type="text"
                                    placeholder="Address or Location Text"
                                    value={formData.location_text}
                                    onChange={e => setFormData({ ...formData, location_text: e.target.value })}
                                    style={{
                                        width: '100%', padding: '16px', borderRadius: '16px', border: '1px solid #eee',
                                        fontSize: '1rem', background: '#f8fafc', fontWeight: '600'
                                    }}
                                />
                            </div>

                            <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '700', marginBottom: '12px', opacity: 0.6 }}>PRICE LEVEL</label>
                            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginBottom: '2rem' }}>
                                {[1, 2, 3].map(lvl => (
                                    <button
                                        key={lvl} type="button"
                                        onClick={() => setFormData({ ...formData, price: lvl })}
                                        style={{
                                            width: '80px', height: '60px', borderRadius: '16px',
                                            background: formData.price === lvl ? 'linear-gradient(135deg, #00d2ff 0%, #3a7bd5 100%)' : '#f8fafc',
                                            color: formData.price === lvl ? 'white' : '#94a3b8',
                                            border: 'none', fontWeight: '900', fontSize: '1.2rem', cursor: 'pointer', transition: 'all 0.3s'
                                        }}
                                    >
                                        {'₹'.repeat(lvl)}
                                    </button>
                                ))}
                            </div>

                            <div style={{ display: 'flex', gap: '12px' }}>
                                <button onClick={handleBack} style={{ flex: 1, padding: '16px', border: 'none', borderRadius: '20px', background: '#f1f5f9', fontWeight: '700' }}>Back</button>
                                <Button onClick={handleNext} style={{ flex: 2, padding: '16px', borderRadius: '20px', justifyContent: 'center' }}>Next</Button>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Details & Social */}
                    {step === 3 && (
                        <div className="animate-fade-in">
                            <h2 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '1.5rem', color: '#E23744' }}>
                                Let's get social! 💬
                            </h2>

                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '700', marginBottom: '8px', opacity: 0.6 }}>DESCRIPTION</label>
                                <textarea
                                    placeholder="Tell more about the specialties, ambiance..."
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    style={{
                                        width: '100%', padding: '16px', borderRadius: '16px', border: '1px solid #eee',
                                        fontSize: '1rem', background: '#f8fafc', fontWeight: '600', minHeight: '100px', resize: 'none'
                                    }}
                                />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '1.5rem' }}>
                                <div>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', fontWeight: '700', marginBottom: '8px', opacity: 0.6 }}>
                                        <Instagram size={14} /> INSTAGRAM
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="@handle"
                                        value={formData.instagram}
                                        onChange={e => setFormData({ ...formData, instagram: e.target.value })}
                                        style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid #eee', fontSize: '0.9rem', background: '#f8fafc' }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', fontWeight: '700', marginBottom: '8px', opacity: 0.6 }}>
                                        <MessageCircle size={14} /> WHATSAPP
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Phone number"
                                        value={formData.whatsapp}
                                        onChange={e => setFormData({ ...formData, whatsapp: e.target.value })}
                                        style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid #eee', fontSize: '0.9rem', background: '#f8fafc' }}
                                    />
                                </div>
                            </div>

                            <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '700', marginBottom: '12px', opacity: 0.6 }}>POPULAR TAGS (MAX 5)</label>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '2rem' }}>
                                {popularTags.map(tag => (
                                    <button
                                        key={tag} type="button"
                                        onClick={() => toggleTag(tag)}
                                        style={{
                                            padding: '8px 16px', borderRadius: '20px',
                                            background: formData.tags.includes(tag) ? '#E23744' : '#f1f5f9',
                                            color: formData.tags.includes(tag) ? 'white' : '#64748b',
                                            border: 'none', fontSize: '0.8rem', fontWeight: '700', cursor: 'pointer'
                                        }}
                                    >
                                        {tag}
                                    </button>
                                ))}
                            </div>

                            <div style={{ display: 'flex', gap: '12px' }}>
                                <button onClick={handleBack} style={{ flex: 1, padding: '16px', border: 'none', borderRadius: '20px', background: '#f1f5f9', fontWeight: '700' }}>Back</button>
                                <Button onClick={handleNext} style={{ flex: 2, padding: '16px', borderRadius: '20px', justifyContent: 'center' }}>Next</Button>
                            </div>
                        </div>
                    )}

                    {/* Step 4: Photos & Finish */}
                    {step === 4 && (
                        <div className="animate-fade-in">
                            <h2 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '1.5rem', color: '#E23744' }}>
                                Visual Proof! 📸
                            </h2>

                            <div style={{ marginBottom: '1.5rem' }}>
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    style={{ display: 'none' }}
                                    ref={fileInputRef}
                                />

                                <div
                                    onClick={() => fileInputRef.current.click()}
                                    style={{
                                        border: '3px dashed #e2e8f0', borderRadius: '24px', padding: '2rem 1rem',
                                        textAlign: 'center', cursor: 'pointer', background: '#f8fafc',
                                        transition: 'all 0.3s ease'
                                    }}
                                >
                                    {uploading ? (
                                        <Loader className="animate-spin" style={{ margin: '0 auto', color: '#E23744' }} />
                                    ) : (
                                        <>
                                            <Camera size={40} style={{ color: '#E23744', marginBottom: '12px', margin: '0 auto' }} />
                                            <p style={{ fontWeight: '800', fontSize: '0.9rem', color: '#1a1a1a' }}>Select Multiple Photos</p>
                                            <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px' }}>Max 5 images total</p>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Image Grid */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '2rem' }}>
                                {formData.images.map((img, i) => (
                                    <div key={i} style={{ position: 'relative', width: '100%', paddingTop: '100%', borderRadius: '16px', overflow: 'hidden' }}>
                                        <img src={img} alt="preview" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                                        <button
                                            onClick={() => removeImage(i)}
                                            style={{
                                                position: 'absolute', top: '5px', right: '5px',
                                                background: 'rgba(0,0,0,0.6)', border: 'none', borderRadius: '50%',
                                                width: '24px', height: '24px', color: 'white'
                                            }}
                                        >
                                            <XCircle size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>

                            <div style={{ display: 'flex', gap: '12px' }}>
                                <button onClick={handleBack} style={{ flex: 1, padding: '16px', border: 'none', borderRadius: '20px', background: '#f1f5f9', fontWeight: '700' }}>Back</button>
                                <button
                                    onClick={handleSubmit}
                                    disabled={loading || uploading}
                                    style={{
                                        flex: 2, padding: '16px', borderRadius: '20px',
                                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                        color: 'white', border: 'none', fontWeight: '900', fontSize: '1.1rem',
                                        boxShadow: '0 10px 20px rgba(16, 185, 129, 0.2)', cursor: 'pointer'
                                    }}
                                >
                                    {loading ? 'Posting...' : 'Finish ✨'}
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Info Note */}
                <div style={{ marginTop: '20px', padding: '16px', background: 'rgba(255,255,255,0.15)', borderRadius: '20px', backdropFilter: 'blur(10px)' }}>
                    <p style={{ fontSize: '0.85rem', display: 'flex', gap: '8px', color: 'white', fontWeight: '500' }}>
                        <Info size={18} /> Note: New spots are reviewed by the community team before being verified.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AddSpot;
