import { supabase } from "./supabaseClient";

export const createColumn = async (boardId, columnTitle) => {
  const { data: lastColumn } = await supabase
    .from("columns")
    .select("position")
    .eq("board_id", boardId)
    .order("position", { ascending: false })
    .limit(1)
    .single();

  const newPosition = lastColumn ? lastColumn.position + 1 : 1;

  const { data: newColumn } = await supabase
    .from("columns")
    .insert([{ 
      board_id: boardId, 
      title: columnTitle,
      position: newPosition 
    }])
    .select("*")
    .single();

  return { success: true, column: newColumn };
};

export const getColumnsForBoard = async (boardId) => {
  const { data: columns } = await supabase
    .from("columns")
    .select("*")
    .eq("board_id", boardId)
    .order("position");

  return { success: true, columns: columns || [] };
};

export const updateColumn = async (columnId, changes) => {
  const { data: updatedColumn } = await supabase
    .from("columns")
    .update(changes)
    .eq("id", columnId)
    .select("*")
    .single();

  return { success: true, column: updatedColumn };
};

export const deleteColumn = async (columnId) => {
  await supabase.from("tasks").delete().eq("column_id", columnId);
  await supabase.from("columns").delete().eq("id", columnId);
  return { success: true };
};
