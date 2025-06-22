import { useState } from "react";
import { tours } from "@/data/tours";
import TourCard from "@/components/TourCard";
import ModalBookingForm from "@/components/ModalBookingForm";

export default function Booking() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTourId, setSelectedTourId] = useState(null);

  const handleBook = (tourId) => {
    setSelectedTourId(tourId);
    setModalOpen(true);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h2 className="text-2xl font-bold mb-6 text-center">Đặt tour cùng Homie Travel</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {tours.map((tour) => (
          <div key={tour.id}>
            <TourCard tour={tour} />
            <button
              className="mt-4 w-full bg-blue-600 text-white font-semibold py-2 rounded hover:bg-blue-700 transition"
              onClick={() => handleBook(tour.id)}
            >
              Đặt tour
            </button>
          </div>
        ))}
      </div>
      <ModalBookingForm open={modalOpen} onClose={() => setModalOpen(false)} selectedTourId={selectedTourId} />
    </div>
  );
}