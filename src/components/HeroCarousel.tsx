import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiChevronLeft, FiChevronRight, FiSearch } from "react-icons/fi";
import image1 from "@/assets/1.jpg";
import image2 from "@/assets/2.png";
import image3 from "@/assets/3.jpg";
import image4 from "@/assets/4.jpg";

interface CarouselSlide {
  id: number;
  image: string;
  title: string;
  subtitle: string;
  description: string;
}

const slides: CarouselSlide[] = [
  {
    id: 1,
    image: image1,
    title: "Khám Phá Vẻ Đẹp Hà Giang",
    subtitle: "Miền đất của những đỉnh núi hùng vĩ",
    description: "Từ đèo Mã Pì Lèng hùng vĩ đến ruộng bậc thang Hoàng Su Phì rực rỡ"
  },
  {
    id: 2,
    image: image2,
    title: "Đèo Mã Pì Lèng",
    subtitle: "Tứ đại đỉnh đèo Việt Nam",
    description: "Con đèo đẹp nhất Việt Nam với độ cao 1.500m so với mực nước biển"
  },
  {
    id: 3,
    image: image3,
    title: "Ruộng Bậc Thang Hoàng Su Phì",
    subtitle: "Kiệt tác của thiên nhiên",
    description: "Những thửa ruộng bậc thang uốn lượn theo sườn núi tạo nên cảnh quan độc đáo"
  },
  {
    id: 4,
    image: image4,
    title: "Cao Nguyên Đá Đồng Văn",
    subtitle: "Công viên địa chất toàn cầu",
    description: "Khám phá vẻ đẹp hoang dã của cao nguyên đá với những dãy núi đá tai mèo"
  }
];

interface HeroCarouselProps {
  isDark: boolean;
}

export default function HeroCarousel({ isDark }: HeroCarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(0);

  // Auto slide every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1);
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

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
            src={slides[currentSlide].image}
            alt={slides[currentSlide].title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50" />
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div className="relative h-full flex items-center justify-center text-center">
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
                {slides[currentSlide].title}
              </h1>
              <h2 className="text-2xl md:text-3xl font-semibold text-blue-300">
                {slides[currentSlide].subtitle}
              </h2>
              <p className="text-xl text-white max-w-2xl mx-auto">
                {slides[currentSlide].description}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex justify-center"
          >
            <div className="flex items-center bg-white rounded-full p-2 w-full max-w-xl shadow-lg">
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
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentSlide
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
} 