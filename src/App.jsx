import React, { useState } from 'react';
import { Layout, Users, Map, Star, BarChart3, Settings } from 'lucide-react';

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

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <div className="content-placeholder">Admin Dashboard - Overview of platform statistics, recent activities, and key metrics.</div>;
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
