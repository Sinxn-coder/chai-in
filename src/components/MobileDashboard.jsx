import React, { useState, useEffect } from 'react';
import { Settings as SettingsIcon } from 'lucide-react';

const MobileDashboard = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Don't render anything on desktop
  if (!isMobile) {
    return null;
  }

  return (
    <div className="mobile-dashboard">
      {/* App Bar */}
      <div className="mobile-app-bar">
        <div className="app-bar-content">
          <SettingsIcon className="w-6 h-6 text-white" />
          <h1 className="app-bar-title">Admin Panel</h1>
        </div>
      </div>

      {/* Main Content - Only Admin Panel Text */}
      <div className="mobile-content">
        <div className="mobile-admin-panel">
          <h2>Admin Panel</h2>
        </div>
      </div>
    </div>
  );
};

export default MobileDashboard;
