import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import AddSpot from './pages/AddSpot';
import MapScreen from './pages/MapScreen';
import ClubLeaderboard from './pages/ClubLeaderboard';
import Leaderboard from './pages/Leaderboard';
import Admin from './pages/Admin';
import SpotDetail from './pages/SpotDetail';
import Community from './pages/Community';
import EditSpot from './pages/EditSpot';
import Favorites from './pages/Favorites';
import PrivacyPolicy from './pages/PrivacyPolicy';
import ContactAdmin from './pages/ContactAdmin';
import DirectionsPage from './pages/DirectionsPage';
import ProfileFavorites from './pages/ProfileFavorites';
import ProfileReviews from './pages/ProfileReviews';
import ProfileAdded from './pages/ProfileAdded';
import LandingPage from './pages/LandingPage';
import Explore from './pages/Explore';
import MainLayout from './layouts/MainLayout';
import { useAuth } from './context/AuthContext';
import FoodLoader from './components/FoodLoader';

// Protected Route Wrapper
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return (
    <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'white' }}>
      <FoodLoader message="Welcome to Chai-in..." />
    </div>
  );
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

// Root route handler that checks authentication
const RootRoute = () => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'white' }}>
        <FoodLoader message="Welcome to Chai-in..." />
      </div>
    );
  }
  
  // If user is authenticated, redirect to home
  if (user) {
    return <Navigate to="/en/home" replace />;
  }
  
  // If not authenticated, show landing page
  return <LandingPage />;
};

function App() {
  return (
    <Routes>
      <Route path="/" element={<RootRoute />} />
      <Route path="/login" element={<Login />} />

      {/* English Routes - PROTECTED */}
      <Route path="/en/*" element={
        <ProtectedRoute>
          <AppRoutes lang="en" />
        </ProtectedRoute>
      } />

      {/* Malayalam Routes - PROTECTED */}
      <Route path="/ml/*" element={
        <ProtectedRoute>
          <AppRoutes lang="ml" />
        </ProtectedRoute>
      } />
    </Routes>
  );
}

// Sub-router for actual pages
function AppRoutes({ lang }) {
  return (
    <Routes>
      <Route element={<MainLayout lang={lang} />}>
        <Route path="home" element={<Home lang={lang} />} />
        <Route path="map" element={<MapScreen lang={lang} />} />
        <Route path="add-spot" element={<AddSpot lang={lang} />} />
        <Route path="club-leaderboard" element={<ClubLeaderboard lang={lang} />} />
        <Route path="leaderboard" element={<Leaderboard lang={lang} />} />
        <Route path="explore" element={<Explore lang={lang} />} />
        <Route path="community" element={<Community lang={lang} />} />
        <Route path="favorites" element={<Favorites lang={lang} />} />
        <Route path="profile" element={<Profile lang={lang} />} />
        <Route path="profile/favorites" element={<ProfileFavorites lang={lang} />} />
        <Route path="profile/reviews" element={<ProfileReviews lang={lang} />} />
        <Route path="profile/added" element={<ProfileAdded lang={lang} />} />
        <Route path="settings" element={<Settings lang={lang} />} />
        <Route path="privacy-policy" element={<PrivacyPolicy lang={lang} />} />
        <Route path="contact-admin" element={<ContactAdmin lang={lang} />} />
        <Route path="directions/:id" element={<DirectionsPage lang={lang} />} />
        <Route path="spot/:id" element={<SpotDetail lang={lang} />} />
        <Route path="edit-spot/:id" element={<EditSpot lang={lang} />} />
        <Route path="admin" element={<Admin />} />
      </Route>
    </Routes>
  );
}

export default App;
