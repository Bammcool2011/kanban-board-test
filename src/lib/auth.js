import { supabase } from "./supabaseClient";

export const loginUser = async (username, password) => {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("username", username)
    .eq("password", password)
    .single();

  if (error || !data) {
    return { success: false, error: "Invalid credentials" };
  }
  return { success: true, user: data };
};

export const registerUser = async (username, password) => {
  const { error } = await supabase
    .from("users")
    .insert([{ username, password }]);

  if (error) {
    return { success: false, error: "Registration failed" };
  }
  return { success: true, message: "User registered successfully" };
};

export const checkUserExists = async (username) => {
  const { data: user, error } = await supabase
    .from("users")
    .select("username")
    .eq("username", username.trim())
    .single();

  return !error && user;
};
