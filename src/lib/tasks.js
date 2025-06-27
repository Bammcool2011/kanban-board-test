import { supabase } from "./supabaseClient";

export const createTask = async (columnId, title, description, priority, assignedUsers = []) => {
  const { data: lastTask } = await supabase
    .from("tasks")
    .select("position")
    .eq("column_id", columnId)
    .order("position", { ascending: false })
    .limit(1)
    .single();

  const newPosition = lastTask ? lastTask.position + 1 : 1;

  const { data: newTask } = await supabase
    .from("tasks")
    .insert([{
      column_id: columnId,
      title,
      description,
      priority: priority.toLowerCase(),
      position: newPosition
    }])
    .select("*")
    .single();

  if (assignedUsers.length > 0) {
    const { data: usersData } = await supabase
      .from("users")
      .select("id")
      .in("username", assignedUsers);

    if (usersData && usersData.length > 0) {
      const assigneeRecords = usersData.map(user => ({
        task_id: newTask.id,
        user_id: user.id
      }));
      await supabase.from("task_assignees").insert(assigneeRecords);
    }
  }

  return { success: true, task: newTask };
};

export const getTasksInColumn = async (columnId) => {
  const { data: tasks } = await supabase
    .from("tasks")
    .select(`*, task_assignees (users (username))`)
    .eq("column_id", columnId)
    .order("position");

  const formattedTasks = tasks.map(task => ({
    ...task,
    assignees: task.task_assignees.map(ta => ta.users.username)
  }));

  return { success: true, tasks: formattedTasks };
};

export const updateTask = async (taskId, changes) => {
  const { data: updatedTask } = await supabase
    .from("tasks")
    .update(changes)
    .eq("id", taskId)
    .select("*")
    .single();

  return { success: true, task: updatedTask };
};

export const deleteTask = async (taskId) => {
  await supabase.from("task_assignees").delete().eq("task_id", taskId);
  await supabase.from("tasks").delete().eq("id", taskId);

  return { success: true };
};

export const moveTaskUp = async (taskId, columnId) => {
  const { data: currentTask } = await supabase
    .from("tasks")
    .select("position")
    .eq("id", taskId)
    .single();

  const { data: taskAbove } = await supabase
    .from("tasks")
    .select("id, position")
    .eq("column_id", columnId)
    .eq("position", currentTask.position - 1)
    .single();

  await supabase.from("tasks").update({ position: currentTask.position }).eq("id", taskAbove.id);
  await supabase.from("tasks").update({ position: taskAbove.position }).eq("id", taskId);

  return { success: true };
};

export const moveTaskDown = async (taskId, columnId) => {
  const { data: currentTask } = await supabase
    .from("tasks")
    .select("position")
    .eq("id", taskId)
    .single();

  const { data: taskBelow } = await supabase
    .from("tasks")
    .select("id, position")
    .eq("column_id", columnId)
    .eq("position", currentTask.position + 1)
    .single();

  await supabase.from("tasks").update({ position: currentTask.position }).eq("id", taskBelow.id);
  await supabase.from("tasks").update({ position: taskBelow.position }).eq("id", taskId);

  return { success: true };
};
