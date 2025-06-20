import { Outlet, Link } from "react-router-dom";
import Header from "@/layouts/Header";
import Footer from "./Footer";
import { useState } from "react";

export default function MainLayout() {
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = () => setIsDark(!isDark);
  return (
    <div>

      <Header isDark={isDark} toggleTheme={toggleTheme} />
      <main className="p-6">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
