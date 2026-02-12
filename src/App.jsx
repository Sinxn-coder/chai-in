import React from 'react';

export default function App() {
  return (
    <div className="page">
      <div className="container">
        <div className="appIcon">🍵</div>
        <h1>Chai-in</h1>
        <h2>Food Discovery Mobile Application</h2>
        <p>
          A modern Flutter-based mobile application designed to help users discover
          amazing food spots in their community.
        </p>

        <h3>🚀 Key Features</h3>
        <div className="features">
          <div className="feature">
            <h4>🗺️ Discover Spots</h4>
            <p>
              Find amazing restaurants, cafes, and food spots near your location
              with real-time search and filtering.
            </p>
          </div>
          <div className="feature">
            <h4>⭐ Rate & Review</h4>
            <p>
              Share your experiences with the community through ratings, reviews,
              and photos.
            </p>
          </div>
          <div className="feature">
            <h4>📍 Save Favorites</h4>
            <p>
              Build your personal collection of favorite food spots and access
              them anytime.
            </p>
          </div>
          <div className="feature">
            <h4>👥 Community Feed</h4>
            <p>
              Stay updated with the latest food trends and community
              recommendations.
            </p>
          </div>
        </div>

        <h3>🛠️ Technology Stack</h3>
        <div className="techStack">
          <h4>Frontend & Mobile</h4>
          <div className="techList">
            <div className="techItem">Flutter</div>
            <div className="techItem">Dart</div>
            <div className="techItem">Material Design</div>
          </div>

          <h4>Backend & Database</h4>
          <div className="techList">
            <div className="techItem">Supabase</div>
            <div className="techItem">PostgreSQL</div>
            <div className="techItem">Real-time Sync</div>
          </div>

          <h4>Services & APIs</h4>
          <div className="techList">
            <div className="techItem">Google Maps</div>
            <div className="techItem">Geolocation</div>
            <div className="techItem">Cloud Storage</div>
          </div>
        </div>

        <h3>📱 Platform Availability</h3>
        <p>
          <strong>Currently Available:</strong> Flutter mobile application for
          Android and iOS
        </p>
        <p>
          <strong>Development Status:</strong> Active development with regular
          updates and feature enhancements.
        </p>
        <p>
          <strong>Future Plans:</strong> Web application and expanded platform
          support.
        </p>

        <div className="comingSoon">🚀 Mobile App Available Now</div>

        <div className="footer">
          <p>
            <strong>Chai-in</strong> - Connecting food lovers with amazing local
            spots
          </p>
          <p>Built with ❤️ using Flutter and modern web technologies</p>
        </div>
      </div>
    </div>
  );
}
