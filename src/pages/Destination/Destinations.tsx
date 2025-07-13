import React, { useState, useEffect } from "react";
import DestinationCard from "@/components/DestinationCard";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet-async";
import axiosInstance from "@/config/axiosConfig";
import { mockDestinations } from "@/data/mockDestinations";

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
        <title>{t('destination.title') || 'Điểm đến Hà Giang'}</title>
        <meta name="description" content={t('destination.description') || 'Khám phá các điểm đến nổi bật tại Hà Giang'} />
        <meta property="og:title" content={t('destination.title') || 'Điểm đến Hà Giang'} />
        <meta property="og:description" content={t('destination.description') || 'Khám phá các điểm đến nổi bật tại Hà Giang'} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://homieTravel.vn/destination" />
        <meta property="og:image" content="https://homieTravel.vn/og-image.jpg" />
        <meta name="tiktok:card" content="summary_large_image" />
        <meta name="tiktok:title" content={t('destination.title') || 'Điểm đến Hà Giang'} />
        <meta name="tiktok:description" content={t('destination.description') || 'Khám phá các điểm đến nổi bật tại Hà Giang'} />
        <meta name="tiktok:image" content="https://homieTravel.vn/og-image.jpg" />
      </Helmet>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6">{t('destination.listTitle') || 'Các điểm du lịch Hà Giang'}</h2>
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <input
            type="text"
            placeholder={t('destination.searchPlaceholder') || "Tìm kiếm theo tên..."}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border rounded px-3 py-2 flex-1"
          />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border rounded px-3 py-2 w-48"
          >
            <option value="">{t('destination.allTypes') || 'Tất cả loại'}</option>
            {types.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filtered.map((d) => (
            <DestinationCard key={d.slug} destination={d} />
          ))}
          {filtered.length === 0 && <div>{t('destination.notFound') || 'Không tìm thấy điểm du lịch phù hợp.'}</div>}
        </div>
      </div>
    </>
  );
} 