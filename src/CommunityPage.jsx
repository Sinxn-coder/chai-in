import React, { useState } from 'react';
import { 
  MessageSquare, 
  Users, 
  Calendar, 
  TrendingUp, 
  Shield, 
  Settings, 
  FileText, 
  Heart, 
  MessageCircle, 
  Flag, 
  ThumbsUp, 
  Eye, 
  BarChart3, 
  Clock, 
  MapPin, 
  Star, 
  Award, 
  AlertTriangle,
  CheckCircle,
  X,
  Edit,
  Trash2,
  Plus,
  Search,
  Filter,
  Download,
  Upload
} from 'lucide-react';
import './CommunityPage.css';

export default function CommunityPage() {
  const [activeSection, setActiveSection] = useState('guidelines');
  const [savedSettings, setSavedSettings] = useState(false);

  // Community Guidelines State
  const [guidelines, setGuidelines] = useState({
    communityRules: true,
    postingGuidelines: true,
    reviewPolicies: true,
    spotSubmissionRules: true,
    userConductPolicy: true,
    moderationPolicy: true,
    privacyGuidelines: true,
    spamPolicy: true
  });

  // Discussions State
  const [discussions, setDiscussions] = useState([
    {
      id: 1,
      title: "Welcome to the Community!",
      author: "Admin",
      category: "Announcements",
      replies: 45,
      views: 1200,
      lastActivity: "2 hours ago",
      pinned: true,
      status: "active"
    },
    {
      id: 2,
      title: "Best practices for spot reviews",
      author: "John Doe",
      category: "Tips & Tricks",
      replies: 23,
      views: 890,
      lastActivity: "5 hours ago",
      pinned: false,
      status: "active"
    },
    {
      id: 3,
      title: "Community meetup - NYC",
      author: "Jane Smith",
      category: "Events",
      replies: 67,
      views: 2100,
      lastActivity: "1 day ago",
      pinned: true,
      status: "active"
    }
  ]);

  // Events State
  const [events, setEvents] = useState([
    {
      id: 1,
      title: "Community Coffee Meetup",
      date: "2024-03-15",
      time: "3:00 PM",
      location: "Central Perk Cafe",
      attendees: 24,
      maxAttendees: 50,
      status: "upcoming",
      description: "Monthly community meetup to discuss new spots and share experiences"
    },
    {
      id: 2,
      title: "Photography Walk",
      date: "2024-03-20",
      time: "10:00 AM",
      location: "Riverside Park",
      attendees: 15,
      maxAttendees: 30,
      status: "upcoming",
      description: "Photography walk to capture and review new spots"
    }
  ]);

  // Moderation State
  const [moderation, setModeration] = useState({
    autoModeration: true,
    profanityFilter: true,
    spamDetection: true,
    requireApproval: false,
    reportThreshold: 3,
    banDuration: 7,
    warningSystem: true
  });

  // Community Analytics State
  const [analytics, setAnalytics] = useState({
    totalMembers: 2847,
    activeUsers: 892,
    newMembersThisMonth: 156,
    totalDiscussions: 1234,
    totalEvents: 45,
    engagementRate: 78,
    topContributors: [
      { name: "John Doe", contributions: 234, badge: "gold" },
      { name: "Jane Smith", contributions: 189, badge: "silver" },
      { name: "Mike Johnson", contributions: 156, badge: "bronze" }
    ]
  });

  const sections = [
    { id: 'guidelines', name: 'Guidelines', icon: FileText },
    { id: 'discussions', name: 'Discussions', icon: MessageSquare },
    { id: 'events', name: 'Events', icon: Calendar },
    { id: 'moderation', name: 'Moderation', icon: Shield },
    { id: 'analytics', name: 'Analytics', icon: BarChart3 },
    { id: 'settings', name: 'Settings', icon: Settings }
  ];

  const handleToggle = (section, field) => {
    switch (section) {
      case 'guidelines':
        setGuidelines(prev => ({ ...prev, [field]: !prev[field] }));
        break;
      case 'moderation':
        setModeration(prev => ({ ...prev, [field]: !prev[field] }));
        break;
      default:
        break;
    }
  };

  const handleSaveSettings = () => {
    setSavedSettings(true);
    setTimeout(() => setSavedSettings(false), 2000);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return <span className="status-badge active">Active</span>;
      case 'upcoming':
        return <span className="status-badge upcoming">Upcoming</span>;
      case 'pinned':
        return <span className="status-badge pinned">Pinned</span>;
      default:
        return <span className="status-badge">Unknown</span>;
    }
  };

  const getBadgeIcon = (badge) => {
    switch (badge) {
      case 'gold':
        return <Award className="badge-icon gold" />;
      case 'silver':
        return <Award className="badge-icon silver" />;
      case 'bronze':
        return <Award className="badge-icon bronze" />;
      default:
        return <Award className="badge-icon" />;
    }
  };

  return (
    <div className="community-page">
      <div className="community-header">
        <h1>Community Management</h1>
        <p>Manage community guidelines, discussions, events, and user interactions</p>
      </div>

      <div className="community-layout">
        {/* Sidebar Navigation */}
        <div className="community-sidebar">
          <div className="sidebar-header">
            <h3>Community</h3>
            <p>Choose a section</p>
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
          {activeSection === 'guidelines' && (
            <div className="content-section">
              <div className="section-header">
                <h2>Community Guidelines</h2>
                <p>Configure community rules and content policies</p>
              </div>

              <div className="guidelines-grid">
                <div className="guideline-item">
                  <div className="guideline-info">
                    <div className="guideline-header">
                      <FileText size={18} />
                      <span>Community Rules</span>
                    </div>
                    <p>General community conduct and behavior guidelines</p>
                  </div>
                  <label className="toggle-switch">
                    <input 
                      type="checkbox" 
                      checked={guidelines.communityRules}
                      onChange={() => handleToggle('guidelines', 'communityRules')}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="guideline-item">
                  <div className="guideline-info">
                    <div className="guideline-header">
                      <Star size={18} />
                      <span>Posting Guidelines</span>
                    </div>
                    <p>Rules for posting reviews and spot submissions</p>
                  </div>
                  <label className="toggle-switch">
                    <input 
                      type="checkbox" 
                      checked={guidelines.postingGuidelines}
                      onChange={() => handleToggle('guidelines', 'postingGuidelines')}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="guideline-item">
                  <div className="guideline-info">
                    <div className="guideline-header">
                      <Shield size={18} />
                      <span>Review Policies</span>
                    </div>
                    <p>Specific policies for review content and quality</p>
                  </div>
                  <label className="toggle-switch">
                    <input 
                      type="checkbox" 
                      checked={guidelines.reviewPolicies}
                      onChange={() => handleToggle('guidelines', 'reviewPolicies')}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="guideline-item">
                  <div className="guideline-info">
                    <div className="guideline-header">
                      <MapPin size={18} />
                      <span>Spot Submission Rules</span>
                    </div>
                    <p>Guidelines for submitting new spots</p>
                  </div>
                  <label className="toggle-switch">
                    <input 
                      type="checkbox" 
                      checked={guidelines.spotSubmissionRules}
                      onChange={() => handleToggle('guidelines', 'spotSubmissionRules')}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="guideline-item">
                  <div className="guideline-info">
                    <div className="guideline-header">
                      <Users size={18} />
                      <span>User Conduct Policy</span>
                    </div>
                    <p>Expected behavior and user interaction policies</p>
                  </div>
                  <label className="toggle-switch">
                    <input 
                      type="checkbox" 
                      checked={guidelines.userConductPolicy}
                      onChange={() => handleToggle('guidelines', 'userConductPolicy')}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="guideline-item">
                  <div className="guideline-info">
                    <div className="guideline-header">
                      <AlertTriangle size={18} />
                      <span>Moderation Policy</span>
                    </div>
                    <p>How content moderation is handled</p>
                  </div>
                  <label className="toggle-switch">
                    <input 
                      type="checkbox" 
                      checked={guidelines.moderationPolicy}
                      onChange={() => handleToggle('guidelines', 'moderationPolicy')}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'discussions' && (
            <div className="content-section">
              <div className="section-header">
                <h2>Community Discussions</h2>
                <p>Manage and moderate community discussions</p>
              </div>

              <div className="discussions-toolbar">
                <div className="toolbar-left">
                  <div className="search-box">
                    <Search size={18} />
                    <input type="text" placeholder="Search discussions..." />
                  </div>
                  <div className="filter-dropdown">
                    <Filter size={18} />
                    <select>
                      <option>All Categories</option>
                      <option>Announcements</option>
                      <option>Tips & Tricks</option>
                      <option>Events</option>
                      <option>General</option>
                    </select>
                  </div>
                </div>
                <div className="toolbar-right">
                  <button className="btn-primary">
                    <Plus size={18} />
                    New Discussion
                  </button>
                </div>
              </div>

              <div className="discussions-list">
                {discussions.map(discussion => (
                  <div key={discussion.id} className="discussion-item">
                    <div className="discussion-content">
                      <div className="discussion-header">
                        <h3 className="discussion-title">
                          {discussion.pinned && <Flag size={16} className="pinned-icon" />}
                          {discussion.title}
                        </h3>
                        <div className="discussion-meta">
                          <span className="author">by {discussion.author}</span>
                          <span className="category">{discussion.category}</span>
                          {getStatusBadge(discussion.pinned ? 'pinned' : discussion.status)}
                        </div>
                      </div>
                      <div className="discussion-stats">
                        <div className="stat">
                          <MessageCircle size={16} />
                          <span>{discussion.replies}</span>
                        </div>
                        <div className="stat">
                          <Eye size={16} />
                          <span>{discussion.views}</span>
                        </div>
                        <div className="stat">
                          <Clock size={16} />
                          <span>{discussion.lastActivity}</span>
                        </div>
                      </div>
                    </div>
                    <div className="discussion-actions">
                      <button className="btn-icon">
                        <Edit size={16} />
                      </button>
                      <button className="btn-icon">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === 'events' && (
            <div className="content-section">
              <div className="section-header">
                <h2>Community Events</h2>
                <p>Manage community meetups and events</p>
              </div>

              <div className="events-toolbar">
                <button className="btn-primary">
                  <Plus size={18} />
                  Create Event
                </button>
              </div>

              <div className="events-grid">
                {events.map(event => (
                  <div key={event.id} className="event-card">
                    <div className="event-header">
                      <h3 className="event-title">{event.title}</h3>
                      {getStatusBadge(event.status)}
                    </div>
                    <div className="event-details">
                      <div className="event-info">
                        <Calendar size={16} />
                        <span>{event.date}</span>
                      </div>
                      <div className="event-info">
                        <Clock size={16} />
                        <span>{event.time}</span>
                      </div>
                      <div className="event-info">
                        <MapPin size={16} />
                        <span>{event.location}</span>
                      </div>
                    </div>
                    <div className="event-description">
                      <p>{event.description}</p>
                    </div>
                    <div className="event-attendees">
                      <div className="attendee-count">
                        <Users size={16} />
                        <span>{event.attendees}/{event.maxAttendees}</span>
                      </div>
                      <div className="attendee-bar">
                        <div 
                          className="attendee-progress" 
                          style={{ width: `${(event.attendees / event.maxAttendees) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="event-actions">
                      <button className="btn-secondary">View Details</button>
                      <button className="btn-primary">Join Event</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === 'moderation' && (
            <div className="content-section">
              <div className="section-header">
                <h2>Moderation Tools</h2>
                <p>Configure content moderation and user management</p>
              </div>

              <div className="moderation-grid">
                <div className="moderation-item">
                  <div className="moderation-info">
                    <div className="moderation-header">
                      <Shield size={18} />
                      <span>Auto Moderation</span>
                    </div>
                    <p>Automatically filter and flag inappropriate content</p>
                  </div>
                  <label className="toggle-switch">
                    <input 
                      type="checkbox" 
                      checked={moderation.autoModeration}
                      onChange={() => handleToggle('moderation', 'autoModeration')}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="moderation-item">
                  <div className="moderation-info">
                    <div className="moderation-header">
                      <AlertTriangle size={18} />
                      <span>Profanity Filter</span>
                    </div>
                    <p>Filter out profane language automatically</p>
                  </div>
                  <label className="toggle-switch">
                    <input 
                      type="checkbox" 
                      checked={moderation.profanityFilter}
                      onChange={() => handleToggle('moderation', 'profanityFilter')}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="moderation-item">
                  <div className="moderation-info">
                    <div className="moderation-header">
                      <Flag size={18} />
                      <span>Spam Detection</span>
                    </div>
                    <p>Identify and flag spam content automatically</p>
                  </div>
                  <label className="toggle-switch">
                    <input 
                      type="checkbox" 
                      checked={moderation.spamDetection}
                      onChange={() => handleToggle('moderation', 'spamDetection')}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="moderation-item">
                  <div className="moderation-info">
                    <div className="moderation-header">
                      <CheckCircle size={18} />
                      <span>Require Approval</span>
                    </div>
                    <p>Require admin approval for new posts</p>
                  </div>
                  <label className="toggle-switch">
                    <input 
                      type="checkbox" 
                      checked={moderation.requireApproval}
                      onChange={() => handleToggle('moderation', 'requireApproval')}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="moderation-item">
                  <label>Report Threshold</label>
                  <input 
                    type="number" 
                    value={moderation.reportThreshold}
                    onChange={(e) => setModeration(prev => ({ ...prev, reportThreshold: parseInt(e.target.value) }))}
                    className="setting-input" 
                    min="1"
                    max="10"
                  />
                  <small>Number of reports before auto-action</small>
                </div>

                <div className="moderation-item">
                  <label>Ban Duration (days)</label>
                  <input 
                    type="number" 
                    value={moderation.banDuration}
                    onChange={(e) => setModeration(prev => ({ ...prev, banDuration: parseInt(e.target.value) }))}
                    className="setting-input" 
                    min="1"
                    max="365"
                  />
                  <small>Default ban duration for violations</small>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'analytics' && (
            <div className="content-section">
              <div className="section-header">
                <h2>Community Analytics</h2>
                <p>Track community engagement and growth metrics</p>
              </div>

              <div className="analytics-grid">
                <div className="metric-card">
                  <div className="metric-header">
                    <Users size={24} />
                    <span>Total Members</span>
                  </div>
                  <div className="metric-value">{analytics.totalMembers.toLocaleString()}</div>
                  <div className="metric-change positive">+{analytics.newMembersThisMonth} this month</div>
                </div>

                <div className="metric-card">
                  <div className="metric-header">
                    <TrendingUp size={24} />
                    <span>Active Users</span>
                  </div>
                  <div className="metric-value">{analytics.activeUsers.toLocaleString()}</div>
                  <div className="metric-change">Active in last 30 days</div>
                </div>

                <div className="metric-card">
                  <div className="metric-header">
                    <MessageSquare size={24} />
                    <span>Total Discussions</span>
                  </div>
                  <div className="metric-value">{analytics.totalDiscussions.toLocaleString()}</div>
                  <div className="metric-change">All time</div>
                </div>

                <div className="metric-card">
                  <div className="metric-header">
                    <Calendar size={24} />
                    <span>Total Events</span>
                  </div>
                  <div className="metric-value">{analytics.totalEvents}</div>
                  <div className="metric-change">Past 6 months</div>
                </div>

                <div className="metric-card">
                  <div className="metric-header">
                    <Heart size={24} />
                    <span>Engagement Rate</span>
                  </div>
                  <div className="metric-value">{analytics.engagementRate}%</div>
                  <div className="metric-change positive">+5% from last month</div>
                </div>
              </div>

              <div className="top-contributors">
                <h3>Top Contributors</h3>
                <div className="contributors-list">
                  {analytics.topContributors.map((contributor, index) => (
                    <div key={index} className="contributor-item">
                      <div className="contributor-info">
                        <div className="contributor-rank">#{index + 1}</div>
                        <div className="contributor-details">
                          <div className="contributor-name">{contributor.name}</div>
                          <div className="contributor-stats">{contributor.contributions} contributions</div>
                        </div>
                      </div>
                      <div className="contributor-badge">
                        {getBadgeIcon(contributor.badge)}
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
                <p>General community configuration and preferences</p>
              </div>

              <div className="settings-grid">
                <div className="setting-item">
                  <label>Community Name</label>
                  <input 
                    type="text" 
                    defaultValue="Chai-In Community"
                    className="setting-input" 
                  />
                  <small>Display name for your community</small>
                </div>

                <div className="setting-item">
                  <label>Community Description</label>
                  <textarea 
                    defaultValue="A vibrant community for discovering and reviewing amazing spots"
                    className="setting-textarea"
                    rows="3"
                  ></textarea>
                  <small>Brief description of your community</small>
                </div>

                <div className="setting-item">
                  <label>Default Event Location</label>
                  <input 
                    type="text" 
                    defaultValue="New York, NY"
                    className="setting-input" 
                  />
                  <small>Default location for community events</small>
                </div>

                <div className="setting-item">
                  <label>Timezone</label>
                  <select className="setting-input">
                    <option>Eastern Time (ET)</option>
                    <option>Central Time (CT)</option>
                    <option>Mountain Time (MT)</option>
                    <option>Pacific Time (PT)</option>
                  </select>
                  <small>Community timezone for events</small>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="community-actions">
            <button 
              className={`save-btn ${savedSettings ? 'saved' : ''}`}
              onClick={handleSaveSettings}
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
