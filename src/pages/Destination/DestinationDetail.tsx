import { useParams, useNavigate } from "react-router-dom";
import { useMemo } from "react";
import { destinations } from "@/data/destinations";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { FaArrowLeft, FaHeart, FaMapMarkerAlt, FaTag } from "react-icons/fa";
import { useState } from "react";
import DestinationCard from "@/components/DestinationCard";

export default function DestinationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [isFavorite, setIsFavorite] = useState(false);
  const destination = useMemo(() => destinations.find((d: any) => d.id === Number(id)), [id]);

  // Related destinations (simple: others except current)
  const related = destinations.filter((d: any) => d.id !== Number(id)).slice(0, 3);

  if (!destination) return <div className="p-8">Không tìm thấy điểm đến.</div>;

  return (
    <>
      <Helmet>
        <title>{destination.name} - Homie Travel</title>
      </Helmet>
      {/* Hero Section */}
      <div className="relative w-full h-72 md:h-96 flex items-end justify-center mb-8">
        <img
          src={destination.image}
          alt={destination.name}
          className="absolute inset-0 w-full h-full object-cover object-center  shadow-lg"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent rounded-b-3xl" />
        {/* Back Button - floating top left */}
        <button 
          onClick={() => navigate(-1)}
          className="absolute top-6 left-6 z-10 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300"
        >
          <FaArrowLeft />
        </button>
        {/* Favorite Button - floating top right */}
        <button
          onClick={() => setIsFavorite((v) => !v)}
          className={`absolute top-6 right-6 z-10 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
            isFavorite 
              ? "bg-red-500 text-white" 
              : "bg-white/20 backdrop-blur-sm text-white hover:bg-white/30"
          }`}
        >
          <FaHeart className={`text-lg ${isFavorite ? "fill-current" : "hover:fill-red-500"}`} />
        </button>
        <div className="relative z-10 flex flex-col items-center w-full px-4 pb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold text-white drop-shadow-lg text-center mb-2">{destination.name}</h1>
          <div className="flex flex-wrap gap-3 justify-center items-center mb-2">
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-purple-600/80 text-white text-sm font-semibold shadow">
              <FaMapMarkerAlt className="mr-1" /> Hà Giang
            </span>
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-pink-500/80 text-white text-sm font-semibold shadow">
              <FaTag className="mr-1" /> {destination.shortDescription}
            </span>
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/80 text-purple-700 text-sm font-semibold shadow">
              {t("Giá từ")}: {destination.priceFrom?.toLocaleString("vi-VN")} {destination.currency || "VND"}/slot
            </span>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="max-w-5xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        {/* Main Description */}
        <div className="md:col-span-2">
          <h2 className="text-2xl font-bold mb-4 text-purple-700">{t("Giới thiệu chi tiết")}</h2>
          <div className="whitespace-pre-line text-base text-gray-800 leading-relaxed mb-6">
            {destination.detail.fullDescription}
          </div>
        </div>
        {/* Quick Info Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col gap-4 border border-purple-100">
          <h3 className="text-lg font-bold text-purple-700 mb-2">{t("Thông tin nhanh")}</h3>
          <div className="flex items-center gap-2 text-gray-700">
            <FaMapMarkerAlt className="text-purple-500" /> Hà Giang
          </div>
          <div className="flex items-center gap-2 text-gray-700">
            <FaTag className="text-pink-500" /> {destination.shortDescription}
          </div>
          <div className="flex items-center gap-2 text-gray-700">
            <span className="font-semibold">{t("Giá từ")}:</span> {destination.priceFrom?.toLocaleString("vi-VN")} {destination.currency || "VND"}/slot
          </div>
          <button className="mt-4 w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold shadow hover:from-purple-700 hover:to-pink-700 transition-all">
            {t("Đặt tour ngay")}
          </button>
        </div>
      </div>

      {/* Related Destinations */}
      <div className="max-w-6xl mx-auto px-4 mb-16">
        <h2 className="text-2xl font-bold text-purple-700 mb-6">{t("Khám phá điểm đến khác")}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {related.map((d) => (
            <DestinationCard key={d.id} destination={d} />
          ))}
        </div>
      </div>
    </>
  );
}
