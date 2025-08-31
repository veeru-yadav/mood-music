import React, { useState } from "react";
import SongsPlayer from "./SongsPlayer";

const Search = () => {
  const [query, setQuery] = useState("");
  const [songs, setSongs] = useState([]);

  const handleSearch = async (e) => {
    e.preventDefault();
    // Add your backend call here
    const response = await fetch(`https://discoveryprovider.audius.co/v1/tracks/search?query=${query}&app_name=myapp`);
    const songsData = await response.json();
    const songs = songsData.data;
    setSongs(songs);
    console.log("Searching for:", query);
  };

  return (
    <div className="container mt-4">
      <h2>Search Music</h2>
      <form onSubmit={handleSearch} className="d-flex gap-2">
        <input
          type="text"
          className="form-control"
          placeholder="Search by mood, artist, song..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit" className="btn btn-primary">Search</button>
      </form>
      <div className="mt-4">
        <h3>Results</h3>
        
        <SongsPlayer songs={songs} />
      </div>

    </div>
  );
};

export default Search;
