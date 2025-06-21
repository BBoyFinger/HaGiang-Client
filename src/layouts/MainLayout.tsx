import { Outlet, Link } from "react-router-dom";
import Header from "@/layouts/Header";
import Footer from "./Footer";
import { useState } from "react";

export default function MainLayout() {
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = () => setIsDark(!isDark);
  return (
    <div className={`min-h-screen ${isDark ? "bg-gray-900" : "bg-white"}`}>
      <Header isDark={isDark} toggleTheme={toggleTheme} />
      <main className="pt-20">
        <Outlet />
      </main>
      <Footer isDark={isDark} toggleTheme={toggleTheme} />
    </div>
  )
}
