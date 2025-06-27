"use client";
import React, { useState, useEffect } from "react";
import NavHeader from "../../components/nav-header";
import { BoardSelector } from "../../components/sub-components/board-selector";
import NewColTask from "../../components/ui/new-col-task";
import { ColumnCard } from "../../components/ui/columncard";
import EditTaskDialog from "../../dialogs/edit-task-dialog";
import EditColumnDialog from "../../dialogs/edit-column-dialog";
import EditBoardDialog from "../../dialogs/edit-board-dialog";
import { useBoardPageLogic } from "../../lib/boardPageManager";

export default function BoardPage() {
	const [selectedBoardId, setSelectedBoardId] = useState("");
	const [currentColumns, setCurrentColumns] = useState([]);
	const [refreshTrigger, setRefreshTrigger] = useState(0);
	const [editTaskDialog, setEditTaskDialog] = useState({ isOpen: false, task: null });
	const [editColumnDialog, setEditColumnDialog] = useState({ isOpen: false, column: null });
	const [editBoardDialog, setEditBoardDialog] = useState({ isOpen: false, board: null });

	const { getColumns, removeColumn, refresh, createDialogs } = useBoardPageLogic();

	const taskCreated = refresh(setRefreshTrigger);
	const columnCreated = refresh(setRefreshTrigger);
	
	const {
		editTask,
		taskUpdated,
		closeTask,
		editColumn,
		columnUpdated,
		closeColumn,
		editBoard,
		boardUpdated,
		closeBoard
	} = createDialogs(setEditTaskDialog, setEditColumnDialog, setEditBoardDialog, setRefreshTrigger);

	const deleteCol = (columnId) => removeColumn(columnId, setCurrentColumns);

	// Load columns when board changes
	useEffect(() => {
		if (selectedBoardId) {
			getColumns(selectedBoardId).then(setCurrentColumns);
		} else {
			setCurrentColumns([]);
		}
	}, [selectedBoardId, refreshTrigger]);

	return (
		<div>
			<NavHeader />
			<div className="flex flex-col items-center justify-center">
				<BoardSelector
					selectedBoardId={selectedBoardId}
					onBoardChange={setSelectedBoardId}
					onEditBoard={editBoard}
				/>
				{selectedBoardId && (
					<>
						<NewColTask 
							boardId={selectedBoardId}
							columns={currentColumns}
							onTaskCreated={taskCreated}
							onColumnCreated={columnCreated}
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
										onDelete={deleteCol}
										onEdit={() => editColumn(col)}
										onEditTask={editTask}
									/>
								))
							)}
						</div>
					</>
				)}
			</div>

			<EditTaskDialog
				isOpen={editTaskDialog.isOpen}
				onClose={closeTask}
				onTaskUpdated={taskUpdated}
				task={editTaskDialog.task}
				columns={currentColumns}
			/>
			
			<EditColumnDialog
				isOpen={editColumnDialog.isOpen}
				onClose={closeColumn}
				onColumnUpdated={columnUpdated}
				column={editColumnDialog.column}
			/>
			
			<EditBoardDialog
				isOpen={editBoardDialog.isOpen}
				onClose={closeBoard}
				onBoardUpdated={boardUpdated}
				board={editBoardDialog.board}
			/>
		</div>
	);
}
