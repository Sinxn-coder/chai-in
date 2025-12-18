import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Upload, MapPin, Check, Loader, Crosshair, Map, XCircle } from 'lucide-react';
import Button from '../components/Button';
import Toast from '../components/Toast';
import MapPicker from '../components/MapPicker';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';

const EditSpot = ({ lang }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [showMapPicker, setShowMapPicker] = useState(false);
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

    useEffect(() => {
        if (!id) return;
        fetchSpot();
    }, [id]);

    const fetchSpot = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('spots')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            showToast("Failed to load spot data.", "error");
            setLoading(false);
            return;
        }

        setFormData({
            name: data.name,
            category: data.category || 'Cafe',
            price: data.price_level || 1,
            location_text: data.location_text,
            latitude: data.latitude,
            longitude: data.longitude,
            description: data.description || '',
            images: data.images || []
        });
        setLoading(false);
    };

    const handleNext = () => setStep(s => s + 1);
    const handleBack = () => setStep(s => s - 1);

    const showToast = (msg, type = 'success') => {
        setToast({ message: msg, type });
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setUploading(true);
        try {
            const fileName = `${Math.random()}.${file.name.split('.').pop()}`;
            const { error: uploadError } = await supabase.storage.from('food-images').upload(fileName, file);
            if (uploadError) throw uploadError;
            const { data } = supabase.storage.from('food-images').getPublicUrl(fileName);
            setFormData(prev => ({ ...prev, images: [...prev.images, data.publicUrl] }));
            showToast('Image uploaded!');
        } catch (error) {
            showToast("Upload failed.", 'error');
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) return showToast("Please login first", "error");
        setLoading(true);

        try {
            const { error } = await supabase.from('spot_edits').insert([{
                spot_id: id,
                user_id: user.id,
                data: formData, // JSONB
                status: 'pending'
            }]);

            if (error) throw error;

            showToast("Edit Suggestion Submitted! Admin will review.", 'success');
            setTimeout(() => navigate(`/${lang}/home`), 2000);
        } catch (error) {
            console.error(error);
            showToast("Failed to submit edit.", 'error');
            setLoading(false);
        }
    };

    if (loading && step === 1) return <div style={{ padding: '4rem', textAlign: 'center', color: 'white' }}>Loading spot details...</div>;

    return (
        <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', paddingBottom: '100px' }}>
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
            <MapPicker isOpen={showMapPicker} onClose={() => setShowMapPicker(false)} onSelectLocation={(lat, lng) => setFormData({ ...formData, latitude: lat, longitude: lng, location_text: `${lat.toFixed(4)}, ${lng.toFixed(4)}` })} />

            <div className="container" style={{ padding: '2rem 1rem', maxWidth: '600px', margin: '0 auto' }}>
                <button onClick={() => navigate(-1)} style={{ marginBottom: '1.5rem', background: 'rgba(255,255,255,0.1)', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '20px', cursor: 'pointer' }}>
                    <ChevronLeft size={20} style={{ verticalAlign: 'middle' }} /> Back
                </button>

                <div style={{ textAlign: 'center', marginBottom: '2rem', color: 'white' }}>
                    <h1 style={{ fontSize: '1.8rem', fontWeight: '800' }}>Suggest Changes ✨</h1>
                    <p style={{ opacity: 0.8 }}>Help keep {formData.name} info up to date</p>
                </div>

                <form onSubmit={handleSubmit} className="glass-card" style={{ padding: '2rem', background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}>

                    {step === 1 && (
                        <div className="animate-fade-in">
                            <h2 style={{ marginBottom: '1.5rem', fontSize: '1.1rem' }}>Step 1: Basic Info</h2>
                            <label style={{ display: 'block', marginBottom: '8px', opacity: 0.8 }}>Spot Name</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                style={{ width: '100%', padding: '14px', borderRadius: '12px', border: 'none', background: 'rgba(255,255,255,0.1)', color: 'white', marginBottom: '1.5rem' }}
                            />

                            <label style={{ display: 'block', marginBottom: '8px', opacity: 0.8 }}>Description</label>
                            <textarea
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                                style={{ width: '100%', padding: '14px', borderRadius: '12px', border: 'none', background: 'rgba(255,255,255,0.1)', color: 'white', minHeight: '120px' }}
                            />

                            <button type="button" onClick={handleNext} style={{ width: '100%', marginTop: '2rem', background: 'linear-gradient(135deg, #6366f1 0%, #4338ca 100%)', color: 'white', padding: '16px', borderRadius: '16px', border: 'none', fontWeight: '800', cursor: 'pointer' }}>
                                Next Step <ChevronRight size={18} />
                            </button>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="animate-fade-in">
                            <h2 style={{ marginBottom: '1.5rem', fontSize: '1.1rem' }}>Step 2: Location</h2>
                            <button type="button" onClick={() => setShowMapPicker(true)} style={{ width: '100%', padding: '14px', background: 'rgba(255,255,255,0.1)', color: 'white', border: '2px solid rgba(255,255,255,0.2)', borderRadius: '12px', cursor: 'pointer', marginBottom: '1rem', fontWeight: '700' }}>
                                <Map size={18} style={{ marginRight: '8px' }} /> Update Map Pin
                            </button>

                            <input
                                type="text"
                                placeholder="Address"
                                value={formData.location_text}
                                onChange={e => setFormData({ ...formData, location_text: e.target.value })}
                                style={{ width: '100%', padding: '14px', borderRadius: '12px', border: 'none', background: 'rgba(255,255,255,0.1)', color: 'white' }}
                            />

                            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                                <button type="button" onClick={handleBack} style={{ flex: 1, padding: '16px', borderRadius: '16px', background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: 'white', cursor: 'pointer' }}>Back</button>
                                <button type="submit" disabled={loading} style={{ flex: 2, padding: '16px', borderRadius: '16px', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: 'white', border: 'none', fontWeight: '800', cursor: 'pointer' }}>
                                    {loading ? 'Submitting...' : 'Submit Suggestion ✨'}
                                </button>
                            </div>
                        </div>
                    )}

                </form>
            </div>
        </div>
    );
};

export default EditSpot;
