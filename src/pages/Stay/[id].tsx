import { useParams, useNavigate } from "react-router-dom";
import { stays } from "@/data/stays";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { FaArrowLeft, FaStar, FaMapMarkerAlt, FaPhone, FaEnvelope, FaGlobe, FaBed, FaUsers, FaWifi, FaParking, FaUtensils, FaSwimmingPool, FaSpa, FaDumbbell, FaShieldAlt, FaCheckCircle, FaHeart } from "react-icons/fa";
import { Helmet } from 'react-helmet-async';
import { useState } from "react";

export default function StayDetail() {
    const { id } = useParams();
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [isFavorite, setIsFavorite] = useState(false);
    const [selectedImage, setSelectedImage] = useState(0);
    const [imageError, setImageError] = useState(false);

    // Tìm stay theo id
    const stay = stays.find((item) => item.id === id);

    // Fallback image
    const fallbackImage = "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80";

    const handleImageError = () => {
        setImageError(true);
    };

    const getImageSrc = (imagePath: string) => {
        if (imageError) return fallbackImage;
        return imagePath;
    };

    if (!stay) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="text-6xl mb-4">🏨</div>
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">Không tìm thấy chỗ ở</h1>
                    <p className="text-gray-600 mb-6">Chỗ ở bạn đang tìm kiếm không tồn tại hoặc đã được di chuyển.</p>
                    <button 
                        onClick={() => navigate('/stay')}
                        className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300"
                    >
                        Xem tất cả chỗ ở
                    </button>
                </div>
            </div>
        );
    }

    const amenities = [
        { icon: FaWifi, name: 'WiFi miễn phí', available: true },
        { icon: FaParking, name: 'Bãi đỗ xe', available: true },
        { icon: FaUtensils, name: 'Nhà hàng', available: true },
        { icon: FaSwimmingPool, name: 'Hồ bơi', available: stay.star_rating >= 4 },
        { icon: FaSpa, name: 'Spa', available: stay.star_rating >= 4 },
        { icon: FaDumbbell, name: 'Phòng gym', available: stay.star_rating >= 3 },
        { icon: FaBed, name: 'Phòng gia đình', available: true },
        { icon: FaUsers, name: 'Phòng đôi', available: true },
    ];

    return (
        <>
            <Helmet>
                <title>{stay.name} - Chi tiết chỗ ở | Homie Travel</title>
                <meta name="description" content={stay.description} />
            </Helmet>

            <div className="min-h-screen bg-light">
                {/* Hero Section */}
                <section className="relative h-96 md:h-[500px] overflow-hidden">
                    <img 
                        src={getImageSrc(stay.images[selectedImage] || stay.images[0])} 
                        alt={stay.name} 
                        className="w-full h-full object-cover"
                        onError={handleImageError}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                    
                    {/* Back Button */}
                    <button 
                        onClick={() => navigate(-1)}
                        className="absolute top-6 left-6 z-10 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300"
                    >
                        <FaArrowLeft />
                    </button>

                    {/* Favorite Button */}
                    <button
                        onClick={() => setIsFavorite(!isFavorite)}
                        className={`absolute top-6 right-6 z-10 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                            isFavorite 
                                ? "bg-red-500 text-white" 
                                : "bg-white/20 backdrop-blur-sm text-white hover:bg-white/30"
                        }`}
                    >
                        <FaHeart className={`text-lg ${isFavorite ? "fill-current" : "hover:fill-red-500"}`} />
                    </button>

                    {/* Hero Content */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                        <div className="max-w-4xl mx-auto">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                            >
                                <h1 className="text-3xl font-bold text-[#1a1a1a] mb-4">
                                    {stay.name}
                                </h1>
                                <div className="flex items-center gap-4 mb-6">
                                    <span className="text-[#555] text-sm">{stay.address}, {stay.city}</span>
                                </div>
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                                        <FaMapMarkerAlt className="text-white" />
                                        <span className="text-white font-medium">
                                            {stay.address}, {stay.city}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                                        <FaStar className="text-yellow-400" />
                                        <span className="text-white font-medium">{stay.rating}/5</span>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* Image Gallery */}
                {stay.images.length > 1 && (
                    <section className="py-8 bg-light">
                        <div className="max-w-6xl mx-auto px-4">
                            <div className="flex gap-4 overflow-x-auto pb-4">
                                {stay.images.map((image, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedImage(index)}
                                        className={`flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                                            selectedImage === index 
                                                ? "border-purple-500" 
                                                : "border-gray-200 hover:border-purple-300"
                                        }`}
                                    >
                                        <img 
                                            src={getImageSrc(image)} 
                                            alt={`${stay.name} ${index + 1}`} 
                                            className="w-full h-full object-cover"
                                            onError={handleImageError}
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                {/* Main Content */}
                <section className="py-16">
                    <div className="max-w-6xl mx-auto px-4">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Left Column - Main Content */}
                            <div className="lg:col-span-2">
                                {/* Description */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: 0.1 }}
                                    className="bg-white rounded-2xl shadow-lg p-8 mb-8"
                                >
                                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Mô tả</h2>
                                    <div className="prose max-w-none text-[#555]" dangerouslySetInnerHTML={{ __html: stay.description }} />
                                </motion.div>

                                {/* Amenities */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: 0.2 }}
                                    className="bg-white rounded-2xl shadow-lg p-8 mb-8"
                                >
                                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Tiện ích</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {amenities.map((amenity, index) => (
                                            <div key={index} className="flex items-center gap-3">
                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                                    amenity.available 
                                                        ? "bg-green-100 text-green-600" 
                                                        : "bg-gray-100 text-gray-400"
                                                }`}>
                                                    <amenity.icon className="text-lg" />
                                                </div>
                                                <span className={`font-medium ${
                                                    amenity.available ? "text-gray-800" : "text-gray-400"
                                                }`}>
                                                    {amenity.name}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>

                                {/* Contact Information */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: 0.3 }}
                                    className="bg-white rounded-2xl shadow-lg p-8"
                                >
                                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Thông tin liên hệ</h2>
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                                <FaPhone className="text-blue-600 text-xl" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-gray-800">Điện thoại</h3>
                                                <p className="text-gray-600">{stay.phone}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                                                <FaEnvelope className="text-green-600 text-xl" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-gray-800">Email</h3>
                                                <p className="text-gray-600">{stay.email}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                                            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                                                <FaGlobe className="text-purple-600 text-xl" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-gray-800">Website</h3>
                                                <a 
                                                    href={stay.website_url} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    className="text-purple-600 hover:text-purple-700 underline"
                                                >
                                                    {stay.website_url}
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>

                            {/* Right Column - Sidebar */}
                            <div className="lg:col-span-1">
                                {/* Pricing Card */}
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.5, delay: 0.4 }}
                                    className="bg-white rounded-2xl shadow-lg p-6 mb-6 sticky top-6"
                                >
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-xl font-bold text-gray-800">Giá phòng</h3>
                                        <div className="flex items-center gap-1">
                                            {[...Array(stay.star_rating)].map((_, i) => (
                                                <FaStar key={i} className="text-yellow-400 text-sm" />
                                            ))}
                                        </div>
                                    </div>
                                    
                                    <div className="text-center mb-6">
                                        <div className="text-3xl font-bold text-gray-800 mb-2">
                                            {parseFloat(stay.price_per_night).toLocaleString('vi-VN')} VNĐ
                                        </div>
                                        <div className="text-gray-600">mỗi đêm</div>
                                    </div>
                                    
                                    <div className="space-y-3">
                                        <button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-3 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300">
                                            Đặt phòng ngay
                                        </button>
                                        <button className="w-full border-2 border-purple-600 text-purple-600 font-semibold py-3 rounded-xl hover:bg-purple-600 hover:text-white transition-all duration-300">
                                            Liên hệ tư vấn
                                        </button>
                                    </div>
                                </motion.div>

                                {/* Quick Info */}
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.5, delay: 0.5 }}
                                    className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl shadow-lg p-6 text-white"
                                >
                                    <h3 className="text-xl font-bold mb-4">Thông tin nhanh</h3>
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3">
                                            <FaStar className="text-yellow-300" />
                                            <span>Đánh giá: {stay.rating}/5</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <FaMapMarkerAlt className="text-purple-200" />
                                            <span>{stay.city}, {stay.country}</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <FaShieldAlt className="text-purple-200" />
                                            <span>Đặt phòng an toàn</span>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-16 bg-gradient-to-r from-purple-600 to-pink-600">
                    <div className="max-w-4xl mx-auto text-center px-4">
                        <h2 className="text-3xl font-bold text-white mb-4">
                            Sẵn sàng đặt phòng?
                        </h2>
                        <p className="text-xl text-purple-100 mb-8">
                            Đặt phòng ngay hôm nay và tận hưởng kỳ nghỉ tuyệt vời tại Hà Giang
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button className="px-8 py-4 bg-white text-purple-600 font-semibold rounded-xl hover:bg-gray-100 transition-all duration-300">
                                Xem tất cả chỗ ở
                            </button>
                            <button className="px-8 py-4 border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-purple-600 transition-all duration-300">
                                Tư vấn miễn phí
                            </button>
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
}
