import React from 'react';

export default function App() {
  return (
    <div className="page">
      <div className="container">
        <div className="appIcon">🍵</div>
        <h1>Chai-in</h1>
        <h2>Food Discovery</h2>
        <div className="tag">Mobile Application</div>
        
        <p style={{ marginTop: '20px' }}>
          A modern food discovery platform designed to help users find amazing local spots.
        </p>

        <div className="details-grid">
          <div className="detail-item">
            <span className="detail-label">Features</span>
            <div className="detail-value">Discover Spots, Rate & Review, Save Favorites, Community Feed</div>
          </div>
          
          <div className="detail-item">
            <span className="detail-label">Technology Stack</span>
            <div className="detail-value">Flutter, Supabase, Google Maps API, PostgreSQL</div>
          </div>
          
          <div className="detail-item">
            <span className="detail-label">Status</span>
            <div className="detail-value">Active Development - Mobile App Available Now</div>
          </div>
        </div>

        <div className="footer">
          <p>Built with ❤️ for food lovers</p>
        </div>
      </div>
    </div>
  );
}
