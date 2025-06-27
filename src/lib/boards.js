import { supabase } from "./supabaseClient";

export const createBoard = async (boardName, invitedUsers, currentUser) => {
  const { data: newBoard } = await supabase
    .from("boards")
    .insert([{ title: boardName }])
    .select("id")
    .single();

  const { data: currentUserData } = await supabase
    .from("users")
    .select("id")
    .eq("username", currentUser)
    .single();

  await supabase
    .from("board_members")
    .insert([{ board_id: newBoard.id, user_id: currentUserData.id }]);

  if (invitedUsers.length > 0) {
    const userChecks = invitedUsers.map(username =>
      supabase
        .from("users")
        .select("username")
        .eq("username", username.trim())
        .single()
    );
    
    const userResults = await Promise.all(userChecks);
    const validUsers = userResults
      .filter(result => result.data)
      .map(result => result.data.username);

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
  const { data: userData } = await supabase
    .from("users")
    .select("id")
    .eq("username", currentUser)
    .single();

  const { data: boardsData } = await supabase
    .from("board_members")
    .select(`board_id, boards (id, title)`)
    .eq("user_id", userData.id);

  const boards = boardsData.map(item => ({
    id: item.boards.id,
    title: item.boards.title
  }));

  return { success: true, boards };
};

export const updateBoard = async (boardId, updates) => {
  const { data: updatedBoard } = await supabase
    .from("boards")
    .update(updates)
    .eq("id", boardId)
    .select("*")
    .single();

  return { success: true, board: updatedBoard };
};

export const deleteBoard = async (boardId) => {
  await supabase.from("boards").delete().eq("id", boardId);
  return { success: true };
};

export const getBoardMembers = async (boardId) => {
  const { data: memberData } = await supabase
    .from("board_members")
    .select(`users (username)`)
    .eq("board_id", boardId);

  const members = memberData.map(item => item.users.username);
  return { success: true, members };
};

export const updateBoardMembers = async (boardId, newMembers) => {
  await supabase
    .from("board_members")
    .delete()
    .eq("board_id", boardId);

  if (newMembers.length > 0) {
    const userChecks = newMembers.map(username =>
      supabase
        .from("users")
        .select("username")
        .eq("username", username.trim())
        .single()
    );
    
    const userResults = await Promise.all(userChecks);
    const validUsers = userResults
      .filter(result => result.data)
      .map(result => result.data.username);

    if (validUsers.length > 0) {
      const { data: usersData } = await supabase
        .from("users")
        .select("id")
        .in("username", validUsers);

      if (usersData && usersData.length > 0) {
        const memberRecords = usersData.map(user => ({
          board_id: boardId,
          user_id: user.id
        }));
        await supabase.from("board_members").insert(memberRecords);
      }
    }
  }

  return { success: true };
};
