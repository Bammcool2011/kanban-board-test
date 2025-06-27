import { supabase } from "./supabaseClient";

export function createTask(columnId, title, description, priority, assignedUsers) {
  if (!assignedUsers) {
    assignedUsers = [];
  }
  return supabase
    .from("tasks")
    .select("position")
    .eq("column_id", columnId)
    .order("position", { ascending: false })
    .limit(1)
    .single()
    .then(function(result) {
      var lastTask = result.data;
      var newPosition = 1;
      if (lastTask) {
        newPosition = lastTask.position + 1;
      }
      return supabase
        .from("tasks")
        .insert([{
          column_id: columnId,
          title: title,
          description: description,
          priority: priority.toLowerCase(),
          position: newPosition
        }])
        .select("*")
        .single();
    })
    .then(function(result) {
      var newTask = result.data;
      if (assignedUsers.length > 0) {
        return supabase
          .from("users")
          .select("id")
          .in("username", assignedUsers)
          .then(function(userResult) {
            var usersData = userResult.data;
            if (usersData && usersData.length > 0) {
              var assigneeRecords = [];
              for (var i = 0; i < usersData.length; i++) {
                assigneeRecords.push({
                  task_id: newTask.id,
                  user_id: usersData[i].id
                });
              }
              return supabase.from("task_assignees").insert(assigneeRecords)
                .then(function() {
                  return { success: true, task: newTask };
                });
            } else {
              return { success: true, task: newTask };
            }
          });
      } else {
        return { success: true, task: newTask };
      }
    });
}

export function getTasksInColumn(columnId) {
  return supabase
    .from("tasks")
    .select(`*, task_assignees (users (username))`)
    .eq("column_id", columnId)
    .order("position")
    .then(result => ({
      success: !result.error,
      tasks: (result.data || []).map(task => ({
        ...task,
        assignees: (task.task_assignees || []).map(assignee => assignee.users?.username).filter(Boolean)
      }))
    }));
}

export function updateTask(taskId, updates) {
  return supabase
    .from("tasks")
    .update(updates)
    .eq("id", taskId)
    .select("*")
    .single();
}

export function deleteTask(taskId) {
  return supabase
    .from("task_assignees")
    .delete()
    .eq("task_id", taskId)
    .then(function() {
      return supabase
        .from("tasks")
        .delete()
        .eq("id", taskId)
        .then(result => ({ success: !result.error }));
    });
}

export function updateTaskAssignees(taskId, usernames) {
  return supabase
    .from("task_assignees")
    .delete()
    .eq("task_id", taskId)
    .then(function() {
      if (usernames.length > 0) {
        return supabase
          .from("users")
          .select("id")
          .in("username", usernames)
          .then(function(userResult) {
            var usersData = userResult.data;
            if (usersData && usersData.length > 0) {
              var assigneeRecords = [];
              for (var i = 0; i < usersData.length; i++) {
                assigneeRecords.push({
                  task_id: taskId,
                  user_id: usersData[i].id
                });
              }
              return supabase.from("task_assignees").insert(assigneeRecords);
            }
          });
      }
    });
}

export async function moveTaskUp(taskId, columnId) {
  const { data: tasks, error } = await supabase
    .from("tasks")
    .select("id, position")
    .eq("column_id", columnId)
    .order("position");
  if (error || !tasks) return { success: false };
  const idx = tasks.findIndex(t => t.id === taskId);
  if (idx > 0) {
    const prevTask = tasks[idx - 1];
    const currTask = tasks[idx];
    await supabase.from("tasks").update({ position: prevTask.position }).eq("id", currTask.id);
    await supabase.from("tasks").update({ position: currTask.position }).eq("id", prevTask.id);
    return { success: true };
  }
  return { success: false };
}

export async function moveTaskDown(taskId, columnId) {
  const { data: tasks, error } = await supabase
    .from("tasks")
    .select("id, position")
    .eq("column_id", columnId)
    .order("position");
  if (error || !tasks) return { success: false };
  const idx = tasks.findIndex(t => t.id === taskId);
  if (idx < tasks.length - 1 && idx !== -1) {
    const nextTask = tasks[idx + 1];
    const currTask = tasks[idx];
    await supabase.from("tasks").update({ position: nextTask.position }).eq("id", currTask.id);
    await supabase.from("tasks").update({ position: currTask.position }).eq("id", nextTask.id);
    return { success: true };
  }
  return { success: false };
}
