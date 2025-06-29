import React, { useState, useEffect } from 'react';
import { FaSuitcase, FaMoneyBill, FaMapMarkerAlt, FaAlignLeft, FaStar } from 'react-icons/fa';
import DestinationCard from '../DestinationCard';

interface TourFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  initialData?: any;
}

const defaultForm = {
  name: '',
  price: '',
  locations: '',
  description: '',
  rating: 4.5,
  image: '',
};

const AdminTourFormModal: React.FC<TourFormModalProps> = ({ open, onClose, onSubmit, initialData }) => {
  const [form, setForm] = useState(defaultForm);
  const [error, setError] = useState('');
  const [touched, setTouched] = useState<{ [k: string]: boolean }>({});

  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name || '',
        price: initialData.price?.perSlot || initialData.price || '',
        locations: initialData.locations?.join(', ') || '',
        description: initialData.description || '',
        rating: initialData.rating || 4.5,
        image: initialData.image || '',
      });
    } else {
      setForm(defaultForm);
    }
    setError('');
    setTouched({});
  }, [open, initialData]);

  if (!open) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setTouched({ ...touched, [e.target.name]: true });
  };

  const validate = () => {
    if (!form.name.trim()) return 'Tên tour là bắt buộc.';
    if (!form.price || isNaN(Number(form.price)) || Number(form.price) <= 0) return 'Giá phải là số dương.';
    if (!form.locations.trim()) return 'Địa điểm là bắt buộc.';
    if (!form.image.trim()) return 'Ảnh đại diện là bắt buộc.';
    return '';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const err = validate();
    if (err) {
      setError(err);
      return;
    }
    setError('');
    onSubmit({
      ...form,
      price: Number(form.price),
      locations: form.locations.split(',').map((s) => s.trim()),
      rating: Number(form.rating),
    });
  };

  // Chuẩn hóa dữ liệu cho DestinationCard preview
  const previewTour = form.name && form.price && form.locations && form.image
    ? {
      id: 0,
      name: form.name,
      image: form.image,
      shortDescription: form.description || 'Mô tả ngắn...',
      priceFrom: Number(form.price),
      currency: 'VND',
      rating: Number(form.rating),
      location: form.locations,
      duration: '',
    }
    : null;

  // Preview component giống layout hero/info của TourDetail
  function TourDetailPreview({ tour }: { tour: any }) {
    return (
      <div className="w-full max-w-xs rounded-2xl shadow-lg bg-white overflow-hidden border border-purple-100">
        {/* Hero Image */}
        <div className="relative h-48 w-full">
          <img
            src={tour.image}
            alt={tour.name}
            className="w-full h-full object-cover object-center rounded-t-2xl"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent rounded-t-2xl" />
          <div className="absolute top-3 left-3 bg-purple-600/90 text-white text-xs font-semibold px-3 py-1 rounded-full shadow">
            {tour.location}
          </div>
          <div className="absolute top-3 right-3 bg-white/90 text-purple-700 text-xs font-semibold px-3 py-1 rounded-full shadow">
            {tour.priceFrom?.toLocaleString('vi-VN')} {tour.currency || 'VND'}
          </div>
        </div>
        {/* Info */}
        <div className="p-4">
          <h3 className="text-lg font-bold text-purple-700 mb-1 line-clamp-2">{tour.name}</h3>
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700 text-xs font-semibold">
              <FaStar className="text-yellow-400" /> {tour.rating || 4.5}
            </span>
          </div>
          <p className="text-sm text-gray-600 line-clamp-3 mb-2">{tour.shortDescription}</p>
          <div className="flex items-center gap-2 mt-2">
            <span className="inline-block px-3 py-1 rounded-full bg-purple-50 text-purple-600 text-xs font-semibold">Tour Preview</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl p-8 relative flex flex-col md:flex-row gap-8 animate-fadeInUp">
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl"
          onClick={onClose}
        >
          ×
        </button>
        {/* Form Section */}
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-purple-700">
            <FaSuitcase className="text-purple-500" /> {initialData ? 'Sửa Tour' : 'Thêm Tour'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Tên Tour *</label>
              <div className="relative">
                <FaSuitcase className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-400" />
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className={`w-full border rounded-lg px-10 py-3 focus:outline-none focus:ring-2 focus:ring-purple-400 ${touched.name && !form.name ? 'border-red-400' : 'border-gray-300'}`}
                  required
                  placeholder="Tên tour..."
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Giá (VND) *</label>
              <div className="relative">
                <FaMoneyBill className="absolute left-3 top-1/2 -translate-y-1/2 text-green-400" />
                <input
                  type="number"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  className={`w-full border rounded-lg px-10 py-3 focus:outline-none focus:ring-2 focus:ring-green-400 ${touched.price && (!form.price || Number(form.price) <= 0) ? 'border-red-400' : 'border-gray-300'}`}
                  required
                  min={0}
                  placeholder="Giá tour..."
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Địa điểm (cách nhau bằng dấu phẩy) *</label>
              <div className="relative">
                <FaMapMarkerAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400" />
                <input
                  type="text"
                  name="locations"
                  value={form.locations}
                  onChange={handleChange}
                  className={`w-full border rounded-lg px-10 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 ${touched.locations && !form.locations ? 'border-red-400' : 'border-gray-300'}`}
                  required
                  placeholder="Hà Giang, Đồng Văn..."
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Ảnh đại diện (URL) *</label>
              <div className="relative">
                <FaAlignLeft className="absolute left-3 top-1/2 -translate-y-1/2 text-pink-400" />
                <input
                  type="text"
                  name="image"
                  value={form.image}
                  onChange={handleChange}
                  className={`w-full border rounded-lg px-10 py-3 focus:outline-none focus:ring-2 focus:ring-pink-400 ${touched.image && !form.image ? 'border-red-400' : 'border-gray-300'}`}
                  required
                  placeholder="https://..."
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Mô tả</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-200"
                rows={3}
                placeholder="Mô tả ngắn về tour..."
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Đánh giá (1-5)</label>
              <div className="relative w-32">
                <FaStar className="absolute left-3 top-1/2 -translate-y-1/2 text-yellow-400" />
                <input
                  type="number"
                  name="rating"
                  value={form.rating}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-10 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400 border-gray-300"
                  min={1}
                  max={5}
                  step={0.1}
                  placeholder="4.5"
                />
              </div>
            </div>
            {error && <div className="text-red-600 text-sm font-semibold">{error}</div>}
            <div className="flex justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold shadow-lg transition-all duration-300"
              >
                {initialData ? 'Lưu thay đổi' : 'Thêm mới'}
              </button>
            </div>
          </form>
        </div>
        {/* Preview Section */}
        <div className="hidden md:flex flex-col items-center justify-center w-80">
          <span className="mb-2 text-gray-400 text-sm">Preview</span>
          {previewTour ? (
            <TourDetailPreview tour={previewTour} />
          ) : (
            <div className="w-full h-64 flex items-center justify-center bg-gray-50 rounded-2xl border border-dashed border-gray-300 text-gray-400">
              Nhập đủ thông tin để xem trước
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminTourFormModal; 