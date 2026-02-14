import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Heart, 
  MessageCircle, 
  Bookmark, 
  Search, 
  Plus, 
  MoreVertical, 
  Eye, 
  Flag, 
  Trash2, 
  Edit, 
  Filter,
  TrendingUp,
  Clock,
  Image as ImageIcon,
  BarChart3,
  Shield,
  Settings,
  CheckCircle,
  X,
  Download,
  Upload,
  ChevronLeft,
  ChevronRight,
  Star,
  Share2
} from 'lucide-react';
import './CommunityPage.css';

export default function CommunityPage() {
  const [activeSection, setActiveSection] = useState('posts');
  const [searchTerm, setSearchTerm] = useState('');
  const [savedSettings, setSavedSettings] = useState(false);

  // Mock posts data with enhanced structure
  const [posts, setPosts] = useState([
    {
      id: 1,
      userName: 'Sarah Johnson',
      userPfp: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=1000&auto=format&fit=crop',
      time: '2 hours ago',
      content: 'Just discovered this amazing hidden gem downtown! The pasta was incredible and atmosphere was perfect. Highly recommend checking it out! 🍝',
      images: [
        'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=1000&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1000&q=80'
      ],
      currentImageIndex: 0,
      likes: 42,
      comments: 8,
      isLiked: false,
      isSaved: false,
      status: 'active',
      reports: 0,
      views: 1250,
      tags: ['food', 'pasta', 'hidden-gem'],
      category: 'review',
      priority: 'normal'
    },
    {
      id: 2,
      userName: 'Mike Chen',
      userPfp: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1000&auto=format&fit=crop',
      time: '4 hours ago',
      content: 'Coffee lovers, you need to try this new cafe! Their specialty latte is life-changing. Plus the vibes are just perfect for working or catching up with friends. ☕',
      images: [
        'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=1000&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1000&q=80'
      ],
      currentImageIndex: 0,
      likes: 28,
      comments: 12,
      isLiked: false,
      isSaved: false,
      status: 'active',
      reports: 0,
      views: 890,
      tags: ['coffee', 'cafe', 'latte'],
      category: 'review',
      priority: 'normal'
    },
    {
      id: 3,
      userName: 'Emma Wilson',
      userPfp: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=1000&auto=format&fit=crop',
      time: '6 hours ago',
      content: 'Best brunch spot I\'ve found this month! The avocado toast was perfection and they have most beautiful outdoor seating. Perfect for weekend vibes! 🥑',
      images: [
        'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=1000&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=1000&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=1000&auto=format&fit=crop'
      ],
      currentImageIndex: 0,
      likes: 35,
      comments: 6,
      isLiked: false,
      isSaved: false,
      status: 'active',
      reports: 0,
      views: 2100,
      tags: ['brunch', 'avocado', 'outdoor'],
      category: 'spot',
      priority: 'featured'
    }
  ]);

  // Auto-change image interval
  const [autoChangeIntervals, setAutoChangeIntervals] = useState({});

  useEffect(() => {
    // Set up auto-change intervals for posts with multiple images
    const intervals = {};
    posts.forEach(post => {
      if (post.images.length > 1) {
        intervals[post.id] = setInterval(() => {
          setPosts(prevPosts => 
            prevPosts.map(p => 
              p.id === post.id 
                ? { ...p, currentImageIndex: (p.currentImageIndex + 1) % p.images.length }
                : p
            )
          );
        }, 3000); // Change every 3 seconds
      }
    });
    setAutoChangeIntervals(intervals);

    // Cleanup intervals on unmount
    return () => {
      Object.values(intervals).forEach(interval => clearInterval(interval));
    };
  }, []); // Empty dependency array to run only once

  const sections = [
    { id: 'posts', name: 'Posts', icon: ImageIcon },
    { id: 'users', name: 'Users', icon: Users },
    { id: 'analytics', name: 'Analytics', icon: BarChart3 },
    { id: 'moderation', name: 'Moderation', icon: Shield },
    { id: 'settings', name: 'Settings', icon: Settings }
  ];

  const handleToggleLike = (postId) => {
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { ...post, isLiked: !post.isLiked, likes: post.isLiked ? post.likes - 1 : post.likes + 1 }
        : post
    ));
  };

  const handleToggleSave = (postId) => {
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { ...post, isSaved: !post.isSaved }
        : post
    ));
  };

  const handleDeletePost = (postId) => {
    setPosts(prev => prev.filter(post => post.id !== postId));
  };

  const handleReportPost = (postId) => {
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { ...post, reports: post.reports + 1 }
        : post
    ));
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return <span className="status-badge active">Active</span>;
      case 'flagged':
        return <span className="status-badge flagged">Flagged</span>;
      case 'removed':
        return <span className="status-badge removed">Removed</span>;
      default:
        return <span className="status-badge">Unknown</span>;
    }
  };

  const filteredPosts = posts.filter(post => 
    post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.userName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="community-page">
      <div className="community-header">
        <h1>Community Management</h1>
        <p>Manage community posts, users, and engagement</p>
      </div>

      <div className="community-layout">
        {/* Sidebar Navigation */}
        <div className="community-sidebar">
          <div className="sidebar-header">
            <h3>Community</h3>
            <p>Manage social feed</p>
          </div>
          <div className="nav-tabs">
            {sections.map(section => {
              const Icon = section.icon;
              return (
                <button
                  key={section.id}
                  className={`nav-tab ${activeSection === section.id ? 'active' : ''}`}
                  onClick={() => setActiveSection(section.id)}
                >
                  <Icon size={18} />
                  <span>{section.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Area */}
        <div className="community-content">
          {activeSection === 'posts' && (
            <div className="content-section">
              <div className="section-header">
                <h2>Posts Management</h2>
                <p>Admin control for community posts and content moderation</p>
              </div>

              {/* Admin Actions Bar */}
              <div className="admin-toolbar">
                <div className="admin-actions-left">
                  <button className="btn-primary">
                    <Plus size={18} />
                    Create New Post
                  </button>
                  <button className="btn-secondary">
                    <Download size={18} />
                    Export Data
                  </button>
                  <button className="btn-secondary">
                    <Upload size={18} />
                    Bulk Import
                  </button>
                </div>
                <div className="admin-actions-right">
                  <div className="filter-group">
                    <select className="admin-select">
                      <option>All Posts</option>
                      <option>Pending Review</option>
                      <option>Flagged Content</option>
                      <option>Removed Posts</option>
                      <option>High Priority</option>
                    </select>
                    <select className="admin-select">
                      <option>All Categories</option>
                      <option>Reviews</option>
                      <option>Spots</option>
                      <option>General</option>
                      <option>Announcements</option>
                    </select>
                  </div>
                  <button className="btn-danger">
                    <Trash2 size={18} />
                    Bulk Actions
                  </button>
                </div>
              </div>

              {/* Posts Management Grid */}
              <div className="admin-posts-grid">
                {posts.map(post => (
                  <div key={post.id} className="admin-post-card">
                    {/* Post Priority Badge */}
                    {post.priority === 'featured' && (
                      <div className="priority-badge featured">
                        <Star size={14} />
                        Featured
                      </div>
                    )}

                    {/* Post Header */}
                    <div className="admin-post-header">
                      <div className="admin-user-info">
                        <img src={post.userPfp} alt={post.userName} className="admin-user-avatar" />
                        <div className="admin-user-details">
                          <div className="admin-user-name">{post.userName}</div>
                          <div className="admin-post-meta">
                            <span className="admin-category">{post.category}</span>
                            <span className="admin-time">{post.time}</span>
                            <span className={`admin-status ${post.status}`}>{post.status}</span>
                          </div>
                        </div>
                      </div>
                      <div className="admin-post-actions">
                        <button className="admin-btn-icon">
                          <Edit size={16} />
                        </button>
                        <button className="admin-btn-icon">
                          <Eye size={16} />
                        </button>
                        <button className="admin-btn-icon">
                          <MessageCircle size={16} />
                        </button>
                        <button className="admin-btn-icon danger">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>

                    {/* Post Content */}
                    <div className="admin-post-content">
                      <div className="admin-post-text">
                        <p>{post.content}</p>
                      </div>
                      {post.tags && (
                        <div className="admin-post-tags">
                          {post.tags.map((tag, index) => (
                            <span key={index} className="admin-tag">#{tag}</span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Post Images Admin - Single Slider */}
                    {post.images.length > 0 && (
                      <div className="admin-post-images">
                        <div className="admin-image-header">
                          <span className="admin-image-count">{post.images.length} Images</span>
                          <div className="admin-image-actions">
                            <button className="admin-btn-small">
                              <Upload size={14} />
                              Add Image
                            </button>
                            <button className="admin-btn-small">
                              <Edit size={14} />
                              Edit All
                            </button>
                          </div>
                        </div>
                        <div className="admin-image-slider">
                          <div className="slider-container">
                            <div className="slider-main">
                              {post.images.map((image, index) => (
                                <div 
                                  key={index}
                                  className={`slider-image ${index === post.currentImageIndex ? 'active' : ''}`}
                                >
                                  <img src={image} alt={`Post image ${index + 1}`} />
                                  <div className="slider-overlay">
                                    <Eye size={20} />
                                  </div>
                                </div>
                              ))}
                            </div>
                            <div className="slider-indicators">
                              {post.images.map((_, index) => (
                                <div
                                  key={index}
                                  className={`indicator ${index === post.currentImageIndex ? 'active' : ''}`}
                                />
                              ))}
                            </div>
                            <div className="slider-info">
                              <span className="current-slide">{post.currentImageIndex + 1}</span>
                              <span className="total-slides">/ {post.images.length}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Post Analytics */}
                    <div className="admin-post-analytics">
                      <div className="analytics-row">
                        <div className="analytics-item">
                          <div className="analytics-icon">
                            <Eye size={16} />
                          </div>
                          <div className="analytics-data">
                            <div className="analytics-number">{post.views?.toLocaleString() || '0'}</div>
                            <div className="analytics-label">Views</div>
                          </div>
                        </div>
                        <div className="analytics-item">
                          <div className="analytics-icon">
                            <Heart size={16} />
                          </div>
                          <div className="analytics-data">
                            <div className="analytics-number">{post.likes}</div>
                            <div className="analytics-label">Likes</div>
                          </div>
                        </div>
                        <div className="analytics-item">
                          <div className="analytics-icon">
                            <MessageCircle size={16} />
                          </div>
                          <div className="analytics-data">
                            <div className="analytics-number">{post.comments}</div>
                            <div className="analytics-label">Comments</div>
                          </div>
                        </div>
                        <div className="analytics-item">
                          <div className="analytics-icon">
                            <Share2 size={16} />
                          </div>
                          <div className="analytics-data">
                            <div className="analytics-number">{post.shares || 0}</div>
                            <div className="analytics-label">Shares</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Post Status & Moderation */}
                    <div className="admin-post-moderation">
                      <div className="moderation-header">
                        <h4>Moderation Actions</h4>
                      </div>
                      <div className="moderation-controls">
                        <button className={`moderation-btn ${post.status === 'active' ? 'active' : ''}`}>
                          <CheckCircle size={16} />
                          Approve
                        </button>
                        <button className={`moderation-btn ${post.status === 'flagged' ? 'active' : ''}`}>
                          <Flag size={16} />
                          Flag Content
                        </button>
                        <button className={`moderation-btn ${post.status === 'removed' ? 'active' : ''}`}>
                          <X size={16} />
                          Remove Post
                        </button>
                        <button className="moderation-btn danger">
                          <Trash2 size={16} />
                          Delete Permanently
                        </button>
                      </div>
                      {post.reports > 0 && (
                        <div className="report-info">
                          <span className="report-count">{post.reports} user reports</span>
                          <button className="review-reports-btn">
                            <Shield size={16} />
                            Review Reports
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === 'users' && (
            <div className="content-section">
              <div className="section-header">
                <h2>Community Users</h2>
                <p>Manage community members and user activity</p>
              </div>

              <div className="users-grid">
                {['Sarah Johnson', 'Mike Chen', 'Emma Wilson', 'Alex Rodriguez'].map((user, index) => (
                  <div key={index} className="user-card">
                    <img 
                      src={`https://images.unsplash.com/photo-1438761681033-${index}-6461ffad8d80?q=80&w=1000&auto=format&fit=crop`}
                      alt={user} 
                      className="user-avatar"
                    />
                    <div className="user-info">
                      <div className="user-name">{user}</div>
                      <div className="user-stats">
                        <div className="stat">
                          <TrendingUp size={14} />
                          <span>156 posts</span>
                        </div>
                        <div className="stat">
                          <Heart size={14} />
                          <span>2.3k likes</span>
                        </div>
                      </div>
                    </div>
                    <div className="user-actions">
                      <button className="btn-icon">
                        <Edit size={16} />
                      </button>
                      <button className="btn-icon">
                        <Shield size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === 'analytics' && (
            <div className="content-section">
              <div className="section-header">
                <h2>Community Analytics</h2>
                <p>Track engagement and community growth</p>
              </div>

              <div className="analytics-grid">
                <div className="metric-card">
                  <div className="metric-header">
                    <ImageIcon size={24} />
                    <span>Total Posts</span>
                  </div>
                  <div className="metric-content">
                    <div className="metric-number">{posts.length}</div>
                    <div className="metric-label">Total Posts</div>
                  </div>
                </div>
                <div className="metric-card">
                  <div className="metric-header">
                    <Users size={24} />
                    <span>Active Users</span>
                  </div>
                  <div className="metric-content">
                    <div className="metric-number">1,234</div>
                    <div className="metric-label">Active Users</div>
                  </div>
                </div>
                <div className="metric-card">
                  <div className="metric-header">
                    <Heart size={24} />
                    <span>Total Likes</span>
                  </div>
                  <div className="metric-content">
                    <div className="metric-number">{posts.reduce((sum, post) => sum + post.likes, 0)}</div>
                    <div className="metric-label">Total Likes</div>
                  </div>
                </div>
                <div className="metric-card">
                  <div className="metric-header">
                    <MessageCircle size={24} />
                    <span>Total Comments</span>
                  </div>
                  <div className="metric-content">
                    <div className="metric-number">{posts.reduce((sum, post) => sum + post.comments, 0)}</div>
                    <div className="metric-label">Total Comments</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'moderation' && (
            <div className="content-section">
              <div className="section-header">
                <h2>Content Moderation</h2>
                <p>Review flagged content and manage community guidelines</p>
              </div>

              <div className="moderation-queue">
                <h3>Flagged Posts</h3>
                <div className="flagged-posts">
                  {posts.filter(post => post.reports > 0).map(post => (
                    <div key={post.id} className="flagged-post">
                      <div className="post-preview">
                        <img src={post.userPfp} alt={post.userName} className="preview-pfp" />
                        <div className="preview-content">
                          <div className="preview-user">{post.userName}</div>
                          <div className="preview-text">{post.content.substring(0, 100)}...</div>
                        </div>
                      </div>
                      <div className="moderation-actions">
                        <button className="btn-secondary">Review</button>
                        <button className="btn-success">Approve</button>
                        <button className="btn-danger">Remove</button>
                      </div>
                      <div className="report-info">
                        <span className="report-count">{post.reports} reports</span>
                        <button className="review-reports-btn">
                          <Shield size={16} />
                          Review Reports
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeSection === 'settings' && (
            <div className="content-section">
              <div className="section-header">
                <h2>Community Settings</h2>
                <p>Configure community behavior and features</p>
              </div>

              <div className="settings-grid">
                <div className="setting-item">
                  <label>Allow Image Posts</label>
                  <select className="setting-input">
                    <option>Enabled</option>
                    <option>Disabled</option>
                  </select>
                  <small>Users can post multiple images</small>
                </div>

                <div className="setting-item">
                  <label>Post Length Limit</label>
                  <input 
                    type="number" 
                    defaultValue="500"
                    className="setting-input" 
                    min="100"
                    max="2000"
                  />
                  <small>Maximum characters per post</small>
                </div>

                <div className="setting-item">
                  <label>Auto-Moderation</label>
                  <select className="setting-input">
                    <option>Enabled</option>
                    <option>Disabled</option>
                  </select>
                  <small>Automatically filter inappropriate content</small>
                </div>

                <div className="setting-item">
                  <label>Community Theme</label>
                  <select className="setting-input">
                    <option>Default</option>
                    <option>Dark</option>
                    <option>Light</option>
                  </select>
                  <small>Visual theme for community</small>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="community-actions">
            <button 
              className={`save-btn ${savedSettings ? 'saved' : ''}`}
              onClick={() => setSavedSettings(true)}
            >
              <CheckCircle size={18} />
              {savedSettings ? 'Saved!' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
