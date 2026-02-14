import React, { useState } from 'react';
import { Search, Bell, Settings, RefreshCw, Users, MapPin, Star, DollarSign, TrendingUp, Activity, Clock, MessageSquare, AlertCircle, Plus, BarChart, FileText, UserPlus, Settings as SettingsIcon, ChevronRight } from 'lucide-react';

const DashboardPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile on component mount and resize
  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Mock data for stats
  const stats = {
    users: 15234,
    spots: 456,
    reviews: 2789,
    revenue: 45678
  };

  // Recent activity data
  const recentActivity = [
    { id: 1, title: 'New User Registration', description: 'John Doe joined the platform', time: '2 hours ago', type: 'user' },
    { id: 2, title: 'New Spot Added', description: 'Pizza Palace was added to the platform', time: '4 hours ago', type: 'spot' },
    { id: 3, title: 'New Review', description: '5-star review for Burger House', time: '6 hours ago', type: 'review' },
    { id: 4, title: 'System Update', description: 'Platform maintenance completed successfully', time: '8 hours ago', type: 'system' }
  ];

  // Quick actions data
  const quickActions = [
    { id: 2, title: 'View Analytics', description: 'Check detailed platform analytics', icon: BarChart, color: 'green', action: 'analytics' },
    { id: 3, title: 'Generate Report', description: 'Create and download activity reports', icon: FileText, color: 'orange', action: 'report' },
    { id: 4, title: 'System Settings', description: 'Configure platform preferences', icon: SettingsIcon, color: 'gray', action: 'settings' },
    { id: 5, title: 'Import Data', description: 'Bulk import spots and users', icon: Activity, color: 'teal', action: 'import' }
  ];

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
      {/* Mobile Admin Panel */}
      {isMobile && (
        <div className="mobile-admin-panel">
          <div className="mobile-admin-header">
            <h2>Admin Panel</h2>
          </div>
          <div className="mobile-admin-content">
            <p>Admin Panel</p>
          </div>
        </div>
      )}

      {/* Desktop Only Content */}
      {!isMobile && (
        <>
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
                <button className="btn btn-secondary">
                  <Bell className="w-5 h-5" />
                </button>
                <button className="btn btn-secondary">
                  <Settings className="w-5 h-5" />
                </button>
                <button className="btn btn-primary">
                  <RefreshCw className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">
                <Users className="w-6 h-6 text-blue-500" />
              </div>
              <div className="stat-content">
                <div className="stat-value">{stats.users.toLocaleString()}</div>
                <div className="stat-label">Total Users</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">
                <MapPin className="w-6 h-6 text-green-500" />
              </div>
              <div className="stat-content">
                <div className="stat-value">{stats.spots.toLocaleString()}</div>
                <div className="stat-label">Active Spots</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">
                <Star className="w-6 h-6 text-yellow-500" />
              </div>
              <div className="stat-content">
                <div className="stat-value">{stats.reviews.toLocaleString()}</div>
                <div className="stat-label">Total Reviews</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">
                <DollarSign className="w-6 h-6 text-purple-500" />
              </div>
              <div className="stat-content">
                <div className="stat-value">${stats.revenue.toLocaleString()}</div>
                <div className="stat-label">Revenue</div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="recent-activity-section">
            <div className="section-header">
              <h2>Recent Activity</h2>
              <p>Latest platform activities and updates</p>
            </div>
            <div className="activity-list">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="activity-item">
                  <div className={`activity-icon ${activity.type}`}>
                    {activity.type === 'user' && <Users className="w-5 h-5" />}
                    {activity.type === 'spot' && <MapPin className="w-5 h-5" />}
                    {activity.type === 'review' && <Star className="w-5 h-5" />}
                    {activity.type === 'system' && <AlertCircle className="w-5 h-5" />}
                  </div>
                  <div className="activity-content">
                    <div className="activity-title">{activity.title}</div>
                    <div className="activity-description">{activity.description}</div>
                    <div className="activity-time">{activity.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="quick-actions-section">
            <div className="section-header">
              <h2>Quick Actions</h2>
              <p>Common administrative tasks and shortcuts</p>
            </div>
            <div className="actions-grid">
              {quickActions.map((action) => (
                <button
                  key={action.id}
                  className={`action-card ${action.color}`}
                  onClick={() => handleQuickAction(action.action)}
                >
                  <div className="action-icon">
                    <action.icon className="w-6 h-6" />
                  </div>
                  <div className="action-content">
                    <h3>{action.title}</h3>
                    <p>{action.description}</p>
                  </div>
                  <div className="action-arrow">
                    <ChevronRight className="w-5 h-5" />
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
                    <SettingsIcon className="w-6 h-6 text-green-500" />
                    <h3>SET fully working</h3>
                  </div>
                  <div className="settings-content">
                    <div className="setting-item">
                      <label>Enable Full System Operation</label>
                      <div className="toggle-switch">
                        <input type="checkbox" defaultChecked />
                        <span className="toggle-slider"></span>
                      </div>
                    </div>
                    <div className="setting-item">
                      <label>Activate All Features</label>
                      <div className="toggle-switch">
                        <input type="checkbox" defaultChecked />
                        <span className="toggle-slider"></span>
                      </div>
                    </div>
                    <div className="setting-item">
                      <label>Enable Complete Functionality</label>
                      <div className="toggle-switch">
                        <input type="checkbox" defaultChecked />
                        <span className="toggle-slider"></span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="settings-card">
                  <div className="settings-header">
                    <Activity className="w-6 h-6 text-orange-500" />
                    <h3>Set under Construction</h3>
                  </div>
                  <div className="settings-content">
                    <div className="setting-item">
                      <label>Enable Maintenance Mode</label>
                      <div className="toggle-switch">
                        <input type="checkbox" />
                        <span className="toggle-slider"></span>
                      </div>
                    </div>
                    <div className="setting-item">
                      <label>Show Construction Notice</label>
                      <div className="toggle-switch">
                        <input type="checkbox" />
                        <span className="toggle-slider"></span>
                      </div>
                    </div>
                    <div className="setting-item">
                      <label>Limit User Access</label>
                      <div className="toggle-switch">
                        <input type="checkbox" />
                        <span className="toggle-slider"></span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="settings-card">
                  <div className="settings-header">
                    <Users className="w-6 h-6 text-blue-500" />
                    <h3>Set over users</h3>
                  </div>
                  <div className="settings-content">
                    <div className="setting-item">
                      <label>Enable Admin Override</label>
                      <div className="toggle-switch">
                        <input type="checkbox" />
                        <span className="toggle-slider"></span>
                      </div>
                    </div>
                    <div className="setting-item">
                      <label>Super User Access</label>
                      <div className="toggle-switch">
                        <input type="checkbox" />
                        <span className="toggle-slider"></span>
                      </div>
                    </div>
                    <div className="setting-item">
                      <label>Override User Permissions</label>
                      <div className="toggle-switch">
                        <input type="checkbox" />
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
        </>
      )}
    </div>
  );
};

export default DashboardPage;
