import React, { useState, useMemo } from 'react';
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
  AlertCircle,
  CheckCircle,
  Clock
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
      comment: 'Amazing experience! The coffee was perfect and the atmosphere was so relaxing. Will definitely come back.',
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
      comment: 'Great location with beautiful views. The service was excellent and the staff was very friendly.',
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
      comment: 'Good place but could be better. The food was average and the prices were a bit high.',
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
      comment: 'Absolutely loved it! The sunset view was breathtaking and the ambiance was perfect.',
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

  return (
    <div className="reviews-page">
      {/* Header */}
      <div className="reviews-header">
        <div className="header-content">
          <div className="header-title">
            <h1>Reviews Management</h1>
            <p>Manage and moderate user reviews for all spots</p>
          </div>
          <div className="header-stats">
            <div className="stat-card">
              <div className="stat-icon">
                <Star size={24} />
              </div>
              <div className="stat-info">
                <h3>4.2</h3>
                <p>Avg Rating</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">
                <MessageSquare size={24} />
              </div>
              <div className="stat-info">
                <h3>{reviews.length}</h3>
                <p>Total Reviews</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">
                <TrendingUp size={24} />
              </div>
              <div className="stat-info">
                <h3>+12%</h3>
                <p>This Month</p>
              </div>
            </div>
          </div>
        </div>
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
          filteredReviews.map(review => (
            <div key={review.id} className="review-card">
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
                  <button className="action-btn" title="More Options">
                    <MoreVertical size={16} />
                  </button>
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
          ))
        )}
      </div>
    </div>
  );
}
