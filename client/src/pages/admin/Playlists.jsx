// src/pages/admin/Playlists.jsx
import { useEffect, useState } from "react";
import API from "../../backendApi/api";
import { useAuth } from "../../context/AuthContext";

export default function Playlists() {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user } = useAuth();

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        setLoading(true);

        const token = user?.token || localStorage.getItem("token");

        const res = await API.get("/admin/playlists", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setPlaylists(res.data);
      } catch (err) {
        console.error("Error fetching playlists:", err);
        setError("Failed to load playlists. Please check admin privileges.");
      } finally {
        setLoading(false);
      }
    };

    fetchPlaylists();
  }, [user]);

  if (loading) return <p className="p-3">Loading playlists...</p>;
  if (error) return <p className="p-3 text-danger">{error}</p>;

  return (
    <div className="container mt-4">
      <h1 className="mb-4">All Playlists</h1>
      <table className="table table-bordered table-hover">
        <thead className="table-dark">
          <tr>
            <th>Playlist Name</th>
            <th>Created By</th>
            <th>Total Songs</th>
          </tr>
        </thead>
        <tbody>
          {playlists.map((p) => (
            <tr key={p._id}>
              <td>{p.name}</td>
              <td>{p.user?.username || "Unknown"}</td>
              <td>{p.musics?.length || 0}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
