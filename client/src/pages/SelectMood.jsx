// src/pages/SelectMood.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
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
  const [address, setAddress] = useState('Hyderabad'); // default for now
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
    const fetchWeather = async () => {
      try {
        const res = await axios.get(
          `https://api.weatherapi.com/v1/current.json?key=f07c2e64692f476391c12050250108&q=${address}`
        );
        const condition = res.data.current.condition.text;
        setClimate(condition);
        console.log('Weather condition:', condition);
      } catch (error) {
        console.log(res.data.address);
        console.error('Weather fetch error:', error);
      }
    };
    fetchWeather();
  }, [address]);


  return (
    <div className="container py-5">
      <h2 className="mb-4 text-center">Select Your Mood</h2>
      <div className="d-flex justify-content-center mb-4">
        <input
          type="text"
          placeholder="Enter your address"
          className="form-control w-50"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
      </div>
      <div className="row justify-content-center">
        {moods.map((mood, index) => (
          <div
            key={index}
            className="card text-center m-2 p-4 shadow"
            style={{ width: '150px', cursor: 'pointer' }}
            onClick={() => handleMoodSelect(mood.name)}
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
