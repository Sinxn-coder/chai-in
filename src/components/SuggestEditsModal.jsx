import React, { useState } from 'react';
import { X, Edit3, MapPin, Clock, Tag, DollarSign, FileText, Globe, Phone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SuggestEditsModal = ({ spot, onClose, onSubmit }) => {
    const [formData, setFormData] = useState({
        name: spot.name || '',
        description: spot.description || '',
        location_text: spot.location_text || '',
        opening_time: spot.opening_hours?.open || '10:00',
        closing_time: spot.opening_hours?.close || '22:00',
        tags: spot.tags ? spot.tags.join(', ') : '',
        price_level: spot.price_level || 1,
        category: spot.category || '',
        instagram_handle: spot.instagram_handle || '',
        whatsapp_number: spot.whatsapp_number || ''
    });
    
    const [submitting, setSubmitting] = useState(false);
    const [changes, setChanges] = useState({});

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        
        // Track what has changed
        if (field === 'opening_time' || field === 'closing_time') {
            // For opening hours, check if the combined opening_hours object has changed
            const currentHours = {
                open: spot.opening_hours?.open || '10:00',
                close: spot.opening_hours?.close || '22:00'
            };
            const newHours = {
                open: field === 'opening_time' ? value : formData.opening_time,
                close: field === 'closing_time' ? value : formData.closing_time
            };
            
            if (JSON.stringify(currentHours) !== JSON.stringify(newHours)) {
                setChanges(prev => ({ 
                    ...prev, 
                    opening_hours: { old: currentHours, new: newHours } 
                }));
            } else {
                setChanges(prev => {
                    const newChanges = { ...prev };
                    delete newChanges.opening_hours;
                    return newChanges;
                });
            }
        } else {
            // For other fields, check direct comparison
            if (value !== spot[field]) {
                setChanges(prev => ({ ...prev, [field]: { old: spot[field], new: value } }));
            } else {
                setChanges(prev => {
                    const newChanges = { ...prev };
                    delete newChanges[field];
                    return newChanges;
                });
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (Object.keys(changes).length === 0) {
            alert('Please make at least one change to suggest edits');
            return;
        }

        setSubmitting(true);
        try {
            // Prepare the suggested data, including opening_hours as an object
            const suggestedData = {
                ...formData,
                opening_hours: {
                    open: formData.opening_time,
                    close: formData.closing_time
                }
            };
            
            await onSubmit({
                spot_id: spot.id,
                suggested_changes: changes,
                original_data: spot,
                suggested_data: suggestedData
            });
            onClose();
        } catch (error) {
            console.error('Error submitting edits:', error);
            alert('Failed to submit edits. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const renderField = (field, label, icon, type = 'text', placeholder = '') => (
        <div style={{ marginBottom: '16px' }}>
            <label style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px', 
                marginBottom: '8px',
                fontSize: '0.9rem',
                fontWeight: '600',
                color: 'var(--text-main)'
            }}>
                {icon}
                {label}
            </label>
            {type === 'textarea' ? (
                <textarea
                    value={formData[field]}
                    onChange={(e) => handleChange(field, e.target.value)}
                    placeholder={placeholder}
                    style={{
                        width: '100%',
                        padding: '12px',
                        border: '2px solid #e5e7eb',
                        borderRadius: '12px',
                        fontSize: '0.9rem',
                        resize: 'vertical',
                        minHeight: '80px',
                        fontFamily: 'inherit'
                    }}
                />
            ) : (
                <input
                    type={type}
                    value={formData[field]}
                    onChange={(e) => handleChange(field, e.target.value)}
                    placeholder={placeholder}
                    style={{
                        width: '100%',
                        padding: '12px',
                        border: '2px solid #e5e7eb',
                        borderRadius: '12px',
                        fontSize: '0.9rem',
                        fontFamily: 'inherit'
                    }}
                />
            )}
        </div>
    );

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            zIndex: 1000
        }}>
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                style={{
                    background: 'white',
                    borderRadius: '20px',
                    width: '100%',
                    maxWidth: '600px',
                    maxHeight: '90vh',
                    overflow: 'auto',
                    position: 'relative'
                }}
            >
                {/* Header */}
                <div style={{
                    padding: '24px',
                    borderBottom: '1px solid #e5e7eb',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <Edit3 size={24} color="var(--primary)" />
                        <div>
                            <h2 style={{ margin: 0, fontSize: '1.3rem', color: 'var(--text-main)' }}>
                                Suggest Edits
                            </h2>
                            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                {spot.name}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            padding: '8px',
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        <X size={20} color="var(--text-muted)" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} style={{ padding: '24px' }}>
                    <div style={{ marginBottom: '20px', padding: '12px', background: '#fef3c7', borderRadius: '12px', border: '1px solid #fbbf24' }}>
                        <p style={{ margin: 0, fontSize: '0.85rem', color: '#92400e', fontWeight: '600' }}>
                            💡 Only fill in the fields you want to edit. Empty fields will be ignored.
                        </p>
                    </div>

                    {renderField('name', 'Spot Name', <MapPin size={16} />, 'text', 'Enter spot name')}
                    {renderField('description', 'Description', <FileText size={16} />, 'textarea', 'Describe the spot...')}
                    {renderField('location_text', 'Location', <MapPin size={16} />, 'text', 'Enter location details')}

                    {/* Opening Hours - like AddSpot */}
                    <div style={{ marginBottom: '16px' }}>
                        <label style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '8px', 
                            marginBottom: '8px',
                            fontSize: '0.9rem',
                            fontWeight: '600',
                            color: 'var(--text-main)'
                        }}>
                            <Clock size={16} />
                            Opening Hours
                        </label>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
                                <label style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-muted)' }}>Opening</label>
                                <input 
                                    type="time" 
                                    value={formData.opening_time} 
                                    onChange={e => handleChange('opening_time', e.target.value)}
                                    style={{ 
                                        padding: '12px', 
                                        borderRadius: '14px', 
                                        background: 'var(--secondary)', 
                                        border: 'none', 
                                        fontWeight: '700',
                                        width: '100%'
                                    }} 
                                />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
                                <label style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-muted)' }}>Closing</label>
                                <input 
                                    type="time" 
                                    value={formData.closing_time} 
                                    onChange={e => handleChange('closing_time', e.target.value)}
                                    style={{ 
                                        padding: '12px', 
                                        borderRadius: '14px', 
                                        background: 'var(--secondary)', 
                                        border: 'none', 
                                        fontWeight: '700',
                                        width: '100%'
                                    }} 
                                />
                            </div>
                        </div>
                    </div>

                    {renderField('tags', 'Tags', <Tag size={16} />, 'text', 'e.g., biryani, tea, snacks (comma separated)')}
                    {renderField('instagram_handle', 'Instagram', <Globe size={16} />, 'text', '@username')}
                    {renderField('whatsapp_number', 'WhatsApp', <Phone size={16} />, 'tel', 'Enter WhatsApp number')}

                    <div style={{ marginBottom: '16px' }}>
                        <label style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '8px', 
                            marginBottom: '8px',
                            fontSize: '0.9rem',
                            fontWeight: '600',
                            color: 'var(--text-main)'
                        }}>
                            <DollarSign size={16} />
                            Price Level
                        </label>
                        <select
                            value={formData.price_level}
                            onChange={(e) => handleChange('price_level', parseInt(e.target.value))}
                            style={{
                                width: '100%',
                                padding: '12px',
                                border: '2px solid #e5e7eb',
                                borderRadius: '12px',
                                fontSize: '0.9rem',
                                fontFamily: 'inherit'
                            }}
                        >
                            <option value={1}>₹50-150 (Budget)</option>
                            <option value={2}>₹150-300 (Moderate)</option>
                            <option value={3}>₹300-600 (Expensive)</option>
                            <option value={4}>₹600+ (Premium)</option>
                        </select>
                    </div>

                    <div style={{ marginBottom: '16px' }}>
                        <label style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '8px', 
                            marginBottom: '8px',
                            fontSize: '0.9rem',
                            fontWeight: '600',
                            color: 'var(--text-main)'
                        }}>
                            <Tag size={16} />
                            Category
                        </label>
                        <select
                            value={formData.category}
                            onChange={(e) => handleChange('category', e.target.value)}
                            style={{
                                width: '100%',
                                padding: '12px',
                                border: '2px solid #e5e7eb',
                                borderRadius: '12px',
                                fontSize: '0.9rem',
                                fontFamily: 'inherit'
                            }}
                        >
                            <option value="">Select Category</option>
                            <option value="restaurant">Restaurant</option>
                            <option value="cafe">Cafe</option>
                            <option value="tea_shop">Tea Shop</option>
                            <option value="bakery">Bakery</option>
                            <option value="juice_bar">Juice Bar</option>
                            <option value="street_food">Street Food</option>
                            <option value="fast_food">Fast Food</option>
                            <option value="dessert">Dessert</option>
                        </select>
                    </div>

                    {/* Changes Summary */}
                    {Object.keys(changes).length > 0 && (
                        <div style={{ marginBottom: '20px', padding: '16px', background: '#f0fdf4', borderRadius: '12px', border: '1px solid #86efac' }}>
                            <h4 style={{ margin: '0 0 12px 0', fontSize: '0.9rem', color: '#166534', fontWeight: '600' }}>
                                📝 Changes Summary ({Object.keys(changes).length} changes)
                            </h4>
                            {Object.entries(changes).map(([field, { old, new: newValue }]) => (
                                <div key={field} style={{ marginBottom: '8px', fontSize: '0.85rem', color: '#166534' }}>
                                    <strong>{field}:</strong> {field === 'opening_hours' ? 
                                        `"${old?.open || '10:00'} - ${old?.close || '22:00'}" → "${newValue?.open || '10:00'} - ${newValue?.close || '22:00'}"` :
                                        `"${old}" → "${newValue}"`
                                    }
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Submit Button */}
                    <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                        <button
                            type="button"
                            onClick={onClose}
                            style={{
                                padding: '12px 24px',
                                border: '2px solid #e5e7eb',
                                background: 'white',
                                borderRadius: '12px',
                                fontSize: '0.9rem',
                                fontWeight: '600',
                                cursor: 'pointer',
                                color: 'var(--text-main)'
                            }}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={submitting || Object.keys(changes).length === 0}
                            style={{
                                padding: '12px 24px',
                                border: 'none',
                                background: 'var(--primary)',
                                color: 'white',
                                borderRadius: '12px',
                                fontSize: '0.9rem',
                                fontWeight: '600',
                                cursor: submitting ? 'not-allowed' : 'pointer',
                                opacity: (submitting || Object.keys(changes).length === 0) ? 0.6 : 1
                            }}
                        >
                            {submitting ? 'Submitting...' : `Submit ${Object.keys(changes).length} Changes`}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default SuggestEditsModal;
