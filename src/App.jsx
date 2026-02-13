import React, { useState, useMemo, useEffect } from 'react';
import { Layout, Users, Star, BarChart3, Settings, TrendingUp, AlertCircle, CheckCircle, Clock, Search, Filter, Download, Ban, Shield, UserCheck, MoreVertical, Edit, Eye, MessageSquare, Trash2, X, Camera, Phone, Mail, Globe, MapPin, Star as StarIcon, Save } from 'lucide-react';
import './index.css';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const navItems = [
    { id: 'dashboard', name: 'Dashboard', icon: Layout },
    { id: 'users', name: 'Users', icon: Users },
    { id: 'spots', name: 'Spots', icon: MapPin },
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

  // Mock spot data
  const [spots] = useState([
    {
      id: 1,
      name: 'Central Perk Cafe',
      address: '123 Main St',
      city: 'New York', 
      state: 'NY',
      category: 'Cafe',
      status: 'verified',
      rating: 4.5,
      reviews: 127,
      added: '2024-01-15',
    },
    {
      id: 2,
      name: 'Sunset Restaurant',
      address: '456 Oak Ave',
      city: 'Los Angeles',
      state: 'CA',
      category: 'Restaurant',
      status: 'pending',
      rating: 4.2,
      reviews: 89,
      added: '2024-01-20',
    },
    {
      id: 3,
      name: 'Mountain View Grill',
      address: '789 Pine Rd',
      city: 'Denver',
      state: 'CO',
      category: 'Restaurant',
      status: 'verified',
      rating: 4.8,
      reviews: 234,
      added: '2024-01-25',
    },
    {
      id: 4,
      name: 'Beachside Coffee',
      address: '321 Ocean Blvd',
      city: 'Miami',
      state: 'FL',
      category: 'Cafe',
      status: 'flagged',
      rating: 3.9,
      reviews: 156,
      added: '2024-02-01',
    },
    {
      id: 5,
      name: 'Downtown Bistro',
      address: '654 Elm St',
      city: 'Chicago',
      state: 'IL',
      category: 'Restaurant',
      status: 'verified',
      rating: 4.6,
      reviews: 198,
      added: '2024-02-05',
    },
    {
      id: 6,
      name: 'Riverside Cafe',
      address: '987 River Rd',
      city: 'Seattle',
      state: 'WA',
      category: 'Cafe',
      status: 'pending',
      rating: 4.1,
      reviews: 87,
      added: '2024-02-10',
    },
    {
      id: 7,
      name: 'Hilltop Restaurant',
      address: '147 Hill Dr',
      city: 'Boston',
      state: 'MA',
      category: 'Restaurant',
      status: 'verified',
      rating: 4.7,
      reviews: 312,
      added: '2024-02-15',
    },
    {
      id: 8,
      name: 'Lakeside Coffee Shop',
      address: '258 Lake View',
      city: 'Portland',
      state: 'OR',
      category: 'Cafe',
      status: 'flagged',
      rating: 3.8,
      reviews: 94,
      added: '2024-02-20',
    },
    {
      id: 9,
      name: 'Urban Eatery',
      address: '369 City Plaza',
      city: 'Austin',
      state: 'TX',
      category: 'Restaurant',
      status: 'pending',
      rating: 4.3,
      reviews: 167,
      added: '2024-02-25',
    },
    {
      id: 10,
      name: 'Parkside Cafe',
      address: '741 Park Ave',
      city: 'San Francisco',
      state: 'CA',
      category: 'Cafe',
      status: 'verified',
      rating: 4.4,
      reviews: 201,
      added: '2024-03-01',
    },
    {
      id: 11,
      name: 'Mountain Peak Diner',
      address: '852 Summit Rd',
      city: 'Phoenix',
      state: 'AZ',
      category: 'Restaurant',
      status: 'flagged',
      rating: 3.7,
      reviews: 123,
      added: '2024-03-05',
    },
    {
      id: 12,
      name: 'Sunrise Coffee House',
      address: '963 Dawn Blvd',
      city: 'Nashville',
      state: 'TN',
      category: 'Cafe',
      status: 'pending',
      rating: 4.0,
      reviews: 145,
      added: '2024-03-10',
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [selectedSpots, setSelectedSpots] = useState([]);
  const [spotModalOpen, setSpotModalOpen] = useState(false);
  const [selectedSpot, setSelectedSpot] = useState(null);
  const [sortBy, setSortBy] = useState('name');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10); // Default 10 items per page
  const [activeSpotDropdown, setActiveSpotDropdown] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingSpotData, setEditingSpotData] = useState(null);
  const [viewDetailsModalOpen, setViewDetailsModalOpen] = useState(false);
  const [viewingSpotData, setViewingSpotData] = useState(null);

  // Filter and search users
  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           user.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [users, searchTerm, statusFilter]);

  // Filter and search spots
  const filteredSpots = useMemo(() => {
    let filtered = spots.filter(spot => {
      const matchesSearch = spot.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           spot.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           spot.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || spot.status === statusFilter;
      return matchesSearch && matchesStatus;
    });

    // Apply sorting
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        case 'date':
          return new Date(b.added) - new Date(a.added);
        case 'reviews':
          return b.reviews - a.reviews;
        default:
          return 0;
      }
    });
  }, [spots, searchTerm, statusFilter, sortBy]);

  // Pagination logic
  const paginatedSpots = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredSpots.slice(startIndex, endIndex);
  }, [filteredSpots, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredSpots.length / itemsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(Number(newItemsPerPage));
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  const handleSpotAction = (action, spot) => {
    console.log(`${action} spot:`, spot.name);
    setActiveSpotDropdown(null);
    
    if (action === 'edit') {
      setEditingSpotData(spot);
      setEditModalOpen(true);
    }
  };

  const toggleSpotDropdown = (spotId) => {
    setActiveSpotDropdown(activeSpotDropdown === spotId ? null : spotId);
  };

  // Calculate statistics
  const spotStats = useMemo(() => {
    return {
      total: spots.length,
      published: spots.filter(s => s.status === 'published').length,
      verified: spots.filter(s => s.status === 'verified').length,
      pending: spots.filter(s => s.status === 'pending').length,
      flagged: spots.filter(s => s.status === 'flagged').length,
      avgRating: spots.filter(s => s.rating).reduce((acc, s) => acc + s.rating, 0) / spots.filter(s => s.rating).length || 0
    };
  }, [spots]);

  const handleSelectSpot = (spotId) => {
    setSelectedSpots(prev => 
      prev.includes(spotId) 
        ? prev.filter(id => id !== spotId)
        : [...prev, spotId]
    );
  };

  const handleSelectAllSpots = () => {
    if (selectedSpots.length === filteredSpots.length) {
      setSelectedSpots([]);
    } else {
      setSelectedSpots(filteredSpots.map(spot => spot.id));
    }
  };

  const openSpotModal = (spot) => {
    setSelectedSpot(spot);
    setSpotModalOpen(true);
  };

  const closeSpotModal = () => {
    setSpotModalOpen(false);
    setSelectedSpot(null);
  };

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
    setActiveDropdown(activeDropdown === userId ? null : userId);
  };

  const handleAction = (action, user) => {
    console.log(`${action} user:`, user.name);
    setActiveDropdown(null);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.dropdown-container')) {
        setActiveDropdown(null);
        setActiveSpotDropdown(null);
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

  const renderSpotModal = () => {
    if (!selectedSpot) return null;

    return (
      <div className="modal-overlay" onClick={closeSpotModal}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h3>{selectedSpot.name}</h3>
            <button className="btn-icon" onClick={closeSpotModal}>
              <X size={20} />
            </button>
          </div>
          
          <div className="modal-body">
            <div className="spot-details">
              <div className="detail-section">
                <h4>Basic Information</h4>
                <div className="detail-grid">
                  <div className="detail-item">
                    <label>Status</label>
                    <span className={`status-badge status-${selectedSpot.status}`}>
                      {selectedSpot.status}
                    </span>
                  </div>
                  <div className="detail-item">
                    <label>Category</label>
                    <span>{selectedSpot.category}</span>
                  </div>
                  <div className="detail-item">
                    <label>Rating</label>
                    <span className="rating">
                      <StarIcon size={16} />
                      {selectedSpot.rating} ({selectedSpot.reviews} reviews)
                    </span>
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <h4>Location</h4>
                <div className="detail-grid">
                  <div className="detail-item">
                    <label>Address</label>
                    <span>{selectedSpot.address}</span>
                  </div>
                  <div className="detail-item">
                    <label>City</label>
                    <span>{selectedSpot.city}</span>
                  </div>
                  <div className="detail-item">
                    <label>State</label>
                    <span>{selectedSpot.state}</span>
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <h4>Contact Information</h4>
                <div className="detail-grid">
                  <div className="detail-item">
                    <label>Phone</label>
                    <span>{selectedSpot.phone}</span>
                  </div>
                  <div className="detail-item">
                    <label>Email</label>
                    <span>{selectedSpot.email}</span>
                  </div>
                  <div className="detail-item">
                    <label>Website</label>
                    <span>{selectedSpot.website}</span>
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <h4>Business Hours</h4>
                <div className="detail-item">
                  <label>Hours</label>
                  <span>{selectedSpot.hours}</span>
                </div>
              </div>

              <div className="detail-section">
                <h4>Description</h4>
                <p>{selectedSpot.description}</p>
              </div>

              <div className="detail-section">
                <h4>Photos</h4>
                <div className="photo-grid">
                  {selectedSpot.photos.map((photo, index) => (
                    <div key={index} className="photo-item">
                      <Camera size={24} />
                      <span>{photo}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={closeSpotModal}>
              Close
            </button>
            <button className="btn btn-primary">
              <Edit size={16} />
              Edit Spot
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderModernEditModal = () => {
    if (!editModalOpen || !editingSpotData) return null;

    return (
      <div className="modern-modal-overlay" onClick={() => setEditModalOpen(false)}>
        <div className="modern-modal-container" onClick={(e) => e.stopPropagation()}>
          {/* Modal Header */}
          <div className="modern-modal-header">
            <div className="header-content">
              <div className="spot-info">
                <div className="spot-avatar">
                  <MapPin size={24} />
                </div>
                <div className="spot-details">
                  <h2 className="spot-name">{editingSpotData.name}</h2>
                  <p className="spot-category">{editingSpotData.category}</p>
                </div>
              </div>
              <button className="modern-close-btn" onClick={() => setEditModalOpen(false)}>
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Modal Body */}
          <div className="modern-modal-body">
            <div className="edit-form-container">
              {/* Left Column - Spot Info */}
              <div className="form-column">
                <div className="form-section modern-section">
                  <h3 className="section-title">
                    <div className="title-icon">
                      <MapPin size={16} />
                    </div>
                    Spot Information
                  </h3>
                  <div className="form-group">
                    <label className="modern-label">Spot Name</label>
                    <input 
                      type="text" 
                      defaultValue={editingSpotData.name}
                      className="modern-input"
                      placeholder="Enter spot name"
                    />
                  </div>
                  <div className="form-group">
                    <label className="modern-label">Category</label>
                    <div className="modern-select-wrapper">
                      <select 
                        defaultValue={editingSpotData.category}
                        className="modern-select"
                      >
                        <option value="Cafe">Cafe</option>
                        <option value="Restaurant">Restaurant</option>
                      </select>
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="modern-label">Status</label>
                    <div className="status-pills">
                      <button 
                        className={`status-pill ${editingSpotData.status === 'verified' ? 'active' : ''}`}
                        onClick={() => {/* Could add status change logic */}}
                      >
                        <CheckCircle size={14} />
                        Verified
                      </button>
                      <button 
                        className={`status-pill ${editingSpotData.status === 'pending' ? 'active' : ''}`}
                        onClick={() => {/* Could add status change logic */}}
                      >
                        <Clock size={14} />
                        Pending
                      </button>
                      <button 
                        className={`status-pill ${editingSpotData.status === 'flagged' ? 'active' : ''}`}
                        onClick={() => {/* Could add status change logic */}}
                      >
                        <AlertCircle size={14} />
                        Flagged
                      </button>
                    </div>
                  </div>
                </div>

                <div className="form-section modern-section">
                  <h3 className="section-title">
                    <div className="title-icon">
                      <Globe size={16} />
                    </div>
                    Location Details
                  </h3>
                  <div className="form-group">
                    <label className="modern-label">Street Address</label>
                    <input 
                      type="text" 
                      defaultValue={editingSpotData.address}
                      className="modern-input"
                      placeholder="Enter street address"
                    />
                  </div>
                  <div className="form-row">
                    <div className="form-group half-width">
                      <label className="modern-label">City</label>
                      <input 
                        type="text" 
                        defaultValue={editingSpotData.city}
                        className="modern-input"
                        placeholder="Enter city"
                      />
                    </div>
                    <div className="form-group half-width">
                      <label className="modern-label">State</label>
                      <input 
                        type="text" 
                        defaultValue={editingSpotData.state}
                        className="modern-input"
                        placeholder="Enter state"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Stats & Actions */}
              <div className="form-column">
                <div className="form-section modern-section">
                  <h3 className="section-title">
                    <div className="title-icon">
                      <Star size={16} />
                    </div>
                    Performance Metrics
                  </h3>
                  <div className="metrics-grid">
                    <div className="metric-card">
                      <div className="metric-value">{editingSpotData.rating}</div>
                      <div className="metric-label">Average Rating</div>
                      <div className="metric-stars">
                        {[1, 2, 3, 4, 5].map(star => (
                          <Star 
                            key={star} 
                            size={12} 
                            className={star <= (editingSpotData.rating || 0) ? 'metric-star-filled' : 'metric-star-empty'}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="metric-card">
                      <div className="metric-value">{editingSpotData.reviews}</div>
                      <div className="metric-label">Total Reviews</div>
                    </div>
                    <div className="metric-card">
                      <div className="metric-value">{editingSpotData.added}</div>
                      <div className="metric-label">Date Added</div>
                    </div>
                  </div>
                </div>

                <div className="form-section modern-section">
                  <h3 className="section-title">
                    <div className="title-icon">
                      <Settings size={16} />
                    </div>
                    Quick Actions
                  </h3>
                  <div className="quick-actions">
                    <button className="action-btn primary">
                      <Save size={16} />
                      Save Changes
                    </button>
                    <button className="action-btn secondary">
                      <Camera size={16} />
                      Add Photos
                    </button>
                    <button className="action-btn secondary">
                      <MessageSquare size={16} />
                      Contact Owner
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="modern-modal-footer">
            <div className="footer-content">
              <div className="footer-info">
                <p className="last-modified">Last modified: {editingSpotData.added}</p>
              </div>
              <div className="footer-actions">
                <button className="modern-btn cancel" onClick={() => setEditModalOpen(false)}>
                  Cancel
                </button>
                <button className="modern-btn save">
                  <Save size={16} />
                  Save All Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderViewDetailsModal = () => {
    if (!viewDetailsModalOpen || !viewingSpotData) return null;

    return (
      <div className="modern-modal-overlay" onClick={() => setViewDetailsModalOpen(false)}>
        <div className="modern-modal-container" onClick={(e) => e.stopPropagation()}>
          {/* Modal Header */}
          <div className="modern-modal-header">
            <div className="header-content">
              <div className="spot-info">
                <div className="spot-avatar">
                  <MapPin size={24} />
                </div>
                <div className="spot-details">
                  <h2 className="spot-name">{viewingSpotData.name}</h2>
                  <p className="spot-category">{viewingSpotData.category}</p>
                </div>
              </div>
              <button className="modern-close-btn" onClick={() => setViewDetailsModalOpen(false)}>
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Modal Body */}
          <div className="modern-modal-body">
            <div className="edit-form-container">
              {/* Left Column - Spot Information */}
              <div className="form-column">
                <div className="modern-section">
                  <h3 className="section-title">
                    <div className="title-icon">
                      <MapPin size={18} />
                    </div>
                    Spot Information
                  </h3>
                  <div className="form-row">
                    <div className="form-group">
                      <label className="modern-label">Name</label>
                      <div className="detail-display">{viewingSpotData.name}</div>
                    </div>
                    <div className="form-group">
                      <label className="modern-label">Category</label>
                      <div className="detail-display">{viewingSpotData.category}</div>
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label className="modern-label">Status</label>
                      <div className="detail-display">
                        <span className={`status-badge status-${viewingSpotData.status}`}>
                          {viewingSpotData.status}
                        </span>
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="modern-label">Rating</label>
                      <div className="detail-display">
                        <StarIcon size={16} />
                        <span> {viewingSpotData.rating}</span>
                        <span className="rating-text">({viewingSpotData.reviews} reviews)</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="modern-section">
                  <h3 className="section-title">
                    <div className="title-icon">
                      <Globe size={18} />
                    </div>
                    Location Details
                  </h3>
                  <div className="form-row">
                    <div className="form-group full-width">
                      <label className="modern-label">Address</label>
                      <div className="detail-display">{viewingSpotData.address}</div>
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label className="modern-label">City</label>
                      <div className="detail-display">{viewingSpotData.city}</div>
                    </div>
                    <div className="form-group">
                      <label className="modern-label">State</label>
                      <div className="detail-display">{viewingSpotData.state}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Performance Metrics */}
              <div className="form-column">
                <div className="modern-section">
                  <h3 className="section-title">
                    <div className="title-icon">
                      <Star size={18} />
                    </div>
                    Performance Metrics
                  </h3>
                  <div className="metrics-grid">
                    <div className="metric-card">
                      <div className="metric-value">{viewingSpotData.rating}</div>
                      <div className="metric-label">Average Rating</div>
                      <div className="metric-stars">
                        {[1, 2, 3, 4, 5].map(star => (
                          <Star 
                            key={star} 
                            size={12} 
                            className={star <= (viewingSpotData.rating || 0) ? 'metric-star-filled' : 'metric-star-empty'}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="metric-card">
                      <div className="metric-value">{viewingSpotData.reviews}</div>
                      <div className="metric-label">Total Reviews</div>
                    </div>
                    <div className="metric-card">
                      <div className="metric-value">{viewingSpotData.added}</div>
                      <div className="metric-label">Date Added</div>
                    </div>
                  </div>
                </div>

                <div className="modern-section">
                  <h3 className="section-title">
                    <div className="title-icon">
                      <Settings size={18} />
                    </div>
                    Quick Actions
                  </h3>
                  <div className="quick-actions">
                    <button className="action-btn primary">
                      <Edit size={16} />
                      Edit Spot
                    </button>
                    <button className="action-btn secondary">
                      <Camera size={16} />
                      Add Photos
                    </button>
                    <button className="action-btn secondary">
                      <Phone size={16} />
                      Contact Owner
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="modern-modal-footer">
            <div className="footer-content">
              <div className="footer-info">
                <p className="last-modified">Last modified: {viewingSpotData.added}</p>
              </div>
              <div className="footer-actions">
                <button className="modern-btn cancel" onClick={() => setViewDetailsModalOpen(false)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderSpots = () => {
    return (
      <>
        <div className="spots-management">
          <div className="spots-header">
            <div className="spots-controls">
              <div className="search-box">
                <Search size={20} className="search-icon" />
                <input
                  type="text"
                  placeholder="Search spots by name, location, or cuisine..."
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
                  <option value="verified">Verified</option>
                  <option value="pending">Pending</option>
                  <option value="flagged">Flagged</option>
                </select>
              </div>
              <div className="sort-dropdown">
                <select 
                  value={sortBy} 
                  onChange={(e) => setSortBy(e.target.value)}
                  className="sort-select"
                >
                  <option value="name">Sort by Name</option>
                  <option value="rating">Sort by Rating</option>
                  <option value="date">Sort by Date</option>
                  <option value="reviews">Sort by Reviews</option>
                </select>
              </div>
              <div className="items-per-page-dropdown">
                <select 
                  value={itemsPerPage} 
                  onChange={(e) => handleItemsPerPageChange(e.target.value)}
                  className="items-per-page-select"
                >
                  <option value="2">2 per page</option>
                  <option value="5">5 per page</option>
                  <option value="10">10 per page</option>
                  <option value="20">20 per page</option>
                  <option value="50">50 per page</option>
                </select>
              </div>
            </div>
            <div className="spots-actions">
              <button className="btn btn-secondary">
                <Download size={16} />
                Export
              </button>
              {selectedSpots.length > 0 && (
                <>
                  <button className="btn btn-warning">
                    <AlertCircle size={16} />
                    Flag Selected
                  </button>
                  <button className="btn btn-success">
                    <CheckCircle size={16} />
                    Verify Selected
                  </button>
                  <button className="btn btn-danger">
                    <Trash2 size={16} />
                    Delete Selected
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Statistics Section */}
          <div className="spots-stats">
            <div className="stat-card">
              <div className="stat-icon">📍</div>
              <div className="stat-info">
                <div className="stat-number">{spotStats.total}</div>
                <div className="stat-label">Total Spots</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">🟢</div>
              <div className="stat-info">
                <div className="stat-number">{spotStats.published}</div>
                <div className="stat-label">Published</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">🔵</div>
              <div className="stat-info">
                <div className="stat-number">{spotStats.verified}</div>
                <div className="stat-label">Verified</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">🟡</div>
              <div className="stat-info">
                <div className="stat-number">{spotStats.pending}</div>
                <div className="stat-label">Pending</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">🔴</div>
              <div className="stat-info">
                <div className="stat-number">{spotStats.flagged}</div>
                <div className="stat-label">Flagged</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">⭐</div>
              <div className="stat-info">
                <div className="stat-number">{spotStats.avgRating.toFixed(1)}</div>
                <div className="stat-label">Avg Rating</div>
              </div>
            </div>
          </div>

          <div className="spots-table-container">
            <table className="spots-table">
              <thead>
                <tr>
                  <th>
                    <input
                      type="checkbox"
                      checked={selectedSpots.length === filteredSpots.length && filteredSpots.length > 0}
                      onChange={handleSelectAllSpots}
                      className="checkbox"
                    />
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
                {paginatedSpots.map(spot => (
                  <tr key={spot.id} className="spot-row">
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedSpots.includes(spot.id)}
                        onChange={() => handleSelectSpot(spot.id)}
                        className="checkbox"
                      />
                    </td>
                    <td>
                      <div className="spot-info">
                        <div className="spot-name">{spot.name}</div>
                        <div className="spot-address">{spot.address}</div>
                      </div>
                    </td>
                    <td>{spot.city}, {spot.state}</td>
                    <td>{spot.category}</td>
                    <td>
                      <span className={`status-badge status-${spot.status}`}>
                        {spot.status}
                      </span>
                    </td>
                    <td>
                      <div className="rating">
                        <StarIcon size={14} />
                        {spot.rating}
                      </div>
                    </td>
                    <td>{spot.reviews}</td>
                    <td>{spot.added}</td>
                    <td>
                      <div className="dropdown-container">
                        <button 
                          className="btn-icon"
                          onClick={() => toggleSpotDropdown(spot.id)}
                        >
                          <MoreVertical size={16} />
                        </button>
                        
                        {activeSpotDropdown === spot.id && (
                          <div className="dropdown-menu">
                            <button 
                              className="dropdown-item"
                              onClick={() => handleSpotAction('edit', spot)}
                            >
                              <Edit size={14} />
                              Edit Spot
                            </button>
                            <button 
                              className="dropdown-item"
                              onClick={() => {
                                setViewingSpotData(spot);
                                setViewDetailsModalOpen(true);
                              }}
                            >
                              <Eye size={14} />
                              View Details
                            </button>
                            <button 
                              className="dropdown-item"
                              onClick={() => handleSpotAction('message', spot)}
                            >
                              <MessageSquare size={14} />
                              Contact Owner
                            </button>
                            <div className="dropdown-divider"></div>
                            <button 
                              className="dropdown-item warning"
                              onClick={() => handleSpotAction(spot.status === 'flagged' ? 'unflag' : 'flag', spot)}
                            >
                              <AlertCircle size={14} />
                              {spot.status === 'flagged' ? 'Unflag Spot' : 'Flag Spot'}
                            </button>
                            <button 
                              className="dropdown-item success"
                              onClick={() => handleSpotAction(spot.status === 'verified' ? 'unverify' : 'verify', spot)}
                            >
                              <CheckCircle size={14} />
                              {spot.status === 'verified' ? 'Unverify Spot' : 'Verify Spot'}
                            </button>
                            <button 
                              className="dropdown-item danger"
                              onClick={() => handleSpotAction('delete', spot)}
                            >
                              <Trash2 size={14} />
                              Delete Spot
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

          <div className="spots-footer">
            <div className="spots-count">
              Showing {paginatedSpots.length} of {spots.length} spots
            </div>
            <div className="pagination">
              <button 
                className="btn btn-secondary" 
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <span className="page-info">Page {currentPage} of {totalPages}</span>
              <button 
                className="btn btn-secondary" 
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          </div>
        </div>
        
        {renderSpotModal()}
        {renderModernEditModal()}
        {renderViewDetailsModal()}
      </>
    );
  };

  const renderDashboard = () => {
    return (
      <div className="dashboard">
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-header">
              <div className="stat-icon users">👥</div>
              <h3>Total Users</h3>
            </div>
            <div className="stat-content">
              <div className="stat-main">1,234</div>
              <div className="stat-details">
                <div className="stat-item">
                  <div className="stat-icon-small success">↑</div>
                  <span>12% from last month</span>
                </div>
                <div className="stat-item">
                  <div className="stat-icon-small active">→</div>
                  <span>892 active this week</span>
                </div>
              </div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-header">
              <div className="stat-icon spots">📍</div>
              <h3>Food Spots</h3>
            </div>
            <div className="stat-content">
              <div className="stat-main">456</div>
              <div className="stat-details">
                <div className="stat-item">
                  <div className="stat-icon-small success">↑</div>
                  <span>8% from last month</span>
                </div>
                <div className="stat-item">
                  <div className="stat-icon-small new">+</div>
                  <span>23 new this week</span>
                </div>
              </div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-header">
              <div className="stat-icon reviews">⭐</div>
              <h3>Reviews & Ratings</h3>
            </div>
            <div className="stat-content">
              <div className="stat-main">2,789</div>
              <div className="stat-details">
                <div className="stat-item">
                  <div className="stat-icon-small success">↑</div>
                  <span>15% from last month</span>
                </div>
                <div className="stat-item">
                  <div className="stat-icon-small rating">⭐</div>
                  <span>4.6 average rating</span>
                </div>
              </div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-header">
              <div className="stat-icon analytics">📈</div>
              <h3>Active Users</h3>
            </div>
            <div className="stat-content">
              <div className="stat-main">892</div>
              <div className="stat-details">
                <div className="stat-item">
                  <div className="stat-icon-small success">↑</div>
                  <span>23% from last month</span>
                </div>
                <div className="stat-item">
                  <div className="stat-icon-small weekly">📅</div>
                  <span>156 daily average</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="content-placeholder">Dashboard Overview - Key metrics and performance indicators for BytSpot platform.</div>
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
