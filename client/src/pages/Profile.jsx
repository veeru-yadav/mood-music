import React, { useState } from 'react';
import API from '../backendApi/api';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Profile = () => {
  const { user, logout } = useAuth();

  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    address: user?.address || '',
    password: '' // new password, if provided
  });

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = user?.token || localStorage.getItem('token');

      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      };

      // Send data, including password only if it’s entered
      const { username, email, address, password } = formData;

      const payload = { username, email, address };
      if (password) payload.password = password;

      const res = await API.put('/users/profile', payload, config);

      // Update user in localStorage and AuthContext
      const updatedUser = res.data;
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setFormData({
        username: updatedUser.username,
        email: updatedUser.email,
        address: updatedUser.address,
        password: ''
      });

      setMessage('Profile updated successfully.');
      setError('');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Update failed');
      setMessage('');
    }
  };

  if (!user) {
    return (
      <div className="text-center mt-5 text-secondary">
        Loading user data...
      </div>
    );
  }

  return (
    <div className="container mt-5" style={{ maxWidth: '600px' }}>
      <h3 className="mb-4">User Profile</h3>

      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Username</label>
          <input
            type="text"
            name="username"
            className="form-control"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            name="email"
            className="form-control"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Address</label>
          <input
            type="text"
            name="address"
            className="form-control"
            value={formData.address}
            onChange={handleChange}
          />
        </div>

        <div className="mb-4">
          <label className="form-label">New Password (optional)</label>
          <input
            type="password"
            name="password"
            className="form-control"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter new password if you want to change it"
          />
        </div>

        <div className="d-flex justify-content-between">
          <button type="submit" className="btn btn-primary">
            Save Changes
          </button>
          <button type="button" className="btn btn-danger" onClick={logout}>
            Logout
          </button>
        </div>
      </form>
    </div>
  );
};

export default Profile;
