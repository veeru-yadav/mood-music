import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Playlists = () => {
    const { user } = useAuth();
    const [playlists, setPlaylists] = useState([]);
    const [newName, setNewName] = useState('');

    const token = user?.token || localStorage.getItem('token');

    // Fetch playlists
    useEffect(() => {
        const fetchPlaylists = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/playlists', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setPlaylists(res.data);
                console.log('Fetched playlists:', res.data);
            } catch (err) {
                console.error('Error fetching playlists:', err);
            }
        };

        if (token) fetchPlaylists();
    }, [token]);

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
            const res = await axios.post(
                'http://localhost:5000/api/playlists',
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
            await axios.delete(`http://localhost:5000/api/playlists/${playlistId}`, {
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
                            <div className="card h-100">
                                <div className="card-body">
                                    <h5 className="card-title">{playlist.name}</h5>
                                    <p className="card-text">{playlist.musics?.length || 0} songs</p>
                                    <button
                                        className="btn btn-danger"
                                        onClick={() => handleDelete(playlist._id)}
                                    >
                                        Delete Playlist
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
