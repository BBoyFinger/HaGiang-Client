import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiChevronLeft, FiChevronRight, FiSearch } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import axiosInstance from "@/config/axiosConfig";

interface CarouselSlide {
  _id: string;
  image: string;
  isActive: boolean;
}

interface HeroCarouselProps {
  isDark: boolean;
  initialSearchTerm?: string;
  onSearchSubmit?: (term: string) => void;
}

const HeroCarousel = ({ isDark, initialSearchTerm = '', onSearchSubmit }: HeroCarouselProps) => {
  const { t } = useTranslation();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(0);
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialSearchTerm && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [initialSearchTerm]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearchSubmit && searchTerm.trim()) {
      onSearchSubmit(searchTerm.trim());
    }
  };

  const [slides, setSlides] = useState<CarouselSlide[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const response = await axiosInstance.get('/hero-carousel');
        const apiSlides = response.data.slides.map((slide: any) => ({
          _id: slide._id,
          image: slide?.image,
          isActive: slide.isActive
        }));
        setSlides(apiSlides);
      } catch (error) {
        console.error('Error fetching carousel slides:', error);
        // Fallback to default slides
        setSlides([
          {
            _id: '1',
            image: "/src/assets/1.jpg",
            isActive: true
          },
          {
            _id: '2',
            image: "/src/assets/2.png",
            isActive: true
          },
          {
            _id: '3',
            image: "/src/assets/3.jpg",
            isActive: true
          },
          {
            _id: '4',
            image: "/src/assets/4.jpg",
            isActive: true
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchSlides();
  }, []);

  // Auto slide every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1);
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => {
    setDirection(1);
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setDirection(-1);
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index: number) => {
    setDirection(index > currentSlide ? 1 : -1);
    setCurrentSlide(index);
  };

  if (loading) {
    return (
      <div className="relative h-full overflow-hidden bg-gray-200 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="relative h-full overflow-hidden">
      {/* Carousel Slides */}
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={currentSlide}
          custom={direction}
          initial={{ x: direction > 0 ? 1000 : -1000, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: direction > 0 ? -1000 : 1000, opacity: 0 }}
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 }
          }}
          className="absolute inset-0"
        >
                      <img
              src={slides[currentSlide]?.image}
              alt="Slide"
              className="w-full h-full object-cover"
            />
          <div className="absolute inset-0 bg-black bg-opacity-50" />
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      {/* <div className="relative h-full flex items-center justify-center text-center">
        <div className="space-y-8 px-4 z-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <h1 className="text-4xl md:text-6xl font-bold text-white">
                {t(slides[currentSlide].titleKey)}
              </h1>
              <h2 className="text-2xl md:text-3xl font-semibold text-blue-300">
                {t(slides[currentSlide].subtitleKey)}
              </h2>
              <p className="text-xl text-white max-w-2xl mx-auto">
                {t(slides[currentSlide].descriptionKey)}
              </p>
            </motion.div>
          </AnimatePresence>

        
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex justify-center"
          >
            <form
              className="flex items-center bg-white rounded-full p-2 w-full max-w-xl shadow-lg"
              onSubmit={handleSearch}
            >
              <FiSearch className="text-gray-400 ml-4" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder={t("hero.search.placeholder")}
                className="w-full px-4 py-2 rounded-full focus:outline-none"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
              <button type="submit" className="bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600 transition-colors">
                {t("hero.search.button")}
              </button>
            </form>
          </motion.div>
        </div>
      </div> */}

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-75 transition-all z-20"
        aria-label="Previous slide"
      >
        <FiChevronLeft size={24} />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-75 transition-all z-20"
        aria-label="Next slide"
      >
        <FiChevronRight size={24} />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all ${index === currentSlide
                ? "bg-white scale-125"
                : "bg-white bg-opacity-50 hover:bg-opacity-75"
              }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-black bg-opacity-30 z-20">
        <motion.div
          className="h-full bg-white"
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 5, ease: "linear" }}
          key={currentSlide}
        />
      </div>
    </div>
  );
};

export default HeroCarousel; 