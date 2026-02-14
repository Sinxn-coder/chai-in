import React, { useState, useEffect, useRef } from 'react';
import { 
  Users, MapPin, Star, TrendingUp, TrendingDown, Activity, 
  DollarSign, Download, RefreshCw, Bell, Settings, Search,
  MoreVertical, AlertTriangle, Target, Plus, BarChart,
  LineChart, AreaChart
} from 'lucide-react';

const DashboardPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('30d');

  // Mock data
  const stats = {
    users: 15234,
    spots: 456,
    reviews: 2789,
    revenue: 45678
  };

  const recentActivity = [
    { id: 1, name: 'John Doe', action: 'added a new spot', time: '2 hours ago', avatar: 'https://picsum.photos/seed/user1/40/40' },
    { id: 2, name: 'Jane Smith', action: 'left a review', time: '4 hours ago', avatar: 'https://picsum.photos/seed/user2/40/40' },
    { id: 3, name: 'Bob Johnson', action: 'updated profile', time: '6 hours ago', avatar: 'https://picsum.photos/seed/user3/40/40' },
    { id: 4, name: 'Alice Brown', action: 'joined platform', time: '1 day ago', avatar: 'https://picsum.photos/seed/user4/40/40' }
  ];

  const topSpots = [
    { id: 1, name: 'The Coffee House', category: 'Cafe', rating: 4.8, image: 'https://picsum.photos/seed/spot1/60/60' },
    { id: 2, name: 'Pizza Paradise', category: 'Restaurant', rating: 4.6, image: 'https://picsum.photos/seed/spot2/60/60' },
    { id: 3, name: 'Burger Joint', category: 'Restaurant', rating: 4.5, image: 'https://picsum.photos/seed/spot3/60/60' },
    { id: 4, name: 'Smoothie Bar', category: 'Cafe', rating: 4.7, image: 'https://picsum.photos/seed/spot4/60/60' }
  ];

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1000);
  };

  const getActivityIcon = (type) => {
    switch(type) {
      case 'spot': return <MapPin className="w-4 h-4" />;
      case 'review': return <Star className="w-4 h-4" />;
      case 'user': return <Users className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  // Chart rendering functions
  const renderLineChart = (data, color, label) => {
    const maxValue = Math.max(...data);
    const points = data.map((value, index) => {
      const x = (index / (data.length - 1)) * 280 + 10;
      const y = 190 - (value / maxValue) * 170;
      return `${x},${y}`;
    }).join(' ');

    return (
      <div className="chart-container">
        <svg className="chart-svg" viewBox="0 0 300 200">
          <polyline
            points={points}
            fill="none"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {data.map((value, index) => {
            const x = (index / (data.length - 1)) * 280 + 10;
            const y = 190 - (value / maxValue) * 170;
            return (
              <circle
                key={index}
                cx={x}
                cy={y}
                r="3"
                fill={color}
                className="chart-point"
              />
            );
          })}
        </svg>
        <div className="chart-label">{label}</div>
      </div>
    );
  };

  const renderAreaChart = (data, color, label) => {
    const maxValue = Math.max(...data);
    const points = data.map((value, index) => {
      const x = (index / (data.length - 1)) * 280 + 10;
      const y = 190 - (value / maxValue) * 170;
      return `${x},${y}`;
    }).join(' ');

    return (
      <div className="chart-container">
        <svg className="chart-svg" viewBox="0 0 300 200">
          <defs>
            <linearGradient id={`gradient-${color}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={color} stopOpacity="0.3" />
              <stop offset="100%" stopColor={color} stopOpacity="0.05" />
            </linearGradient>
          </defs>
          <polygon
            points={`${points} 290,190 10,190`}
            fill={`url(#gradient-${color})`}
            stroke={color}
            strokeWidth="2"
          />
          <polyline
            points={points}
            fill="none"
            stroke={color}
            strokeWidth="2"
          />
        </svg>
        <div className="chart-label">{label}</div>
      </div>
    );
  };

  const renderBarChart = (data, color, label) => {
    const maxValue = Math.max(...data);
    return (
      <div className="chart-container">
        <div className="chart-bars-container">
          {data.map((value, index) => (
            <div key={index} className="chart-bar-wrapper">
              <div
                className="chart-bar-fill"
                style={{
                  height: `${(value / maxValue) * 180}px`,
                  backgroundColor: color
                }}
              >
                <div className="chart-bar-value">{value}</div>
              </div>
              <div className="chart-bar-label">{index + 1}</div>
            </div>
          ))}
        </div>
        <div className="chart-label">{label}</div>
      </div>
    );
  };

  const renderPieChart = (data, label) => {
    const total = data.reduce((sum, item) => sum + item.value, 0);
    let currentAngle = -90;
    
    const slices = data.map((item) => {
      const percentage = (item.value / total) * 100;
      const angle = (percentage / 100) * 360;
      const startAngle = currentAngle;
      const endAngle = currentAngle + angle;
      
      const x1 = 150 + 80 * Math.cos((startAngle * Math.PI) / 180);
      const y1 = 100 + 80 * Math.sin((startAngle * Math.PI) / 180);
      const x2 = 150 + 80 * Math.cos((endAngle * Math.PI) / 180);
      const y2 = 100 + 80 * Math.sin((endAngle * Math.PI) / 180);
      
      const largeArc = angle > 180 ? 1 : 0;
      
      const pathData = [
        `M 150 100`,
        `L ${x1} ${y1}`,
        `A 80 80 0 ${largeArc} 1 ${x2} ${y2}`,
        'Z'
      ].join(' ');
      
      currentAngle = endAngle;
      
      return { ...item, pathData, percentage };
    });

    return (
      <div className="chart-container">
        <svg className="chart-svg" viewBox="0 0 300 200">
          {slices.map((slice, index) => (
            <path
              key={index}
              d={slice.pathData}
              fill={slice.color}
              className="pie-slice"
            />
          ))}
        </svg>
        <div className="pie-legend">
          {slices.map((slice, index) => (
            <div key={index} className="legend-item">
              <div className="legend-color" style={{ backgroundColor: slice.color }}></div>
              <span className="legend-text">{slice.label}</span>
              <span className="legend-value">{slice.percentage.toFixed(1)}%</span>
            </div>
          ))}
        </div>
        <div className="chart-label">{label}</div>
      </div>
    );
  };

  return (
    <div className="dashboard-page">
      {/* Header */}
      <div className="dashboard-header">
        <div className="header-content">
          <div className="header-left">
            <h1 className="dashboard-title">Dashboard Overview</h1>
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

      {/* Stats Section */}
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

      {/* Performance Insights */}
      <div className="performance-insights">
        <div className="insights-header">
          <h4>Key Insights</h4>
          <p>AI-powered analysis of your performance data</p>
        </div>
        <div className="insights-grid">
          <div className="insight-card">
            <div className="insight-icon positive">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div className="insight-content">
              <h5>User Growth Accelerating</h5>
              <p>18.2% increase in active users this month, driven by improved engagement features</p>
            </div>
          </div>
          <div className="insight-card">
            <div className="insight-icon warning">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div className="insight-content">
              <h5>Spot Retention Needs Attention</h5>
              <p>12% drop in returning users suggests need for better spot discovery features</p>
            </div>
          </div>
          <div className="insight-card">
            <div className="insight-icon info">
              <Target className="w-5 h-5" />
            </div>
            <div className="insight-content">
              <h5>Revenue Opportunities</h5>
              <p>Premium features showing 32% growth, consider expanding subscription tiers</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="content-grid">
        {/* Recent Activity */}
        <div className="content-card">
          <div className="card-header">
            <h3>Recent Activity</h3>
            <button className="card-action">
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>
          <div className="activity-list">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="activity-item">
                <div className="activity-avatar">
                  <img src={activity.avatar} alt={activity.name} />
                </div>
                <div className="activity-details">
                  <div className="activity-text">
                    <strong>{activity.name}</strong> {activity.action}
                  </div>
                  <div className="activity-time">{activity.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="content-card">
          <div className="card-header">
            <h3>Quick Stats</h3>
            <button className="card-action">
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-icon">
                <Users className="w-5 h-5" />
              </div>
              <div className="stat-info">
                <div className="stat-value">1,234</div>
                <div className="stat-label">Active Users</div>
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-icon">
                <MapPin className="w-5 h-5" />
              </div>
              <div className="stat-info">
                <div className="stat-value">456</div>
                <div className="stat-label">Total Spots</div>
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-icon">
                <Star className="w-5 h-5" />
              </div>
              <div className="stat-info">
                <div className="stat-value">2,789</div>
                <div className="stat-label">Reviews</div>
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-icon">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div className="stat-info">
                <div className="stat-value">892</div>
                <div className="stat-label">Growth Rate</div>
              </div>
            </div>
          </div>
        </div>

        {/* Top Spots */}
        <div className="content-card">
          <div className="card-header">
            <h3>Top Spots</h3>
            <button className="card-action">
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>
          <div className="spots-list">
            {topSpots.map((spot) => (
              <div key={spot.id} className="spot-item">
                <div className="spot-image">
                  <img src={spot.image} alt={spot.name} />
                </div>
                <div className="spot-info">
                  <div className="spot-name">{spot.name}</div>
                  <div className="spot-category">{spot.category}</div>
                </div>
                <div className="spot-rating">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span>{spot.rating}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <div className="action-card">
          <div className="action-icon">
            <Plus className="w-6 h-6" />
          </div>
          <h4>Add New Spot</h4>
          <p>List a new food spot on platform</p>
        </div>
        <div className="action-card">
          <div className="action-icon">
            <BarChart className="w-6 h-6" />
          </div>
          <h4>View Analytics</h4>
          <p>Detailed performance metrics and insights</p>
        </div>
        <div className="action-card">
          <div className="action-icon">
            <Settings className="w-6 h-6" />
          </div>
          <h4>Settings</h4>
          <p>Configure platform</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
