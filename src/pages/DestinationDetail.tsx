import { useParams, useNavigate } from "react-router-dom";
import { useMemo } from "react";
import { destinations } from "@/data/destinations";

export default function DestinationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const destination = useMemo(() => destinations.find((d: any) => d.id === Number(id)), [id]);

  if (!destination) return <div className="p-8">Không tìm thấy điểm đến.</div>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <button onClick={() => navigate(-1)} className="mb-6 text-blue-500 hover:underline">← Quay lại</button>
      <img src={destination.image} alt={destination.name} className="w-full h-64 object-cover rounded-lg mb-6" />
      <h1 className="text-3xl font-bold mb-4">{destination.name}</h1>
      <div className="text-lg text-gray-700 mb-4">Giá từ: {destination.priceFrom?.toLocaleString("vi-VN")} {destination.currency || "VND"}/slot</div>
      <div className="whitespace-pre-line text-base text-gray-800 mb-6">{destination.detail.fullDescription}</div>
    </div>
  );
}
