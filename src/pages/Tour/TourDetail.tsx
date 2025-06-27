import { useParams, useNavigate } from "react-router-dom";
import { useMemo } from "react";
import { tours } from "@/data/tours";
import type { Tour } from "@/types/TourType";
import ReactStars from 'react-rating-stars-component';
import TourRatingForm from '@/components/TourRatingForm';
import { useState } from 'react';

const typeLabel: Record<Tour["type"], string> = {
  trekking: "Tour Trekking",
  luxury: "Tour Luxury",
  hang_dong: "Tour Hang Động",
  song: "Tour Sông",
  nui: "Tour Núi"
};

export default function TourDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const tour = useMemo(() => tours.find((t) => t.slug === slug), [slug]);
  const [ratings, setRatings] = useState<{rating: number, comment: string}[]>([]);

  if (!tour) return <div className="p-8">Không tìm thấy tour.</div>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <button onClick={() => navigate(-1)} className="mb-6 text-blue-500 hover:underline">← Quay lại</button>
      <div className="mb-6 flex flex-col gap-4">
        {tour.imageUrls.map((url, i) => (
          <img key={i} src={url} alt={tour.name + '-' + i} className="w-full h-64 object-cover rounded-lg" />
        ))}
      </div>
      <h1 className="text-3xl font-bold mb-2">{tour.name}</h1>
      <div className="mb-2 flex items-center flex-row" style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
        <ReactStars
          count={5}
          value={tour.rating}
          size={24}
          isHalf={true}
          edit={false}
          activeColor="#ffd700"
        />
        <span className="ml-2 text-sm text-yellow-600 font-medium align-middle">{tour.rating.toFixed(1)}</span>
      </div>
      <div className="mb-2">
        <span className="inline-block px-3 py-1 rounded bg-blue-100 text-blue-700 text-xs font-semibold mr-2">{typeLabel[tour.type]}</span>
        <span className="inline-block px-3 py-1 rounded bg-gray-100 text-gray-700 text-xs font-semibold">Slug: {tour.slug}</span>
      </div>
      <div className="text-lg text-gray-700 mb-2">{tour.description}</div>
      <div className="mb-2"><span className="font-semibold">Địa điểm:</span> {tour.locations.join(", ")}</div>
      <div className="mb-2"><span className="font-semibold">Giá:</span> {tour.price.groupPrice ? `${tour.price.groupPrice.toLocaleString('vi-VN')} ${tour.price.currency}/slot (nhóm)` : ''} {tour.price.perSlot ? `${tour.price.perSlot.toLocaleString('vi-VN')} ${tour.price.currency}/slot (lẻ)` : ''}</div>
      <div className="mb-2"><span className="font-semibold">Thời lượng:</span> {tour.duration}</div>
      <div className="mb-2"><span className="font-semibold">Ngôn ngữ hướng dẫn:</span> {tour.guideLanguage.join(", ")}</div>
      <div className="mb-2"><span className="font-semibold">Dịch vụ đi kèm:</span>
        <ul className="list-disc ml-6">
          {tour.includedServices.map((s, i) => <li key={i}>{s}</li>)}
        </ul>
      </div>
      <div className="text-xs text-gray-500 mt-6">Ngày tạo: {tour.createdAt.toLocaleDateString()}</div>
      <TourRatingForm onSubmit={(data) => setRatings([data, ...ratings])} />
      {ratings.length > 0 && (
        <div className="my-6">
          <div className="font-semibold mb-2">Đánh giá của khách hàng:</div>
          <div className="space-y-4">
            {ratings.map((r, i) => (
              <div key={i} className="bg-white dark:bg-gray-700 p-4 rounded shadow">
                <div className="flex items-center mb-1">
                  <ReactStars
                    count={5}
                    value={r.rating}
                    size={20}
                    isHalf={true}
                    edit={false}
                    activeColor="#ffd700"
                  />
                  <span className="ml-2 text-yellow-600 font-medium">{r.rating.toFixed(1)}</span>
                </div>
                {r.comment && <div className="text-gray-700 dark:text-gray-200">{r.comment}</div>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 