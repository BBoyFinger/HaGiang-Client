import ReactStars from 'react-rating-stars-component';
import { useState } from 'react';

export default function TourRatingForm({ onSubmit }: { onSubmit?: (data: { rating: number; comment: string }) => void }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return alert('Vui lòng chọn số sao!');
    onSubmit?.({ rating, comment });
    setRating(0);
    setComment('');
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 2000);
  };

  return (
    <form onSubmit={handleSubmit} className="my-6 p-4 bg-gray-50 dark:bg-gray-800 rounded shadow">
      <div className="mb-2 font-semibold">Đánh giá tour này:</div>
      <ReactStars
        count={5}
        value={rating}
        onChange={setRating}
        size={32}
        isHalf={true}
        edit={true}
        activeColor="#ffd700"
      />
      <textarea
        className="w-full mt-2 p-2 border rounded dark:bg-gray-700 dark:text-white"
        rows={3}
        placeholder="Nhận xét của bạn (không bắt buộc)"
        value={comment}
        onChange={e => setComment(e.target.value)}
      />
      <button
        type="submit"
        className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Gửi đánh giá
      </button>
      {submitted && <div className="mt-2 text-green-600 font-medium">Cảm ơn bạn đã đánh giá!</div>}
    </form>
  );
} 