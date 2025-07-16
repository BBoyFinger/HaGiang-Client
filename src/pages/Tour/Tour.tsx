import { useState, useEffect } from "react";
import { mockTours } from "../../data/tours";
import axiosInstance from "../../config/axiosConfig";
import TourCard from "@/components/TourCard";
import ModalBookingForm from "@/components/ModalBookingForm";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { FaSearch, FaFilter, FaMapMarkerAlt, FaCalendar, FaStar, FaUsers, FaClock, FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { useGetToursQuery } from '@/services/api';
import { Tour } from '@/types/TourType';

export default function TourPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTourId, setSelectedTourId] = useState(null);
  const [type, setType] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [tours, setTours] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Di chuyển hook và mảng vào trong function component
  const { t, i18n } = useTranslation();
  const lang = i18n.language === 'en' ? 'en' : 'vi';

  const tourTypes = [
    { value: '', label: t('tour.filter.all'), icon: FaMapMarkerAlt },
    { value: 'song', label: t('tour.filter.river'), icon: FaMapMarkerAlt },
    { value: 'hang_dong', label: t('tour.filter.cave'), icon: FaMapMarkerAlt },
    { value: 'nui', label: t('tour.filter.mountain'), icon: FaMapMarkerAlt },
    { value: 'luxury', label: t('tour.filter.luxury'), icon: FaStar },
  ];

  const sortOptions = [
    { value: '', label: t('tour.sort.default') },
    { value: 'price', label: t('tour.sort.price_asc') },
    { value: 'price_desc', label: t('tour.sort.price_desc') },
    { value: 'rating', label: t('tour.sort.rating') },
    { value: 'name', label: t('tour.sort.name') },
    { value: 'duration', label: t('tour.sort.duration') },
  ];

  useEffect(() => {
    axiosInstance.get("/tours")
      .then(res => {
        setTours(res.data.tours);
      })
      .catch(() => {
        setTours(mockTours);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleBook = (tourId: any) => {
    setSelectedTourId(tourId);
    setModalOpen(true);
  };

  
  // Filter tours
  let filteredTours = tours.filter((tour: any) => {
    const matchesType = !type || (tour.type?.[lang] || tour.type?.vi || '').toLowerCase() === type.toLowerCase();
    const matchesSearch = !searchTerm ||
      (tour.name?.[lang]?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (tour.description?.[lang]?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    const tourPrice = tour.price?.perSlot || 0;
    const minPrice = priceRange.min ? (parseInt(priceRange.min) || 0) : 0;
    const maxPrice = priceRange.max ? (parseInt(priceRange.max) || 0) : 0;
    const matchesPrice = !priceRange.min || tourPrice >= minPrice;
    const matchesMaxPrice = !priceRange.max || tourPrice <= maxPrice;
    return matchesType && matchesSearch && matchesPrice && matchesMaxPrice;
  });



  // Sort tours
  if (sortBy === 'price') {
    filteredTours = [...filteredTours].sort((a, b) => (a.price?.perSlot || 0) - (b.price?.perSlot || 0));
  } else if (sortBy === 'price_desc') {
    filteredTours = [...filteredTours].sort((a, b) => (b.price?.perSlot || 0) - (a.price?.perSlot || 0));
  } else if (sortBy === 'rating') {
    filteredTours = [...filteredTours].sort((a, b) => (b.rating || 0) - (a.rating || 0));
  } else if (sortBy === 'name') {
    filteredTours = [...filteredTours].sort((a, b) => (a.name?.[lang] || '').localeCompare(b.name?.[lang] || ''));
  } else if (sortBy === 'duration') {
    filteredTours = [...filteredTours].sort((a, b) => (a.duration?.[lang]?.length || 0) - (b.duration?.[lang]?.length || 0));
  }

  // Carousel images
  const carouselImages = tours.slice(0, 5).map((t: Tour) => t.imageUrls[0]);
  const [carouselIdx, setCarouselIdx] = useState(0);

  // Auto slide carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCarouselIdx((prev) => (prev + 1) % carouselImages.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [carouselImages.length]);

  const nextSlide = () => {
    setCarouselIdx((carouselIdx + 1) % carouselImages.length);
  };

  const prevSlide = () => {
    setCarouselIdx((carouselIdx - 1 + carouselImages.length) % carouselImages.length);
  };

  if (loading) {
    return <div className="text-center py-16">{t('tour.loading')}</div>;
  }

  return (
    <>
      <Helmet>
        <title>{t('tour.title')}</title>
        <meta name="description" content={t('tour.description')} />
        <meta property="og:title" content={t('tour.title')} />
        <meta property="og:description" content={t('tour.description')} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://homieTravel.vn/tour" />
        <meta property="og:image" content="https://homieTravel.vn/og-image.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={t('tour.title')} />
        <meta name="twitter:description" content={t('tour.description')} />
        <meta name="twitter:image" content="https://homieTravel.vn/og-image.jpg" />
      </Helmet>

      {/* Hero Section with Carousel */}
      <section className="relative h-96 lg:h-[500px] overflow-hidden">
        {/* Carousel */}
        <div className="relative w-full h-full">
          <img 
            src={carouselImages[carouselIdx]} 
            alt="Tour" 
            className="w-full h-full object-cover transition-opacity duration-1000" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
          
          {/* Content */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white px-4">
              <h1 className="text-4xl lg:text-6xl font-bold mb-4">
                {t('tour.hero.title')}
              </h1>
              <p className="text-xl lg:text-2xl mb-6 opacity-90">
                {t('tour.hero.subtitle')}
              </p>
              <div className="flex items-center justify-center space-x-6 text-sm lg:text-base">
                <div className="flex items-center space-x-2">
                  <FaUsers className="text-yellow-400" />
                  <span>{t('tour.hero.customers')}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FaStar className="text-yellow-400" />
                  <span>{t('tour.hero.rating')}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FaClock className="text-yellow-400" />
                  <span>{t('tour.hero.support')}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Arrows */}
          <button 
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/30 transition-all duration-300"
          >
            <FaArrowLeft />
          </button>
          <button 
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/30 transition-all duration-300"
          >
            <FaArrowRight />
          </button>

          {/* Dots */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-3">
            {carouselImages.map((_: string, idx: number) => (
              <button
                key={idx}
                onClick={() => setCarouselIdx(idx)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  idx === carouselIdx 
                    ? 'bg-white scale-125' 
                    : 'bg-white/50 hover:bg-white/75'
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-8 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            {/* Search Bar */}
            <div className="mb-6">
              <div className="relative w-full">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder={t('tour.search.placeholder')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                />
              </div>
            </div>

            {/* Filters Container */}
            <div className="space-y-4 lg:space-y-0 lg:flex lg:items-center lg:justify-between gap-4">
              {/* Tour Type Filter */}
              <div className="flex-1">
                <div className="flex items-center text-gray-600 mb-3">
                  <FaFilter className="mr-2" />
                  <span className="font-medium text-sm">{t('tour.filter.type')}:</span>
                </div>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors appearance-none"
                >
                  {tourTypes.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              {/* Price Range */}
              <div className="flex-1 space-y-3">
                <div className="flex items-center text-gray-600">
                  <FaMapMarkerAlt className="mr-2" />
                  <span className="font-medium text-sm">{t('tour.filter.priceRange')}:</span>
                </div>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    placeholder={t('tour.filter.priceMin')}
                    value={priceRange.min}
                    onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                    className="flex-1 px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                  />
                  <input
                    type="number"
                    placeholder={t('tour.filter.priceMax')}
                    value={priceRange.max}
                    onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                    className="flex-1 px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                  />
                </div>
              </div>

              {/* Sort */}
              <div className="flex-1">
                <div className="flex items-center text-gray-600 mb-3">
                  <FaCalendar className="mr-2" />
                  <span className="font-medium text-sm">{t('tour.sort.label')}:</span>
                </div>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors appearance-none"
                >
                  {sortOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tours Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">{t('tour.section.title')}</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {t('tour.section.subtitle')}
            </p>
          </div>

          {/* Results Count */}
          <div className="mb-8 flex items-center justify-between">
            <p className="text-gray-600">
              {t('tour.resultCount', { count: filteredTours.length })}
            </p>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">{t('tour.display')}:</span>
              <div className="flex space-x-2">
                <button className="px-3 py-1 bg-purple-100 text-purple-600 rounded-lg text-sm font-medium">
                  {t('tour.displayGrid')}
                </button>
                <button className="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-200">
                  {t('tour.displayList')}
                </button>
              </div>
            </div>
          </div>

          {/* Tours Grid */}
          {filteredTours.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredTours.map((tour: any) => (
                <div key={tour._id} className="group">
                  <TourCard tour={tour} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaSearch className="text-3xl text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{t('tour.notFound.title')}</h3>
              <p className="text-gray-600 mb-6">
                {t('tour.notFound.subtitle')}
              </p>
              <button
                onClick={() => {
                  setSearchTerm("");
                  setType("");
                  setPriceRange({ min: '', max: '' });
                }}
                className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
              >
                {t('tour.notFound.clearFilter')}
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 bg-gradient-to-r from-purple-600 to-pink-600">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">{t('tour.why.title')}</h2>
            <p className="text-xl text-purple-100 max-w-2xl mx-auto">
              {t('tour.why.subtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center text-white">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaUsers className="text-2xl" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{t('tour.why.guideTitle')}</h3>
              <p className="text-purple-100">
                {t('tour.why.guideDesc')}
              </p>
            </div>
            <div className="text-center text-white">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaStar className="text-2xl" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{t('tour.why.qualityTitle')}</h3>
              <p className="text-purple-100">
                {t('tour.why.qualityDesc')}
              </p>
            </div>
            <div className="text-center text-white">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaClock className="text-2xl" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{t('tour.why.supportTitle')}</h3>
              <p className="text-purple-100">
                {t('tour.why.supportDesc')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Modal */}
      {modalOpen && (
        <ModalBookingForm
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          selectedTourId={selectedTourId}
        />
      )}
    </>
  );
}