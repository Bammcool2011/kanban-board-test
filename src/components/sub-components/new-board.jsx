"use client";

import { useState } from "react";
import { checkUserExists } from "../../lib/auth";

export default function NewBoardDialog({
  isOpen,
  onClose,
  onBoardCreated,
}) {
  const [boardName, setBoardName] = useState("");
  const [currentInvite, setCurrentInvite] = useState("");
  const [invitedUsers, setInvitedUsers] = useState([]);
  const [userNotFoundMessage, setUserNotFoundMessage] = useState("");

  if (!isOpen) return null;

  const handleAddUser = async () => {
    // Check if input is empty
    if (!currentInvite.trim()) return;

    // Check if user is already in the list
    if (invitedUsers.includes(currentInvite.trim())) {
      setUserNotFoundMessage("User already added");
      setTimeout(() => setUserNotFoundMessage(""), 3000);
      return;
    }

    // Check if user exists in database
    const userExists = await checkUserExists(currentInvite.trim());

    if (!userExists) {
      setUserNotFoundMessage(`User "${currentInvite.trim()}" not found`);
      setTimeout(() => setUserNotFoundMessage(""), 3000);
      return;
    }

    // User exists, add to list
    setInvitedUsers([...invitedUsers, currentInvite.trim()]);
    setCurrentInvite("");
    setUserNotFoundMessage("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (boardName.trim()) {
      onBoardCreated(boardName.trim(), invitedUsers);
      // Reset form
      setBoardName("");
      setCurrentInvite("");
      setInvitedUsers([]);
      setUserNotFoundMessage("");
    }
  };

  const handleClose = () => {
    // Reset form when closing
    setBoardName("");
    setCurrentInvite("");
    setInvitedUsers([]);
    setUserNotFoundMessage("");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
      <div className="bg-[#1A1A1A] rounded-lg shadow-xl w-full max-w-md mx-4">
        {/* Header */}
        <div className="px-6 py-4 border-b-1 border-gray-200">
          <h2 className="text-lg font-semibold text-white">
            Create New Board
          </h2>
        </div>

        {/* Form */}
        <form className="px-6 py-4" onSubmit={handleSubmit}>
          {/* Board Name Input */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-white mb-2">
              Board Name:
            </label>
            <input
              type="text"
              value={boardName}
              onChange={(e) => setBoardName(e.target.value)}
              className="w-full text-white px-3 py-2 border border-gray-500 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-transparent"
              placeholder="Enter board name..."
              required
            />
          </div>

          {/* Invite Users */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-white mb-2">
              Invite to:
            </label>
            <div className="flex">
              <input
                type="text"
                value={currentInvite}
                onChange={(e) => setCurrentInvite(e.target.value)}
                className="flex-1 text-white px-3 py-2 border border-gray-500 rounded-l-md focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-transparent"
                placeholder="Enter username..."
              />
              <button
                type="button"
                onClick={handleAddUser}
                className="px-4 py-2 bg-[#151515] text-white rounded-r-md hover:bg-[#232323] transition"
              >
                Add
              </button>
            </div>

            {/* User not found message */}
            {userNotFoundMessage && (
              <div className="mt-2 text-sm text-red-600">
                {userNotFoundMessage}
              </div>
            )}

            {/* Display invited users */}
            {invitedUsers.length > 0 && (
              <div className="mt-2 space-y-1">
                <p className="text-xs text-gray-500">Invited users:</p>
                {invitedUsers.map((user, index) => (
                  <div
                    key={index}
                    className="bg-gray-100 px-2 py-1 rounded text-sm"
                  >
                    {user}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 transition"
              onClick={handleClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-[#151515] border border-transparent rounded-md shadow-sm hover:bg-[#232323] transition"
            >
              Create Board
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
