import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { vehicles } from "@/data/vehicles";
import ModalRentForm from "@/components/ModalRentForm";
import { Helmet } from "react-helmet-async";
import VehicleCard from "@/components/VehicleCard";

export default function Rent() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedVehicleType, setSelectedVehicleType] = useState(vehicles[0].slug);

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
          {vehicles.map((vehicle) => (
            <VehicleCard vehicle={vehicle} />
          ))}
        </div>
        <ModalRentForm open={modalOpen} onClose={() => setModalOpen(false)} selectedVehicleType={selectedVehicleType} />
      </div>
    </>
  );
}