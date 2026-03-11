import React, { useState, useMemo } from 'react';
import {
    Search,
    Filter,
    TrendingUp,
    CheckCircle,
    Clock,
    Flag,
    Star,
    Calendar,
    MessageSquare,
    MapPin,
    ChevronDown,
    Download,
    AlertTriangle,
    MoreVertical,
    Edit,
    Trash2,
    X,
    Phone,
    MessageCircle,
    Instagram,
    Map,
    Eye,
    RotateCw,
    Ban,
    ShieldCheck,
    ChevronLeft,
    ChevronRight,
    AlertCircle,
    ClipboardList
} from 'lucide-react';

export default function SpotsDesktop({ spots, loading, onRefresh }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [sortBy, setSortBy] = useState('name');
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedSpots, setSelectedSpots] = useState([]);

    // UI states for dropdowns and modals
    const [showStatusDropdown, setShowStatusDropdown] = useState(false);
    const [showSortDropdown, setShowSortDropdown] = useState(false);
    const [showItemsPerPageDropdown, setShowItemsPerPageDropdown] = useState(false);
    const [activeSpotDropdown, setActiveSpotDropdown] = useState(null);
    const [viewingSuggestionsSpot, setViewingSuggestionsSpot] = useState(null);

    const [viewingSpotData, setViewingSpotData] = useState(null);
    const [editingSpotData, setEditingSpotData] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [showVerifyConfirm, setShowVerifyConfirm] = useState(false);
    const [showFlagConfirm, setShowFlagConfirm] = useState(false);

    // Image Gallery State
    const [showGallery, setShowGallery] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    // Filter and search logic
    const filteredSpots = useMemo(() => {
        let filtered = spots.filter(spot => {
            const name = (spot.name || '').toLowerCase();
            const city = (spot.city || '').toLowerCase();
            const cat = (spot.category || '').toLowerCase();
            const term = searchTerm.toLowerCase();

            const matchesSearch = name.includes(term) || city.includes(term) || cat.includes(term);
            const matchesStatus = statusFilter === 'all' || spot.status === statusFilter;
            return matchesSearch && matchesStatus;
        });

        return filtered.sort((a, b) => {
            switch (sortBy) {
                case 'name': return (a.name || '').localeCompare(b.name || '');
                case 'rating': return (b.rating || 0) - (a.rating || 0);
                case 'date': return new Date(b.created_at) - new Date(a.created_at);
                case 'reviews': return (b.review_count || 0) - (a.review_count || 0);
                default: return 0;
            }
        });
    }, [spots, searchTerm, statusFilter, sortBy]);

    // Pagination
    const paginatedSpots = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredSpots.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredSpots, currentPage, itemsPerPage]);

    const totalPages = Math.ceil(filteredSpots.length / itemsPerPage);

    // Statistics
    const stats = useMemo(() => ({
        total: spots.length,
        verified: spots.filter(s => s.status === 'verified' || s.status === 'approved').length,
        pending: spots.filter(s => s.status === 'pending').length,
        flagged: spots.filter(s => s.status === 'flagged' || s.status === 'rejected').length
    }), [spots]);

    // Actions
    const handleExport = () => {
        const headers = ['ID', 'Name', 'Category', 'City', 'Status', 'Rating', 'Reviews', 'Added'];
        const csvContent = [
            headers.join(','),
            ...filteredSpots.map(s => [
                s.id,
                `"${s.name}"`,
                `"${s.category}"`,
                `"${s.city || ''}"`,
                s.status,
                s.rating || 0,
                s.review_count || 0,
                s.created_at ? new Date(s.created_at).toLocaleDateString() : ''
            ].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `spots_export_${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
    };

    const getStatusBadge = (status) => {
        const isApprov = status === 'approved' || status === 'verified';
        const isReject = status === 'rejected' || status === 'flagged';

        if (isApprov) return <span className="status-badge status-verified">Verified</span>;
        if (isReject) return <span className="status-badge status-flagged">Flagged</span>;
        return <span className="status-badge status-pending">Pending</span>;
    };

    const toggleSelectSpot = (id) => {
        setSelectedSpots(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };

    const handleSelectAll = () => {
        if (selectedSpots.length === filteredSpots.length) setSelectedSpots([]);
        else setSelectedSpots(filteredSpots.map(s => s.id));
    };

    // Update spot status in Supabase
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

    // Update multiple spots status
    const handleBatchStatusChange = async (newStatus) => {
        try {
            const { supabase } = await import('./supabase');
            const dbStatus = newStatus === 'verified' ? 'approved' : newStatus === 'flagged' ? 'rejected' : newStatus;
            const isVerified = newStatus === 'verified';

            const { error } = await supabase
                .from('spots')
                .update({ status: dbStatus, is_verified: isVerified })
                .in('id', selectedSpots);

            if (error) throw error;
            onRefresh();
            setSelectedSpots([]);
        } catch (err) {
            console.error('Failed to update multiple spots:', err);
        }
        setShowVerifyConfirm(false);
        setShowFlagConfirm(false);
    };

    const handleBatchDelete = async () => {
        try {
            const { supabase } = await import('./supabase');
            const { error } = await supabase
                .from('spots')
                .delete()
                .in('id', selectedSpots);

            if (error) throw error;
            onRefresh();
            setSelectedSpots([]);
        } catch (err) {
            console.error('Failed to delete spots:', err);
        }
        setShowDeleteConfirm(false);
    };

    const ImageGalleryModal = ({ spot }) => {
        if (!spot || !spot.images || spot.images.length === 0) return null;

        const images = Array.isArray(spot.images) ? spot.images : [spot.images];

        return (
            <div className="image-gallery-overlay" onClick={() => setShowGallery(false)}>
                <div className="image-gallery-container" onClick={e => e.stopPropagation()}>
                    <button className="gallery-close-btn" onClick={() => setShowGallery(false)}>
                        <X size={24} />
                    </button>

                    <div className="gallery-main-display">
                        {images.length > 1 && (
                            <button
                                className="gallery-nav-btn prev"
                                onClick={() => setCurrentImageIndex(prev => prev > 0 ? prev - 1 : images.length - 1)}
                                disabled={(images.length <= 1)}
                            >
                                <ChevronLeft size={32} />
                            </button>
                        )}

                        <img
                            src={images[currentImageIndex]}
                            alt={`${spot.name} - ${currentImageIndex + 1}`}
                            className="gallery-main-image"
                        />

                        {images.length > 1 && (
                            <button
                                className="gallery-nav-btn next"
                                onClick={() => setCurrentImageIndex(prev => prev < images.length - 1 ? prev + 1 : 0)}
                                disabled={(images.length <= 1)}
                            >
                                <ChevronRight size={32} />
                            </button>
                        )}
                    </div>

                    {images.length > 1 && (
                        <div className="gallery-thumbnails-wrapper">
                            {images.map((img, idx) => (
                                <img
                                    key={idx}
                                    src={img}
                                    alt="thumbnail"
                                    className={`gallery-thumbnail ${idx === currentImageIndex ? 'active' : ''}`}
                                    onClick={() => setCurrentImageIndex(idx)}
                                />
                            ))}
                        </div>
                    )}

                    <div className="gallery-counter">
                        {currentImageIndex + 1} / {images.length}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="spots-management">
            {/* Header & Controls */}
            <div className="spots-header">
                <div className="spots-controls">
                    <div className="modern-search-bar">
                        <div className="search-input-wrapper">
                            <Search size={20} className="search-icon" />
                            <input
                                type="text"
                                placeholder="Search spots by name, city, or category..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="search-input"
                            />
                        </div>
                    </div>

                    <div className="modern-status-dropdown">
                        <div className="status-dropdown-trigger" onClick={() => setShowStatusDropdown(!showStatusDropdown)}>
                            <Filter size={16} />
                            <span className="status-dropdown-label">
                                {statusFilter === 'all' ? 'All Status' : statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)}
                            </span>
                            <ChevronDown size={14} className={showStatusDropdown ? 'open' : ''} />
                        </div>
                        {showStatusDropdown && (
                            <div className="status-dropdown-menu">
                                {['all', 'verified', 'pending', 'flagged'].map(val => (
                                    <div key={val} className="status-dropdown-item" onClick={() => { setStatusFilter(val); setShowStatusDropdown(false); }}>
                                        {val.charAt(0).toUpperCase() + val.slice(1)}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="modern-sort-dropdown">
                        <div className="sort-dropdown-trigger" onClick={() => setShowSortDropdown(!showSortDropdown)}>
                            <TrendingUp size={16} />
                            <span className="sort-dropdown-label">Sort by {sortBy.charAt(0).toUpperCase() + sortBy.slice(1)}</span>
                            <ChevronDown size={14} className={showSortDropdown ? 'open' : ''} />
                        </div>
                        {showSortDropdown && (
                            <div className="sort-dropdown-menu">
                                {['name', 'rating', 'date', 'reviews'].map(val => (
                                    <div key={val} className="sort-dropdown-item" onClick={() => { setSortBy(val); setShowSortDropdown(false); }}>
                                        By {val.charAt(0).toUpperCase() + val.slice(1)}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="spots-actions">
                    <button className="premium-action-btn" onClick={handleExport}>
                        <Download size={16} /> Export
                    </button>
                    <button className="premium-action-btn premium-success" onClick={onRefresh}>
                        <RotateCw size={16} className={loading ? 'animate-spin' : ''} /> Refresh
                    </button>
                </div>
            </div>

            {/* Stats Bento Grid */}
            <div className="stats-grid-modern">
                <div className="stat-card-modern spots-total">
                    <div className="stat-card-header">
                        <span>Total Spots</span>
                        <div className="stat-icon-wrapper red"><MapPin size={20} /></div>
                    </div>
                    <div className="stat-value">{stats.total}</div>
                </div>
                <div className="stat-card-modern spots-verified">
                    <div className="stat-card-header">
                        <span>Verified</span>
                        <div className="stat-icon-wrapper green"><CheckCircle size={20} /></div>
                    </div>
                    <div className="stat-value">{stats.verified}</div>
                </div>
                <div className="stat-card-modern spots-pending">
                    <div className="stat-card-header">
                        <span>Pending</span>
                        <div className="stat-icon-wrapper blue"><Clock size={20} /></div>
                    </div>
                    <div className="stat-value">{stats.pending}</div>
                </div>
                <div className="stat-card-modern spots-flagged">
                    <div className="stat-card-header">
                        <span>Flagged</span>
                        <div className="stat-icon-wrapper yellow"><AlertTriangle size={20} /></div>
                    </div>
                    <div className="stat-value">{stats.flagged}</div>
                </div>
            </div>

            {/* Main Data Table */}
            <div className="users-list-container">
                <div className="users-list-header" style={{ gridTemplateColumns: '50px 2fr 1.2fr 1fr 1fr 1.5fr' }}>
                    <div className="ul-col">
                        <input type="checkbox" checked={selectedSpots.length === filteredSpots.length && filteredSpots.length > 0} onChange={handleSelectAll} />
                    </div>
                    <div className="ul-col">Spot Details</div>
                    <div className="ul-col">Location</div>
                    <div className="ul-col">Category</div>
                    <div className="ul-col">Status</div>
                    <div className="ul-col">Actions</div>
                </div>

                <div className="users-list-body">
                    {loading ? (
                        <div className="loading-state-placeholder" style={{ padding: '60px' }}>
                            <RotateCw size={32} className="animate-spin" />
                            <span>Loading Spots...</span>
                        </div>
                    ) : paginatedSpots.length === 0 ? (
                        <div className="empty-state-placeholder" style={{ padding: '60px' }}>
                            <MapPin size={48} />
                            <p>No spots found matching your search</p>
                        </div>
                    ) : (
                        paginatedSpots.map(spot => (
                            <div key={spot.id} className={`user-list-row group ${activeSpotDropdown === spot.id ? 'active' : ''}`} style={{ gridTemplateColumns: '50px 2fr 1.2fr 1fr 1fr 1.5fr' }}>
                                <div className="ul-col">
                                    <input type="checkbox" checked={selectedSpots.includes(spot.id)} onChange={() => toggleSelectSpot(spot.id)} />
                                </div>
                                <div className="ul-col">
                                    <div className="user-info-list">
                                        <h3 className="user-name-list">{spot.name}</h3>
                                        <div className="stat-badge orange">
                                            <Star size={12} fill="#ff9900" /> {spot.rating || 0} ({spot.review_count || 0})
                                        </div>
                                    </div>
                                </div>
                                <div className="ul-col">{spot.city || 'N/A'}</div>
                                <div className="ul-col"><span className="spot-category-tag">{spot.category}</span></div>
                                <div className="ul-col">{getStatusBadge(spot.status)}</div>
                                <div className="ul-col">
                                    <div className="spot-row-actions">
                                        {/* View Details */}
                                        <button
                                            className="spot-action-btn view"
                                            onClick={() => setViewingSpotData(spot)}
                                            title="View Details"
                                        >
                                            <Eye size={15} />
                                            <span>View</span>
                                        </button>

                                        {/* Edit */}
                                        <button
                                            className="spot-action-btn edit"
                                            onClick={() => setEditingSpotData(spot)}
                                            title="Edit Spot"
                                        >
                                            <Edit size={15} />
                                        </button>
                                        
                                        {/* Suggestions */}
                                        <button
                                            className={`spot-action-btn suggestions ${spot.suggestion_count > 0 ? 'has-suggestions' : ''}`}
                                            onClick={() => setViewingSuggestionsSpot(spot)}
                                            title="View User Suggestions"
                                        >
                                            <ClipboardList size={15} />
                                            {spot.suggestion_count > 0 && (
                                                <span className="suggestion-badge-inline">{spot.suggestion_count}</span>
                                            )}
                                        </button>

                                        {/* More (context-sensitive + Delete) */}
                                        <div className="spot-action-more-wrapper">
                                            <button
                                                className="spot-action-btn more"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setActiveSpotDropdown(activeSpotDropdown === spot.id ? null : spot.id);
                                                }}
                                                title="More"
                                            >
                                                <MoreVertical size={15} />
                                            </button>
                                            {activeSpotDropdown === spot.id && (
                                                <div className="spot-action-dropdown">
                                                    {/* Map link */}
                                                    {spot.latitude && spot.longitude && (
                                                        <button
                                                            className="spot-dropdown-item"
                                                            onClick={() => {
                                                                window.open(`https://www.google.com/maps/search/?api=1&query=${spot.latitude},${spot.longitude}`, '_blank');
                                                                setActiveSpotDropdown(null);
                                                            }}
                                                        >
                                                            <Map size={14} /> Open Map
                                                        </button>
                                                    )}

                                                    {/* Verify — only for pending/flagged */}
                                                    {(spot.status === 'pending' || spot.status === 'flagged' || spot.status === 'rejected') && (
                                                        <button
                                                            className="spot-dropdown-item success"
                                                            onClick={() => handleSpotStatusChange(spot, 'verified')}
                                                        >
                                                            <ShieldCheck size={14} /> Verify
                                                        </button>
                                                    )}

                                                    {/* Ban/Flag — only for verified/pending */}
                                                    {(spot.status === 'verified' || spot.status === 'approved' || spot.status === 'pending') && (
                                                        <button
                                                            className="spot-dropdown-item warning"
                                                            onClick={() => handleSpotStatusChange(spot, 'flagged')}
                                                        >
                                                            <Ban size={14} /> Ban
                                                        </button>
                                                    )}

                                                    {/* Delete — always */}
                                                    <button
                                                        className="spot-dropdown-item danger"
                                                        onClick={() => {
                                                            setSelectedSpots([spot.id]);
                                                            setShowDeleteConfirm(true);
                                                            setActiveSpotDropdown(null);
                                                        }}
                                                    >
                                                        <Trash2 size={14} /> Delete
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Pagination */}
            <div className="users-footer">
                <div className="users-count">Showing {paginatedSpots.length} of {filteredSpots.length} spots</div>
                <div className="pagination">
                    <button
                        className="pagination-btn"
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(prev => prev - 1)}
                        title="Previous Page"
                    >
                        <ChevronLeft size={18} />
                        <span>Previous</span>
                    </button>
                    <div className="page-indicator">
                        <span className="current-page">{currentPage}</span>
                        <span className="page-separator">/</span>
                        <span className="total-pages">{totalPages || 1}</span>
                    </div>
                    <button
                        className="pagination-btn"
                        disabled={currentPage >= totalPages}
                        onClick={() => setCurrentPage(prev => prev + 1)}
                        title="Next Page"
                    >
                        <span>Next</span>
                        <ChevronRight size={18} />
                    </button>
                </div>
            </div>

            {/* Details Side Panel */}
            {viewingSpotData && (
                <div className="user-sidepanel-backdrop" onClick={() => setViewingSpotData(null)}>
                    <div className="user-sidepanel-container animation-slide-left" onClick={e => e.stopPropagation()}>
                        <div className="sidepanel-header">
                            <button className="sidepanel-close" onClick={() => setViewingSpotData(null)}><X size={24} /></button>
                            <div className="sidepanel-user-hero">
                                <div className="hero-avatar" style={{ background: '#4f46e5' }}><MapPin size={32} color="white" /></div>
                                <h2 className="hero-name">{viewingSpotData.name}</h2>
                                <p className="hero-email">{viewingSpotData.category}</p>
                                <div className="hero-badge-wrap">{getStatusBadge(viewingSpotData.status)}</div>
                            </div>
                        </div>

                        <div className="sidepanel-scrollable-body">
                            <div className="sidepanel-bento-grid">
                                <div className="sidepanel-bento-cell"><Star size={20} /> <h3>{viewingSpotData.rating}</h3><span>Rating</span></div>
                                <div className="sidepanel-bento-cell"><MessageSquare size={20} /> <h3>{viewingSpotData.review_count}</h3><span>Reviews</span></div>
                                <div className="sidepanel-bento-cell"><Calendar size={20} /> <h3>{viewingSpotData.created_at ? new Date(viewingSpotData.created_at).toLocaleDateString() : 'N/A'}</h3><span>Added</span></div>
                            </div>

                            <div className="sidepanel-info-group">
                                <h4 className="info-group-title">Location & Contact</h4>
                                <div className="info-list-card">
                                    <div className="info-list-row"><span>City</span><span>{viewingSpotData.city || 'N/A'}</span></div>
                                    <div className="info-list-row"><span>Phone</span><span>{viewingSpotData.phone || 'N/A'}</span></div>
                                    {viewingSpotData.latitude && (
                                        <button className="maps-action-btn" onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${viewingSpotData.latitude},${viewingSpotData.longitude}`, '_blank')}>
                                            <Map size={16} /> View Coordinates Map
                                        </button>
                                    )}
                                </div>
                            </div>

                            <div className="sidepanel-info-group">
                                <h4 className="info-group-title">Social Media</h4>
                                <div className="info-list-card" style={{ display: 'flex', gap: '10px', padding: '15px' }}>
                                    <button className="social-btn" onClick={() => window.open(`https:// instagram.com/${viewingSpotData.instagram || ''}`, '_blank')}><Instagram size={20} /></button>
                                    <button className="social-btn" onClick={() => window.open(`https://wa.me/${viewingSpotData.whatsapp || ''}`, '_blank')}><MessageCircle size={20} /></button>
                                </div>
                            </div>

                            {viewingSpotData.images && viewingSpotData.images.length > 0 && (
                                <div className="sidepanel-info-group">
                                    <h4 className="info-group-title">Gallery</h4>
                                    <button
                                        className="view-gallery-action-btn"
                                        onClick={() => {
                                            setCurrentImageIndex(0);
                                            setShowGallery(true);
                                        }}
                                    >
                                        <Eye size={18} />
                                        View Spot Photos ({viewingSpotData.images.length})
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {showGallery && <ImageGalleryModal spot={viewingSpotData} />}

            {viewingSuggestionsSpot && (
                <SpotSuggestionsModal
                    spot={viewingSuggestionsSpot}
                    onClose={() => setViewingSuggestionsSpot(null)}
                    onRefresh={onRefresh}
                />
            )}

            {/* Batch Actions Popup */}
            {selectedSpots.length > 0 && (
                <div className="batch-actions-popup fade-in-up">
                    <div className="batch-popup-content">
                        <div className="selected-info">
                            <span className="count-circle">{selectedSpots.length}</span>
                            <span className="selection-label">Spots selected</span>
                        </div>
                        <div className="popup-divider"></div>
                        <div className="batch-buttons">
                            <button className="batch-btn verify" onClick={() => setShowVerifyConfirm(true)}>
                                <ShieldCheck size={18} />
                                Verify All
                            </button>
                            <button className="batch-btn flag" onClick={() => setShowFlagConfirm(true)}>
                                <Ban size={18} />
                                Flag All
                            </button>
                            <button className="batch-btn delete" onClick={() => setShowDeleteConfirm(true)}>
                                <Trash2 size={18} />
                                Delete
                            </button>
                        </div>
                        <div className="popup-divider"></div>
                        <button className="batch-clear-btn" onClick={() => setSelectedSpots([])}>
                            <X size={20} />
                        </button>
                    </div>
                </div>
            )}

            {/* Modal Confirmations */}
            {showVerifyConfirm && (
                <div className="modal-overlay">
                    <div className="modal-content small">
                        <ShieldCheck size={48} color="#10b981" />
                        <h3>Verify {selectedSpots.length} Spots?</h3>
                        <p>These spots will be marked as approved and verified on the platform.</p>
                        <div className="modal-footer">
                            <button className="btn btn-secondary" onClick={() => setShowVerifyConfirm(false)}>Cancel</button>
                            <button className="btn btn-primary success" onClick={() => handleBatchStatusChange('verified')}>Verify Now</button>
                        </div>
                    </div>
                </div>
            )}

            {showFlagConfirm && (
                <div className="modal-overlay">
                    <div className="modal-content small">
                        <AlertTriangle size={48} color="#f59e0b" />
                        <h3>Flag {selectedSpots.length} Spots?</h3>
                        <p>These spots will be rejected and flagged for review.</p>
                        <div className="modal-footer">
                            <button className="btn btn-secondary" onClick={() => setShowFlagConfirm(false)}>Cancel</button>
                            <button className="btn btn-primary warning" onClick={() => handleBatchStatusChange('flagged')}>Flag Now</button>
                        </div>
                    </div>
                </div>
            )}

            {showDeleteConfirm && (
                <div className="modal-overlay">
                    <div className="modal-content small">
                        <Trash2 size={48} color="#ef4444" />
                        <h3>Delete {selectedSpots.length} Spots?</h3>
                        <p>Are you sure you want to delete these spots? This action cannot be undone.</p>
                        <div className="modal-footer">
                            <button className="btn btn-secondary" onClick={() => setShowDeleteConfirm(false)}>Cancel</button>
                            <button className="btn btn-primary danger" onClick={handleBatchDelete}>Delete Forever</button>
                        </div>
                    </div>
                </div>
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
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content large" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <div className="modal-title-with-icon">
                        <ClipboardList size={24} color="#4f46e5" />
                        <div>
                            <h3>Suggestions for {spot.name}</h3>
                            <p className="modal-subtitle">User-submitted edits and improvements</p>
                        </div>
                    </div>
                    <button className="modal-close-btn" onClick={onClose}><X size={24} /></button>
                </div>

                <div className="suggestions-list-body">
                    {loading ? (
                        <div className="loading-state-placeholder" style={{ padding: '60px' }}>
                            <RotateCw size={32} className="animate-spin" />
                            <span>Fetching suggestions...</span>
                        </div>
                    ) : suggestions.length === 0 ? (
                        <div className="empty-state-placeholder" style={{ padding: '60px' }}>
                            <MessageSquare size={48} />
                            <p>No suggestions found for this spot yet.</p>
                        </div>
                    ) : (
                        <div className="suggestions-grid">
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
                                            {new Date(s.created_at).toLocaleDateString()} at {new Date(s.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                        <div className="suggestion-actions">
                                            {s.status === 'pending' && (
                                                <>
                                                    <button 
                                                        className="sug-action-btn implement" 
                                                        onClick={() => handleUpdateStatus(s.id, 'reviewed')}
                                                        title="Mark as Reviewed"
                                                    >
                                                        <CheckCircle size={14} /> Mark Reviewed
                                                    </button>
                                                    <button 
                                                        className="sug-action-btn reject" 
                                                        onClick={() => handleUpdateStatus(s.id, 'rejected')}
                                                        title="Reject Suggestion"
                                                    >
                                                        <Ban size={14} /> Reject
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
