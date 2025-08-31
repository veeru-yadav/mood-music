import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

// Pages
import Register from "./pages/Register";
import Login from "./pages/Login";
import SelectMood from "./pages/SelectMood";
import Home from "./pages/Home";
import Library from "./pages/Library";
import Profile from "./pages/Profile";
import Navbar from "./components/Navbar";
import Search from "./pages/Search";
import MusicList from "./components/MusicList";
import MusicPlayer from "./components/MusicPlayer";
import ProtectedRoute from './components/ProtectedRoute';
import { useLocation } from 'react-router-dom';

import AdminLayout from "./pages/admin/AdminLayout";
import Users from "./pages/admin/Users";
import Playlists from "./pages/admin/Playlists";
import Analysis from "./pages/admin/Analysis";
import Dashboard from "./pages/admin/Dashboard";

function App() {
  const location = useLocation();
  const hideNavbarPaths = ['/login', '/register'];

  const shouldHideNavbar = hideNavbarPaths.includes(location.pathname);

  return (
    <>
      {!shouldHideNavbar && <Navbar />}

      <div className="container mt-4">
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/select-mood" element={<ProtectedRoute><SelectMood /></ProtectedRoute>} />
          <Route path="/" element={<Home />} />
          <Route path="/library" element={<ProtectedRoute><Library /></ProtectedRoute>} />
          <Route path="/search" element={<ProtectedRoute><Search /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/music-list" element={<ProtectedRoute><MusicList /></ProtectedRoute>} />
          <Route path="/music-player" element={<ProtectedRoute><MusicPlayer /></ProtectedRoute>} />

          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="users" element={<Users />} />
            <Route path="playlists" element={<Playlists />} />
            <Route path="analysis" element={<Analysis />} />
          </Route>

        </Routes>
      </div>
    </>
  );
}

export default App;
