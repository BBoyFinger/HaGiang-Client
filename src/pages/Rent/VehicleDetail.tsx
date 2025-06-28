import { useParams, useNavigate } from 'react-router-dom';
import { vehicles } from '@/data/vehicles';

export default function VehicleDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const bike = vehicles.find((b) => b.slug === slug);

  if (!bike) return <div className="p-8">Không tìm thấy xe máy.</div>;

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <button onClick={() => navigate(-1)} className="mb-6 text-blue-500 hover:underline">← Quay lại</button>
      <img src={bike.image} alt={bike.name} className="w-full h-64 object-cover rounded-lg mb-6" />
      <h1 className="text-3xl font-bold mb-4">{bike.name}</h1>
      <div className="text-lg text-gray-700 mb-2">{bike.shortSpecs}</div>
      <div className="whitespace-pre-line text-base text-gray-800 mb-6">{bike.description}</div>
      {/* Có thể bổ sung thêm thông tin chi tiết, giá thuê, tính năng... */}
    </div>
  );
} 