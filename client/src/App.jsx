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
import ProtectedRoute from './components/ProtectedRoute';
import { useLocation } from 'react-router-dom';

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
        </Routes>
      </div>
    </>
  );
}

export default App;
