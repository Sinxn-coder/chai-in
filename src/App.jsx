import React, { useState } from 'react';
import './index.css';

export default function App() {
  console.log('App component mounting...');
  
  const [activeTab, setActiveTab] = useState('dashboard');
  console.log('Active tab:', activeTab);

  const navItems = [
    { id: 'dashboard', name: 'Dashboard' },
    { id: 'users', name: 'Users' },
    { id: 'spots', name: 'Spots' },
    { id: 'reviews', name: 'Reviews' },
    { id: 'analytics', name: 'Analytics' },
    { id: 'settings', name: 'Settings' }
  ];

  const getActiveTabName = () => {
    const activeItem = navItems.find(item => item.id === activeTab);
    return activeItem ? activeItem.name : 'Dashboard';
  };

  const renderContent = () => {
    console.log('Rendering content for tab:', activeTab);
    
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="dashboard">
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">👥</div>
                <div className="stat-info">
                  <div className="stat-number">1,234</div>
                  <div className="stat-label">Total Users</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">📍</div>
                <div className="stat-info">
                  <div className="stat-number">456</div>
                  <div className="stat-label">Food Spots</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">⭐</div>
                <div className="stat-info">
                  <div className="stat-number">2,789</div>
                  <div className="stat-label">Reviews & Ratings</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">📈</div>
                <div className="stat-info">
                  <div className="stat-number">892</div>
                  <div className="stat-label">Active Users</div>
                </div>
              </div>
            </div>
            <div className="content-placeholder">Dashboard Overview - Key metrics and performance indicators for BytSpot platform.</div>
          </div>
        );
      case 'users':
        return <div className="content-placeholder">User Management - Manage user accounts, permissions, and activity.</div>;
      case 'spots':
        return <div className="content-placeholder">Spot Management - Manage food spots, locations, and categories.</div>;
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
          {navItems.map((item) => (
            <li
              key={item.id}
              className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => setActiveTab(item.id)}
            >
              <div className="nav-icon">
                <span style={{ fontSize: '24px' }}>📊</span>
              </div>
              <span className="nav-text">{item.name}</span>
            </li>
          ))}
        </ul>
      </nav>

      <main>
        {renderContent()}
      </main>
    </>
  );
}
