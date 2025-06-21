import { FiMapPin, FiSun, FiMoon } from "react-icons/fi";
import logo from "@/assets/logo.jpg";
import { Link } from "react-router-dom";

import { useState } from "react";

import { useTranslation } from "react-i18next";

const Header = ({
  isDark,
  toggleTheme,
}: {
  isDark: boolean;
  toggleTheme: () => void;
}) => {
  const { t, i18n } = useTranslation();
  console.log(t("nav"));

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === "vi" ? "en" : "vi");
  };

  return (
    <header
      className={`fixed w-full z-50 ${
        isDark ? "bg-gray-900" : "bg-white"
      } shadow-md`}
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img src={logo} alt="logo" className="w-10 h-10 rounded-full" />
            <span
              className={`ml-2 text-xl font-bold ${
                isDark ? "text-white" : "text-gray-800"
              }`}
            >
              Ha Giang Travel
            </span>
          </Link>

          {/* Nav Links */}
          <nav className="hidden md:flex space-x-6">
            <Link
              to="/"
              className={
                isDark
                  ? "text-white hover:text-blue-400"
                  : "text-gray-800 hover:text-blue-500"
              }
            >
              {t("nav.home")}
            </Link>

            <Link
              to="/booking"
              className={
                isDark
                  ? "text-white hover:text-blue-400"
                  : "text-gray-800 hover:text-blue-500"
              }
            >
              {t("nav.booking")}
            </Link>
            <Link
              to="/rent"
              className={
                isDark
                  ? "text-white hover:text-blue-400"
                  : "text-gray-800 hover:text-blue-500"
              }
            >
              {t("nav.rent")}
            </Link>
            <Link
              to="/stay"
              className={
                isDark
                  ? "text-white hover:text-blue-400"
                  : "text-gray-800 hover:text-blue-500"
              }
            >
              {t("nav.stay")}
            </Link>
            <Link
              to="/trip"
              className={
                isDark
                  ? "text-white hover:text-blue-400"
                  : "text-gray-800 hover:text-blue-500"
              }
            >
              {t("nav.trip")}
            </Link>
            <Link
              to="/about"
              className={
                isDark
                  ? "text-white hover:text-blue-400"
                  : "text-gray-800 hover:text-blue-500"
              }
            >
              {t("nav.about")}
            </Link>
            <Link
              to="/contact"
              className={
                isDark
                  ? "text-white hover:text-blue-400"
                  : "text-gray-800 hover:text-blue-500"
              }
            >
              {t("nav.contact")}
            </Link>
            <Link
              to="/login"
              className={
                isDark
                  ? "text-white hover:text-blue-400"
                  : "text-gray-800 hover:text-blue-500"
              }
            >
              {t("nav.login")}
            </Link>
          </nav>

          {/* Theme + Language */}
          <div className="flex items-center space-x-3">
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-full ${
                isDark ? "bg-gray-800" : "bg-gray-100"
              }`}
              aria-label="Toggle theme"
            >
              {isDark ? (
                <FiSun className="text-yellow-400" />
              ) : (
                <FiMoon className="text-gray-600" />
              )}
            </button>

            <button
              onClick={toggleLanguage}
              className={`text-sm font-semibold border px-3 py-1 rounded ${
                isDark
                  ? "text-white border-white"
                  : "text-gray-800 border-gray-800"
              } hover:bg-blue-500 hover:text-white transition`}
            >
              {i18n.language === "vi" ? "EN" : "VI"}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
