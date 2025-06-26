import React, { useState, useEffect } from "react";
import { FiEdit2, FiTrash } from "react-icons/fi";
import TaskCard from "./task-card";
import { getTasksInColumn, deleteTask, moveTaskUp, moveTaskDown } from "../../lib/tasks";

export const ColumnCard = ({
  boardId,
  columnId,
  columnName,
  refreshTrigger,
  onDelete,
  onEdit,
  onEditTask,
}) => {
  const [tasks, setTasks] = useState([]);

  // Load tasks when component mounts or refreshTrigger changes
  useEffect(() => {
    loadTasks();
  }, [columnId, refreshTrigger]);

  const loadTasks = async () => {
    const result = await getTasksInColumn(columnId);
    if (result.success) {
      setTasks(result.tasks || []);
    }
  };

  const handleDeleteTask = async (taskId) => {
    const result = await deleteTask(taskId);
    if (result.success) {
      setTasks(tasks.filter(task => task.id !== taskId));
    }
  };

  const handleMoveTaskUp = async (taskId) => {
    const result = await moveTaskUp(taskId, columnId);
    if (result.success) {
      loadTasks();
    }
  };

  const handleMoveTaskDown = async (taskId) => {
    const result = await moveTaskDown(taskId, columnId);
    if (result.success) {
      loadTasks();
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(columnId);
    }
  };

  return (
    <div className="rounded-xl border border-gray-600 bg-[#262626] p-6 min-h-[500px] w-[350px] flex flex-col">
      {/* Title row with icons */}
      <div className="w-full flex items-center justify-between mb-2">
        <span className="text-white text-2xl font-bold tracking-wide">
          {columnName.toUpperCase()}
        </span>
        <div className="flex gap-2 text-gray-400">
          <button
            className="hover:text-white transition-colors"
            onClick={onEdit}
            aria-label="Edit column"
            type="button"
          >
            <FiEdit2 size={20} />
          </button>
          <button
            className="hover:text-red-400 transition-colors"
            onClick={handleDelete}
            aria-label="Delete column"
            type="button"
          >
            <FiTrash size={20} />
          </button>
        </div>
      </div>
      <hr className="w-full border-gray-400 mb-4" />

      {/* Tasks */}
      <div className="flex-1">
        {tasks.map((task, index) => (
          <TaskCard
            key={task.id}
            task={task}
            onEdit={() => onEditTask && onEditTask(task)}
            onDelete={() => handleDeleteTask(task.id)}
            onMoveUp={() => handleMoveTaskUp(task.id)}
            onMoveDown={() => handleMoveTaskDown(task.id)}
            canMoveUp={index > 0}
            canMoveDown={index < tasks.length - 1}
          />
        ))}
      </div>
    </div>
  );
};
