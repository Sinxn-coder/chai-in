import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Layout, Users, Map, Star, BarChart3, Settings, TrendingUp, AlertCircle, CheckCircle, Clock, Search, Filter, Download, Ban, Shield, UserCheck, MoreVertical, Edit, Eye, MessageSquare, Trash2, X, Camera, Phone, Mail, Globe, Clock as ClockIcon, MapPin, Star as StarIcon } from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

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

  // Mock spot data
  const [spots] = useState([
    { 
      id: 1, 
      name: 'Sunrise Cafe', 
      address: '123 Main St, Downtown', 
      city: 'New York', 
      state: 'NY',
      category: 'Cafe',
      status: 'published',
      rating: 4.5,
      reviews: 127,
      added: '2024-01-15',
      phone: '+1 (555) 123-4567',
      email: 'sunrise@bytspot.com',
      website: 'sunrisecafe.com',
      hours: '6:00 AM - 10:00 PM',
      description: 'Cozy neighborhood cafe serving artisanal coffee and fresh pastries.',
      photos: ['coffee1.jpg', 'coffee2.jpg', 'coffee3.jpg']
    },
    { 
      id: 2, 
      name: 'Burger Palace', 
      address: '456 Oak Ave, Midtown', 
      city: 'New York', 
      state: 'NY',
      category: 'Fast Food',
      status: 'verified',
      rating: 4.2,
      reviews: 89,
      added: '2024-01-20',
      phone: '+1 (555) 234-5678',
      email: 'info@burgerpalace.com',
      website: 'burgerpalace.com',
      hours: '11:00 AM - 11:00 PM',
      description: 'Classic American burgers with modern twists and fresh ingredients.',
      photos: ['burger1.jpg', 'burger2.jpg']
    },
    { 
      id: 3, 
      name: 'Pizza Heaven', 
      address: '789 Pine St, Brooklyn', 
      city: 'New York', 
      state: 'NY',
      category: 'Italian',
      status: 'pending',
      rating: null,
      reviews: 0,
      added: '2024-02-10',
      phone: '+1 (555) 345-6789',
      email: 'hello@pizzaheaven.com',
      website: 'pizzaheaven.com',
      hours: '12:00 PM - 12:00 AM',
      description: 'Authentic wood-fired pizza with traditional Italian recipes.',
      photos: ['pizza1.jpg']
    },
    { 
      id: 4, 
      name: 'Sushi Master', 
      address: '321 Elm St, East Village', 
      city: 'New York', 
      state: 'NY',
      category: 'Japanese',
      status: 'flagged',
      rating: 4.8,
      reviews: 156,
      added: '2024-01-08',
      phone: '+1 (555) 456-7890',
      email: 'contact@sushimaster.com',
      website: 'sushimaster.com',
      hours: '5:00 PM - 12:00 AM',
      description: 'Premium sushi and Japanese cuisine in an intimate setting.',
      photos: ['sushi1.jpg', 'sushi2.jpg', 'sushi3.jpg', 'sushi4.jpg']
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [selectedSpots, setSelectedSpots] = useState([]);
  const [spotModalOpen, setSpotModalOpen] = useState(false);
  const [selectedSpot, setSelectedSpot] = useState(null);
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'map'
  const [sortBy, setSortBy] = useState('name'); // 'name', 'rating', 'date', 'reviews'

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

  const handleSpotAction = (action, spot) => {
    console.log(`${action} spot:`, spot.name);
    // Here you would implement actual action logic
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

  const handleExport = (format) => {
    console.log(`Exporting spots as ${format}`);
    // Here you would implement actual export logic
  };

  const renderMapView = () => {
    const mapRef = useRef(null);
    const mapInstanceRef = useRef(null);
    
    useEffect(() => {
      if (viewMode === 'map' && mapRef.current && !mapInstanceRef.current) {
        try {
          // Initialize Leaflet map
          const map = L.map(mapRef.current, {
            center: [40.7128, -74.0060], // New York coordinates
            zoom: 12,
            layers: [
              L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors',
                maxZoom: 19
              })
            ]
          });

          // Add spot markers to map
          filteredSpots.forEach(spot => {
            const markerColor = spot.status === 'published' ? '#16a34a' : 
                             spot.status === 'verified' ? '#1e40af' : 
                             spot.status === 'pending' ? '#d97706' : '#dc2626';
            
            const marker = L.circleMarker([
              40.7128 + (Math.random() - 0.1), // Slight position variation for demo
              -74.0060 + (Math.random() - 0.1)
            ], {
              radius: 8,
              fillColor: markerColor,
              color: 'white',
              weight: 2,
              opacity: 0.8
            }).addTo(map);

            // Add popup to marker
            const popupContent = `
              <div style="padding: 8px; min-width: 180px; font-family: Arial, sans-serif;">
                <h4 style="margin: 0 0 8px 0; color: #111827; font-size: 14px; font-weight: 600;">${spot.name}</h4>
                <p style="margin: 0 0 4px 0; color: #6b7280; font-size: 12px;">${spot.address}</p>
                <div style="display: flex; justify-content: space-between; margin-top: 8px;">
                  <span style="color: ${markerColor}; font-weight: 600;">Status: ${spot.status}</span>
                  ${spot.rating ? `<span style="color: #f59e0b;">⭐ ${spot.rating}</span>` : '<span style="color: #6b7280;">No rating</span>'}
                </div>
              </div>
            `;
            
            marker.bindPopup(popupContent);
          });

          // Add map controls
          L.control.scale({
            position: 'bottomright'
          }).addTo(map);

          mapInstanceRef.current = map;
        } catch (error) {
          console.error('Map initialization error:', error);
        }
      }
      
      return () => {
        if (mapInstanceRef.current && viewMode !== 'map') {
          mapInstanceRef.current.remove();
          mapInstanceRef.current = null;
        }
      };
    }, [viewMode, filteredSpots]);

    return (
      <div className="map-view">
        <div className="map-header">
          <h3>Interactive Spot Map</h3>
          <div className="map-controls">
            <div className="map-legend">
              <div className="legend-item">
                <div className="legend-dot published"></div>
                <span>Published</span>
              </div>
              <div className="legend-item">
                <div className="legend-dot verified"></div>
                <span>Verified</span>
              </div>
              <div className="legend-item">
                <div className="legend-dot pending"></div>
                <span>Pending</span>
              </div>
              <div className="legend-item">
                <div className="legend-dot flagged"></div>
                <span>Flagged</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="map-container">
          <div 
            ref={mapRef} 
            style={{ height: '600px', width: '100%', backgroundColor: '#f0f0f0' }}
            className="leaflet-map"
          />
        </div>
      </div>
    );
  };

  const renderSpots = () => {
    if (viewMode === 'map') {
      return renderMapView();
    }
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
                  <option value="pending">Pending</option>
                  <option value="verified">Verified</option>
                  <option value="published">Published</option>
                  <option value="flagged">Flagged</option>
                </select>
              </div>
              <div className="sort-dropdown">
                <Filter size={20} className="filter-icon" />
                <select 
                  value={sortBy} 
                  onChange={(e) => setSortBy(e.target.value)}
                  className="filter-select"
                >
                  <option value="name">Sort by Name</option>
                  <option value="rating">Sort by Rating</option>
                  <option value="date">Sort by Date</option>
                  <option value="reviews">Sort by Reviews</option>
                </select>
              </div>
            </div>
            <div className="spots-actions">
              <div className="view-toggle">
                <button 
                  className={`toggle-btn ${viewMode === 'table' ? 'active' : ''}`}
                  onClick={() => setViewMode('table')}
                >
                  <Filter size={16} />
                  Table View
                </button>
                <button 
                  className={`toggle-btn ${viewMode === 'map' ? 'active' : ''}`}
                  onClick={() => setViewMode('map')}
                >
                  <Map size={16} />
                  Map View
                </button>
              </div>
              <button className="btn btn-primary">
                <Map size={16} />
                Add New Spot
              </button>
              <div className="export-dropdown">
                <Download size={16} />
                <select 
                  onChange={(e) => handleExport(e.target.value)}
                  className="export-select"
                >
                  <option value="">Export</option>
                  <option value="csv">Export as CSV</option>
                  <option value="excel">Export as Excel</option>
                  <option value="pdf">Export as PDF</option>
                </select>
              </div>
              {selectedSpots.length > 0 && (
                <>
                  <button className="btn btn-success">
                    <CheckCircle size={16} />
                    Verify Selected
                  </button>
                  <button className="btn btn-warning">
                    <Ban size={16} />
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
                      className="checkbox"
                      checked={selectedSpots.length === filteredSpots.length && filteredSpots.length > 0}
                      onChange={handleSelectAllSpots}
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
                {filteredSpots.map(spot => (
                  <tr key={spot.id} className="spot-row">
                    <td>
                      <input
                        type="checkbox"
                        className="checkbox"
                        checked={selectedSpots.includes(spot.id)}
                        onChange={() => handleSelectSpot(spot.id)}
                      />
                    </td>
                    <td>
                      <div className="spot-info" onClick={() => openSpotModal(spot)} style={{ cursor: 'pointer' }}>
                        <div className="spot-image">{spot.category === 'Cafe' ? '🍕' : spot.category === 'Fast Food' ? '🍔' : spot.category === 'Italian' ? '🥗' : '🍜'}</div>
                        <div>
                          <div className="spot-name">{spot.name}</div>
                          <div className="spot-address">{spot.address}</div>
                        </div>
                      </div>
                    </td>
                    <td>{spot.city}, {spot.state}</td>
                    <td>{spot.category}</td>
                    <td><span className={`status-badge status-${spot.status}`}>{spot.status.charAt(0).toUpperCase() + spot.status.slice(1)}</span></td>
                    <td>{spot.rating ? `⭐ ${spot.rating}` : '⭐ -'}</td>
                    <td>{spot.reviews}</td>
                    <td>{spot.added}</td>
                    <td>
                      <div className="dropdown-container">
                        <button className="btn-icon" onClick={() => toggleDropdown(spot.id)}>
                          <MoreVertical size={16} />
                        </button>
                        
                        {activeDropdown === spot.id && (
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
                              onClick={() => openSpotModal(spot)}
                            >
                              <Eye size={14} />
                              View Details
                            </button>
                            <div className="dropdown-divider"></div>
                            <button 
                              className="dropdown-item"
                              onClick={() => handleSpotAction(spot.status === 'published' ? 'unpublish' : 'publish', spot)}
                            >
                              {spot.status === 'published' ? '📤 Unpublish' : '📥 Publish'}
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
              Showing {filteredSpots.length} of {spots.length} spots
            </div>
            <div className="pagination">
              <button className="btn btn-secondary" disabled>Previous</button>
              <span className="page-info">Page 1 of 1</span>
              <button className="btn btn-secondary" disabled>Next</button>
            </div>
          </div>
        </div>

        {/* Spot Details Modal */}
        {spotModalOpen && selectedSpot && (
          <div className="modal-overlay" onClick={closeSpotModal}>
            <div className="spot-modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>{selectedSpot.name}</h2>
                <button className="modal-close" onClick={closeSpotModal}>
                  <X size={20} />
                </button>
              </div>
              
              <div className="modal-content">
                <div className="modal-left">
                  <div className="spot-photos">
                    <div className="photo-grid">
                      {selectedSpot.photos.map((photo, index) => (
                        <div key={index} className="photo-item">
                          <Camera size={24} />
                          <span>Photo {index + 1}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="modal-right">
                  <div className="spot-details">
                    <div className="detail-item">
                      <MapPin size={16} className="detail-icon" />
                      <div>
                        <div className="detail-label">Address</div>
                        <div className="detail-value">{selectedSpot.address}</div>
                        <div className="detail-subvalue">{selectedSpot.city}, {selectedSpot.state}</div>
                      </div>
                    </div>
                    
                    <div className="detail-item">
                      <Phone size={16} className="detail-icon" />
                      <div>
                        <div className="detail-label">Phone</div>
                        <div className="detail-value">{selectedSpot.phone}</div>
                      </div>
                    </div>
                    
                    <div className="detail-item">
                      <Mail size={16} className="detail-icon" />
                      <div>
                        <div className="detail-label">Email</div>
                        <div className="detail-value">{selectedSpot.email}</div>
                      </div>
                    </div>
                    
                    <div className="detail-item">
                      <Globe size={16} className="detail-icon" />
                      <div>
                        <div className="detail-label">Website</div>
                        <div className="detail-value">{selectedSpot.website}</div>
                      </div>
                    </div>
                    
                    <div className="detail-item">
                      <ClockIcon size={16} className="detail-icon" />
                      <div>
                        <div className="detail-label">Hours</div>
                        <div className="detail-value">{selectedSpot.hours}</div>
                      </div>
                    </div>
                    
                    <div className="detail-item">
                      <StarIcon size={16} className="detail-icon" />
                      <div>
                        <div className="detail-label">Rating</div>
                        <div className="detail-value">{selectedSpot.rating ? `⭐ ${selectedSpot.rating} (${selectedSpot.reviews} reviews)` : 'No ratings yet'}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="spot-description">
                    <h3>Description</h3>
                    <p>{selectedSpot.description}</p>
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
        )}
      </>
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
