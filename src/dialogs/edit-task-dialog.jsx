"use client";

import { useState, useEffect } from "react";
import { updateTask } from "../lib/tasks";

export default function EditTaskDialog({
  isOpen,
  onClose,
  onTaskUpdated,
  task,
  columns,
}) {
  // Form data
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedColumn, setSelectedColumn] = useState("");
  const [priority, setPriority] = useState("LOW");

  // When dialog opens, fill form with task data
  useEffect(() => {
    if (isOpen && task) {
      setTitle(task.title || "");
      setDescription(task.description || "");
      setSelectedColumn(task.column_id || "");
      setPriority(task.priority ? task.priority.toUpperCase() : "LOW");
    }
  }, [isOpen, task]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check if required fields are filled
    if (title.trim() && selectedColumn && task?.id) {
      // Update the task in database
      const result = await updateTask(task.id, {
        title: title.trim(),
        description: description.trim(),
        column_id: selectedColumn,
        priority: priority.toLowerCase(),
      });

      if (result.success) {
        // Success - close dialog and refresh
        onTaskUpdated();
        closeDialog();
      } else {
        // Show error message
        alert("Failed to update task: " + result.error);
      }
    }
  };

  // Close dialog and reset form
  const closeDialog = () => {
    setTitle("");
    setDescription("");
    setSelectedColumn("");
    setPriority("LOW");
    onClose();
  };

  // Don't show dialog if not open
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#1A1A1A] rounded-lg shadow-xl w-full max-w-md mx-4 text-white">
        {/* Dialog Header */}
        <div className="px-6 py-4 border-b border-gray-600">
          <h2 className="text-lg font-semibold text-white">Edit Task</h2>
        </div>

        {/* Form */}
        <form className="px-6 py-4" onSubmit={handleSubmit}>
          {/* Task Title */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Task Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 bg-transparent border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter task title..."
              required
            />
          </div>

          {/* Task Description */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 bg-transparent border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              placeholder="Enter task description..."
              rows={4}
            />
          </div>

          {/* Column and Priority Row */}
          <div className="flex gap-4 mb-4">
            {/* Column Selection */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Column
              </label>
              <select
                value={selectedColumn}
                onChange={(e) => setSelectedColumn(e.target.value)}
                className="w-full px-3 py-2 bg-[#262626] border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="" disabled>
                  Select column
                </option>
                {columns.map((column) => (
                  <option key={column.id} value={column.id}>
                    {column.title}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Priority Selection */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full px-3 py-2 bg-[#262626] border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="LOW">LOW</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="HIGH">HIGH</option>
              </select>
            </div>
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
              Update Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
