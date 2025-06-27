"use client";

import { FiChevronUp, FiChevronDown } from "react-icons/fi";

export default function TaskCard({ 
  task, 
  onEdit, 
  onDelete, 
  onMoveUp, 
  onMoveDown, 
  canMoveUp = true, 
  canMoveDown = true 
}) {
  const getPriorityColor = (priority) => {
    const priorityUpper = priority ? priority.toUpperCase() : "LOW";
    switch (priorityUpper) {
      case "HIGH":
        return "border-red-500 text-red-400";
      case "MEDIUM":
        return "border-orange-500 text-orange-400";
      case "LOW":
        return "border-green-500 text-green-400";
      default:
        return "border-gray-500 text-gray-400";
    }
  };

  return (
    <div className="bg-[#2C2C2C] rounded-lg p-4 mb-3 border border-gray-600">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-white font-semibold text-base flex-1 pr-2">
          {task.title}
        </h3>
        <div className="flex items-center gap-1 text-gray-400 text-sm">
          {onEdit && (
            <button
              onClick={onEdit}
              className="hover:text-white transition-colors"
            >
              edit
            </button>
          )}
          {onEdit && onDelete && <span className="text-gray-600">|</span>}
          {onDelete && (
            <button
              onClick={onDelete}
              className="hover:text-red-400 transition-colors"
            >
              delete
            </button>
          )}
        </div>
      </div>

      {task.assignees && task.assignees.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {task.assignees.map((user, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded"
            >
              @{user}
            </span>
          ))}
        </div>
      )}

      <p className="text-gray-300 text-sm mb-4 leading-relaxed">
        {task.description}
      </p>

      <div className="flex justify-center mb-3">
        <span className={`px-3 py-1 rounded border text-xs font-medium ${getPriorityColor(task.priority)}`}>
          {task.priority ? task.priority.toUpperCase() : "LOW"}
        </span>
      </div>

      <div className="flex justify-center gap-2">
        {onMoveUp && (
          <button
            onClick={onMoveUp}
            disabled={!canMoveUp}
            className={`p-1 rounded transition-colors ${
              canMoveUp 
                ? 'text-gray-400 hover:text-white hover:bg-gray-700' 
                : 'text-gray-600 cursor-not-allowed'
            }`}
            title="Move task up"
          >
            <FiChevronUp size={16} />
          </button>
        )}
        {onMoveDown && (
          <button
            onClick={onMoveDown}
            disabled={!canMoveDown}
            className={`p-1 rounded transition-colors ${
              canMoveDown 
                ? 'text-gray-400 hover:text-white hover:bg-gray-700' 
                : 'text-gray-600 cursor-not-allowed'
            }`}
            title="Move task down"
          >
            <FiChevronDown size={16} />
          </button>
        )}
      </div>
    </div>
  );
}
