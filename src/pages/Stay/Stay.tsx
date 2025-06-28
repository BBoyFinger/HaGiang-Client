import { useState } from "react";
import { useTranslation } from "react-i18next";
import ModalStayForm from "@/components/ModalStayForm";
import { stays } from "@/data/stays"
import { Helmet } from 'react-helmet-async';
import ReactStars from "react-rating-stars-component"

const roomTypes = [
  { value: "homestay", labelKey: "stay.roomTypeOptions.homestay" },
  { value: "hotel", labelKey: "stay.roomTypeOptions.hotel" },

];
import hotel3 from "@/assets/hotels/hotel3.jpg"
import { HiOutlineMapPin } from "react-icons/hi2";
import { Link } from "react-router-dom";
import { MdArrowRightAlt } from "react-icons/md";
import AccommodationCard from "@/components/AccommodationCard.";

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
  const [selectedRoomType, setSelectedRoomType] = useState(roomTypes[0].value);


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
      <div className="max-w-5xl mx-auto px-4 py-10">
        <h2 className="text-2xl font-bold mb-6">{t('stay.title')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stays.map((stay) => (
            <AccommodationCard
              key={stay.id}
              stay={stay}
              resolveStayImage={resolveStayImage}
            />
          ))}
        </div>
        <ModalStayForm open={modalOpen} onClose={() => setModalOpen(false)} selectedRoomType={selectedRoomType} />
      </div>
    </>
  );
}