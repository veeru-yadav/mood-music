import React from "react";
import { useEffect, useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useMood } from '../context/MoodContext';
import { useLocation } from 'react-router-dom';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { mood } = useMood();



  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-3">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">Music Mood</Link>

        {/* Responsive Toggle Button */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
          aria-controls="navbarContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link " to="/">Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/library">Library</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/search">Search</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/profile">Profile</Link>
            </li>
            {user?.role === "admin" && (
              <li className="nav-item">
                <Link className="nav-link text-warning fw-bold" to="/admin">
                  Admin Actions
                </Link>
              </li>
            )}
          </ul>

          {mood && (
            <button
              onClick={() => navigate('/select-mood')}
              className="btn btn-outline-primary me-2 mb-2 mb-lg-0"
            >
              Mood: {mood.icon} {mood.name}
            </button>
          )}

          {user ? (
            <>
              <span className="text-light me-2">Welcome, {user.username}</span>
              <button className="btn btn-outline-light" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline-light me-2 mb-2 mb-lg-0">
                Login
              </Link>
              <Link to="/register" className="btn btn-outline-light mb-2 mb-lg-0">
                Register
              </Link>
            </>
          )}

        </div>
      </div>
    </nav>
  );
};

export default Navbar;
