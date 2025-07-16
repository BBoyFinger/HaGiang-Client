import { useState } from "react";
import { useTranslation } from "react-i18next";
import ModalStayForm from "@/components/ModalStayForm";
import { stays } from "@/data/stays"
import { Helmet } from 'react-helmet-async';
import { FaSearch, FaFilter, FaHome, FaHotel, FaStar, FaMapMarkerAlt, FaBed, FaUsers } from 'react-icons/fa';
import AccommodationCard from "@/components/AccommodationCard.";

const roomTypes = [
  { value: "all", name: "Tất cả", icon: FaHome },
  { value: "homestay", name: "Homestay", icon: FaHome },
  { value: "hotel", name: "Khách sạn", icon: FaHotel },
];

function resolveStayImage(image: string) {
  // Nếu là ảnh local (bắt đầu bằng @/assets), import động
  if (image.startsWith('@/assets')) {
    try {
      return new URL(`../${image.replace('@/', '')}`, import.meta.url).href;
    } catch {
      return '';
    }
  }
  return image;
}

export default function Stay() {
  const { t } = useTranslation();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRoomType, setSelectedRoomType] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [priceRange, setPriceRange] = useState("all");

  // Filter stays based on search, room type, and price
  const filteredStays = stays.filter((stay: any) => {
    const matchesSearch = stay.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stay.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRoomType = selectedRoomType === "all" || stay.type === selectedRoomType;
    const matchesPrice = priceRange === "all" ||
      (priceRange === "budget" && stay.price < 500000) ||
      (priceRange === "mid" && stay.price >= 500000 && stay.price < 1000000) ||
      (priceRange === "luxury" && stay.price >= 1000000);
    return matchesSearch && matchesRoomType && matchesPrice;
  });

  const priceRanges = [
    { value: "all", name: t("stay.allPrices") },
    { value: "budget", name: t("stay.budget") },
    { value: "mid", name: t("stay.mid") },
    { value: "luxury", name: t("stay.luxury") },
  ];

  return (
    <>
      <Helmet>
        <title>{t('stay.title')}</title>
        <meta name="description" content={t('stay.description')} />
        <meta property="og:title" content={t('stay.title')} />
        <meta property="og:description" content={t('stay.description')} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://homieTravel.vn/stay" />
        <meta property="og:image" content="https://homieTravel.vn/og-image.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={t('stay.title')} />
        <meta name="twitter:description" content={t('stay.description')} />
        <meta name="twitter:image" content="https://homieTravel.vn/og-image.jpg" />
      </Helmet>

      {/* Hero Section */}
      <section className="relative h-80 bg-gradient-to-r from-green-600 to-blue-600 overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-40"></div>
        <div className="relative z-10 flex items-center justify-center h-full">
          <div className="text-center text-white">
            <h1 className="text-5xl font-bold mb-4">{t('stay.title')}</h1>
            <p className="text-xl max-w-2xl mx-auto px-4">
              {t('stay.heroDesc')}
            </p>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent"></div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-8 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="grid md:grid-cols-3 gap-6">
              {/* Search Bar */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder={t('stay.searchPlaceholder')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                />
              </div>

              {/* Room Type Filter */}
              <div className="flex items-center space-x-4 w-full">
                <div className="flex items-center text-gray-600">
                  <FaFilter className="mr-2" />
                  <span className="font-medium">{t('stay.roomTypeLabel')}:</span>
                </div>
                <div className="flex space-x-2 ">
                  {roomTypes.map((type) => {
                    const Icon = type.icon;
                    return (
                      <button
                        key={type.value}
                        onClick={() => setSelectedRoomType(type.value)}
                        className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${selectedRoomType === type.value
                            ? 'bg-green-600 text-white shadow-lg'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                      >
                        <Icon className="mr-2" />
                        {type.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Price Range Filter */}
              <div className="flex items-center space-x-4">
                <div className="flex items-center text-gray-600">
                  <FaStar className="mr-2" />
                  <span className="font-medium">{t('stay.priceLabel')}:</span>
                </div>
                <select
                  value={priceRange}
                  onChange={(e) => setPriceRange(e.target.value)}
                  className="block px-3 py-3 w-2/4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                >
                  {priceRanges.map((range) => (
                    <option key={range.value} value={range.value}>
                      {range.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Accommodations Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">{t('stay.accommodationTitle')}</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {t('stay.accommodationDesc')}
            </p>
          </div>

          {/* Results Count */}
          <div className="mb-8">
            <p className="text-gray-600">
              {t('stay.foundAccommodations', { count: filteredStays.length })}
            </p>
          </div>

          {/* Accommodations Grid */}
          {filteredStays.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredStays.map((stay) => (
                <div key={stay.id} className="group">
                  <AccommodationCard
                    stay={stay}
                    resolveStayImage={resolveStayImage}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaSearch className="text-3xl text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{t('stay.notFoundTitle')}</h3>
              <p className="text-gray-600 mb-6">
                {t('stay.notFoundDesc')}
              </p>
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedRoomType("all");
                  setPriceRange("all");
                }}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                {t('stay.clearFilter')}
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">{t('stay.whyChooseUsTitle')}</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {t('stay.whyChooseUsDesc')}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaHome className="text-2xl text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{t('stay.whyChooseUsOption1Title')}</h3>
              <p className="text-gray-600">
                {t('stay.whyChooseUsOption1Desc')}
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaMapMarkerAlt className="text-2xl text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{t('stay.whyChooseUsOption2Title')}</h3>
              <p className="text-gray-600">
                {t('stay.whyChooseUsOption2Desc')}
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaStar className="text-2xl text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{t('stay.whyChooseUsOption3Title')}</h3>
              <p className="text-gray-600">
                {t('stay.whyChooseUsOption3Desc')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-green-600 to-blue-600">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl font-bold text-white mb-4">{t('stay.ctaTitle')}</h2>
          <p className="text-xl text-green-100 mb-8">
            {t('stay.ctaDesc')}
          </p>
          <button
            onClick={() => setModalOpen(true)}
            className="bg-white text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            {t('stay.ctaButton')}
          </button>
        </div>
      </section>

      <ModalStayForm open={modalOpen} onClose={() => setModalOpen(false)} selectedRoomType={selectedRoomType} />
    </>
  );
}