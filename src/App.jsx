import { Routes, Route, Navigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import Login from './pages/Login';
import { useAuth } from './context/AuthContext';
import FoodLoader from './components/FoodLoader';

// Lazy load components for better performance
const Home = lazy(() => import('./pages/Home'));
const Settings = lazy(() => import('./pages/Settings'));
const AddSpot = lazy(() => import('./pages/AddSpot'));
const MapScreen = lazy(() => import('./pages/MapScreen'));
const ClubLeaderboard = lazy(() => import('./pages/ClubLeaderboard'));
const Leaderboard = lazy(() => import('./pages/Leaderboard'));
const Admin = lazy(() => import('./pages/Admin'));
const SpotDetail = lazy(() => import('./pages/SpotDetail'));
const Community = lazy(() => import('./pages/Community'));
const EditSpot = lazy(() => import('./pages/EditSpot'));
const Favorites = lazy(() => import('./pages/Favorites'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const ContactAdmin = lazy(() => import('./pages/ContactAdmin'));
const DirectionsPage = lazy(() => import('./pages/DirectionsPage'));
const SavedPostsPage = lazy(() => import('./pages/SavedPostsPage'));
const LandingPage = lazy(() => import('./pages/LandingPage'));
const Explore = lazy(() => import('./pages/Explore'));
const MainLayout = lazy(() => import('./layouts/MainLayout'));

// Preload critical routes for faster navigation
const preloadRoute = (componentImport) => {
    const component = componentImport();
    // Preload the component
    component.catch(() => {});
    return component;
};

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
          <Suspense fallback={
            <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'white' }}>
              <FoodLoader message="Loading..." />
            </div>
          }>
            <AppRoutes lang="ml" />
          </Suspense>
        </ProtectedRoute>
      } />
    </Routes>
  );
}

// Sub-router for actual pages
function AppRoutes({ lang }) {
  return (
    <Suspense fallback={
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'white' }}>
        <FoodLoader message="Loading..." />
      </div>
    }>
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
          <Route path="saved-posts" element={<SavedPostsPage lang={lang} />} />
          <Route path="settings" element={<Settings lang={lang} />} />
          <Route path="privacy-policy" element={<PrivacyPolicy lang={lang} />} />
          <Route path="contact-admin" element={<ContactAdmin lang={lang} />} />
          <Route path="directions/:id" element={<DirectionsPage lang={lang} />} />
          <Route path="spot/:id" element={<SpotDetail lang={lang} />} />
          <Route path="edit-spot/:id" element={<EditSpot lang={lang} />} />
          <Route path="admin" element={<Admin />} />
        </Route>
      </Routes>
    </Suspense>
  );
}

export default App;
