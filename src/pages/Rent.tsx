import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { motorbikes } from "@/data/motorbikes";
import ModalRentForm from "@/components/ModalRentForm";
import { Helmet } from "react-helmet-async";

export default function Rent() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedVehicleType, setSelectedVehicleType] = useState(motorbikes[0].slug);

  const handleBook = (slug: string) => {
    setSelectedVehicleType(slug);
    setModalOpen(true);
  };

  const handleDetail = (slug: string) => {
    navigate(`/rent/${slug}`);
  };

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
        <meta name="tiktok:card" content="summary_large_image" />
        <meta name="tiktok:title" content={t('rent.title')} />
        <meta name="tiktok:description" content={t('rent.description')} />
        <meta name="tiktok:image" content="https://homieTravel.vn/og-image.jpg" />
      </Helmet>
      <div className="max-w-5xl mx-auto px-4 py-10">
        <h2 className="text-2xl font-bold mb-6 text-center">{t('rent.title')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {motorbikes.map((bike) => (
            <div key={bike.id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 flex flex-col items-center">
              <img src={bike.image} alt={bike.name} className="w-full h-40 object-cover rounded mb-4" />
              <div className="text-xl font-semibold mb-2 text-center">{bike.name}</div>
              <div className="text-gray-600 dark:text-gray-300 text-sm mb-2 text-center">{bike.shortSpecs}</div>
              <div className="text-gray-700 dark:text-gray-200 text-sm mb-4 text-center">{bike.description}</div>
              <div className="flex gap-2 w-full">
                <button
                  className="flex-1 bg-blue-600 text-white font-semibold py-2 rounded hover:bg-blue-700 transition"
                  onClick={() => handleBook(bike.slug)}
                >
                  {t('rent.submit')}
                </button>
                <button
                  className="flex-1 bg-gray-200 text-gray-800 font-semibold py-2 rounded hover:bg-gray-300 transition"
                  onClick={() => handleDetail(bike.slug)}
                >
                  {t('rent.detail', 'Chi tiết')}
                </button>
              </div>
            </div>
          ))}
        </div>
        <ModalRentForm open={modalOpen} onClose={() => setModalOpen(false)} selectedVehicleType={selectedVehicleType} />
      </div>
    </>
  );
}