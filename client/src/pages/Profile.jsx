import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import CloseButton from "../components/CloseButton";
import axios from "axios";

const Profile = () => {
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    name: user?.username || "",
    email: user?.email || "",
    address: user?.address || "",
    password: ""
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const token = user?.token || localStorage.getItem("token");

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      };

      const payload = {
        username: formData.name,
        email: formData.email,
        address: formData.address
      };
      if (formData.password) payload.password = formData.password;

      await axios.put("http://localhost:5000/api/users/profile", payload, config);

      setMessage("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      setMessage("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <div className="text-center mt-5 text-muted">Loading user data...</div>;
  }

  return (
    <div className="container py-2 shadow-lg">
      <div className="d-flex justify-content-end mb-3">
        <CloseButton />
      </div>
      {/* Profile Header */}
      <div className="card border-0 shadow p-4 text-center mb-4">
        <div
          className="rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3 shadow"
          style={{
            width: "100px",
            height: "100px",
            background: "#dee2e6",
            fontSize: "2.5rem",
            fontWeight: "bold",
            color: "#495057"
          }}
        >
          {user.username?.charAt(0).toUpperCase()}
        </div>
        <h2 className="fw-bold mb-1">{user.username}</h2>
        <p className="text-muted mb-0">{user.email}</p>
      </div>

      {/* Editable Settings */}
      <div className="card border-0 shadow-sm p-2">
        <h4 className="mb-3">Edit Profile</h4>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Name</label>
            <input
              type="text"
              name="name"
              className="form-control"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
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
              placeholder="Enter your email"
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
              placeholder="Enter your address"
            />
          </div>

          <div className="mb-3">
            <label className="form-label">New Password</label>
            <input
              type="password"
              name="password"
              className="form-control"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter new password"
            />
          </div>

          {message && (
            <div
              className={`alert ${message.includes("successfully") ? "alert-success" : "alert-danger"
                }`}
            >
              {message}
            </div>
          )}

          <button type="submit" className="btn btn-primary w-100" disabled={loading}>
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
