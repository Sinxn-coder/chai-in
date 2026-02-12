import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Layout, Users, Map, Star, BarChart3, Settings, TrendingUp, AlertCircle, CheckCircle, Clock, Search, Filter, Download, Ban, Shield, UserCheck, MoreVertical, Edit, Eye, MessageSquare, Trash2 } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const navItems = [
    { id: 'dashboard', name: 'Dashboard', icon: Layout },
    { id: 'users', name: 'Users', icon: Users },
    { id: 'spots', name: 'Spots', icon: Map },
    { id: 'reviews', name: 'Reviews', icon: Star },
    { id: 'analytics', name: 'Analytics', icon: BarChart3 },
    { id: 'settings', name: 'Settings', icon: Settings }
  ];

  const getActiveTabName = () => {
    const activeItem = navItems.find(item => item.id === activeTab);
    return activeItem ? activeItem.name : 'Dashboard';
  };

  // Mock user data
  const [users] = useState([
    { id: 1, name: 'John Doe', email: 'john@example.com', status: 'active', joined: '2024-01-15', lastActive: '2024-02-13', spots: 12, reviews: 45 },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'active', joined: '2024-01-20', lastActive: '2024-02-12', spots: 8, reviews: 23 },
    { id: 3, name: 'Mike Johnson', email: 'mike@example.com', status: 'banned', joined: '2023-12-10', lastActive: '2024-02-01', spots: 3, reviews: 15 },
    { id: 4, name: 'Tom Brown', email: 'tom@example.com', status: 'active', joined: '2023-11-25', lastActive: '2024-02-13', spots: 15, reviews: 67 },
    { id: 5, name: 'Emily Davis', email: 'emily@example.com', status: 'active', joined: '2024-01-05', lastActive: '2024-02-11', spots: 6, reviews: 19 },
    { id: 6, name: 'Chris Lee', email: 'chris@example.com', status: 'banned', joined: '2023-10-15', lastActive: '2024-01-20', spots: 2, reviews: 8 },
    { id: 7, name: 'Lisa Anderson', email: 'lisa@example.com', status: 'active', joined: '2024-02-01', lastActive: '2024-02-13', spots: 4, reviews: 12 },
    { id: 8, name: 'David Wilson', email: 'david@example.com', status: 'active', joined: '2024-01-18', lastActive: '2024-02-12', spots: 9, reviews: 31 }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [activeDropdown, setActiveDropdown] = useState(null);

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
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
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
      banned: 'status-badge status-banned'
    };
    return (
      <span className={styles[status]}>
        {status === 'active' ? 'Active' : 'Banned'}
      </span>
    );
  };

  const toggleDropdown = (userId) => {
    setActiveDropdown(activeDropdown === userId ? null : userId);
  };

  const handleAction = (action, user) => {
    console.log(`${action} user:`, user.name);
    setActiveDropdown(null);
    // Here you would implement the actual action logic
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.dropdown-container')) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const renderUsers = () => {
    return (
      <div className="users-management">
        <div className="users-header">
          <div className="users-controls">
            <div className="search-box">
              <Search size={20} className="search-icon" />
              <input
                type="text"
                placeholder="Search users by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
            <div className="filter-dropdown">
              <Filter size={20} className="filter-icon" />
              <select 
                value={statusFilter} 
                onChange={(e) => setStatusFilter(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="banned">Banned</option>
              </select>
            </div>
          </div>
          <div className="users-actions">
            <button className="btn btn-secondary">
              <Download size={16} />
              Export
            </button>
            {selectedUsers.length > 0 && (
              <>
                <button className="btn btn-warning">
                  <Ban size={16} />
                  Ban Selected
                </button>
                <button className="btn btn-success">
                  <Shield size={16} />
                  Activate Selected
                </button>
              </>
            )}
          </div>
        </div>

        <div className="users-table-container">
          <table className="users-table">
            <thead>
              <tr>
                <th>
                  <input
                    type="checkbox"
                    checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                    onChange={handleSelectAll}
                    className="checkbox"
                  />
                </th>
                <th>User</th>
                <th>Status</th>
                <th>Joined</th>
                <th>Last Active</th>
                <th>Spots</th>
                <th>Reviews</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(user => (
                <tr key={user.id} className="user-row">
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user.id)}
                      onChange={() => handleSelectUser(user.id)}
                      className="checkbox"
                    />
                  </td>
                  <td>
                    <div className="user-info">
                      <div className="user-avatar">{user.name.charAt(0)}</div>
                      <div>
                        <div className="user-name">{user.name}</div>
                        <div className="user-email">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td>{getStatusBadge(user.status)}</td>
                  <td>{user.joined}</td>
                  <td>{user.lastActive}</td>
                  <td>{user.spots}</td>
                  <td>{user.reviews}</td>
                  <td>
                    <div className="dropdown-container">
                      <button 
                        className="btn-icon"
                        onClick={() => toggleDropdown(user.id)}
                      >
                        <MoreVertical size={16} />
                      </button>
                      
                      {activeDropdown === user.id && (
                        <div className="dropdown-menu">
                          <button 
                            className="dropdown-item"
                            onClick={() => handleAction('edit', user)}
                          >
                            <Edit size={14} />
                            Edit User
                          </button>
                          <button 
                            className="dropdown-item"
                            onClick={() => handleAction('view', user)}
                          >
                            <Eye size={14} />
                            View Details
                          </button>
                          <button 
                            className="dropdown-item"
                            onClick={() => handleAction('message', user)}
                          >
                            <MessageSquare size={14} />
                            Send Message
                          </button>
                          <div className="dropdown-divider"></div>
                          <button 
                            className="dropdown-item danger"
                            onClick={() => handleAction(user.status === 'banned' ? 'unban' : 'ban', user)}
                          >
                            <Ban size={14} />
                            {user.status === 'banned' ? 'Unban User' : 'Ban User'}
                          </button>
                          <button 
                            className="dropdown-item danger"
                            onClick={() => handleAction('delete', user)}
                          >
                            <Trash2 size={14} />
                            Delete User
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="users-footer">
          <div className="users-count">
            Showing {filteredUsers.length} of {users.length} users
          </div>
          <div className="pagination">
            <button className="btn btn-secondary" disabled>Previous</button>
            <span className="page-info">Page 1 of 1</span>
            <button className="btn btn-secondary" disabled>Next</button>
          </div>
        </div>
      </div>
    );
  };

  const renderDashboard = () => {
    return (
      <div className="dashboard">
        <div className="stats-grid">
          {/* Total Users Card */}
          <div className="stat-card">
            <div className="stat-header">
              <div className="stat-icon users">
                <Users size={24} />
              </div>
              <h3>Total Users</h3>
            </div>
            <div className="stat-content">
              <div className="stat-main">12,458</div>
              <div className="stat-details">
                <div className="stat-item">
                  <CheckCircle size={16} className="stat-icon-small success" />
                  <span>Registered: 12,458</span>
                </div>
                <div className="stat-item">
                  <TrendingUp size={16} className="stat-icon-small active" />
                  <span>Active: 8,234</span>
                </div>
                <div className="stat-item">
                  <Clock size={16} className="stat-icon-small new" />
                  <span>New Today: 47</span>
                </div>
              </div>
            </div>
          </div>

          {/* Total Food Spots Card */}
          <div className="stat-card">
            <div className="stat-header">
              <div className="stat-icon spots">
                <Map size={24} />
              </div>
              <h3>Total Food Spots</h3>
            </div>
            <div className="stat-content">
              <div className="stat-main">3,847</div>
              <div className="stat-details">
                <div className="stat-item">
                  <CheckCircle size={16} className="stat-icon-small success" />
                  <span>Verified: 3,621</span>
                </div>
                <div className="stat-item">
                  <AlertCircle size={16} className="stat-icon-small warning" />
                  <span>Pending: 156</span>
                </div>
                <div className="stat-item">
                  <AlertCircle size={16} className="stat-icon-small danger" />
                  <span>Flagged: 70</span>
                </div>
              </div>
            </div>
          </div>

          {/* Total Reviews & Ratings Card */}
          <div className="stat-card">
            <div className="stat-header">
              <div className="stat-icon reviews">
                <Star size={24} />
              </div>
              <h3>Reviews & Ratings</h3>
            </div>
            <div className="stat-content">
              <div className="stat-main">45,892</div>
              <div className="stat-details">
                <div className="stat-item">
                  <Star size={16} className="stat-icon-small rating" />
                  <span>Average Rating: 4.2/5.0</span>
                </div>
                <div className="stat-item">
                  <AlertCircle size={16} className="stat-icon-small warning" />
                  <span>Pending Moderation: 23</span>
                </div>
                <div className="stat-item">
                  <TrendingUp size={16} className="stat-icon-small active" />
                  <span>This Week: 1,247</span>
                </div>
              </div>
            </div>
          </div>

          {/* Active Users Card */}
          <div className="stat-card">
            <div className="stat-header">
              <div className="stat-icon analytics">
                <BarChart3 size={24} />
              </div>
              <h3>Active Users</h3>
            </div>
            <div className="stat-content">
              <div className="stat-main">8,234</div>
              <div className="stat-details">
                <div className="stat-item">
                  <Clock size={16} className="stat-icon-small daily" />
                  <span>Daily: 8,234</span>
                </div>
                <div className="stat-item">
                  <TrendingUp size={16} className="stat-icon-small weekly" />
                  <span>Weekly: 28,456</span>
                </div>
                <div className="stat-item">
                  <BarChart3 size={16} className="stat-icon-small monthly" />
                  <span>Monthly: 67,891</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderSpots = () => {
    return (
      <div className="spots-management">
        <div className="spots-header">
          <div className="spots-controls">
            <div className="search-box">
              <Search size={20} className="search-icon" />
              <input
                type="text"
                placeholder="Search spots by name, location, or cuisine..."
                className="search-input"
              />
            </div>
            <div className="filter-dropdown">
              <Filter size={20} className="filter-icon" />
              <select className="filter-select">
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="verified">Verified</option>
                <option value="published">Published</option>
                <option value="flagged">Flagged</option>
              </select>
            </div>
          </div>
          <div className="spots-actions">
            <button className="btn btn-primary">
              <Map size={16} />
              Add New Spot
            </button>
            <button className="btn btn-secondary">
              <Download size={16} />
              Export
            </button>
          </div>
        </div>

        <div className="spots-table-container">
          <table className="spots-table">
            <thead>
              <tr>
                <th>
                  <input type="checkbox" className="checkbox" />
                </th>
                <th>Spot Info</th>
                <th>Location</th>
                <th>Category</th>
                <th>Status</th>
                <th>Rating</th>
                <th>Reviews</th>
                <th>Added</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr className="spot-row">
                <td>
                  <input type="checkbox" className="checkbox" />
                </td>
                <td>
                  <div className="spot-info">
                    <div className="spot-image">🍕</div>
                    <div>
                      <div className="spot-name">Sunrise Cafe</div>
                      <div className="spot-address">123 Main St, Downtown</div>
                    </div>
                  </div>
                </td>
                <td>New York, NY</td>
                <td>Cafe</td>
                <td><span className="status-badge status-published">Published</span></td>
                <td>⭐ 4.5</td>
                <td>127</td>
                <td>2024-01-15</td>
                <td>
                  <div className="dropdown-container">
                    <button className="btn-icon">
                      <MoreVertical size={16} />
                    </button>
                  </div>
                </td>
              </tr>
              <tr className="spot-row">
                <td>
                  <input type="checkbox" className="checkbox" />
                </td>
                <td>
                  <div className="spot-info">
                    <div className="spot-image">🍔</div>
                    <div>
                      <div className="spot-name">Burger Palace</div>
                      <div className="spot-address">456 Oak Ave, Midtown</div>
                    </div>
                  </div>
                </td>
                <td>New York, NY</td>
                <td>Fast Food</td>
                <td><span className="status-badge status-verified">Verified</span></td>
                <td>⭐ 4.2</td>
                <td>89</td>
                <td>2024-01-20</td>
                <td>
                  <div className="dropdown-container">
                    <button className="btn-icon">
                      <MoreVertical size={16} />
                    </button>
                  </div>
                </td>
              </tr>
              <tr className="spot-row">
                <td>
                  <input type="checkbox" className="checkbox" />
                </td>
                <td>
                  <div className="spot-info">
                    <div className="spot-image">🥗</div>
                    <div>
                      <div className="spot-name">Pizza Heaven</div>
                      <div className="spot-address">789 Pine St, Brooklyn</div>
                    </div>
                  </div>
                </td>
                <td>New York, NY</td>
                <td>Italian</td>
                <td><span className="status-badge status-pending">Pending</span></td>
                <td>⭐ -</td>
                <td>0</td>
                <td>2024-02-10</td>
                <td>
                  <div className="dropdown-container">
                    <button className="btn-icon">
                      <MoreVertical size={16} />
                    </button>
                  </div>
                </td>
              </tr>
              <tr className="spot-row">
                <td>
                  <input type="checkbox" className="checkbox" />
                </td>
                <td>
                  <div className="spot-info">
                    <div className="spot-image">🍜</div>
                    <div>
                      <div className="spot-name">Sushi Master</div>
                      <div className="spot-address">321 Elm St, East Village</div>
                    </div>
                  </div>
                </td>
                <td>New York, NY</td>
                <td>Japanese</td>
                <td><span className="status-badge status-flagged">Flagged</span></td>
                <td>⭐ 4.8</td>
                <td>156</td>
                <td>2024-01-08</td>
                <td>
                  <div className="dropdown-container">
                    <button className="btn-icon">
                      <MoreVertical size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="spots-footer">
          <div className="spots-count">
            Showing 4 of 3,847 spots
          </div>
          <div className="pagination">
            <button className="btn btn-secondary" disabled>Previous</button>
            <span className="page-info">Page 1 of 962</span>
            <button className="btn btn-secondary">Next</button>
          </div>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return renderDashboard();
      case 'users':
        return renderUsers();
      case 'spots':
        return renderSpots();
      case 'reviews':
        return <div className="content-placeholder">Review Moderation - Manage user reviews, ratings, photos, and reported content.</div>;
      case 'analytics':
        return <div className="content-placeholder">Analytics Dashboard - Track user engagement, popular spots, revenue metrics, and growth trends.</div>;
      case 'settings':
        return <div className="content-placeholder">Admin Settings - Configure platform preferences, API keys, and system parameters.</div>;
      default:
        return <div className="content-placeholder">Welcome to the BytSpot Admin Dashboard.</div>;
    }
  };

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
    </>
  );
}
