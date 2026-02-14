import React, { useState } from 'react';
import { Search, Bell, Settings, RefreshCw, Users, MapPin, Star, DollarSign, TrendingUp, BarChart, LineChart, AreaChart } from 'lucide-react';

const DashboardPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeChartTab, setActiveChartTab] = useState('growth');

  // Mock data for stats
  const stats = {
    users: 15234,
    spots: 456,
    reviews: 2789,
    revenue: 45678
  };

  // Chart data
  const chartData = {
    growth: {
      users: [120, 135, 125, 145, 160, 155, 175, 190, 185, 210, 225, 240],
      spots: [30, 35, 32, 38, 42, 40, 45, 48, 46, 52, 55, 58],
      reviews: [180, 195, 190, 210, 225, 220, 240, 255, 250, 270, 285, 290],
      revenue: [2800, 3200, 3000, 3600, 4000, 3800, 4200, 4500, 4300, 4800, 5200, 5500]
    },
    activity: {
      daily: [45, 52, 48, 58, 62, 55, 68, 72, 65, 78, 82, 75],
      weekly: [320, 350, 340, 380, 410, 390, 450, 480, 460, 520, 550, 510],
      monthly: [1200, 1350, 1300, 1450, 1600, 1550, 1750, 1900, 1850, 2100, 2250, 2150]
    },
    revenue: {
      subscriptions: [1200, 1350, 1300, 1450, 1600, 1550, 1750, 1900, 1850, 2100, 2250, 2400],
      ads: [800, 900, 850, 950, 1050, 1000, 1100, 1200, 1150, 1300, 1400, 1500],
      commissions: [800, 950, 850, 1200, 1350, 1250, 1350, 1400, 1300, 1400, 1550, 1600]
    },
    spots: {
      restaurants: [120, 135, 125, 145, 160, 155, 175, 190, 185, 210, 225, 240],
      cafes: [80, 90, 85, 95, 105, 100, 110, 120, 115, 130, 140, 145],
      bars: [60, 70, 65, 75, 85, 80, 90, 100, 95, 110, 120, 125]
    }
  };

  const handleTabClick = (tab) => {
    setActiveChartTab(tab);
  };

  // Chart rendering functions
  const renderLineChart = (data, color) => {
    const maxValue = Math.max(...data);
    const points = data.map((value, index) => {
      const x = (index / (data.length - 1)) * 460 + 20;
      const y = 320 - (value / maxValue) * 280;
      return `${x},${y}`;
    }).join(' ');

    return (
      <svg className="chart-svg" viewBox="0 0 500 340">
        {/* Grid lines */}
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <line
            key={`h-${i}`}
            x1="20"
            y1={20 + i * 50}
            x2="480"
            y2={20 + i * 50}
            stroke="#e5e7eb"
            strokeWidth="1"
          />
        ))}
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((i) => (
          <line
            key={`v-${i}`}
            x1={20 + i * 40}
            y1="20"
            x2={20 + i * 40}
            y2="320"
            stroke="#e5e7eb"
            strokeWidth="1"
          />
        ))}
        
        {/* Data line */}
        <polyline
          points={points}
          fill="none"
          stroke={color}
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        
        {/* Data points */}
        {data.map((value, index) => {
          const x = (index / (data.length - 1)) * 460 + 20;
          const y = 320 - (value / maxValue) * 280;
          return (
            <g key={index}>
              <circle
                cx={x}
                cy={y}
                r="6"
                fill={color}
                className="chart-point"
              />
              <circle
                cx={x}
                cy={y}
                r="12"
                fill={color}
                fillOpacity="0.2"
                className="chart-point"
              />
            </g>
          );
        })}
      </svg>
    );
  };

  const renderBarChart = (data, color) => {
    const maxValue = Math.max(...data);
    return (
      <div className="chart-bars-container">
        {data.map((value, index) => (
          <div key={index} className="chart-bar-wrapper">
            <div
              className="chart-bar-fill"
              style={{
                height: `${(value / maxValue) * 300}px`,
                backgroundColor: color
              }}
            >
              <div className="chart-bar-value">{value}</div>
            </div>
            <div className="chart-bar-label">{index + 1}</div>
          </div>
        ))}
      </div>
    );
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

      {/* Charts Section */}
      <div className="charts-section">
        <div className="charts-header">
          <h2>Analytics & Insights</h2>
          <p>Track your platform performance with interactive charts</p>
        </div>
        
        <div className="chart-tabs">
          {[
            { id: 'growth', label: 'Growth', icon: TrendingUp },
            { id: 'activity', label: 'Activity', icon: BarChart },
            { id: 'revenue', label: 'Revenue', icon: DollarSign },
            { id: 'spots', label: 'Spots', icon: MapPin }
          ].map((tab) => (
            <button
              key={tab.id}
              className={`chart-tab ${activeChartTab === tab.id ? 'active' : ''}`}
              onClick={() => handleTabClick(tab.id)}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="chart-content">
          {activeChartTab === 'growth' && (
            <div className="chart-grid">
              <div className="chart-card">
                <h3>User Growth</h3>
                <div className="chart-container">
                  {renderLineChart(chartData.growth.users, '#3b82f6')}
                </div>
              </div>
              <div className="chart-card">
                <h3>Spots Growth</h3>
                <div className="chart-container">
                  {renderLineChart(chartData.growth.spots, '#10b981')}
                </div>
              </div>
              <div className="chart-card">
                <h3>Reviews Growth</h3>
                <div className="chart-container">
                  {renderLineChart(chartData.growth.reviews, '#f59e0b')}
                </div>
              </div>
              <div className="chart-card">
                <h3>Revenue Growth</h3>
                <div className="chart-container">
                  {renderLineChart(chartData.growth.revenue, '#8b5cf6')}
                </div>
              </div>
            </div>
          )}

          {activeChartTab === 'activity' && (
            <div className="chart-grid">
              <div className="chart-card">
                <h3>Daily Activity</h3>
                <div className="chart-container">
                  {renderBarChart(chartData.activity.daily, '#3b82f6')}
                </div>
              </div>
              <div className="chart-card">
                <h3>Weekly Activity</h3>
                <div className="chart-container">
                  {renderBarChart(chartData.activity.weekly, '#10b981')}
                </div>
              </div>
              <div className="chart-card">
                <h3>Monthly Activity</h3>
                <div className="chart-container">
                  {renderBarChart(chartData.activity.monthly, '#8b5cf6')}
                </div>
              </div>
            </div>
          )}

          {activeChartTab === 'revenue' && (
            <div className="chart-grid">
              <div className="chart-card">
                <h3>Subscription Revenue</h3>
                <div className="chart-container">
                  {renderLineChart(chartData.revenue.subscriptions, '#3b82f6')}
                </div>
              </div>
              <div className="chart-card">
                <h3>Ad Revenue</h3>
                <div className="chart-container">
                  {renderLineChart(chartData.revenue.ads, '#10b981')}
                </div>
              </div>
              <div className="chart-card">
                <h3>Commission Revenue</h3>
                <div className="chart-container">
                  {renderLineChart(chartData.revenue.commissions, '#8b5cf6')}
                </div>
              </div>
            </div>
          )}

          {activeChartTab === 'spots' && (
            <div className="chart-grid">
              <div className="chart-card">
                <h3>Restaurants</h3>
                <div className="chart-container">
                  {renderBarChart(chartData.spots.restaurants, '#3b82f6')}
                </div>
              </div>
              <div className="chart-card">
                <h3>Cafes</h3>
                <div className="chart-container">
                  {renderBarChart(chartData.spots.cafes, '#10b981')}
                </div>
              </div>
              <div className="chart-card">
                <h3>Bars</h3>
                <div className="chart-container">
                  {renderBarChart(chartData.spots.bars, '#8b5cf6')}
                </div>
              </div>
            </div>
          )}
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
