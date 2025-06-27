import { getColumnsForBoard, deleteColumn } from "./columns";

export const useBoardPageLogic = () => {
  const getColumns = async (boardId) => {
    const result = await getColumnsForBoard(boardId);

    if (result.success && result.columns) {
      const formattedColumns = result.columns.map((col) => ({
        id: col.id.toString(),
        name: col.title,
        title: col.title,
      }));
      return formattedColumns;
    } else {
      return [];
    }
  };

  const removeColumn = async (columnId, setCurrentColumns) => {
    const result = await deleteColumn(columnId);
    if (result.success) {
      setCurrentColumns((prev) => prev.filter((col) => col.id !== columnId));
    }
    return result;
  };

  const refresh = (setRefreshTrigger) => {
    return () => setRefreshTrigger((prev) => prev + 1);
  };

  const createDialogs = (
    setTaskDialog,
    setColumnDialog,
    setBoardDialog,
    setRefreshTrigger
  ) => {
    return {
      editTask: (task) => setTaskDialog({ isOpen: true, task }),
      taskUpdated: () => {
        setRefreshTrigger((prev) => prev + 1);
        setTaskDialog({ isOpen: false, task: null });
      },
      closeTask: () => setTaskDialog({ isOpen: false, task: null }),

      editColumn: (column) => setColumnDialog({ isOpen: true, column }),
      columnUpdated: () => {
        setRefreshTrigger((prev) => prev + 1);
        setColumnDialog({ isOpen: false, column: null });
      },
      closeColumn: () => setColumnDialog({ isOpen: false, column: null }),

      editBoard: (board) => setBoardDialog({ isOpen: true, board }),
      boardUpdated: () => {
        setRefreshTrigger((prev) => prev + 1);
        setBoardDialog({ isOpen: false, board: null });
      },
      closeBoard: () => setBoardDialog({ isOpen: false, board: null }),
    };
  };

  return {
    getColumns,
    removeColumn,
    refresh,
    createDialogs,
  };
};
