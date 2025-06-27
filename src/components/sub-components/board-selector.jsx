import React, { useEffect, useState } from "react";
import { FiEdit2, FiTrash } from "react-icons/fi";
import { getUserBoards, deleteBoard, getBoardMembers } from "../../lib/boards";

export function BoardSelector({
  selectedBoardId,
  onBoardChange,
  onEditBoard,
}) {
  const [boards, setBoards] = useState([]);
  const [boardMembers, setBoardMembers] = useState([]);

  useEffect(() => {
    const fetchBoards = async () => {
      const username = localStorage.getItem("username") || "";
      
      if (!username) {
        setBoards([]);
        return;
      }

      const result = await getUserBoards(username);
      if (result.success) {
        setBoards(result.boards || []);
      } else {
        setBoards([]);
      }
    };
    fetchBoards();
  }, []);

  // Load board members
  useEffect(() => {
    if (selectedBoardId) {
      const loadMembers = async () => {
        const result = await getBoardMembers(selectedBoardId);
        if (result.success) {
          setBoardMembers(result.members || []);
        } else {
          setBoardMembers([]);
        }
      };
      loadMembers();
    } else {
      setBoardMembers([]);
    }
  }, [selectedBoardId]);

  // Auto-select
  useEffect(() => {
    if (!selectedBoardId && boards.length > 0) {
      onBoardChange(String(boards[0].id));
    }
  }, [boards, selectedBoardId, onBoardChange]);

  const handleDelete = async () => {
    if (!selectedBoardId) return;
    
    const result = await deleteBoard(selectedBoardId);
    setBoards(prev => prev.filter(b => String(b.id) !== String(selectedBoardId)));
    onBoardChange("");
  };

  const handleEdit = () => {
    if (!selectedBoardId || !onEditBoard) return;
    
    const selectedBoard = boards.find(board => String(board.id) === String(selectedBoardId));
    if (selectedBoard) {
      onEditBoard(selectedBoard);
    }
  };

  return (
    <div className="w-full max-w-xs">
      <div className="flex flex-row gap-2 mb-3">
        <select
          className="w-full px-3 py-2 rounded border bg-[#232323] text-white"
          value={selectedBoardId || ""}
          onChange={(e) => onBoardChange(e.target.value)}
        >
          <option value="" disabled>
            Select a board
          </option>
          {boards.map((board) => (
            <option key={board.id} value={board.id}>
              {board.title}
            </option>
          ))}
        </select>
        <button
          onClick={handleEdit}
          className="pl-2 text-gray-400 hover:text-white transition-colors"
          type="button"
          disabled={!selectedBoardId}
          title="Edit Board"
        >
          <FiEdit2 size={16} />
        </button>
        <button
          onClick={handleDelete}
          className="p-2 text-gray-400 hover:text-red-400 transition-colors"
          type="button"
          disabled={!selectedBoardId}
          title="Delete Board"
        >
          <FiTrash size={16} />
        </button>
      </div>

      {selectedBoardId && boardMembers.length > 0 && (
        <div className="bg-[#1A1A1A] rounded-lg p-3 text-white">
          <div className="text-sm text-gray-400 mb-2">Board Members:</div>
          <div className="flex flex-wrap gap-2">
            {boardMembers.map((member, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded"
              >
                @{member}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
