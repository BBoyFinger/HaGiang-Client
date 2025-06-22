import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

const vehicleTypes = [
  { value: "motorbike", labelKey: "rent.vehicleTypeOptions.motorbike" },
  { value: "car", labelKey: "rent.vehicleTypeOptions.car" },
  { value: "bike", labelKey: "rent.vehicleTypeOptions.bike" }
];

type ModalRentFormProps = {
  open: boolean;
  onClose: () => void;
  selectedVehicleType: string;
};

export default function ModalRentForm({ open, onClose, selectedVehicleType }: ModalRentFormProps) {
  const { t } = useTranslation();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    vehicleType: selectedVehicleType || vehicleTypes[0].value,
    date: "",
    days: 1,
    note: ""
  });
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    setForm((prev) => ({ ...prev, vehicleType: selectedVehicleType || vehicleTypes[0].value }));
  }, [selectedVehicleType]);

  if (!open) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-lg relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-red-500 text-xl"
        >
          ×
        </button>
        <h2 className="text-xl font-bold mb-4 text-center">{t('rent.title')}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">{t('rent.vehicleType')}</label>
            <select name="vehicleType" value={form.vehicleType} onChange={handleChange} className="border rounded px-3 py-2 w-full" disabled>
              {vehicleTypes.map((v) => (
                <option key={v.value} value={v.value}>{t(v.labelKey)}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-1 font-medium">{t('rent.name')}</label>
            <input name="name" value={form.name} onChange={handleChange} required className="border rounded px-3 py-2 w-full" placeholder={t('rent.namePlaceholder')} />
          </div>
          <div>
            <label className="block mb-1 font-medium">{t('rent.email')}</label>
            <input name="email" type="email" value={form.email} onChange={handleChange} required className="border rounded px-3 py-2 w-full" placeholder={t('rent.emailPlaceholder')} />
          </div>
          <div>
            <label className="block mb-1 font-medium">{t('rent.phone')}</label>
            <input name="phone" value={form.phone} onChange={handleChange} required className="border rounded px-3 py-2 w-full" placeholder={t('rent.phonePlaceholder')} />
          </div>
          <div>
            <label className="block mb-1 font-medium">{t('rent.date')}</label>
            <input name="date" type="date" value={form.date} onChange={handleChange} required className="border rounded px-3 py-2 w-full" />
          </div>
          <div>
            <label className="block mb-1 font-medium">{t('rent.days')}</label>
            <input name="days" type="number" min={1} value={form.days} onChange={handleChange} required className="border rounded px-3 py-2 w-full" />
          </div>
          <div>
            <label className="block mb-1 font-medium">{t('rent.note')}</label>
            <textarea name="note" value={form.note} onChange={handleChange} className="border rounded px-3 py-2 w-full" rows={3} placeholder={t('rent.notePlaceholder')} />
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white font-semibold py-2 rounded hover:bg-blue-700 transition">{t('rent.submit')}</button>
          {success && <div className="mt-4 text-green-600 font-semibold text-center">{t('rent.success')}</div>}
        </form>
      </div>
    </div>
  );
} 