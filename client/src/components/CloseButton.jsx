// src/components/CloseButton.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

const CloseButton = ({ className = "" }) => {
  const navigate = useNavigate();

  return (
    <button
      className={`btn btn-light border-0 fs-3 ${className}`}
      style={{
        lineHeight: "1",
        borderRadius: "50%",
        width: "40px",
        height: "40px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
      }}
      onClick={() => navigate(-1)} // ✅ go back
    >
      ✕
    </button>
  );
};

export default CloseButton;
