"use client";
import React, { useState, useEffect } from "react";
import NavHeader from "@/components/nav-header";
import { BoardSelector } from "@/components/sub-components/board-selector";
import NewColTask from "@/components/ui/new-col-task";
import { ColumnCard } from "@/components/ui/columncard";
import { getBoardColumns, deleteColumn } from "@/lib/columnActions";

type Column = { id: string; name: string; title: string };

export default function BoardPage() {
	const [selectedBoardId, setSelectedBoardId] = useState<string>("");
	const [currentColumns, setCurrentColumns] = useState<Array<{ id: string; name: string; title: string }>>([]);
	const [refreshTrigger, setRefreshTrigger] = useState(0);

	// Load columns when selected board changes
	useEffect(() => {
		if (selectedBoardId) {
			loadBoardColumns(selectedBoardId);
		} else {
			setCurrentColumns([]);
		}
	}, [selectedBoardId, refreshTrigger]);

	const loadBoardColumns = async (boardId: string) => {
		try {
			const result = await getBoardColumns(boardId);
			
			if (result.success && result.columns) {
				const formattedColumns = result.columns.map((col: any) => ({
					id: col.id.toString(),
					name: col.title,
					title: col.title
				}));
				setCurrentColumns(formattedColumns);
			} else {
				setCurrentColumns([]);
			}
		} catch (error) {
			setCurrentColumns([]);
		}
	};

	const handleDeleteColumn = async (columnId: string) => {
		// Delete column from database
		const result = await deleteColumn(columnId);
		if (result.success) {
			// Remove column if database deletion was successful
			setCurrentColumns(prev => prev.filter(col => col.id !== columnId));
		} else {
			alert("Failed to delete column: " + result.error);
		}
	};


	// Refresh handlers when a task or column is created
	const handleTaskCreated = () => {
		setRefreshTrigger(prev => prev + 1);
	};

	const handleColumnCreated = () => {
		setRefreshTrigger(prev => prev + 1);
	};

	return (
		<div>
			<NavHeader />
			<div className="flex flex-col items-center justify-center">
				<BoardSelector
					selectedBoardId={selectedBoardId}
					onBoardChange={setSelectedBoardId}
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
								currentColumns.map((col: Column) => (
									<ColumnCard
										key={col.id}
										boardId={selectedBoardId}
										columnId={col.id}
										columnName={col.name}
										refreshTrigger={refreshTrigger}
										onDelete={handleDeleteColumn}
									/>
								))
							)}
						</div>
					</>
				)}
			</div>
		</div>
	);
}
