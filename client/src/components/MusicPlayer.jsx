import React, { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import CloseButton from "./CloseButton";
import { FaPlay, FaPause, FaStepForward, FaStepBackward } from "react-icons/fa";

export default function SongsPlayer() {
  const location = useLocation();
  const { songs = [], startId } = location.state || {};

  const audioRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(
    songs.findIndex((s) => s.id === startId) || 0
  );
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  const currentSong = songs[currentIndex] || {};

  // Fetch MP3 stream URL (if needed)
  const getStreamUrl = async (trackId) => {
    const res = await fetch(
      `https://discoveryprovider.audius.co/v1/tracks/${trackId}/stream?app_name=myapp`
    );
    return res.url;
  };

  // Play specific track by index
  const playTrack = async (index) => {
    if (!songs[index]) return;
    setCurrentIndex(index);

    let streamUrl = songs[index].audioUrl || null;
    if (!streamUrl) {
      streamUrl = await getStreamUrl(songs[index].id);
    }

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = streamUrl;
      audioRef.current.load();
      await audioRef.current.play();
      setIsPlaying(true);
    }
  };

  // Load and play the startId song on mount
  useEffect(() => {
    if (songs.length) {
      playTrack(currentIndex);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Audio event listeners
  useEffect(() => {
    if (!audioRef.current) return;
    const audioEl = audioRef.current;

    const onLoadedMetadata = () => setDuration(audioEl.duration || 0);
    const onTimeUpdate = () => setProgress(audioEl.currentTime || 0);
    const onEnded = () => {
      if (currentIndex + 1 < songs.length) {
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
    if (currentIndex + 1 < songs.length) {
      playTrack(currentIndex + 1);
    }
  };

  const prevSong = () => {
    if (currentIndex > 0) {
      playTrack(currentIndex - 1);
    }
  };

  const formatTime = (time) => {
    if (isNaN(time)) return "0:00";
    const mins = Math.floor(time / 60);
    const secs = String(Math.floor(time % 60)).padStart(2, "0");
    return `${mins}:${secs}`;
  };

  if (!songs.length) {
    return <div style={{ textAlign: "center", padding: 20 }}>No songs found</div>;
  }

  return (
    <div style={{ maxWidth: 600, margin: "auto", fontFamily: "Arial, sans-serif" }}>
      {/* Current song display */}
      <div
        style={{
          border: "1px solid #ccc",
          padding: 20,
          marginBottom: 20,
          borderRadius: 10,
          textAlign: "center",
        }}
      >
        <div className="d-flex justify-content-end mb-3">
          <CloseButton />
        </div>
        {currentSong.artwork && (
          <img
            src={currentSong.artwork["480x480"]}
            alt={currentSong.title}
            style={{ width: 200, height: 200, objectFit: "cover", borderRadius: 10 }}
          />
        )}
        <h2>{currentSong.title}</h2>
        <h4>{currentSong.user?.name && `by ${currentSong.user.name}`}</h4>

        <audio ref={audioRef} preload="metadata" />

        <div className="mt-2">
          <div className="d-flex justify-content-between align-items-center p-2">
            <span>{formatTime(progress)}</span>
            <div style={{ margin: 5 }}>
              <FaStepBackward size={25} style={{ margin: 5, cursor: "pointer" }} onClick={prevSong} />
              {isPlaying ? (
                <FaPause size={25} style={{ cursor: "pointer" }} onClick={togglePlayPause} />
              ) : (
                <FaPlay size={25} style={{ cursor: "pointer" }} onClick={togglePlayPause} />
              )}
              <FaStepForward size={25} style={{ margin: 5, cursor: "pointer" }} onClick={nextSong} />
            </div>
            <span>{formatTime(duration)}</span>
          </div>
          <input
            type="range"
            min={0}
            max={duration || 0}
            value={progress}
            onChange={(e) => {
              const seekTime = Number(e.target.value);
              if (audioRef.current) {
                audioRef.current.currentTime = seekTime;
              }
              setProgress(seekTime);
            }}
            style={{ width: "100%", marginTop: 5 }}
          />
        </div>
      </div>

      {/* Song list */}
      <div
        style={{
          maxHeight: 300,
          overflowY: "auto",
          border: "1px solid #ddd",
          borderRadius: 10,
          padding: 10,
        }}
      >
        {songs.map((song, index) => (
          <div
            key={song.id}
            onClick={() => playTrack(index)}
            style={{
              display: "flex",
              alignItems: "center",
              padding: "8px 10px",
              cursor: "pointer",
              backgroundColor: index === currentIndex ? "#f0f0f0" : "transparent",
              borderRadius: 6,
              marginBottom: 5,
            }}
          >
            {song.artwork && (
              <img
                src={song.artwork["150x150"]}
                alt={song.title}
                style={{ width: 50, height: 50, borderRadius: 6, marginRight: 10 }}
              />
            )}
            <div>
              <div style={{ fontWeight: "bold" }}>{song.title}</div>
              <div style={{ fontSize: 12, color: "#666" }}>{song.user?.name}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
