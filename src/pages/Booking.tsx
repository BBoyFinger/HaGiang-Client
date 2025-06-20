import React, { useState } from "react";
import { tours } from "../data/tours";
import type { Tour } from "../data/tours";
import TourCard from "../components/TourCard";
import { useUser } from "../contexts/UserContext";
import { useNavigate } from "react-router-dom";

interface BookingInfo {
  name: string;
  email: string;
  phone: string;
  date: string;
  people: number;
  tourId: string;
}

export default function Booking() {
  const [selectedTour, setSelectedTour] = useState<Tour | null>(null);
  const [info, setInfo] = useState<BookingInfo>({
    name: "",
    email: "",
    phone: "",
    date: "",
    people: 1,
    tourId: "",
  });
  const [success, setSuccess] = useState(false);
  const { user } = useUser();
  const navigate = useNavigate();

  const handleSelect = (tour: Tour) => {
    if (!user) {
      navigate("/login");
      return;
    }
    setSelectedTour(tour);
    setInfo((prev) => ({ ...prev, tourId: tour.id, date: tour.availableDates[0] || "" }));
    setSuccess(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(true);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">Đặt tour du lịch Hà Giang</h2>
      {!selectedTour ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tours.map((tour) => (
            <TourCard key={tour.id} tour={tour} onSelect={handleSelect} />
          ))}
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 max-w-lg mx-auto">
          <h3 className="font-bold text-lg mb-4">{selectedTour.name}</h3>
          <div className="mb-2">
            <label className="block mb-1">Họ tên</label>
            <input name="name" value={info.name} onChange={handleChange} className="border rounded px-2 py-1 w-full" required />
          </div>
          <div className="mb-2">
            <label className="block mb-1">Email</label>
            <input name="email" type="email" value={info.email} onChange={handleChange} className="border rounded px-2 py-1 w-full" required />
          </div>
          <div className="mb-2">
            <label className="block mb-1">Số điện thoại</label>
            <input name="phone" value={info.phone} onChange={handleChange} className="border rounded px-2 py-1 w-full" required />
          </div>
          <div className="mb-2">
            <label className="block mb-1">Ngày khởi hành</label>
            <select name="date" value={info.date} onChange={handleChange} className="border rounded px-2 py-1 w-full" required>
              {selectedTour.availableDates.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
          <div className="mb-2">
            <label className="block mb-1">Số người</label>
            <input name="people" type="number" min={1} value={info.people} onChange={handleChange} className="border rounded px-2 py-1 w-full" required />
          </div>
          <button type="submit" className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700">Xác nhận đặt tour</button>
          <button type="button" onClick={() => setSelectedTour(null)} className="ml-2 text-gray-500 underline">Chọn tour khác</button>
          {success && <div className="mt-4 text-green-600 font-semibold">Đặt tour thành công! Chúng tôi sẽ liên hệ bạn sớm.</div>}
        </form>
      )}
    </div>
  );
} 