import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import API from '../backendApi/api'; // Adjust the import path as necessary
import 'bootstrap/dist/css/bootstrap.min.css';

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        address: '',
    });

    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await API.post('/auth/register', formData);
            setMessage('Registration successful!');
            setFormData({ username: '', email: '', password: '', address: '' });
            navigate('/login'); // Redirect to login page after successful registration
        } catch (err) {
            setMessage(err.response?.data?.message || 'Registration failed.');
        }
    };

    return (
        <div className="container mt-5" style={{ maxWidth: '500px' }}>
            <h2 className="text-center mb-4" style={{ color: 'var(--primary)' }}>Register</h2>
            {message && <div className="alert alert-info">{message}</div>}
            <form onSubmit={handleSubmit} style={{ background: 'var(--card)', padding: '2rem', borderRadius: 'var(--radius)', boxShadow: '0 0 10px rgba(0,0,0,0.1)' }}>
                <div className="mb-3">
                    <label className="form-label">Username</label>
                    <input
                        type="text"
                        className="form-control"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                        style={{ background: 'var(--input-background)' }}
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                        type="email"
                        className="form-control"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        style={{ background: 'var(--input-background)' }}
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Password</label>
                    <input
                        type="password"
                        className="form-control"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        style={{ background: 'var(--input-background)' }}
                    />
                </div>

                <div className="mb-4">
                    <label className="form-label">Location</label>
                    <input
                        type="text"
                        className="form-control"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        required
                        style={{ background: 'var(--input-background)' }}
                    />
                </div>

                <button type="submit" className="btn btn-dark w-100" style={{ background: 'var(--primary)' }}>
                    Register
                </button>
                <p className="text-center mt-3">
                    Already have an account? <a href="/login">Login</a>
                </p>
            </form>
        </div>
    );
};

export default Register;
