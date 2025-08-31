import React, { useState, useRef, useEffect } from "react";
import { FaPlay, FaPause, FaStepForward, FaStepBackward } from "react-icons/fa";

const SongsPlayer = ({ songs }) => {
    // State to track current song index
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);


    const audioRef = useRef(null);

    // Get streamable MP3 URL for a track id
    const getStreamUrl = async (trackId) => {
        const res = await fetch(
            `https://discoveryprovider.audius.co/v1/tracks/${trackId}/stream?app_name=myapp`
        );
        return res.url; // redirected MP3 URL
    };

    // On currentIndex change, load new song and play if was playing
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



    if (!songs || songs.length === 0) return <div>No songs found</div>;

    const currentSong = songs[currentIndex];


    return (
        <div style={{ maxWidth: 600, margin: "auto", fontFamily: "Arial, sans-serif" }}>
            {/* Top big div: Current playing song */}
            <div
                style={{
                    border: "1px solid #ccc",
                    padding: 20,
                    marginBottom: 20,
                    borderRadius: 10,
                    textAlign: "center",
                }}
            >
                <img
                    src={currentSong.artwork["480x480"]}
                    alt={currentSong.title}
                    style={{ width: 200, height: 200, objectFit: "cover", borderRadius: 10 }}
                />
                <h2>{currentSong.title}</h2>
                <h4>by {currentSong.user.name}</h4>

                <audio ref={audioRef} preload="metadata" />




                <div className="mt-2">
                    <div className="d-flex justify-content-between align-items-center  p-2">
                        <span>{formatTime(progress)}</span>
                        <div style={{ margin: 5 }}>
                            <FaStepBackward size={25} style={{ margin: 5 }} onClick={prevSong} />
                            {isPlaying ? (
                                <FaPause size={25} onClick={togglePlayPause} />
                            ) : (
                                <FaPlay size={25} onClick={togglePlayPause} />
                            )}
                            <FaStepForward size={25} style={{ margin: 5 }} onClick={nextSong} />
                        </div>
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
                        style={{ width: "100%", marginTop: 5 }}
                    />
                </div>
            </div>

            {/* Bottom list of songs */}
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
                        <img
                            src={song.artwork["150x150"]}
                            alt={song.title}
                            style={{ width: 50, height: 50, borderRadius: 6, marginRight: 10 }}
                        />
                        <div>
                            <div style={{ fontWeight: "bold" }}>{song.title}</div>
                            <div style={{ fontSize: 12, color: "#666" }}>{song.user.name}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SongsPlayer;
