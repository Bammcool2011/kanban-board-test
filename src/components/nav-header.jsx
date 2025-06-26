import React, { useEffect, useState } from "react";
import NewBoardDialog from "./sub-components/new-board";
import { SubmitBoard } from "../lib/SubmitBoard";

export default function NavHeader() {
  const [currentUser, setCurrentUser] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    // Get username from localStorage
    const username = localStorage.getItem("username") || "";
    setCurrentUser(username);
  }, []);

  // Handle board creation
  const handleCreateBoard = async (boardName, invitedUsers) => {
    const result = await SubmitBoard(boardName, invitedUsers, currentUser);
    
    if (result.success) {
      setIsDialogOpen(false);
      // Reload the page to show the new board
      window.location.reload();
    } else {
      alert("Failed to create board: " + result.error);
    }
  };

  const handleLogout = () => {
    window.location.href = "/login";
  };

  return (
    <>
      <div className="flex items-center justify-between m-8 px-6 py-4 bg-[#2C2C2C] rounded-lg">
        <button
          onClick={() => setIsDialogOpen(true)}
          className="bg-[#1A1A1A] text-white font-semibold px-6 py-3 rounded-lg shadow hover:bg-[#232323] transition"
        >
          Create a new board
        </button>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gray-300" />
            <div className="flex flex-col">
              <span className="text-white font-semibold leading-tight">
                {currentUser}
              </span>
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
      <NewBoardDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onBoardCreated={handleCreateBoard}
      />
    </>
  );
}
