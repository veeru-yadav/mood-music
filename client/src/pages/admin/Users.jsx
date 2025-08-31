// src/pages/admin/Users.jsx
import { useEffect, useState } from "react";
import API from "../../backendApi/api";
import { useAuth } from "../../context/AuthContext";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user } = useAuth();

  useEffect(() => {
    fetchUsers();
  }, [user]);

  const fetchUsers = async () => {
    try {
      setLoading(true);

      const token = user?.token || localStorage.getItem("token");

      const res = await API.get("/admin/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUsers(res.data);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("Failed to load users. Please check admin privileges.");
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      const token = user?.token || localStorage.getItem("token");

      await API.delete(`/admin/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Update state after deletion
      setUsers(users.filter((u) => u._id !== userId));
    } catch (err) {
      console.error("Error deleting user:", err);
      alert("Failed to delete user. Try again.");
    }
  };

  if (loading) return <p className="p-3">Loading users...</p>;
  if (error) return <p className="p-3 text-danger">{error}</p>;

  return (
    <div className="container mt-4">
      <h1 className="mb-4">All Users</h1>
      <table className="table table-bordered table-hover">
        <thead className="table-dark">
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u._id}>
              <td>{u.username}</td>
              <td>{u.email}</td>
              <td>{u.role}</td>
              <td>
                <button
                  onClick={() => deleteUser(u._id)}
                  className="btn btn-danger btn-sm"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
