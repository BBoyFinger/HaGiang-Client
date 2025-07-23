import { FiMapPin, FiSun, FiMoon, FiMenu, FiX, FiUser, FiHeart, FiSearch } from "react-icons/fi";
import { FaHeart } from "react-icons/fa";
import logo from "@/assets/logo.jpg";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { logoutUser } from '../store/slice/userSlice';

const Header = ({
  isDark,
  toggleTheme,
}: {
  isDark: boolean;
  toggleTheme: () => void;
}) => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, isAuthenticated } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  // Xóa các state, useRef, useEffect, hàm handleSearchSubmit liên quan đến search ở header

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (showMenu && !target.closest('.user-menu')) {
        setShowMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showMenu]);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { path: "/", label: t("nav.home") },
    { path: "/tour", label: t("nav.tour") },
    { path: "/rent", label: t("nav.rent") },
    { path: "/stay", label: t("nav.stay") },
    { path: "/destinations", label: t("nav.destination") },
    { path: "/blogs", label: "Blog" },
    { path: "/about", label: t("nav.about") },
    { path: "/contact", label: t("nav.contact") },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header
      className={`fixed w-full z-50 transition-all duration-300 ${isScrolled
        ? `${isDark ? "bg-earth/95 backdrop-blur-md" : "bg-light/95 backdrop-blur-md"} shadow-lg`
        : `${isDark ? "bg-earth" : "bg-light"}`
        }`}
    >
      <div className="container mx-auto px-4 lg:px-6 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center group">
            <div className="relative">
              <img src={logo} alt="logo" className="w-12 h-12 lg:w-14 lg:h-14 rounded-full object-cover transition-transform group-hover:scale-110" />
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary to-accent opacity-0 group-hover:opacity-20 transition-opacity"></div>
            </div>
            <div className="ml-3">
              <span className={`text-lg lg:text-xl font-bold ${isDark ? "text-light" : "text-[#1a1a1a]"}`}>
                Homie Travel
              </span>
              <div className={`text-xs ${isDark ? "text-secondary" : "text-[#555]"}`}>
                Hà Giang Experience
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`relative px-4 py-2 rounded-lg font-medium transition-all duration-300 ${isActive(item.path)
                  ? `${isDark ? "text-primary bg-earth/20" : "text-primary bg-secondary/60"}`
                  : `${isDark ? "text-light hover:text-primary hover:bg-earth/60" : "text-[#555] hover:text-primary hover:bg-secondary/40"}`
                  }`}
              >
                {item.label}
                {isActive(item.path) && (
                  <motion.div
                    layoutId="activeTab"
                    className={`absolute bottom-0 left-0 right-0 h-0.5 ${isDark ? "bg-primary" : "bg-primary"}`}
                    initial={false}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </Link>
            ))}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-2 lg:space-x-4">
            {/* Search Button */}
            {/* Xóa hoàn toàn nút search (FiSearch) khỏi header, không render nữa */}

            {/* Favorites */}
            <Link
              to="/favorites"
              className={`p-2 rounded-lg transition-all duration-300 ${isDark
                ? "text-light hover:text-primary hover:bg-earth/60"
                : "text-[#555] hover:text-primary hover:bg-secondary/40"
                }`}
            >
              <FaHeart className="text-lg" />
            </Link>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg transition-all duration-300 ${isDark
                ? "bg-earth hover:bg-primary/80 text-accent"
                : "bg-secondary hover:bg-primary/80 text-[#1a1a1a]"
                }`}
              aria-label="Toggle theme"
            >
              {isDark ? <FiSun className="text-lg" /> : <FiMoon className="text-lg" />}
            </button>

            {/* Language Switcher */}
            <LanguageSwitcher isDark={isDark} />

            {/* Login Button */}
            {!isAuthenticated ? (
              <Link
                to="/login"
                className={`hidden md:flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-300 ${isDark
                  ? "bg-primary hover:bg-accent text-[#1a1a1a]"
                  : "bg-gradient-to-r from-primary to-accent hover:from-accent hover:to-primary text-[#1a1a1a]"
                  }`}
              >
                <FiUser className="mr-2" />
                {t("nav.login")}
              </Link>
            ) : (
              <div className="relative user-menu">
                <button
                  className="flex items-center focus:outline-none"
                  onClick={() => setShowMenu((v) => !v)}
                >
                  <img
                    src={user?.avatarUrl || logo}
                    alt="avatar"
                    className="w-10 h-10 rounded-full object-cover border-2 border-primary"
                  />
                </button>
                {showMenu && (
                  <div className={`absolute right-0 mt-2 w-40 bg-light rounded-lg shadow-lg py-2 z-50 ${isDark ? 'bg-earth text-light' : 'bg-light text-[#1a1a1a]'}`}>
                    <button
                      className="block w-full text-left px-4 py-2 hover:bg-secondary"
                      onClick={() => { navigate('/profile'); setShowMenu(false); }}
                    >
                      Trang cá nhân
                    </button>
                    {user?.role === 'admin' && (
                      <button
                        className="block w-full text-left px-4 py-2 hover:bg-accent text-primary font-medium"
                        onClick={() => { navigate('/admin'); setShowMenu(false); }}
                      >
                        🛠️ Admin Dashboard
                      </button>
                    )}
                    <button
                      className="block w-full text-left px-4 py-2 hover:bg-secondary"
                      onClick={() => {
                        dispatch(logoutUser() as any);
                        setShowMenu(false);
                        navigate('/');
                      }}
                    >
                      Đăng xuất
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 rounded-lg transition-all duration-300"
              onClick={() => setMobileNavOpen(!mobileNavOpen)}
              aria-label="Toggle navigation"
            >
              {mobileNavOpen ? (
                <FiX className={`text-2xl ${isDark ? "text-light" : "text-[#1a1a1a]"}`} />
              ) : (
                <FiMenu className={`text-2xl ${isDark ? "text-light" : "text-[#1a1a1a]"}`} />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {mobileNavOpen && (
            <motion.nav
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden mt-4 overflow-hidden"
            >
              <div className={`py-4 space-y-2 ${isDark ? "bg-earth" : "bg-secondary"} rounded-lg`}>
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`block px-4 py-3 rounded-lg font-medium transition-all duration-300 ${isActive(item.path)
                      ? `${isDark ? "text-primary bg-earth/20" : "text-primary bg-secondary/60"}`
                      : `${isDark ? "text-light hover:text-primary hover:bg-earth/60" : "text-[#555] hover:text-primary hover:bg-secondary/40"}`
                      }`}
                    onClick={() => setMobileNavOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}

                {/* Mobile Login Button */}
                <div className="px-4 pt-2">
                  {!isAuthenticated ? (
                    <Link
                      to="/login"
                      className={`block w-full text-center px-4 py-3 rounded-lg font-medium transition-all duration-300 ${isDark
                        ? "bg-primary hover:bg-accent text-[#1a1a1a]"
                        : "bg-gradient-to-r from-primary to-accent hover:from-accent hover:to-primary text-[#1a1a1a]"
                        }`}
                      onClick={() => setMobileNavOpen(false)}
                    >
                      <FiUser className="inline mr-2" />
                      {t("nav.login")}
                    </Link>
                  ) : (
                    <div className="relative user-menu">
                      <button
                        className="flex items-center focus:outline-none"
                        onClick={() => setShowMenu((v) => !v)}
                      >
                        <img
                          src={user?.avatarUrl || logo}
                          alt="avatar"
                          className="w-10 h-10 rounded-full object-cover border-2 border-primary"
                        />
                      </button>
                      {showMenu && (
                        <div className={`absolute right-0 mt-2 w-40 bg-light rounded-lg shadow-lg py-2 z-50 ${isDark ? 'bg-earth text-light' : 'bg-light text-[#1a1a1a]'}`}>
                          <button
                            className="block w-full text-left px-4 py-2 hover:bg-secondary"
                            onClick={() => { navigate('/profile'); setShowMenu(false); }}
                          >
                            Trang cá nhân
                          </button>
                          {user?.role === 'admin' && (
                            <button
                              className="block w-full text-left px-4 py-2 hover:bg-accent text-primary font-medium"
                              onClick={() => { navigate('/admin'); setShowMenu(false); }}
                            >
                              🛠️ Admin Dashboard
                            </button>
                          )}
                          <button
                            className="block w-full text-left px-4 py-2 hover:bg-secondary"
                            onClick={() => { dispatch(logoutUser() as any); setShowMenu(false); navigate('/'); }}
                          >
                            Đăng xuất
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default Header;