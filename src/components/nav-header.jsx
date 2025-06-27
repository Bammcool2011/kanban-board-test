import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import NewBoardDialog from "../dialogs/add-board-dialog";
import { createBoard } from "../lib/boards";

export default function NavHeader() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const username = localStorage.getItem("username") || "";
    setCurrentUser(username);
    
    if (!username) {
      router.push("/login");
    }
  }, [router]);

  const handleCreateBoard = async (boardName, invitedUsers) => {
    if (!currentUser) return;
    
    const result = await createBoard(boardName, invitedUsers, currentUser);
    
    setIsDialogOpen(false);
    window.location.reload();
  };

  const handleLogout = () => {
    localStorage.removeItem("username");
    router.push("/login");
  };

  if (!currentUser) {
    return null;
  }

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
            <div className="w-12 h-12 rounded-full bg-black flex items-center justify-center text-white font-bold">
              {currentUser ? currentUser.charAt(0).toUpperCase() : "D"}
            </div>
            <div className="flex flex-col">
              <span className="text-white font-semibold leading-tight">
                {currentUser || "dev_user"}
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
