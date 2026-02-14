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
          <div className="stat-card">
            <div className="stat-header">
              <div className="stat-icon user-stat">
                <Users className="w-5 h-5" />
              </div>
              <div className="stat-change positive">
                <TrendingUp className="w-4 h-4" />
                <span>12%</span>
              </div>
            </div>
            <div className="stat-body">
              <h3 className="stat-value">{stats.users.toLocaleString()}</h3>
              <p className="stat-label">Total Users</p>
            </div>
            <div className="stat-footer">
              <span className="stat-detail">892 active this week</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-header">
              <div className="stat-icon spots-stat">
                <MapPin className="w-5 h-5" />
              </div>
              <div className="stat-change positive">
                <TrendingUp className="w-4 h-4" />
                <span>8%</span>
              </div>
            </div>
            <div className="stat-body">
              <h3 className="stat-value">{stats.spots.toLocaleString()}</h3>
              <p className="stat-label">Food Spots</p>
            </div>
            <div className="stat-footer">
              <span className="stat-detail">23 new this week</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-header">
              <div className="stat-icon reviews-stat">
                <Star className="w-5 h-5" />
              </div>
              <div className="stat-change positive">
                <TrendingUp className="w-4 h-4" />
                <span>15%</span>
              </div>
            </div>
            <div className="stat-body">
              <h3 className="stat-value">{stats.reviews.toLocaleString()}</h3>
              <p className="stat-label">Reviews & Ratings</p>
            </div>
            <div className="stat-footer">
              <span className="stat-detail">4.6 average rating</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-header">
              <div className="stat-icon revenue-stat">
                <DollarSign className="w-5 h-5" />
              </div>
              <div className="stat-change positive">
                <TrendingUp className="w-4 h-4" />
                <span>23%</span>
              </div>
            </div>
            <div className="stat-body">
              <h3 className="stat-value">${stats.revenue.toLocaleString()}</h3>
              <p className="stat-label">Revenue</p>
            </div>
            <div className="stat-footer">
              <span className="stat-detail">This month</span>
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
