import React, { useState } from 'react';
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
  X
} from 'lucide-react';
import './CommunityPage.css';

export default function CommunityPage() {
  const [activeSection, setActiveSection] = useState('posts');
  const [searchTerm, setSearchTerm] = useState('');
  const [savedSettings, setSavedSettings] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedPostId, setSelectedPostId] = useState(null);

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
      views: 890,
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
      views: 2100,
      category: 'spot',
      priority: 'featured'
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
                {section.name}
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
                      {/* Post Priority Badge */}
                      {post.priority === 'featured' && (
                        <div className="priority-badge featured">
                          <Star size={14} />
                          Featured
                        </div>
                      )}

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
                          <button className="action-btn">
                            <MoreVertical size={16} />
                          </button>
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
            {activeSection === 'users' && (
              <div className="settings-section">
                <div className="section-header">
                  <h2>User Management</h2>
                  <p>Manage community users and permissions</p>
                </div>
              </div>
            )}

            {activeSection === 'analytics' && (
              <div className="settings-section">
                <div className="section-header">
                  <h2>Analytics Dashboard</h2>
                  <p>Community engagement and performance metrics</p>
                </div>
              </div>
            )}

            {activeSection === 'moderation' && (
              <div className="settings-section">
                <div className="section-header">
                  <h2>Content Moderation</h2>
                  <p>Review and moderate community content</p>
                </div>
              </div>
            )}

            {activeSection === 'settings' && (
              <div className="settings-section">
                <div className="section-header">
                  <h2>Community Settings</h2>
                  <p>Configure community preferences and policies</p>
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
