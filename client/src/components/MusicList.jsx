import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import API from "../backendApi/api";
import { FaHeart, FaRegHeart, FaEllipsisV } from "react-icons/fa";
import Loading from "./Loading";

export default function MusicList({ songIds }) {
  const [songs, setSongs] = useState([]);
  const [isLiked, setIsLiked] = useState(songIds.map(id => ({ id, liked: true })));
  const [playlists, setPlaylists] = useState([]);
  const [showMenu, setShowMenu] = useState(null);
  const [loading, setLoading] = useState(true);

  const { user } = useAuth();
  const navigate = useNavigate();

  const token = user?.token;
  console.log(songIds, "songIds");

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  useEffect(() => {
    async function fetchSongs() {
      const songData = await Promise.all(
        songIds.map(async (id) => {
          const res = await axios.get(
            `https://discoveryprovider.audius.co/v1/tracks/${id}?app_name=myapp`
          );
          return res.data.data;

        })
      );
      setSongs(songData);
      setLoading(false);
    }
    fetchSongs();

    API.get("/playlists", config).then((res) => {
      setPlaylists(res.data);
    });
  }, [songIds]);

  const toggleLike = async (id, isLiked) => {
    if (isLiked) {
      await API.post(`/users/unlike/${id}`, {}, config);
    } else {
      await API.post(`/users/like/${id}`, {}, config);
    }

    setIsLiked(prev =>
      prev.map(s =>
        s.id === id ? { ...s, liked: !s.liked } : s
      )
    );

  };


  const addToPlaylist = async (playlistId, songId) => {
    const existingPlaylist = playlists.find(p => p._id === playlistId);
    if (!existingPlaylist) return;
    await API.put(`/playlists/${playlistId}/add`, { musicId: songId }, config);
    setShowMenu(null);
  };

  const createPlaylist = async (songId) => {
    const name = prompt("Enter playlist name:");
    if (name) {
      const res = await API.post(
        "/playlists",
        { name, musicIds: [songId] },
        config
      );
      await addToPlaylist(res.data._id, songId);
    }
  };
  
  if (loading) return <Loading />;

  return (
    <div className="list-group">
      {songs.map((song) => (
        <div
          key={song.id}
          className="list-group-item d-flex align-items-center"
          style={{ cursor: "pointer" }}
          onClick={() =>
            navigate("/music-player", {
              state: { songs, startId: song.id },
            })
          }
        >
          {/* Song Image */}
          <img
            src={song.artwork?.["150x150"]}
            alt={song.title}
            className="rounded me-3"
            style={{ width: 50, height: 50, objectFit: "cover" }}
          />

          {/* Song Title */}
          <div className="flex-grow-1">{song.title}</div>

          {/* Like Button */}
          <div
            onClick={(e) => {
              e.stopPropagation();
              toggleLike(song.id, isLiked.find(item => item.id === song.id)?.liked);
            }}
            className="me-3"
            style={{ fontSize: "1.2rem" }}
          >
            {isLiked.find(item => item.id === song.id)?.liked ? <FaHeart color="red" /> : <FaRegHeart />}
          </div>

          {/* Menu Toggle */}
          <div
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(showMenu === song.id ? null : song.id);
            }}
            style={{ fontSize: "1.2rem" }}
          >
            <FaEllipsisV />
          </div>

          {/* Dropdown Menu */}
          {showMenu === song.id && (
            <div
              className="position-absolute bg-white border rounded shadow-sm p-2"
              style={{ top: "100%", right: "10px", zIndex: 100 }}
              onClick={(e) => e.stopPropagation()}
            >
              {playlists.map((p) => (
                <div
                  key={p._id}
                  className="dropdown-item"
                  onClick={() => addToPlaylist(p._id, song.id)}
                  style={{ cursor: "pointer" }}
                >
                  {p.name}
                </div>
              ))}
              <div
                className="dropdown-item text-primary"
                style={{ cursor: "pointer" }}
                onClick={() => createPlaylist(song.id)}
              >
                + Create New Playlist
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
