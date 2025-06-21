import { useEffect, useState } from "react";
import { fetchDestinations, Destination } from "@/api/destinations";
import { Link } from "react-router-dom";
import { motion } from "framer-motion"
import { FiSearch } from "react-icons/fi";
import DestinationCard from "@/components/DestinationCard";
import HeroCarousel from "@/components/HeroCarousel";

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
      <HeroCarousel isDark={isDark} />

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