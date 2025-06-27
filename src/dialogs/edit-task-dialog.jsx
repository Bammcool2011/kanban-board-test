"use client";

import { useState, useEffect } from "react";
import { updateTask, updateTaskAssignees } from "../lib/tasks";

export default function EditTaskDialog({
  isOpen,
  onClose,
  onTaskUpdated,
  task,
  columns,
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedColumn, setSelectedColumn] = useState("");
  const [priority, setPriority] = useState("LOW");
  const [assignedUsers, setAssignedUsers] = useState([]);
  const [newUser, setNewUser] = useState("");

  useEffect(() => {
    if (isOpen && task) {
      setTitle(task.title || "");
      setDescription(task.description || "");
      setSelectedColumn(task.column_id || "");
      setPriority(task.priority ? task.priority.toUpperCase() : "LOW");
      setAssignedUsers(task.assignees || []);
    }
  }, [isOpen, task]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (title.trim() && selectedColumn && task?.id) {
      await updateTask(task.id, {
        title: title.trim(),
        description: description.trim(),
        column_id: selectedColumn,
        priority: priority.toLowerCase(),
      });
      await updateTaskAssignees(task.id, assignedUsers);
      onTaskUpdated();
      closeDialog();
    }
  };

  const addUser = () => {
    if (newUser.trim()) {
      if (!assignedUsers.includes(newUser.trim())) {
        setAssignedUsers([...assignedUsers, newUser.trim()]);
        setNewUser("");
      }
    }
  };

  const removeUser = (index) => {
    setAssignedUsers(assignedUsers.filter((user, i) => i !== index));
  };

  const closeDialog = () => {
    setTitle("");
    setDescription("");
    setSelectedColumn("");
    setPriority("LOW");
    setAssignedUsers([]);
    setNewUser("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#1A1A1A] rounded-lg shadow-xl w-full max-w-md mx-4 text-white">
        <div className="px-6 py-4 border-b border-gray-600">
          <h2 className="text-lg font-semibold text-white">Edit Task</h2>
        </div>
        <form className="px-6 py-4" onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Task Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 bg-transparent border-gray-500 rounded-md text-white ring-1 focus:ring-gray-300 focus:outline-none"
              placeholder="Enter task title..."
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 bg-transparent border-gray-500 rounded-md text-white ring-1 focus:ring-gray-300 focus:outline-none resize-none"
              placeholder="Enter task description..."
              rows={4}
            />
          </div>
          <div className="flex gap-4 mb-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Column
              </label>
              <select
                value={selectedColumn}
                onChange={(e) => setSelectedColumn(e.target.value)}
                className="w-full px-3 py-2 bg-[#262626] border-gray-500 rounded-md text-white ring-1 focus:ring-gray-300 focus:outline-none"
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
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full px-3 py-2 bg-[#262626] border-gray-500 rounded-md text-white ring-1 focus:ring-gray-300 focus:outline-none"
              >
                <option value="LOW">LOW</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="HIGH">HIGH</option>
              </select>
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Assign Users
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
            {assignedUsers.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {assignedUsers.map((user, index) => (
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
              Update Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
