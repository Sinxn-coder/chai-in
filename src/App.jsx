import React, { useState } from 'react';
import { Layout, Users, Map, Star, BarChart3, Settings, TrendingUp, AlertCircle, CheckCircle, Clock } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const navItems = [
    { id: 'dashboard', name: 'Dashboard', icon: Layout },
    { id: 'users', name: 'Users', icon: Users },
    { id: 'spots', name: 'Spots', icon: Map },
    { id: 'reviews', name: 'Reviews', icon: Star },
    { id: 'analytics', name: 'Analytics', icon: BarChart3 },
    { id: 'settings', name: 'Settings', icon: Settings }
  ];

  const getActiveTabName = () => {
    const activeItem = navItems.find(item => item.id === activeTab);
    return activeItem ? activeItem.name : 'Dashboard';
  };

  const renderDashboard = () => {
    return (
      <div className="dashboard">
        <div className="stats-grid">
          {/* Total Users Card */}
          <div className="stat-card">
            <div className="stat-header">
              <div className="stat-icon users">
                <Users size={24} />
              </div>
              <h3>Total Users</h3>
            </div>
            <div className="stat-content">
              <div className="stat-main">12,458</div>
              <div className="stat-details">
                <div className="stat-item">
                  <CheckCircle size={16} className="stat-icon-small success" />
                  <span>Registered: 12,458</span>
                </div>
                <div className="stat-item">
                  <TrendingUp size={16} className="stat-icon-small active" />
                  <span>Active: 8,234</span>
                </div>
                <div className="stat-item">
                  <Clock size={16} className="stat-icon-small new" />
                  <span>New Today: 47</span>
                </div>
              </div>
            </div>
          </div>

          {/* Total Food Spots Card */}
          <div className="stat-card">
            <div className="stat-header">
              <div className="stat-icon spots">
                <Map size={24} />
              </div>
              <h3>Total Food Spots</h3>
            </div>
            <div className="stat-content">
              <div className="stat-main">3,847</div>
              <div className="stat-details">
                <div className="stat-item">
                  <CheckCircle size={16} className="stat-icon-small success" />
                  <span>Verified: 3,621</span>
                </div>
                <div className="stat-item">
                  <AlertCircle size={16} className="stat-icon-small warning" />
                  <span>Pending: 156</span>
                </div>
                <div className="stat-item">
                  <AlertCircle size={16} className="stat-icon-small danger" />
                  <span>Flagged: 70</span>
                </div>
              </div>
            </div>
          </div>

          {/* Total Reviews & Ratings Card */}
          <div className="stat-card">
            <div className="stat-header">
              <div className="stat-icon reviews">
                <Star size={24} />
              </div>
              <h3>Reviews & Ratings</h3>
            </div>
            <div className="stat-content">
              <div className="stat-main">45,892</div>
              <div className="stat-details">
                <div className="stat-item">
                  <Star size={16} className="stat-icon-small rating" />
                  <span>Average Rating: 4.2/5.0</span>
                </div>
                <div className="stat-item">
                  <AlertCircle size={16} className="stat-icon-small warning" />
                  <span>Pending Moderation: 23</span>
                </div>
                <div className="stat-item">
                  <TrendingUp size={16} className="stat-icon-small active" />
                  <span>This Week: 1,247</span>
                </div>
              </div>
            </div>
          </div>

          {/* Active Users Card */}
          <div className="stat-card">
            <div className="stat-header">
              <div className="stat-icon analytics">
                <BarChart3 size={24} />
              </div>
              <h3>Active Users</h3>
            </div>
            <div className="stat-content">
              <div className="stat-main">8,234</div>
              <div className="stat-details">
                <div className="stat-item">
                  <Clock size={16} className="stat-icon-small daily" />
                  <span>Daily: 8,234</span>
                </div>
                <div className="stat-item">
                  <TrendingUp size={16} className="stat-icon-small weekly" />
                  <span>Weekly: 28,456</span>
                </div>
                <div className="stat-item">
                  <BarChart3 size={16} className="stat-icon-small monthly" />
                  <span>Monthly: 67,891</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return renderDashboard();
      case 'users':
        return <div className="content-placeholder">User Management - View, edit, and manage user accounts, permissions, and activity.</div>;
      case 'spots':
        return <div className="content-placeholder">Spot Management - Add, edit, and moderate food spots, locations, and business information.</div>;
      case 'reviews':
        return <div className="content-placeholder">Review Moderation - Manage user reviews, ratings, photos, and reported content.</div>;
      case 'analytics':
        return <div className="content-placeholder">Analytics Dashboard - Track user engagement, popular spots, revenue metrics, and growth trends.</div>;
      case 'settings':
        return <div className="content-placeholder">Admin Settings - Configure platform preferences, API keys, and system parameters.</div>;
      default:
        return <div className="content-placeholder">Welcome to the BytSpot Admin Dashboard.</div>;
    }
  };

  return (
    <>
      <header>
        <div className="app-bar-brand">
          <div className="appIcon">🍵</div>
          <h1>BytSpot</h1>
        </div>
        <div className="header-center">{getActiveTabName()}</div>
        <div className="header-right">Admin Panel</div>
      </header>

      <nav className="sidebar">
        <ul className="nav-list">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <li
                key={item.id}
                className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
                onClick={() => setActiveTab(item.id)}
              >
                <div className="nav-icon">
                  <Icon size={24} />
                </div>
                <span className="nav-text">{item.name}</span>
              </li>
            );
          })}
        </ul>
      </nav>

      <main>
        {renderContent()}
      </main>
    </>
  );
}
