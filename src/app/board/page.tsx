"use client";
import React from "react";

const handleLogout = () => {
  localStorage.removeItem("currentUser"); // <-- Use localStorage here
  window.location.href = "/login";
};

export default function BoardPage() {
  return (
    <div>
      {/* ...existing board content... */}
      <button onClick={handleLogout} style={{ color: "blue", background: "none", border: "none", cursor: "pointer" }}>
        Logout
      </button>
    </div>
  );
}