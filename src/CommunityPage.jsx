import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  Download, 
  Upload, 
  Edit, 
  Trash2, 
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  Eye,
  Heart,
  MessageCircle,
  Share2,
  Shield,
  CheckCircle,
  Flag,
  Star,
  Users,
  BarChart3,
  Settings,
  ImageIcon,
  X,
  Clock,
  RefreshCw
} from 'lucide-react';
import './CommunityPage.css';

export default function CommunityPage() {
  const [activeSection, setActiveSection] = useState('posts');
  const [searchTerm, setSearchTerm] = useState('');
  const [savedSettings, setSavedSettings] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [chartPeriod, setChartPeriod] = useState('7days');

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
      views: 1250,
      category: 'review'
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
      views: 890,
      category: 'review'
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
      views: 2100,
      category: 'spot'
    }
  ]);

  const sections = [
    { id: 'posts', name: 'Posts', icon: ImageIcon },
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

  const handleImageNavigation = (postId, direction) => {
    setPosts(prevPosts => 
      prevPosts.map(post => {
        if (post.id === postId) {
          let newIndex;
          if (direction === 'next') {
            newIndex = post.currentImageIndex < post.images.length - 1 ? post.currentImageIndex + 1 : 0;
          } else {
            newIndex = post.currentImageIndex > 0 ? post.currentImageIndex - 1 : post.images.length - 1;
          }
          return { ...post, currentImageIndex: newIndex };
        }
        return post;
      })
    );
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.dropdown-container')) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Get chart data based on selected period
  const getChartData = () => {
    switch (chartPeriod) {
      case '7days':
        return {
          labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          data: [60, 80, 45, 90, 70, 85, 75]
        };
      case '30days':
        return {
          labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
          data: [45, 75, 60, 85]
        };
      case '3months':
        return {
          labels: ['Jan', 'Feb', 'Mar'],
          data: [55, 70, 80]
        };
      default:
        return {
          labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          data: [60, 80, 45, 90, 70, 85, 75]
        };
    }
  };

  return (
    <div className="community-page">
      {/* Header */}
      <div className="community-header">
        <div className="header-content">
          <div className="header-text">
            <h1>Community Management</h1>
            <p>Admin dashboard for community content and user engagement</p>
          </div>
          <div className="header-actions">
            <div className="search-bar">
              <Search size={18} />
              <input 
                type="text" 
                placeholder="Search posts, users, or content..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="filter-btn">
              <Filter size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Layout with Sidebar */}
      <div className="community-layout">
        {/* Fixed Sidebar Navigation */}
        <div className="community-sidebar">
          <div className="sidebar-header">
            <h3>Community</h3>
            <p>Manage your community</p>
          </div>
          <div className="nav-tabs">
            {sections.map(section => (
              <button
                key={section.id}
                className={`nav-tab ${activeSection === section.id ? 'active' : ''}`}
                onClick={() => setActiveSection(section.id)}
              >
                <section.icon size={18} />
                <span>{section.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Scrollable Content Area */}
        <div className="community-content-area">
          <div className="content-wrapper">
            {activeSection === 'posts' && (
              <div className="settings-section">
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
                    </div>
                  </div>
                </div>

                {/* Posts Management Grid */}
                <div className="admin-posts-grid">
                  {posts.map(post => (
                    <div key={post.id} className="admin-post-card">
                      {/* Post Header */}
                      <div className="admin-post-header">
                        <div className="user-info">
                          <img src={post.userPfp} alt={post.userName} className="user-avatar" />
                          <div className="user-details">
                            <h4>{post.userName}</h4>
                            <span className="post-time">{post.time}</span>
                          </div>
                        </div>
                        <div className="post-actions">
                          <div className="dropdown-container">
                            <button 
                              className="action-btn"
                              onClick={() => setActiveDropdown(activeDropdown === post.id ? null : post.id)}
                            >
                              <MoreVertical size={16} />
                            </button>
                            {activeDropdown === post.id && (
                              <div className="moderation-dropdown">
                                <button className="moderation-dropdown-item approve">
                                  <CheckCircle size={14} />
                                  Approve
                                </button>
                                <button className="moderation-dropdown-item hide">
                                  <Eye size={14} />
                                  Hide
                                </button>
                                <button className="moderation-dropdown-item delete">
                                  <Trash2 size={14} />
                                  Delete
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Post Content */}
                      <div className="admin-post-content">
                        <div className="admin-post-text">
                          <p>{post.content}</p>
                        </div>
                        <button 
                          className="admin-btn-small view-image-btn-full"
                          onClick={() => {
                            setSelectedPostId(post.id);
                            setSelectedImage(post.images[post.currentImageIndex]);
                          }}
                        >
                          <Eye size={14} />
                          View Image
                        </button>
                      </div>

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
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Other sections */}
            {activeSection === 'analytics' && (
              <div className="settings-section">
                <div className="section-header">
                  <h2>Analytics Dashboard</h2>
                  <p>Community engagement and performance metrics</p>
                </div>

                {/* Analytics Overview Cards */}
                <div className="analytics-overview">
                  <div className="analytics-card">
                    <div className="analytics-card-header">
                      <div className="analytics-icon-container primary">
                        <Users size={20} />
                      </div>
                      <div className="analytics-card-info">
                        <h3>Total Users</h3>
                        <p>Active community members</p>
                      </div>
                    </div>
                    <div className="analytics-card-value">
                      <span className="value">12,543</span>
                      <span className="change positive">+12.5%</span>
                    </div>
                  </div>

                  <div className="analytics-card">
                    <div className="analytics-card-header">
                      <div className="analytics-icon-container success">
                        <MessageCircle size={20} />
                      </div>
                      <div className="analytics-card-info">
                        <h3>Total Posts</h3>
                        <p>Community content</p>
                      </div>
                    </div>
                    <div className="analytics-card-value">
                      <span className="value">3,847</span>
                      <span className="change positive">+8.2%</span>
                    </div>
                  </div>

                  <div className="analytics-card">
                    <div className="analytics-card-header">
                      <div className="analytics-icon-container warning">
                        <Heart size={20} />
                      </div>
                      <div className="analytics-card-info">
                        <h3>Engagement Rate</h3>
                        <p>Likes & interactions</p>
                      </div>
                    </div>
                    <div className="analytics-card-value">
                      <span className="value">68.4%</span>
                      <span className="change positive">+5.1%</span>
                    </div>
                  </div>

                  <div className="analytics-card">
                    <div className="analytics-card-header">
                      <div className="analytics-icon-container info">
                        <Eye size={20} />
                      </div>
                      <div className="analytics-card-info">
                        <h3>Total Views</h3>
                        <p>Content impressions</p>
                      </div>
                    </div>
                    <div className="analytics-card-value">
                      <span className="value">89.2K</span>
                      <span className="change positive">+18.7%</span>
                    </div>
                  </div>
                </div>

                {/* Charts Section */}
                <div className="analytics-charts">
                  <div className="chart-container">
                    <div className="chart-header">
                      <h3>Post Activity Trend</h3>
                      <div className="chart-controls">
                        <select 
                          className="chart-select"
                          value={chartPeriod}
                          onChange={(e) => setChartPeriod(e.target.value)}
                        >
                          <option value="7days">Last 7 days</option>
                          <option value="30days">Last 30 days</option>
                          <option value="3months">Last 3 months</option>
                        </select>
                      </div>
                    </div>
                    <div className="chart-content">
                      <div className="mock-chart">
                        <div className="chart-bars">
                          {getChartData().data.map((height, index) => (
                            <div 
                              key={index} 
                              className="chart-bar" 
                              style={{height: `${height}%`}}
                            ></div>
                          ))}
                        </div>
                        <div className="chart-labels">
                          {getChartData().labels.map((label, index) => (
                            <span key={index}>{label}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="chart-container">
                    <div className="chart-header">
                      <h3>Content Categories</h3>
                      <div className="chart-controls">
                        <button className="chart-btn">Export</button>
                      </div>
                    </div>
                    <div className="chart-content">
                      <div className="category-breakdown">
                        <div className="category-item">
                          <div className="category-info">
                            <span className="category-name">Reviews</span>
                            <span className="category-count">1,234</span>
                          </div>
                          <div className="category-progress">
                            <div className="progress-bar" style={{width: '65%'}}></div>
                          </div>
                        </div>
                        <div className="category-item">
                          <div className="category-info">
                            <span className="category-name">Spots</span>
                            <span className="category-count">892</span>
                          </div>
                          <div className="category-progress">
                            <div className="progress-bar" style={{width: '47%'}}></div>
                          </div>
                        </div>
                        <div className="category-item">
                          <div className="category-info">
                            <span className="category-name">Events</span>
                            <span className="category-count">567</span>
                          </div>
                          <div className="category-progress">
                            <div className="progress-bar" style={{width: '30%'}}></div>
                          </div>
                        </div>
                        <div className="category-item">
                          <div className="category-info">
                            <span className="category-name">Discussion</span>
                            <span className="category-count">445</span>
                          </div>
                          <div className="category-progress">
                            <div className="progress-bar" style={{width: '23%'}}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Top Performers */}
                <div className="top-performers">
                  <div className="performers-header">
                    <h3>Top Performing Posts</h3>
                    <button className="view-all-btn">View All</button>
                  </div>
                  <div className="performers-list">
                    <div className="performer-item">
                      <div className="performer-content">
                        <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=100&auto=format&fit=crop" alt="User" className="performer-avatar" />
                        <div className="performer-info">
                          <h4>Sarah Johnson</h4>
                          <p>Best brunch spot I've found this month...</p>
                        </div>
                      </div>
                      <div className="performer-stats">
                        <div className="stat-item">
                          <Eye size={14} />
                          <span>2.1K</span>
                        </div>
                        <div className="stat-item">
                          <Heart size={14} />
                          <span>342</span>
                        </div>
                        <div className="stat-item">
                          <MessageCircle size={14} />
                          <span>89</span>
                        </div>
                      </div>
                    </div>

                    <div className="performer-item">
                      <div className="performer-content">
                        <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop" alt="User" className="performer-avatar" />
                        <div className="performer-info">
                          <h4>Mike Chen</h4>
                          <p>Coffee lovers, you need to try this new cafe...</p>
                        </div>
                      </div>
                      <div className="performer-stats">
                        <div className="stat-item">
                          <Eye size={14} />
                          <span>1.8K</span>
                        </div>
                        <div className="stat-item">
                          <Heart size={14} />
                          <span>256</span>
                        </div>
                        <div className="stat-item">
                          <MessageCircle size={14} />
                          <span>67</span>
                        </div>
                      </div>
                    </div>

                    <div className="performer-item">
                      <div className="performer-content">
                        <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=100&auto=format&fit=crop" alt="User" className="performer-avatar" />
                        <div className="performer-info">
                          <h4>Emma Wilson</h4>
                          <p>Just discovered this amazing hidden gem...</p>
                        </div>
                      </div>
                      <div className="performer-stats">
                        <div className="stat-item">
                          <Eye size={14} />
                          <span>1.5K</span>
                        </div>
                        <div className="stat-item">
                          <Heart size={14} />
                          <span>198</span>
                        </div>
                        <div className="stat-item">
                          <MessageCircle size={14} />
                          <span>45</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'moderation' && (
              <div className="settings-section">
                <div className="section-header">
                  <h2>Content Moderation</h2>
                  <p>Review and moderate community content</p>
                </div>

                {/* Moderation Stats */}
                <div className="moderation-stats">
                  <div className="stat-card flagged">
                    <div className="stat-icon">
                      <Flag size={20} />
                    </div>
                    <div className="stat-info">
                      <h3>4</h3>
                      <p>Reported Posts</p>
                    </div>
                  </div>
                  <div className="stat-card pending">
                    <div className="stat-icon">
                      <Clock size={20} />
                    </div>
                    <div className="stat-info">
                      <h3>18</h3>
                      <p>Total Reports</p>
                    </div>
                  </div>
                  <div className="stat-card removed">
                    <div className="stat-icon">
                      <Trash2 size={20} />
                    </div>
                    <div className="stat-info">
                      <h3>2</h3>
                      <p>Removed Today</p>
                    </div>
                  </div>
                </div>

                {/* Moderation Queue */}
                <div className="moderation-queue">
                  <div className="queue-header">
                    <h3>Moderation Queue</h3>
                    <div className="queue-filters">
                      <select className="filter-select" defaultValue="flagged">
                        <option value="flagged">Reported Content</option>
                        <option value="all">All Content</option>
                        <option value="pending">Pending Review</option>
                        <option value="approved">Approved</option>
                        <option value="removed">Removed</option>
                      </select>
                      <button className="refresh-btn">
                        <RefreshCw size={16} />
                        Refresh
                      </button>
                    </div>
                  </div>

                  <div className="queue-list">
                    <div className="queue-item flagged">
                      <div className="item-content">
                        <div className="item-header">
                          <div className="user-info">
                            <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=40&auto=format&fit=crop" alt="User" className="user-avatar-small" />
                            <div className="user-details">
                              <h4>Jane Smith</h4>
                              <span className="post-time">1 hour ago</span>
                            </div>
                          </div>
                          <div className="item-status flagged">Flagged</div>
                        </div>
                        <div className="item-body">
                          <p>This place is terrible! Worst service ever, completely overpriced and the food was cold. Don't waste your time or money here.</p>
                        </div>
                        <div className="item-meta">
                          <span className="report-count">5 reports</span>
                          <span className="category">Review</span>
                        </div>
                      </div>
                      <div className="item-actions">
                        <button className="action-btn approve">
                          <CheckCircle size={16} />
                          Approve
                        </button>
                        <button className="action-btn hide">
                          <Eye size={16} />
                          Hide
                        </button>
                        <button className="action-btn remove">
                          <Trash2 size={16} />
                          Remove
                        </button>
                      </div>
                    </div>

                    <div className="queue-item flagged">
                      <div className="item-content">
                        <div className="item-header">
                          <div className="user-info">
                            <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=40&auto=format&fit=crop" alt="User" className="user-avatar-small" />
                            <div className="user-details">
                              <h4>John Doe</h4>
                              <span className="post-time">2 hours ago</span>
                            </div>
                          </div>
                          <div className="item-status flagged">Flagged</div>
                        </div>
                        <div className="item-body">
                          <p>Spam content with promotional links and fake reviews. This user is posting multiple similar reviews across different restaurants.</p>
                          <div className="item-images">
                            <img src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=100&auto=format&fit=crop" alt="Post image" className="item-image" />
                          </div>
                        </div>
                        <div className="item-meta">
                          <span className="report-count">3 reports</span>
                          <span className="category">Review</span>
                        </div>
                      </div>
                      <div className="item-actions">
                        <button className="action-btn approve">
                          <CheckCircle size={16} />
                          Approve
                        </button>
                        <button className="action-btn hide">
                          <Eye size={16} />
                          Hide
                        </button>
                        <button className="action-btn remove">
                          <Trash2 size={16} />
                          Remove
                        </button>
                      </div>
                    </div>

                    <div className="queue-item flagged">
                      <div className="item-content">
                        <div className="item-header">
                          <div className="user-info">
                            <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=40&auto=format&fit=crop" alt="User" className="user-avatar-small" />
                            <div className="user-details">
                              <h4>Anonymous User</h4>
                              <span className="post-time">3 hours ago</span>
                            </div>
                          </div>
                          <div className="item-status flagged">Flagged</div>
                        </div>
                        <div className="item-body">
                          <p>Inappropriate language and offensive content. This post contains hate speech and personal attacks against other users.</p>
                        </div>
                        <div className="item-meta">
                          <span className="report-count">8 reports</span>
                          <span className="category">Discussion</span>
                        </div>
                      </div>
                      <div className="item-actions">
                        <button className="action-btn approve">
                          <CheckCircle size={16} />
                          Approve
                        </button>
                        <button className="action-btn hide">
                          <Eye size={16} />
                          Hide
                        </button>
                        <button className="action-btn remove">
                          <Trash2 size={16} />
                          Remove
                        </button>
                      </div>
                    </div>

                    <div className="queue-item flagged">
                      <div className="item-content">
                        <div className="item-header">
                          <div className="user-info">
                            <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=40&auto=format&fit=crop" alt="User" className="user-avatar-small" />
                            <div className="user-details">
                              <h4>Mystery Reviewer</h4>
                              <span className="post-time">5 hours ago</span>
                            </div>
                          </div>
                          <div className="item-status flagged">Flagged</div>
                        </div>
                        <div className="item-body">
                          <p>Fake review - this person has never actually visited the restaurant. They are posting false information to harm the business reputation.</p>
                        </div>
                        <div className="item-meta">
                          <span className="report-count">2 reports</span>
                          <span className="category">Review</span>
                        </div>
                      </div>
                      <div className="item-actions">
                        <button className="action-btn approve">
                          <CheckCircle size={16} />
                          Approve
                        </button>
                        <button className="action-btn hide">
                          <Eye size={16} />
                          Hide
                        </button>
                        <button className="action-btn remove">
                          <Trash2 size={16} />
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Moderation Rules */}
                <div className="moderation-rules">
                  <div className="rules-header">
                    <h3>Moderation Rules</h3>
                    <button className="add-rule-btn">
                      <Plus size={16} />
                      Add Rule
                    </button>
                  </div>
                  <div className="rules-list">
                    <div className="rule-item">
                      <div className="rule-info">
                        <h4>No Spam or Promotional Content</h4>
                        <p>Automatically remove posts containing excessive promotional language or links</p>
                      </div>
                      <div className="rule-status active">
                        <label className="toggle-switch">
                          <input type="checkbox" defaultChecked />
                          <span className="toggle-slider"></span>
                        </label>
                      </div>
                    </div>
                    <div className="rule-item">
                      <div className="rule-info">
                        <h4>Inappropriate Language Filter</h4>
                        <p>Flag posts containing profanity or inappropriate language for manual review</p>
                      </div>
                      <div className="rule-status active">
                        <label className="toggle-switch">
                          <input type="checkbox" defaultChecked />
                          <span className="toggle-slider"></span>
                        </label>
                      </div>
                    </div>
                    <div className="rule-item">
                      <div className="rule-info">
                        <h4>Duplicate Content Detection</h4>
                        <p>Identify and flag potentially duplicate or copied content</p>
                      </div>
                      <div className="rule-status inactive">
                        <label className="toggle-switch">
                          <input type="checkbox" />
                          <span className="toggle-slider"></span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'settings' && (
              <div className="settings-section">
                <div className="section-header">
                  <h2>Community Settings</h2>
                  <p>Configure community preferences and policies</p>
                </div>

                {/* General Settings */}
                <div className="settings-group">
                  <div className="settings-group-header">
                    <h3>General Settings</h3>
                    <p>Basic community configuration</p>
                  </div>
                  <div className="settings-grid">
                    <div className="setting-item">
                      <label className="setting-label">
                        Community Name
                        <small>The name displayed to users</small>
                      </label>
                      <input 
                        type="text" 
                        className="setting-input" 
                        defaultValue="Chai-In Community"
                        placeholder="Enter community name"
                      />
                    </div>
                    <div className="setting-item">
                      <label className="setting-label">
                        Community Description
                        <small>Brief description of your community</small>
                      </label>
                      <textarea 
                        className="setting-textarea" 
                        defaultValue="A vibrant community for food lovers and restaurant enthusiasts to share experiences, reviews, and discover amazing dining spots."
                        placeholder="Enter community description"
                        rows="3"
                      ></textarea>
                    </div>
                    <div className="setting-item">
                      <label className="setting-label">
                        Community Type
                        <small>Choose the type of community</small>
                      </label>
                      <select className="setting-input">
                        <option>Public</option>
                        <option>Private</option>
                        <option>Restricted</option>
                      </select>
                    </div>
                    <div className="setting-item">
                      <label className="setting-label">
                        Default Language
                        <small>Primary language for the community</small>
                      </label>
                      <select className="setting-input">
                        <option>English</option>
                        <option>Spanish</option>
                        <option>French</option>
                        <option>German</option>
                        <option>Chinese</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Posting Guidelines */}
                <div className="settings-group">
                  <div className="settings-group-header">
                    <h3>Posting Guidelines</h3>
                    <p>Rules and guidelines for community posts</p>
                  </div>
                  <div className="settings-grid">
                    <div className="setting-item">
                      <label className="setting-label">
                        Minimum Post Length
                        <small>Minimum characters required for posts</small>
                      </label>
                      <input 
                        type="number" 
                        className="setting-input" 
                        defaultValue="50"
                        min="10"
                        max="1000"
                      />
                    </div>
                    <div className="setting-item">
                      <label className="setting-label">
                        Maximum Images per Post
                        <small>Limit images users can upload</small>
                      </label>
                      <input 
                        type="number" 
                        className="setting-input" 
                        defaultValue="5"
                        min="1"
                        max="10"
                      />
                    </div>
                    <div className="setting-item">
                      <label className="setting-label">
                        Allow External Links
                        <small>Users can include links in posts</small>
                      </label>
                      <label className="toggle-switch">
                        <input type="checkbox" defaultChecked />
                        <span className="toggle-slider"></span>
                      </label>
                    </div>
                    <div className="setting-item">
                      <label className="setting-label">
                        Require Post Approval
                        <small>All posts need moderator approval</small>
                      </label>
                      <label className="toggle-switch">
                        <input type="checkbox" />
                        <span className="toggle-slider"></span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Moderation Settings */}
                <div className="settings-group">
                  <div className="settings-group-header">
                    <h3>Moderation Settings</h3>
                    <p>Configure content moderation policies</p>
                  </div>
                  <div className="settings-grid">
                    <div className="setting-item">
                      <label className="setting-label">
                        Auto-Moderation
                        <small>Automatically detect and flag inappropriate content</small>
                      </label>
                      <label className="toggle-switch">
                        <input type="checkbox" defaultChecked />
                        <span className="toggle-slider"></span>
                      </label>
                    </div>
                    <div className="setting-item">
                      <label className="setting-label">
                        Report Threshold
                        <small>Number of reports before auto-removal</small>
                      </label>
                      <input 
                        type="number" 
                        className="setting-input" 
                        defaultValue="5"
                        min="1"
                        max="20"
                      />
                    </div>
                    <div className="setting-item">
                      <label className="setting-label">
                        Blocked Words
                        <small>Words to automatically filter</small>
                      </label>
                      <textarea 
                        className="setting-textarea" 
                        defaultValue="spam, fake, scam, inappropriate, offensive"
                        placeholder="Enter blocked words separated by commas"
                        rows="2"
                      ></textarea>
                    </div>
                    <div className="setting-item">
                      <label className="setting-label">
                        User Report Limit
                        <small>Max reports per user per day</small>
                      </label>
                      <input 
                        type="number" 
                        className="setting-input" 
                        defaultValue="10"
                        min="1"
                        max="50"
                      />
                    </div>
                  </div>
                </div>

                {/* Notification Settings */}
                <div className="settings-group">
                  <div className="settings-group-header">
                    <h3>Notification Settings</h3>
                    <p>Configure community notifications</p>
                  </div>
                  <div className="settings-grid">
                    <div className="setting-item">
                      <label className="setting-label">
                        New Post Notifications
                        <small>Notify moderators of new posts</small>
                      </label>
                      <label className="toggle-switch">
                        <input type="checkbox" defaultChecked />
                        <span className="toggle-slider"></span>
                      </label>
                    </div>
                    <div className="setting-item">
                      <label className="setting-label">
                        Report Notifications
                        <small>Notify when content is reported</small>
                      </label>
                      <label className="toggle-switch">
                        <input type="checkbox" defaultChecked />
                        <span className="toggle-slider"></span>
                      </label>
                    </div>
                    <div className="setting-item">
                      <label className="setting-label">
                        User Join Notifications
                        <small>Notify when new users join</small>
                      </label>
                      <label className="toggle-switch">
                        <input type="checkbox" />
                        <span className="toggle-slider"></span>
                      </label>
                    </div>
                    <div className="setting-item">
                      <label className="setting-label">
                        Email Notifications
                        <small>Send notifications via email</small>
                      </label>
                      <label className="toggle-switch">
                        <input type="checkbox" defaultChecked />
                        <span className="toggle-slider"></span>
                      </label>
                    </div>
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

      {/* Image Popup Modal */}
      {selectedImage && (
        <div className="image-popup-overlay" onClick={() => {
          setSelectedImage(null);
          setSelectedPostId(null);
        }}>
          <div className="image-popup" onClick={(e) => e.stopPropagation()}>
            <div className="image-popup-header">
              <h3>Image Viewer</h3>
              <button 
                className="popup-close-btn"
                onClick={() => {
                  setSelectedImage(null);
                  setSelectedPostId(null);
                }}
              >
                <X size={20} />
              </button>
            </div>
            <div className="image-popup-content">
              <img src={selectedImage} alt="Selected image" />
            </div>
            <div className="image-popup-navigation">
              <button 
                className="popup-nav-btn prev"
                onClick={() => {
                  if (selectedPostId) {
                    handleImageNavigation(selectedPostId, 'prev');
                    const post = posts.find(p => p.id === selectedPostId);
                    if (post) {
                      setSelectedImage(post.images[post.currentImageIndex]);
                    }
                  }
                }}
              >
                <ChevronLeft size={20} />
              </button>
              <button 
                className="popup-nav-btn next"
                onClick={() => {
                  if (selectedPostId) {
                    handleImageNavigation(selectedPostId, 'next');
                    const post = posts.find(p => p.id === selectedPostId);
                    if (post) {
                      setSelectedImage(post.images[post.currentImageIndex]);
                    }
                  }
                }}
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
