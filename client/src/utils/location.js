// src/utils/location.js
export const getUserLocationAndAddress = async () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by this browser."));
    }

    navigator.geolocation.getCurrentPosition(async (position) => {
      try {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        // Reverse geocoding with WeatherAPI
        const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
        const res = await fetch(
          `https://api.weatherapi.com/v1/search.json?key=${API_KEY}&q=${lat},${lon}`
        );

        const data = await res.json();
        if (data && data.length > 0) {
          resolve({
            latitude: lat,
            longitude: lon,
            address: `${data[0].name}, ${data[0].region}, ${data[0].country}`
          });
        } else {
          resolve({
            latitude: lat,
            longitude: lon,
            address: null
          });
        }
      } catch (error) {
        reject(error);
      }
    }, reject);
  });
};
