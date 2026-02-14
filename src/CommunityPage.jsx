import React, { useState } from 'react';
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
  Upload
} from 'lucide-react';
import './CommunityPage.css';

export default function CommunityPage() {
  const [activeSection, setActiveSection] = useState('posts');
  const [searchTerm, setSearchTerm] = useState('');
  const [savedSettings, setSavedSettings] = useState(false);

  // Mock posts data matching Flutter app structure
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
      reports: 0
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
      reports: 0
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
      reports: 0
    }
  ]);

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
                <h2>Community Posts</h2>
                <p>Manage user-generated content and interactions</p>
              </div>

              {/* Search and Filter Bar */}
              <div className="posts-toolbar">
                <div className="search-box">
                  <Search size={18} />
                  <input 
                    type="text" 
                    placeholder="Search posts..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="filter-dropdown">
                  <Filter size={18} />
                  <select>
                    <option>All Posts</option>
                    <option>Most Liked</option>
                    <option>Most Commented</option>
                    <option>Recent</option>
                  </select>
                </div>
                <button className="btn-primary">
                  <Plus size={18} />
                  Create Post
                </button>
              </div>

              {/* Posts Feed */}
              <div className="posts-feed">
                {filteredPosts.map(post => (
                  <div key={post.id} className="post-card">
                    {/* Post Header */}
                    <div className="post-header">
                      <div className="user-info">
                        <img src={post.userPfp} alt={post.userName} className="user-pfp" />
                        <div className="user-details">
                          <div className="user-name">{post.userName}</div>
                          <div className="post-time">{post.time}</div>
                        </div>
                      </div>
                      <div className="post-actions">
                        <button className="btn-icon">
                          <MoreVertical size={16} />
                        </button>
                      </div>
                    </div>

                    {/* Post Content */}
                    <div className="post-content">
                      <p>{post.content}</p>
                    </div>

                    {/* Post Images */}
                    {post.images.length > 0 && (
                      <div className="post-images">
                        <div className="image-carousel">
                          <img 
                            src={post.images[post.currentImageIndex]} 
                            alt="Post image" 
                            className="main-image"
                          />
                          {post.images.length > 1 && (
                            <div className="image-indicator">
                              {post.currentImageIndex + 1}/{post.images.length}
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Engagement Bar */}
                    <div className="engagement-bar">
                      <div className="engagement-left">
                        <button 
                          className={`engagement-btn ${post.isLiked ? 'liked' : ''}`}
                          onClick={() => handleToggleLike(post.id)}
                        >
                          <Heart size={16} fill={post.isLiked ? 'currentColor' : 'none'} />
                          <span>{post.likes}</span>
                        </button>
                        <button className="engagement-btn">
                          <MessageCircle size={16} />
                          <span>{post.comments}</span>
                        </button>
                      </div>
                      <div className="engagement-right">
                        <button 
                          className={`engagement-btn ${post.isSaved ? 'saved' : ''}`}
                          onClick={() => handleToggleSave(post.id)}
                        >
                          <Bookmark size={16} fill={post.isSaved ? 'currentColor' : 'none'} />
                        </button>
                        <button className="engagement-btn">
                          <Eye size={16} />
                        </button>
                        <button className="engagement-btn">
                          <Flag size={16} />
                        </button>
                        <button 
                          className="engagement-btn danger"
                          onClick={() => handleDeletePost(post.id)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>

                    {/* Post Status */}
                    {post.reports > 0 && (
                      <div className="post-status">
                        {getStatusBadge(post.status)}
                        <span className="report-count">{post.reports} reports</span>
                      </div>
                    )}
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
                  <div className="metric-value">{posts.length}</div>
                  <div className="metric-change">+12% this week</div>
                </div>

                <div className="metric-card">
                  <div className="metric-header">
                    <Users size={24} />
                    <span>Active Users</span>
                  </div>
                  <div className="metric-value">1,234</div>
                  <div className="metric-change positive">+8% this month</div>
                </div>

                <div className="metric-card">
                  <div className="metric-header">
                    <Heart size={24} />
                    <span>Total Likes</span>
                  </div>
                  <div className="metric-value">{posts.reduce((sum, post) => sum + post.likes, 0)}</div>
                  <div className="metric-change positive">+15% this month</div>
                </div>

                <div className="metric-card">
                  <div className="metric-header">
                    <MessageCircle size={24} />
                    <span>Total Comments</span>
                  </div>
                  <div className="metric-value">{posts.reduce((sum, post) => sum + post.comments, 0)}</div>
                  <div className="metric-change">+5% this month</div>
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
                        <span>{post.reports} reports</span>
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
