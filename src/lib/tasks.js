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

  const { data: newTask, error } = await supabase
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

  if (error) {
    return { success: false, error: "Could not create task" };
  }

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
  const { data: tasks, error } = await supabase
    .from("tasks")
    .select(`*, task_assignees (users (username))`)
    .eq("column_id", columnId)
    .order("position");

  if (error) {
    return { success: false, error: "Could not get tasks" };
  }

  const formattedTasks = tasks.map(task => ({
    ...task,
    assignees: task.task_assignees.map(ta => ta.users.username)
  }));

  return { success: true, tasks: formattedTasks };
};

export const updateTask = async (taskId, changes) => {
  const { data: updatedTask, error } = await supabase
    .from("tasks")
    .update(changes)
    .eq("id", taskId)
    .select("*")
    .single();

  if (error) {
    return { success: false, error: "Could not update task" };
  }
  return { success: true, task: updatedTask };
};

export const deleteTask = async (taskId) => {
  await supabase.from("task_assignees").delete().eq("task_id", taskId);
  const { error } = await supabase.from("tasks").delete().eq("id", taskId);

  if (error) {
    return { success: false, error: "Could not delete task" };
  }
  return { success: true, message: "Task deleted successfully" };
};

export const moveTaskUp = async (taskId, columnId) => {
  const { data: currentTask } = await supabase
    .from("tasks")
    .select("position")
    .eq("id", taskId)
    .single();

  if (!currentTask || currentTask.position <= 1) {
    return { success: false, error: "Task is already at the top" };
  }

  const { data: taskAbove } = await supabase
    .from("tasks")
    .select("id, position")
    .eq("column_id", columnId)
    .eq("position", currentTask.position - 1)
    .single();

  if (!taskAbove) {
    return { success: false, error: "No task above to swap with" };
  }

  await supabase.from("tasks").update({ position: currentTask.position }).eq("id", taskAbove.id);
  await supabase.from("tasks").update({ position: taskAbove.position }).eq("id", taskId);

  return { success: true, message: "Task moved up" };
};

export const moveTaskDown = async (taskId, columnId) => {
  const { data: currentTask } = await supabase
    .from("tasks")
    .select("position")
    .eq("id", taskId)
    .single();

  if (!currentTask) {
    return { success: false, error: "Task not found" };
  }

  const { data: taskBelow } = await supabase
    .from("tasks")
    .select("id, position")
    .eq("column_id", columnId)
    .eq("position", currentTask.position + 1)
    .single();

  if (!taskBelow) {
    return { success: false, error: "Task is already at the bottom" };
  }

  await supabase.from("tasks").update({ position: currentTask.position }).eq("id", taskBelow.id);
  await supabase.from("tasks").update({ position: taskBelow.position }).eq("id", taskId);

  return { success: true, message: "Task moved down" };
};
