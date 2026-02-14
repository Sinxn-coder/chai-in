import React, { useState, useEffect } from 'react';
import { Search, Bell, Settings, RefreshCw, Users, MapPin, Star, DollarSign, TrendingUp, Activity, Clock, MessageSquare, AlertCircle, Plus, BarChart, FileText, UserPlus, Settings as SettingsIcon } from 'lucide-react';

const DashboardPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Mock data for stats
  const stats = {
    users: 15234,
    spots: 456,
    reviews: 2789,
    revenue: 45678
  };

  // Recent activity data
  const recentActivities = [
    { id: 1, user: 'John Doe', action: 'added new spot "Pizza Palace"', time: '2 hours ago', type: 'spot', avatar: 'https://picsum.photos/seed/user1/40/40' },
    { id: 2, user: 'Jane Smith', action: 'left 5-star review', time: '4 hours ago', type: 'review', avatar: 'https://picsum.photos/seed/user2/40/40' },
    { id: 3, user: 'Bob Johnson', action: 'updated profile information', time: '6 hours ago', type: 'user', avatar: 'https://picsum.photos/seed/user3/40/40' },
    { id: 4, user: 'Alice Brown', action: 'reported issue with payment', time: '8 hours ago', type: 'issue', avatar: 'https://picsum.photos/seed/user4/40/40' },
    { id: 5, user: 'Charlie Wilson', action: 'completed profile verification', time: '12 hours ago', type: 'success', avatar: 'https://picsum.photos/seed/user5/40/40' },
    { id: 6, user: 'Emma Davis', action: 'shared spot with friends', time: '1 day ago', type: 'share', avatar: 'https://picsum.photos/seed/user6/40/40' }
  ];

  // Quick actions data
  const quickActions = [
    { id: 2, title: 'View Analytics', description: 'Check detailed platform analytics', icon: BarChart, color: 'green', action: 'analytics' },
    { id: 3, title: 'Generate Report', description: 'Create and download activity reports', icon: FileText, color: 'orange', action: 'report' },
    { id: 4, title: 'System Settings', description: 'Configure platform preferences', icon: SettingsIcon, color: 'gray', action: 'settings' },
    { id: 5, title: 'Import Data', description: 'Bulk import spots and users', icon: Activity, color: 'teal', action: 'import' }
  ];

  // Mobile detection effect
  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1000);
  };

  const handleQuickAction = (action) => {
    console.log(`Quick action clicked: ${action}`);
    // Handle different actions based on action type
    switch(action) {
      case 'analytics':
        console.log('Showing analytics section...');
        setShowAnalytics(!showAnalytics);
        break;
      case 'report':
        console.log('Generating report section...');
        setShowReport(!showReport);
        break;
      case 'settings':
        console.log('Opening system settings...');
        setShowSettings(!showSettings);
        break;
      case 'import':
        console.log('Opening data import...');
        break;
      default:
        console.log('Unknown action:', action);
    }
  };

  return (
    <div className="dashboard-page">
      {/* Mobile White Screen */}
      {isMobile ? (
        <div className="mobile-white-screen">
          <div className="mobile-message">
            <h2>Desktop Only</h2>
            <p>This dashboard is designed for desktop viewing only.</p>
            <p>Please access this site from a desktop or tablet device.</p>
          </div>
        </div>
      ) : (
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
      )}
    </div>
  );
};

export default DashboardPage;
