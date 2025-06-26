import { supabase } from "./supabaseClient";

export const createBoard = async (boardName, invitedUsers, currentUser) => {
  const { data: newBoard, error: boardError } = await supabase
    .from("boards")
    .insert([{ title: boardName }])
    .select("id")
    .single();

  if (boardError || !newBoard) {
    return { success: false, error: "Failed to create board" };
  }

  const { data: currentUserData, error: userError } = await supabase
    .from("users")
    .select("id")
    .eq("username", currentUser)
    .single();

  if (userError || !currentUserData) {
    return { success: false, error: "Current user not found" };
  }

  const { error: memberError } = await supabase
    .from("board_members")
    .insert([{ board_id: newBoard.id, user_id: currentUserData.id }]);

  if (memberError) {
    return { success: false, error: "Failed to add you as board member" };
  }

  if (invitedUsers.length > 0) {
    const validUsers = [];
    for (const username of invitedUsers) {
      const { data: user } = await supabase
        .from("users")
        .select("username")
        .eq("username", username.trim())
        .single();
      
      if (user) validUsers.push(username);
    }

    if (validUsers.length > 0) {
      const { data: usersData } = await supabase
        .from("users")
        .select("id")
        .in("username", validUsers);

      if (usersData && usersData.length > 0) {
        const memberRecords = usersData.map(user => ({
          board_id: newBoard.id,
          user_id: user.id
        }));
        await supabase.from("board_members").insert(memberRecords);
      }
    }
  }

  return { success: true, board: newBoard };
};

export const getUserBoards = async (currentUser) => {
  const { data: userData, error: userError } = await supabase
    .from("users")
    .select("id")
    .eq("username", currentUser)
    .single();

  if (userError || !userData) {
    return { success: false, error: "User not found" };
  }

  const { data: boardsData, error: boardsError } = await supabase
    .from("board_members")
    .select(`board_id, boards (id, title)`)
    .eq("user_id", userData.id);

  if (boardsError) {
    return { success: false, error: "Failed to get boards" };
  }

  const boards = boardsData.map(item => ({
    id: item.boards.id,
    title: item.boards.title
  }));

  return { success: true, boards };
};

export const updateBoard = async (boardId, updates) => {
  const { data: updatedBoard, error } = await supabase
    .from("boards")
    .update(updates)
    .eq("id", boardId)
    .select("*")
    .single();

  if (error) {
    return { success: false, error: "Failed to update board" };
  }
  return { success: true, board: updatedBoard, message: "Board updated successfully!" };
};

export const deleteBoard = async (boardId) => {
  const { error } = await supabase.from("boards").delete().eq("id", boardId);
  if (error) {
    return { success: false, error: "Failed to delete board" };
  }
  return { success: true, message: "Board deleted successfully!" };
};

export const getBoardMembers = async (boardId) => {
  const { data: memberData, error } = await supabase
    .from("board_members")
    .select(`users (username)`)
    .eq("board_id", boardId);

  if (error) {
    return { success: false, error: "Failed to get board members" };
  }

  const members = memberData.map(item => item.users.username);
  return { success: true, members };
};
