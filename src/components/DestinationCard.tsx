import { motion } from "framer-motion"

const DestinationCard = ({ destination, isDark }: any) => (
    <motion.div
        whileHover={{ scale: 1.05 }}
        className={`rounded-lg overflow-hidden shadow-lg ${isDark ? "bg-gray-800" : "bg-white"}`}
    >
        <img src={destination.image} alt={destination.name} className="w-full h-48 object-cover" />
        <div className="p-6">
            <h3 className={`text-xl font-bold ${isDark ? "text-white" : "text-gray-800"}`}>{destination.name}</h3>
            <p className={`text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}>{destination.location}</p>
            <div className="mt-4 flex justify-between items-center">
                <span className={`font-bold ${isDark ? "text-white" : "text-gray-800"}`}>${destination.price}</span>
                <button className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition-colors">
                    View Details
                </button>
            </div>
        </div>
    </motion.div>
);

export default DestinationCard
