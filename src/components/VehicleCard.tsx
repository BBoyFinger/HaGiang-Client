import { Vehicle } from "@/types/VehicleType";
import { useTranslation } from "react-i18next";
import { FaMotorcycle, FaStar, FaMapMarkerAlt } from "react-icons/fa";
import { motion } from "framer-motion";

interface VehicleCardProps {
  vehicle: Vehicle;
  onBook?: (slug: string) => void;
  onDetail?: (slug: string) => void;
}

export default function VehicleCard({ vehicle, onBook, onDetail }: VehicleCardProps) {
  const { t } = useTranslation();

  return (
    <motion.div 
      whileHover={{ scale: 1.02 }} 
      className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
    >
      {/* Image Section */}
      <div className="relative h-48 overflow-hidden">
        <img 
          src={vehicle.image} 
          alt={vehicle.name} 
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
        />
        <div className="absolute top-4 left-4">
          <div className="bg-white bg-opacity-90 rounded-full p-2">
            <FaMotorcycle className="text-blue-600" />
          </div>
        </div>
        <div className="absolute top-4 right-4">
          <div className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
            Thuê ngay
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6">
        <div className="mb-4">
          <h3 className="text-xl font-bold text-gray-800 mb-2">{vehicle.name}</h3>
          <p className="text-gray-600 text-sm mb-3">{vehicle.description}</p>
          
          {/* Specs */}
          <div className="space-y-2 mb-4">
            {vehicle.shortSpecs && (
              <div className="flex items-center text-sm text-gray-600">
                <span className="font-medium">{t('vehicle.specs')}</span>
                <span className="ml-2">{vehicle.shortSpecs}</span>
              </div>
            )}
            <div className="flex items-center text-sm text-gray-600">
              <FaMapMarkerAlt className="mr-2 text-gray-400" />
              <span>{t('vehicle.location')}</span>
            </div>
          </div>

          {/* Rating */}
          <div className="flex items-center mb-4">
            <div className="flex items-center">
              <FaStar className="text-yellow-400 mr-1" />
              <span className="text-sm font-medium text-gray-800">4.8</span>
              <span className="text-sm text-gray-500 ml-1">{t('vehicle.ratingCount', { count: 120 })}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <button
            onClick={() => onBook?.(vehicle.slug)}
            className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 px-4 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
          >
            {t('vehicle.bookNow')}
          </button>
          <button
            onClick={() => onDetail?.(vehicle.slug)}
            className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
          >
            {t('vehicle.detail')}
          </button>
        </div>
      </div>
    </motion.div>
  );
}