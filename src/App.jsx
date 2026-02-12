import React from 'react';

export default function App() {
  return (
    <>
      <header>
        <div className="appIcon">🍵</div>
        <h1>
          Chai-in
          <span className="tag">LIVE</span>
        </h1>
        <h2>Food Discovery Platform</h2>
      </header>

      <main>
        <p className="description">
          A modern food discovery platform designed to help users find amazing local spots.
          Experience the best flavors in your community through our mobile application.
        </p>

        <div className="details-section">
          <div className="detail-block">
            <span className="detail-label">Features</span>
            <div className="detail-value">Discover Spots • Rate & Review • Save Favorites</div>
          </div>
          
          <div className="detail-block">
            <span className="detail-label">Platform</span>
            <div className="detail-value">Android & iOS • Active Development</div>
          </div>
        </div>

        <footer>
          <p>Built with ❤️ for food lovers everywhere</p>
        </footer>
      </main>
    </>
  );
}
