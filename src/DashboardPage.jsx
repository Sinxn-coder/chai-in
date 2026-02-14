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
  MoreVertical
} from 'lucide-react';

export default function DashboardPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('7d');
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

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1500);
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
        <div className="chart-container">
          <div className="chart-header">
            <div className="chart-title">
              <h3>Performance Overview</h3>
              <p>Track key metrics over time</p>
            </div>
            <div className="chart-controls">
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
          <div className="chart-content">
            <div className="chart-placeholder">
              <BarChart3 className="w-16 h-16 text-gray-300 mb-4" />
              <p className="text-gray-500">Interactive chart showing user growth, spots added, and reviews over time</p>
              <div className="chart-metrics">
                <div className="metric">
                  <span className="metric-label">Users</span>
                  <div className="metric-bar">
                    {chartData.users.map((value, index) => (
                      <div key={index} className="bar" style={{ height: `${value * 2}px` }}></div>
                    ))}
                  </div>
                </div>
                <div className="metric">
                  <span className="metric-label">Spots</span>
                  <div className="metric-bar">
                    {chartData.spots.map((value, index) => (
                      <div key={index} className="bar spots" style={{ height: `${value * 8}px` }}></div>
                    ))}
                  </div>
                </div>
                <div className="metric">
                  <span className="metric-label">Reviews</span>
                  <div className="metric-bar">
                    {chartData.reviews.map((value, index) => (
                      <div key={index} className="bar reviews" style={{ height: `${value * 3}px` }}></div>
                    ))}
                  </div>
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
