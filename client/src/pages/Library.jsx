import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Playlists from "./Playlists";
import MusicList from "../components/MusicList";

export default function Library() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("playlists");
  const [likedSongs, setLikedSongs] = useState([]);
  const navigate = useNavigate();

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  // Update liked songs when user changes
  useEffect(() => {
    if (user?.likes) {
      setLikedSongs(user.likes);
    }
  }, [user]);

  if (!user) return null;



  return (
    <div className="library-container p-6  bg-gradient-to-b from-purple-800 to-purple-900 min-h-screen">
      <h1 className="text-3xl font-bold mb-2">Your Library</h1>
      <p className="text-gray-300 mb-6">
        Your personal collection of music, playlists, and favorites
      </p>

      {/* Tabs */}
      <div
        className="d-flex w-100 mb-4 rounded-pill p-1"
        style={{
          backdropFilter: "blur(10px)",
          background: "rgba(0, 191, 255, 0.1)"
        }}
      >
        <button
          className={`flex-fill btn rounded-pill border-0 ${activeTab === "playlists"
            ? "text-black fw-bold"
            : "text-black"}`}
          style={{
            background: activeTab === "playlists" ? "rgba(78, 164, 222, 0.2)" : "transparent",
            transition: "0.3s"
          }}
          onClick={() => setActiveTab("playlists")}
        >
          Playlists
        </button>

        <button
          className={`flex-fill btn rounded-pill border-0 ${activeTab === "liked"
            ? "text-black fw-bold"
            : "text-black"}`}
          style={{
            background: activeTab === "liked" ? "rgba(78, 164, 222, 0.2)" : "transparent",
            transition: "0.3s"
          }}
          onClick={() => setActiveTab("liked")}
        >
          Liked Songs
        </button>
      </div>


      {/* Content */}
      {activeTab === "playlists" && <Playlists />}
      {activeTab === "liked" && (
        <div className="liked-songs-card bg-purple-700 p-4 rounded cursor-pointer hover:bg-purple-600 transition">
          <h2 className="text-xl font-semibold">Liked Songs</h2>
          <p className="text-gray-300">View all your liked songs</p>
          <MusicList songIds={likedSongs} />
        </div>
      )}
    </div>
  );
}
