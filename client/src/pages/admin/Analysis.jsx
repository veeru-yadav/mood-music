// src/pages/admin/Analysis.jsx
import { useEffect, useState } from "react";
import API from "../../backendApi/api";
import { useAuth } from "../../context/AuthContext";

export default function Analysis() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user } = useAuth();

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        setLoading(true);

        const token = user?.token || localStorage.getItem("token");

        const res = await API.get("/admin/analysis", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setStats(res.data);
      } catch (err) {
        console.error("Error fetching analysis:", err);
        setError("Failed to load analysis. Please check admin privileges.");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysis();
  }, [user]);

  if (loading) return <p className="p-3">Loading analysis...</p>;
  if (error) return <p className="p-3 text-danger">{error}</p>;

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Platform Analysis</h1>

      <div className="row">
        <div className="col-md-6 mb-3">
          <div className="card text-white bg-primary">
            <div className="card-body">
              <h5 className="card-title">Total Users</h5>
              <p className="card-text fs-4">{stats.userCount}</p>
            </div>
          </div>
        </div>

        <div className="col-md-6 mb-3">
          <div className="card text-white bg-success">
            <div className="card-body">
              <h5 className="card-title">Total Playlists</h5>
              <p className="card-text fs-4">{stats.playlistCount}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
