import React, { useState, useMemo, useEffect, useRef } from 'react';
import ReviewsPage from './ReviewsPage';
import SettingsPage from './SettingsPage';
import CommunityPage from './CommunityPage';
import DashboardPage from './DashboardPage';
import MobileIntro from './MobileIntro';
import PushNotifications from './PushNotifications';
import './DashboardPage.css';
import './mobile.css';
import {
  Layout,
  Users,
  Star,
  BarChart3,
  Settings,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock,
  Phone,
  MessageSquare,
  MapPin,
  StarIcon,
  Save,
  Upload,
  Image,
  RotateCw,
  Crop,
  Sun,
  Sliders,
  ChevronDown,
  ArrowLeft,
  Users as Community,
  Wrench,
  Bell,
  Search,
  Filter,
  Download,
  Trash2,
  MoreVertical,
  Edit,
  Eye,
  Globe,
  Send,
  X,
  AlertTriangle,
  Info,
  Zap,
  Users as UsersIcon,
  Lock,
  Mail,
  User,
  Shield,
  Ban,
  Camera,
  Flag,
  CheckSquare
} from 'lucide-react';
import './index.css';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobile, setIsMobile] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [mobileAdminTab, setMobileAdminTab] = useState('spots');

  // Mobile detection effect
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleMobileLogin = () => {
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
      phone: '+1-212-555-1234',
      instagram: 'centralperk_cafe'
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
      phone: '+1-310-555-6789',
      instagram: 'sunset_restaurant_la'
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
      phone: '+1-303-555-0123',
      instagram: 'mountainview_grill'
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
      phone: '+1-305-555-9876',
      instagram: 'beachside_coffee'
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
      phone: '+1-773-555-4321',
      instagram: 'downtown_bistro_chi'
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
      phone: '+1-206-555-7890',
      instagram: 'riverside_cafe_sea'
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
      phone: '+1-617-555-3456',
      instagram: 'hilltop_restaurant'
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
      phone: '+1-503-555-2345',
      instagram: 'lakeside_coffee_pdx'
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
      phone: '+1-512-555-6789',
      instagram: 'urban_eatery_atx'
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
      phone: '+1-415-555-8901',
      instagram: 'parkside_cafe_sf'
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
      phone: '+1-602-555-3456',
      instagram: 'mountainpeak_diner_phx'
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
      phone: '+1-615-555-7890',
      instagram: 'sunrise_coffee_nash'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [showItemsPerPageDropdown, setShowItemsPerPageDropdown] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [selectedSpots, setSelectedSpots] = useState([]);
  const [showFlagConfirm, setShowFlagConfirm] = useState(false);
  const [showVerifyConfirm, setShowVerifyConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
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
  const [uploadedPhotos, setUploadedPhotos] = useState([]);
  const [photoUploadExpanded, setPhotoUploadExpanded] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [emergencyContact, setEmergencyContact] = useState('+1-800-HELP-NOW');
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [contactSpotData, setContactSpotData] = useState(null);
  const fileInputRef = useRef(null);

  // New Image Editor State
  const [imageEditorOpen, setImageEditorOpen] = useState(false);
  const [editingImage, setEditingImage] = useState(null);
  const [imageRotation, setImageRotation] = useState(0);
  const [imageBrightness, setImageBrightness] = useState(100);
  const [imageContrast, setImageContrast] = useState(100);
  const [imageSaturation, setImageSaturation] = useState(100);
  const [cropRatio, setCropRatio] = useState('original');
  const editorCanvasRef = useRef(null);

  // Drag & Drop State
  const [isDragging, setIsDragging] = useState(false);
  const [dragCounter, setDragCounter] = useState(0);

  // Photo Reordering State
  const [draggedPhoto, setDraggedPhoto] = useState(null);
  const [dragOverPhoto, setDragOverPhoto] = useState(null);
  const [draggedIndex, setDraggedIndex] = useState(null);

  // Handle file selection
  const handleFileSelect = (event) => {
    const files = event.target.files;
    if (files.length > 0) {
      const currentPhotoCount = uploadedPhotos.length;
      const remainingSlots = 5 - currentPhotoCount;
      const maxPhotos = Math.min(files.length, remainingSlots);

      if (maxPhotos > 0) {
        const newPhotos = [];

        for (let i = 0; i < maxPhotos; i++) {
          const file = files[i];
          const reader = new FileReader();

          reader.onload = (e) => {
            const newPhoto = {
              id: Date.now() + i,
              name: file.name,
              size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
              url: e.target.result,
              file: file
            };

            setUploadedPhotos(prev => [...prev, newPhoto]);
          };

          reader.readAsDataURL(file);
        }
      }
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Photo Reordering Functions
  const handlePhotoDragStart = (e, photo, index) => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', e.target.innerHTML);
    setDraggedPhoto(photo);
    setDraggedIndex(index);
    console.log('Started dragging photo:', photo.name);
  };

  const handlePhotoDragOver = (e, photo) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverPhoto(photo);
  };

  const handlePhotoDragLeave = () => {
    setDragOverPhoto(null);
  };

  const handlePhotoDrop = (e, dropPhoto, dropIndex) => {
    e.preventDefault();
    e.stopPropagation();

    if (!draggedPhoto || draggedPhoto.id === dropPhoto.id) {
      setDragOverPhoto(null);
      return;
    }

    try {
      const newPhotos = [...uploadedPhotos];
      const draggedPhotoIndex = newPhotos.findIndex(p => p.id === draggedPhoto.id);

      if (draggedPhotoIndex !== -1) {
        // Remove from original position
        newPhotos.splice(draggedPhotoIndex, 1);

        // Find new drop index (it may have changed after splice)
        const newDropIndex = newPhotos.findIndex(p => p.id === dropPhoto.id);

        // Insert at new position
        newPhotos.splice(newDropIndex + 1, 0, draggedPhoto);

        setUploadedPhotos(newPhotos);
        console.log('Reordered photos:', newPhotos.map(p => p.name));
      }
    } catch (error) {
      console.error('Error reordering photos:', error);
    }

    setDraggedPhoto(null);
    setDraggedIndex(null);
    setDragOverPhoto(null);
  };

  const handlePhotoDragEnd = () => {
    setDraggedPhoto(null);
    setDraggedIndex(null);
    setDragOverPhoto(null);
  };

  // Drag & Drop Handlers
  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragCounter(prev => prev + 1);
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragCounter(prev => prev - 1);
    if (dragCounter <= 1) {
      setIsDragging(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    setDragCounter(0);

    try {
      const files = e.dataTransfer.files;
      if (files && files.length > 0) {
        console.log('Files dropped:', files.length);
        processFiles(files);
      }
    } catch (error) {
      console.error('Error handling drop:', error);
    }
  };

  const processFiles = (files) => {
    try {
      const currentPhotoCount = uploadedPhotos.length;
      const remainingSlots = 5 - currentPhotoCount;
      const maxPhotos = Math.min(files.length, remainingSlots);

      if (maxPhotos === 0) {
        console.log('Maximum photos reached');
        return;
      }

      const newPhotos = [];
      let processedCount = 0;

      for (let i = 0; i < maxPhotos; i++) {
        const file = files[i];

        // Validate file type
        if (!file.type.startsWith('image/')) {
          console.log('Skipping non-image file:', file.name);
          continue;
        }

        // Validate file size (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
          console.log('File too large:', file.name);
          continue;
        }

        const reader = new FileReader();

        reader.onload = (event) => {
          const photo = {
            id: Date.now() + i,
            name: file.name,
            url: event.target.result,
            size: file.size,
            type: file.type
          };

          newPhotos.push(photo);
          processedCount++;

          // Add photos when all are processed
          if (processedCount === maxPhotos) {
            setUploadedPhotos(prev => [...prev, ...newPhotos]);
            console.log(`Successfully added ${processedCount} photos`);
          }
        };

        reader.onerror = () => {
          console.error('Error reading file:', file.name);
          processedCount++;

          if (processedCount === maxPhotos) {
            setUploadedPhotos(prev => [...prev, ...newPhotos]);
          }
        };

        reader.readAsDataURL(file);
      }
    } catch (error) {
      console.error('Error processing files:', error);
    }
  };

  // NEW IMAGE EDITOR FUNCTIONS
  const openImageEditor = (photo) => {
    console.log('Opening image editor for photo:', photo);
    setEditingImage(photo);
    setImageRotation(0);
    setImageBrightness(100);
    setImageContrast(100);
    setImageSaturation(100);
    setCropRatio('original');
    setImageEditorOpen(true);
  };

  const closeImageEditor = () => {
    console.log('Closing image editor');
    setImageEditorOpen(false);
    setEditingImage(null);
  };

  const drawImageOnCanvas = () => {
    if (!editingImage || !editorCanvasRef.current) {
      console.log('Missing editingImage or canvas ref');
      return;
    }

    const canvas = editorCanvasRef.current;
    const ctx = canvas.getContext('2d');

    // Create image using document.createElement for better compatibility
    const img = document.createElement('img');
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      console.log('Image loaded, dimensions:', img.width, 'x', img.height);
      console.log('Editing image URL:', editingImage.url);

      // Calculate crop dimensions
      let cropWidth = img.width;
      let cropHeight = img.height;
      let cropX = 0;
      let cropY = 0;

      if (cropRatio === '1:1') {
        cropWidth = cropHeight = Math.min(img.width, img.height);
        cropX = (img.width - cropWidth) / 2;
        cropY = (img.height - cropHeight) / 2;
      } else if (cropRatio === '16:9') {
        cropHeight = (img.width * 9) / 16;
        cropX = 0;
        cropY = (img.height - cropHeight) / 2;
      }

      // Set canvas dimensions
      canvas.width = cropWidth;
      canvas.height = cropHeight;

      console.log('Canvas dimensions:', canvas.width, 'x', canvas.height);

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Apply filters
      ctx.filter = `brightness(${imageBrightness}%) contrast(${imageContrast}%) saturate(${imageSaturation}%)`;

      // Apply rotation
      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((imageRotation * Math.PI) / 180);

      // Draw the image
      ctx.drawImage(img, cropX - img.width / 2, cropY - img.height / 2, cropWidth, cropHeight);
      ctx.restore();

      console.log('Image drawn on canvas');
    };

    img.onerror = (error) => {
      console.error('Failed to load image:', editingImage.url, error);
    };

    // Set the source after setting up event handlers
    img.src = editingImage.url;
  };

  const rotateImage = (direction) => {
    const newRotation = direction === 'left' ? imageRotation - 90 : imageRotation + 90;
    setImageRotation(newRotation % 360);
  };

  const applyCrop = (ratio) => {
    setCropRatio(ratio);
  };

  const resetImageEdits = () => {
    setImageRotation(0);
    setImageBrightness(100);
    setImageContrast(100);
    setImageSaturation(100);
    setCropRatio('original');
  };

  const saveImageEdits = () => {
    if (!editingImage || !editorCanvasRef.current) {
      console.log('Cannot save - missing image or canvas');
      return;
    }

    const canvas = editorCanvasRef.current;

    try {
      const editedUrl = canvas.toDataURL('image/jpeg', 0.9);
      console.log('Image saved successfully');

      const updatedPhotos = uploadedPhotos.map(photo =>
        photo.id === editingImage.id
          ? { ...photo, url: editedUrl }
          : photo
      );

      setUploadedPhotos(updatedPhotos);
      closeImageEditor();
    } catch (error) {
      console.error('Failed to save image:', error);
    }
  };

  // Use effect to update canvas when image editor opens or settings change
  useEffect(() => {
    if (imageEditorOpen && editingImage && editorCanvasRef.current) {
      console.log('Image editor opened, drawing image...');
      setTimeout(() => {
        drawImageOnCanvas();
      }, 200); // Increased delay to ensure DOM is ready
    }
  }, [imageEditorOpen, editingImage]);

  useEffect(() => {
    if (imageEditorOpen && editingImage && editorCanvasRef.current) {
      console.log('Image settings changed, redrawing...');
      drawImageOnCanvas();
    }
  }, [imageRotation, imageBrightness, imageContrast, imageSaturation, cropRatio]);

  // NEW IMAGE EDITOR MODAL
  const renderImageEditorModal = () => {
    if (!imageEditorOpen || !editingImage) return null;

    return (
      <div className="modern-modal-overlay" onClick={closeImageEditor}>
        <div className="modern-modal-container image-edit-modal" onClick={(e) => e.stopPropagation()}>
          {/* Modal Header */}
          <div className="modern-modal-header">
            <div className="header-content">
              <div className="spot-info">
                <div className="spot-avatar">
                  <Sliders size={24} />
                </div>
                <div className="spot-details">
                  <h2 className="spot-name">Edit Photo</h2>
                  <p className="spot-category">Image Editor</p>
                </div>
              </div>
              <button className="modern-close-btn" onClick={closeImageEditor}>
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Modal Body */}
          <div className="modern-modal-body">
            <div className="image-editor-container">
              {/* Canvas Display */}
              <div className="canvas-container">
                <canvas
                  ref={editorCanvasRef}
                  width={400}
                  height={300}
                  style={{
                    maxWidth: '100%',
                    maxHeight: '400px',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    backgroundColor: '#f9fafb'
                  }}
                />
                {!editingImage && (
                  <div style={{ textAlign: 'center', padding: '20px', color: '#6b7280' }}>
                    Loading image...
                  </div>
                )}
              </div>

              {/* Controls */}
              <div className="edit-controls">
                {/* Rotate Controls */}
                <div className="control-group">
                  <h4>
                    <RotateCw size={16} />
                    Rotate
                  </h4>
                  <div className="button-group">
                    <button className="control-btn" onClick={() => rotateImage('left')}>
                      <RotateCw size={14} />
                      Left
                    </button>
                    <button className="control-btn" onClick={() => rotateImage('right')}>
                      <RotateCw size={14} />
                      Right
                    </button>
                  </div>
                </div>

                {/* Enhancement Controls */}
                <div className="control-group">
                  <h4>
                    <Sun size={16} />
                    Enhance
                  </h4>
                  <div className="slider-group">
                    <div className="slider-control">
                      <label>Brightness</label>
                      <input
                        type="range"
                        min="0"
                        max="200"
                        value={imageBrightness}
                        onChange={(e) => setImageBrightness(Number(e.target.value))}
                      />
                      <span>{imageBrightness}%</span>
                    </div>
                    <div className="slider-control">
                      <label>Contrast</label>
                      <input
                        type="range"
                        min="0"
                        max="200"
                        value={imageContrast}
                        onChange={(e) => setImageContrast(Number(e.target.value))}
                      />
                      <span>{imageContrast}%</span>
                    </div>
                    <div className="slider-control">
                      <label>Saturation</label>
                      <input
                        type="range"
                        min="0"
                        max="200"
                        value={imageSaturation}
                        onChange={(e) => setImageSaturation(Number(e.target.value))}
                      />
                      <span>{imageSaturation}%</span>
                    </div>
                  </div>
                </div>

                {/* Crop Controls */}
                <div className="control-group">
                  <h4>
                    <Crop size={16} />
                    Crop
                  </h4>
                  <div className="button-group">
                    <button
                      className={`control-btn ${cropRatio === 'original' ? 'primary' : ''}`}
                      onClick={() => applyCrop('original')}
                    >
                      <Crop size={14} />
                      Original
                    </button>
                    <button
                      className={`control-btn ${cropRatio === '1:1' ? 'primary' : ''}`}
                      onClick={() => applyCrop('1:1')}
                    >
                      <Crop size={14} />
                      1:1
                    </button>
                    <button
                      className={`control-btn ${cropRatio === '16:9' ? 'primary' : ''}`}
                      onClick={() => applyCrop('16:9')}
                    >
                      <Crop size={14} />
                      16:9
                    </button>
                  </div>
                </div>

                {/* Action Controls */}
                <div className="control-group">
                  <h4>Actions</h4>
                  <div className="button-group">
                    <button className="control-btn secondary" onClick={resetImageEdits}>
                      <X size={14} />
                      Reset
                    </button>
                    <button className="control-btn primary" onClick={saveImageEdits}>
                      <Save size={14} />
                      Save
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
                <p className="last-modified">Editing: {editingImage.name}</p>
              </div>
              <div className="footer-actions">
                <button className="modern-btn cancel" onClick={closeImageEditor}>
                  Cancel
                </button>
                <button className="modern-btn primary" onClick={saveImageEdits}>
                  <Save size={16} />
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

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

  const handleItemsPerPageChange = (value) => {
    setItemsPerPage(parseInt(value));
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  const handleExport = () => {
    // Create CSV content
    const headers = ['Name', 'Category', 'City', 'State', 'Rating', 'Reviews', 'Status', 'Added Date'];
    const csvContent = [
      headers.join(','),
      ...filteredSpots.map(spot => [
        `"${spot.name}"`,
        `"${spot.category}"`,
        `"${spot.city}"`,
        `"${spot.state}"`,
        spot.rating || '0',
        spot.reviews || '0',
        `"${spot.status}"`,
        `"${spot.added}"`
      ].join(','))
    ].join('\n');

    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `spots_export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFlagSelected = () => {
    setShowFlagConfirm(true);
  };

  const handleConfirmFlag = () => {
    console.log(`Flagging ${selectedSpots.length} selected spots`);
    // Add flag logic here
    setSelectedSpots([]);
    setShowFlagConfirm(false);
  };

  const handleCancelFlag = () => {
    setShowFlagConfirm(false);
  };

  const handleVerifySelected = () => {
    setShowVerifyConfirm(true);
  };

  const handleConfirmVerify = () => {
    console.log(`Verifying ${selectedSpots.length} selected spots`);
    // Add verify logic here
    setSelectedSpots([]);
    setShowVerifyConfirm(false);
  };

  const handleCancelVerify = () => {
    setShowVerifyConfirm(false);
  };

  const handleDeleteSelected = () => {
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = () => {
    console.log(`Deleting ${selectedSpots.length} selected spots`);
    // Add delete logic here
    setSelectedSpots([]);
    setShowDeleteConfirm(false);
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  const handleSpotAction = (action, spot) => {
    console.log(`${action} spot:`, spot.name);
    setActiveSpotDropdown(null);

    if (action === 'edit') {
      setEditingSpotData(spot);
      setEditModalOpen(true);
    } else if (action === 'message') {
      setContactSpotData(spot);
      setContactModalOpen(true);
    } else if (action === 'suspend') {
      console.log('Suspending spot:', spot.name);
      // Add suspend logic here
    } else if (action === 'unflag') {
      console.log('Unflagging spot:', spot.name);
      // Add unflag logic here
    } else if (action === 'reject') {
      console.log('Rejecting spot:', spot.name);
      // Add reject logic here
    }
  };

  const toggleSpotDropdown = (spotId) => {
    if (activeSpotDropdown === spotId) {
      setActiveSpotDropdown(null);
      // Remove dropdown-open class from all cards
      document.querySelectorAll('.mobile-spot-card').forEach(card => {
        card.classList.remove('dropdown-open');
      });
    } else {
      setActiveSpotDropdown(spotId);
      // Remove dropdown-open class from all cards first
      document.querySelectorAll('.mobile-spot-card').forEach(card => {
        card.classList.remove('dropdown-open');
      });
      // Add dropdown-open class to the current card
      setTimeout(() => {
        const currentCard = document.querySelector(`.mobile-spot-card:has(.mobile-dropdown-menu)`);
        if (currentCard) {
          currentCard.classList.add('dropdown-open');
        }
      }, 0);
    }
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
        // Remove dropdown-open class from all cards
        document.querySelectorAll('.mobile-spot-card').forEach(card => {
          card.classList.remove('dropdown-open');
        });
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
              <div className="search-container">
                <Search size={20} className="search-icon" />
                <input
                  type="text"
                  placeholder="Search users by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
                <div className="search-results-counter">0</div>
                <div className="search-loading"></div>
              </div>
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
                            onClick={() => handleUserAction('message', user)}
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
                        onClick={() => {/* Could add status change logic */ }}
                      >
                        <CheckCircle size={14} />
                        Verified
                      </button>
                      <button
                        className={`status-pill ${editingSpotData.status === 'pending' ? 'active' : ''}`}
                        onClick={() => {/* Could add status change logic */ }}
                      >
                        <Clock size={14} />
                        Pending
                      </button>
                      <button
                        className={`status-pill ${editingSpotData.status === 'flagged' ? 'active' : ''}`}
                        onClick={() => {/* Could add status change logic */ }}
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
                    <button className="action-btn secondary" onClick={() => setPhotoUploadExpanded(!photoUploadExpanded)}>
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

              {/* Photo Upload Section */}
              {photoUploadExpanded && (
                <div className="modern-section">
                  <h3 className="section-title">
                    <div className="title-icon">
                      <Camera size={18} />
                    </div>
                    Photo Upload ({uploadedPhotos.length}/5)
                  </h3>

                  <div className="photo-upload-area">
                    {uploadedPhotos.length < 5 && (
                      <div
                        className={`upload-zone ${isDragging ? 'dragging' : ''}`}
                        onClick={() => fileInputRef.current?.click()}
                        onDragEnter={handleDragEnter}
                        onDragLeave={handleDragLeave}
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                      >
                        <div className="upload-content">
                          <Upload size={48} className="upload-icon" />
                          <h3>Upload Photos</h3>
                          <p>
                            {isDragging
                              ? 'Drop files here...'
                              : 'Drag & drop photos here or click to browse'
                            }
                          </p>
                          <p className="upload-limit">
                            Select up to {5 - uploadedPhotos.length} more photos
                          </p>
                          <button
                            type="button"
                            className="modern-btn primary"
                            onClick={(e) => {
                              e.stopPropagation();
                              fileInputRef.current?.click();
                            }}
                          >
                            <Upload size={16} />
                            Choose Files
                          </button>
                        </div>
                      </div>
                    )}
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleFileSelect}
                      style={{ display: 'none' }}
                    />

                    {uploadedPhotos.length > 0 && (
                      <div className="uploaded-photos">
                        <h4>Uploaded Photos ({uploadedPhotos.length}/5)</h4>
                        <div className="photo-grid">
                          {uploadedPhotos.map((photo, index) => (
                            <div
                              key={photo.id}
                              className={`photo-item ${draggedPhoto?.id === photo.id ? 'dragging' : ''} ${dragOverPhoto?.id === photo.id ? 'drag-over' : ''}`}
                              draggable
                              onDragStart={(e) => handlePhotoDragStart(e, photo, index)}
                              onDragOver={(e) => handlePhotoDragOver(e, photo)}
                              onDragLeave={handlePhotoDragLeave}
                              onDrop={(e) => handlePhotoDrop(e, photo, index)}
                              onDragEnd={handlePhotoDragEnd}
                              style={{
                                cursor: draggedPhoto?.id === photo.id ? 'grabbing' : 'grab',
                                opacity: draggedPhoto?.id === photo.id ? 0.5 : 1
                              }}
                            >
                              <div className="photo-preview">
                                <img src={photo.url} alt={photo.name} />
                                {dragOverPhoto?.id === photo.id && (
                                  <div className="drop-indicator">
                                    <ChevronDown size={20} />
                                  </div>
                                )}
                              </div>
                              <div className="photo-actions">
                                <button
                                  className="photo-edit"
                                  onClick={() => openImageEditor(photo)}
                                  title="Edit Photo"
                                >
                                  <Edit size={14} />
                                </button>
                                <button
                                  className="photo-remove"
                                  onClick={() => {
                                    setUploadedPhotos(uploadedPhotos.filter(p => p.id !== photo.id));
                                  }}
                                  title="Remove Photo"
                                >
                                  <X size={16} />
                                </button>
                              </div>
                              {draggedPhoto?.id !== photo.id && (
                                <div className="photo-number">
                                  {index + 1}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {uploadedPhotos.length === 5 && (
                      <div className="upload-complete">
                        <div className="complete-icon">
                          <CheckCircle size={32} />
                        </div>
                        <h4>Maximum Photos Reached</h4>
                        <p>You've uploaded the maximum of 5 photos. Remove some photos to add more.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
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
                    <button className="action-btn primary" onClick={() => {
                      setViewDetailsModalOpen(false);
                      setEditingSpotData(viewingSpotData);
                      setEditModalOpen(true);
                    }}>
                      <Edit size={16} />
                      Edit Spot
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
                <div className="search-container">
                  <Search size={20} className="search-icon" />
                  <input
                    type="text"
                    placeholder="Search spots by name, location, or cuisine..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                  />
                  <div className="search-results-counter">0</div>
                  <div className="search-loading"></div>
                </div>
              </div>
              <div className="modern-status-dropdown">
                <div className="status-dropdown-trigger" onClick={() => setShowStatusDropdown(!showStatusDropdown)}>
                  <Filter size={16} />
                  <span className="status-dropdown-label">
                    {statusFilter === 'all' ? 'All Status' : 
                     statusFilter === 'verified' ? 'Verified' :
                     statusFilter === 'pending' ? 'Pending' : 'Flagged'}
                  </span>
                  <ChevronDown 
                    size={16} 
                    className={`dropdown-arrow ${showStatusDropdown ? 'open' : ''}`}
                  />
                </div>
                {showStatusDropdown && (
                  <div className="status-dropdown-menu">
                    {[
                      { value: 'all', label: 'All Status', color: '#6b7280', icon: '📊' },
                      { value: 'verified', label: 'Verified', color: '#10b981', icon: '✅' },
                      { value: 'pending', label: 'Pending', color: '#f59e0b', icon: '⏳' },
                      { value: 'flagged', label: 'Flagged', color: '#ef4444', icon: '🚩' }
                    ].map(status => (
                      <div
                        key={status.value}
                        className={`status-dropdown-item ${statusFilter === status.value ? 'active' : ''}`}
                        onClick={() => {
                          setStatusFilter(status.value);
                          setShowStatusDropdown(false);
                        }}
                        style={{ '--status-color': status.color }}
                      >
                        <span className="status-icon">{status.icon}</span>
                        <span className="status-text">{status.label}</span>
                        {statusFilter === status.value && (
                          <div className="status-checkmark">✓</div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="modern-sort-dropdown">
                <div className="sort-dropdown-trigger" onClick={() => setShowSortDropdown(!showSortDropdown)}>
                  <TrendingUp size={16} />
                  <span className="sort-dropdown-label">
                    {sortBy === 'name' ? 'Sort by Name' : 
                     sortBy === 'rating' ? 'Sort by Rating' :
                     sortBy === 'date' ? 'Sort by Date' : 'Sort by Reviews'}
                  </span>
                  <ChevronDown 
                    size={16} 
                    className={`dropdown-arrow ${showSortDropdown ? 'open' : ''}`}
                  />
                </div>
                {showSortDropdown && (
                  <div className="sort-dropdown-menu">
                    {[
                      { value: 'name', label: 'Sort by Name', icon: '🔤', description: 'Alphabetical order' },
                      { value: 'rating', label: 'Sort by Rating', icon: '⭐', description: 'Highest rated first' },
                      { value: 'date', label: 'Sort by Date', icon: '📅', description: 'Newest first' },
                      { value: 'reviews', label: 'Sort by Reviews', icon: '💬', description: 'Most reviewed first' }
                    ].map(sort => (
                      <div
                        key={sort.value}
                        className={`sort-dropdown-item ${sortBy === sort.value ? 'active' : ''}`}
                        onClick={() => {
                          setSortBy(sort.value);
                          setShowSortDropdown(false);
                        }}
                      >
                        <div className="sort-item-content">
                          <div className="sort-item-main">
                            <span className="sort-icon">{sort.icon}</span>
                            <span className="sort-text">{sort.label}</span>
                            {sortBy === sort.value && (
                              <div className="sort-checkmark">✓</div>
                            )}
                          </div>
                          <div className="sort-description">{sort.description}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="modern-items-per-page-dropdown">
                <div className="items-per-page-trigger" onClick={() => setShowItemsPerPageDropdown(!showItemsPerPageDropdown)}>
                  <Users size={16} />
                  <span className="items-per-page-label">
                    {itemsPerPage} per page
                  </span>
                  <ChevronDown 
                    size={16} 
                    className={`dropdown-arrow ${showItemsPerPageDropdown ? 'open' : ''}`}
                  />
                </div>
                {showItemsPerPageDropdown && (
                  <div className="items-per-page-menu">
                    {[
                      { value: 2, label: '2 per page', icon: '📄', description: 'Minimal view' },
                      { value: 5, label: '5 per page', icon: '📋', description: 'Compact view' },
                      { value: 10, label: '10 per page', icon: '📝', description: 'Standard view' },
                      { value: 20, label: '20 per page', icon: '📊', description: 'Extended view' },
                      { value: 50, label: '50 per page', icon: '📚', description: 'Maximum view' }
                    ].map(option => (
                      <div
                        key={option.value}
                        className={`items-per-page-item ${itemsPerPage === option.value ? 'active' : ''}`}
                        onClick={() => {
                          handleItemsPerPageChange(option.value);
                          setShowItemsPerPageDropdown(false);
                        }}
                      >
                        <div className="items-per-page-content">
                          <div className="items-per-page-main">
                            <span className="items-per-page-icon">{option.icon}</span>
                            <span className="items-per-page-text">{option.label}</span>
                            {itemsPerPage === option.value && (
                              <div className="items-per-page-checkmark">✓</div>
                            )}
                          </div>
                          <div className="items-per-page-description">{option.description}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="spots-actions">
              <div className="modern-export-button" onClick={handleExport}>
                <div className="export-button-content">
                  <div className="export-icon-wrapper">
                    <Download size={18} />
                  </div>
                  <div className="export-text-content">
                    <span className="export-main-text">Export</span>
                    <span className="export-sub-text">Download data</span>
                  </div>
                  <div className="export-arrow">
                    <div className="arrow-icon">→</div>
                  </div>
                </div>
                <div className="export-button-shine"></div>
              </div>
            </div>
          </div>

          {/* Selected Spots Action Bar */}
          <div className={`selected-spots-action-bar ${selectedSpots.length > 0 ? 'visible' : ''}`}>
            <div className="action-bar-content">
              <div className="selection-info">
                <div className="selection-count">
                  <CheckSquare size={20} />
                  <span>{selectedSpots.length} {selectedSpots.length === 1 ? 'spot' : 'spots'} selected</span>
                </div>
              </div>
              <div className="action-buttons-group">
                <button className="action-btn flag-btn" onClick={() => handleFlagSelected()}>
                  <Flag size={16} />
                  <span>Flag Selected</span>
                </button>
                <button className="action-btn verify-btn" onClick={() => handleVerifySelected()}>
                  <CheckCircle size={16} />
                  <span>Verify Selected</span>
                </button>
                <button className="action-btn delete-btn" onClick={() => handleDeleteSelected()}>
                  <Trash2 size={16} />
                  <span>Delete Selected</span>
                </button>
                <button className="action-btn cancel-btn" onClick={() => setSelectedSpots([])}>
                  <X size={16} />
                  <span>Cancel</span>
                </button>
              </div>
            </div>
          </div>

          {/* Flag Confirmation Popup */}
          {showFlagConfirm && (
            <div className="flag-confirm-overlay">
              <div className="flag-confirm-popup">
                <div className="flag-confirm-content">
                  <div className="flag-confirm-icon">
                    <Flag size={48} />
                  </div>
                  <h3>Flag Selected Spots</h3>
                  <p>Are you sure you want to flag {selectedSpots.length} {selectedSpots.length === 1 ? 'spot' : 'spots'}? This action will mark them for review.</p>
                  <div className="flag-confirm-buttons">
                    <button className="flag-confirm-btn cancel" onClick={handleCancelFlag}>
                      <X size={16} />
                      <span>Cancel</span>
                    </button>
                    <button className="flag-confirm-btn confirm" onClick={handleConfirmFlag}>
                      <Flag size={16} />
                      <span>Flag {selectedSpots.length === 1 ? 'Spot' : 'Spots'}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Verify Confirmation Popup */}
          {showVerifyConfirm && (
            <div className="verify-confirm-overlay">
              <div className="verify-confirm-popup">
                <div className="verify-confirm-content">
                  <div className="verify-confirm-icon">
                    <CheckCircle size={48} />
                  </div>
                  <h3>Verify Selected Spots</h3>
                  <p>Are you sure you want to verify {selectedSpots.length} {selectedSpots.length === 1 ? 'spot' : 'spots'}? This action will mark them as verified.</p>
                  <div className="verify-confirm-buttons">
                    <button className="verify-confirm-btn cancel" onClick={handleCancelVerify}>
                      <X size={16} />
                      <span>Cancel</span>
                    </button>
                    <button className="verify-confirm-btn confirm" onClick={handleConfirmVerify}>
                      <CheckCircle size={16} />
                      <span>Verify {selectedSpots.length === 1 ? 'Spot' : 'Spots'}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Delete Confirmation Popup */}
          {showDeleteConfirm && (
            <div className="delete-confirm-overlay">
              <div className="delete-confirm-popup">
                <div className="delete-confirm-content">
                  <div className="delete-confirm-icon">
                    <Trash2 size={48} />
                  </div>
                  <h3>Delete Selected Spots</h3>
                  <p>Are you sure you want to delete {selectedSpots.length} {selectedSpots.length === 1 ? 'spot' : 'spots'}? This action cannot be undone.</p>
                  <div className="delete-confirm-buttons">
                    <button className="delete-confirm-btn cancel" onClick={handleCancelDelete}>
                      <X size={16} />
                      <span>Cancel</span>
                    </button>
                    <button className="delete-confirm-btn confirm" onClick={handleConfirmDelete}>
                      <Trash2 size={16} />
                      <span>Delete {selectedSpots.length === 1 ? 'Spot' : 'Spots'}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

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
        {renderImageEditorModal()}
        {renderContactModal()}
      </>
    );
  };

  const renderContactModal = () => {
    if (!contactModalOpen || !contactSpotData) return null;

    return (
      <div className="contact-modal-overlay" onClick={() => setContactModalOpen(false)}>
        <div className="contact-modal-wrapper" onClick={(e) => e.stopPropagation()}>
          {/* Close Button */}
          <button className="contact-close-btn" onClick={() => setContactModalOpen(false)}>
            <X size={24} />
          </button>

          {/* Modal Content */}
          <div className="contact-modal-inner">
            {/* Header */}
            <div className="contact-modal-header">
              <div className="spot-avatar-large">
                <MapPin size={32} />
              </div>
              <div className="spot-info-text">
                <h2 className="spot-title-main">{contactSpotData.name}</h2>
                <p className="spot-location-text">{contactSpotData.city}, {contactSpotData.state}</p>
              </div>
            </div>

            {/* Contact Methods */}
            <div className="contact-methods-section">
              <h3 className="section-heading">Contact Methods</h3>
              
              <div className="contact-methods-grid">
                {/* Call Method */}
                <div 
                  className="contact-method-item"
                  onClick={() => window.open(`tel:${contactSpotData.phone}`, '_blank')}
                >
                  <div className="method-icon-circle phone">
                    <Phone size={20} />
                  </div>
                  <div className="method-content">
                    <h4 className="method-name">Phone Call</h4>
                    <p className="method-detail">{contactSpotData.phone}</p>
                  </div>
                  <div className="method-action">
                    <div className="action-arrow">→</div>
                  </div>
                </div>

                {/* WhatsApp Method */}
                <div 
                  className="contact-method-item"
                  onClick={() => window.open(`https://wa.me/${contactSpotData.phone.replace(/[^0-9]/g, '')}`, '_blank')}
                >
                  <div className="method-icon-circle whatsapp">
                    <MessageSquare size={20} />
                  </div>
                  <div className="method-content">
                    <h4 className="method-name">WhatsApp</h4>
                    <p className="method-detail">Send Message</p>
                  </div>
                  <div className="method-action">
                    <div className="action-arrow">→</div>
                  </div>
                </div>

                {/* Instagram Method */}
                <div 
                  className="contact-method-item"
                  onClick={() => window.open(`https://instagram.com/${contactSpotData.instagram || 'bytspot_official'}`, '_blank')}
                >
                  <div className="method-icon-circle instagram">
                    <Camera size={20} />
                  </div>
                  <div className="method-content">
                    <h4 className="method-name">Instagram</h4>
                    <p className="method-detail">@{contactSpotData.instagram || 'bytspot_official'}</p>
                  </div>
                  <div className="method-action">
                    <div className="action-arrow">→</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Location Section */}
            <div className="location-section">
              <h3 className="section-heading">Location Details</h3>
              
              <div className="location-info-card">
                <div className="location-header-info">
                  <div className="location-icon-small">
                    <MapPin size={16} />
                  </div>
                  <h4 className="location-name">{contactSpotData.name}</h4>
                </div>
                
                <div className="location-address-info">
                  <p className="address-line">{contactSpotData.address}</p>
                  <p className="city-line">{contactSpotData.city}, {contactSpotData.state}</p>
                </div>
                
                <div className="location-map-preview">
                  <div className="map-icon-large">
                    <MapPin size={24} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderDashboard = () => {
    return <DashboardPage />;
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return renderDashboard();
      case 'users':
        return renderUsers();
      case 'spots':
        return renderSpots();
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

          {mobileAdminTab === 'spots' && (
            <div className="mobile-admin-search-section">
              <div className="search-box-mobile">
                <Search size={18} className="search-icon-mobile" />
                <input
                  type="text"
                  placeholder="Search spots..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input-mobile"
                />
                {searchTerm && (
                  <button className="clear-search-btn" onClick={() => setSearchTerm('')}>
                    <X size={14} />
                  </button>
                )}
                <button className="filter-btn-mobile" onClick={() => setShowFilterModal(!showFilterModal)}>
                  <Filter size={18} />
                </button>
              </div>
            </div>
          )}

          {showFilterModal && (
            <div className="filter-modal-overlay" onClick={() => setShowFilterModal(false)}>
              <div className="filter-modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="filter-modal-header">
                  <h3>Filter Spots</h3>
                  <button className="filter-modal-close" onClick={() => setShowFilterModal(false)}>
                    <X size={20} />
                  </button>
                </div>
                <div className="filter-modal-body">
                  <div className="filter-options">
                    {['all', 'verified', 'pending', 'flagged'].map(status => (
                      <button
                        key={status}
                        className={`filter-option ${statusFilter === status ? 'active' : ''}`}
                        onClick={() => {
                          setStatusFilter(status);
                          setShowFilterModal(false);
                        }}
                      >
                        {status === 'all' ? 'All Spots' : status.charAt(0).toUpperCase() + status.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="mobile-admin-content-area">
            {mobileAdminTab === 'spots' ? (
              <div className="mobile-spots-list">
                {filteredSpots.length > 0 ? (
                  filteredSpots.map(spot => (
                    <div key={spot.id} className="mobile-spot-card" onClick={() => openSpotModal(spot)}>
                      <div className="card-main">
                        <div className="card-info">
                          <div className="card-title-row">
                            <h3 className="spot-name-text">{spot.name}</h3>
                            <button
                              className="spot-options-btn"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleSpotDropdown(spot.id);
                              }}
                            >
                              <MoreVertical size={18} />
                            </button>
                            {activeSpotDropdown === spot.id && (
                              <div className="mobile-dropdown-menu">
                                {spot.status === 'verified' ? (
                                  <>
                                    <button className="dropdown-item" onClick={(e) => { e.stopPropagation(); handleSpotAction('suspend', spot); }}>
                                      <Ban size={16} />
                                      <span>Suspend</span>
                                    </button>
                                    <button className="dropdown-item" onClick={(e) => { e.stopPropagation(); handleSpotAction('flag', spot); }}>
                                      <AlertCircle size={16} />
                                      <span>Flag</span>
                                    </button>
                                    <button className="dropdown-item delete" onClick={(e) => { e.stopPropagation(); handleSpotAction('delete', spot); }}>
                                      <Trash2 size={16} />
                                      <span>Delete</span>
                                    </button>
                                  </>
                                ) : spot.status === 'flagged' ? (
                                  <>
                                    <button className="dropdown-item" onClick={(e) => { e.stopPropagation(); handleSpotAction('unflag', spot); }}>
                                      <CheckCircle size={16} />
                                      <span>Unflag</span>
                                    </button>
                                    <button className="dropdown-item delete" onClick={(e) => { e.stopPropagation(); handleSpotAction('delete', spot); }}>
                                      <Trash2 size={16} />
                                      <span>Delete</span>
                                    </button>
                                  </>
                                ) : spot.status === 'pending' ? (
                                  <>
                                    <button className="dropdown-item" onClick={(e) => { e.stopPropagation(); handleSpotAction('verify', spot); }}>
                                      <CheckCircle size={16} />
                                      <span>Approve</span>
                                    </button>
                                    <button className="dropdown-item" onClick={(e) => { e.stopPropagation(); handleSpotAction('reject', spot); }}>
                                      <XCircle size={16} />
                                      <span>Reject</span>
                                    </button>
                                  </>
                                ) : (
                                  <>
                                    <button className="dropdown-item" onClick={(e) => { e.stopPropagation(); handleSpotAction('verify', spot); }}>
                                      <CheckCircle size={16} />
                                      <span>Approve</span>
                                    </button>
                                    <button className="dropdown-item" onClick={(e) => { e.stopPropagation(); handleSpotAction('flag', spot); }}>
                                      <AlertCircle size={16} />
                                      <span>Flag</span>
                                    </button>
                                    <button className="dropdown-item delete" onClick={(e) => { e.stopPropagation(); handleSpotAction('delete', spot); }}>
                                      <Trash2 size={16} />
                                      <span>Delete</span>
                                    </button>
                                  </>
                                )}
                              </div>
                            )}
                          </div>
                          <div className="spot-meta-row">
                            <span className="spot-category-tag">{spot.category}</span>
                            <div className="spot-rating-pill">
                              <Star size={12} fill="#FFD700" color="#FFD700" />
                              <span>{spot.rating}</span>
                            </div>
                          </div>
                        </div>
                        <div className="card-status-area">
                          {getStatusBadge(spot.status)}
                        </div>
                      </div>
                      <div className="card-footer">
                        <div className="spot-location-text">
                          <MapPin size={14} />
                          <span>{spot.city}, {spot.state}</span>
                        </div>
                        <div className="spot-id-tag">#{spot.id}</div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="mobile-admin-empty-content">
                    <div className="empty-state-label">No Spots Found</div>
                  </div>
                )}
              </div>
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
