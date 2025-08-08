import React, { useEffect, useState } from 'react';
import API from '../backendApi/api';
import { Card, CardBody } from 'react-bootstrap';
import { useMood } from '../context/MoodContext';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { mood, climate } = useMood();
  const { user } = useAuth();
  const token = user?.token;

  const [songs, setSongs] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true); // ✅ loading state

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
        const endpoint =
          mood.name === 'All'
            ? '/music'
            : `/music/suggest?mood=${mood.name.toLowerCase()}&climate=${climate.toLowerCase()}`;

        const res = await API.get(endpoint, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setSongs(res.data);
        setError('');
      } catch (err) {
        console.error("Error fetching songs:", err);
        setError("Failed to fetch songs.");
      } finally {
        setLoading(false);
      }
    };

    fetchSongs();
  }, [mood, climate, token]);

  return (
    <div className="container py-4">
      <h2 className="mb-4 text-primary">
        Suggested Songs for {mood?.name} mood in {climate} weather
      </h2>

      {loading ? (
        <p>Loading songs...</p>
      ) : error ? (
        <p className="text-danger">{error}</p>
      ) : songs.length > 0 ? (
        <div className="row">
          {songs.map((song) => (
            <div key={song._id} className="col-md-4 mb-4">
              <Card>
                <CardBody>
                  <h5>{song.title}</h5>
                  <p>Artist: {song.artist}</p>
                  <audio controls className="w-100">
                    <source
                      src={`http://localhost:5000/${song.fileUrl}`}
                      type="audio/mpeg"
                    />
                    Your browser does not support the audio element.
                  </audio>
                </CardBody>
              </Card>
            </div>
          ))}
        </div>
      ) : (
        <p>No songs found for the selected mood and climate.</p>
      )}
    </div>
  );
};

export default Home;
