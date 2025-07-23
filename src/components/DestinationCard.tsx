import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaMapMarkerAlt, FaHeart, FaTag } from "react-icons/fa";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import fallbackImage from "@/assets/1.jpg";

export interface DestinationCardProps {
  destination: {
    name: { vi: string; en: string };
    slug: string;
    type: string;
    images: string[];
    shortDescription: { vi: string; en: string };
    description: { vi: string; en: string };
    location: {
      lat: number;
      lng: number;
      address: { vi: string; en: string };
    };
    detail: { fullDescription: { vi: string; en: string } };
    relatedTours: string[];
  };
  isDark?: boolean;
}

const DestinationCard = ({ destination, isDark = false }: DestinationCardProps) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const { i18n, t } = useTranslation();
  const lang = i18n.language === "en" ? "en" : "vi";

  // Lấy ảnh đầu tiên hoặc fallback
  let imageUrl = destination.images && destination.images.length > 0 ? destination.images[0] : fallbackImage;

  return (
    <motion.div
      whileHover={{ y: -8, boxShadow: "0 8px 32px rgba(80,0,120,0.15)" }}
      transition={{ duration: 0.3 }}
      className={`group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 ${
        isDark ? "bg-earth" : "bg-light"
      } border border-earth/40`}
    >
      {/* Image */}
      <div className="relative overflow-hidden">
        <img
          src={typeof imageUrl === "string" ? imageUrl : fallbackImage}
          alt={destination.name[lang]}
          className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        {/* Favorite Button */}
        <button
          onClick={() => setIsFavorite(!isFavorite)}
          className={`absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
            isFavorite ? "bg-accent text-[#1a1a1a]" : "bg-light/80 text-[#555] hover:bg-light"
          }`}
        >
          <FaHeart className={`text-sm ${isFavorite ? "fill-current" : "hover:fill-accent"}`} />
        </button>
        {/* Type Badge */}
        <div className="absolute top-4 left-4 bg-light/90 backdrop-blur-sm rounded-full px-4 py-2 flex items-center gap-2 shadow">
          <FaTag className="text-primary text-xs" />
          <span className="text-xs font-semibold text-[#1a1a1a] capitalize">{destination.type}</span>
        </div>
      </div>
      {/* Content */}
      <div className="p-6">
        {/* Title */}
        <h3 className={`text-xl font-bold mb-2 line-clamp-2 group-hover:text-primary transition-colors duration-300 ${
          isDark ? "text-light" : "text-[#1a1a1a]"
        }`}>
          {destination.name[lang]}
        </h3>
        {/* Location */}
        <div className="flex items-center gap-2 mb-2 text-sm text-[#555]">
          <FaMapMarkerAlt className="text-primary" />
          <span>{destination.location.address[lang]}</span>
        </div>
        {/* Description */}
        <p className={`text-sm mb-4 line-clamp-3 ${isDark ? "text-secondary" : "text-[#555]"}`}>
          {destination.shortDescription[lang]}
        </p>
        {/* Action Button */}
        <Link
          to={`/destinations/${destination.slug}`}
          className="inline-flex items-center justify-center w-full px-6 py-3 bg-gradient-to-r from-primary to-accent text-[#1a1a1a] font-semibold rounded-xl hover:from-accent hover:to-primary transition-all duration-300 shadow-lg hover:shadow-xl group-hover:scale-105"
        >
          {t('common.viewDetails')}
        </Link>
      </div>
      {/* Hover Effect Border */}
      <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-primary/30 transition-colors duration-300 pointer-events-none" />
    </motion.div>
  );
};

export default DestinationCard;
