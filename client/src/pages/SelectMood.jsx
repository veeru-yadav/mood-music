// src/pages/SelectMood.jsx
import React, { useEffect, useState } from 'react';
import API from '../backendApi/api'
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useMood } from '../context/MoodContext';


const moods = [
  { name: 'Happy', icon: '😊' },
  { name: 'Sad', icon: '😢' },
  { name: 'Energetic', icon: '⚡' },
  { name: 'Calm', icon: '🌿' },
  { name: 'Romantic', icon: '❤️' },
  { name: 'All', icon: '🎵' }
];

const SelectMood = () => {
  const [climate, setClimate] = useState('');
  const [climate1, setClimate1] = useState('');
  const [address, setAddress] = useState('Hyderabad'); // default for now
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();
  const token = user?.token;
  const { updateMoodAndClimate } = useMood();

  //get address of user
  const getUserAddress = async () => {
    try {
      const res = await API.get('/users/profile', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAddress(res.data.address);

    } catch (error) {
      console.error('Error fetching user address:', error);
    }
  };

  useEffect(() => {
    getUserAddress();
  }, []);

  const handleMoodSelect = (selectedMoodName) => {
    const selectedMood = moods.find(m => m.name === selectedMoodName);
    updateMoodAndClimate(selectedMood, climate);  // ✅ Save selected mood and climate
    navigate('/');             // ✅ Go to home page
  };


  useEffect(() => {
    // 1️⃣ Try to get location via browser
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const lat = pos.coords.latitude;
          const lon = pos.coords.longitude;

          try {
            // 2️⃣ Fetch weather from WeatherAPI
            const res = await fetch(
              `https://api.weatherapi.com/v1/current.json?key=${import.meta.env.VITE_WEATHER_API_KEY}&q=${lat},${lon}`
            );
            const data = await res.json();
            setLocation(data.location);
            setClimate(data.current.condition.text);

            const res1 = await fetch(
              `https://api.weatherapi.com/v1/current.json?key=${import.meta.env.VITE_WEATHER_API_KEY}&q=${address}`
            );
            const data1 = await res1.json();
            setClimate1(data1.current.condition.text);

          } catch (err) {
            setError("Failed to fetch weather data");
          } finally {
            setLoading(false);
          }
        },
        () => {
          setError("Permission denied for location");
          setLoading(false);
        }
      );
    } else {
      setError("Geolocation not supported");
      setLoading(false);
    }
  }, []);



  return (
    <div className="container py-5">

      <div className="d-flex justify-content-center align-items-center row mb-4">

        <h2 className="mb-3 text-center">🌤 Current Weather</h2>

        {address && (
          <div className='mb-2 text-center shadow p-3 rounded' style={{backgroundColor:"#f0f8ff"}}>
            📍Register address : {address} — {climate1}
          </div>
        )}

        {location && (
          <div className='mb-2 text-center shadow p-3 rounded' style={{backgroundColor:"#f0f8ff"}}>
            📍present location : {location.name}, {location.region} — {climate}
          </div>
        )}
      </div>
      <div className="row justify-content-center">
        <h2 className="mb-4 text-center">Select Your Mood</h2>
        {moods.map((mood, index) => (
          <div
            key={index}
            className="card text-center m-2 p-4 shadow"
            style={{ width: '150px', cursor: 'pointer' , backgroundColor:"#f0f8ff" , borderRadius:"15px" , borderBlockColor:"#87ceeb"}}
            onClick={() => handleMoodSelect(mood.name)}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.03)";
              e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.15)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)";
            }}
          >
            <div style={{ fontSize: '2rem' }}>{mood.icon}</div>
            <div className="mt-2 fw-bold">{mood.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SelectMood;
