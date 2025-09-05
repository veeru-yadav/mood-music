import React, { useEffect, useState, useRef } from "react";
import { useMood } from "../context/MoodContext";
import { useAuth } from "../context/AuthContext";
import Loading from "../components/Loading";
import API from "../backendApi/api";
import { FaHeart, FaRegHeart, FaEllipsisV } from "react-icons/fa";

const Home = () => {
  const { mood, climate } = useMood();
  const { user } = useAuth();
  const token = user?.token;

  const [songs, setSongs] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const [currentIndex, setCurrentIndex] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [likedSongs, setLikedSongs] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [showMenu, setShowMenu] = useState(null);

  const audioRef = useRef(null);

  // Get streamable MP3 URL for a track id
  const getStreamUrl = async (trackId) => {
    const res = await fetch(
      `https://discoveryprovider.audius.co/v1/tracks/${trackId}/stream?app_name=myapp`
    );
    return res.url; // redirected MP3 URL
  };


  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  useEffect(() => {
    setLikedSongs(user?.likes || []);
  }, [user]);

  // Fetch songs on mood/climate/token change
  useEffect(() => {
    if (!token) {
      setError("You must be logged in to view songs");
      setLoading(false);
      return;
    }
    if (!mood || !climate) {
      setError("Mood or climate is missing");
      setLoading(false);
      return;
    }

    const fetchSongs = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `https://discoveryprovider.audius.co/v1/tracks/search?query=${encodeURIComponent(
            mood.name + " " + climate
          )}&app_name=myapp`
        );
        const data = await res.json();

        if (data.data && data.data.length > 0) {
          setSongs(data.data);
          setError("");
        } else {
          setError("No songs found for this mood.");
          setSongs([]);
        }
      } catch (err) {
        console.error("Error fetching Audius tracks:", err);
        setError("Failed to fetch songs from Audius.");
        setSongs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSongs();

    API.get("/playlists", config).then((res) => {
      setPlaylists(res.data);
    });

  }, [mood, climate, token]);

  // Like toggle in UI only
  const toggleLike = (songId) => {
    setLikedSongs((prev) =>
      prev.includes(songId) ? prev.filter((id) => id !== songId) : [...prev, songId]
    );
  };

  // Like button handler with backend API call
  const handleLike = async (songId) => {
    try {
      const token = user?.token || localStorage.getItem("token");

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      // Send to backend
      if (likedSongs.includes(songId)) {
        console.log("Sending unlike request for song:", songId);
        const res = await API.post(`/users/unlike/${songId}`, {}, config);
      } else {
        console.log("Sending like request for song:", songId);
        const res = await API.post(`/users/like/${songId}`, {}, config);
      }

      // Optionally, you can update UI instantly here or rely on toggleLike
      console.log("Liked successfully:", res.data);
    } catch (err) {
      console.error("Error liking song:", err);
    }
  };

  // Play the song at given index
  const playTrack = async (index) => {
    if (!songs[index]) return;

    setCurrentIndex(index);

    const streamUrl = await getStreamUrl(songs[index].id);

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = streamUrl;
      audioRef.current.load();
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  // Audio event handlers
  useEffect(() => {
    if (!audioRef.current) return;

    const audioEl = audioRef.current;

    const onLoadedMetadata = () => setDuration(audioEl.duration);
    const onTimeUpdate = () => setProgress(audioEl.currentTime);
    const onEnded = () => {
      if (currentIndex !== null && currentIndex + 1 < songs.length) {
        playTrack(currentIndex + 1);
      } else {
        setIsPlaying(false);
      }
    };

    audioEl.addEventListener("loadedmetadata", onLoadedMetadata);
    audioEl.addEventListener("timeupdate", onTimeUpdate);
    audioEl.addEventListener("ended", onEnded);

    return () => {
      audioEl.removeEventListener("loadedmetadata", onLoadedMetadata);
      audioEl.removeEventListener("timeupdate", onTimeUpdate);
      audioEl.removeEventListener("ended", onEnded);
    };
  }, [currentIndex, songs]);

  const togglePlayPause = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const nextSong = () => {
    if (currentIndex !== null && currentIndex + 1 < songs.length) {
      playTrack(currentIndex + 1);
    }
  };

  const prevSong = () => {
    if (currentIndex !== null && currentIndex > 0) {
      playTrack(currentIndex - 1);
    }
  };

  const formatTime = (time) => {
    if (isNaN(time)) return "0:00";
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60)
      .toString()
      .padStart(2, "0");
    return `${mins}:${secs}`;
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

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-primary">🎵 Perfect for your mood</h2>
        {songs.length > 0 && (
          <button className="btn btn-success" onClick={() => playTrack(0)}>
            ▶ Play All
          </button>
        )}
      </div>

      <h5 className="text-muted mb-4">
        {mood?.name} mood · {climate} weather
      </h5>

      {loading ? (
        <Loading />
      ) : error ? (
        <p className="text-danger">{error}</p>
      ) : songs.length > 0 ? (
        <div className="d-flex flex-column align-items-center">
          {songs.map((song, idx) => {
            const isCurrent = idx === currentIndex;
            const isLiked = likedSongs.includes(song.id);
            return (
              <div
                key={song.id}
                onClick={() => playTrack(idx)}
                className={`song-row d-flex align-items-center shadow p-2 mb-2 rounded ${isCurrent ? "bg-darkprimary border-primary" : "bg-white"
                  }`}
                style={{
                  width: "80%",
                  cursor: "pointer",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                  position: "relative",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "scale(1.03)";
                  e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.15)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                  e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)";
                }}
              >
                <img
                  src={song.artwork?.["150x150"] || "https://via.placeholder.com/50"}
                  alt="art"
                  className="rounded me-3"
                  style={{ width: "50px", height: "50px", objectFit: "cover" }}
                />

                <div className="flex-grow-1">
                  <div className="fw-bold">{song.title}</div>
                  <small className="text-muted">{song.user.name}</small>
                </div>

                {isCurrent && isPlaying ? (
                  <div className="me-3">
                    <div className="equalizer">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                ) : null}

                <div className="me-3" style={{ width: "50px", textAlign: "right" }}>
                  {isCurrent ? formatTime(progress) : formatTime(song.duration || 0)}
                </div>

                <button
                  className="btn btn-link p-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleLike(song.id);
                    handleLike(song.id);
                  }}
                >
                  <i
                    className={`bi bi-heart${isLiked ? "-fill text-danger" : ""}`}
                    style={{ fontSize: "1.2rem" }}
                  ></i>
                </button>

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
            );
          })}
        </div>
      ) : (
        <p>No songs found for the selected mood and climate.</p>
      )}

      {/* Single audio element controlled via ref */}
      <audio ref={audioRef} preload="metadata" />

      {/* Bottom Player */}
      {currentIndex !== null && (
        <div
          className="fixed-bottom bg-dark text-white p-3"
          style={{ boxShadow: "0 -2px 6px rgba(0,0,0,0.3)" }}
        >
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <strong>{songs[currentIndex]?.title}</strong>
              <div className="small text-muted">{songs[currentIndex]?.user.name}</div>
            </div>
            <div>
              <button className="btn btn-light btn-sm me-2" onClick={prevSong}>
                ⏮️
              </button>
              <button className="btn btn-light btn-sm me-2" onClick={togglePlayPause}>
                {isPlaying ? "⏸" : "▶"}
              </button>
              <button className="btn btn-light btn-sm" onClick={nextSong}>
                ⏭️
              </button>
            </div>
          </div>

          <div className="mt-2">
            <div className="d-flex justify-content-between small">
              <span>{formatTime(progress)}</span>
              <span>{formatTime(duration)}</span>
            </div>
            <input
              type="range"
              min={0}
              max={duration || 0}
              value={progress}
              onChange={(e) => {
                const seekTime = e.target.value;
                if (audioRef.current) {
                  audioRef.current.currentTime = seekTime;
                }
                setProgress(seekTime);
              }}
              style={{ width: "100%", marginTop: 15 }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
