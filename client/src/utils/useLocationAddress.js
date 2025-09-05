import { useState, useEffect } from "react";

export default function useLocationAddress(apiKey) {
  const [address, setAddress] = useState(null);
  const [coords, setCoords] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by this browser.");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setCoords({ latitude, longitude });

        try {
          const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`;
          const res = await fetch(url);
          const data = await res.json();

          if (data.status === "OK") {
            setAddress(data.results[0].formatted_address);
          } else {
            setError(`Geocoding error: ${data.status}`);
          }
        } catch (err) {
          setError("Failed to fetch address");
        } finally {
          setLoading(false);
        }
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );
  }, [apiKey]);

  return { address, coords, loading, error };
}
