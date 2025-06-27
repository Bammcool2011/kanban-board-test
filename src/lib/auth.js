import { supabase } from "./supabaseClient";

export const loginUser = async (username, password) => {
  const { data } = await supabase
    .from("users")
    .select("*")
    .eq("username", username)
    .eq("password", password)
    .single();

  if (data) {
    return { success: true, user: data };
  }
  return { success: false };
};

export const registerUser = async (username, password) => {
  const existingUser = await checkUserExists(username);
  if (existingUser) {
    return { success: false, message: "Username already exists!" };
  }

  await supabase
    .from("users")
    .insert([{ username, password }]);

  return { success: true, message: "Registered successfully!" };
};

export const checkUserExists = async (username) => {
  const { data: user } = await supabase
    .from("users")
    .select("username")
    .eq("username", username.trim())
    .single();

  return user;
};
