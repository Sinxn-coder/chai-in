import React, { useState } from 'react';
import { Search, Bell, Settings, RefreshCw, Users, MapPin, Star, DollarSign, TrendingUp } from 'lucide-react';

const DashboardPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Mock data for stats
  const stats = {
    users: 15234,
    spots: 456,
    reviews: 2789,
    revenue: 45678
  };

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1000);
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

      <div className="dashboard-empty">
        <h1>Dashboard</h1>
        <p>Dashboard content coming soon...</p>
      </div>
    </div>
  );
};

export default DashboardPage;
