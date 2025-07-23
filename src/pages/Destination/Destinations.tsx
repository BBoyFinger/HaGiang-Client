import React, { useState, useEffect } from "react";
import DestinationCard from "@/components/DestinationCard";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet-async";
import axiosInstance from "@/config/axiosConfig";
import { mockDestinations } from "@/data/mockDestinations";
import { FiSearch, FiFrown, FiMapPin, FiFilter } from "react-icons/fi";

export default function Destinations() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language === "en" ? "en" : "vi";
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<string>("");
  const [destinations, setDestinations] = useState<any[]>([]);

  useEffect(() => {
    axiosInstance.get("/destinations")
      .then(res => {
        setDestinations(res.data.destinations);
      })
      .catch(() => {
        setDestinations(mockDestinations);
      });
  }, []);

  // Lấy tất cả type duy nhất từ data
  const types = Array.from(new Set(destinations.map((d) => d.type)));

  const filtered = destinations.filter((d) => {
    const matchType = filter ? d.type === filter : true;
    const matchName = d.name?.[lang]?.toLowerCase().includes(search.toLowerCase());
    return matchType && matchName;
  });

  return (
    <>
      <Helmet>
        <title>{t('destinations.title') || 'Các điểm du lịch Hà Giang'}</title>
        <meta name="description" content={t('destinations.description') || 'Khám phá các điểm đến nổi bật tại Hà Giang'} />
        <meta property="og:title" content={t('destinations.title') || 'Điểm đến Hà Giang'} />
        <meta property="og:description" content={t('destinations.description') || 'Khám phá các điểm đến nổi bật tại Hà Giang'} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://homieTravel.vn/destination" />
        <meta property="og:image" content="https://homieTravel.vn/og-image.jpg" />
        <meta name="tiktok:card" content="summary_large_image" />
        <meta name="tiktok:title" content={t('destinations.title') || 'Điểm đến Hà Giang'} />
        <meta name="tiktok:description" content={t('destinations.description') || 'Khám phá các điểm đến nổi bật tại Hà Giang'} />
        <meta name="tiktok:image" content="https://homieTravel.vn/og-image.jpg" />
      </Helmet>
      {/* Hero Section */}
      <section className="relative h-80 bg-gradient-to-r from-primary to-accent overflow-hidden mb-0">
        <div className="absolute inset-0 bg-black opacity-40"></div>
        <div className="relative z-10 flex items-center justify-center h-full">
          <div className="text-center text-light">
            <h1 className="text-5xl font-bold mb-4">{t('destinations.title') || 'Các điểm du lịch Hà Giang'}</h1>
            <p className="text-xl max-w-2xl mx-auto px-4">{t('destinations.heroDesc') || 'Khám phá những điểm đến nổi bật, thiên nhiên hùng vĩ và văn hóa đặc sắc của Hà Giang.'}</p>
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
                  <FiSearch className="h-5 w-5 text-earth" />
                </div>
                <input
                  type="text"
                  placeholder={t('destinations.searchPlaceholder') || 'Tìm kiếm theo tên...'}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-earth rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors text-[#1a1a1a] placeholder:text-[#555]"
                />
              </div>
              {/* Type Filter */}
              <div className="flex items-center space-x-4">
                <div className="flex items-center text-[#555]">
                  <FiFilter className="mr-2 text-primary" />
                  <span className="font-medium">{t('destinations.typeLabel') || 'Loại điểm đến'}:</span>
                </div>
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="border border-earth rounded-lg px-3 py-2 bg-light text-[#1a1a1a] focus:border-primary focus:ring-2 focus:ring-primary/20 transition"
                >
                  <option value="">{t('destinations.allTypes') || 'Tất cả loại'}</option>
                  {types.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Destinations Section */}
      <section className="py-16 bg-light">
        <div className="max-w-7xl mx-auto px-4">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#1a1a1a] mb-4">{t('destinations.sectionTitle') || 'Các điểm đến nổi bật'}</h2>
            <p className="text-lg text-[#555] max-w-2xl mx-auto">{t('destinations.sectionDesc') || 'Tìm kiếm và khám phá các địa danh nổi bật của Hà Giang.'}</p>
          </div>
          {/* Results Count */}
          <div className="mb-8">
            <p className="text-[#555]">{t('destinations.resultCount', { count: filtered.length })}</p>
          </div>
          {/* Destinations Grid */}
          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filtered.map((d) => (
                <div key={d.slug} className="group">
                  <DestinationCard destination={d} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-light rounded-full flex items-center justify-center mx-auto mb-4">
                <FiFrown className="text-3xl text-accent" />
              </div>
              <h3 className="text-xl font-semibold text-[#1a1a1a] mb-2">{t('destinations.notFoundTitle') || 'Không tìm thấy điểm đến phù hợp'}</h3>
              <p className="text-[#555] mb-6">{t('destinations.notFoundDesc') || 'Hãy thử thay đổi bộ lọc hoặc từ khóa tìm kiếm.'}</p>
              <button
                onClick={() => {
                  setSearch("");
                  setFilter("");
                }}
                className="bg-gradient-to-r from-primary to-accent text-[#1a1a1a] px-6 py-2 rounded-lg hover:from-accent hover:to-primary transition-colors font-semibold"
              >
                {t('destinations.clearFilter') || 'Xóa bộ lọc'}
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  );
} 