import { useState } from "react";
import { useTranslation } from "react-i18next";
import ModalStayForm from "@/components/ModalStayForm";
import { hotels } from "@/data/hotel"
import { Helmet } from 'react-helmet-async';
import ReactStars from "react-rating-stars-component"

const roomTypes = [
  { value: "homestay", labelKey: "stay.roomTypeOptions.homestay" },
  { value: "hotel", labelKey: "stay.roomTypeOptions.hotel" },

];
import hotel3 from "@/assets/hotels/hotel3.jpg"

function resolveHotelImage(image: string) {
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

  const handleBook = (type: any) => {
    setSelectedRoomType(type);
    setModalOpen(true);
  };

  const formatPrice = (price: number, currency: string) => {
    if (currency === "EUR") return price + " EUR";
    return price.toLocaleString("vi-VN") + " VND";
  };
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
      <div className="max-w-3xl mx-auto px-4 py-10">
        <h2 className="text-2xl font-bold mb-6 text-center">{t('stay.title')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {hotels.map((hotel) => (
            <div key={hotel.id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 flex flex-col items-center">
              <img src={resolveHotelImage(hotel.images[0])} alt={hotel.name} className="w-full h-40 object-cover rounded mb-4" />
              <div className="text-xl font-semibold mb-2 text-center">{hotel.name}</div>
              <ReactStars
                count={5}
                value={Number(hotel.rating) || 0}
                size={24}
                isHalf={true}
                edit={false}
                activeColor="#ffd700"
              />
              <div className="text-gray-600 dark:text-gray-300 text-sm mb-4 text-center">{hotel.description}</div>
              <div className="font-semibold text-blue-600 mb-2">
                Giá từ: {formatPrice(Number(hotel.price_per_night), 'VND')}
              </div>
              <div className="flex gap-2 mt-auto">
                <button
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                  onClick={() => handleBook('hotel')}
                >
                  {t('common.bookNow')}
                </button>
                {hotel.website_url && (
                  <a
                    href={hotel.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition"
                  >
                    {t('common.viewDetails')}
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
        <ModalStayForm open={modalOpen} onClose={() => setModalOpen(false)} selectedRoomType={selectedRoomType} />
      </div>
    </>
  );
}