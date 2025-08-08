import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Playlists from './Playlists';

const Library = () => {
  const { user } = useAuth();
  const [likedSongs, setLikedSongs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLikedSongs = async () => {
      try {
        const res = await axios.post(`http://localhost:5000/api/users/like/${user._id}`);
        setLikedSongs(res.data);
      } catch (err) {
        console.error('Error fetching liked songs:', err);
      }
    };

    if (user?._id) fetchLikedSongs();
  }, [user]);

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Your Library</h2>

      {/* Liked Songs Section */}
      <h4>Liked Songs</h4>
      <div className="row">
        {likedSongs.length === 0 ? (
          <p className="text-muted">You haven’t liked any songs yet.</p>
        ) : (
          likedSongs.map((track) => (
            <div key={track._id} className="col-md-4 mb-4">
              <div className="card h-100">
                <div className="card-body">
                  <h5 className="card-title">{track.title}</h5>
                  <p className="card-text">Artist: {track.artist}</p>
                  <p className="card-text">Mood: {track.mood.join(', ')}</p>
                  <p className="card-text">Climate: {track.climate.join(', ')}</p>
                  <audio controls className="w-100">
                    <source src={`http://localhost:5000/${track.fileUrl}`} type="audio/mpeg" />
                    Your browser does not support the audio element.
                  </audio>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Playlist Section */}
      <hr />
      <Playlists />
    </div>
  );
};

export default Library;

