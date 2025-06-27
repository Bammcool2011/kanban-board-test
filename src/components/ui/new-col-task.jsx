"use client";

import { useState } from "react";
import NewTaskDialog from "../../dialogs/add-task-dialog";
import NewColumnDialog from "../../dialogs/add-column-dialog";

export default function NewColTask({ boardId, columns, onTaskCreated, onColumnCreated }) {
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  const [isColumnDialogOpen, setIsColumnDialogOpen] = useState(false);

  const handleTaskCreated = async () => {
    // Call the parent's callback to refresh tasks
    onTaskCreated();
  };

  const handleColumnCreated = () => {
    // Call the parent's callback to refresh columns
    onColumnCreated();
  };

  return (
    <>
      <div className="mt-3">
        <button 
          className="text-gray-400 text-md hover:text-gray-500 cursor-pointer"
          onClick={() => setIsColumnDialogOpen(true)}
        >
          Add new column
        </button>
        <span className="text-gray-400 text-md mx-3">|</span>
        <button 
          className="text-gray-400 text-md hover:text-gray-500 cursor-pointer"
          onClick={() => setIsTaskDialogOpen(true)}
        >
          Add new task
        </button>
      </div>
      
      <NewColumnDialog
        isOpen={isColumnDialogOpen}
        onClose={() => setIsColumnDialogOpen(false)}
        onColumnAdded={handleColumnCreated}
        boardId={boardId}
      />
      
      <NewTaskDialog
        isOpen={isTaskDialogOpen}
        onClose={() => setIsTaskDialogOpen(false)}
        onTaskAdded={handleTaskCreated}
        columns={columns}
      />
    </>
  );
}
