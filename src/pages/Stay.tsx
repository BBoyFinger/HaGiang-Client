import { useState } from "react";
import { useTranslation } from "react-i18next";
import ModalStayForm from "@/components/ModalStayForm";

const roomTypes = [
  { value: "homestay", labelKey: "stay.roomTypeOptions.homestay" },
  { value: "hotel", labelKey: "stay.roomTypeOptions.hotel" },
  { value: "dorm", labelKey: "stay.roomTypeOptions.dorm" }
];

export default function Stay() {
  const { t } = useTranslation();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRoomType, setSelectedRoomType] = useState(roomTypes[0].value);

  const handleBook = (type) => {
    setSelectedRoomType(type);
    setModalOpen(true);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h2 className="text-2xl font-bold mb-6 text-center">{t('stay.title')}</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {roomTypes.map((r) => (
          <div key={r.value} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 flex flex-col items-center">
            <div className="text-xl font-semibold mb-2">{t(r.labelKey)}</div>
            <button
              className="mt-4 w-full bg-blue-600 text-white font-semibold py-2 rounded hover:bg-blue-700 transition"
              onClick={() => handleBook(r.value)}
            >
              {t('stay.submit')}
            </button>
          </div>
        ))}
      </div>
      <ModalStayForm open={modalOpen} onClose={() => setModalOpen(false)} selectedRoomType={selectedRoomType} />
    </div>
  );
}