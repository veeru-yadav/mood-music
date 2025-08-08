import React, { useState } from "react";

const Search = () => {
  const [query, setQuery] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    // Add your backend call here
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
    </div>
  );
};

export default Search;
