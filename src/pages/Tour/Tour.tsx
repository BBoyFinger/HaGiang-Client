import { useState, useEffect } from "react";
import { tours } from "@/data/tours";
import TourCard from "@/components/TourCard";
import ModalBookingForm from "@/components/ModalBookingForm";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";

const tourTypes = [
  { value: '', label: 'Tất cả' },
  { value: 'song', label: 'Sông' },
  { value: 'hang_dong', label: 'Hang động' },
  { value: 'nui', label: 'Núi' },
  { value: 'luxury', label: 'Luxury' },
];

const sortOptions = [
  { value: '', label: 'Mặc định' },
  { value: 'price', label: 'Giá tăng dần' },
  { value: 'rating', label: 'Đánh giá cao' },
  { value: 'name', label: 'A-Z' },
];

export default function Tour() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTourId, setSelectedTourId] = useState(null);
  const [type, setType] = useState('');
  const [sortBy, setSortBy] = useState('');

  const handleBook = (tourId: any) => {
    setSelectedTourId(tourId);
    setModalOpen(true);
  };

  const { t } = useTranslation();

  // Filter
  let filteredTours = tours.filter(tour => !type || tour.type === type);
  // Sort
  if (sortBy === 'price') {
    filteredTours = [...filteredTours].sort((a, b) => (a.price?.perSlot || 0) - (b.price?.perSlot || 0));
  } else if (sortBy === 'rating') {
    filteredTours = [...filteredTours].sort((a, b) => (b.rating || 0) - (a.rating || 0));
  } else if (sortBy === 'name') {
    filteredTours = [...filteredTours].sort((a, b) => a.name.localeCompare(b.name));
  }

  // Simple carousel images (dùng ảnh đầu của mỗi tour)
  const carouselImages = tours.slice(0, 5).map(t => t.imageUrls[0]);
  const [carouselIdx, setCarouselIdx] = useState(0);

  // Auto slide carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCarouselIdx((prev) => (prev + 1) % carouselImages.length);
    }, 3000);

    return () => clearInterval(timer);
  }, [carouselImages.length]);

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
        <meta name="tiktok:card" content="summary_large_image" />
        <meta name="tiktok:title" content={t('tour.title')} />
        <meta name="tiktok:description" content={t('tour.description')} />
        <meta name="tiktok:image" content="https://homieTravel.vn/og-image.jpg" />
      </Helmet>
      <div className="mb-8">
        <div className="relative w-full h-96 rounded-lg overflow-hidden mb-4">
          <img src={carouselImages[carouselIdx]} alt="Tour" className="w-full h-full object-cover" />
          <h2 className="text-2xl font-bold text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">Trải Nghiệm Hà giang cùng Homie Travel</h2>
          <button onClick={() => setCarouselIdx((carouselIdx - 1 + carouselImages.length) % carouselImages.length)} className="absolute left-2 top-1/2 -translate-y-1/2 bg-white bg-opacity-70 rounded-full p-2">&#8592;</button>
          <button onClick={() => setCarouselIdx((carouselIdx + 1) % carouselImages.length)} className="absolute right-2 top-1/2 -translate-y-1/2 bg-white bg-opacity-70 rounded-full p-2">&#8594;</button>
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2">
            {carouselImages.map((_, idx) => (
              <span key={idx} className={`w-3 h-3 rounded-full ${idx === carouselIdx ? 'bg-blue-500' : 'bg-white border'} inline-block`}></span>
            ))}
          </div>
        </div>
      </div>
      <div className="max-w-5xl mx-auto px-4 py-10">
        {/* Carousel và tiêu đề */}
        {/* Filter & Sort */}
        <div className="flex justify-between items-center mb-8">
          <div className="text-lg font-semibold">
            {filteredTours.length} tours
          </div>
          <div className="flex gap-4">
            <select value={type} onChange={e => setType(e.target.value)} className="border rounded px-4 py-2">
              {tourTypes.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
            <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="border rounded px-4 py-2">
              {sortOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTours.map((tour) => (
            <div key={tour.id}>
              <TourCard tour={tour} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}