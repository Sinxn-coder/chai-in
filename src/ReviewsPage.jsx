import React, { useState, useMemo, useEffect } from 'react';
import { 
  Star, 
  Search, 
  Filter, 
  MoreVertical, 
  Trash2, 
  Eye, 
  MessageSquare, 
  Calendar,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  CheckCircle,
  Clock,
  Download,
  BarChart3,
  Users,
  ThumbsUp,
  ThumbsDown
} from 'lucide-react';
import './ReviewsPage.css';

export default function ReviewsPage() {
  const [reviews] = useState([
    {
      id: 1,
      userName: 'Sarah Johnson',
      userAvatar: 'SJ',
      rating: 5,
      date: '2024-01-15',
      comment: 'Amazing experience! The coffee was perfect and atmosphere was so relaxing. Will definitely come back.',
      spotName: 'Beachside Coffee',
      spotCategory: 'Coffee Shop',
      helpful: 24,
      status: 'approved'
    },
    {
      id: 2,
      userName: 'Mike Chen',
      userAvatar: 'MC',
      rating: 4,
      date: '2024-01-14',
      comment: 'Great location with beautiful views. The service was excellent and staff was very friendly.',
      spotName: 'Mountain Viewpoint',
      spotCategory: 'Scenic View',
      helpful: 18,
      status: 'approved'
    },
    {
      id: 3,
      userName: 'Emily Davis',
      userAvatar: 'ED',
      rating: 3,
      date: '2024-01-13',
      comment: 'Good place but could be better. The food was average and prices were a bit high.',
      spotName: 'Downtown Restaurant',
      spotCategory: 'Restaurant',
      helpful: 12,
      status: 'pending'
    },
    {
      id: 4,
      userName: 'Alex Thompson',
      userAvatar: 'AT',
      rating: 5,
      date: '2024-01-12',
      comment: 'Absolutely loved it! The sunset view was breathtaking and ambiance was perfect.',
      spotName: 'Sunset Point',
      spotCategory: 'Scenic View',
      helpful: 31,
      status: 'approved'
    },
    {
      id: 5,
      userName: 'Lisa Wang',
      userAvatar: 'LW',
      rating: 4,
      date: '2024-01-11',
      comment: 'Very nice place for families. Clean facilities and plenty of activities for kids.',
      spotName: 'City Park',
      spotCategory: 'Park',
      helpful: 15,
      status: 'approved'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [selectedReviews, setSelectedReviews] = useState([]);
  const [showBatchActions, setShowBatchActions] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [showAnalytics, setShowAnalytics] = useState(false);

  // Analytics calculations
  const analytics = useMemo(() => {
    const totalReviews = reviews.length;
    const approvedReviews = reviews.filter(r => r.status === 'approved').length;
    const pendingReviews = reviews.filter(r => r.status === 'pending').length;
    const rejectedReviews = reviews.filter(r => r.status === 'rejected').length;
    
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews;
    const totalHelpful = reviews.reduce((sum, r) => sum + r.helpful, 0);
    
    const ratingDistribution = [1, 2, 3, 4, 5].map(rating => ({
      rating,
      count: reviews.filter(r => r.rating === rating).length
    }));
    
    const recentReviews = reviews.filter(r => {
      const reviewDate = new Date(r.date);
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return reviewDate >= thirtyDaysAgo;
    }).length;

    return {
      totalReviews,
      approvedReviews,
      pendingReviews,
      rejectedReviews,
      avgRating: avgRating.toFixed(1),
      totalHelpful,
      ratingDistribution,
      recentReviews,
      approvalRate: ((approvedReviews / totalReviews) * 100).toFixed(1)
    };
  }, [reviews]);

  const filteredReviews = useMemo(() => {
    let filtered = reviews.filter(review => {
      const matchesSearch = review.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           review.comment.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           review.spotName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || review.status === statusFilter;
      return matchesSearch && matchesStatus;
    });

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.date) - new Date(a.date);
        case 'oldest':
          return new Date(a.date) - new Date(b.date);
        case 'rating-high':
          return b.rating - a.rating;
        case 'rating-low':
          return a.rating - b.rating;
        case 'helpful':
          return b.helpful - a.helpful;
        default:
          return 0;
      }
    });
  }, [reviews, searchTerm, statusFilter, sortBy]);

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={16}
        className={i < rating ? 'star-filled' : 'star-empty'}
        fill={i < rating ? '#fbbf24' : 'none'}
        stroke={i < rating ? '#fbbf24' : '#d1d5db'}
      />
    ));
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved':
        return <span className="status-badge approved"><CheckCircle size={12} /> Approved</span>;
      case 'pending':
        return <span className="status-badge pending"><Clock size={12} /> Pending</span>;
      case 'rejected':
        return <span className="status-badge rejected"><AlertCircle size={12} /> Rejected</span>;
      default:
        return <span className="status-badge">Unknown</span>;
    }
  };

  // Batch Operations
  const handleSelectReview = (reviewId) => {
    setSelectedReviews(prev => {
      if (prev.includes(reviewId)) {
        return prev.filter(id => id !== reviewId);
      } else {
        return [...prev, reviewId];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedReviews.length === filteredReviews.length) {
      setSelectedReviews([]);
    } else {
      setSelectedReviews(filteredReviews.map(review => review.id));
    }
  };

  const handleBatchApprove = () => {
    console.log('Batch approving reviews:', selectedReviews);
    // Here you would update the reviews status to 'approved'
    setSelectedReviews([]);
    setShowBatchActions(false);
  };

  const handleBatchReject = () => {
    console.log('Batch rejecting reviews:', selectedReviews);
    // Here you would update the reviews status to 'rejected'
    setSelectedReviews([]);
    setShowBatchActions(false);
  };

  const handleBatchDelete = () => {
    console.log('Batch deleting reviews:', selectedReviews);
    // Here you would delete the selected reviews
    setSelectedReviews([]);
    setShowBatchActions(false);
  };

  useEffect(() => {
    setShowBatchActions(selectedReviews.length > 0);
  }, [selectedReviews]);

  // Export Functions
  const handleExportReviews = () => {
    setShowExportModal(true);
  };

  const handleExportCSV = () => {
    const headers = ['ID', 'User', 'Rating', 'Date', 'Spot', 'Category', 'Comment', 'Status', 'Helpful'];
    const csvData = filteredReviews.map(review => [
      review.id,
      review.userName,
      review.rating,
      review.date,
      review.spotName,
      review.spotCategory,
      `"${review.comment.replace(/"/g, '""')}"`,
      review.status,
      review.helpful
    ]);
    
    const csv = [headers, ...csvData].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reviews_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    setShowExportModal(false);
  };

  const handleExportJSON = () => {
    const jsonData = JSON.stringify(filteredReviews, null, 2);
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reviews_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setShowExportModal(false);
  };

  // Dropdown Functions
  const handleDropdownToggle = (reviewId, event) => {
    event.stopPropagation();
    console.log('Dropdown toggled for review:', reviewId);
    setActiveDropdown(activeDropdown === reviewId ? null : reviewId);
  };

  const handleDropdownAction = (action, reviewId, event) => {
    event.stopPropagation();
    console.log(`${action} review:`, reviewId);
    setActiveDropdown(null);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (activeDropdown && !event.target.closest('.dropdown-menu')) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [activeDropdown]);

  return (
    <div className="reviews-page">
      {/* Header */}
      <div className="reviews-header">
        <div className="header-content">
          <div className="header-title">
            <h1>Reviews Management</h1>
            <p>Manage and moderate user reviews for all spots</p>
          </div>
          <div className="header-actions">
            <button 
              className="analytics-btn" 
              onClick={() => setShowAnalytics(!showAnalytics)}
            >
              <BarChart3 size={16} />
              {showAnalytics ? 'Hide Analytics' : 'Show Analytics'}
            </button>
            <button className="export-btn" onClick={handleExportReviews}>
              <Download size={16} />
              Export Reviews
            </button>
          </div>
        </div>
        
        {/* Analytics Dashboard */}
        {showAnalytics && (
          <div className="analytics-dashboard">
            <div className="analytics-grid">
              <div className="analytics-card">
                <div className="analytics-icon">
                  <MessageSquare size={24} />
                </div>
                <div className="analytics-info">
                  <h3>{analytics.totalReviews}</h3>
                  <p>Total Reviews</p>
                </div>
              </div>
              
              <div className="analytics-card">
                <div className="analytics-icon">
                  <Star size={24} />
                </div>
                <div className="analytics-info">
                  <h3>{analytics.avgRating}</h3>
                  <p>Average Rating</p>
                </div>
              </div>
              
              <div className="analytics-card">
                <div className="analytics-icon">
                  <CheckCircle size={24} />
                </div>
                <div className="analytics-info">
                  <h3>{analytics.approvalRate}%</h3>
                  <p>Approval Rate</p>
                </div>
              </div>
              
              <div className="analytics-card">
                <div className="analytics-icon">
                  <ThumbsUp size={24} />
                </div>
                <div className="analytics-info">
                  <h3>{analytics.totalHelpful}</h3>
                  <p>Total Helpful</p>
                </div>
              </div>
            </div>
            
            <div className="analytics-details">
              <div className="analytics-section">
                <h4>Review Status</h4>
                <div className="status-stats">
                  <div className="status-stat approved">
                    <CheckCircle size={16} />
                    <span>{analytics.approvedReviews} Approved</span>
                  </div>
                  <div className="status-stat pending">
                    <Clock size={16} />
                    <span>{analytics.pendingReviews} Pending</span>
                  </div>
                  <div className="status-stat rejected">
                    <AlertCircle size={16} />
                    <span>{analytics.rejectedReviews} Rejected</span>
                  </div>
                </div>
              </div>
              
              <div className="analytics-section">
                <h4>Rating Distribution</h4>
                <div className="rating-distribution">
                  {analytics.ratingDistribution.map(({ rating, count }) => (
                    <div key={rating} className="rating-bar">
                      <div className="rating-label">
                        <Star size={14} />
                        <span>{rating}</span>
                      </div>
                      <div className="rating-progress">
                        <div 
                          className="rating-fill" 
                          style={{ width: `${(count / analytics.totalReviews) * 100}%` }}
                        />
                      </div>
                      <span className="rating-count">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="analytics-section">
                <h4>Recent Activity</h4>
                <div className="activity-stats">
                  <div className="activity-stat">
                    <TrendingUp size={16} />
                    <span>{analytics.recentReviews} reviews in last 30 days</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Filters and Search */}
      <div className="reviews-controls">
        <div className="search-filter-group">
          <div className="search-box">
            <Search size={20} className="search-icon" />
            <input
              type="text"
              placeholder="Search reviews by user, comment, or spot..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="filter-group">
            <div className="filter-dropdown">
              <Filter size={16} />
              <select 
                value={statusFilter} 
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="approved">Approved</option>
                <option value="pending">Pending</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            
            <div className="sort-dropdown">
              <Calendar size={16} />
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="rating-high">Highest Rating</option>
                <option value="rating-low">Lowest Rating</option>
                <option value="helpful">Most Helpful</option>
              </select>
            </div>
          </div>
        </div>

        {/* Batch Actions */}
        {showBatchActions && (
          <div className="batch-actions">
            <div className="batch-info">
              <span>{selectedReviews.length} reviews selected</span>
            </div>
            <div className="batch-buttons">
              <button className="batch-btn approve" onClick={handleBatchApprove}>
                <CheckCircle size={14} />
                Approve Selected
              </button>
              <button className="batch-btn reject" onClick={handleBatchReject}>
                <AlertCircle size={14} />
                Reject Selected
              </button>
              <button className="batch-btn delete" onClick={handleBatchDelete}>
                <Trash2 size={14} />
                Delete Selected
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Reviews List */}
      <div className="reviews-list">
        {filteredReviews.length === 0 ? (
          <div className="no-reviews">
            <div className="no-reviews-icon">
              <MessageSquare size={48} />
            </div>
            <h3>No reviews found</h3>
            <p>Try adjusting your search or filters</p>
          </div>
        ) : (
          <>
            {/* Select All Control */}
            <div className="select-all-control">
              <div className="select-all-info">
                <input
                  type="checkbox"
                  checked={selectedReviews.length === filteredReviews.length && filteredReviews.length > 0}
                  onChange={handleSelectAll}
                />
                <label>Select All ({selectedReviews.length}/{filteredReviews.length})</label>
              </div>
            </div>

            {/* Reviews Grid */}
            <div className="reviews-grid">
              {filteredReviews.map(review => (
                <div key={review.id} className={`review-card ${selectedReviews.includes(review.id) ? 'selected' : ''}`}>
                  {/* Selection Checkbox */}
                  <div className="review-selection">
                    <input
                      type="checkbox"
                      checked={selectedReviews.includes(review.id)}
                      onChange={() => handleSelectReview(review.id)}
                    />
                  </div>

                  {/* Review Header */}
                  <div className="review-header">
                    <div className="reviewer-info">
                      <div className="reviewer-avatar">
                        {review.userAvatar}
                      </div>
                      <div className="reviewer-details">
                        <h4>{review.userName}</h4>
                        <div className="review-meta">
                          <div className="rating">
                            {renderStars(review.rating)}
                          </div>
                          <span className="date">{review.date}</span>
                        </div>
                      </div>
                    </div>
                    <div className="review-actions">
                      <button className="action-btn" title="View Details">
                        <Eye size={16} />
                      </button>
                      <div className="dropdown-container">
                        <button 
                          className="action-btn dropdown-toggle" 
                          title="More Options"
                          onClick={(e) => handleDropdownToggle(review.id, e)}
                        >
                          <MoreVertical size={16} />
                        </button>
                        {activeDropdown === review.id && (
                          <div className="dropdown-menu">
                            <button 
                              className="dropdown-item"
                              onClick={(e) => handleDropdownAction('edit', review.id, e)}
                            >
                              <Eye size={14} />
                              Edit Review
                            </button>
                            <button 
                              className="dropdown-item"
                              onClick={(e) => handleDropdownAction('flag', review.id, e)}
                            >
                              <AlertCircle size={14} />
                              Flag Review
                            </button>
                            <button 
                              className="dropdown-item"
                              onClick={(e) => handleDropdownAction('delete', review.id, e)}
                            >
                              <Trash2 size={14} />
                              Delete Review
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Review Content */}
                  <div className="review-content">
                    <div className="review-spot">
                      <span className="spot-name">{review.spotName}</span>
                      <span className="spot-category">{review.spotCategory}</span>
                    </div>
                    <p className="review-comment">{review.comment}</p>
                  </div>

                  {/* Review Footer */}
                  <div className="review-footer">
                    <div className="review-stats">
                      <span className="helpful-count">
                        <MessageSquare size={14} />
                        {review.helpful} helpful
                      </span>
                      {getStatusBadge(review.status)}
                    </div>
                    <div className="review-moderation">
                      {review.status === 'pending' && (
                        <button className="moderation-btn approve">
                          <CheckCircle size={14} />
                          Approve
                        </button>
                      )}
                      <button className="moderation-btn reject">
                        <Trash2 size={14} />
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Export Modal */}
      {showExportModal && (
        <div className="modal-overlay">
          <div className="export-modal">
            <div className="modal-header">
              <h3>Export Reviews</h3>
              <button className="modal-close" onClick={() => setShowExportModal(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-content">
              <p>Choose export format for {filteredReviews.length} reviews</p>
              <div className="export-options">
                <button className="export-option" onClick={handleExportCSV}>
                  <Download size={20} />
                  <div>
                    <h4>CSV Format</h4>
                    <p>Export as spreadsheet file</p>
                  </div>
                </button>
                <button className="export-option" onClick={handleExportJSON}>
                  <Download size={20} />
                  <div>
                    <h4>JSON Format</h4>
                    <p>Export as structured data</p>
                  </div>
                </button>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowExportModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
