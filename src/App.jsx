import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home';
import Profile from './pages/Profile';
import AddSpot from './pages/AddSpot';
import MapScreen from './pages/MapScreen';
import Leaderboard from './pages/Leaderboard';
import Admin from './pages/Admin';
import MainLayout from './layouts/MainLayout';
import { useAuth } from './context/AuthContext';

// Protected Route Wrapper
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  // if (!user) return <Navigate to="/login" replace />;
  return children;
};

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/en/home" replace />} />
      <Route path="/login" element={<Login />} />

      {/* English Routes */}
      <Route path="/en/*" element={<AppRoutes lang="en" />} />

      {/* Malayalam Routes */}
      <Route path="/ml/*" element={<AppRoutes lang="ml" />} />
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
        <Route path="leaderboard" element={<Leaderboard lang={lang} />} />
        <Route path="profile" element={<Profile lang={lang} />} />
        <Route path="admin" element={<Admin />} />
      </Route>
    </Routes>
  );
}

export default App;
