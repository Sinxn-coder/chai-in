import React, { useState, useEffect, useMemo } from 'react';
import { BarChart3, TrendingUp, Users, DollarSign, Eye, Heart, MessageSquare, Calendar, Download, Filter, ChevronDown, Activity, MapPin, Clock, Star, ArrowUp, ArrowDown, Minus } from 'lucide-react';
import './AnalyticsPage.css';

const AnalyticsPage = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('7d');
  const [selectedMetric, setSelectedMetric] = useState('all');
  const [showPeriodDropdown, setShowPeriodDropdown] = useState(false);
  const [showMetricDropdown, setShowMetricDropdown] = useState(false);

  // Mock data for analytics
  const [analyticsData, setAnalyticsData] = useState({
    overview: {
      totalUsers: 12453,
      activeUsers: 8932,
      totalSpots: 1456,
      revenue: 45678,
      engagement: 78.5,
      growth: 12.3
    },
    userMetrics: {
      dailyActive: 2341,
      weeklyActive: 8932,
      monthlyActive: 12453,
      newUsers: 156,
      returningUsers: 2185,
      avgSessionTime: '8m 32s'
    },
    spotMetrics: {
      totalSpots: 1456,
      activeSpots: 1234,
      popularSpots: 89,
      avgRating: 4.2,
      totalReviews: 3456,
      totalCheckins: 12890
    },
    revenueMetrics: {
      totalRevenue: 45678,
      monthlyRevenue: 12345,
      avgTransaction: 23.45,
      conversionRate: 3.2,
      topRevenueSource: 'Premium Listings'
    },
    engagementMetrics: {
      totalInteractions: 45678,
      likes: 12345,
      comments: 3456,
      shares: 2341,
      avgEngagementRate: 78.5,
      bounceRate: 21.5
    }
  });

  const periods = [
    { id: '24h', name: 'Last 24 Hours', icon: Clock },
    { id: '7d', name: 'Last 7 Days', icon: Calendar },
    { id: '30d', name: 'Last 30 Days', icon: Calendar },
    { id: '90d', name: 'Last 90 Days', icon: Calendar },
    { id: '1y', name: 'Last Year', icon: Calendar }
  ];

  const metrics = [
    { id: 'all', name: 'All Metrics', icon: BarChart3 },
    { id: 'users', name: 'User Metrics', icon: Users },
    { id: 'spots', name: 'Spot Metrics', icon: MapPin },
    { id: 'revenue', name: 'Revenue Metrics', icon: DollarSign },
    { id: 'engagement', name: 'Engagement Metrics', icon: Heart }
  ];

  const chartData = useMemo(() => {
    // Generate mock chart data based on selected period
    const dataPoints = selectedPeriod === '24h' ? 24 : selectedPeriod === '7d' ? 7 : selectedPeriod === '30d' ? 30 : 12;
    return Array.from({ length: dataPoints }, (_, i) => ({
      label: selectedPeriod === '24h' ? `${i}:00` : selectedPeriod === '7d' ? `Day ${i + 1}` : selectedPeriod === '30d' ? `Day ${i + 1}` : `Month ${i + 1}`,
      users: Math.floor(Math.random() * 1000) + 500,
      spots: Math.floor(Math.random() * 500) + 200,
      revenue: Math.floor(Math.random() * 2000) + 1000,
      engagement: Math.floor(Math.random() * 100) + 50
    }));
  }, [selectedPeriod]);

  const StatCard = ({ title, value, change, icon: Icon, color = 'blue' }) => {
    const isPositive = change > 0;
    const isNegative = change < 0;
    
    const colorClasses = {
      blue: 'from-blue-500 to-blue-600',
      green: 'from-green-500 to-green-600',
      purple: 'from-purple-500 to-purple-600',
      orange: 'from-orange-500 to-orange-600',
      red: 'from-red-500 to-red-600'
    };

    return (
      <div className="stat-card">
        <div className={`stat-icon ${colorClasses[color]}`}>
          <Icon size={24} />
        </div>
        <div className="stat-content">
          <h3>{title}</h3>
          <div className="stat-value">{value}</div>
          <div className={`stat-change ${isPositive ? 'positive' : isNegative ? 'negative' : 'neutral'}`}>
            {isPositive && <ArrowUp size={14} />}
            {isNegative && <ArrowDown size={14} />}
            {!isPositive && !isNegative && <Minus size={14} />}
            {Math.abs(change)}%
          </div>
        </div>
      </div>
    );
  };

  const ChartSection = ({ title, data, color = 'blue' }) => {
    const maxValue = Math.max(...data.map(d => d.users || d.spots || d.revenue || d.engagement));
    
    return (
      <div className="chart-section">
        <div className="chart-header">
          <h3>{title}</h3>
          <button className="chart-download-btn">
            <Download size={16} />
          </button>
        </div>
        <div className="chart-container">
          <div className="chart-bars">
            {data.map((item, index) => (
              <div key={index} className="chart-bar-wrapper">
                <div 
                  className="chart-bar"
                  style={{ 
                    height: `${((item.users || item.spots || item.revenue || item.engagement) / maxValue) * 100}%`,
                    background: `linear-gradient(135deg, 
                      ${color === 'blue' ? '#3b82f6' : color === 'green' ? '#10b981' : color === 'purple' ? '#8b5cf6' : '#f59e0b'}, 
                      ${color === 'blue' ? '#2563eb' : color === 'green' ? '#059669' : color === 'purple' ? '#7c3aed' : '#d97706'})`
                  }}
                />
                <div className="chart-label">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="analytics-page">
      <div className="analytics-header">
        <div className="analytics-title">
          <BarChart3 size={28} />
          <h1>Analytics Dashboard</h1>
        </div>
        <div className="analytics-controls">
          <div className="period-selector">
            <button 
              className="period-button"
              onClick={() => setShowPeriodDropdown(!showPeriodDropdown)}
            >
              <Calendar size={16} />
              {periods.find(p => p.id === selectedPeriod)?.name}
              <ChevronDown size={16} className={`chevron ${showPeriodDropdown ? 'up' : ''}`} />
            </button>
            {showPeriodDropdown && (
              <div className="period-dropdown">
                {periods.map(period => (
                  <div
                    key={period.id}
                    className={`period-option ${selectedPeriod === period.id ? 'active' : ''}`}
                    onClick={() => {
                      setSelectedPeriod(period.id);
                      setShowPeriodDropdown(false);
                    }}
                  >
                    <period.icon size={14} />
                    {period.name}
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="metric-selector">
            <button 
              className="metric-button"
              onClick={() => setShowMetricDropdown(!showMetricDropdown)}
            >
              <Filter size={16} />
              {metrics.find(m => m.id === selectedMetric)?.name}
              <ChevronDown size={16} className={`chevron ${showMetricDropdown ? 'up' : ''}`} />
            </button>
            {showMetricDropdown && (
              <div className="metric-dropdown">
                {metrics.map(metric => (
                  <div
                    key={metric.id}
                    className={`metric-option ${selectedMetric === metric.id ? 'active' : ''}`}
                    onClick={() => {
                      setSelectedMetric(metric.id);
                      setShowMetricDropdown(false);
                    }}
                  >
                    <metric.icon size={14} />
                    {metric.name}
                  </div>
                ))}
              </div>
            )}
          </div>
          <button className="export-button">
            <Download size={16} />
            Export Report
          </button>
        </div>
      </div>

      <div className="analytics-overview">
        <StatCard 
          title="Total Users" 
          value={analyticsData.overview.totalUsers.toLocaleString()} 
          change={analyticsData.overview.growth}
          icon={Users}
          color="blue"
        />
        <StatCard 
          title="Active Users" 
          value={analyticsData.overview.activeUsers.toLocaleString()} 
          change={8.2}
          icon={Activity}
          color="green"
        />
        <StatCard 
          title="Total Spots" 
          value={analyticsData.overview.totalSpots.toLocaleString()} 
          change={15.3}
          icon={MapPin}
          color="purple"
        />
        <StatCard 
          title="Revenue" 
          value={`$${analyticsData.overview.revenue.toLocaleString()}`} 
          change={12.7}
          icon={DollarSign}
          color="orange"
        />
        <StatCard 
          title="Engagement Rate" 
          value={`${analyticsData.overview.engagement}%`} 
          change={-2.1}
          icon={Heart}
          color="red"
        />
      </div>

      <div className="analytics-charts">
        <div className="charts-grid">
          <ChartSection 
            title="User Activity" 
            data={chartData} 
            color="blue"
          />
          <ChartSection 
            title="Spot Performance" 
            data={chartData} 
            color="green"
          />
          <ChartSection 
            title="Revenue Trends" 
            data={chartData} 
            color="purple"
          />
          <ChartSection 
            title="Engagement Metrics" 
            data={chartData} 
            color="orange"
          />
        </div>
      </div>

      <div className="analytics-details">
        <div className="detail-section">
          <h3>User Metrics</h3>
          <div className="detail-grid">
            <div className="detail-item">
              <div className="detail-label">Daily Active Users</div>
              <div className="detail-value">{analyticsData.userMetrics.dailyActive.toLocaleString()}</div>
            </div>
            <div className="detail-item">
              <div className="detail-label">Weekly Active Users</div>
              <div className="detail-value">{analyticsData.userMetrics.weeklyActive.toLocaleString()}</div>
            </div>
            <div className="detail-item">
              <div className="detail-label">Monthly Active Users</div>
              <div className="detail-value">{analyticsData.userMetrics.monthlyActive.toLocaleString()}</div>
            </div>
            <div className="detail-item">
              <div className="detail-label">New Users</div>
              <div className="detail-value">{analyticsData.userMetrics.newUsers.toLocaleString()}</div>
            </div>
            <div className="detail-item">
              <div className="detail-label">Returning Users</div>
              <div className="detail-value">{analyticsData.userMetrics.returningUsers.toLocaleString()}</div>
            </div>
            <div className="detail-item">
              <div className="detail-label">Avg Session Time</div>
              <div className="detail-value">{analyticsData.userMetrics.avgSessionTime}</div>
            </div>
          </div>
        </div>

        <div className="detail-section">
          <h3>Spot Metrics</h3>
          <div className="detail-grid">
            <div className="detail-item">
              <div className="detail-label">Total Spots</div>
              <div className="detail-value">{analyticsData.spotMetrics.totalSpots.toLocaleString()}</div>
            </div>
            <div className="detail-item">
              <div className="detail-label">Active Spots</div>
              <div className="detail-value">{analyticsData.spotMetrics.activeSpots.toLocaleString()}</div>
            </div>
            <div className="detail-item">
              <div className="detail-label">Popular Spots</div>
              <div className="detail-value">{analyticsData.spotMetrics.popularSpots.toLocaleString()}</div>
            </div>
            <div className="detail-item">
              <div className="detail-label">Average Rating</div>
              <div className="detail-value">{analyticsData.spotMetrics.avgRating}/5.0</div>
            </div>
            <div className="detail-item">
              <div className="detail-label">Total Reviews</div>
              <div className="detail-value">{analyticsData.spotMetrics.totalReviews.toLocaleString()}</div>
            </div>
            <div className="detail-item">
              <div className="detail-label">Total Check-ins</div>
              <div className="detail-value">{analyticsData.spotMetrics.totalCheckins.toLocaleString()}</div>
            </div>
          </div>
        </div>

        <div className="detail-section">
          <h3>Revenue Metrics</h3>
          <div className="detail-grid">
            <div className="detail-item">
              <div className="detail-label">Total Revenue</div>
              <div className="detail-value">${analyticsData.revenueMetrics.totalRevenue.toLocaleString()}</div>
            </div>
            <div className="detail-item">
              <div className="detail-label">Monthly Revenue</div>
              <div className="detail-value">${analyticsData.revenueMetrics.monthlyRevenue.toLocaleString()}</div>
            </div>
            <div className="detail-item">
              <div className="detail-label">Avg Transaction</div>
              <div className="detail-value">${analyticsData.revenueMetrics.avgTransaction}</div>
            </div>
            <div className="detail-item">
              <div className="detail-label">Conversion Rate</div>
              <div className="detail-value">{analyticsData.revenueMetrics.conversionRate}%</div>
            </div>
            <div className="detail-item">
              <div className="detail-label">Top Revenue Source</div>
              <div className="detail-value">{analyticsData.revenueMetrics.topRevenueSource}</div>
            </div>
          </div>
        </div>

        <div className="detail-section">
          <h3>Engagement Metrics</h3>
          <div className="detail-grid">
            <div className="detail-item">
              <div className="detail-label">Total Interactions</div>
              <div className="detail-value">{analyticsData.engagementMetrics.totalInteractions.toLocaleString()}</div>
            </div>
            <div className="detail-item">
              <div className="detail-label">Likes</div>
              <div className="detail-value">{analyticsData.engagementMetrics.likes.toLocaleString()}</div>
            </div>
            <div className="detail-item">
              <div className="detail-label">Comments</div>
              <div className="detail-value">{analyticsData.engagementMetrics.comments.toLocaleString()}</div>
            </div>
            <div className="detail-item">
              <div className="detail-label">Shares</div>
              <div className="detail-value">{analyticsData.engagementMetrics.shares.toLocaleString()}</div>
            </div>
            <div className="detail-item">
              <div className="detail-label">Avg Engagement Rate</div>
              <div className="detail-value">{analyticsData.engagementMetrics.avgEngagementRate}%</div>
            </div>
            <div className="detail-item">
              <div className="detail-label">Bounce Rate</div>
              <div className="detail-value">{analyticsData.engagementMetrics.bounceRate}%</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
