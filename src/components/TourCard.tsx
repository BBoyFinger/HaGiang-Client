import { Link } from "react-router-dom";
import type { Tour } from "@/types/TourType";
import { motion } from "framer-motion";
import ReactStars from 'react-rating-stars-component'

const formatPrice = (price: number, currency: string) => {
  if (currency === "EUR") return price + " EUR";
  return price.toLocaleString("vi-VN") + " VND";
};

export default function TourCard({ tour }: { tour: Tour }) {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      className="rounded-lg overflow-hidden shadow-lg bg-white dark:bg-gray-800"
    >
      <img src={tour.imageUrls[0]} alt={tour.name} className="w-full h-48 object-cover" />
      <div className="p-5">
        <h3 className="text-xl font-bold mb-1 text-gray-800 dark:text-white">{tour.name}</h3>
        
        <div className="mb-2 flex items-center flex-row" style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
          <ReactStars
            count={5}
            value={tour.rating}
            size={24}
            isHalf={true}
            edit={false}
            activeColor="#ffd700"
          />
          
          <span className="ml-2 text-sm text-yellow-600 font-medium align-middle">{tour.rating.toFixed(1)}</span>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{tour.description}</p>
        <div className="text-xs text-gray-500 mb-2">
          <span className="font-semibold">Địa điểm:</span> {tour.locations.join(", ")}
        </div>
        <div className="flex flex-wrap gap-2 text-xs mb-2">
          <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded">{tour.duration}</span>
          <span className="bg-green-100 text-green-700 px-2 py-1 rounded">{tour.guideLanguage.join(", ")}</span>
        </div>
        <div className="font-semibold text-blue-600 mb-2">
          Giá từ: {formatPrice(tour.price.groupPrice || tour.price.perSlot, tour.price.currency)}/slot
        </div>
        <Link
          to={`/tours/${tour.slug}`}
          className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition-colors mt-2 inline-block"
        >
          Xem chi tiết
        </Link>
      </div>
    </motion.div>
  );
} 