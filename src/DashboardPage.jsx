import React, { useState } from 'react';
import { Search, Bell, Settings, RefreshCw, Users, MapPin, Star, DollarSign, TrendingUp, Activity, Clock, MessageSquare, AlertCircle, Plus, BarChart, FileText, UserPlus, Settings as SettingsIcon, ChevronRight } from 'lucide-react';
import MobileDashboard from './components/MobileDashboard';
import './components/MobileDashboard.css';

const DashboardPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile on component mount and resize
  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Mock data for stats
  const stats = {
    users: 15234,
    spots: 456,
    reviews: 2789,
    revenue: 45678
  };

  // Recent activity data
  const recentActivity = [
    { id: 1, title: 'New User Registration', description: 'John Doe joined the platform', time: '2 hours ago', type: 'user' },
    { id: 2, title: 'New Spot Added', description: 'Pizza Palace was added to the platform', time: '4 hours ago', type: 'spot' },
    { id: 3, title: 'New Review', description: '5-star review for Burger House', time: '6 hours ago', type: 'review' },
    { id: 4, title: 'System Update', description: 'Platform maintenance completed successfully', time: '8 hours ago', type: 'system' }
  ];

  // Quick actions data
  const quickActions = [
    { id: 2, title: 'View Analytics', description: 'Check detailed platform analytics', icon: BarChart, color: 'green', action: 'analytics' },
    { id: 3, title: 'Generate Report', description: 'Create and download activity reports', icon: FileText, color: 'orange', action: 'report' },
    { id: 4, title: 'System Settings', description: 'Configure platform preferences', icon: SettingsIcon, color: 'gray', action: 'settings' },
    { id: 5, title: 'Import Data', description: 'Bulk import spots and users', icon: Activity, color: 'teal', action: 'import' }
  ];

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
      {/* Only show MobileDashboard on all devices */}
      <MobileDashboard />
    </div>
  );
};

export default DashboardPage;
