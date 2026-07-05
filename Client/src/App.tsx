import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./Features/landing/LandingPage";
import Register from "./Features/Auth/Pages/Register";
import Login from "./Features/Auth/Pages/Login";
import DiscoverPage from "./Features/Discover/Pages/DiscoverPage";
import BuilderProfilePage from "./Features/Discover/Pages/BuilderProfilePage";
import Dashboard from "./Features/Dashboard/Pages/Dashboard";
import ProjectsPage from "./Features/Projects/Pages/ProjectsPage";
import MyApplicationsPage from "./Features/Projects/Pages/MyApplicationsPage";
import NetworkPage from "./Features/Network/Pages/NetworkPage";
import MessagesPage from "./Features/Messages/Pages/MessagesPage";
import BookmarksPage from "./Features/Bookmarks/Pages/BookmarksPage";
import ProjectWorkspace from "./Features/Projects/Pages/ProjectWorkspace";
import ProfileSettingsPage from "./Features/Auth/Pages/ProfileSettingsPage";
import ProtectedRoute from "./Features/Auth/Components/ProtectedRoute";
import AppLayout from "./App/AppLayout";
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

        {/* Protected — all inside AppLayout (sidebar) */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/discover" element={<DiscoverPage />} />
            <Route path="/discover/:id" element={<BuilderProfilePage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/my-applications" element={<MyApplicationsPage />} />
            <Route path="/project/:projectId/workspace" element={<ProjectWorkspace />} />
            <Route path="/profile" element={<ProfileSettingsPage />} />
            <Route path="/network" element={<NetworkPage />} />
            <Route path="/messages" element={<MessagesPage />} />
            <Route path="/bookmarks" element={<BookmarksPage />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
