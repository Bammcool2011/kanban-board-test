"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginUser, registerUser } from "../../lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isRegister, setIsRegister] = useState(false);

  const handleSubmit = async () => {
    if (isRegister) {
      const result = await registerUser(username, password);
      if (result.success) {
        alert(result.message);
        setIsRegister(false);
      } else {
        alert(result.message);
      }
    } else {
      const result = await loginUser(username, password);
      if (result.success) {
        localStorage.setItem("username", username);
        router.push("/board");
      } else {
        alert("Invalid username or password!");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#212121]">
      <div className="bg-[#1A1A1A] p-8 rounded-xl w-full max-w-md text-white">
        <h1 className="text-2xl font-bold mb-4">
          {isRegister ? "Register" : "Login"}
        </h1>

        <input
          className="border border-[#666666] rounded-sm p-2 w-full mb-2 bg-[#2A2A2A] text-white"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          className="border border-[#666666] rounded-sm p-2 w-full mb-4 bg-[#2A2A2A] text-white"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          className="bg-[#151515] text-white px-4 py-2 w-full hover:bg-[#202020]"
          onClick={handleSubmit}
        >
          {isRegister ? "Register" : "Login"}
        </button>

        <p className="mt-4 text-sm text-center">
          {isRegister ? "Have account?" : "Doesn't have account?"}{" "}
          <span
            className="text-blue-500 cursor-pointer mx-2 hover:text-blue-400"
            onClick={() => setIsRegister(!isRegister)}
          >
            {isRegister ? "Login" : "Register"}
          </span>
        </p>
      </div>
    </div>
  );
}
