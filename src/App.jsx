import React from 'react';

export default function App() {
  return (
    <>
      <header>
        <div className="app-bar-brand">
          <div className="appIcon">🍵</div>
          <h1>
            Chai-in
            <span className="tag">LIVE</span>
          </h1>
        </div>
        <h2>Food Discovery</h2>
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
            <span className="detail-label">Platform Status</span>
            <div className="detail-value">Android & iOS • Active Development</div>
          </div>

          <div className="detail-block">
            <span className="detail-label">Experience</span>
            <div className="detail-value">Real-time search, community recommendations, and seamless navigation.</div>
          </div>
        </div>

        <footer>
          <p>Built with ❤️ for food lovers everywhere</p>
        </footer>
      </main>
    </>
  );
}
