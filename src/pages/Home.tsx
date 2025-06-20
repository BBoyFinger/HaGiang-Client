import { useEffect, useState } from "react";
import { fetchDestinations, Destination } from "@/api/destinations";
import { Link } from "react-router-dom";
import { motion } from "framer-motion"
import { FiSearch } from "react-icons/fi";
import banner from "@/assets/1.jpg"
import DestinationCard from "@/components/DestinationCard";

export default function Home() {
  // const [destinations, setDestinations] = useState<Destination[]>([]);
  const destinations = [
    {
      id: 1,
      name: "Bali Paradise",
      location: "Indonesia",
      price: 1299,
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4",
      type: "beach"
    },
    {
      id: 2,
      name: "Swiss Alps",
      location: "Switzerland",
      price: 1899,
      rating: 4.9,
      image: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a",
      type: "mountain"
    },
    {
      id: 3,
      name: "Tokyo Lights",
      location: "Japan",
      price: 1599,
      rating: 4.7,
      image: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26",
      type: "city"
    },
    {
      id: 4,
      name: "Tokyo Lights",
      location: "Japan",
      price: 1599,
      rating: 4.7,
      image: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26",
      type: "city"
    }
  ];
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = () => setIsDark(!isDark);

  // useEffect(() => {
  //   fetchDestinations().then(setDestinations);
  // }, []);

  return (
    <div className="relative h-screen">
      <div className="absolute inset-0">
        <img
          src={banner}
          alt="Travel Hero"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50" />
      </div>

      <Hero isDark={isDark} />

      <div className="container mx-auto px-6 py-16">
        <h2 className={`text-3xl font-bold mb-8 ${isDark ? "text-white" : "text-gray-800"}`}>
          Featured Destinations
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {destinations.map((destination) => (
            <DestinationCard key={destination.id} destination={destination} isDark={isDark} />
          ))}
        </div>
      </div>

    </div>
  );
}

const Hero = ({ isDark }: any) => {
  return (
    <div className="relative h-full flex items-center justify-center text-center">
      <div className="space-y-8 px-4">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-6xl font-bold text-white"
        >
          Khám Phá Vẻ Đẹp Hà Giang
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-xl text-white"
        >
          Từ đèo Mã Pì Lèng hùng vĩ đến ruộng bậc thang Hoàng Su Phì rực rỡ
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex justify-center"
        >
          <div className="flex items-center bg-white rounded-full p-2 w-full max-w-xl">
            <FiSearch className="text-gray-400 ml-4" />
            <input
              type="text"
              placeholder="Tìm kiếm địa điểm nổi bật ở Hà Giang..."
              className="w-full px-4 py-2 rounded-full focus:outline-none"
            />
            <button className="bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600 transition-colors">
              Search
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}