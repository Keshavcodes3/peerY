import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./Features/landing/LandingPage";
import Register from "./Features/Auth/Pages/Register";
import Login from "./Features/Auth/Pages/Login";
import DiscoverPage from "./Features/Discover/Pages/DiscoverPage";
import BuilderProfilePage from "./Features/Discover/Pages/BuilderProfilePage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/discover" element={<DiscoverPage />} />
        <Route path="/discover/:id" element={<BuilderProfilePage />} />
      </Routes>
    </Router>
  );
}

export default App;