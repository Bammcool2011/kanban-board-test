"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { localStorageData } from "../lib/localStorage";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isRegister, setIsRegister] = useState(false);

  useEffect(() => {
    // Initialize users in localStorage if not present
    if (!localStorage.getItem("users")) {
      localStorage.setItem("users", JSON.stringify(localStorageData.users));
    }
    const currentUser = localStorage.getItem("currentUser");
    if (currentUser) router.push("/board");
  }, []);

  const handleSubmit = () => {
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    if (isRegister) {
      const exists = users.find((u: any) => u.username === username);
      if (exists) return alert("User already exists");
      users.push({ username, password });
      localStorage.setItem("users", JSON.stringify(users));
      alert("Register success");
    } else {
      const match = users.find(
        (u: any) => u.username === username && u.password === password
      );
      if (!match) return alert("Invalid credentials");
      localStorage.setItem("currentUser", username);
      router.push("/board");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#212121]">
      <div className="bg-[#1A1A1A] p-8 rounded-xl w-full max-w-md text-white">
        <h1 className="text-2xl font-bold mb-4">
          {isRegister ? "Register" : "Login"}
        </h1>

        <input
          className="border border-[#666666] rounded-sm p-2 w-full mb-2"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          className="border border-[#666666] rounded-sm p-2 w-full mb-4"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          className="bg-[#151515] text-white px-4 py-2 w-full"
          onClick={handleSubmit}
        >
          {isRegister ? "Register" : "Login"}
        </button>

        <p className="mt-4 text-sm text-center">
          {isRegister ? "Have account?" : "Doesn't have account?"}{" "}
          <span
            className="text-blue-500 cursor-pointer mx-2"
            onClick={() => setIsRegister(!isRegister)}
          >
            {isRegister ? "Login" : "Register"}
          </span>
        </p>
      </div>
    </div>
  );
}
