import React, { useState } from "react";
import { tours } from "@/data/tours";
import { useTranslation } from "react-i18next";

export default function ModalBookingForm({ open, onClose, selectedTourId }) {
    const { t } = useTranslation();
    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        tourId: selectedTourId || tours[0]?.id || "",
        date: "",
        people: 1,
        note: ""
    });
    const [success, setSuccess] = useState(false);

    // Update tourId if selectedTourId changes
    React.useEffect(() => {
        setForm((prev) => ({ ...prev, tourId: selectedTourId || tours[0]?.id || "" }));
    }, [selectedTourId]);

    if (!open) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
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
                <h2 className="text-xl font-bold mb-4 text-center">{t('booking.title')}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* ... các trường form như Booking.tsx, dùng form, handleChange ... */}
                    {/* ... giữ nguyên logic i18n như Booking.tsx ... */}
                    {/* ... truyền value form.tourId, disable select nếu muốn không cho đổi tour ... */}
                    <div>
                        <label className="block mb-1 font-medium">{t('booking.tour')}</label>
                        <select name="tourId" value={form.tourId} onChange={handleChange} className="border rounded px-3 py-2 w-full" disabled>
                            {tours.map((tour) => (
                                <option key={tour.id} value={tour.id}>{tour.name}</option>
                            ))}
                        </select>
                    </div>
                    {/* ... các trường khác ... */}
                    <div>
                        <label className="block mb-1 font-medium">{t('booking.name')}</label>
                        <input name="name" value={form.name} onChange={handleChange} required className="border rounded px-3 py-2 w-full" placeholder={t('booking.namePlaceholder')} />
                    </div>
                    <div>
                        <label className="block mb-1 font-medium">{t('booking.email')}</label>
                        <input name="email" type="email" value={form.email} onChange={handleChange} required className="border rounded px-3 py-2 w-full" placeholder={t('booking.emailPlaceholder')} />
                    </div>
                    <div>
                        <label className="block mb-1 font-medium">{t('booking.phone')}</label>
                        <input name="phone" value={form.phone} onChange={handleChange} required className="border rounded px-3 py-2 w-full" placeholder={t('booking.phonePlaceholder')} />
                    </div>
                    <div>
                        <label className="block mb-1 font-medium">{t('booking.date')}</label>
                        <input name="date" type="date" value={form.date} onChange={handleChange} required className="border rounded px-3 py-2 w-full" />
                    </div>
                    <div>
                        <label className="block mb-1 font-medium">{t('booking.people')}</label>
                        <input name="people" type="number" min={1} value={form.people} onChange={handleChange} required className="border rounded px-3 py-2 w-full" />
                    </div>
                    <div>
                        <label className="block mb-1 font-medium">{t('booking.note')}</label>
                        <textarea name="note" value={form.note} onChange={handleChange} className="border rounded px-3 py-2 w-full" rows={3} placeholder={t('booking.notePlaceholder')} />
                    </div>
                    <button type="submit" className="w-full bg-blue-600 text-white font-semibold py-2 rounded hover:bg-blue-700 transition">{t('booking.submit')}</button>
                    {success && <div className="mt-4 text-green-600 font-semibold text-center">{t('booking.success')}</div>}
                </form>
            </div>
        </div>
    );
}