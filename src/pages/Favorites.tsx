import React from "react";
import { useFavorite } from "../contexts/FavoriteContext";
import { destinations } from "../data/destinations";
import DestinationCard from "../components/DestinationCard";
import { FaHeart, FaArrowLeft, FaCompass } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export default function Favorites() {
  const { favorites, removeFavorite } = useFavorite();
  const favDest = destinations.filter((d: any) => favorites.includes(d.id));
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800 pb-16">
      {/* Hero Section */}
      <div className="relative flex flex-col items-center justify-center py-12 mb-8 bg-gradient-to-r from-purple-600 to-pink-600 shadow-lg">
        <FaHeart className="text-5xl text-white mb-4 animate-pulse drop-shadow-lg" />
        <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-2 drop-shadow-lg">Điểm du lịch yêu thích</h1>
        <p className="text-white/90 text-lg mb-4 max-w-xl text-center">Tất cả những điểm đến bạn đã lưu lại sẽ xuất hiện tại đây. Hãy lên kế hoạch cho chuyến đi mơ ước của bạn!</p>
        <button
          onClick={() => navigate(-1)}
          className="absolute top-6 left-6 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300"
        >
          <FaArrowLeft />
        </button>
      </div>

      <div className="max-w-6xl mx-auto px-4">
        {favDest.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24">
            <FaCompass className="text-6xl text-purple-400 mb-6 animate-bounce" />
            <h2 className="text-2xl font-bold mb-2 text-purple-700">Bạn chưa lưu điểm du lịch nào</h2>
            <p className="text-gray-500 mb-6">Khám phá các điểm đến hấp dẫn và nhấn vào biểu tượng trái tim để lưu lại nhé!</p>
            <button
              onClick={() => navigate("/")}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg"
            >
              Khám phá ngay
            </button>
          </div>
        ) : (
          <AnimatePresence>
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8"
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={{
                hidden: { opacity: 0, y: 40 },
                visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.08 } },
              }}
            >
              {favDest.map((d) => (
                <motion.div
                  key={d.id}
                  layout
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 40 }}
                  transition={{ duration: 0.4 }}
                >
                  <div className="relative group">
                    <DestinationCard destination={d} />
                    <button
                      onClick={() => removeFavorite(String(d.id))}
                      className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/90 text-red-500 flex items-center justify-center shadow hover:bg-red-500 hover:text-white transition-all duration-300 opacity-0 group-hover:opacity-100"
                      title="Bỏ khỏi yêu thích"
                    >
                      <FaHeart />
                    </button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
} 