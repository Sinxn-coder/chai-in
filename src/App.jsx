import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import AddSpot from './pages/AddSpot';
import MapScreen from './pages/MapScreen';
import Leaderboard from './pages/Leaderboard';
import Admin from './pages/Admin';
import SpotDetail from './pages/SpotDetail';
import Community from './pages/Community';
import MainLayout from './layouts/MainLayout';
import { useAuth } from './context/AuthContext';

// Protected Route Wrapper
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null; // Or a spinner
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
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
        <Route path="community" element={<Community lang={lang} />} />
        <Route path="leaderboard" element={<Leaderboard lang={lang} />} />
        <Route path="profile" element={<Profile lang={lang} />} />
        <Route path="settings" element={<Settings lang={lang} />} />
        <Route path="spot/:id" element={<SpotDetail lang={lang} />} />
        <Route path="admin" element={<Admin />} />
      </Route>
    </Routes>
  );
}

export default App;
