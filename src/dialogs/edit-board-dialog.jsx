"use client";

import { useState, useEffect } from "react";
import { updateBoard } from "../lib/boards";

export default function EditBoardDialog({
  isOpen,
  onClose,
  onBoardUpdated,
  board,
}) {
  // Form data
  const [title, setTitle] = useState("");

  // When dialog opens, fill form with board data
  useEffect(() => {
    if (isOpen && board) {
      setTitle(board.title || "");
    }
  }, [isOpen, board]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check if title is filled
    if (title.trim() && board?.id) {
      // Update the board in database
      const result = await updateBoard(board.id, {
        title: title.trim(),
      });

      if (result.success) {
        // Success - close dialog and refresh
        onBoardUpdated();
        closeDialog();
      } else {
        // Show error message
        alert("Failed to update board: " + result.error);
      }
    }
  };

  // Close dialog and reset form
  const closeDialog = () => {
    setTitle("");
    onClose();
  };

  // Don't show dialog if not open
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#1A1A1A] rounded-lg shadow-xl w-full max-w-md mx-4 text-white">
        {/* Dialog Header */}
        <div className="px-6 py-4 border-b border-gray-600">
          <h2 className="text-lg font-semibold text-white">Edit Board</h2>
        </div>

        {/* Form */}
        <form className="px-6 py-4" onSubmit={handleSubmit}>
          {/* Board Title */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Board Name
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 bg-transparent border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter board name..."
              required
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              className="px-6 py-2 text-sm font-medium text-gray-300 bg-transparent border border-gray-600 rounded-md hover:bg-gray-800 transition"
              onClick={closeDialog}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 transition"
            >
              Update Board
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
