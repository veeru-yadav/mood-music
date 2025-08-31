import React from "react";

export default function Loading() {
  return (
    <div
      className="d-flex justify-content-center align-items-center position-fixed top-0 start-0 w-100 h-100"
      style={{
        background: "rgba(0,0,0,0.6)",
        backdropFilter: "blur(8px)",
        zIndex: 2000
      }}
    >
      <div className="spinner-border text-light" role="status" style={{ width: "4rem", height: "4rem" }}>
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
}
