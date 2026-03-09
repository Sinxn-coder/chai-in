import React, { useState, useMemo } from 'react';
import {
    Search,
    Filter,
    MapPin,
    Star,
    ChevronRight,
    MoreVertical,
    X,
    Phone,
    MessageCircle,
    Instagram,
    Map,
    Plus,
    Clock,
    ArrowRight,
    ExternalLink,
    Calendar,
    MessageSquare,
    TrendingUp,
    RotateCw,
    CheckCircle,
    AlertTriangle,
    Edit,
    Trash2,
    Eye,
    Ban,
    ShieldCheck
} from 'lucide-react';

export default function SpotsMobile({ spots, loading, onRefresh }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeFilter, setActiveFilter] = useState('all');
    const [viewingSpot, setViewingSpot] = useState(null);
    const [editingSpot, setEditingSpot] = useState(null);
    const [showFilterDrawer, setShowFilterDrawer] = useState(false);
    const [activeSpotDropdown, setActiveSpotDropdown] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [spotToDelete, setSpotToDelete] = useState(null);

    // Update spot status in Supabase (shared logic with Desktop)
    const handleSpotStatusChange = async (spot, newStatus) => {
        try {
            const { supabase } = await import('./supabase');
            const dbStatus = newStatus === 'verified' ? 'approved' : newStatus === 'flagged' ? 'rejected' : newStatus;
            const isVerified = newStatus === 'verified';
            const { error } = await supabase.from('spots').update({ status: dbStatus, is_verified: isVerified }).eq('id', spot.id);
            if (error) throw error;
            onRefresh();
        } catch (err) {
            console.error('Failed to update spot status:', err);
        }
        setActiveSpotDropdown(null);
    };

    const handleDeleteSpot = async () => {
        if (!spotToDelete) return;
        try {
            const { supabase } = await import('./supabase');
            const { error } = await supabase.from('spots').delete().eq('id', spotToDelete.id);
            if (error) throw error;
            onRefresh();
        } catch (err) {
            console.error('Failed to delete spot:', err);
        }
        setShowDeleteConfirm(false);
        setSpotToDelete(null);
    };

    const filteredSpots = useMemo(() => {
        return spots.filter(spot => {
            const name = (spot.name || '').toLowerCase();
            const city = (spot.city || '').toLowerCase();
            const term = searchTerm.toLowerCase();
            const matchesSearch = name.includes(term) || city.includes(term);
            const matchesStatus = activeFilter === 'all' || spot.status === activeFilter;
            return matchesSearch && matchesStatus;
        });
    }, [spots, searchTerm, activeFilter]);

    if (loading) {
        return (
            <div className="mobile-loading-state">
                <RotateCw size={32} className="animate-spin" />
                <p>Fetching amazing spots...</p>
            </div>
        );
    }

    return (
        <div className="mobile-admin-spots">
            {/* Mobile Sticky Header */}
            <div className="mobile-view-header sticky top-0 bg-white z-10 p-4 border-b">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold">Manage Spots</h2>
                    <button className="refresh-btn-mobile" onClick={onRefresh}>
                        <RotateCw size={18} />
                    </button>
                </div>

                <div className="mobile-search-filter-row">
                    <div className="mobile-search-box flex-grow">
                        <Search size={18} className="search-icon" />
                        <input
                            type="text"
                            placeholder="Search by name or city..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button className="mobile-filter-btn" onClick={() => setShowFilterDrawer(true)}>
                        <Filter size={18} />
                    </button>
                </div>
            </div>

            {/* Spots List */}
            <div className="mobile-spots-list p-4 pb-20">
                {filteredSpots.length === 0 ? (
                    <div className="no-users-state">
                        <MapPin size={48} />
                        <h3>No spots found</h3>
                        <p>Try adjusting your search or filters</p>
                    </div>
                ) : (
                    filteredSpots.map(spot => (
                        <div key={spot.id} className="mobile-spot-card" onClick={() => setViewingSpot(spot)}>
                            <div className="spot-card-top">
                                <div className="spot-main-info">
                                    <h4 className="spot-name">{spot.name}</h4>
                                    <p className="spot-category">{spot.category}</p>
                                </div>
                                <div className={`status-tag-mobile ${spot.status}`}>
                                    {spot.status === 'verified' ? <CheckCircle size={12} /> :
                                        spot.status === 'flagged' ? <AlertTriangle size={12} /> : <Clock size={12} />}
                                    <span>{spot.status.toUpperCase()}</span>
                                </div>
                            </div>

                            <div className="spot-card-stats">
                                <div className="stat-pill">
                                    <Star size={14} fill="#ffb800" color="#ffb800" />
                                    <span>{spot.rating || 0}</span>
                                </div>
                                <div className="stat-pill">
                                    <MessageSquare size={14} />
                                    <span>{spot.review_count || 0}</span>
                                </div>
                                <div className="location-pill ml-auto">
                                    <MapPin size={14} />
                                    <span>{spot.city || 'N/A'}</span>
                                </div>
                            </div>

                            <div className="card-footer-mobile pt-3 border-t flex items-center justify-between">
                                <div className="flex gap-2">
                                    <button
                                        className="mobile-action-pill view"
                                        onClick={(e) => { e.stopPropagation(); setViewingSpot(spot); }}
                                    >
                                        <Eye size={14} /> View
                                    </button>
                                    <button
                                        className="mobile-action-pill edit"
                                        onClick={(e) => { e.stopPropagation(); setEditingSpot(spot); }}
                                    >
                                        <Edit size={14} />
                                    </button>
                                </div>
                                <div className="relative">
                                    <button
                                        className="mobile-action-more"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setActiveSpotDropdown(activeSpotDropdown === spot.id ? null : spot.id);
                                        }}
                                    >
                                        <MoreVertical size={20} />
                                    </button>

                                    {activeSpotDropdown === spot.id && (
                                        <div className="mobile-action-dropdown animation-scale-in" onClick={e => e.stopPropagation()}>
                                            {spot.latitude && spot.longitude && (
                                                <button className="dropdown-item" onClick={() => {
                                                    window.open(`https://www.google.com/maps/search/?api=1&query=${spot.latitude},${spot.longitude}`, '_blank');
                                                    setActiveSpotDropdown(null);
                                                }}>
                                                    <Map size={16} /> Open Map
                                                </button>
                                            )}

                                            {(spot.status === 'pending' || spot.status === 'flagged' || spot.status === 'rejected') && (
                                                <button className="dropdown-item success" onClick={() => handleSpotStatusChange(spot, 'verified')}>
                                                    <CheckCircle size={16} /> Verify Spot
                                                </button>
                                            )}

                                            {(spot.status === 'verified' || spot.status === 'approved' || spot.status === 'pending') && (
                                                <button className="dropdown-item warning" onClick={() => handleSpotStatusChange(spot, 'flagged')}>
                                                    <Ban size={16} /> Ban Spot
                                                </button>
                                            )}

                                            <button className="dropdown-item danger" onClick={() => {
                                                setSpotToDelete(spot);
                                                setShowDeleteConfirm(true);
                                                setActiveSpotDropdown(null);
                                            }}>
                                                <Trash2 size={16} /> Delete
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Delete Modal */}
            {showDeleteConfirm && (
                <div className="mobile-drawer-overlay" onClick={() => setShowDeleteConfirm(false)}>
                    <div className="mobile-drawer-mount animation-slide-up" onClick={e => e.stopPropagation()}>
                        <div className="drawer-handle"></div>
                        <div className="p-6 text-center">
                            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Trash2 size={32} />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Delete Spot?</h3>
                            <p className="text-gray-500 mb-8">This action cannot be undone. Are you sure you want to remove "{spotToDelete?.name}"?</p>
                            <div className="flex flex-col gap-3">
                                <button className="w-100 py-3 bg-red-600 text-white rounded-xl font-bold" onClick={handleDeleteSpot}>Delete Forever</button>
                                <button className="w-100 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold" onClick={() => setShowDeleteConfirm(false)}>Cancel</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Spot FAB */}
            <button className="mobile-fab">
                <Plus size={24} />
            </button>

            {/* Filter Drawer Overlay */}
            {showFilterDrawer && (
                <div className="mobile-drawer-overlay" onClick={() => setShowFilterDrawer(false)}>
                    <div className="mobile-drawer-mount animation-slide-up" onClick={e => e.stopPropagation()}>
                        <div className="drawer-handle"></div>
                        <div className="drawer-header">
                            <h3>Filter Spots</h3>
                            <button onClick={() => setShowFilterDrawer(false)}><X size={20} /></button>
                        </div>
                        <div className="drawer-content p-4">
                            <p className="filter-label">Status</p>
                            <div className="filter-options-grid">
                                {['all', 'verified', 'pending', 'flagged'].map(status => (
                                    <button
                                        key={status}
                                        className={`filter-opt-btn ${activeFilter === status ? 'active' : ''}`}
                                        onClick={() => { setActiveFilter(status); setShowFilterDrawer(false); }}
                                    >
                                        {status.charAt(0).toUpperCase() + status.slice(1)}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Immersive Side Panel / Detail View */}
            {viewingSpot && (
                <div className="mobile-detail-overlay">
                    <div className="mobile-detail-panel animation-slide-left">
                        <div className="detail-panel-header">
                            <button className="back-btn" onClick={() => setViewingSpot(null)}>
                                <X size={24} />
                            </button>
                            <div className="panel-actions flex gap-2">
                                <button className="panel-action-btn"><Edit size={20} /></button>
                                <button className="panel-action-btn delete"><Trash2 size={20} /></button>
                            </div>
                        </div>

                        <div className="panel-hero pt-4 pb-8 px-6 text-center">
                            <div className="panel-avatar mx-auto mb-4 bg-indigo-600 w-20 h-20 rounded-2xl flex items-center justify-center shadow-lg">
                                <MapPin size={40} color="white" />
                            </div>
                            <h2 className="text-2xl font-bold mb-1">{viewingSpot.name}</h2>
                            <p className="text-gray-500 mb-4">{viewingSpot.category} in {viewingSpot.city}</p>

                            <div className={`status-pill-large mx-auto pill-${viewingSpot.status}`}>
                                {viewingSpot.status.toUpperCase()}
                            </div>
                        </div>

                        <div className="panel-content px-6 pb-20">
                            <div className="stats-bento mb-8">
                                <div className="bento-item">
                                    <Star size={20} className="text-orange-500" />
                                    <h4>{viewingSpot.rating}</h4>
                                    <p>Rating</p>
                                </div>
                                <div className="bento-item">
                                    <MessageSquare size={20} className="text-blue-500" />
                                    <h4>{viewingSpot.review_count}</h4>
                                    <p>Reviews</p>
                                </div>
                                <div className="bento-item">
                                    <Calendar size={20} className="text-purple-500" />
                                    <h4>{viewingSpot.created_at ? new Date(viewingSpot.created_at).toLocaleDateString(undefined, { month: 'short', year: '2-digit' }) : 'N/A'}</h4>
                                    <p>Added</p>
                                </div>
                            </div>

                            <div className="info-group-mobile">
                                <h3>Contact & Social</h3>
                                <div className="info-card-mobile">
                                    <div className="info-row">
                                        <Phone size={18} />
                                        <span>{viewingSpot.phone || 'No phone added'}</span>
                                    </div>
                                    <div className="info-row">
                                        <Instagram size={18} />
                                        <span>@{viewingSpot.instagram || 'No handle'}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="info-group-mobile mt-6">
                                <h3>Location Details</h3>
                                <div className="info-card-mobile location">
                                    <p className="text-sm text-gray-400 mb-2">OPERATING CITY</p>
                                    <p className="text-lg font-semibold mb-6">{viewingSpot.city || 'N/A'}</p>

                                    {viewingSpot.latitude && (
                                        <button
                                            className="mobile-maps-btn"
                                            onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${viewingSpot.latitude},${viewingSpot.longitude}`, '_blank')}
                                        >
                                            <Map size={20} />
                                            <span>Launch in Google Maps</span>
                                            <ExternalLink size={16} />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
