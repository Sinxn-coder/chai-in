import React, { useState, useEffect } from 'react';
import { Bell, Settings, RefreshCw, Users, MapPin, DollarSign, Activity, FileText, Settings as SettingsIcon, CheckCircle, ArrowRight, BarChart2, Download, ChevronUp } from 'lucide-react';
import { supabase } from './supabase';

const DashboardPage = ({ setActiveTab }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showRefreshAnimation, setShowRefreshAnimation] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeSection, setActiveSection] = useState(null);

  const [stats, setStats] = useState({
    users: 0,
    usersGrowth: '+12.5%',
    spots: 0,
    spotsGrowth: '+8.2%',
    revenue: 45678,
    revenueGrowth: '+23.7%'
  });

  const [recentActivities, setRecentActivities] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);
  const [usageStats, setUsageStats] = useState([]);
  const [isPaginationLoading, setIsPaginationLoading] = useState(false);
  const [hasMoreActivities, setHasMoreActivities] = useState(true);
  const [showBackToTop, setShowBackToTop] = useState(false);

  const fetchActivities = async (offset = 0) => {
    try {
      const { data: postsData, error: postsError } = await supabase
        .from('posts')
        .select(`
          id,
          content,
          created_at,
          spot_name,
          author:user_id(full_name, avatar_url)
        `)
        .order('created_at', { ascending: false })
        .range(offset, offset + (offset === 0 ? 19 : 9));

      if (postsError) throw postsError;

      if (postsData.length < (offset === 0 ? 20 : 10)) {
        setHasMoreActivities(false);
      }

      const formatted = postsData.map(post => {
        const created = new Date(post.created_at);
        const now = new Date();
        const diffInHours = Math.floor((now - created) / (1000 * 60 * 60));
        const timeStr = diffInHours < 1 ? 'Just now' : diffInHours < 24 ? `${diffInHours}h ago` : `${Math.floor(diffInHours / 24)}d ago`;

        return {
          id: post.id,
          user: post.author?.full_name || 'Anonymous',
          action: `shared a post at "${post.spot_name || 'General'}"`,
          time: timeStr,
          avatar: post.author?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(post.author?.full_name || 'A')}&background=random`
        };
      });

      if (offset === 0) {
        setRecentActivities(formatted);
      } else {
        setRecentActivities(prev => [...prev, ...formatted]);
      }
    } catch (err) {
      console.error('Error fetching activities:', err);
    }
  };

  const fetchData = async () => {
    setIsLoading(true);
    setHasMoreActivities(true);
    try {
      // 1. Fetch Stats
      const [usersCount, spotsCount] = await Promise.all([
        supabase.from('users').select('*', { count: 'exact', head: true }),
        supabase.from('spots').select('*', { count: 'exact', head: true, eq: { status: 'approved' } })
      ]);

      setStats(prev => ({
        ...prev,
        users: usersCount.count || 0,
        spots: spotsCount.count || 0
      }));

      // 2. Fetch Recent Activities (Initial load)
      await fetchActivities(0);

      // 3. Fetch Recent Users for avatars
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('avatar_url, full_name')
        .not('avatar_url', 'is', null)
        .order('created_at', { ascending: false })
        .limit(3);

      if (userError) throw userError;
      setRecentUsers(userData || []);

      // 4. Fetch Usage stats for the chart (Last 8 days)
      const eightDaysAgo = new Date();
      eightDaysAgo.setDate(eightDaysAgo.getDate() - 7);
      const dateStr = eightDaysAgo.toISOString().split('T')[0];

      const { data: usageData, error: usageError } = await supabase
        .from('user_usage')
        .select('usage_date, minutes')
        .gte('usage_date', dateStr)
        .order('usage_date', { ascending: true });

      if (usageError) throw usageError;

      // Group by date and calculate heights
      const dayData = {};
      // Initialize with 0s for last 8 days
      for (let i = 7; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        dayData[d.toISOString().split('T')[0]] = 0;
      }

      usageData.forEach(entry => {
        dayData[entry.usage_date] = (dayData[entry.usage_date] || 0) + entry.minutes;
      });

      const processedUsage = Object.entries(dayData).map(([date, mins]) => ({
        date,
        minutes: mins,
        label: new Date(date).toLocaleDateString('en-US', { weekday: 'short' })
      }));

      // Normalize heights for the chart (max value = 100%)
      const maxMins = Math.max(...processedUsage.map(d => d.minutes), 1); // Avoid div by 0
      const chartValues = processedUsage.map(d => ({
        ...d,
        height: Math.max(10, (d.minutes / maxMins) * 100) // Min height 10% for visibility
      }));

      setUsageStats(chartValues);

    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const timer = setInterval(() => setCurrentTime(new Date()), 60000); // Update time every minute

    const handleScroll = () => {
      if (window.pageYOffset > 300) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      clearInterval(timer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleRefresh = async () => {
    setCurrentTime(new Date()); // Sync clock
    await fetchData();
    setShowRefreshAnimation(true);
    setTimeout(() => setShowRefreshAnimation(false), 2000);
  };

  const toggleSection = (section) => {
    setActiveSection(prev => prev === section ? null : section);
  };

  const handleLoadMore = async () => {
    if (isPaginationLoading || !hasMoreActivities) return;
    setIsPaginationLoading(true);
    await fetchActivities(recentActivities.length);
    setIsPaginationLoading(false);
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const formatGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const formatDate = () => {
    return currentTime.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  };

  const formatTime = () => {
    return currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="bento-dashboard-page">
      {/* Refresh Animation Overlay */}
      {showRefreshAnimation && (
        <div className="refresh-animation-overlay">
          <div className="refresh-animation-content">
            <div className="refresh-icon-large">
              <RefreshCw className="w-16 h-16 animate-spin" />
            </div>
            <div className="refresh-text">
              <h3>Dashboard Updated!</h3>
              <p>All data has been refreshed successfully</p>
            </div>
            <div className="refresh-checkmarks">
              <div className="checkmark"><CheckCircle className="w-8 h-8 text-green-500" /></div>
            </div>
          </div>
        </div>
      )}

      {/* Main Bento Grid */}
      <div className="bento-grid">

        {/* Cell 1: Welcome Header (Spans 2 columns) */}
        <div className="bento-cell bento-welcome">
          <div className="welcome-content">
            <div className="welcome-text">
              <span className="welcome-date">{formatDate()}</span>
              <h1>{formatGreeting()}, <span>Admin</span></h1>
              <p>Here's what's happening on your platform today. System metrics are looking strong across all active regions.</p>
            </div>
            <div className="welcome-time">
              <span>{formatTime()}</span>
            </div>
          </div>
          <div className="welcome-actions">
            <button className="bento-icon-btn" onClick={handleRefresh} title="Sync Data">
              <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
            <button className="bento-icon-btn" onClick={() => setActiveTab('notifications')} title="Alerts">
              <Bell className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Cell 2: Revenue Stat */}
        <div className="bento-cell bento-stat bento-revenue">
          <div className="stat-icon-wrapper">
            <DollarSign className="w-6 h-6" />
          </div>
          <div className="stat-data">
            <span className="stat-label">Monthly Revenue</span>
            <div className="stat-value-row">
              <h2>${stats.revenue.toLocaleString()}</h2>
              <span className="stat-badge positive">{stats.revenueGrowth}</span>
            </div>
            <div className="stat-chart-mini pulse-chart"></div>
          </div>
        </div>

        {/* Cell 3: Users Stat */}
        <div className="bento-cell bento-stat bento-users">
          <div className="stat-icon-wrapper">
            <Users className="w-6 h-6" />
          </div>
          <div className="stat-data">
            <span className="stat-label">Active Users</span>
            <div className="stat-value-row">
              <h2>{stats.users.toLocaleString()}</h2>
              <span className="stat-badge positive">{stats.usersGrowth}</span>
            </div>
            <div className="user-avatars-mini">
              {recentUsers.map((user, idx) => (
                <img 
                  key={idx} 
                  src={user.avatar_url} 
                  alt={user.full_name} 
                  onError={(e) => {
                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.full_name || 'U')}&background=random`;
                  }}
                />
              ))}
              {stats.users > recentUsers.length && (
                <div className="avatar-more">
                  +{stats.users > 1000 ? `${(stats.users / 1000).toFixed(1)}k` : stats.users - recentUsers.length}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Cell 4: Main Chart Placeholder (Spans 2x2) */}
        <div className="bento-cell bento-chart">
          <div className="bento-cell-header">
            <h3>Growth Trajectory</h3>
            <button className="bento-sub-btn">View All <ArrowRight className="w-4 h-4" /></button>
          </div>
          <div className="chart-placeholder">
            <div className="chart-bars">
              {usageStats.length > 0 ? (
                usageStats.map((stat, i) => (
                  <div key={i} className="chart-bar-wrapper" title={`${stat.minutes} mins`}>
                    <div className="chart-bar" style={{ height: `${stat.height}%` }}></div>
                  </div>
                ))
              ) : (
                [40, 65, 45, 80, 55, 90, 75, 100].map((height, i) => (
                  <div key={i} className="chart-bar" style={{ height: `${height}%` }}></div>
                ))
              )}
            </div>
            <div className="chart-labels">
              {usageStats.length > 0 ? (
                usageStats.map((stat, i) => (
                  <span key={i}>{i === usageStats.length - 1 ? 'Today' : stat.label}</span>
                ))
              ) : (
                <><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span><span>Today</span></>
              )}
            </div>
          </div>
        </div>

        {/* Cell 5: Activity Feed (Spans 1 col, 2 rows) */}
        <div className="bento-cell bento-activity">
          <div className="bento-cell-header">
            <h3>Live Feed</h3>
            <span className="live-indicator"></span>
          </div>
          <div className="bento-activity-list">
            {recentActivities.slice(0, 5).map(activity => (
              <div key={activity.id} className="bento-activity-item">
                <img src={activity.avatar} alt="avatar" className="activity-avatar" />
                <div className="activity-info">
                  <span className="activity-name">{activity.user}</span>
                  <span className="activity-desc">{activity.action}</span>
                </div>
                <span className="activity-time">{activity.time}</span>
              </div>
            ))}
          </div>
          <button
            className={`bento-full-btn ${activeSection === 'activity' ? 'active' : ''}`}
            onClick={() => toggleSection('activity')}
          >
            See All Activity
          </button>
        </div>

        {/* Cell 6: Quick Actions Buttons (2x2 grid inside a single cell) */}
        <div className="bento-cell bento-actions">
          <div className="bento-actions-grid">
            <button
              className={`bento-action-mini color-blue ${activeSection === 'analytics' ? 'active' : ''}`}
              onClick={() => toggleSection('analytics')}
            >
              <BarChart2 className="w-5 h-5" />
              <span>Analytics</span>
            </button>
            <button
              className={`bento-action-mini color-orange ${activeSection === 'reports' ? 'active' : ''}`}
              onClick={() => toggleSection('reports')}
            >
              <FileText className="w-5 h-5" />
              <span>Reports</span>
            </button>
            <button
              className={`bento-action-mini color-green ${activeSection === 'import' ? 'active' : ''}`}
              onClick={() => toggleSection('import')}
            >
              <Activity className="w-5 h-5" />
              <span>Import</span>
            </button>
            <button
              className={`bento-action-mini color-gray ${activeSection === 'setup' ? 'active' : ''}`}
              onClick={() => toggleSection('setup')}
            >
              <SettingsIcon className="w-5 h-5" />
              <span>Setup</span>
            </button>
          </div>
        </div>

        {/* Cell 7: Spots Stat */}
        <div className="bento-cell bento-stat bento-spots">
          <div className="stat-icon-wrapper">
            <MapPin className="w-6 h-6" />
          </div>
          <div className="stat-data">
            <span className="stat-label">Verified Spots</span>
            <div className="stat-value-row">
              <h2>{stats.spots.toLocaleString()}</h2>
              <span className="stat-badge positive">{stats.spotsGrowth}</span>
            </div>
            <div className="progress-bar-container">
              <div className="progress-bar-fill" style={{ width: '75%' }}></div>
            </div>
            <span className="progress-label">75% capacity goal</span>
          </div>
        </div>

      </div>

      {/* Expanded Sections Container */}
      <div className="bento-sections-container">

        {/* Analytics Section */}
        {activeSection === 'analytics' && (
          <div className="bento-expanded-card animation-slide-up">
            <div className="bento-expanded-header">
              <div className="header-icon-part bg-blue">
                <BarChart2 className="w-6 h-6 text-blue" />
              </div>
              <div className="header-text-part">
                <h2>Advanced Analytics</h2>
                <p>Deep dive into platform performance metrics</p>
              </div>
            </div>

            <div className="bento-mini-grid">
              <div className="bento-mini-cell">
                <span className="mini-label">Session Duration</span>
                <h3>4m 32s</h3>
                <span className="stat-badge positive">+12s</span>
              </div>
              <div className="bento-mini-cell">
                <span className="mini-label">Conversion Rate</span>
                <h3>3.8%</h3>
                <span className="stat-badge positive">+0.4%</span>
              </div>
              <div className="bento-mini-cell">
                <span className="mini-label">Bounce Rate</span>
                <h3>42.1%</h3>
                <span className="stat-badge negative">-2.1%</span>
              </div>
            </div>
          </div>
        )}

        {/* Reports Section */}
        {activeSection === 'reports' && (
          <div className="bento-expanded-card animation-slide-up">
            <div className="bento-expanded-header">
              <div className="header-icon-part bg-orange">
                <FileText className="w-6 h-6 text-orange" />
              </div>
              <div className="header-text-part">
                <h2>Generate Reports</h2>
                <p>Export data for accounting and analysis</p>
              </div>
            </div>

            <div className="bento-report-list">
              <div className="report-item">
                <div className="report-info">
                  <h4>Monthly Revenue Summary</h4>
                  <p>PDF export of all transactions and platform fees.</p>
                </div>
                <button className="bento-outline-btn">
                  <Download className="w-4 h-4" />
                  Download PDF
                </button>
              </div>
              <div className="report-item">
                <div className="report-info">
                  <h4>User Growth Export</h4>
                  <p>CSV file containing all user acquisition data.</p>
                </div>
                <button className="bento-outline-btn">
                  <Download className="w-4 h-4" />
                  Download CSV
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Import Section */}
        {activeSection === 'import' && (
          <div className="bento-expanded-card animation-slide-up">
            <div className="bento-expanded-header">
              <div className="header-icon-part bg-green">
                <Activity className="w-6 h-6 text-green" />
              </div>
              <div className="header-text-part">
                <h2>Data Import</h2>
                <p>Sync external data into the platform</p>
              </div>
            </div>

            <div className="bento-import-area">
              <div className="upload-zone">
                <Activity className="w-10 h-10 text-gray-400 mb-2" />
                <p>Drag and drop your CSV or JSON files here</p>
                <span>or click to browse from your computer</span>
              </div>
              <button className="bento-filled-btn mt-4 w-full bg-green text-white">Select File</button>
            </div>
          </div>
        )}

        {/* Setup Section */}
        {activeSection === 'setup' && (
          <div className="bento-expanded-card animation-slide-up">
            <div className="bento-expanded-header">
              <div className="header-icon-part bg-gray">
                <SettingsIcon className="w-6 h-6 text-slate" />
              </div>
              <div className="header-text-part">
                <h2>System Configuration</h2>
                <p>Manage core platform behaviors</p>
              </div>
            </div>

            <div className="bento-settings-list">
              <div className="bento-setting-item">
                <div>
                  <h4>Maintenance Mode</h4>
                  <p>Disables external access to the platform</p>
                </div>
                <div className="toggle-switch">
                  <input type="checkbox" />
                  <span className="toggle-slider"></span>
                </div>
              </div>
              <div className="bento-setting-item">
                <div>
                  <h4>Auto-Approve Spots</h4>
                  <p>Skip manual verification for new submissions</p>
                </div>
                <div className="toggle-switch">
                  <input type="checkbox" defaultChecked />
                  <span className="toggle-slider"></span>
                </div>
              </div>
              <div className="bento-setting-item">
                <div>
                  <h4>Debug Logging</h4>
                  <p>Log all API requests to the database</p>
                </div>
                <div className="toggle-switch">
                  <input type="checkbox" />
                  <span className="toggle-slider"></span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Activity Section */}
        {activeSection === 'activity' && (
          <div className="bento-expanded-card animation-slide-up">
            <div className="bento-expanded-header">
              <div className="header-icon-part bg-purple">
                <Bell className="w-6 h-6 text-purple" />
              </div>
              <div className="header-text-part">
                <h2>Platform Activity Log</h2>
                <p>Comprehensive history of all user and system events</p>
              </div>
            </div>

            <div className="bento-full-activity-list">
              {recentActivities.map(activity => (
                <div key={activity.id} className="bento-activity-item expanded">
                  <img src={activity.avatar} alt="avatar" className="activity-avatar" />
                  <div className="activity-info">
                    <span className="activity-name">{activity.user}</span>
                    <span className="activity-desc">{activity.action}</span>
                  </div>
                  <span className="activity-time">{activity.time}</span>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '24px' }}>
              {hasMoreActivities ? (
                <button
                  className={`bento-outline-btn ${isPaginationLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  onClick={handleLoadMore}
                  disabled={isPaginationLoading}
                >
                  {isPaginationLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin mr-2" />
                      Loading...
                    </>
                  ) : (
                    'Load Older Events'
                  )}
                </button>
              ) : (
                <span className="text-gray-400 text-sm">All activities loaded</span>
              )}
            </div>
          </div>
        )}

      </div>

      {/* Back to Top Button */}
      <button 
        className={`back-to-top-btn ${showBackToTop ? 'visible' : ''}`}
        onClick={scrollToTop}
        title="Back to Top"
      >
        <ChevronUp className="w-6 h-6" />
      </button>

    </div>
  );
};

export default DashboardPage;
