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
    .order("position");
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
        .eq("id", taskId);
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
