import { useEffect, useState } from "react";
import { fetchDestinations, Destination } from "@/api/destinations";
import { Link } from "react-router-dom";
import { motion } from "framer-motion"
import { FiSearch } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import DestinationCard from "@/components/DestinationCard";
import HeroCarousel from "@/components/HeroCarousel";
import image1 from "@/assets/1.jpg";

export default function Home() {
  const { t } = useTranslation();
  
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
    <div>
      {/* Hero Section */}
      <section className="h-screen">
        <HeroCarousel isDark={isDark} />
      </section>

      {/* Featured Destinations Section */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <h2 className={`text-3xl font-bold mb-8 text-center ${isDark ? "text-white" : "text-gray-800"}`}>
            {t("home.featuredDestinations")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {destinations.map((destination) => (
              <DestinationCard key={destination.id} destination={destination} isDark={isDark} />
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className={`py-16 ${isDark ? "bg-gray-800" : "bg-gray-50"}`}>
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className={`text-3xl font-bold mb-6 ${isDark ? "text-white" : "text-gray-800"}`}>
                {t("home.about.title")}
              </h2>
              <p className={`text-lg leading-relaxed mb-6 ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                {t("home.about.description1")}
              </p>
              <p className={`text-lg leading-relaxed mb-8 ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                {t("home.about.description2")}
              </p>
              <Link 
                to="/about"
                className={`inline-block px-8 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors ${isDark ? "hover:bg-blue-400" : ""}`}
              >
                {t("home.about.learnMore")}
              </Link>
            </div>
            <div className="relative">
              <img 
                src={image1} 
                alt="Ha Giang Landscape" 
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}