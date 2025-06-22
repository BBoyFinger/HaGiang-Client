import { useState } from "react";
import { useUser } from "../contexts/UserContext";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function Login() {
  const { t } = useTranslation();
  const [tab, setTab] = useState<"login" | "register">("login");
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  // const { login } = useUser();
  const navigate = useNavigate();

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (!form.username || !form.password) {
      setError(t("login.error"));
      return;
    }
    // Đăng nhập hoặc đăng ký logic ở đây
    // login(form.username);
    navigate("/");
  };

  return (
    <div className="max-w-sm mx-auto mt-20 bg-white dark:bg-gray-800 p-6 rounded shadow">
      <div className="flex mb-4">
        <button
          className={`flex-1 py-2 font-semibold rounded-l ${tab === "login" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"}`}
          onClick={() => setTab("login")}
        >
          {t("login.title")}
        </button>
        <button
          className={`flex-1 py-2 font-semibold rounded-r ${tab === "register" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"}`}
          onClick={() => setTab("register")}
        >
          {t("login.registerTitle")}
        </button>
      </div>
      <form onSubmit={handleSubmit}>
        <input
          className="border rounded px-3 py-2 w-full mb-3"
          name="username"
          placeholder={t("login.usernamePlaceholder")}
          value={form.username}
          onChange={handleChange}
        />
        <input
          className="border rounded px-3 py-2 w-full mb-3"
          name="password"
          type="password"
          placeholder={t("login.passwordPlaceholder")}
          value={form.password}
          onChange={handleChange}
        />
        {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded w-full">
          {tab === "login" ? t("login.submit") : t("login.register")}
        </button>
      </form>
    </div>
  );
}