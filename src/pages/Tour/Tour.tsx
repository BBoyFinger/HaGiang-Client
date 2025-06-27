import { useState, useTransition } from "react";
import { tours } from "@/data/tours";
import TourCard from "@/components/TourCard";
import ModalBookingForm from "@/components/ModalBookingForm";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";

export default function Tour() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTourId, setSelectedTourId] = useState(null);

  const handleBook = (tourId: any) => {
    setSelectedTourId(tourId);
    setModalOpen(true);
  };

  const { t } = useTranslation();

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
      <div className="max-w-5xl mx-auto px-4 py-10">
        <h2 className="text-2xl font-bold mb-6 text-center">Đặt tour cùng Homie Travel</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tours.map((tour) => (
            <div key={tour.id}>
              <TourCard tour={tour} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}