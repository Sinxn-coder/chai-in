import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Upload, MapPin, Check, Loader, Crosshair, Map, Sparkles, CircleX } from 'lucide-react';
import Button from '../components/Button';
import Toast from '../components/Toast';
import MapPicker from '../components/MapPicker';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';

const AddSpot = ({ lang }) => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [showMapPicker, setShowMapPicker] = useState(false);
    const [mapCenter, setMapCenter] = useState([11.2588, 75.7804]); // Kozhikode default
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

    // --- Image Upload Logic ---
    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (formData.images.length >= 5) {
            showToast("Maximum 5 images allowed", 'error');
            return;
        }

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

    const removeImage = (indexToRemove) => {
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== indexToRemove)
        }));
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
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            paddingBottom: '100px'
        }}>
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

            {/* Map Picker Modal */}
            <MapPicker
                isOpen={showMapPicker}
                onClose={() => setShowMapPicker(false)}
                onSelectLocation={handleMapClick}
                initialCenter={mapCenter}
            />

            <div className="container" style={{ padding: '2rem 1rem', maxWidth: '600px', margin: '0 auto' }}>
                <button
                    onClick={() => navigate(-1)}
                    style={{
                        marginBottom: '1.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        color: 'white',
                        background: 'rgba(255,255,255,0.2)',
                        padding: '8px 16px',
                        borderRadius: '20px',
                        border: 'none',
                        cursor: 'pointer',
                        fontWeight: '600',
                        backdropFilter: 'blur(10px)'
                    }}
                >
                    <ChevronLeft size={20} /> Back
                </button>

                <div style={{
                    textAlign: 'center',
                    marginBottom: '2rem',
                    color: 'white'
                }}>
                    <h1 style={{
                        fontSize: '2rem',
                        fontWeight: '800',
                        marginBottom: '0.5rem',
                        textShadow: '0 2px 10px rgba(0,0,0,0.2)'
                    }}>
                        Add New Spot ✨
                    </h1>
                    <p style={{ opacity: 0.9, fontSize: '1rem' }}>
                        Share your favorite food spot with the community
                    </p>
                </div>

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
                                                padding: '12px 24px',
                                                borderRadius: '16px',
                                                border: formData.category === cat ? 'none' : '2px solid #f0f0f0',
                                                background: formData.category === cat ? 'linear-gradient(135deg, #FF6B6B 0%, #E23744 100%)' : 'white',
                                                color: formData.category === cat ? 'white' : '#666',
                                                fontWeight: '700',
                                                fontSize: '0.95rem',
                                                boxShadow: formData.category === cat ? '0 8px 16px rgba(226, 55, 68, 0.25)' : 'none',
                                                transform: formData.category === cat ? 'scale(1.05)' : 'scale(1)',
                                                transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                                            }}
                                        >
                                            {cat}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <Button type="button" onClick={handleNext} style={{
                                width: '100%', marginTop: '1.5rem',
                                background: 'linear-gradient(135deg, #FF6B6B 0%, #E23744 100%)',
                                color: 'white', padding: '16px', fontSize: '1.1rem',
                                borderRadius: '16px', boxShadow: '0 8px 16px rgba(226, 55, 68, 0.3)',
                                border: 'none'
                            }}>
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

                                <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                                    <button
                                        type="button"
                                        onClick={handleGetLocation}
                                        disabled={loading}
                                        style={{
                                            flex: 1,
                                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                                            padding: '14px 16px',
                                            background: 'white',
                                            color: 'var(--success)',
                                            borderRadius: '16px', fontWeight: '700', fontSize: '0.9rem',
                                            border: '2px solid #e0e0e0', cursor: loading ? 'not-allowed' : 'pointer',
                                            boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
                                        }}
                                    >
                                        {loading ? <Loader className="animate-spin" size={18} /> : <Crosshair size={18} />}
                                        Current Location
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setShowMapPicker(true)}
                                        style={{
                                            flex: 1,
                                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                                            padding: '14px 16px', background: 'white', color: '#4285F4',
                                            borderRadius: '16px', fontWeight: '700', fontSize: '0.9rem',
                                            border: '2px solid #e0e0e0', cursor: 'pointer',
                                            boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
                                        }}
                                    >
                                        <Map size={18} />
                                        Pin on Map
                                    </button>
                                </div>

                                <input
                                    type="text"
                                    placeholder="Type address..."
                                    value={formData.location_text}
                                    onChange={e => setFormData({ ...formData, location_text: e.target.value })}
                                    style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid #ddd', background: '#f9f9f9' }}
                                />

                                {formData.latitude && formData.longitude && (
                                    <p style={{ fontSize: '0.85rem', color: 'var(--success)', marginTop: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <Check size={16} />
                                        Location set: {formData.latitude.toFixed(4)}, {formData.longitude.toFixed(4)}
                                    </p>
                                )}
                            </div>

                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Price Level</label>
                                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                                    {[1, 2, 3].map(lvl => (
                                        <button
                                            key={lvl} type="button"
                                            onClick={() => setFormData({ ...formData, price: lvl })}
                                            style={{
                                                width: '60px', height: '60px',
                                                borderRadius: '20px',
                                                background: formData.price === lvl ? 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)' : 'white',
                                                color: formData.price === lvl ? 'white' : '#999',
                                                border: formData.price === lvl ? 'none' : '2px solid #f0f0f0',
                                                fontWeight: '800',
                                                fontSize: '1.2rem',
                                                boxShadow: formData.price === lvl ? '0 8px 16px rgba(245, 158, 11, 0.25)' : 'none',
                                                transform: formData.price === lvl ? 'translateY(-2px)' : 'none',
                                                transition: 'all 0.3s ease'
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
                                {formData.images.length < 5 ? (
                                    <label
                                        style={{
                                            border: '2px dashed #ddd',
                                            borderRadius: '16px',
                                            padding: '2rem 1rem',
                                            textAlign: 'center',
                                            display: 'block',
                                            cursor: 'pointer',
                                            background: uploading ? '#fafafa' : '#fff',
                                            transition: 'all 0.2s ease',
                                            opacity: uploading ? 0.6 : 1
                                        }}
                                    >
                                        {uploading ? <Loader className="animate-spin" style={{ margin: '0 auto' }} /> : <Upload size={32} color="var(--primary)" style={{ marginBottom: '10px', margin: '0 auto' }} />}
                                        <p style={{ fontWeight: '600', marginTop: '10px', color: 'var(--text-muted)' }}>
                                            {uploading ? 'Uploading...' : 'Tap to Upload (Max 5)'}
                                        </p>
                                        <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} disabled={uploading} />
                                    </label>
                                ) : (
                                    <p style={{ textAlign: 'center', color: 'var(--success)', background: '#ecfdf5', padding: '10px', borderRadius: '8px' }}>
                                        Maximum 5 images added. Good to go!
                                    </p>
                                )}
                            </div>

                            {/* Preview */}
                            {/* Preview Grid */}
                            {formData.images.length > 0 && (
                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(3, 1fr)',
                                    gap: '12px',
                                    marginBottom: '2rem'
                                }}>
                                    {formData.images.map((img, i) => (
                                        <div key={i} style={{ position: 'relative', paddingTop: '100%', borderRadius: '12px', overflow: 'hidden' }}>
                                            <img src={img} alt="preview" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                                            <button
                                                type="button"
                                                onClick={() => removeImage(i)}
                                                style={{
                                                    position: 'absolute', top: '4px', right: '4px',
                                                    background: 'rgba(0,0,0,0.6)', borderRadius: '50%',
                                                    padding: '4px', border: 'none', display: 'flex', color: 'white'
                                                }}
                                            >
                                                <CircleX size={14} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                <Button type="button" variant="secondary" onClick={handleBack} style={{ flex: 1, background: '#f0f0f0' }}>Back</Button>
                                <Button
                                    type="submit"
                                    disabled={loading}
                                    style={{
                                        flex: 2,
                                        background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                                        color: 'white', padding: '16px',
                                        borderRadius: '16px', boxShadow: '0 8px 16px rgba(16, 185, 129, 0.3)',
                                        border: 'none', fontSize: '1.1rem'
                                    }}
                                >
                                    {loading ? 'Saving...' : 'Submit Spot ✨'}
                                </Button>
                            </div>
                        </div>
                    )}

                </form>
            </div>
        </div>
    );
};

export default AddSpot;
