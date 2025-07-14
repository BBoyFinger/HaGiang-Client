import React, { useState } from 'react';
import axiosInstance from '../../config/axiosConfig';

interface AdminDestinationFormProps {
  initialData?: any;
  onSubmit: (data: any, files?: File[]) => void;
  onCancel: () => void;
}

const AdminDestinationForm: React.FC<AdminDestinationFormProps> = ({ initialData, onSubmit, onCancel }) => {
  const [form, setForm] = useState({
    name: {
      vi: initialData?.name?.vi || '',
      en: initialData?.name?.en || '',
    },
    type: initialData?.type || '',
    images: initialData?.images && Array.isArray(initialData.images) ? initialData.images : [],
    shortDescription: {
      vi: initialData?.shortDescription?.vi || '',
      en: initialData?.shortDescription?.en || '',
    },
    description: {
      vi: initialData?.description?.vi || '',
      en: initialData?.description?.en || '',
    },
    location: {
      address: {
        vi: 'Hà Giang',
        en: 'Ha Giang',
      },
    },
  });
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  // Ảnh cũ giữ lại
  const [imagesToKeep, setImagesToKeep] = useState<string[]>(initialData?.images || []);
  // Ảnh mới upload (chỉ lưu url preview, file sẽ gửi khi submit)
  const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);
  const [newImageFiles, setNewImageFiles] = useState<File[]>([]);

  // Upload ảnh mới: chỉ preview, không upload lên server ở bước này
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const fileArr = Array.from(files);
    setNewImageFiles(prev => [...prev, ...fileArr]);
    setNewImagePreviews(prev => [
      ...prev,
      ...fileArr.map(file => URL.createObjectURL(file))
    ]);
  };
  // Xóa ảnh cũ khỏi danh sách giữ lại
  const handleRemoveOldImage = (url: string) => {
    setImagesToKeep(prev => prev.filter(img => img !== url));
  };
  // Xóa ảnh mới khỏi danh sách upload
  const handleRemoveNewImage = (idx: number) => {
    setNewImageFiles(prev => prev.filter((_, i) => i !== idx));
    setNewImagePreviews(prev => prev.filter((_, i) => i !== idx));
  };

  // Các trường đa ngôn ngữ
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [field, lang] = name.split('.');
      setForm((prev: any) => ({
        ...prev,
        [field]: {
          ...prev[field],
          [lang]: value,
        },
      }));
    } else {
      setForm((prev: any) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Validate: phải còn ít nhất 1 ảnh
    if (!form.name.vi.trim() || !form.name.en.trim() || !form.type.trim() || (imagesToKeep.length + newImageFiles.length === 0) || !form.shortDescription.vi.trim() || !form.shortDescription.en.trim()) {
      setError('Vui lòng nhập đầy đủ thông tin bắt buộc.');
      return;
    }
    setError('');
    // Gửi imagesToKeep và file mới cho onSubmit
    onSubmit({ ...form, imagesToKeep }, newImageFiles);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 mb-4">
      {/* Tên */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tên (Tiếng Việt) *</label>
          <input type="text" name="name.vi" value={form.name.vi} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tên (English) *</label>
          <input type="text" name="name.en" value={form.name.en} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2" required />
        </div>
      </div>
      {/* Ảnh */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Ảnh (upload, nhiều ảnh) *</label>
        <input type="file" multiple accept="image/*" onChange={handleFileChange} disabled={uploading} />
        <div className="flex gap-2 mt-2 flex-wrap">
          {/* Ảnh cũ giữ lại */}
          {imagesToKeep.map((img, idx) => (
            <div key={img} className="relative group">
              <img src={img} alt="" className="w-24 h-24 object-cover rounded shadow" />
              <button type="button" onClick={() => handleRemoveOldImage(img)} className="absolute top-1 right-1 bg-white/80 rounded-full px-2 py-1 text-red-600 text-xs opacity-0 group-hover:opacity-100 transition">X</button>
            </div>
          ))}
          {/* Ảnh mới upload */}
          {newImagePreviews.map((img, idx) => (
            <div key={img} className="relative group">
              <img src={img} alt="" className="w-24 h-24 object-cover rounded shadow" />
              <button type="button" onClick={() => handleRemoveNewImage(idx)} className="absolute top-1 right-1 bg-white/80 rounded-full px-2 py-1 text-red-600 text-xs opacity-0 group-hover:opacity-100 transition">X</button>
            </div>
          ))}
        </div>
      </div>
      {/* Loại */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Loại *</label>
        <input type="text" name="type" value={form.type} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2" required />
      </div>
      {/* Mô tả ngắn */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả ngắn (Tiếng Việt) *</label>
          <textarea name="shortDescription.vi" value={form.shortDescription.vi} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2" rows={2} required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả ngắn (English) *</label>
          <textarea name="shortDescription.en" value={form.shortDescription.en} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2" rows={2} required />
        </div>
      </div>
      {/* Mô tả chi tiết */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả chi tiết (Tiếng Việt)</label>
          <textarea name="description.vi" value={form.description.vi} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2" rows={3} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả chi tiết (English)</label>
          <textarea name="description.en" value={form.description.en} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2" rows={3} />
        </div>
      </div>
      {/* Địa chỉ (mặc định) */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ (Tiếng Việt)</label>
          <input type="text" value="Hà Giang" disabled className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ (English)</label>
          <input type="text" value="Ha Giang" disabled className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100" />
        </div>
      </div>
      {error && <div className="text-red-500 text-sm">{error}</div>}
      <div className="flex space-x-2">
        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">Lưu</button>
        <button type="button" onClick={onCancel} className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg">Hủy</button>
      </div>
    </form>
  );
};

export default AdminDestinationForm; 