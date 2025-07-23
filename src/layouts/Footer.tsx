import { FiMapPin, FiPhone, FiMail, FiFacebook, FiInstagram, FiTwitter, FiYoutube, FiHeart, FiArrowRight, FiSend } from "react-icons/fi";
import { FaFacebookF, FaInstagram, FaTwitter, FaYoutube, FaTiktok, FaWhatsapp } from "react-icons/fa";
import logo from "@/assets/logo.jpg";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import ChatbotWidget from "@/components/ChatbotWidget";
import { motion } from "framer-motion";

interface FooterProps {
  isDark: boolean;
  toggleTheme: () => void;
}

const Footer = ({ isDark, toggleTheme }: FooterProps) => {
  const { t } = useTranslation();

  const currentYear = new Date().getFullYear();

  const socialLinks = [
    {
      name: "Facebook",
      icon: FaFacebookF,
      href: "https://www.facebook.com/profile.php?id=61575627280781",
      color: "hover:bg-blue-600",
      bgColor: "bg-blue-500"
    },
    {
      name: "Instagram",
      icon: FaInstagram,
      href: "https://www.instagram.com/homietravel42/",
      color: "hover:bg-pink-600",
      bgColor: "bg-pink-500"
    },
    {
      name: "YouTube",
      icon: FaYoutube,
      href: "https://www.youtube.com/channel/UCJMURfzp3piz_YRFAc4fP8w",
      color: "hover:bg-red-600",
      bgColor: "bg-red-500"
    },
    {
      name: "TikTok",
      icon: FaTiktok,
      href: "https://www.tiktok.com/@HomieTravel42",
      color: "hover:bg-black",
      bgColor: "bg-black"
    },
    {
      name: "WhatsApp",
      icon: FaWhatsapp,
      href: "https://wa.me/84983648362",
      color: "hover:bg-green-600",
      bgColor: "bg-green-500"
    }
  ];

  const quickLinks = [
    { name: t("nav.home"), path: "/" },
    { name: t("nav.about"), path: "/about" },
    { name: t("destinations.title"), path: "/destinations" },
    { name: t("tours.title"), path: "/tours" },
    { name: t("nav.tour"), path: "/tour" },
    { name: t("nav.contact"), path: "/contact" }
  ];

  const services = [
    { name: t("footer.servicesList.tour3n2d"), path: "/tour" },
    { name: t("footer.servicesList.tour4n3d"), path: "/tour" },
    { name: t("footer.servicesList.rentBike"), path: "/rent" },
    { name: t("footer.servicesList.homestay"), path: "/stay" },
    { name: t("footer.servicesList.guide"), path: "/tour" },
    { name: t("footer.servicesList.insurance"), path: "/tour" }
  ];

  return (
    <footer className={`relative ${isDark ? "bg-earth text-light" : "bg-light text-[#1a1a1a]"} border-t ${isDark ? "border-earth" : "border-earth"}`}>
      {/* Background Pattern */}
      <div className={`absolute inset-0 opacity-5 ${isDark ? "bg-gradient-to-br from-primary to-secondary" : "bg-gradient-to-br from-secondary to-primary"}`}></div>

      {/* Main Footer Content */}
      <div className="relative container mx-auto px-4 lg:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">

          {/* Company Info */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Link to="/" className="flex items-center group">
              <div className="relative">
                <img src={logo} alt="Ha Giang Travel" className="w-14 h-14 rounded-full object-cover transition-transform group-hover:scale-110" />
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary to-accent opacity-0 group-hover:opacity-20 transition-opacity"></div>
              </div>
              <div className="ml-4">
                <span className="text-xl font-bold">Homie Travel</span>
                <div className={`text-sm ${isDark ? "text-secondary" : "text-[#555]"}`}>
                  Hà Giang Experience
                </div>
              </div>
            </Link>

            <p className={`text-sm leading-relaxed ${isDark ? "text-light" : "text-[#555]"}`}>
              {t("footer.company.description")}
            </p>

            <div className="flex space-x-3">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`p-3 rounded-full transition-all duration-300 transform hover:scale-110 ${isDark
                    ? "bg-earth hover:bg-primary text-light"
                    : "bg-secondary hover:bg-primary text-[#1a1a1a]"
                    } ${social.color}`}
                  aria-label={social.name}
                >
                  <social.icon size={18} />
                </a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h3 className="text-lg font-bold relative">
              {t("footer.quickLinks")}
              <div className={`absolute -bottom-2 left-0 w-12 h-0.5 ${isDark ? "bg-primary" : "bg-primary"}`}></div>
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className={`group flex items-center text-sm transition-all duration-300 ${isDark ? "text-light hover:text-primary" : "text-[#555] hover:text-primary"
                      }`}
                  >
                    <FiArrowRight className="mr-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-1" size={12} />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Services */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 className="text-lg font-bold relative">
              {t("footer.services")}
              <div className={`absolute -bottom-2 left-0 w-12 h-0.5 ${isDark ? "bg-primary" : "bg-primary"}`}></div>
            </h3>
            <ul className="space-y-3">
              {services.map((service) => (
                <li key={service.name}>
                  <Link
                    to={service.path}
                    className={`group flex items-center text-sm transition-all duration-300 ${isDark ? "text-light hover:text-primary" : "text-[#555] hover:text-primary"
                      }`}
                  >
                    <FiArrowRight className="mr-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-1" size={12} />
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info & Newsletter */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h3 className="text-lg font-bold relative">
              {t("footer.contact")}
              <div className={`absolute -bottom-2 left-0 w-12 h-0.5 ${isDark ? "bg-primary" : "bg-primary"}`}></div>
            </h3>

            <div className="space-y-4">
              <div className="flex items-start space-x-3 group">
                <div className={`p-2 rounded-full ${isDark ? "bg-primary/30" : "bg-secondary"} group-hover:bg-accent transition-colors`}>
                  <FiMapPin className={`${isDark ? "text-primary" : "text-primary"}`} />
                </div>
                <div>
                  <p className="text-sm font-medium">{t("footer.contactInfo.address")}</p>
                  <p className={`text-sm ${isDark ? "text-light" : "text-[#555]"}`}
                    dangerouslySetInnerHTML={{ __html: t("footer.contactInfo.addressValue") }}>
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3 group">
                <div className={`p-2 rounded-full ${isDark ? "bg-primary/30" : "bg-secondary"} group-hover:bg-accent transition-colors`}>
                  <FiPhone className={`${isDark ? "text-primary" : "text-primary"}`} />
                </div>
                <div>
                  <p className="text-sm font-medium">{t("footer.contactInfo.phone")}</p>
                  <a
                    href="tel:+84 983648362"
                    className={`text-sm ${isDark ? "text-light hover:text-primary" : "text-[#555] hover:text-primary"} transition-colors`}
                  >
                    +84 983648362
                  </a>
                </div>
              </div>

              <div className="flex items-center space-x-3 group">
                <div className={`p-2 rounded-full ${isDark ? "bg-primary/30" : "bg-secondary"} group-hover:bg-accent transition-colors`}>
                  <FiMail className={`${isDark ? "text-primary" : "text-primary"}`} />
                </div>
                <div>
                  <p className="text-sm font-medium">{t("footer.contactInfo.email")}</p>
                  <p className={`text-sm ${isDark ? "text-light" : "text-[#555]"}`}>
                    {t("footer.contactInfo.emailValue")}
                  </p>
                </div>
              </div>
            </div>

            {/* Newsletter */}
            <div className="pt-4">
              <h4 className="text-sm font-bold mb-3">{t("footer.newsletter.title")}</h4>
              <div className="flex group">
                <input
                  type="email"
                  placeholder={t("footer.newsletter.placeholder")}
                  className={`flex-1 px-4 py-3 text-sm border-l border-t border-b rounded-l-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-300 ${isDark
                      ? "bg-earth border-earth text-light placeholder-secondary"
                      : "bg-light border-earth text-[#1a1a1a] placeholder-secondary"
                    }`}
                />
                <button className={`px-4 py-3 text-sm font-medium rounded-r-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg ${isDark
                    ? "bg-primary hover:bg-accent text-[#1a1a1a]"
                    : "bg-gradient-to-r from-primary to-accent hover:from-accent hover:to-primary text-[#1a1a1a]"
                  }`}>
                  <FiSend size={16} />
                </button>
              </div>
              <p className={`text-xs mt-2 ${isDark ? "text-secondary" : "text-[#555]"}`}>
                {t("footer.notification")}
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className={`relative border-t ${isDark ? "border-earth" : "border-earth"}`}>
        <div className="container mx-auto px-4 lg:px-6 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-2 text-sm">
              <span>{t("footer.bottom.copyright", { year: currentYear })}</span>
              <FiHeart className="text-accent animate-pulse" />
              <span>by Homie Travel</span>
            </div>

            <div className="flex items-center space-x-6 text-sm">
              <a
                href="#"
                className={`hover:text-primary transition-colors ${isDark ? "text-light" : "text-[#555]"}`}
              >
                {t("footer.bottom.privacy")}
              </a>
              <a
                href="#"
                className={`hover:text-primary transition-colors ${isDark ? "text-light" : "text-[#555]"}`}
              >
                {t("footer.bottom.terms")}
              </a>
              <a
                href="#"
                className={`hover:text-primary transition-colors ${isDark ? "text-light" : "text-[#555]"}`}
              >
                {t("footer.bottom.sitemap")}
              </a>
            </div>
          </div>
        </div>
      </div>

      <ChatbotWidget />
    </footer>
  );
};

export default Footer;