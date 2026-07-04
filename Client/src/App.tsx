import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./Features/landing/LandingPage";
import Register from "./Features/Auth/Pages/Register";
import Login from "./Features/Auth/Pages/Login";
import DiscoverPage from "./Features/Discover/Pages/DiscoverPage";
import BuilderProfilePage from "./Features/Discover/Pages/BuilderProfilePage";
import Dashboard from "./Features/Dashboard/Pages/Dashboard";
import ProtectedRoute from "./Features/Auth/Components/ProtectedRoute";
import { useAuth } from "./Features/Auth/Hooks/useAuth";

function App() {
  const { initializeAuth } = useAuth();

  // Restore the session (getMe) once on app boot.
  useEffect(() => {
    initializeAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Router>
      <Routes>
        {/* Public */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* Protected */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/discover" element={<DiscoverPage />} />
          <Route path="/discover/:id" element={<BuilderProfilePage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
