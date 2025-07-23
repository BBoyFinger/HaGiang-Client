import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { vehicles } from "@/data/vehicles";
import ModalRentForm from "@/components/ModalRentForm";
import { Helmet } from "react-helmet-async";
import VehicleCard from "@/components/VehicleCard";
import { FaMotorcycle, FaCar, FaBicycle, FaSearch, FaFilter } from 'react-icons/fa';

export default function Rent() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedVehicleType, setSelectedVehicleType] = useState(vehicles[0].slug);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const handleBook = (slug: string) => {
    setSelectedVehicleType(slug);
    setModalOpen(true);
  };

  const handleDetail = (slug: string) => {
    navigate(`/rent/${slug}`);
  };

  // Filter vehicles based on search and category
  const filteredVehicles = vehicles.filter((vehicle: any) => {
    const matchesSearch = vehicle.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || vehicle.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [
    { id: "all", name: t("rent.all"), icon: FaMotorcycle },
    { id: "motorcycle", name: t("rent.motorcycle"), icon: FaMotorcycle },
    { id: "bicycle", name: t("rent.bicycle"), icon: FaBicycle },
  ];

  return (
    <>
      <Helmet>
        <title>{t('rent.title')}</title>
        <meta name="description" content={t('rent.description')} />
        <meta property="og:title" content={t('rent.title')} />
        <meta property="og:description" content={t('rent.description')} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://homieTravel.vn/rent" />
        <meta property="og:image" content="https://homieTravel.vn/og-image.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={t('rent.title')} />
        <meta name="twitter:description" content={t('rent.description')} />
        <meta name="twitter:image" content="https://homieTravel.vn/og-image.jpg" />
      </Helmet>

      {/* Hero Section */}
      <section className="relative h-80 bg-gradient-to-r from-primary to-accent overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-40"></div>
        <div className="relative z-10 flex items-center justify-center h-full">
          <div className="text-center text-light">
            <h1 className="text-5xl font-bold mb-4">{t('rent.title')}</h1>
            <p className="text-xl max-w-2xl mx-auto px-4">
              {t('rent.heroDesc')}
            </p>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-light to-transparent"></div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-8 bg-secondary/20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-light rounded-2xl shadow-lg p-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Search Bar */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="h-5 w-5 text-earth" />
                </div>
                <input
                  type="text"
                  placeholder={t('rent.searchPlaceholder')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-earth rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors text-[#1a1a1a] placeholder:text-[#555]"
                />
              </div>

              {/* Category Filter */}
              <div className="flex items-center space-x-4">
                <div className="flex items-center text-[#555]">
                  <FaFilter className="mr-2 text-primary" />
                  <span className="font-medium">{t('rent.categoryLabel')}:</span>
                </div>
                <div className="flex space-x-2">
                  {categories.map((category) => {
                    const Icon = category.icon;
                    return (
                      <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.id)}
                        className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${selectedCategory === category.id
                            ? 'bg-gradient-to-r from-primary to-accent text-[#1a1a1a] shadow-lg font-semibold'
                            : 'bg-light text-[#555] hover:bg-secondary border border-earth font-medium'
                          }`}
                      >
                        <Icon className="mr-2" />
                        {category.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vehicles Section */}
      <section className="py-16 bg-light">
        <div className="max-w-7xl mx-auto px-4">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#1a1a1a] mb-4">{t('rent.availableVehiclesTitle')}</h2>
            <p className="text-lg text-[#555] max-w-2xl mx-auto">
              {t('rent.availableVehiclesDesc')}
            </p>
          </div>

          {/* Results Count */}
          <div className="mb-8">
            <p className="text-[#555]">
              {t('rent.resultCount', { count: filteredVehicles.length })}
            </p>
          </div>

          {/* Vehicles Grid */}
          {filteredVehicles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredVehicles.map((vehicle) => (
                <div key={vehicle.slug} className="group">
                  <VehicleCard
                    vehicle={vehicle}
                    onBook={() => handleBook(vehicle.slug)}
                    onDetail={() => handleDetail(vehicle.slug)}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-light rounded-full flex items-center justify-center mx-auto mb-4">
                <FaSearch className="text-3xl text-secondary" />
              </div>
              <h3 className="text-xl font-semibold text-[#1a1a1a] mb-2">{t('rent.notFoundTitle')}</h3>
              <p className="text-[#555] mb-6">
                {t('rent.notFoundDesc')}
              </p>
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("all");
                }}
                className="bg-gradient-to-r from-primary to-accent text-[#1a1a1a] px-6 py-2 rounded-lg hover:from-accent hover:to-primary transition-colors font-semibold"
              >
                {t('rent.clearFilter')}
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 bg-gradient-to-r from-primary to-accent">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#1a1a1a] mb-4">{t('rent.whyTitle')}</h2>
            <p className="text-lg text-[#555] max-w-2xl mx-auto">
              {t('rent.whyDesc')}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center text-[#1a1a1a]">
              <div className="w-16 h-16 bg-light/60 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaMotorcycle className="text-2xl text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{t('rent.whyOption1Title')}</h3>
              <p className="text-[#555]">
                {t('rent.whyOption1Desc')}
              </p>
            </div>

            <div className="text-center text-[#1a1a1a]">
              <div className="w-16 h-16 bg-light/60 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaSearch className="text-2xl text-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{t('rent.whyOption2Title')}</h3>
              <p className="text-[#555]">
                {t('rent.whyOption2Desc')}
              </p>
            </div>

            <div className="text-center text-[#1a1a1a]">
              <div className="w-16 h-16 bg-light/60 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaCar className="text-2xl text-secondary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{t('rent.whyOption3Title')}</h3>
              <p className="text-[#555]">
                {t('rent.whyOption3Desc')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary to-accent">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl font-bold text-[#1a1a1a] mb-4">{t('rent.ctaTitle')}</h2>
          <p className="text-xl text-[#555] mb-8">
            {t('rent.ctaDesc')}
          </p>
          <button
            onClick={() => setModalOpen(true)}
            className="bg-light text-primary px-8 py-3 rounded-lg font-semibold hover:bg-secondary transition-colors"
          >
            {t('rent.ctaButton')}
          </button>
        </div>
      </section>

      <ModalRentForm open={modalOpen} onClose={() => setModalOpen(false)} selectedVehicleType={selectedVehicleType} />
    </>
  );
}