import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { destinations as mockDestinations } from "@/data/destinations";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { FaArrowLeft, FaHeart, FaMapMarkerAlt, FaTag, FaShareAlt, FaRegHeart } from "react-icons/fa";
import DestinationCard from "@/components/DestinationCard";
import axiosInstance from "@/config/axiosConfig";


export default function DestinationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [isFavorite, setIsFavorite] = useState(false);
  const [destination, setDestination] = useState<any | null>(null);
  const [related, setRelated] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showMap, setShowMap] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);
  // Kéo/swipe
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const handlePrev = () => {
    setCurrentImage((prev) => (prev === 0 ? totalImages - 1 : prev - 1));
  };
  const handleNext = () => {
    setCurrentImage((prev) => (prev === totalImages - 1 ? 0 : prev + 1));
  };
  // Mobile swipe
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    touchEndX.current = e.changedTouches[0].clientX;
    if (touchStartX.current !== null && touchEndX.current !== null) {
      const diff = touchStartX.current - touchEndX.current;
      if (diff > 40) handleNext(); // swipe left
      else if (diff < -40) handlePrev(); // swipe right
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };
  // Desktop drag
  const mouseDownX = useRef<number | null>(null);
  const mouseUpX = useRef<number | null>(null);
  const onMouseDown = (e: React.MouseEvent) => {
    mouseDownX.current = e.clientX;
  };
  const onMouseUp = (e: React.MouseEvent) => {
    mouseUpX.current = e.clientX;
    if (mouseDownX.current !== null && mouseUpX.current !== null) {
      const diff = mouseDownX.current - mouseUpX.current;
      if (diff > 40) handleNext();
      else if (diff < -40) handlePrev();
    }
    mouseDownX.current = null;
    mouseUpX.current = null;
  };

  

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    axiosInstance.get(`/destinations/${id}`)
      .then(res => {
        if (!cancelled) {
          setDestination(res.data.destination || res.data);
          setRelated(res.data.related || []);
          setLoading(false);
        }
      })
      .catch(() => {
        const dest = mockDestinations.find((d: any) => d.slug === id);
        setDestination(dest || null);
        setRelated(mockDestinations.filter((d: any) => d.slug !== id).slice(0, 6));
        setLoading(false);
      });
    return () => { cancelled = true; };
  }, [id]);

  if (loading) return <div className="p-8">Đang tải...</div>;
  if (!destination) return <div className="p-8">Không tìm thấy điểm đến.</div>;

  const lang = 'vi';
  const images = destination.images && destination.images.length > 0 ? destination.images : [destination.image];
  const totalImages = images.length;

  return (
    <>
      <Helmet>
        <title>{destination.name?.[lang] || destination.name} - Homie Travel</title>
      </Helmet>
      {/* Hero Section: Carousel + Overlay + Action */}
      <div className="relative w-full h-[340px] md:h-[480px] flex items-end justify-center mb-8 group">
        {/* Carousel ảnh */}
        <div
          className="absolute inset-0 w-full h-full overflow-hidden rounded-b-3xl flex items-center justify-center"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          onMouseDown={onMouseDown}
          onMouseUp={onMouseUp}
          style={{ cursor: totalImages > 1 ? 'grab' : 'default' }}
        >
          {/* Nút prev */}
          {totalImages > 1 && (
            <button
              onClick={handlePrev}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-white/60 hover:bg-white/80 rounded-full p-2 shadow"
            >
              &lt;
            </button>
          )}
          {/* Ảnh hiện tại */}
          <img
            src={images[currentImage]}
            alt={destination.name?.[lang] || destination.name}
            className="w-full h-full object-cover object-center rounded-b-3xl transition-all duration-700"
            style={{ zIndex: 1 }}
          />
          {/* Nút next */}
          {totalImages > 1 && (
            <button
              onClick={handleNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-white/60 hover:bg-white/80 rounded-full p-2 shadow"
            >
              &gt;
            </button>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent rounded-b-3xl z-10" />
        </div>
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-6 left-6 z-20 w-12 h-12 bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/50 transition-all duration-300 shadow-lg"
        >
          <FaArrowLeft />
        </button>
        {/* Favorite & Share */}
        <div className="absolute top-6 right-6 z-20 flex gap-3">
          <button
            onClick={() => setIsFavorite((v) => !v)}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg ${isFavorite ? "bg-red-500 text-white" : "bg-white/30 text-white hover:bg-white/50"}`}
          >
            {isFavorite ? <FaHeart className="text-lg" /> : <FaRegHeart className="text-lg" />}
          </button>
          <button
            className="w-12 h-12 rounded-full flex items-center justify-center bg-white/30 text-white hover:bg-white/50 transition-all duration-300 shadow-lg"
            onClick={() => navigator.share && navigator.share({ title: destination.name?.[lang], url: window.location.href })}
          >
            <FaShareAlt className="text-lg" />
          </button>
        </div>
        {/* Hero Content */}
        <div className="relative z-20 flex flex-col items-center w-full px-4 pb-8">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white drop-shadow-lg text-center mb-3 leading-tight">
            {destination.name?.[lang] || destination.name}
          </h1>
          <div className="flex flex-wrap gap-3 justify-center items-center mb-2">
            <span className="inline-flex items-center gap-1 px-4 py-1 rounded-full bg-purple-600/90 text-white text-base font-semibold shadow">
              <FaMapMarkerAlt className="mr-1" /> {destination.location?.address?.[lang] || 'Hà Giang'}
            </span>
            <span className="inline-flex items-center gap-1 px-4 py-1 rounded-full bg-pink-500/90 text-white text-base font-semibold shadow">
              <FaTag className="mr-1" /> {destination.type || 'Điểm đến'}
            </span>
            {destination.priceFrom && (
              <span className="inline-flex items-center gap-1 px-4 py-1 rounded-full bg-white/90 text-purple-700 text-base font-semibold shadow">
                {t("Giá từ")}: {destination.priceFrom?.toLocaleString("vi-VN")} {destination.currency || "VND"}/slot
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-10 mb-16">
        {/* Main Description */}
        <div className="md:col-span-2">
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-purple-700">{t("Giới thiệu chi tiết")}</h2>
            <div className="whitespace-pre-line text-lg text-gray-800 leading-relaxed mb-6 bg-white rounded-xl p-6 shadow">
              {destination.detail?.fullDescription?.[lang] || destination.detail?.fullDescription || destination.description?.[lang] || ''}
            </div>
          </div>
          {/* Bản đồ nếu có lat/lng */}
          {destination.location?.lat && destination.location?.lng && (
            <div className="mb-8">
              <button
                className="mb-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold shadow hover:from-purple-600 hover:to-pink-600 transition"
                onClick={() => setShowMap((v) => !v)}
              >
                {showMap ? 'Ẩn bản đồ' : 'Xem bản đồ vị trí'}
              </button>
              {showMap && (
                <iframe
                  title="Google Map"
                  width="100%"
                  height="320"
                  className="rounded-xl shadow border"
                  style={{ border: 0 }}
                  loading="lazy"
                  allowFullScreen
                  src={`https://www.google.com/maps?q=${destination.location.lat},${destination.location.lng}&z=15&output=embed`}
                />
              )}
            </div>
          )}
        </div>
        {/* Quick Info Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col gap-4 border border-purple-100 sticky top-24 h-fit">
          <h3 className="text-xl font-bold text-purple-700 mb-2">{t("Thông tin nhanh")}</h3>
          <div className="flex items-center gap-2 text-gray-700">
            <FaMapMarkerAlt className="text-purple-500" /> {destination.location?.address?.[lang] || 'Hà Giang'}
          </div>
          <div className="flex items-center gap-2 text-gray-700">
            <FaTag className="text-pink-500" /> {destination.type || 'Điểm đến'}
          </div>
          {destination.priceFrom && (
            <div className="flex items-center gap-2 text-gray-700">
              <span className="font-semibold">{t("Giá từ")}:</span> {destination.priceFrom?.toLocaleString("vi-VN")} {destination.currency || "VND"}/slot
            </div>
          )}
          <button className="mt-4 w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold shadow hover:from-purple-700 hover:to-pink-700 transition-all text-lg">
            {t("Đặt tour ngay")}
          </button>
        </div>
      </div>

      {/* Related Destinations Carousel */}
      {related.length > 0 && (
        <div className="max-w-6xl mx-auto px-4 mb-16">
          <h2 className="text-2xl font-bold text-purple-700 mb-6">{t("Khám phá điểm đến khác")}</h2>
          <div className="flex gap-6 overflow-x-auto pb-2 snap-x">
            {related.map((d) => (
              <div key={d.slug} className="min-w-[320px] max-w-xs snap-center">
                <DestinationCard destination={d} />
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
