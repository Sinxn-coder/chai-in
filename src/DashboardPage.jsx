import React, { useState, useEffect, useRef } from 'react';
import { 
  Users, 
  MapPin, 
  Star, 
  TrendingUp, 
  TrendingDown,
  DollarSign,
  Eye,
  Heart,
  MessageSquare,
  Calendar,
  Clock,
  BarChart3,
  PieChart,
  Activity,
  Award,
  Target,
  Zap,
  Filter,
  Download,
  RefreshCw,
  Search,
  Bell,
  User,
  Settings,
  ChevronRight,
  ArrowUp,
  ArrowDown,
  MoreVertical,
  AlertCircle,
  LineChart,
  AreaChart
} from 'lucide-react';

export default function DashboardPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('7d');
  const [activeChartTab, setActiveChartTab] = useState('growth');
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data
  const stats = {
    totalUsers: 15420,
    activeUsers: 8932,
    totalSpots: 342,
    newSpots: 28,
    totalReviews: 8756,
    newReviews: 234,
    revenue: 45678,
    growth: 12.5
  };

  const recentActivity = [
    { id: 1, type: 'user', name: 'John Doe', action: 'joined platform', time: '2 min ago', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=40&auto=format&fit=crop' },
    { id: 2, type: 'review', name: 'Sarah Smith', action: 'reviewed "Sunset Cafe"', time: '5 min ago', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b332c1ca?q=80&w=40&auto=format&fit=crop' },
    { id: 3, type: 'spot', name: 'Mike Johnson', action: 'added new spot', time: '12 min ago', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=40&auto=format&fit=crop' },
    { id: 4, type: 'user', name: 'Emma Wilson', action: 'joined platform', time: '18 min ago', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=40&auto=format&fit=crop' },
    { id: 5, type: 'review', name: 'David Brown', action: 'reviewed "Mountain View"', time: '25 min ago', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=40&auto=format&fit=crop' }
  ];

  const topSpots = [
    { id: 1, name: 'Sunset Cafe', rating: 4.8, reviews: 234, image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=60&auto=format&fit=crop' },
    { id: 2, name: 'Mountain View Restaurant', rating: 4.7, reviews: 189, image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=60&auto=format&fit=crop' },
    { id: 3, name: 'Ocean Breeze', rating: 4.6, reviews: 156, image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=60&auto=format&fit=crop' },
    { id: 4, name: 'City Lights', rating: 4.5, reviews: 143, image: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?q=80&w=60&auto=format&fit=crop' }
  ];

  const chartData = {
    users: [120, 135, 125, 145, 160, 155, 170],
    spots: [8, 12, 10, 15, 18, 14, 20],
    reviews: [45, 52, 48, 58, 62, 55, 68]
  };

  // User Activity Data
  const userActivityData = {
    daily: [
      { day: 'Mon', active: 234, new: 45, returning: 189 },
      { day: 'Tue', active: 289, new: 52, returning: 237 },
      { day: 'Wed', active: 267, new: 38, returning: 229 },
      { day: 'Thu', active: 312, new: 67, returning: 245 },
      { day: 'Fri', active: 398, new: 89, returning: 309 },
      { day: 'Sat', active: 445, new: 102, returning: 343 },
      { day: 'Sun', active: 412, new: 78, returning: 334 }
    ],
    hourly: [
      { hour: '00:00', users: 120 },
      { hour: '04:00', users: 89 },
      { hour: '08:00', users: 234 },
      { hour: '12:00', users: 389 },
      { hour: '16:00', users: 412 },
      { hour: '20:00', users: 298 }
    ]
  };

  // Revenue Analysis Data
  const revenueData = {
    monthly: [
      { month: 'Jan', revenue: 8450, spots: 234, reviews: 1567 },
      { month: 'Feb', revenue: 9230, spots: 267, reviews: 1789 },
      { month: 'Mar', revenue: 10120, spots: 289, reviews: 1945 },
      { month: 'Apr', revenue: 11280, spots: 312, reviews: 2156 },
      { month: 'May', revenue: 12847, spots: 342, reviews: 2389 },
      { month: 'Jun', revenue: 13560, spots: 378, reviews: 2567 }
    ],
    sources: [
      { source: 'Spot Listings', amount: 45678, percentage: 65 },
      { source: 'Premium Features', amount: 12345, percentage: 18 },
      { source: 'Advertising', amount: 8901, percentage: 13 },
      { source: 'Partnerships', amount: 3456, percentage: 4 }
    ]
  };

  // Spot Performance Data
  const spotPerformanceData = [
    { 
      name: 'Sunset Cafe', 
      category: 'Restaurant', 
      rating: 4.8, 
      reviews: 234, 
      views: 5678, 
      bookings: 189,
      revenue: 12450,
      trend: 'up'
    },
    { 
      name: 'Mountain View Restaurant', 
      category: 'Fine Dining', 
      rating: 4.7, 
      reviews: 189, 
      views: 4234, 
      bookings: 156,
      revenue: 18900,
      trend: 'up'
    },
    { 
      name: 'Ocean Breeze', 
      category: 'Cafe', 
      rating: 4.6, 
      reviews: 156, 
      views: 3890, 
      bookings: 134,
      revenue: 8900,
      trend: 'stable'
    },
    { 
      name: 'City Lights', 
      category: 'Bar', 
      rating: 4.5, 
      reviews: 143, 
      views: 3456, 
      bookings: 98,
      revenue: 6780,
      trend: 'down'
    },
    { 
      name: 'Green Garden', 
      category: 'Restaurant', 
      rating: 4.9, 
      reviews: 267, 
      views: 6234, 
      bookings: 223,
      revenue: 15670,
      trend: 'up'
    }
  ];

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1500);
  };

  const handleTabClick = (tab) => {
    setActiveChartTab(tab);
    // Add any additional logic needed when switching tabs
    console.log(`Switched to ${tab} tab`);
  };

  const handleActivityClick = (type, data) => {
    console.log(`Activity clicked:`, type, data);
    // Add functionality for activity interactions
  };

  const handleRevenueClick = (source) => {
    console.log(`Revenue source clicked:`, source);
    // Add functionality for revenue source interactions
  };

  const handleSpotClick = (spot) => {
    console.log(`Spot clicked:`, spot);
    // Add functionality for spot interactions
  };

  // Chart rendering functions
  const renderLineChart = (data, color, label) => {
    const maxValue = Math.max(...data);
    const points = data.map((value, index) => {
      const x = (index / (data.length - 1)) * 100;
      const y = 100 - (value / maxValue) * 80;
      return `${x},${y}`;
    }).join(' ');

    return (
      <div className="line-chart">
        <svg viewBox="0 0 100 100" className="chart-svg">
          <polyline
            points={points}
            fill="none"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {data.map((value, index) => {
            const x = (index / (data.length - 1)) * 100;
            const y = 100 - (value / maxValue) * 80;
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
      const x = (index / (data.length - 1)) * 100;
      const y = 100 - (value / maxValue) * 80;
      return `${x},${y}`;
    }).join(' ');

    const areaPoints = `${points} 100,0`;

    return (
      <div className="area-chart">
        <svg viewBox="0 0 100 100" className="chart-svg">
          <defs>
            <linearGradient id={`gradient-${label}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={color} stopOpacity="0.3" />
              <stop offset="100%" stopColor={color} stopOpacity="0.1" />
            </linearGradient>
          </defs>
          <polygon
            points={areaPoints}
            fill={`url(#gradient-${label})`}
            stroke="none"
          />
          <polyline
            points={points}
            fill="none"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {data.map((value, index) => {
            const x = (index / (data.length - 1)) * 100;
            const y = 100 - (value / maxValue) * 80;
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

  const renderBarChart = (data, color, label) => {
    const maxValue = Math.max(...data);
    
    return (
      <div className="bar-chart">
        <div className="chart-bars-container">
          {data.map((value, index) => (
            <div key={index} className="chart-bar-wrapper">
              <div 
                className="chart-bar-fill" 
                style={{ 
                  height: `${(value / maxValue) * 100}%`,
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
    let currentAngle = 0;
    
    return (
      <div className="pie-chart">
        <svg viewBox="0 0 100 100" className="chart-svg">
          {data.map((item, index) => {
            const percentage = (item.value / total) * 100;
            const angle = (percentage / 100) * 360;
            const startAngle = currentAngle;
            const endAngle = currentAngle + angle;
            
            const x1 = 50 + 40 * Math.cos((startAngle - 90) * Math.PI / 180);
            const y1 = 50 + 40 * Math.sin((startAngle - 90) * Math.PI / 180);
            const x2 = 50 + 40 * Math.cos((endAngle - 90) * Math.PI / 180);
            const y2 = 50 + 40 * Math.sin((endAngle - 90) * Math.PI / 180);
            
            const largeArcFlag = angle > 180 ? 1 : 0;
            
            currentAngle = endAngle;
            
            return (
              <g key={index}>
                <path
                  d={`M ${x1} ${y1} A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2} Z`}
                  fill={item.color}
                  stroke="white"
                  strokeWidth="2"
                  className="pie-slice"
                />
                <text
                  x={50 + 25 * Math.cos(((startAngle + endAngle) / 2 - 90) * Math.PI / 180)}
                  y={50 + 25 * Math.sin(((startAngle + endAngle) / 2 - 90) * Math.PI / 180)}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="white"
                  fontSize="12"
                  fontWeight="600"
                >
                  {`${Math.round(percentage)}%`}
                </text>
              </g>
            );
          })}
        </svg>
        <div className="pie-legend">
          {data.map((item, index) => (
            <div key={index} className="legend-item">
              <div className="legend-color" style={{ backgroundColor: item.color }}></div>
              <span className="legend-text">{item.label}</span>
              <span className="legend-value">{item.value}</span>
            </div>
          ))}
        </div>
        <div className="chart-label">{label}</div>
      </div>
    );
  };

  const getActivityIcon = (type) => {
    switch(type) {
      case 'user': return <Users className="w-4 h-4 text-blue-500" />;
      case 'review': return <Star className="w-4 h-4 text-yellow-500" />;
      case 'spot': return <MapPin className="w-4 h-4 text-green-500" />;
      default: return <Activity className="w-4 h-4 text-gray-500" />;
    }
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

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card primary">
          <div className="stat-content">
            <div className="stat-header">
              <div className="stat-icon">
                <Users className="w-6 h-6" />
              </div>
              <div className="stat-change positive">
                <ArrowUp className="w-4 h-4" />
                <span>12.5%</span>
              </div>
            </div>
            <div className="stat-body">
              <h3 className="stat-value">{stats.totalUsers.toLocaleString()}</h3>
              <p className="stat-label">Total Users</p>
            </div>
            <div className="stat-footer">
              <span className="stat-detail">{stats.activeUsers.toLocaleString()} active</span>
            </div>
          </div>
        </div>

        <div className="stat-card success">
          <div className="stat-content">
            <div className="stat-header">
              <div className="stat-icon">
                <MapPin className="w-6 h-6" />
              </div>
              <div className="stat-change positive">
                <ArrowUp className="w-4 h-4" />
                <span>8.2%</span>
              </div>
            </div>
            <div className="stat-body">
              <h3 className="stat-value">{stats.totalSpots}</h3>
              <p className="stat-label">Total Spots</p>
            </div>
            <div className="stat-footer">
              <span className="stat-detail">+{stats.newSpots} this week</span>
            </div>
          </div>
        </div>

        <div className="stat-card warning">
          <div className="stat-content">
            <div className="stat-header">
              <div className="stat-icon">
                <Star className="w-6 h-6" />
              </div>
              <div className="stat-change positive">
                <ArrowUp className="w-4 h-4" />
                <span>15.3%</span>
              </div>
            </div>
            <div className="stat-body">
              <h3 className="stat-value">{stats.totalReviews.toLocaleString()}</h3>
              <p className="stat-label">Total Reviews</p>
            </div>
            <div className="stat-footer">
              <span className="stat-detail">+{stats.newReviews} this week</span>
            </div>
          </div>
        </div>

        <div className="stat-card info">
          <div className="stat-content">
            <div className="stat-header">
              <div className="stat-icon">
                <DollarSign className="w-6 h-6" />
              </div>
              <div className="stat-change positive">
                <ArrowUp className="w-4 h-4" />
                <span>{stats.growth}%</span>
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

      {/* Charts Section */}
      <div className="charts-section">
        <div className="performance-overview">
          <div className="overview-header">
            <div className="overview-title">
              <h3>Performance Overview</h3>
              <p>Comprehensive analytics and insights</p>
            </div>
            <div className="overview-controls">
              <select 
                className="period-select"
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 3 months</option>
                <option value="1y">Last year</option>
              </select>
              <button className="chart-btn">
                <Download className="w-4 h-4" />
                Export
              </button>
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
          <p>List a new food spot on the platform</p>
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
                <p className="metric-label">Engagement Rate</p>
              </div>
              <div className="metric-footer">
                <div className="metric-sparkline">
                  <div className="sparkline-data">
                    {[52, 58, 55, 62, 68, 64, 72].map((value, index) => (
                      <div key={index} className="sparkline-bar engagement" style={{ height: `${value * 1.2}px` }}></div>
                    ))}
                  </div>
                </div>
                <span className="metric-period">+12.3% average</span>
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-header">
                <div className="metric-icon revenue-metric">
                  <DollarSign className="w-5 h-5" />
                </div>
                <div className="metric-change positive">
                  <TrendingUp className="w-4 h-4" />
                  <span>32.1%</span>
                </div>
              </div>
              <div className="metric-body">
                <h4 className="metric-value">$12,847</h4>
                <p className="metric-label">Revenue</p>
              </div>
              <div className="metric-footer">
                <div className="metric-sparkline">
                  <div className="sparkline-data">
                    {[28, 35, 32, 42, 48, 45, 52].map((value, index) => (
                      <div key={index} className="sparkline-bar revenue" style={{ height: `${value * 1.8}px` }}></div>
                    ))}
                  </div>
                </div>
                <span className="metric-period">Best month</span>
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-header">
                <div className="metric-icon retention-metric">
                  <Target className="w-5 h-5" />
                </div>
                <div className="metric-change negative">
                  <TrendingDown className="w-4 h-4" />
                  <span>3.2%</span>
                </div>
              </div>
              <div className="metric-body">
                <h4 className="metric-value">84.7%</h4>
                <p className="metric-label">Retention Rate</p>
              </div>
              <div className="metric-footer">
                <div className="metric-sparkline">
                  <div className="sparkline-data">
                    {[88, 86, 87, 85, 84, 85, 84].map((value, index) => (
                      <div key={index} className="sparkline-bar retention" style={{ height: `${value * 1.5}px` }}></div>
                    ))}
                  </div>
                </div>
                <span className="metric-period">Needs attention</span>
              </div>
            </div>

            <div className="metric-card-redesigned success">
              <div className="metric-icon-large">
                <MapPin className="w-8 h-8" />
                <div className="nav-tabs">
                  {['growth', 'activity', 'revenue', 'spots'].map((tab) => (
                    <button
                      key={tab}
                      className={`nav-tab ${activeChartTab === tab ? 'active' : ''}`}
                      onClick={() => handleTabClick(tab)}
                    >
                      <div className="tab-icon">
                        {tab === 'growth' && <TrendingUp className="w-5 h-5" />}
                        {tab === 'activity' && <Activity className="w-5 h-5" />}
                        {tab === 'revenue' && <DollarSign className="w-5 h-5" />}
                        {tab === 'spots' && <MapPin className="w-5 h-5" />}
                      </div>
                      <span className="tab-label">
                        {tab === 'growth' && 'Growth Analytics'}
                        {tab === 'activity' && 'User Activity'}
                        {tab === 'revenue' && 'Revenue Analysis'}
                        {tab === 'spots' && 'Spot Performance'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Chart Content Area */}
              <div className="chart-content-area">
                {activeChartTab === 'growth' && (
                  <div className="growth-analytics">
                    <div className="chart-container-large">
                      <div className="chart-header-section">
                        <h4>Growth Overview</h4>
                        <p>Track your platform's growth across multiple dimensions</p>
                      </div>
                      <div className="chart-legend-enhanced">
                        <div className="legend-item">
                          <div className="legend-color users"></div>
                          <span>Users</span>
                          <div className="legend-trend positive">
                            <TrendingUp className="w-4 h-4" />
                            <span>+18.2%</span>
                          </div>
                        </div>
                        <div className="legend-item">
                          <div className="legend-color spots"></div>
                          <span>Spots</span>
                          <div className="legend-trend positive">
                            <TrendingUp className="w-4 h-4" />
                            <span>+8.2%</span>
                          </div>
                        </div>
                        <div className="legend-item">
                          <div className="legend-color reviews"></div>
                          <span>Reviews</span>
                          <div className="legend-trend positive">
                            <TrendingUp className="w-4 h-4" />
                            <span>+15.3%</span>
                          </div>
                        </div>
                        <div className="legend-item">
                          <div className="legend-color revenue"></div>
                          <span>Revenue</span>
                          <div className="legend-trend positive">
                            <TrendingUp className="w-4 h-4" />
                            <span>+32.1%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="chart-visualization-enhanced">
                      {renderAreaChart(chartData.users, '#3b82f6', 'User Growth')}
                      {renderAreaChart(chartData.spots, '#10b981', 'Spot Growth')}
                      {renderAreaChart(chartData.reviews, '#f59e0b', 'Review Growth')}
                    </div>
                  </div>
                )}

                {activeChartTab === 'activity' && (
                  <div className="activity-analytics">
                    <div className="chart-container-large">
                      <div className="chart-header-section">
                        <h4>User Engagement Analytics</h4>
                        <p>Deep dive into user behavior and engagement patterns</p>
                      </div>
                      <div className="dual-chart-layout">
                        <div className="metrics-showcase">
                          <div className="metrics-header">
                            <h3>Key Performance Indicators</h3>
                            <div className="metrics-summary">
                              <span className="summary-item positive">
                                <TrendingUp className="w-4 h-4" />
                                18.2% growth
                              </span>
                              <span className="summary-item neutral">
                                <Activity className="w-4 h-4" />
                                2,847 new users
                              </span>
                            </div>
                          </div>
                          <div className="metrics-grid-redesigned">
                            <div className="metric-card-redesigned primary">
                              <div className="metric-icon-large">
                                <Users className="w-8 h-8" />
                              </div>
                              <div className="metric-content">
                                <div className="metric-value-large">15,420</div>
                                <div className="metric-label-large">Total Users</div>
                                <div className="metric-change positive">
                                  <TrendingUp className="w-4 h-4" />
                                  <span>+2,847</span>
                                  <span className="change-period">this month</span>
                                </div>
                              </div>
                            </div>

                            <div className="metric-card-redesigned success">
                              <div className="metric-icon-large">
                                <MapPin className="w-8 h-8" />
                              </div>
                              <div className="metric-content">
                                <div className="metric-value-large">342</div>
                                <div className="metric-label-large">Active Spots</div>
                                <div className="metric-change positive">
                                  <TrendingUp className="w-4 h-4" />
                                  <span>+28</span>
                                  <span className="change-period">this month</span>
                                </div>
                              </div>
                            </div>

                            <div className="metric-card-redesigned info">
                              <div className="metric-icon-large">
                                <Star className="w-8 h-8" />
                              </div>
                              <div className="metric-content">
                                <div className="metric-value-large">8,756</div>
                                <div className="metric-label-large">Total Reviews</div>
                                <div className="metric-change positive">
                                  <TrendingUp className="w-4 h-4" />
                                  <span>+234</span>
                                  <span className="change-period">this month</span>
                                </div>
                              </div>
                            </div>

                            <div className="metric-card-redesigned warning">
                              <div className="metric-icon-large">
                                <DollarSign className="w-8 h-8" />
                              </div>
                              <div className="metric-content">
                                <div className="metric-value-large">$45,678</div>
                                <div className="metric-label-large">Monthly Revenue</div>
                                <div className="metric-change positive">
                                  <TrendingUp className="w-4 h-4" />
                                  <span>+32.1%</span>
                                  <span className="change-period">vs last month</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="chart-half">
                          <div className="mini-chart-header">
                            <h5>Daily Active Users</h5>
                            <div className="chart-subtitle">Last 7 days overview</div>
                          </div>
                          {renderAreaChart(
                            userActivityData.daily.map(d => d.active),
                            '#8b5cf6',
                            'Daily Active Users'
                          )}
                        </div>
                        <div className="chart-half">
                          <div className="mini-chart-header">
                            <h5>Hourly Activity</h5>
                            <div className="chart-subtitle">Peak usage times</div>
                          </div>
                          {renderBarChart(
                            userActivityData.hourly.map(h => h.users),
                            '#f59e0b',
                            'Hourly Activity'
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="engagement-metrics">
                      <div className="metric-row">
                        <div className="engagement-stat">
                          <div className="stat-icon-small">
                            <Users className="w-5 h-5" />
                          </div>
                          <div className="stat-content">
                            <div className="stat-number">8,932</div>
                            <div className="stat-label">Active Users</div>
                            <div className="stat-description">Currently online</div>
                          </div>
                        </div>
                        <div className="engagement-stat">
                          <div className="stat-icon-small">
                            <Clock className="w-5 h-5" />
                          </div>
                          <div className="stat-content">
                            <div className="stat-number">4.2h</div>
                            <div className="stat-label">Avg. Session</div>
                            <div className="stat-description">Daily average</div>
                          </div>
                        </div>
                        <div className="engagement-stat">
                          <div className="stat-icon-small">
                            <Target className="w-5 h-5" />
                          </div>
                          <div className="stat-content">
                            <div className="stat-number">68.4%</div>
                            <div className="stat-label">Engagement Rate</div>
                            <div className="stat-description">Monthly average</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeChartTab === 'revenue' && (
                  <div className="revenue-analytics">
                    <div className="chart-container-large">
                      <div className="chart-header-section">
                        <h4>Revenue Analytics</h4>
                        <p>Comprehensive breakdown of revenue streams and financial performance</p>
                      </div>
                      <div className="revenue-dashboard">
                        <div className="revenue-main-chart">
                          <div className="chart-title-large">Monthly Revenue Trend</div>
                          {renderAreaChart(
                            revenueData.monthly.map(m => m.revenue),
                            '#10b981',
                            'Monthly Revenue'
                          )}
                        </div>
                        <div className="revenue-side-charts">
                          <div className="side-chart">
                            <div className="chart-title-medium">Revenue Sources</div>
                            {renderPieChart([
                              { label: 'Spot Listings', value: 45678, color: '#3b82f6' },
                              { label: 'Premium Features', value: 12345, color: '#8b5cf6' },
                              { label: 'Advertising', value: 8901, color: '#f59e0b' },
                              { label: 'Partnerships', value: 3456, color: '#10b981' }
                            ], 'Revenue Distribution')}
                          </div>
                          <div className="side-chart">
                            <div className="chart-title-medium">Revenue by Category</div>
                            {renderBarChart(
                              [31250, 18900, 8900, 6780],
                              '#8b5cf6',
                              'Revenue by Category'
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="revenue-metrics-grid">
                      <div className="revenue-metric-card">
                        <div className="metric-header-small">
                          <DollarSign className="w-5 h-5" />
                          <span>Total Revenue</span>
                        </div>
                        <div className="metric-value-large">$45,678</div>
                        <div className="metric-period">This month</div>
                      </div>
                      <div className="revenue-metric-card">
                        <div className="metric-header-small">
                          <TrendingUp className="w-5 h-5" />
                          <span>Growth Rate</span>
                        </div>
                        <div className="metric-value-large">32.1%</div>
                        <div className="metric-period">Month over month</div>
                      </div>
                      <div className="revenue-metric-card">
                        <div className="metric-header-small">
                          <Target className="w-5 h-5" />
                          <span>Avg. Order Value</span>
                        </div>
                        <div className="metric-value-large">$156.70</div>
                        <div className="metric-period">Per transaction</div>
                      </div>
                    </div>
                  </div>
                )}

                {activeChartTab === 'spots' && (
                  <div className="spots-analytics">
                    <div className="chart-container-large">
                      <div className="chart-header-section">
                        <h4>Spot Performance Analytics</h4>
                        <p>Detailed analysis of spot performance and user engagement</p>
                      </div>
                      <div className="spots-dashboard">
                        <div className="spots-overview">
                          <div className="overview-stats">
                            <div className="stat-card-compact">
                              <div className="stat-number">342</div>
                              <div className="stat-label">Total Spots</div>
                            </div>
                            <div className="stat-card-compact">
                              <div className="stat-number">4.8</div>
                              <div className="stat-label">Avg. Rating</div>
                            </div>
                            <div className="stat-card-compact">
                              <div className="stat-number">8,756</div>
                              <div className="stat-label">Total Reviews</div>
                            </div>
                          </div>
                        </div>
                        <div className="spots-performance-charts">
                          <div className="performance-chart-large">
                            <div className="chart-title-medium">Rating Distribution</div>
                            {renderBarChart(
                              spotPerformanceData.map(s => s.rating * 100),
                              '#f59e0b',
                              'Rating Scores'
                            )}
                          </div>
                          <div className="performance-chart-large">
                            <div className="chart-title-medium">Top Performing Categories</div>
                            {renderPieChart([
                              { label: 'Restaurant', value: 65, color: '#3b82f6' },
                              { label: 'Fine Dining', value: 28, color: '#8b5cf6' },
                              { label: 'Cafe', value: 42, color: '#10b981' },
                              { label: 'Bar', value: 18, color: '#f59e0b' }
                            ], 'Spot Categories')}
                          </div>
                        </div>
                      </div>
                      <div className="spots-table-enhanced">
                        <div className="table-header-enhanced">
                          <div className="header-title">Top Performing Spots</div>
                          <div className="header-actions">
                            <button className="table-action-btn">
                              <Filter className="w-4 h-4" />
                              Filter
                            </button>
                            <button className="table-action-btn">
                              <Download className="w-4 h-4" />
                              Export
                            </button>
                          </div>
                        </div>
                        <div className="table-grid-enhanced">
                          <div className="table-header-row">
                            <div className="header-cell">Spot Name</div>
                            <div className="header-cell">Category</div>
                            <div className="header-cell">Rating</div>
                            <div className="header-cell">Reviews</div>
                            <div className="header-cell">Revenue</div>
                            <div className="header-cell">Performance</div>
                          </div>
                          {spotPerformanceData.slice(0, 5).map((spot, index) => (
                            <div key={index} className="table-row-enhanced" onClick={() => handleSpotClick(spot)}>
                              <div className="cell-enhanced spot-name-cell">
                                <div className="spot-avatar">
                                  <img src={`https://picsum.photos/seed/${spot.name}/40/40`} alt={spot.name} />
                                </div>
                                <div className="spot-details">
                                  <h5>{spot.name}</h5>
                                  <span className="category-badge">{spot.category}</span>
                                </div>
                              </div>
                              <div className="cell-enhanced">
                                <div className="rating-display-enhanced">
                                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                                  <span>{spot.rating}</span>
                                </div>
                              </div>
                              <div className="cell-enhanced">
                                <span>{spot.reviews}</span>
                                <div className="cell-label">Reviews</div>
                              </div>
                              <div className="cell-enhanced revenue-cell">
                                <span>${spot.revenue.toLocaleString()}</span>
                                <div className="cell-label">Revenue</div>
                              </div>
                              <div className="cell-enhanced trend-cell">
                                <div className={`trend-indicator-enhanced ${spot.trend}`}>
                                  {spot.trend === 'up' && <TrendingUp className="w-4 h-4 text-green-500" />}
                                  {spot.trend === 'down' && <TrendingDown className="w-4 h-4 text-red-500" />}
                                  {spot.trend === 'stable' && <Activity className="w-4 h-4 text-blue-500" />}
                                </div>
                                <div className="trend-label">
                                  {spot.trend === 'up' && 'Top Performer'}
                                  {spot.trend === 'down' && 'Declining'}
                                  {spot.trend === 'stable' && 'Stable'}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
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
                <div className="activity-content">
                  <p className="activity-text">
                    <span className="activity-name">{activity.name}</span>
                    <span className="activity-action"> {activity.action}</span>
                  </p>
                  <p className="activity-time">{activity.time}</p>
                </div>
                <div className="activity-icon">
                  {getActivityIcon(activity.type)}
                </div>
              </div>
            ))}
          </div>
          <div className="card-footer">
            <button className="view-all-btn">
              View all activity
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Top Spots */}
        <div className="content-card">
          <div className="card-header">
            <h3>Top Rated Spots</h3>
            <button className="card-action">
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>
          <div className="spots-list">
            {topSpots.map((spot, index) => (
              <div key={spot.id} className="spot-item">
                <div className="spot-rank">
                  <span className="rank-number">{index + 1}</span>
                </div>
                <div className="spot-image">
                  <img src={spot.image} alt={spot.name} />
                </div>
                <div className="spot-info">
                  <h4 className="spot-name">{spot.name}</h4>
                  <div className="spot-stats">
                    <div className="rating">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span>{spot.rating}</span>
                    </div>
                    <div className="reviews">
                      <MessageSquare className="w-4 h-4 text-gray-400" />
                      <span>{spot.reviews}</span>
                    </div>
                  </div>
                </div>
                <div className="spot-trend">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                </div>
              </div>
            ))}
          </div>
          <div className="card-footer">
            <button className="view-all-btn">
              View all spots
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="content-card">
          <div className="card-header">
            <h3>Quick Actions</h3>
          </div>
          <div className="actions-grid">
            <button className="action-card">
              <div className="action-icon">
                <Users className="w-6 h-6" />
              </div>
              <h4>Add User</h4>
              <p>Invite new team members</p>
            </button>
            <button className="action-card">
              <div className="action-icon">
                <MapPin className="w-6 h-6" />
              </div>
              <h4>Add Spot</h4>
              <p>Create new location</p>
            </button>
            <button className="action-card">
              <div className="action-icon">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h4>Analytics</h4>
              <p>View detailed reports</p>
            </button>
            <button className="action-card">
              <div className="action-icon">
                <Settings className="w-6 h-6" />
              </div>
              <h4>Settings</h4>
              <p>Configure platform</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
