import { FiMapPin, FiPhone, FiMail, FiFacebook, FiInstagram, FiTwitter, FiYoutube, FiHeart } from "react-icons/fi";
import { FaFacebookF, FaInstagram, FaTwitter, FaYoutube, FaTiktok } from "react-icons/fa";
import logo from "@/assets/logo.jpg";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

interface FooterProps {
  isDark: boolean;
  toggleTheme: () => void;
}

const Footer = ({ isDark, toggleTheme }: FooterProps) => {
  const { t } = useTranslation();
  
  const currentYear = new Date().getFullYear();

  return (
    <footer className={`${isDark ? "bg-gray-900 text-white" : "bg-white text-gray-800"} border-t ${isDark ? "border-gray-700" : "border-gray-200"}`}>
      {/* Main Footer Content */}
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Company Info */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center">
              <img src={logo} alt="Ha Giang Travel" className="w-12 h-12 rounded-full" />
              <span className="ml-3 text-xl font-bold">Homie Travel</span>
            </Link>
            <p className="text-sm leading-relaxed opacity-80">
              {t("footer.company.description")}
            </p>
            <div className="flex space-x-4">
              <a 
                href="#" 
                className={`p-2 rounded-full transition-colors ${
                  isDark 
                    ? "bg-gray-800 hover:bg-blue-600 text-white" 
                    : "bg-gray-100 hover:bg-blue-500 hover:text-white text-gray-600"
                }`}
                aria-label="Facebook"
              >
                <FaFacebookF size={16} />
              </a>
              <a 
                href="#" 
                className={`p-2 rounded-full transition-colors ${
                  isDark 
                    ? "bg-gray-800 hover:bg-pink-600 text-white" 
                    : "bg-gray-100 hover:bg-pink-500 hover:text-white text-gray-600"
                }`}
                aria-label="Instagram"
              >
                <FaInstagram size={16} />
              </a>
              <a 
                href="#" 
                className={`p-2 rounded-full transition-colors ${
                  isDark 
                    ? "bg-gray-800 hover:bg-blue-400 text-white" 
                    : "bg-gray-100 hover:bg-blue-400 hover:text-white text-gray-600"
                }`}
                aria-label="Twitter"
              >
                <FaTwitter size={16} />
              </a>
              <a 
                href="#" 
                className={`p-2 rounded-full transition-colors ${
                  isDark 
                    ? "bg-gray-800 hover:bg-red-600 text-white" 
                    : "bg-gray-100 hover:bg-red-500 hover:text-white text-gray-600"
                }`}
                aria-label="YouTube"
              >
                <FaYoutube size={16} />
              </a>
              <a 
                href="#" 
                className={`p-2 rounded-full transition-colors ${
                  isDark 
                    ? "bg-gray-800 hover:bg-black text-white" 
                    : "bg-gray-100 hover:bg-black hover:text-white text-gray-600"
                }`}
                aria-label="TikTok"
              >
                <FaTiktok size={16} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{t("footer.quickLinks")}</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/" 
                  className={`text-sm hover:text-blue-500 transition-colors ${
                    isDark ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  {t("nav.home")}
                </Link>
              </li>
              <li>
                <Link 
                  to="/about" 
                  className={`text-sm hover:text-blue-500 transition-colors ${
                    isDark ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  {t("nav.about")}
                </Link>
              </li>
              <li>
                <Link 
                  to="/destinations" 
                  className={`text-sm hover:text-blue-500 transition-colors ${
                    isDark ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  {t("destinations.title")}
                </Link>
              </li>
              <li>
                <Link 
                  to="/tours" 
                  className={`text-sm hover:text-blue-500 transition-colors ${
                    isDark ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  {t("tours.title")}
                </Link>
              </li>
              <li>
                <Link 
                  to="/booking" 
                  className={`text-sm hover:text-blue-500 transition-colors ${
                    isDark ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  {t("nav.booking")}
                </Link>
              </li>
              <li>
                <Link 
                  to="/contact" 
                  className={`text-sm hover:text-blue-500 transition-colors ${
                    isDark ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  {t("nav.contact")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{t("footer.services")}</h3>
            <ul className="space-y-2">
              <li>
                <a 
                  href="#" 
                  className={`text-sm hover:text-blue-500 transition-colors ${
                    isDark ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  {t("footer.servicesList.tour3n2d")}
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className={`text-sm hover:text-blue-500 transition-colors ${
                    isDark ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  {t("footer.servicesList.tour4n3d")}
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className={`text-sm hover:text-blue-500 transition-colors ${
                    isDark ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  {t("footer.servicesList.rentBike")}
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className={`text-sm hover:text-blue-500 transition-colors ${
                    isDark ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  {t("footer.servicesList.homestay")}
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className={`text-sm hover:text-blue-500 transition-colors ${
                    isDark ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  {t("footer.servicesList.guide")}
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className={`text-sm hover:text-blue-500 transition-colors ${
                    isDark ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  {t("footer.servicesList.insurance")}
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{t("footer.contact")}</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <FiMapPin className={`mt-1 ${isDark ? "text-blue-400" : "text-blue-500"}`} />
                <div>
                  <p className="text-sm font-medium">{t("footer.contactInfo.address")}</p>
                  <p className={`text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`} 
                     dangerouslySetInnerHTML={{ __html: t("footer.contactInfo.addressValue") }}>
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <FiPhone className={`${isDark ? "text-blue-400" : "text-blue-500"}`} />
                <div>
                  <p className="text-sm font-medium">{t("footer.contactInfo.phone")}</p>
                  <p className={`text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                    {t("footer.contactInfo.phoneValue")}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <FiMail className={`${isDark ? "text-blue-400" : "text-blue-500"}`} />
                <div>
                  <p className="text-sm font-medium">{t("footer.contactInfo.email")}</p>
                  <p className={`text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                    {t("footer.contactInfo.emailValue")}
                  </p>
                </div>
              </div>
            </div>

            {/* Newsletter */}
            <div className="pt-4">
              <h4 className="text-sm font-medium mb-2">{t("footer.newsletter.title")}</h4>
              <div className="flex">
                <input
                  type="email"
                  placeholder={t("footer.newsletter.placeholder")}
                  className={`flex-1 px-3 py-2 text-sm border rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isDark 
                      ? "bg-gray-800 border-gray-600 text-white placeholder-gray-400" 
                      : "bg-white border-gray-300 text-gray-800 placeholder-gray-500"
                  }`}
                />
                <button className="px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-r-md hover:bg-blue-600 transition-colors">
                  {t("footer.newsletter.button")}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className={`border-t ${isDark ? "border-gray-700" : "border-gray-200"}`}>
        <div className="container mx-auto px-6 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-2 text-sm">
              <span>{t("footer.bottom.copyright", { year: currentYear })}</span>
              <FiHeart className="text-red-500" />
            </div>
            
            <div className="flex items-center space-x-6 text-sm">
              <a 
                href="#" 
                className={`hover:text-blue-500 transition-colors ${
                  isDark ? "text-gray-300" : "text-gray-600"
                }`}
              >
                {t("footer.bottom.privacy")}
              </a>
              <a 
                href="#" 
                className={`hover:text-blue-500 transition-colors ${
                  isDark ? "text-gray-300" : "text-gray-600"
                }`}
              >
                {t("footer.bottom.terms")}
              </a>
              <a 
                href="#" 
                className={`hover:text-blue-500 transition-colors ${
                  isDark ? "text-gray-300" : "text-gray-600"
                }`}
              >
                {t("footer.bottom.sitemap")}
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;