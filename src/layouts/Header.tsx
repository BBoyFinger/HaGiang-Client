import { FiMapPin, FiSun, FiMoon, FiMenu } from "react-icons/fi";
import logo from "@/assets/logo.jpg";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "@/components/LanguageSwitcher";

const Header = ({
  isDark,
  toggleTheme,
}: {
  isDark: boolean;
  toggleTheme: () => void;
}) => {
  const { t } = useTranslation();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <header
      className={`fixed w-full z-50 ${isDark ? "bg-gray-900" : "bg-white"
        } shadow-lg`}
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img src={logo} alt="logo" className="w-16 h-16" />
            <span
              className={`ml-2 text-xl font-bold ${isDark ? "text-white" : "text-gray-800"
                }`}
            >
              Homie Travel
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex space-x-8">
            <Link
              to="/"
              className={
                isDark
                  ? "text-white hover:text-blue-500"
                  : "text-gray-800 hover:text-blue-500"
              }
            >
              {t("nav.home")}
            </Link>
            <Link
              to="/booking"
              className={
                isDark
                  ? "text-white hover:text-blue-500"
                  : "text-gray-800 hover:text-blue-500"
              }
            >
              {t("nav.booking")}
            </Link>
            <Link
              to="/rent"
              className={
                isDark
                  ? "text-white hover:text-blue-500"
                  : "text-gray-800 hover:text-blue-500"
              }
            >
              {t("nav.rent")}
            </Link>
            <Link
              to="/stay"
              className={
                isDark
                  ? "text-white hover:text-blue-500"
                  : "text-gray-800 hover:text-blue-500"
              }
            >
              {t("nav.stay")}
            </Link>
            <Link
              to="/trip"
              className={
                isDark
                  ? "text-white hover:text-blue-500"
                  : "text-gray-800 hover:text-blue-500"
              }
            >
              {t("nav.trip")}
            </Link>
            <Link
              to="/about"
              className={
                isDark
                  ? "text-white hover:text-blue-500"
                  : "text-gray-800 hover:text-blue-500"
              }
            >
              {t("nav.about")}
            </Link>
            <Link
              to="/contact"
              className={
                isDark
                  ? "text-white hover:text-blue-500"
                  : "text-gray-800 hover:text-blue-500"
              }
            >
              {t("nav.contact")}
            </Link>
            <Link
              to="/login"
              className={
                isDark
                  ? "text-white hover:text-blue-500"
                  : "text-gray-800 hover:text-blue-500"
              }
            >
              {t("nav.login")}
            </Link>

          </nav>

          {/* Mobile nav button */}
          <button
            className="md:hidden p-2 rounded-full focus:outline-none"
            onClick={() => setMobileNavOpen((v) => !v)}
            aria-label="Open navigation"
          >
            <FiMenu className={`${isDark ? "text-white" : "text-gray-800"} text-2xl`} />
          </button>

          {/* Theme + Language */}
          <div className="flex items-center space-x-3">
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-full ${isDark ? "bg-gray-800" : "bg-gray-100"
                }`}
              aria-label="Toggle theme"
            >
              {isDark ? (
                <FiSun className="text-yellow-400" />
              ) : (
                <FiMoon className="text-gray-600" />
              )}
            </button>

            <LanguageSwitcher isDark={isDark} />
          </div>
        </div>

        {/* Mobile nav menu */}
        {mobileNavOpen && (
          <nav className="md:hidden mt-4 flex flex-col gap-2 animate-fade-in-down">
            <Link
              to="/"
              className={`${isDark ? "text-white" : "text-gray-800"} hover:text-blue-500`}
              onClick={() => setMobileNavOpen(false)}
            >
              {t("nav.home")}
            </Link>
            <Link
              to="/booking"
              className={`${isDark ? "text-white" : "text-gray-800"} hover:text-blue-500`}
              onClick={() => setMobileNavOpen(false)}
            >
              {t("nav.booking")}
            </Link>
            <Link
              to="/rent"
              className={`${isDark ? "text-white" : "text-gray-800"} hover:text-blue-500`}
              onClick={() => setMobileNavOpen(false)}
            >
              {t("nav.rent")}
            </Link>
            <Link
              to="/stay"
              className={`${isDark ? "text-white" : "text-gray-800"} hover:text-blue-500`}
              onClick={() => setMobileNavOpen(false)}
            >
              {t("nav.stay")}
            </Link>
            <Link
              to="/trip"
              className={`${isDark ? "text-white" : "text-gray-800"} hover:text-blue-500`}
              onClick={() => setMobileNavOpen(false)}
            >
              {t("nav.trip")}
            </Link>
            <Link
              to="/about"
              className={`${isDark ? "text-white" : "text-gray-800"} hover:text-blue-500`}
              onClick={() => setMobileNavOpen(false)}
            >
              {t("nav.about")}
            </Link>
            <Link
              to="/contact"
              className={`${isDark ? "text-white" : "text-gray-800"} hover:text-blue-500`}
              onClick={() => setMobileNavOpen(false)}
            >
              {t("nav.contact")}
            </Link>
            <Link
              to="/login"
              className={`${isDark ? "text-white" : "text-gray-800"} hover:text-blue-500`}
              onClick={() => setMobileNavOpen(false)}
            >
              {t("nav.login")}
            </Link>

          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
