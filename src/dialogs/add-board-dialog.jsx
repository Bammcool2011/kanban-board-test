"use client";

import { useState } from "react";

export default function NewBoardDialog({
  isOpen,
  onClose,
  onBoardCreated,
}) {
  const [boardName, setBoardName] = useState("");
  const [newUser, setNewUser] = useState("");
  const [invitedUsers, setInvitedUsers] = useState([]);

  if (!isOpen) return null;

  const addUser = () => {
    if (newUser.trim()) {
      if (!invitedUsers.includes(newUser.trim())) {
        setInvitedUsers([...invitedUsers, newUser.trim()]);
        setNewUser("");
      }
    }
  };

  const removeUser = (index) => {
    setInvitedUsers(invitedUsers.filter((user, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (boardName.trim()) {
      onBoardCreated(boardName.trim(), invitedUsers);
      closeDialog();
    }
  };

  const closeDialog = () => {
    setBoardName("");
    setNewUser("");
    setInvitedUsers([]);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#1A1A1A] rounded-lg shadow-xl w-full max-w-md mx-4 text-white">
        <div className="px-6 py-4 border-b border-gray-600">
          <h2 className="text-lg font-semibold text-white">Create New Board</h2>
        </div>

        <form className="px-6 py-4" onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Board Name
            </label>
            <input
              type="text"
              value={boardName}
              onChange={(e) => setBoardName(e.target.value)}
              className="w-full px-3 py-2 bg-transparent border-gray-500 rounded-md text-white ring-1 focus:ring-gray-300 focus:outline-none"
              placeholder="Enter board name..."
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Invite Members
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newUser}
                onChange={(e) => setNewUser(e.target.value)}
                className="flex-1 px-3 py-2 bg-transparent border-gray-500 rounded-md text-white ring-1 focus:ring-gray-300 focus:outline-none"
                placeholder="Enter username..."
              />
              <button
                type="button"
                onClick={addUser}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-white text-sm"
              >
                Add
              </button>
            </div>
            
            {invitedUsers.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {invitedUsers.map((user, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-700 text-gray-300 text-sm rounded-full flex items-center gap-2"
                  >
                    @{user}
                    <button
                      type="button"
                      onClick={() => removeUser(index)}
                      className="text-red-400 hover:text-red-300 text-xs"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              className="px-6 py-2 text-sm font-medium text-black bg-white border border-transparent rounded-md hover:bg-gray-100 transition"
              onClick={closeDialog}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 text-sm font-medium text-white bg-[#151515] border border-transparent rounded-md hover:bg-[#202020] transition"
            >
              Create Board
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
