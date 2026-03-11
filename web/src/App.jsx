import React, { useState, useMemo, useEffect, useRef } from 'react';
import SettingsPage from './SettingsPage';
import CommunityPage from './CommunityPage';
import DashboardPage from './DashboardPage';
import MobileIntro from './MobileIntro';
import AdminLoginPage from './AdminLoginPage';
import PushNotifications from './PushNotifications';
import SpotsDesktop from './SpotsDesktop';
import SpotsMobile from './SpotsMobile';
import { supabase } from './supabase';
import './DashboardPage.css';
import './mobile.css';
import {
  Layout,
  Users,
  Star,
  BarChart3,
  Settings,
  CheckCircle,
  Phone,
  MessageSquare,
  MapPin,
  ArrowLeft,
  Wrench,
  Bell,
  MoreVertical,
  Edit,
  Eye,
  X,
  Ban,
  Trash2,
  Search,
  Filter,
  ChevronDown,
  Download,
  RotateCw,
  AlertCircle,
  Shield
} from 'lucide-react';
import './index.css';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobile, setIsMobile] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [mobileAdminTab, setMobileAdminTab] = useState('spots');
  const [loading, setLoading] = useState(true);

  // Mobile detection effect
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Supabase session check and admin login logic
  useEffect(() => {
    const checkSession = async () => {
      try {
        console.log('Checking for existing session...');
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) {
          console.error('Session retrieval error:', error);
        }

        if (session) {
          console.log('Session found for:', session.user.email);
          if (session.user.email === 'bytspot.in@gmail.com') {
            setIsAdminLoggedIn(true);
          } else {
            console.warn('Unauthorized user blocked:', session.user.email);
            setIsAdminLoggedIn(false);
            await supabase.auth.signOut();
          }
        } else {
          console.log('No active session detected.');
        }
      } catch (err) {
        console.error('Unexpected auth check error:', err);
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event);
      if (session) {
        if (session.user.email === 'bytspot.in@gmail.com') {
          setIsAdminLoggedIn(true);
        } else {
          setIsAdminLoggedIn(false);
          await supabase.auth.signOut();
        }
      } else {
        setIsAdminLoggedIn(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleAdminLogin = () => { // Renamed from handleMobileLogin
    setIsAdminLoggedIn(true);
  };

  const handleMobileLogout = () => {
    setIsAdminLoggedIn(false);
  };



  const navItems = [
    { id: 'dashboard', name: 'Dashboard', icon: Layout },
    { id: 'users', name: 'Users', icon: Users },
    { id: 'spots', name: 'Spots', icon: MapPin },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'settings', name: 'Settings', icon: Settings },
    { id: 'community', name: 'Community', icon: Users },
    { id: 'analytics', name: 'Analytics', icon: BarChart3 }
  ];

  const getActiveTabName = () => {
    const activeItem = navItems.find(item => item.id === activeTab);
    return activeItem ? activeItem.name : 'Dashboard';
  };

  // User data from Supabase
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [errorUsers, setErrorUsers] = useState(false);

  // Spot data from Supabase
  const [spots, setSpots] = useState([]);
  const [loadingSpots, setLoadingSpots] = useState(true);

  // Fetch spots from Supabase
  const fetchSpots = async () => {
    try {
      setLoadingSpots(true);
      const { data, error } = await supabase
        .from('spots')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;

      // Map Supabase fields to UI fields if necessary
      const mappedSpots = (data || []).map(spot => ({
        ...spot,
        reviews: spot.review_count || 0, // Map review_count to reviews
        added: new Date(spot.created_at).toISOString().split('T')[0], // Format date
        // UI expects 'verified', 'pending', 'flagged'
        // Supabase has 'approved', 'pending', 'rejected'
        status: spot.status === 'approved' ? 'verified' : (spot.status === 'rejected' ? 'flagged' : 'pending')
      }));

      setSpots(mappedSpots);
    } catch (err) {
      console.error('Error fetching spots:', err);
      setToastMessage('Failed to load real spots data');
      setShowToast(true);
    } finally {
      setLoadingSpots(false);
    }
  };

  // Fetch users from Supabase
  const fetchUsers = async () => {
    try {
      console.log('Initiating fetchUsers query...');
      setLoadingUsers(true);
      setErrorUsers(false);
      const { data, error } = await supabase
        .from('users')
        .select(`
          id, 
          email, 
          full_name, 
          avatar_url, 
          status,
          created_at,
          reviews!user_id(count),
          spots!created_by(count),
          followers:follows!following_id(count),
          posts!user_id(count)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase query error:', error);
        throw error;
      }

      console.log('Users data fetched successfully:', data?.length, 'users found');
      // Log first user to check structure
      if (data && data.length > 0) {
        console.log('First user structure sample:', JSON.stringify(data[0], null, 2));
      }

      const mappedUsers = (data || []).map(user => ({
        id: user.id,
        name: user.full_name || 'Anonymous User',
        email: user.email,
        status: user.status || 'active', 
        joined: user.created_at ? new Date(user.created_at).toISOString().split('T')[0] : 'N/A',
        lastActive: user.created_at ? new Date(user.created_at).toISOString().split('T')[0] : 'N/A', // Using created_at as fallback
        spots: user.spots?.[0]?.count || 0,
        reviews: user.reviews?.[0]?.count || 0,
        followers: user.followers?.[0]?.count || 0,
        posts: user.posts?.[0]?.count || 0
      }));

      setUsers(mappedUsers);
    } catch (err) {
      console.error('Error fetching users:', err);
      if (err.message) console.error('Error message:', err.message);
      if (err.details) console.error('Error details:', err.details);
      if (err.hint) console.error('Error hint:', err.hint);
      setErrorUsers(true);
      setToastMessage('Failed to load real users data');
      setShowToast(true);
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    if (isAdminLoggedIn) {
      if (activeTab === 'spots') {
        fetchSpots();
      } else if (activeTab === 'users') {
        fetchUsers();
      }
    }
  }, [isAdminLoggedIn, activeTab]);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [showItemsPerPageDropdown, setShowItemsPerPageDropdown] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [selectedUserForActions, setSelectedUserForActions] = useState(null);
  const [activeSpotDropdown, setActiveSpotDropdown] = useState(null);
  const [selectedUserDetail, setSelectedUserDetail] = useState(null);

  // Auto-close toasts
  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => {
        setShowToast(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);





  // Filter and search users
  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [users, searchTerm, statusFilter]);




  const handleSelectUser = (userId) => {
    setSelectedUserForActions(null); // Clear individual action bar when using batch selection
    setSelectedUsers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleExportUsers = () => {
    // Determine which users to export (selected or all filtered)
    const usersToExport = selectedUsers.length > 0
      ? filteredUsers.filter(user => selectedUsers.includes(user.id))
      : filteredUsers;

    // Create CSV content
    const headers = ['ID', 'Name', 'Email', 'Status', 'Joined Date', 'Last Active', 'Food Spots', 'Reviews'];
    const csvContent = [
      headers.join(','),
      ...usersToExport.map(user => [
        user.id,
        `"${user.name}"`,
        `"${user.email}"`,
        user.status,
        `"${user.joined || 'N/A'}"`,  // Handle missing dates
        `"${user.lastActive || 'N/A'}"`,  // Handle missing dates
        user.spots || 0,
        user.reviews || 0
      ].join(','))
    ].join('\n');

    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    // Generate filename with timestamp
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `users_export_${timestamp}${selectedUsers.length > 0 ? '_selected' : '_all'}.csv`;

    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Show success message
    const message = `Successfully exported ${usersToExport.length} users to ${filename}`;
    setToastMessage(message);
    setShowToast(true);

    // Hide toast after 3 seconds
    setTimeout(() => {
      setShowToast(false);
    }, 3000);

    console.log(message);
  };

  const handleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map(user => user.id));
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      active: 'status-badge status-active',
      banned: 'status-badge status-banned',
      published: 'status-badge status-published',
      verified: 'status-badge status-verified',
      pending: 'status-badge status-pending',
      flagged: 'status-badge status-flagged'
    };
    return (
      <span className={styles[status] || 'status-badge'}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const toggleDropdown = (userId) => {
    const user = users.find(u => u.id === userId);
    setSelectedUserForActions(user);
    setSelectedUsers([]); // Clear batch selection when opening individual actions
  };

  const handleAction = async (action, user) => {
    console.log(`${action} user:`, user.name);
    
    if (action === 'ban' || action === 'unban') {
      const newStatus = action === 'ban' ? 'banned' : 'active';
      try {
        const { error } = await supabase
          .from('users')
          .update({ status: newStatus })
          .eq('id', user.id);

        if (error) throw error;

        // Update local state
        setUsers(prev => prev.map(u => u.id === user.id ? { ...u, status: newStatus } : u));
        
        setToastMessage(`User ${user.name} has been ${action}ned successfully.`);
        setShowToast(true);
      } catch (err) {
        console.error(`Error ${action}ning user:`, err);
        setToastMessage(`Failed to ${action} user.`);
        setShowToast(true);
      }
    } else if (action === 'delete') {
      // Implement delete logic if needed
      setToastMessage("Delete functionality not yet connected to backend.");
      setShowToast(true);
    }

    setSelectedUserForActions(null);
  };

  // Close dropdown/popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.dropdown-container') && !event.target.closest('.batch-actions-popup')) {
        setSelectedUserForActions(null);
        setActiveSpotDropdown(null);
        // Remove dropdown-open class from all cards
        document.querySelectorAll('.mobile-spot-card').forEach(card => {
          card.classList.remove('dropdown-open');
        });
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [selectedUserForActions]);

  const renderUsers = () => {
    return (
      <div className="users-management">
        <div className="users-header">
          <div className="users-controls">
            <div className="modern-search-bar">
              <div className="search-input-wrapper">
                <Search size={20} className="search-icon" />
                <input
                  type="text"
                  placeholder="Search users by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
              </div>
            </div>
            <div className="modern-filter-button">
              <div className="filter-button-content" onClick={() => setShowFilterDropdown(!showFilterDropdown)}>
                <Filter size={18} className="filter-button-icon" />
                <span className="filter-button-text">Filter</span>
                <ChevronDown size={16} className="filter-button-arrow" />
              </div>
              {showFilterDropdown && (
                <div className={`filter-dropdown-menu ${showFilterDropdown ? 'show' : ''}`}>
                  <div
                    className={`filter-option ${statusFilter === 'all' ? 'active' : ''}`}
                    onClick={() => {
                      setStatusFilter('all');
                      setShowFilterDropdown(false);
                    }}
                  >
                    <div className="filter-option-content">
                      <div className="filter-option-icon">👥</div>
                      <div className="filter-option-text">
                        <div className="filter-option-title">All Users</div>
                        <div className="filter-option-description">Show all users</div>
                      </div>
                    </div>
                  </div>
                  <div
                    className={`filter-option ${statusFilter === 'active' ? 'active' : ''}`}
                    onClick={() => {
                      setStatusFilter('active');
                      setShowFilterDropdown(false);
                    }}
                  >
                    <div className="filter-option-content">
                      <div className="filter-option-icon">✅</div>
                      <div className="filter-option-text">
                        <div className="filter-option-title">Active</div>
                        <div className="filter-option-description">Active users only</div>
                      </div>
                    </div>
                  </div>
                  <div
                    className={`filter-option ${statusFilter === 'banned' ? 'active' : ''}`}
                    onClick={() => {
                      setStatusFilter('banned');
                      setShowFilterDropdown(false);
                    }}
                  >
                    <div className="filter-option-content">
                      <div className="filter-option-icon">🚫</div>
                      <div className="filter-option-text">
                        <div className="filter-option-title">Banned</div>
                        <div className="filter-option-description">Banned users only</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="users-actions">
            <div className="select-all-container">
              <label className="select-all-label">
                <input
                  type="checkbox"
                  checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                  onChange={handleSelectAll}
                  className="select-all-checkbox"
                />
                <span className="select-all-text">
                  {selectedUsers.length === filteredUsers.length && filteredUsers.length > 0
                    ? 'Deselect All'
                    : 'Select All'}
                </span>
              </label>
              <span className="selected-count">
                {selectedUsers.length > 0 && `${selectedUsers.length} selected`}
              </span>
            </div>
            <button className="premium-action-btn" onClick={handleExportUsers}>
              <Download size={16} />
              Export
            </button>
          </div>
        </div>

        <div className="users-list-container">
          <div className="users-list-header">
            <div className="ul-col ul-col-check"></div>
            <div className="ul-col ul-col-user">User Details</div>
            <div className="ul-col ul-col-status">Status</div>
            <div className="ul-col ul-col-stats">Platform Stats</div>
            <div className="ul-col ul-col-date">Joined</div>
            <div className="ul-col ul-col-actions"></div>
          </div>

          <div className="users-list-body">
            {loadingUsers ? (
              <div className="loading-state-placeholder" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px', gap: '12px', color: '#64748b' }}>
                <RotateCw size={24} className="animate-spin" />
                <span>Fetching real users...</span>
              </div>
            ) : errorUsers ? (
              <div className="error-state-placeholder" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px', gap: '16px', color: '#ef4444' }}>
                <AlertCircle size={48} strokeWidth={1.5} />
                <p style={{ fontSize: '1.1rem', fontWeight: 500 }}>Failed to load users data</p>
                <button
                  onClick={fetchUsers}
                  className="premium-action-btn premium-success"
                  style={{ marginTop: '8px' }}
                >
                  <RotateCw size={16} />
                  <span>Refresh Data</span>
                </button>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="empty-state-placeholder" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px', gap: '16px', color: '#94a3b8' }}>
                <Users size={48} strokeWidth={1.5} />
                <p style={{ fontSize: '1.1rem', fontWeight: 500 }}>No users found matching your search</p>
              </div>
            ) : (
              filteredUsers.map(user => (
                <div key={user.id} className="user-list-row group">
                  <div className="ul-col ul-col-check">
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user.id)}
                      onChange={(e) => {
                        e.stopPropagation();
                        handleSelectUser(user.id);
                      }}
                      className="checkbox subtle-checkbox"
                    />
                  </div>

                  <div className="ul-col ul-col-user">
                    <div className="user-avatar-list">
                      <div className="user-avatar-circle-list bg-gradient">{user.name.charAt(0)}</div>
                    </div>
                    <div className="user-info-list">
                      <h3 className="user-name-list">{user.name}</h3>
                      <p className="user-email-list">{user.email}</p>
                    </div>
                  </div>

                  <div className="ul-col ul-col-status">
                    <div className="status-pill-list">
                      {getStatusBadge(user.status)}
                    </div>
                  </div>

                  <div className="ul-col ul-col-stats">
                    <div className="stats-group-list">
                      <div className="stat-badge" title="Verified Spots">
                        <MapPin size={14} />
                        <span>{user.spots}</span>
                      </div>
                      <div className="stat-badge orange" title="Reviews Left">
                        <Star size={14} />
                        <span>{user.reviews}</span>
                      </div>
                    </div>
                  </div>

                  <div className="ul-col ul-col-date">
                    <span className="date-text-list">{user.joined}</span>
                  </div>

                  <div className="ul-col ul-col-actions">
                    <div className="row-actions-group">
                      <button
                        className="view-details-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedUserDetail(user);
                        }}
                        title="View Full Profile"
                      >
                        <Eye size={14} />
                        View Details
                      </button>
                      <button
                        className="row-action-icon-btn more"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleDropdown(user.id);
                        }}
                      >
                        <MoreVertical size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Individual User Actions Popup */}
        {selectedUserForActions && (
          <div className="batch-actions-popup fade-in-up">
            <div className="batch-popup-content light-glass">
              <div className="selected-info">
                <div className="user-avatar-circle-list bg-gradient" style={{ width: 32, height: 32, fontSize: '0.8rem' }}>{selectedUserForActions.name.charAt(0)}</div>
                <div className="selection-label">
                  <div>{selectedUserForActions.name}</div>
                  <div>User Actions</div>
                </div>
              </div>
              <div className="popup-divider"></div>
              <div className="batch-buttons">
                <button className="batch-btn verify" onClick={() => setSelectedUserDetail(selectedUserForActions)}>
                  <Eye size={18} />
                  Details
                </button>
                <button 
                  className="batch-btn flag" 
                  onClick={() => handleAction(selectedUserForActions.status === 'banned' ? 'unban' : 'ban', selectedUserForActions)}
                >
                  <Ban size={18} />
                  {selectedUserForActions.status === 'banned' ? 'Unban' : 'Ban'}
                </button>
                <button className="batch-btn delete" onClick={() => handleAction('delete', selectedUserForActions)}>
                  <Trash2 size={18} />
                  Delete
                </button>
              </div>
              <div className="popup-divider"></div>
              <button className="batch-clear-btn" onClick={() => setSelectedUserForActions(null)}>
                <X size={20} />
              </button>
            </div>
          </div>
        )}

        {/* Batch User Actions Popup */}
        {selectedUsers.length > 0 && (
          <div className="batch-actions-popup fade-in-up">
            <div className="batch-popup-content">
              <div className="selected-info">
                <span className="count-circle">{selectedUsers.length}</span>
                <span className="selection-label">Users selected</span>
              </div>
              <div className="popup-divider"></div>
              <div className="batch-buttons">
                <button className="batch-btn verify" style={{ color: '#10b981' }}>
                  <Shield size={18} />
                  Activate All
                </button>
                <button className="batch-btn flag" style={{ color: '#f59e0b' }}>
                  <Ban size={18} />
                  Deactivate All
                </button>
                <button className="batch-btn delete" style={{ color: '#ef4444' }}>
                  <Trash2 size={18} />
                  Delete
                </button>
              </div>
              <div className="popup-divider"></div>
              <button className="batch-clear-btn" onClick={() => setSelectedUsers([])}>
                <X size={20} />
              </button>
            </div>
          </div>
        )}

        {/* Ultra-Premium Side Panel for User Details */}
        {selectedUserDetail && (
          <div className="user-sidepanel-backdrop" onClick={() => setSelectedUserDetail(null)}>
            <div className="user-sidepanel-container animation-slide-left" onClick={(e) => e.stopPropagation()}>
              <div className="sidepanel-header">
                <button className="sidepanel-close" onClick={() => setSelectedUserDetail(null)}>
                  <X size={24} />
                </button>
                <div className="sidepanel-user-hero">
                  <div className="hero-avatar-wrapper">
                    <div className="hero-avatar">{selectedUserDetail.name.charAt(0)}</div>
                    <div className={`hero-status-dot ${selectedUserDetail.status}`}></div>
                  </div>
                  <h2 className="hero-name">{selectedUserDetail.name}</h2>
                  <p className="hero-email">{selectedUserDetail.email}</p>
                  <div className="hero-badge-wrap">
                    {getStatusBadge(selectedUserDetail.status)}
                  </div>
                </div>
              </div>

              <div className="sidepanel-scrollable-body">
                {/* Immersive Stats Grid */}
                <div className="sidepanel-bento-grid">
                  <div className="sidepanel-bento-cell spots-cell">
                    <div className="sb-icon bg-blue"><MapPin size={20} /></div>
                    <div className="sb-data">
                      <h3>{selectedUserDetail.spots}</h3>
                      <span>Created Spots</span>
                    </div>
                  </div>
                  <div className="sidepanel-bento-cell reviews-cell">
                    <div className="sb-icon bg-orange"><Star size={20} /></div>
                    <div className="sb-data">
                      <h3>{selectedUserDetail.reviews}</h3>
                      <span>Total Reviews</span>
                    </div>
                  </div>
                  <div className="sidepanel-bento-cell comments-cell">
                    <div className="sb-icon bg-green"><MessageSquare size={20} /></div>
                    <div className="sb-data">
                      <h3>{selectedUserDetail.posts || 0}</h3>
                      <span>Forum Posts</span>
                    </div>
                  </div>
                  <div className="sidepanel-bento-cell followers-cell">
                    <div className="sb-icon bg-purple"><Users size={20} /></div>
                    <div className="sb-data">
                      <h3>{selectedUserDetail.followers || 0}</h3>
                      <span>Followers</span>
                    </div>
                  </div>
                </div>

                {/* Identity Information List */}
                <div className="sidepanel-info-group">
                  <h4 className="info-group-title">Account Identity</h4>
                  <div className="info-list-card">
                    <div className="info-list-row">
                      <span className="il-label">Full Name</span>
                      <span className="il-value">{selectedUserDetail.name}</span>
                    </div>
                    <div className="info-list-row">
                      <span className="il-label">Email Address</span>
                      <span className="il-value">{selectedUserDetail.email}</span>
                    </div>
                    <div className="info-list-row">
                      <span className="il-label">Account ID</span>
                      <span className="il-value monospace">#USR{String(selectedUserDetail.id).padStart(6, '0')}</span>
                    </div>
                  </div>
                </div>

                <div className="sidepanel-info-group">
                  <h4 className="info-group-title">Timeline</h4>
                  <div className="info-list-card">
                    <div className="info-list-row">
                      <span className="il-label">Registered On</span>
                      <span className="il-value">{selectedUserDetail.joined}</span>
                    </div>
                    <div className="info-list-row">
                      <span className="il-label">Last Active</span>
                      <span className="il-value">{selectedUserDetail.lastActive}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="sidepanel-footer">
                <button className="sp-action-btn message" onClick={() => handleUserAction('message', selectedUserDetail)}>
                  <MessageSquare size={16} />
                  Message
                </button>
                <div className="sp-danger-actions">
                  <button
                    className="sp-action-btn suspend"
                    onClick={() => handleAction(selectedUserDetail.status === 'banned' ? 'unban' : 'ban', selectedUserDetail)}
                    title={selectedUserDetail.status === 'banned' ? 'Unban' : 'Suspend'}
                  >
                    <Ban size={16} />
                  </button>
                  <button className="sp-action-btn delete" onClick={() => handleAction('delete', selectedUserDetail)} title="Delete Data">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="users-footer">
          <div className="users-count">
            Showing {filteredUsers.length} of {users.length} users
          </div>
          <div className="pagination">
            <button className="premium-action-btn" disabled>Previous</button>
            <span className="page-info">Page 1 of 1</span>
            <button className="premium-action-btn" disabled>Next</button>
          </div>
        </div>
      </div>
    );
  };

  /* Modularized Spots Refactor: UI moved to SpotsDesktop.jsx and SpotsMobile.jsx */

  const renderDashboard = () => {
    return <DashboardPage setActiveTab={setActiveTab} />;
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return renderDashboard();
      case 'users':
        return renderUsers();
      case 'spots':
        return <SpotsDesktop spots={spots} loading={loadingSpots} onRefresh={fetchSpots} />;
      case 'notifications':
        return <PushNotifications />;
      case 'settings':
        return <SettingsPage />;
      case 'community':
        return <CommunityPage />;
      case 'analytics':
        return <div className="content-placeholder">Analytics Dashboard - Track user engagement, popular spots, revenue metrics, and growth trends.</div>;
      default:
        return <div className="content-placeholder">Welcome to the BytSpot Admin Dashboard.</div>;
    }
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
      </div>
    );
  }

  if (isMobile) {
    if (isAdminLoggedIn) {
      return (
        <div className="mobile-admin-dashboard ultra-simplified">
          <header className="mobile-admin-header">
            <button className="back-btn-logout" onClick={handleMobileLogout}>
              <ArrowLeft size={24} />
            </button>
            <h1>Admin Panel</h1>
            <div style={{ width: 24 }}></div> {/* Spacer for centering title */}
          </header>

          {mobileAdminTab === 'notifications' && (
            <div className="mobile-admin-search-section" style={{ justifyContent: 'center' }}>
              <div style={{ textAlign: 'center', color: '#1a202c', fontSize: '16px', fontWeight: '600' }}>
                Push Notifications
              </div>
            </div>
          )}



          <div className="mobile-admin-content-area">
            {mobileAdminTab === 'spots' ? (
              <SpotsMobile spots={spots} loading={loadingSpots} onRefresh={fetchSpots} />
            ) : mobileAdminTab === 'notifications' ? (
              <PushNotifications />
            ) : (
              <div className="mobile-settings-content">
                <div className="mobile-settings-section">
                  <h3 className="mobile-settings-title">System Settings</h3>

                  <div className="mobile-setting-item">
                    <div className="setting-info">
                      <Wrench size={20} className="setting-icon" />
                      <div className="setting-details">
                        <h4>Maintenance Mode</h4>
                        <p>Temporarily disable user access</p>
                      </div>
                    </div>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={maintenanceMode}
                        onChange={(e) => setMaintenanceMode(e.target.checked)}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>

                  <div className="mobile-setting-item">
                    <div className="setting-info">
                      <Phone size={20} className="setting-icon" />
                      <div className="setting-details">
                        <h4>Emergency Contact</h4>
                        <p>Contact number for emergencies</p>
                      </div>
                    </div>
                    <input
                      type="tel"
                      value={emergencyContact}
                      onChange={(e) => setEmergencyContact(e.target.value)}
                      className="emergency-contact-input"
                      placeholder="+1-800-HELP-NOW"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          <nav className="mobile-admin-bottom-nav">
            <button
              className={`nav-item ${mobileAdminTab === 'spots' ? 'active' : ''}`}
              onClick={() => setMobileAdminTab('spots')}
            >
              <MapPin size={24} />
              <span>Spots</span>
            </button>
            <button
              className={`nav-item ${mobileAdminTab === 'notifications' ? 'active' : ''}`}
              onClick={() => setMobileAdminTab('notifications')}
            >
              <Bell size={24} />
              <span>Notifications</span>
            </button>
            <button
              className={`nav-item ${mobileAdminTab === 'settings' ? 'active' : ''}`}
              onClick={() => setMobileAdminTab('settings')}
            >
              <Settings size={24} />
              <span>Settings</span>
            </button>
          </nav>
        </div>
      );
    }
    return <MobileIntro onLogin={handleMobileLogin} />;
  }

  if (!isAdminLoggedIn) {
    return <AdminLoginPage onLogin={handleAdminLogin} />;
  }

  return (
    <>
      <header>
        <div className="app-bar-brand">
          <div className="appIcon">🍵</div>
          <h1>BytSpot</h1>
        </div>
        <div className="header-center">{getActiveTabName()}</div>
        <div className="header-right">Admin Panel</div>
      </header>

      <nav className="sidebar">
        <ul className="nav-list">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <li
                key={item.id}
                className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
                onClick={() => setActiveTab(item.id)}
              >
                <div className="nav-icon">
                  <Icon size={24} />
                </div>
                <span className="nav-text">{item.name}</span>
              </li>
            );
          })}
        </ul>
      </nav>

      <main>
        {renderContent()}
      </main>

      {/* Toast Notification */}
      {showToast && (
        <div className="toast-notification">
          <div className="toast-content">
            <CheckCircle size={20} className="toast-icon" />
            <span className="toast-message">{toastMessage}</span>
          </div>
        </div>
      )}
    </>
  );
}
