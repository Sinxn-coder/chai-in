import React, { useState } from 'react';
import { Search, Bell, Settings, RefreshCw, Users, MapPin, Star, DollarSign, TrendingUp, Activity, Clock, MessageSquare, AlertCircle, Plus, BarChart, FileText, UserPlus, Settings as SettingsIcon } from 'lucide-react';

const DashboardPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // Mock data for stats
  const stats = {
    users: 15234,
    spots: 456,
    reviews: 2789,
    revenue: 45678
  };

  // Recent activity data
  const recentActivities = [
    { id: 1, user: 'John Doe', action: 'added new spot "Pizza Palace"', time: '2 hours ago', type: 'spot', avatar: 'https://picsum.photos/seed/user1/40/40' },
    { id: 2, user: 'Jane Smith', action: 'left 5-star review', time: '4 hours ago', type: 'review', avatar: 'https://picsum.photos/seed/user2/40/40' },
    { id: 3, user: 'Bob Johnson', action: 'updated profile information', time: '6 hours ago', type: 'user', avatar: 'https://picsum.photos/seed/user3/40/40' },
    { id: 4, user: 'Alice Brown', action: 'reported issue with payment', time: '8 hours ago', type: 'issue', avatar: 'https://picsum.photos/seed/user4/40/40' },
    { id: 5, user: 'Charlie Wilson', action: 'completed profile verification', time: '12 hours ago', type: 'success', avatar: 'https://picsum.photos/seed/user5/40/40' },
    { id: 6, user: 'Emma Davis', action: 'shared spot with friends', time: '1 day ago', type: 'share', avatar: 'https://picsum.photos/seed/user6/40/40' }
  ];

  // Quick actions data
  const quickActions = [
    { id: 2, title: 'View Analytics', description: 'Check detailed platform analytics', icon: BarChart, color: 'green', action: 'analytics' },
    { id: 3, title: 'Generate Report', description: 'Create and download activity reports', icon: FileText, color: 'orange', action: 'report' },
    { id: 4, title: 'System Settings', description: 'Configure platform preferences', icon: SettingsIcon, color: 'gray', action: 'settings' },
    { id: 5, title: 'Import Data', description: 'Bulk import spots and users', icon: Activity, color: 'teal', action: 'import' }
  ];

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1000);
  };

  const handleQuickAction = (action) => {
    console.log(`Quick action clicked: ${action}`);
    // Handle different actions based on action type
    switch(action) {
      case 'analytics':
        console.log('Showing analytics section...');
        setShowAnalytics(!showAnalytics);
        break;
      case 'report':
        console.log('Generating report section...');
        setShowReport(!showReport);
        break;
      case 'settings':
        console.log('Opening system settings...');
        setShowSettings(!showSettings);
        break;
      case 'import':
        console.log('Opening data import...');
        break;
      default:
        console.log('Unknown action:', action);
    }
  };

  return (
    <div className="dashboard-page">
      {/* Header Section */}
      <div className="dashboard-header">
        <div className="header-content">
          <div className="header-left">
            <h1 className="dashboard-title">Dashboard</h1>
            <p className="dashboard-subtitle">Monitor your platform performance and key metrics</p>
          </div>
          <div className="header-actions">
            <div className="search-box">
              <Search className="w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button className="icon-btn" onClick={handleRefresh}>
              <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
            <button className="icon-btn">
              <Bell className="w-5 h-5" />
            </button>
            <button className="icon-btn">
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards Section */}
      <div className="stats-section">
        <div className="stats-grid">
          <div className="stat-card primary">
            <div className="stat-icon-wrapper">
              <div className="stat-icon">
                <Users className="w-6 h-6" />
              </div>
            </div>
            <div className="stat-content">
              <div className="stat-header">
                <h3 className="stat-label">Total Users</h3>
                <div className="stat-change positive">
                  <TrendingUp className="w-4 h-4" />
                  <span>12.5%</span>
                </div>
              </div>
              <div className="stat-value">{stats.users.toLocaleString()}</div>
              <div className="stat-footer">
                <div className="stat-detail">
                  <span className="detail-label">Active this week</span>
                  <span className="detail-value">892</span>
                </div>
                <div className="stat-sparkline">
                  {[45, 52, 48, 58, 62, 55, 68].map((value, index) => (
                    <div key={index} className="sparkline-bar" style={{ height: `${value * 1.5}px` }}></div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="stat-card success">
            <div className="stat-icon-wrapper">
              <div className="stat-icon">
                <MapPin className="w-6 h-6" />
              </div>
            </div>
            <div className="stat-content">
              <div className="stat-header">
                <h3 className="stat-label">Food Spots</h3>
                <div className="stat-change positive">
                  <TrendingUp className="w-4 h-4" />
                  <span>8.2%</span>
                </div>
              </div>
              <div className="stat-value">{stats.spots.toLocaleString()}</div>
              <div className="stat-footer">
                <div className="stat-detail">
                  <span className="detail-label">New this week</span>
                  <span className="detail-value">23</span>
                </div>
                <div className="stat-sparkline">
                  {[28, 32, 30, 35, 38, 34, 42].map((value, index) => (
                    <div key={index} className="sparkline-bar success" style={{ height: `${value * 1.8}px` }}></div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="stat-card warning">
            <div className="stat-icon-wrapper">
              <div className="stat-icon">
                <Star className="w-6 h-6" />
              </div>
            </div>
            <div className="stat-content">
              <div className="stat-header">
                <h3 className="stat-label">Reviews & Ratings</h3>
                <div className="stat-change positive">
                  <TrendingUp className="w-4 h-4" />
                  <span>15.3%</span>
                </div>
              </div>
              <div className="stat-value">{stats.reviews.toLocaleString()}</div>
              <div className="stat-footer">
                <div className="stat-detail">
                  <span className="detail-label">Average rating</span>
                  <span className="detail-value">4.6</span>
                </div>
                <div className="stat-sparkline">
                  {[52, 58, 55, 62, 68, 64, 72].map((value, index) => (
                    <div key={index} className="sparkline-bar warning" style={{ height: `${value * 1.2}px` }}></div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="stat-card info">
            <div className="stat-icon-wrapper">
              <div className="stat-icon">
                <DollarSign className="w-6 h-6" />
              </div>
            </div>
            <div className="stat-content">
              <div className="stat-header">
                <h3 className="stat-label">Revenue</h3>
                <div className="stat-change positive">
                  <TrendingUp className="w-4 h-4" />
                  <span>23.1%</span>
                </div>
              </div>
              <div className="stat-value">${stats.revenue.toLocaleString()}</div>
              <div className="stat-footer">
                <div className="stat-detail">
                  <span className="detail-label">This month</span>
                  <span className="detail-value">$45.6K</span>
                </div>
                <div className="stat-sparkline">
                  {[28, 35, 32, 42, 48, 45, 52].map((value, index) => (
                    <div key={index} className="sparkline-bar info" style={{ height: `${value * 2.0}px` }}></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="activity-section">
        <div className="section-header">
          <h2>Recent Activity</h2>
          <p>Latest updates and user actions on your platform</p>
        </div>
        
        <div className="activity-list">
          {recentActivities.map((activity) => (
            <div key={activity.id} className="activity-item">
              <div className="activity-avatar">
                <img src={activity.avatar} alt={activity.user} />
              </div>
              <div className="activity-content">
                <div className="activity-header-info">
                  <span className="activity-user">{activity.user}</span>
                  <span className="activity-time">{activity.time}</span>
                </div>
                <div className="activity-description">{activity.action}</div>
              </div>
              <div className="activity-icon">
                {activity.type === 'spot' && <MapPin className="w-4 h-4" />}
                {activity.type === 'review' && <Star className="w-4 h-4" />}
                {activity.type === 'user' && <Users className="w-4 h-4" />}
                {activity.type === 'issue' && <AlertCircle className="w-4 h-4" />}
                {activity.type === 'success' && <Activity className="w-4 h-4" />}
                {activity.type === 'share' && <MessageSquare className="w-4 h-4" />}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions Section */}
      <div className="quick-actions-section">
        <div className="section-header">
          <h2>Quick Actions</h2>
          <p>Common tasks and administrative shortcuts</p>
        </div>
        
        <div className="actions-grid">
          {quickActions.map((action) => (
            <button 
              key={action.id} 
              className={`action-card ${action.color}`}
              onClick={() => handleQuickAction(action.action)}
            >
              <div className="action-icon">
                <action.icon className="w-8 h-8" />
              </div>
              <div className="action-content">
                <h3>{action.title}</h3>
                <p>{action.description}</p>
              </div>
              <div className="action-arrow">
                <TrendingUp className="w-5 h-5" />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Analytics Section */}
      {showAnalytics && (
        <div className="analytics-section">
          <div className="section-header">
            <h2>Analytics Overview</h2>
            <p>Detailed insights and platform metrics</p>
          </div>
          
          <div className="analytics-grid">
            <div className="analytics-card">
              <div className="analytics-header">
                <h3>User Growth</h3>
                <TrendingUp className="w-5 h-5 text-green-500" />
              </div>
              <div className="analytics-value">+23.5%</div>
              <div className="analytics-description">Compared to last month</div>
            </div>

            <div className="analytics-card">
              <div className="analytics-header">
                <h3>Revenue Growth</h3>
                <TrendingUp className="w-5 h-5 text-green-500" />
              </div>
              <div className="analytics-value">+18.2%</div>
              <div className="analytics-description">Monthly revenue increase</div>
            </div>

            <div className="analytics-card">
              <div className="analytics-header">
                <h3>Engagement Rate</h3>
                <TrendingUp className="w-5 h-5 text-green-500" />
              </div>
              <div className="analytics-value">+12.8%</div>
              <div className="analytics-description">User interaction improvement</div>
            </div>
          </div>
        </div>
      )}

      {/* Report Section */}
      {showReport && (
        <div className="report-section">
          <div className="section-header">
            <h2>Generate Report</h2>
            <p>Create and download platform activity reports</p>
          </div>
          
          <div className="report-grid">
            <div className="report-card">
              <div className="report-header">
                <FileText className="w-6 h-6 text-orange-500" />
                <h3>Monthly Summary</h3>
              </div>
              <div className="report-description">
                Complete overview of platform performance for the current month including user growth, revenue, and engagement metrics.
              </div>
              <div className="report-actions">
                <button className="report-btn primary">Generate PDF</button>
                <button className="report-btn secondary">Generate Excel</button>
              </div>
            </div>

            <div className="report-card">
              <div className="report-header">
                <BarChart className="w-6 h-6 text-green-500" />
                <h3>Analytics Report</h3>
              </div>
              <div className="report-description">
                Detailed analytics with charts and insights covering user behavior, popular spots, and revenue trends.
              </div>
              <div className="report-actions">
                <button className="report-btn primary">Generate PDF</button>
                <button className="report-btn secondary">Generate Excel</button>
              </div>
            </div>

            <div className="report-card">
              <div className="report-header">
                <Users className="w-6 h-6 text-blue-500" />
                <h3>User Activity</h3>
              </div>
              <div className="report-description">
                Comprehensive user activity report including registrations, logins, reviews, and engagement statistics.
              </div>
              <div className="report-actions">
                <button className="report-btn primary">Generate PDF</button>
                <button className="report-btn secondary">Generate Excel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Settings Section */}
      {showSettings && (
        <div className="settings-section">
          <div className="section-header">
            <h2>System Settings</h2>
            <p>Configure platform preferences and administrative options</p>
          </div>
          
          <div className="settings-grid">
            <div className="settings-card">
              <div className="settings-header">
                <SettingsIcon className="w-6 h-6 text-gray-500" />
                <h3>General Settings</h3>
              </div>
              <div className="settings-content">
                <div className="setting-item">
                  <label>Platform Name</label>
                  <input type="text" defaultValue="FoodSpot Platform" />
                </div>
                <div className="setting-item">
                  <label>Time Zone</label>
                  <select defaultValue="UTC">
                    <option>UTC</option>
                    <option>EST</option>
                    <option>PST</option>
                    <option>CET</option>
                  </select>
                </div>
                <div className="setting-item">
                  <label>Language</label>
                  <select defaultValue="English">
                    <option>English</option>
                    <option>Spanish</option>
                    <option>French</option>
                    <option>German</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="settings-card">
              <div className="settings-header">
                <Bell className="w-6 h-6 text-blue-500" />
                <h3>Notifications</h3>
              </div>
              <div className="settings-content">
                <div className="setting-item">
                  <label>Email Notifications</label>
                  <div className="toggle-switch">
                    <input type="checkbox" defaultChecked />
                    <span className="toggle-slider"></span>
                  </div>
                </div>
                <div className="setting-item">
                  <label>Push Notifications</label>
                  <div className="toggle-switch">
                    <input type="checkbox" defaultChecked />
                    <span className="toggle-slider"></span>
                  </div>
                </div>
                <div className="setting-item">
                  <label>Weekly Reports</label>
                  <div className="toggle-switch">
                    <input type="checkbox" defaultChecked />
                    <span className="toggle-slider"></span>
                  </div>
                </div>
              </div>
            </div>

            <div className="settings-card">
              <div className="settings-header">
                <Users className="w-6 h-6 text-purple-500" />
                <h3>User Management</h3>
              </div>
              <div className="settings-content">
                <div className="setting-item">
                  <label>Default User Role</label>
                  <select defaultValue="User">
                    <option>User</option>
                    <option>Moderator</option>
                    <option>Admin</option>
                  </select>
                </div>
                <div className="setting-item">
                  <label>Require Email Verification</label>
                  <div className="toggle-switch">
                    <input type="checkbox" defaultChecked />
                    <span className="toggle-slider"></span>
                  </div>
                </div>
                <div className="setting-item">
                  <label>Allow User Registration</label>
                  <div className="toggle-switch">
                    <input type="checkbox" defaultChecked />
                    <span className="toggle-slider"></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="dashboard-empty">
        <h1>Dashboard</h1>
        <p>Dashboard content coming soon...</p>
      </div>
    </div>
  );
};

export default DashboardPage;
