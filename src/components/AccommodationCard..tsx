// AccommodationCard.tsx
import { Link } from "react-router-dom";
import ReactStars from 'react-rating-stars-component'
import { HiOutlineMapPin } from "react-icons/hi2";
import { MdArrowRightAlt } from "react-icons/md";
import { FaHome, FaHotel, FaStar, FaMapMarkerAlt, FaBed, FaUsers } from 'react-icons/fa';
import { Accommodation } from "@/types/AccommodationType";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

interface AccommodationCardProps {
    stay: Accommodation;
    resolveStayImage: (path: string) => string;
}

export default function AccommodationCard({
    stay,
    resolveStayImage,
}: AccommodationCardProps) {
    const { t } = useTranslation();

    const formatPrice = (price: string) => {
        const numPrice = parseFloat(price);
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(numPrice);
    };

    return (
        <motion.div 
            whileHover={{ scale: 1.02 }} 
            className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
        >
            {/* Image Section */}
            <div className="relative h-48 overflow-hidden">
                <img
                    src={resolveStayImage(stay.images[0])}
                    alt={stay.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute top-4 left-4">
                    <div className="bg-white bg-opacity-90 rounded-full p-2">
                        <FaHome className="text-green-600" />
                    </div>
                </div>
                <div className="absolute top-4 right-4">
                    <div className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        Homestay
                    </div>
                </div>
                <div className="absolute bottom-4 left-4">
                    <div className="bg-black bg-opacity-70 text-white px-3 py-1 rounded-lg text-sm">
                        {formatPrice(stay.price_per_night)}
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="p-6">
                <div className="mb-4">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{stay.name}</h3>
                    
                    {/* Rating */}
                    <div className="flex items-center mb-3">
                        <ReactStars
                            count={5}
                            value={stay.rating || 0}
                            size={16}
                            isHalf={true}
                            edit={false}
                            activeColor="#ffd700"
                        />
                        <span className="text-sm text-gray-600 ml-2">
                            {stay.rating} ({stay.star_rating || 0} sao)
                        </span>
                    </div>

                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {stay.description}
                    </p>
                    
                    {/* Location */}
                    <div className="flex items-center text-sm text-gray-600 mb-4">
                        <FaMapMarkerAlt className="mr-2 text-gray-400" />
                        <span>{stay.city}, {stay.country}</span>
                    </div>

                    {/* Features */}
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
                        <div className="flex items-center">
                            <FaBed className="mr-1" />
                            <span>2 giường</span>
                        </div>
                        <div className="flex items-center">
                            <FaUsers className="mr-1" />
                            <span>4 người</span>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3">
                    <Link
                        to={`/stay/${stay.id}`}
                        className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 text-white py-2 px-4 rounded-lg font-semibold hover:from-green-700 hover:to-blue-700 transition-all duration-300 text-center"
                    >
                        Đặt Phòng
                    </Link>
                    <Link
                        to={`/stay/${stay.id}`}
                        className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg font-semibold hover:bg-gray-50 transition-colors text-center"
                    >
                        Chi Tiết
                    </Link>
                </div>
            </div>
        </motion.div>
    );
}
