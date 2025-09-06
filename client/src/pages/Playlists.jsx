import React, { useEffect, useState, useContext } from 'react';

import API from '../backendApi/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from "react-router-dom";

const Playlists = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [playlists, setPlaylists] = useState([]);
    const [newName, setNewName] = useState('');


    const token = user?.token || localStorage.getItem('token');

    // Fetch playlists
    useEffect(() => {
        const fetchPlaylists = async () => {
            try {
                const res = await API.get('/playlists', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setPlaylists(res.data);
            } catch (err) {
                console.error('Error fetching playlists:', err);
            }
        };

        if (token) fetchPlaylists();
    }, [token]);

    useEffect(() => {
        console.log("Playlist count changed");
    }, [playlists.length]);


    // Handle playlist click
    const handlePlaylistClick = async (playlist) => {
        if (!playlist.musics || playlist.musics.length === 0) {
            alert("This playlist has no songs!");
            return;
        }
        console.log("Loading playlist songs:", playlist.musics);

        try {
            // Fetch all tracks in parallel
            const songs = await Promise.all(
                playlist.musics.map(async (id) => {
                    const res = await fetch(
                        `https://discoveryprovider.audius.co/v1/tracks/${id}?app_name=myapp`
                    );
                    if (!res.ok) throw new Error(`Failed to fetch track ${id}`);
                    const data = await res.json();
                    console.log(data);
                    console.log(data.data);
                    return data.data; // Audius API returns track inside data[0]

                })
            );

            // Filter out any failed/null tracks
            const validSongs = songs.filter((song) => song && song.id);

            if (validSongs.length === 0) {
                alert("No valid songs found in this playlist.");
                return;
            }

            // Navigate to music player with the fetched songs
            navigate("/music-player", {
                state: {
                    songs: validSongs,
                    startId: validSongs[0].id, // First song
                },
            });
        } catch (error) {
            console.error("Error loading playlist songs:", error);
            alert("Failed to load songs for this playlist.");
        }
    };


    // Create new playlist
    const handleCreatePlaylist = async () => {
        if (!newName.trim()) return;
        if (!token) {
            console.error('No token found');
            return;
        }

        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            }
        };

        try {
            const res = await API.post(
                '/playlists',
                { name: newName },
                config
            );
            setPlaylists([...playlists, res.data]);
            setNewName('');
        } catch (err) {
            console.error('Error creating playlist:', err.response?.data || err.message);
        }
    };

    // Delete playlist
    const handleDelete = async (playlistId) => {
        try {
            await API.delete(`/playlists/${playlistId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setPlaylists(playlists.filter((p) => p._id !== playlistId));
        } catch (err) {
            console.error('Error deleting playlist:', err);
        }
    };

    return (
        <div>
            <h4>Your Playlists</h4>

            {/* Create playlist */}
            <div className="mb-3 d-flex">
                <input
                    type="text"
                    className="form-control me-2"
                    placeholder="New Playlist Name"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                />
                <button className="btn btn-primary" onClick={handleCreatePlaylist}>
                    Create
                </button>
            </div>

            {/* List of playlists */}
            {playlists.length === 0 ? (
                <p className="text-muted">No playlists created yet.</p>
            ) : (
                <div className="row">
                    {playlists.map((playlist) => (
                        <div key={playlist._id} className="col-md-4 mb-4">
                            <div
                                className="card h-100 shadow border-0"
                                style={{
                                    cursor: "pointer",
                                    borderRadius: "15px",
                                    transition: "transform 0.2s ease, box-shadow 0.2s ease",
                                }}
                                onClick={() => handlePlaylistClick(playlist)}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = "scale(1.03)";
                                    e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.15)";
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = "scale(1)";
                                    e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)";
                                }}
                            >
                                {/* Optional image or icon for playlist */}
                                <div
                                    className="card-img-top d-flex align-items-center justify-content-center bg-primary text-white"
                                    style={{
                                        height: "150px",
                                        borderTopLeftRadius: "15px",
                                        borderTopRightRadius: "15px",
                                        fontSize: "2rem",
                                        fontWeight: "bold",
                                    }}
                                >
                                    🎵
                                </div>

                                <div className="card-body text-center">
                                    <h5 className="card-title fw-bold">{playlist.name}</h5>
                                    <p className="card-text text-muted">
                                        {playlist.musics?.length || 0} songs
                                    </p>
                                    <button
                                        className="btn btn-outline-danger btn-sm"
                                        onClick={(e) => {
                                            e.stopPropagation(); // Prevent card click
                                            handleDelete(playlist._id);
                                        }}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

            )}
        </div>
    );
};

export default Playlists;
