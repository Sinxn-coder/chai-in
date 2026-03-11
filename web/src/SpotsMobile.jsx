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
    ClipboardList,
    ChevronLeft
} from 'lucide-react';

export default function SpotsMobile({ spots, loading, onRefresh }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeFilter, setActiveFilter] = useState('all');
    const [viewingSpot, setViewingSpot] = useState(null);
    const [viewingSuggestionsSpot, setViewingSuggestionsSpot] = useState(null);
    const [showFilterDrawer, setShowFilterDrawer] = useState(false);

    // Image Gallery State
    const [showGallery, setShowGallery] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

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
                                {spot.suggestion_count > 0 && (
                                    <div 
                                        className="suggestion-count-tag-mobile"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setViewingSuggestionsSpot(spot);
                                        }}
                                    >
                                        <ClipboardList size={10} />
                                        <span>{spot.suggestion_count}</span>
                                    </div>
                                )}
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

                            <div className="card-footer-mobile">
                                <span className="spot-id">#SPT{String(spot.id).slice(0, 6).toUpperCase()}</span>
                                <ChevronRight size={18} className="text-gray-400" />
                            </div>
                        </div>
                    ))
                )}
            </div>

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
                                {viewingSpot.suggestion_count > 0 && (
                                    <div 
                                        className="bento-item suggestions-item"
                                        onClick={() => setViewingSuggestionsSpot(viewingSpot)}
                                    >
                                        <ClipboardList size={20} className="text-purple-600" />
                                        <h4>{viewingSpot.suggestion_count}</h4>
                                        <p>Suggestions</p>
                                    </div>
                                )}
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

                            {viewingSpot.images && viewingSpot.images.length > 0 && (
                                <div className="info-group-mobile mt-6">
                                    <h3>Gallery</h3>
                                    <button
                                        className="view-gallery-action-btn"
                                        onClick={() => {
                                            setCurrentImageIndex(0);
                                            setShowGallery(true);
                                        }}
                                    >
                                        <Eye size={18} />
                                        View Spot Photos ({viewingSpot.images.length})
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {showGallery && (
                <div className="image-gallery-overlay" onClick={() => setShowGallery(false)} style={{ zIndex: 1100 }}>
                    <div className="image-gallery-container" onClick={e => e.stopPropagation()} style={{ width: '95%', height: '70%' }}>
                        <button className="gallery-close-btn" onClick={() => setShowGallery(false)} style={{ top: '-40px' }}>
                            <X size={20} />
                        </button>

                        <div className="gallery-main-display">
                            {viewingSpot.images.length > 1 && (
                                <button
                                    className="gallery-nav-btn prev"
                                    onClick={() => setCurrentImageIndex(prev => prev > 0 ? prev - 1 : viewingSpot.images.length - 1)}
                                    style={{ width: '44px', height: '44px', left: '-10px' }}
                                >
                                    <ChevronLeft size={24} />
                                </button>
                            )}

                            <img
                                src={viewingSpot.images[currentImageIndex]}
                                alt="Spot"
                                className="gallery-main-image"
                            />

                            {viewingSpot.images.length > 1 && (
                                <button
                                    className="gallery-nav-btn next"
                                    onClick={() => setCurrentImageIndex(prev => prev < viewingSpot.images.length - 1 ? prev + 1 : 0)}
                                    style={{ width: '44px', height: '44px', right: '-10px' }}
                                >
                                    <ChevronRight size={24} />
                                </button>
                            )}
                        </div>

                        <div className="gallery-counter">
                            {currentImageIndex + 1} / {viewingSpot.images.length}
                        </div>
                    </div>
                </div>
            )}

            {viewingSuggestionsSpot && (
                <SpotSuggestionsModal
                    spot={viewingSuggestionsSpot}
                    onClose={() => setViewingSuggestionsSpot(null)}
                    onRefresh={onRefresh}
                />
            )}
        </div>
    );
}

const SpotSuggestionsModal = ({ spot, onClose, onRefresh }) => {
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSuggestions = async () => {
            try {
                const { supabase } = await import('./supabase');
                const { data, error } = await supabase
                    .from('spot_suggestions')
                    .select(`
                        id,
                        suggestion,
                        status,
                        created_at,
                        user:users(id, full_name, email)
                    `)
                    .eq('spot_id', spot.id)
                    .order('created_at', { ascending: false });

                if (error) throw error;
                setSuggestions(data || []);
            } catch (err) {
                console.error('Error fetching suggestions:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchSuggestions();
    }, [spot.id]);

    const handleUpdateStatus = async (suggestionId, newStatus) => {
        try {
            const { supabase } = await import('./supabase');
            const { error } = await supabase
                .from('spot_suggestions')
                .update({ status: newStatus })
                .eq('id', suggestionId);

            if (error) throw error;
            
            setSuggestions(prev => prev.map(s => s.id === suggestionId ? { ...s, status: newStatus } : s));
            onRefresh(); // Refresh parent to update counts if needed
        } catch (err) {
            console.error('Error updating suggestion status:', err);
        }
    };

    return (
        <div className="modal-overlay" style={{ zIndex: 1200 }} onClick={onClose}>
            <div className="modal-content large mobile-full" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <div className="modal-title-with-icon">
                        <ClipboardList size={24} color="#4f46e5" />
                        <div>
                            <h3>Suggestions</h3>
                            <p className="modal-subtitle">{spot.name}</p>
                        </div>
                    </div>
                    <button className="modal-close-btn" onClick={onClose}><X size={24} /></button>
                </div>

                <div className="suggestions-list-body">
                    {loading ? (
                        <div className="loading-state-placeholder" style={{ padding: '40px' }}>
                            <RotateCw size={32} className="animate-spin" />
                            <span>Loading...</span>
                        </div>
                    ) : suggestions.length === 0 ? (
                        <div className="empty-state-placeholder" style={{ padding: '40px' }}>
                            <MessageSquare size={48} />
                            <p>No suggestions yet.</p>
                        </div>
                    ) : (
                        <div className="suggestions-grid" style={{ gridTemplateColumns: '1fr' }}>
                            {suggestions.map(s => (
                                <div key={s.id} className="suggestion-card">
                                    <div className="suggestion-card-header">
                                        <div className="suggesting-user">
                                            <div className="user-mini-avatar">{s.user?.full_name?.charAt(0) || 'U'}</div>
                                            <div>
                                                <div className="user-name">{s.user?.full_name || 'Anonymous'}</div>
                                                <div className="user-email">{s.user?.email}</div>
                                            </div>
                                        </div>
                                        <div className={`suggestion-status-tag ${s.status}`}>
                                            {s.status}
                                        </div>
                                    </div>
                                    <div className="suggestion-text">
                                        "{s.suggestion}"
                                    </div>
                                    <div className="suggestion-card-footer">
                                        <span className="suggestion-date">
                                            {new Date(s.created_at).toLocaleDateString()}
                                        </span>
                                        <div className="suggestion-actions">
                                            {s.status === 'pending' && (
                                                <>
                                                    <button 
                                                        className="sug-action-btn implement" 
                                                        onClick={() => handleUpdateStatus(s.id, 'reviewed')}
                                                    >
                                                        <CheckCircle size={14} /> OK
                                                    </button>
                                                    <button 
                                                        className="sug-action-btn reject" 
                                                        onClick={() => handleUpdateStatus(s.id, 'rejected')}
                                                    >
                                                        <Ban size={14} /> Skip
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
