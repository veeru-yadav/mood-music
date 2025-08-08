
import React, { createContext, useState, useContext } from 'react';

const MoodContext = createContext();

export const MoodProvider = ({ children }) => {
  const [mood, setMood] = useState(() => {
    try {
      const stored = localStorage.getItem('mood');
      return stored ? JSON.parse(stored) : null;
    } catch (err) {
      console.error('Invalid mood in localStorage:', err);
      localStorage.removeItem('mood'); // clean up bad data
      return null;
    }
  });

  const [climate, setClimate] = useState(() => {
    try {
      return localStorage.getItem('climate') || null;
    } catch (err) {
      console.error('Invalid climate in localStorage:', err);
      localStorage.removeItem('climate');
      return null;
    }
  });

  const updateMoodAndClimate = (newMood, newClimate) => {
    setMood(newMood);
    setClimate(newClimate);
    localStorage.setItem('mood', JSON.stringify(newMood));
    localStorage.setItem('climate', newClimate);
  };

  return (
    <MoodContext.Provider value={{ mood, climate, updateMoodAndClimate }}>
      {children}
    </MoodContext.Provider>
  );
};

export const useMood = () => useContext(MoodContext);
