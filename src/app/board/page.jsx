"use client";
import React, { useState, useEffect } from "react";
import NavHeader from "../../components/nav-header";
import { BoardSelector } from "../../components/sub-components/board-selector";
import NewColTask from "../../components/ui/new-col-task";
import { ColumnCard } from "../../components/ui/columncard";
import EditTaskDialog from "../../dialogs/edit-task-dialog";
import EditColumnDialog from "../../dialogs/edit-column-dialog";
import EditBoardDialog from "../../dialogs/edit-board-dialog";
import { getColumnsForBoard, deleteColumn } from "../../lib/columns";

export default function BoardPage() {
	const [selectedBoardId, setSelectedBoardId] = useState("");
	const [currentColumns, setCurrentColumns] = useState([]);
	const [refreshTrigger, setRefreshTrigger] = useState(0);
	
	const [editTaskDialog, setEditTaskDialog] = useState({ isOpen: false, task: null });
	const [editColumnDialog, setEditColumnDialog] = useState({ isOpen: false, column: null });
	const [editBoardDialog, setEditBoardDialog] = useState({ isOpen: false, board: null });

	useEffect(() => {
		if (selectedBoardId) {
			loadBoardColumns(selectedBoardId);
		} else {
			setCurrentColumns([]);
		}
	}, [selectedBoardId, refreshTrigger]);

	const loadBoardColumns = async (boardId) => {
		const result = await getColumnsForBoard(boardId);
		
		if (result.success && result.columns) {
			const formattedColumns = result.columns.map((col) => ({
				id: col.id.toString(),
				name: col.title,
				title: col.title
			}));
			setCurrentColumns(formattedColumns);
		} else {
			setCurrentColumns([]);
		}
	};

	const handleDeleteColumn = async (columnId) => {
		const result = await deleteColumn(columnId);
		setCurrentColumns(prev => prev.filter(col => col.id !== columnId));
	};

	const handleTaskCreated = () => setRefreshTrigger(prev => prev + 1);
	const handleColumnCreated = () => setRefreshTrigger(prev => prev + 1);
	const handleEditTask = (task) => setEditTaskDialog({ isOpen: true, task });
	const handleEditColumn = (column) => setEditColumnDialog({ isOpen: true, column });
	const handleEditBoard = (board) => setEditBoardDialog({ isOpen: true, board });

	const handleTaskUpdated = () => {
		setRefreshTrigger(prev => prev + 1);
		setEditTaskDialog({ isOpen: false, task: null });
	};

	const handleColumnUpdated = () => {
		setRefreshTrigger(prev => prev + 1);
		setEditColumnDialog({ isOpen: false, column: null });
	};

	const handleBoardUpdated = () => {
		setRefreshTrigger(prev => prev + 1);
		setEditBoardDialog({ isOpen: false, board: null });
	};

	return (
		<div>
			<NavHeader />
			<div className="flex flex-col items-center justify-center">
				<BoardSelector
					selectedBoardId={selectedBoardId}
					onBoardChange={setSelectedBoardId}
					onEditBoard={handleEditBoard}
				/>
				{selectedBoardId && (
					<>
						<NewColTask 
							boardId={selectedBoardId}
							columns={currentColumns}
							onTaskCreated={handleTaskCreated}
							onColumnCreated={handleColumnCreated}
						/>
						<div className="mt-8 flex gap-6">
							{currentColumns.length === 0 ? (
								<div className="text-gray-400 text-center py-8">
									No columns found. Create your first column using "Add new column" above.
								</div>
							) : (
								currentColumns.map((col) => (
									<ColumnCard
										key={col.id}
										boardId={selectedBoardId}
										columnId={col.id}
										columnName={col.name}
										refreshTrigger={refreshTrigger}
										onDelete={handleDeleteColumn}
										onEdit={() => handleEditColumn(col)}
										onEditTask={handleEditTask}
									/>
								))
							)}
						</div>
					</>
				)}
			</div>

			{/* Edit Dialogs */}
			<EditTaskDialog
				isOpen={editTaskDialog.isOpen}
				onClose={() => setEditTaskDialog({ isOpen: false, task: null })}
				onTaskUpdated={handleTaskUpdated}
				task={editTaskDialog.task}
				columns={currentColumns}
			/>
			
			<EditColumnDialog
				isOpen={editColumnDialog.isOpen}
				onClose={() => setEditColumnDialog({ isOpen: false, column: null })}
				onColumnUpdated={handleColumnUpdated}
				column={editColumnDialog.column}
			/>
			
			<EditBoardDialog
				isOpen={editBoardDialog.isOpen}
				onClose={() => setEditBoardDialog({ isOpen: false, board: null })}
				onBoardUpdated={handleBoardUpdated}
				board={editBoardDialog.board}
			/>
		</div>
	);
}
