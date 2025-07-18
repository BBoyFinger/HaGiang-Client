import { Link } from "react-router-dom";
import type { Tour } from "@/types/TourType";
import { motion } from "framer-motion";
import ReactStars from 'react-rating-stars-component'
import { MdAccessTime, MdArrowRightAlt, MdLocationOn, MdPeople, MdStar, MdFavorite, MdFavoriteBorder } from "react-icons/md";
import { useTranslation } from "react-i18next";
import { FaEye, FaHeart, FaMapMarkerAlt, FaClock, FaUsers, FaTag } from 'react-icons/fa';
import { useState } from "react";

const formatPrice = (price: number, currency: string) => {
  if (currency === "EUR") return price + " EUR";
  return price.toLocaleString("vi-VN") + " VND";
};

export default function TourCard({ tour, averageRating, reviewCount }: { tour: any, averageRating?: number, reviewCount?: number }) {
  const { t, i18n } = useTranslation();
  const lang = i18n.language === 'en' ? 'en' : 'vi';
  const [isFavorite, setIsFavorite] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  const priceObj = tour.price?.VND || Object.values(tour.price || {})[0] || {};
  const { perSlot, groupPrice, discountPrice } = priceObj;
  const currency = tour.price?.VND ? 'VND' : Object.keys(tour.price || {})[0] || '';

 
  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="group bg-white rounded-3xl shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100/50"
    >
      {/* Image Section */}
      <div className="relative h-64 overflow-hidden">
        <Link to={`/tours/${tour.slug}`}>
          <img 
            src={tour.imageUrls[0]} 
            alt={tour.name?.[lang] || tour.name?.vi || ''} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" 
          />
        </Link>
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        
        {/* Floating Elements */}
        <div className="absolute top-4 left-4 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0">
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1.5 text-white text-sm">
              <FaEye className="text-xs" />
              <span className="font-medium">1.2k</span>
            </div>
            <button
              onClick={toggleFavorite}
              className="flex items-center space-x-1 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1.5 text-white text-sm hover:bg-white/30 transition-colors"
            >
              {isFavorite ? (
                <FaHeart className="text-xs text-red-400" />
              ) : (
                <FaHeart className="text-xs" />
              )}
              <span className="font-medium">89</span>
            </button>
          </div>
        </div>

        {/* Tour Type Badge */}
        <div className="absolute top-4 right-4">
          <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-white/90 backdrop-blur-sm text-gray-800 shadow-sm">
            <FaTag className="mr-1.5 text-purple-500" />
            {tour.type?.[lang] || tour.type?.vi || 'Tour'}
          </span>
        </div>

        {/* Rating Badge */}
        <div className="absolute bottom-4 left-4">
          <div className="flex items-center space-x-1 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1.5 shadow-sm">
            <MdStar className="text-yellow-500 text-sm" />
            <span className="text-sm font-semibold text-gray-800">{typeof averageRating === 'number' ? averageRating : tour.rating?.toFixed(1)}</span>
            {typeof reviewCount === 'number' && (
              <span className="text-xs text-gray-500 ml-1">({reviewCount})</span>
            )}
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6">
        {/* Title */}
        <Link to={`/tours/${tour.slug}`}>
          <h3 className="text-xl font-bold mb-3 text-gray-800 group-hover:text-purple-600 transition-colors duration-300 leading-tight line-clamp-2">
            {tour.name?.[lang] || tour.name?.vi || ''}
          </h3>
        </Link>

        {/* Description */}
        <p className="text-gray-600 mb-4 leading-relaxed text-sm line-clamp-2">
          {tour.shortDescription?.[lang] || tour.shortDescription?.vi || ''}
        </p>

        {/* Location */}
        <div className="flex items-center space-x-2 mb-4 text-sm text-gray-500">
          <FaMapMarkerAlt className="text-purple-500" />
          <span className="line-clamp-1">{Array.isArray(tour.locations) ? tour.locations.map((loc: any) => loc?.[lang] || loc?.vi || '').join(', ') : ''}</span>
        </div>

        {/* Tour Details */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <FaClock className="text-purple-500" />
              <span>{tour.duration?.[lang] || tour.duration?.vi || ''}</span>
            </div>
            <div className="flex items-center space-x-1">
              <FaUsers className="text-purple-500" />
              <span>{Array.isArray(tour.guideLanguage) ? tour.guideLanguage.map((g: any) => g?.[lang] || g?.vi || '').join(', ') : ''}</span>
            </div>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-purple-50 text-purple-600 border border-purple-100">
            {tour.duration?.[lang] || tour.duration?.vi || ''}
          </span>
          <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-green-50 text-green-600 border border-green-100">
            {Array.isArray(tour.guideLanguage) ? tour.guideLanguage.map((g: any) => g?.[lang] || g?.vi || '').join(', ') : ''}
          </span>
        </div>

        {/* Price */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            {/* Giá + /người */}
            <div className="flex items-baseline flex-col">
              {discountPrice ? (
                <>
                  <span className="text-sm text-gray-400 line-through">
                    {formatPrice(groupPrice || perSlot || 0, currency)}
                  </span>
                  <span className="text-sm font-bold text-purple-600 mt-1">
                    {formatPrice(discountPrice, currency)}
                  </span>
                </>
              ) : (
                <span className="text-lg font-bold text-purple-600">
                  {formatPrice(groupPrice || perSlot || 0, currency)}
                </span>
              )}
              <span className="text-xs text-gray-500 ml-2">/ người</span>
            </div>
            {/* Đánh giá + ReactStars */}
            <div className="flex items-center">
              <span className="text-xs text-gray-500 mr-1">Đánh giá</span>
              <ReactStars
                count={5}
                value={typeof averageRating === 'number' ? averageRating : tour.rating}
                size={16}
                isHalf={true}
                edit={false}
                color="#e4e5e9"
                activeColor="#ffd700"
              />
              <span className="text-sm font-medium text-gray-700 ml-1">{typeof averageRating === 'number' ? averageRating : tour.rating?.toFixed(1)}</span>
              {typeof reviewCount === 'number' && (
                <span className="text-xs text-gray-500 ml-1">({reviewCount} đánh giá)</span>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <Link
            to={`/tours/${tour.slug}`}
            className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold py-3 px-4 rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 text-center shadow-lg hover:shadow-xl"
          >
            {t('common.viewDetails')}
          </Link>
          <button
            onClick={toggleFavorite}
            className={`p-3 rounded-xl border-2 transition-all duration-300 ${
              isFavorite 
                ? 'border-red-500 bg-red-50 text-red-500 hover:bg-red-100' 
                : 'border-gray-300 text-gray-400 hover:border-red-300 hover:text-red-400'
            }`}
          >
            {isFavorite ? <FaHeart className="text-sm" /> : <FaHeart className="text-sm" />}
          </button>
        </div>
      </div>
    </motion.div>
  );
} 