import { Link } from "react-router-dom";
import { motion } from "framer-motion"

const formatPrice = (price: number, currency = "VND") => {
    if (currency === "EUR") return price + " EUR";
    return price.toLocaleString("vi-VN") + " VND";
};

const DestinationCard = ({ destination, isDark }: any) => (
    <motion.div
        whileHover={{ scale: 1.05 }}
        className={`rounded-lg overflow-hidden shadow-lg ${isDark ? "bg-gray-800" : "bg-white"}`}
    >
        <img src={destination.image} alt={destination.name} className="w-full h-48 object-cover" />
        <div className="p-6">
            <h3 className={`text-xl font-bold ${isDark ? "text-white" : "text-gray-800"}`}>{destination.name}</h3>
            <p className={`text-sm mb-2 ${isDark ? "text-gray-300" : "text-gray-600"}`}>{destination.shortDescription}</p>
            <div className="font-semibold text-blue-600 mb-2">Giá từ: {formatPrice(destination.priceFrom, destination.currency)}/slot</div>
            <Link
                to={`/destinations/${destination.id}`}
                className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition-colors mt-2 inline-block"
            >
                Xem chi tiết
            </Link>
        </div>
    </motion.div>
);

export default DestinationCard
