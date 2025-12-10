import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Upload, MapPin, Check, Loader, Crosshair } from 'lucide-react';
import Button from '../components/Button';
import Toast from '../components/Toast';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';

const AddSpot = ({ lang }) => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [toast, setToast] = useState(null);

    const [formData, setFormData] = useState({
        name: '',
        category: '',
        price: 1,
        location_text: '',
        latitude: null,
        longitude: null,
        description: '',
        images: []
    });

    const handleNext = () => {
        if (step === 1 && !formData.name) return showToast('Please enter a name', 'error');
        if (step === 2 && !formData.location_text) return showToast('Please set a location', 'error');
        setStep(s => s + 1);
    };

    const handleBack = () => setStep(s => s - 1);

    const showToast = (msg, type = 'success') => {
        setToast({ message: msg, type });
    };

    // --- Location Logic ---
    const handleGetLocation = () => {
        setLoading(true);
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setFormData({
                        ...formData,
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        location_text: `${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`
                    });
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

    // --- Image Upload Logic ---
    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `${fileName}`;

            const { data: uploadData, error: uploadError } = await supabase.storage
                .from('food-images')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data } = supabase.storage.from('food-images').getPublicUrl(filePath);

            setFormData(prev => ({
                ...prev,
                images: [...prev.images, data.publicUrl]
            }));
            showToast('Image uploaded!');

        } catch (error) {
            console.error("Upload error:", error);
            showToast("Error uploading. Check permissions.", 'error');
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { error } = await supabase.from('spots').insert([{
                name: formData.name,
                category: formData.category,
                price_level: formData.price,
                location_text: formData.location_text,
                latitude: formData.latitude || 0,
                longitude: formData.longitude || 0,
                images: formData.images,
                created_by: user?.id,
                is_verified: false
            }]);

            if (error) throw error;

            showToast("Spot Submitted Successfully!", 'success');
            setTimeout(() => navigate(`/${lang}/home`), 2000);
        } catch (error) {
            console.error("Submit error:", error);
            showToast("Failed to save spot.", 'error');
            setLoading(false);
        }
    };

    const StepIndicator = () => (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '2rem' }}>
            {[1, 2, 3].map(i => (
                <div key={i} style={{
                    width: '10px', height: '10px',
                    borderRadius: '50%',
                    background: i <= step ? 'var(--primary)' : '#e0e0e0',
                    transition: 'all 0.3s ease',
                    transform: i === step ? 'scale(1.2)' : 'scale(1)'
                }} />
            ))}
        </div>
    );

    return (
        <div className="container" style={{ padding: '2rem 1rem', paddingBottom: '100px' }}>
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

            <button onClick={() => navigate(-1)} style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-muted)' }}>
                <ChevronLeft size={20} /> Back
            </button>

            <h1 style={{ fontSize: '1.75rem', fontWeight: '800', marginBottom: '0.5rem', color: 'var(--primary)' }}>Add New Spot</h1>

            <StepIndicator />

            <form onSubmit={handleSubmit} className="glass-card" style={{ padding: '2rem', position: 'relative' }}>

                {/* Step 1: Basic Info */}
                {step === 1 && (
                    <div className="animate-fade-in">
                        <h2 style={{ marginBottom: '1.5rem', fontSize: '1.2rem', fontWeight: '700' }}>Basic Info</h2>

                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Spot Name</label>
                            <input
                                type="text"
                                placeholder="e.g. Grandma's Cafe"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid #ddd', fontSize: '1rem', background: '#f9f9f9' }}
                            />
                        </div>

                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Category</label>
                            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                                {['Cafe', 'Restaurant', 'Street Food', 'Bakery'].map(cat => (
                                    <button
                                        key={cat} type="button"
                                        onClick={() => setFormData({ ...formData, category: cat })}
                                        style={{
                                            padding: '10px 20px',
                                            borderRadius: 'var(--radius-full)',
                                            border: 'none',
                                            background: formData.category === cat ? 'var(--primary)' : '#f0f0f0',
                                            color: formData.category === cat ? 'white' : 'var(--text-main)',
                                            fontWeight: '600',
                                            boxShadow: formData.category === cat ? '0 4px 12px rgba(226, 55, 68, 0.3)' : 'none',
                                            transition: 'all 0.2s ease'
                                        }}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <Button type="button" onClick={handleNext} style={{ width: '100%', marginTop: '1.5rem', background: 'var(--primary)', color: 'white', padding: '16px', fontSize: '1rem' }}>
                            Next Step <ChevronRight size={18} />
                        </Button>
                    </div>
                )}

                {/* Step 2: Location & Details */}
                {step === 2 && (
                    <div className="animate-fade-in">
                        <h2 style={{ marginBottom: '1.5rem', fontSize: '1.2rem', fontWeight: '700' }}>Location & Price</h2>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Location</label>

                            <button
                                type="button"
                                onClick={handleGetLocation}
                                disabled={loading}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '8px',
                                    padding: '12px 16px', background: 'rgba(38, 126, 62, 0.1)', color: 'var(--success)',
                                    borderRadius: '12px', marginBottom: '12px', fontWeight: '700', fontSize: '0.9rem',
                                    width: '100%', justifyContent: 'center'
                                }}
                            >
                                {loading ? <Loader className="animate-spin" size={18} /> : <Crosshair size={18} />}
                                {formData.latitude ? 'Location Updated' : 'Use Current Location'}
                            </button>

                            <input
                                type="text"
                                placeholder="Type address..."
                                value={formData.location_text}
                                onChange={e => setFormData({ ...formData, location_text: e.target.value })}
                                style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid #ddd', background: '#f9f9f9' }}
                            />
                        </div>

                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Price Level</label>
                            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                                {[1, 2, 3].map(lvl => (
                                    <button
                                        key={lvl} type="button"
                                        onClick={() => setFormData({ ...formData, price: lvl })}
                                        style={{
                                            width: '50px', height: '50px',
                                            borderRadius: '50%',
                                            background: formData.price === lvl ? 'var(--secondary)' : '#f0f0f0',
                                            color: formData.price === lvl ? 'white' : '#999',
                                            fontWeight: 'bold',
                                            fontSize: '1.2rem',
                                            transition: 'all 0.2s ease'
                                        }}
                                    >
                                        {'$'.repeat(lvl)}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                            <Button type="button" variant="secondary" onClick={handleBack} style={{ flex: 1, background: '#f0f0f0' }}>Back</Button>
                            <Button type="button" onClick={handleNext} style={{ flex: 1, background: 'var(--primary)', color: 'white' }}>Next</Button>
                        </div>
                    </div>
                )}

                {/* Step 3: Photos & Review */}
                {step === 3 && (
                    <div className="animate-fade-in">
                        <h2 style={{ marginBottom: '1.5rem', fontSize: '1.2rem', fontWeight: '700' }}>Photos</h2>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <label
                                style={{
                                    border: '2px dashed #ddd',
                                    borderRadius: '16px',
                                    padding: '3rem 1rem',
                                    textAlign: 'center',
                                    display: 'block',
                                    cursor: 'pointer',
                                    background: uploading ? '#fafafa' : '#fff',
                                    transition: 'all 0.2s ease',
                                    '&:hover': { borderColor: 'var(--primary)' }
                                }}
                            >
                                {uploading ? <Loader className="animate-spin" style={{ margin: '0 auto' }} /> : <Upload size={40} color="var(--primary)" style={{ marginBottom: '10px', margin: '0 auto' }} />}
                                <p style={{ fontWeight: '700', marginTop: '10px', color: 'var(--primary)' }}>
                                    {uploading ? 'Uploading...' : 'Tap to Upload Photo'}
                                </p>
                                <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
                            </label>
                        </div>

                        {/* Preview */}
                        {formData.images.length > 0 && (
                            <div style={{
                                display: 'flex',
                                gap: '12px',
                                overflowX: 'auto',
                                marginBottom: '2rem',
                                padding: '4px'
                            }}>
                                {formData.images.map((img, i) => (
                                    <div key={i} style={{ position: 'relative', width: '80px', height: '80px', flexShrink: 0 }}>
                                        <img src={img} alt="preview" style={{ width: '100%', height: '100%', borderRadius: '12px', objectFit: 'cover', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }} />
                                        <div style={{ position: 'absolute', top: -5, right: -5, background: 'white', borderRadius: '50%', padding: '2px' }}><Check size={14} color="green" /></div>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                            <Button type="button" variant="secondary" onClick={handleBack} style={{ flex: 1, background: '#f0f0f0' }}>Back</Button>
                            <Button
                                type="submit"
                                disabled={loading}
                                style={{ flex: 1, background: 'var(--success)', color: 'white', padding: '16px' }}
                            >
                                {loading ? 'Saving...' : 'Submit Spot'}
                            </Button>
                        </div>
                    </div>
                )}

            </form>
        </div>
    );
};

export default AddSpot;
