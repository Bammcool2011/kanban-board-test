import { supabase } from "./supabaseClient";

export const createColumn = async (boardId, columnTitle) => {
  const { data: newColumn, error } = await supabase
    .from("columns")
    .insert([{ board_id: boardId, title: columnTitle }])
    .select("*")
    .single();

  if (error) {
    return { success: false, error: "Could not create column" };
  }
  return { success: true, column: newColumn };
};

export const getColumnsForBoard = async (boardId) => {
  const { data: columns, error } = await supabase
    .from("columns")
    .select("*")
    .eq("board_id", boardId)
    .order("position");

  if (error) {
    return { success: false, error: "Could not get columns" };
  }
  return { success: true, columns: columns || [] };
};

export const updateColumn = async (columnId, changes) => {
  const { data: updatedColumn, error } = await supabase
    .from("columns")
    .update(changes)
    .eq("id", columnId)
    .select("*")
    .single();

  if (error) {
    return { success: false, error: "Could not update column" };
  }
  return { success: true, column: updatedColumn };
};

export const deleteColumn = async (columnId) => {
  await supabase.from("tasks").delete().eq("column_id", columnId);
  const { error } = await supabase.from("columns").delete().eq("id", columnId);

  if (error) {
    return { success: false, error: "Could not delete column" };
  }
  return { success: true, message: "Column deleted successfully" };
};
