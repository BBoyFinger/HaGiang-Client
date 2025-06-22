import { useState } from "react";
import { useTranslation } from "react-i18next";
import ModalRentForm from "@/components/ModalRentForm";

const vehicleTypes = [
  { value: "motorbike", labelKey: "rent.vehicleTypeOptions.motorbike" },
  { value: "car", labelKey: "rent.vehicleTypeOptions.car" },
  { value: "bike", labelKey: "rent.vehicleTypeOptions.bike" }
];

export default function Rent() {
  const { t } = useTranslation();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedVehicleType, setSelectedVehicleType] = useState(vehicleTypes[0].value);

  const handleBook = (type) => {
    setSelectedVehicleType(type);
    setModalOpen(true);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h2 className="text-2xl font-bold mb-6 text-center">{t('rent.title')}</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {vehicleTypes.map((v) => (
          <div key={v.value} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 flex flex-col items-center">
            <div className="text-xl font-semibold mb-2">{t(v.labelKey)}</div>
            <button
              className="mt-4 w-full bg-blue-600 text-white font-semibold py-2 rounded hover:bg-blue-700 transition"
              onClick={() => handleBook(v.value)}
            >
              {t('rent.submit')}
            </button>
          </div>
        ))}
      </div>
      <ModalRentForm open={modalOpen} onClose={() => setModalOpen(false)} selectedVehicleType={selectedVehicleType} />
    </div>
  );
}