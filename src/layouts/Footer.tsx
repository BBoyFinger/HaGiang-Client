import { FiMapPin, FiSun, FiMoon } from "react-icons/fi"
import logo from "@/assets/logo.jpg"
import { Link } from "react-router-dom";

const Footer = ({ isDark, toggleTheme }: any) => (
    <footer className={`fixed w-full z-50 ${isDark ? "bg-gray-900" : "bg-white"} shadow-lg`}>
        {/* <nav className="bg-white shadow p-4 flex gap-4">
                <Link to="/" className="text-blue-600 font-semibold">Home</Link>
                <Link to="/about" className="text-blue-600 font-semibold">About</Link>
              </nav> */}
        <div className="container mx-auto px-6 py-4">
            {/* <div className="flex items-center justify-between">
                <Link to="/" className="flex items-center">
                    <img src={logo} alt="logo" className="w-16 h-16" />
                    <span className={`ml-2 text-xl font-bold ${isDark ? "text-white" : "text-gray-800"}`}>Homie Travel</span>
                </Link>
                <nav className="hidden md:flex space-x-8">
                    <Link to="/" className={`${isDark ? "text-white" : "text-gray-800"} hover:text-blue-500`}>Home</Link>
                    <a href="#" className={`${isDark ? "text-white" : "text-gray-800"} hover:text-blue-500`}>Destinations</a>
                    <a href="#" className={`${isDark ? "text-white" : "text-gray-800"} hover:text-blue-500`}>Packages</a>
                    <a href="#" className={`${isDark ? "text-white" : "text-gray-800"} hover:text-blue-500`}>Contact</a>
                </nav>
                <button
                    onClick={toggleTheme}
                    className={`p-2 rounded-full ${isDark ? "bg-gray-800" : "bg-gray-100"}`}
                >
                    {isDark ? <FiSun className="text-yellow-400" /> : <FiMoon className="text-gray-600" />}
                </button>
            </div> */}
        </div>
    </footer>
);

export default Footer;