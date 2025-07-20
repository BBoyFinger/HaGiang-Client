import React from "react";
import { useFavorite } from "../contexts/FavoriteContext";
import axiosInstance from "@/config/axiosConfig";
import { useEffect, useState } from "react";
import TourCard from "../components/TourCard";
import { FaHeart, FaArrowLeft, FaCompass } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";

export default function Favorites() {
  const { t } = useTranslation();
  const { tourFavorites, removeFavorite } = useFavorite();
  const [allTours, setAllTours] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    axiosInstance.get('/tours')
      .then(res => setAllTours(res.data.tours || []))
      .finally(() => setLoading(false));
  }, []);

  const favTours = allTours.filter((t: any) => tourFavorites.includes(t._id));

  if (loading) {
    return <div className="flex flex-col items-center justify-center min-h-[60vh] text-lg animate-pulse">
      <FaHeart className="text-5xl text-purple-400 mb-4 animate-bounce" />
      <span>{t('favorites.loading') || 'Loading your wishlist...'}</span>
    </div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800 pb-16">
      {/* Hero Section */}
      <div className="relative flex flex-col items-center justify-center py-12 mb-8 bg-gradient-to-r from-purple-600 to-pink-600 shadow-lg rounded-b-3xl">
        <FaHeart className="text-5xl text-white mb-4 animate-pulse drop-shadow-lg" />
        <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-2 drop-shadow-lg">{t('favorites.title') || 'Your Favorite Tours'}</h1>
        <p className="text-white/90 text-lg mb-4 max-w-xl text-center">{t('favorites.desc') || 'All tours you have saved will appear here. Plan your dream trip now!'}</p>
        <button
          onClick={() => navigate(-1)}
          className="absolute top-6 left-6 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300"
        >
          <FaArrowLeft />
        </button>
      </div>

      {favTours.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24">
          <FaCompass className="text-6xl text-purple-400 mb-6 animate-bounce" />
          <h2 className="text-2xl font-bold mb-2 text-purple-700">{t('favorites.emptyTitle') || 'You have no favorite tours yet'}</h2>
          <p className="text-gray-500 mb-6">{t('favorites.emptyDesc') || 'Discover amazing tours and click the heart icon to save them!'}</p>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg"
          >
            {t('favorites.exploreBtn') || 'Explore now'}
          </button>
        </div>
      ) :
        <AnimatePresence>
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 px-4 max-w-7xl mx-auto"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={{
              hidden: { opacity: 0, y: 40 },
              visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.08 } },
            }}
          >
            {favTours.map((tour) => (
              <motion.div
                key={tour._id}
                layout
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 40 }}
                transition={{ duration: 0.4 }}
              >
                <div className="relative group">
                  <TourCard tour={tour} />
                  <button
                    onClick={() => removeFavorite(String(tour._id))}
                    className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/90 text-red-500 flex items-center justify-center shadow hover:bg-red-500 hover:text-white transition-all duration-300 opacity-0 group-hover:opacity-100"
                    title={t('favorites.removeBtn') || 'Remove from favorites'}
                  >
                    <FaHeart />
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      }
    </div>
  );
} 