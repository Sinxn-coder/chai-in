import React, { useState, useEffect } from 'react';
import { Check, X, Eye, Edit3, Clock, User, MapPin, Phone, Globe, Tag, DollarSign, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ModerationTab = ({ showToast }) => {
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedSuggestion, setSelectedSuggestion] = useState(null);
    const [processing, setProcessing] = useState({});

    useEffect(() => {
        fetchSuggestions();
    }, []);

    const fetchSuggestions = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('spot_edit_suggestions')
                .select(`
                    *,
                    spots:spot_id(name, location_text, category),
                    user:user_id(email, user_metadata)
                `)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setSuggestions(data || []);
        } catch (error) {
            console.error('Error fetching suggestions:', error);
            showToast('Failed to load suggestions', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (suggestionId, applyChanges = false) => {
        setProcessing(prev => ({ ...prev, [suggestionId]: true }));
        
        try {
            const suggestion = suggestions.find(s => s.id === suggestionId);
            
            if (applyChanges && suggestion) {
                // Apply the suggested changes to the spot
                const { error: updateError } = await supabase
                    .from('spots')
                    .update(suggestion.suggested_data)
                    .eq('id', suggestion.spot_id);

                if (updateError) throw updateError;
            }

            // Update suggestion status
            const { error: statusError } = await supabase
                .from('spot_edit_suggestions')
                .update({ 
                    status: 'approved',
                    reviewed_by: (await supabase.auth.getUser()).data.user.id,
                    reviewed_at: new Date().toISOString()
                })
                .eq('id', suggestionId);

            if (statusError) throw statusError;

            showToast(`Suggestion ${applyChanges ? 'approved and applied' : 'approved'}!`, 'success');
            fetchSuggestions();
            setSelectedSuggestion(null);
        } catch (error) {
            console.error('Error approving suggestion:', error);
            showToast('Failed to approve suggestion', 'error');
        } finally {
            setProcessing(prev => ({ ...prev, [suggestionId]: false }));
        }
    };

    const handleReject = async (suggestionId, notes = '') => {
        setProcessing(prev => ({ ...prev, [suggestionId]: true }));
        
        try {
            const { error } = await supabase
                .from('spot_edit_suggestions')
                .update({ 
                    status: 'rejected',
                    admin_notes: notes,
                    reviewed_by: (await supabase.auth.getUser()).data.user.id,
                    reviewed_at: new Date().toISOString()
                })
                .eq('id', suggestionId);

            if (error) throw error;

            showToast('Suggestion rejected', 'success');
            fetchSuggestions();
            setSelectedSuggestion(null);
        } catch (error) {
            console.error('Error rejecting suggestion:', error);
            showToast('Failed to reject suggestion', 'error');
        } finally {
            setProcessing(prev => ({ ...prev, [suggestionId]: false }));
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return '#f59e0b';
            case 'approved': return '#10b981';
            case 'rejected': return '#ef4444';
            default: return '#6b7280';
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const renderChangeDetail = (field, oldValue, newValue) => {
        const fieldIcons = {
            name: <MapPin size={14} />,
            description: <FileText size={14} />,
            location_text: <MapPin size={14} />,
            phone: <Phone size={14} />,
            website: <Globe size={14} />,
            opening_hours: <Clock size={14} />,
            tags: <Tag size={14} />,
            price_level: <DollarSign size={14} />,
            category: <Tag size={14} />,
            instagram_handle: <Globe size={14} />,
            whatsapp_number: <Phone size={14} />
        };

        return (
            <div style={{
                padding: '12px',
                background: '#f8f9fa',
                borderRadius: '8px',
                marginBottom: '8px'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    {fieldIcons[field] || <Edit3 size={14} />}
                    <strong style={{ textTransform: 'capitalize', color: '#374151' }}>
                        {field.replace(/_/g, ' ')}
                    </strong>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.85rem' }}>
                    <div style={{ color: '#ef4444' }}>
                        <span style={{ fontWeight: '600' }}>From:</span> {oldValue || '(empty)'}
                    </div>
                    <div style={{ color: '#10b981' }}>
                        <span style={{ fontWeight: '600' }}>To:</span> {newValue || '(empty)'}
                    </div>
                </div>
            </div>
        );
    };

    if (loading) {
        return <div style={{ padding: '20px', textAlign: 'center' }}>Loading suggestions...</div>;
    }

    return (
        <div style={{ padding: '20px' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '900', marginBottom: '20px' }}>
                Edit Suggestions ({suggestions.filter(s => s.status === 'pending').length} pending)
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                {/* Suggestions List */}
                <div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '16px' }}>
                        All Suggestions
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {suggestions.map(suggestion => (
                            <motion.div
                                key={suggestion.id}
                                whileHover={{ scale: 1.02 }}
                                onClick={() => setSelectedSuggestion(suggestion)}
                                style={{
                                    padding: '16px',
                                    background: 'white',
                                    borderRadius: '12px',
                                    border: `2px solid ${getStatusColor(suggestion.status)}`,
                                    cursor: 'pointer',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                                }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                                    <div>
                                        <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: '800', color: '#1f2937' }}>
                                            {suggestion.spots?.name || 'Unknown Spot'}
                                        </h4>
                                        <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: '#6b7280' }}>
                                            by {suggestion.user?.user_metadata?.full_name || suggestion.user?.email}
                                        </p>
                                    </div>
                                    <div style={{
                                        padding: '4px 8px',
                                        borderRadius: '6px',
                                        background: getStatusColor(suggestion.status),
                                        color: 'white',
                                        fontSize: '0.75rem',
                                        fontWeight: '600',
                                        textTransform: 'uppercase'
                                    }}>
                                        {suggestion.status}
                                    </div>
                                </div>
                                
                                <div style={{ fontSize: '0.85rem', color: '#374151', marginBottom: '8px' }}>
                                    {Object.keys(suggestion.suggested_changes || {}).length} changes suggested
                                </div>
                                
                                <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                                    {formatDate(suggestion.created_at)}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Suggestion Details */}
                <div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '16px' }}>
                        Suggestion Details
                    </h3>
                    
                    <AnimatePresence>
                        {selectedSuggestion ? (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                style={{
                                    padding: '20px',
                                    background: 'white',
                                    borderRadius: '16px',
                                    border: '2px solid #e5e7eb',
                                    boxShadow: '0 4px 16px rgba(0,0,0,0.1)'
                                }}
                            >
                                <div style={{ marginBottom: '20px' }}>
                                    <h4 style={{ margin: '0 0 8px 0', fontSize: '1.1rem', fontWeight: '800', color: '#1f2937' }}>
                                        {selectedSuggestion.spots?.name || 'Unknown Spot'}
                                    </h4>
                                    <div style={{ display: 'flex', gap: '16px', fontSize: '0.85rem', color: '#6b7280' }}>
                                        <span>
                                            <User size={14} style={{ display: 'inline', marginRight: '4px' }} />
                                            {selectedSuggestion.user?.user_metadata?.full_name || selectedSuggestion.user?.email}
                                        </span>
                                        <span>
                                            <Clock size={14} style={{ display: 'inline', marginRight: '4px' }} />
                                            {formatDate(selectedSuggestion.created_at)}
                                        </span>
                                    </div>
                                </div>

                                <div style={{ marginBottom: '20px' }}>
                                    <h5 style={{ margin: '0 0 12px 0', fontSize: '0.95rem', fontWeight: '700', color: '#374151' }}>
                                        Proposed Changes ({Object.keys(selectedSuggestion.suggested_changes || {}).length})
                                    </h5>
                                    {Object.entries(selectedSuggestion.suggested_changes || {}).map(([field, { old: oldValue, new: newValue }]) => (
                                        renderChangeDetail(field, oldValue, newValue)
                                    ))}
                                </div>

                                {selectedSuggestion.status === 'pending' && (
                                    <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                                        <button
                                            onClick={() => handleReject(selectedSuggestion.id)}
                                            disabled={processing[selectedSuggestion.id]}
                                            style={{
                                                padding: '10px 16px',
                                                border: 'none',
                                                background: '#ef4444',
                                                color: 'white',
                                                borderRadius: '8px',
                                                fontWeight: '600',
                                                cursor: processing[selectedSuggestion.id] ? 'not-allowed' : 'pointer',
                                                opacity: processing[selectedSuggestion.id] ? 0.6 : 1,
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '6px'
                                            }}
                                        >
                                            <X size={16} />
                                            {processing[selectedSuggestion.id] ? 'Processing...' : 'Reject'}
                                        </button>
                                        
                                        <button
                                            onClick={() => handleApprove(selectedSuggestion.id, false)}
                                            disabled={processing[selectedSuggestion.id]}
                                            style={{
                                                padding: '10px 16px',
                                                border: 'none',
                                                background: '#3b82f6',
                                                color: 'white',
                                                borderRadius: '8px',
                                                fontWeight: '600',
                                                cursor: processing[selectedSuggestion.id] ? 'not-allowed' : 'pointer',
                                                opacity: processing[selectedSuggestion.id] ? 0.6 : 1,
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '6px'
                                            }}
                                        >
                                            <Check size={16} />
                                            {processing[selectedSuggestion.id] ? 'Processing...' : 'Approve'}
                                        </button>
                                        
                                        <button
                                            onClick={() => handleApprove(selectedSuggestion.id, true)}
                                            disabled={processing[selectedSuggestion.id]}
                                            style={{
                                                padding: '10px 16px',
                                                border: 'none',
                                                background: '#10b981',
                                                color: 'white',
                                                borderRadius: '8px',
                                                fontWeight: '600',
                                                cursor: processing[selectedSuggestion.id] ? 'not-allowed' : 'pointer',
                                                opacity: processing[selectedSuggestion.id] ? 0.6 : 1,
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '6px'
                                            }}
                                        >
                                            <Check size={16} />
                                            {processing[selectedSuggestion.id] ? 'Processing...' : 'Apply & Approve'}
                                        </button>
                                    </div>
                                )}

                                {selectedSuggestion.status !== 'pending' && (
                                    <div style={{
                                        padding: '12px',
                                        background: selectedSuggestion.status === 'approved' ? '#f0fdf4' : '#fef2f2',
                                        borderRadius: '8px',
                                        border: `1px solid ${selectedSuggestion.status === 'approved' ? '#86efac' : '#fca5a5'}`
                                    }}>
                                        <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: '600', color: selectedSuggestion.status === 'approved' ? '#166534' : '#991b1b' }}>
                                            {selectedSuggestion.status === 'approved' ? '✅ Approved' : '❌ Rejected'}
                                        </p>
                                        {selectedSuggestion.admin_notes && (
                                            <p style={{ margin: '8px 0 0 0', fontSize: '0.8rem', color: '#6b7280' }}>
                                                Notes: {selectedSuggestion.admin_notes}
                                            </p>
                                        )}
                                        {selectedSuggestion.reviewed_at && (
                                            <p style={{ margin: '8px 0 0 0', fontSize: '0.75rem', color: '#9ca3af' }}>
                                                Reviewed: {formatDate(selectedSuggestion.reviewed_at)}
                                            </p>
                                        )}
                                    </div>
                                )}
                            </motion.div>
                        ) : (
                            <div style={{
                                padding: '40px',
                                textAlign: 'center',
                                color: '#9ca3af',
                                background: '#f9fafb',
                                borderRadius: '12px',
                                border: '2px dashed #e5e7eb'
                            }}>
                                <Eye size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
                                <p>Select a suggestion to view details</p>
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default ModerationTab;
