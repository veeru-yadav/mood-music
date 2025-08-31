// src/pages/admin/AdminLayout.jsx
import { Outlet, Link } from "react-router-dom";

export default function AdminLayout() {
  return (
    <div className="d-flex min-vh-100 p-2 m-4 shadow-lg">
      {/* Sidebar */}
      <aside className="bg-dark text-white p-3" style={{ width: "250px" }}>
        <h2 className="h4 mb-4">Admin Panel</h2>
        <nav className="nav flex-column gap-2">
          <Link to="/admin/users" className="nav-link text-white bg-transparent rounded px-2 py-1 hover">
            All Users
          </Link>
          <Link to="/admin/playlists" className="nav-link text-white bg-transparent rounded px-2 py-1 hover">
            All Playlists
          </Link>
          <Link to="/admin/analysis" className="nav-link text-white bg-transparent rounded px-2 py-1 hover">
            Analysis
          </Link>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-grow-1 bg-light p-4">
        <Outlet /> {/* Nested routes will render here */}
      </main>
    </div>
  );
}
