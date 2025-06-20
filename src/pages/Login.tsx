import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext";

export default function Login() {
  const [username, setUsername] = useState("");
  const { login } = useUser();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username) return;
    login(username);
    navigate("/");
  };

  return (
    <div className="max-w-sm mx-auto mt-20 bg-white dark:bg-gray-800 p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4">Đăng nhập / Đăng ký</h2>
      <form onSubmit={handleSubmit}>
        <input
          className="border rounded px-3 py-2 w-full mb-3"
          placeholder="Tên đăng nhập"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <button type="submit" className="bg-blue-600 text-red px-4 py-2 rounded w-full">Đăng nhập</button>
      </form>
    </div>
  );
} 