import React, { useState, useEffect } from 'react';
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
  AlertCircle
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
                Export Report
              </button>
            </div>
          </div>

          {/* Key Metrics Row */}
          <div className="key-metrics">
            <div className="metric-card">
              <div className="metric-header">
                <div className="metric-icon user-metric">
                  <Users className="w-5 h-5" />
                </div>
                <div className="metric-change positive">
                  <TrendingUp className="w-4 h-4" />
                  <span>18.2%</span>
                </div>
              </div>
              <div className="metric-body">
                <h4 className="metric-value">2,847</h4>
                <p className="metric-label">New Users</p>
              </div>
              <div className="metric-footer">
                <div className="metric-sparkline">
                  <div className="sparkline-data">
                    {[45, 52, 48, 58, 62, 55, 68].map((value, index) => (
                      <div key={index} className="sparkline-bar" style={{ height: `${value * 1.5}px` }}></div>
                    ))}
                  </div>
                </div>
                <span className="metric-period">vs last period</span>
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-header">
                <div className="metric-icon engagement-metric">
                  <Activity className="w-5 h-5" />
                </div>
                <div className="metric-change positive">
                  <TrendingUp className="w-4 h-4" />
                  <span>24.7%</span>
                </div>
              </div>
              <div className="metric-body">
                <h4 className="metric-value">68.4%</h4>
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
          </div>

          {/* Main Chart Area */}
          <div className="chart-area">
            <div className="chart-tabs">
              <button 
                className={`chart-tab ${activeChartTab === 'growth' ? 'active' : ''}`}
                onClick={() => setActiveChartTab('growth')}
              >
                Growth Trends
              </button>
              <button 
                className={`chart-tab ${activeChartTab === 'activity' ? 'active' : ''}`}
                onClick={() => setActiveChartTab('activity')}
              >
                User Activity
              </button>
              <button 
                className={`chart-tab ${activeChartTab === 'revenue' ? 'active' : ''}`}
                onClick={() => setActiveChartTab('revenue')}
              >
                Revenue Analysis
              </button>
              <button 
                className={`chart-tab ${activeChartTab === 'spots' ? 'active' : ''}`}
                onClick={() => setActiveChartTab('spots')}
              >
                Spot Performance
              </button>
            </div>
            
            <div className="main-chart">
              {activeChartTab === 'growth' && (
                <div className="chart-content growth-chart">
                  <div className="chart-legend">
                    <div className="legend-item">
                      <div className="legend-color users"></div>
                      <span>Users</span>
                    </div>
                    <div className="legend-item">
                      <div className="legend-color spots"></div>
                      <span>Spots</span>
                    </div>
                    <div className="legend-item">
                      <div className="legend-color reviews"></div>
                      <span>Reviews</span>
                    </div>
                    <div className="legend-item">
                      <div className="legend-color revenue"></div>
                      <span>Revenue</span>
                    </div>
                  </div>
                  
                  <div className="chart-visualization">
                    <div className="chart-grid">
                      <div className="chart-y-axis">
                        {[100, 80, 60, 40, 20, 0].map((value) => (
                          <div key={value} className="y-label">{value}</div>
                        ))}
                      </div>
                      <div className="chart-content">
                        <div className="chart-bars">
                          {chartData.users.map((value, index) => (
                            <div key={index} className="chart-column">
                              <div className="bar-group">
                                <div className="bar users" style={{ height: `${value * 0.8}px` }}></div>
                                <div className="bar spots" style={{ height: `${chartData.spots[index] * 0.4}px` }}></div>
                                <div className="bar reviews" style={{ height: `${chartData.reviews[index] * 0.6}px` }}></div>
                              </div>
                              <div className="x-label">Day {index + 1}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeChartTab === 'activity' && (
                <div className="chart-content activity-chart">
                  <div className="activity-grid">
                    <div className="activity-section">
                      <h4>Daily Active Users</h4>
                      <div className="activity-bars">
                        {userActivityData.daily.map((data, index) => (
                          <div key={index} className="activity-day" onClick={() => handleActivityClick('daily', data)}>
                            <div className="day-label">{data.day}</div>
                            <div className="day-stats">
                              <div className="stat-bar new-users" style={{ height: `${data.new * 2}px` }} title="New Users"></div>
                              <div className="stat-bar returning-users" style={{ height: `${data.returning * 0.8}px` }} title="Returning Users"></div>
                            </div>
                            <div className="day-total">{data.active}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="activity-section">
                      <h4>Peak Activity Hours</h4>
                      <div className="hourly-activity">
                        {userActivityData.hourly.map((data, index) => (
                          <div key={index} className="hour-item" onClick={() => handleActivityClick('hourly', data)}>
                            <div className="hour-label">{data.hour}</div>
                            <div className="hour-bar" style={{ height: `${data.users * 0.8}px` }}></div>
                            <div className="hour-users">{data.users}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeChartTab === 'revenue' && (
                <div className="chart-content revenue-chart">
                  <div className="revenue-grid">
                    <div className="revenue-section">
                      <h4>Monthly Revenue Breakdown</h4>
                      <div className="revenue-bars">
                        {revenueData.monthly.map((data, index) => (
                          <div key={index} className="revenue-month" onClick={() => handleRevenueClick('monthly', data)}>
                            <div className="month-label">{data.month}</div>
                            <div className="revenue-bar" style={{ height: `${data.revenue * 2}px` }}>
                              <div className="revenue-amount">${data.revenue.toLocaleString()}</div>
                            </div>
                            <div className="month-stats">
                              <div className="mini-stat">
                                <span className="mini-label">Spots</span>
                                <span className="mini-value">{data.spots}</span>
                              </div>
                              <div className="mini-stat">
                                <span className="mini-label">Reviews</span>
                                <span className="mini-value">{data.reviews}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="revenue-section">
                      <h4>Revenue Sources</h4>
                      <div className="revenue-sources">
                        {revenueData.sources.map((source, index) => (
                          <div key={index} className="source-item" onClick={() => handleRevenueClick('source', source)}>
                            <div className="source-info">
                              <h5>{source.source}</h5>
                              <div className="source-amount">${source.amount.toLocaleString()}</div>
                              <div className="source-percentage">{source.percentage}%</div>
                            </div>
                            <div className="source-bar">
                              <div className="source-fill" style={{ width: `${source.percentage}%` }}></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeChartTab === 'spots' && (
                <div className="chart-content spots-chart">
                  <div className="spots-performance-table">
                    <div className="table-header">
                      <div className="header-cell">Spot Name</div>
                      <div className="header-cell">Category</div>
                      <div className="header-cell">Rating</div>
                      <div className="header-cell">Reviews</div>
                      <div className="header-cell">Views</div>
                      <div className="header-cell">Bookings</div>
                      <div className="header-cell">Revenue</div>
                      <div className="header-cell">Trend</div>
                    </div>
                    {spotPerformanceData.map((spot, index) => (
                      <div key={index} className="table-row" onClick={() => handleSpotClick(spot)}>
                        <div className="cell spot-name">
                          <div className="spot-info">
                            <h5>{spot.name}</h5>
                            <span className="category-tag">{spot.category}</span>
                          </div>
                        </div>
                        <div className="cell">{spot.category}</div>
                        <div className="cell rating-cell">
                          <div className="rating-display">
                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                            <span>{spot.rating}</span>
                          </div>
                        </div>
                        <div className="cell">{spot.reviews}</div>
                        <div className="cell">{spot.views.toLocaleString()}</div>
                        <div className="cell">{spot.bookings}</div>
                        <div className="cell revenue-cell">${spot.revenue.toLocaleString()}</div>
                        <div className="cell trend-cell">
                          <div className={`trend-indicator ${spot.trend}`}>
                            {spot.trend === 'up' && <TrendingUp className="w-4 h-4 text-green-500" />}
                            {spot.trend === 'down' && <TrendingDown className="w-4 h-4 text-red-500" />}
                            {spot.trend === 'stable' && <Activity className="w-4 h-4 text-blue-500" />}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Performance Insights */}
          <div className="performance-insights">
            <div className="insights-header">
              <h4>Key Insights</h4>
              <p>AI-powered analysis of your performance data</p>
            </div>
            <div className="insights-grid">
              <div className="insight-card positive">
                <div className="insight-icon">
                  <Zap className="w-5 h-5" />
                </div>
                <div className="insight-content">
                  <h5>User Growth Accelerating</h5>
                  <p>User acquisition increased by 32% this week, driven by successful marketing campaigns</p>
                </div>
              </div>
              
              <div className="insight-card warning">
                <div className="insight-icon">
                  <AlertCircle className="w-5 h-5" />
                </div>
                <div className="insight-content">
                  <h5>Retention Rate Declining</h5>
                 <p>User retention dropped 3.2% - consider improving onboarding experience</p>
                </div>
              </div>
              
              <div className="insight-card positive">
                <div className="insight-icon">
                  <Award className="w-5 h-5" />
                </div>
                <div className="insight-content">
                  <h5>Revenue Milestone Achieved</h5>
                  <p>Monthly revenue exceeded targets by 24% with strong spot performance</p>
                </div>
              </div>
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
}
