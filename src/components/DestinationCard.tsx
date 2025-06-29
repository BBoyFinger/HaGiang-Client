import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaMapMarkerAlt, FaEye, FaHeart, FaStar, FaClock } from "react-icons/fa";
import { useState } from "react";

const formatPrice = (price: number, currency = "VND") => {
    if (currency === "EUR") return price + " EUR";
    return price.toLocaleString("vi-VN") + " VND";
};

interface Destination {
    id: number;
    name: string;
    image: string;
    shortDescription: string;
    priceFrom: number;
    currency?: string;
    rating?: number;
    location?: string;
    duration?: string;
}

interface DestinationCardProps {
    destination: Destination;
    isDark?: boolean;
}

const DestinationCard = ({ destination, isDark = false }: DestinationCardProps) => {
    const [isFavorite, setIsFavorite] = useState(false);

    return (
        <motion.div
            whileHover={{ y: -8 }}
            transition={{ duration: 0.3 }}
            className={`group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 ${
                isDark ? "bg-gray-800" : "bg-white"
            }`}
        >
            {/* Image Container */}
            <div className="relative overflow-hidden">
                <img 
                    src={destination.image} 
                    alt={destination.name} 
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500" 
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Favorite Button */}
                <button
                    onClick={() => setIsFavorite(!isFavorite)}
                    className={`absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                        isFavorite 
                            ? "bg-red-500 text-white" 
                            : "bg-white/80 text-gray-600 hover:bg-white"
                    }`}
                >
                    <FaHeart className={`text-sm ${isFavorite ? "fill-current" : "hover:fill-red-500"}`} />
                </button>

                {/* Price Badge */}
                <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-full px-4 py-2">
                    <span className="text-sm font-semibold text-gray-800">
                        Từ {formatPrice(destination.priceFrom, destination.currency)}
                    </span>
                </div>

                {/* Rating Badge */}
                {destination.rating && (
                    <div className="absolute top-4 left-4 bg-yellow-400 text-gray-800 rounded-full px-3 py-1 flex items-center gap-1">
                        <FaStar className="text-xs fill-current" />
                        <span className="text-sm font-semibold">{destination.rating}</span>
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-6">
                {/* Title */}
                <h3 className={`text-xl font-bold mb-3 line-clamp-2 group-hover:text-purple-600 transition-colors duration-300 ${
                    isDark ? "text-white" : "text-gray-800"
                }`}>
                    {destination.name}
                </h3>

                {/* Location & Duration */}
                <div className="flex items-center gap-4 mb-3 text-sm text-gray-500">
                    {destination.location && (
                        <div className="flex items-center gap-1">
                            <FaMapMarkerAlt className="text-purple-500" />
                            <span>{destination.location}</span>
                        </div>
                    )}
                    {destination.duration && (
                        <div className="flex items-center gap-1">
                            <FaClock className="text-blue-500" />
                            <span>{destination.duration}</span>
                        </div>
                    )}
                </div>

                {/* Description */}
                <p className={`text-sm mb-4 line-clamp-3 ${
                    isDark ? "text-gray-300" : "text-gray-600"
                }`}>
                    {destination.shortDescription}
                </p>

                {/* Action Button */}
                <Link
                    to={`/destinations/${destination.id}`}
                    className="inline-flex items-center justify-center w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl group-hover:scale-105"
                >
                    <FaEye className="mr-2" />
                    Xem chi tiết
                </Link>
            </div>

            {/* Hover Effect Border */}
            <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-purple-500/20 transition-colors duration-300 pointer-events-none" />
        </motion.div>
    );
};

export default DestinationCard;
