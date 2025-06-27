"use client";

import { useState } from "react";
import { createColumn } from "../lib/columns";

export default function AddColumnDialog({
  isOpen,
  onClose,
  onColumnAdded,
  boardId,
}) {
  // Form data
  const [title, setTitle] = useState("");

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check if title is filled
    if (title.trim() && boardId) {
      // Create the column in database
      const result = await createColumn(boardId, title.trim());

      // Success - close dialog and refresh
      onColumnAdded();
      closeDialog();
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
          <h2 className="text-lg font-semibold text-white">Add New Column</h2>
        </div>

        {/* Form */}
        <form className="px-6 py-4" onSubmit={handleSubmit}>
          {/* Column Title */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Column Name
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 bg-transparent border-gray-500 rounded-md text-white ring-1 focus:ring-gray-300 focus:outline-none"
              placeholder="Enter column name..."
              required
            />
          </div>

          {/* Buttons */}
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
              Add Column
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
