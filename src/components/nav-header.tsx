import React from "react";

const handleLogout = () => {
  localStorage.removeItem("currentUser");
  window.location.href = "/login";
};

export default function NavHeader() {
  return (
    <div className="flex items-center justify-between m-8 px-6 py-4 bg-[#2C2C2C] rounded-lg">
      <button className="bg-[#1A1A1A] text-white font-semibold px-6 py-3 rounded-lg shadow hover:bg-[#232323] transition">
        Create a new board
      </button>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gray-300" />
          <div className="flex flex-col">
            <span className="text-white font-semibold leading-tight">Name</span>
            <span className="text-xs text-gray-400">Project Manager</span>
          </div>
        </div>

        <div className="h-8 border-l border-gray-600 mx-2" />

        <button
          className="text-gray-400 hover:text-white transition text-sm"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </div>
  );
}
