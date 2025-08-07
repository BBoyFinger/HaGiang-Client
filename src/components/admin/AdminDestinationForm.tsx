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

      {/* Loại */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Loại *</label>
        <input type="text" name="type" value={form.type} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2" required />
      </div>

      {/* Upload nhiều ảnh */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">Ảnh đại diện *</label>

        {/* Upload Area */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-purple-400 transition-colors duration-200 bg-gray-50">
          <div className="flex flex-col items-center">
            <svg className="w-12 h-12 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <p className="text-sm text-gray-600 mb-2">Kéo thả ảnh vào đây hoặc click để chọn</p>
            <p className="text-xs text-gray-500 mb-4">Hỗ trợ: JPG, PNG, GIF (Tối đa 10 ảnh)</p>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              id="image-upload"
              disabled={uploading}
            />
            <label
              htmlFor="image-upload"
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200 cursor-pointer text-sm font-medium"
            >
              Chọn ảnh
            </label>
          </div>
        </div>

        {/* Preview Images - Ảnh cũ giữ lại */}
        {imagesToKeep.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Ảnh hiện tại ({imagesToKeep.length})</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {imagesToKeep.map((url, idx) => (
                <div key={url} className="relative group">
                  <div className="aspect-square rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                    <img
                      src={url}
                      alt={`Current ${idx + 1}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveOldImage(url)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors duration-200 shadow-lg"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 rounded-lg"></div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Preview Images - Ảnh mới upload */}
        {newImagePreviews.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Ảnh mới ({newImagePreviews.length})</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {newImagePreviews.map((url, idx) => (
                <div key={url} className="relative group">
                  <div className="aspect-square rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                    <img
                      src={url}
                      alt={`Preview ${idx + 1}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveNewImage(idx)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors duration-200 shadow-lg"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 rounded-lg"></div>
                </div>
              ))}
            </div>
          </div>
        )}
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