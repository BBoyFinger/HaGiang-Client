import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

const roomTypes = [
  { value: "homestay", labelKey: "stay.roomTypeOptions.homestay" },
  { value: "hotel", labelKey: "stay.roomTypeOptions.hotel" },
  { value: "dorm", labelKey: "stay.roomTypeOptions.dorm" }
];

type ModalStayFormProps = {
  open: boolean;
  onClose: () => void;
  selectedRoomType: string;
};

export default function ModalStayForm({ open, onClose, selectedRoomType }: ModalStayFormProps) {
  const { t } = useTranslation();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    roomType: selectedRoomType || roomTypes[0].value,
    checkin: "",
    nights: 1,
    people: 1,
    note: ""
  });
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    setForm((prev) => ({ ...prev, roomType: selectedRoomType || roomTypes[0].value }));
  }, [selectedRoomType]);

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
        <h2 className="text-xl font-bold mb-4 text-center">{t('stay.title')}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">{t('stay.roomType')}</label>
            <select name="roomType" value={form.roomType} onChange={handleChange} className="border rounded px-3 py-2 w-full" disabled>
              {roomTypes.map((r) => (
                <option key={r.value} value={r.value}>{t(r.labelKey)}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-1 font-medium">{t('stay.name')}</label>
            <input name="name" value={form.name} onChange={handleChange} required className="border rounded px-3 py-2 w-full" placeholder={t('stay.namePlaceholder')} />
          </div>
          <div>
            <label className="block mb-1 font-medium">{t('stay.email')}</label>
            <input name="email" type="email" value={form.email} onChange={handleChange} required className="border rounded px-3 py-2 w-full" placeholder={t('stay.emailPlaceholder')} />
          </div>
          <div>
            <label className="block mb-1 font-medium">{t('stay.phone')}</label>
            <input name="phone" value={form.phone} onChange={handleChange} required className="border rounded px-3 py-2 w-full" placeholder={t('stay.phonePlaceholder')} />
          </div>
          <div>
            <label className="block mb-1 font-medium">{t('stay.checkin')}</label>
            <input name="checkin" type="date" value={form.checkin} onChange={handleChange} required className="border rounded px-3 py-2 w-full" />
          </div>
          <div>
            <label className="block mb-1 font-medium">{t('stay.nights')}</label>
            <input name="nights" type="number" min={1} value={form.nights} onChange={handleChange} required className="border rounded px-3 py-2 w-full" />
          </div>
          <div>
            <label className="block mb-1 font-medium">{t('stay.people')}</label>
            <input name="people" type="number" min={1} value={form.people} onChange={handleChange} required className="border rounded px-3 py-2 w-full" />
          </div>
          <div>
            <label className="block mb-1 font-medium">{t('stay.note')}</label>
            <textarea name="note" value={form.note} onChange={handleChange} className="border rounded px-3 py-2 w-full" rows={3} placeholder={t('stay.notePlaceholder')} />
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white font-semibold py-2 rounded hover:bg-blue-700 transition">{t('stay.submit')}</button>
          {success && <div className="mt-4 text-green-600 font-semibold text-center">{t('stay.success')}</div>}
        </form>
      </div>
    </div>
  );
} 