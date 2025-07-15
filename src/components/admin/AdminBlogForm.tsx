import React, { useState } from 'react';

interface AdminBlogFormProps {
  initialData?: any;
  onSubmit: (data: any, files?: File[]) => void;
  onCancel: () => void;
}

const statusOptions = [
  { value: 'published', label: 'Xuất bản' },
  { value: 'draft', label: 'Nháp' },
  { value: 'archived', label: 'Lưu trữ' },
];

const AdminBlogForm: React.FC<AdminBlogFormProps> = ({ initialData, onSubmit, onCancel }) => {
  const [form, setForm] = useState({
    title: {
      vi: initialData?.title?.vi || '',
      en: initialData?.title?.en || '',
    },
    content: {
      vi: initialData?.content?.vi || '',
      en: initialData?.content?.en || '',
    },
    tags: {
      vi: initialData?.tags?.vi?.join(', ') || '',
      en: initialData?.tags?.en?.join(', ') || '',
    },
    author: initialData?.author || '',
    status: initialData?.status || 'draft',
  });
  const [error, setError] = useState('');
  // Ảnh cũ giữ lại
  const [imagesToKeep, setImagesToKeep] = useState<string[]>(initialData?.imageUrls || []);
  // Ảnh mới upload (chỉ lưu url preview, file sẽ gửi khi submit)
  const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);
  const [newImageFiles, setNewImageFiles] = useState<File[]>([]);
  // Thumbnail chọn từ danh sách ảnh
  const [thumbnail, setThumbnail] = useState<string>(initialData?.thumbnail || imagesToKeep[0] || '');

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
    if (thumbnail === url) setThumbnail('');
  };
  // Xóa ảnh mới khỏi danh sách upload
  const handleRemoveNewImage = (idx: number) => {
    setNewImageFiles(prev => prev.filter((_, i) => i !== idx));
    setNewImagePreviews(prev => prev.filter((_, i) => i !== idx));
  };
  // Chọn thumbnail
  const handleSelectThumbnail = (url: string) => {
    setThumbnail(url);
  };
  // Các trường đa ngôn ngữ
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
    // Validate: phải còn ít nhất 1 ảnh, tiêu đề, nội dung, tác giả
    if (!form.title.vi.trim() || !form.title.en.trim() || !form.content.vi.trim() || !form.content.en.trim() || !form.author.trim() || (imagesToKeep.length + newImageFiles.length === 0) || !thumbnail) {
      setError('Vui lòng nhập đầy đủ thông tin bắt buộc.');
      return;
    }
    setError('');
    // Gửi imagesToKeep, file mới, thumbnail cho onSubmit
    onSubmit({
      ...form,
      tags: {
        vi: form.tags.vi.split(',').map((t: string) => t.trim()).filter(Boolean),
        en: form.tags.en.split(',').map((t: string) => t.trim()).filter(Boolean),
      },
      imagesToKeep,
      thumbnail,
      status: form.status,
    }, newImageFiles);
  };

  // Danh sách ảnh preview (cũ + mới)
  const allImages = [...imagesToKeep, ...newImagePreviews];

  return (
    <form onSubmit={handleSubmit} className="space-y-6 mb-4">
      {/* Tiêu đề */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tiêu đề (Tiếng Việt) *</label>
          <input type="text" name="title.vi" value={form.title.vi} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tiêu đề (English) *</label>
          <input type="text" name="title.en" value={form.title.en} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2" required />
        </div>
      </div>
      {/* Ảnh */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Ảnh (upload, nhiều ảnh) *</label>
        <input type="file" multiple accept="image/*" onChange={handleFileChange} />
        <div className="flex gap-2 mt-2 flex-wrap">
          {/* Ảnh cũ giữ lại */}
          {imagesToKeep.map((img, idx) => (
            <div key={img} className="relative group border-2 rounded-lg p-1" style={{ borderColor: thumbnail === img ? '#2563eb' : 'transparent' }}>
              <img src={img} alt="" className="w-24 h-24 object-cover rounded shadow cursor-pointer" onClick={() => handleSelectThumbnail(img)} />
              <button type="button" onClick={() => handleRemoveOldImage(img)} className="absolute top-1 right-1 bg-white/80 rounded-full px-2 py-1 text-red-600 text-xs opacity-0 group-hover:opacity-100 transition">X</button>
              {thumbnail === img && <div className="absolute bottom-1 left-1 bg-blue-600 text-white text-xs px-2 py-0.5 rounded">Thumbnail</div>}
            </div>
          ))}
          {/* Ảnh mới upload */}
          {newImagePreviews.map((img, idx) => (
            <div key={img} className="relative group border-2 rounded-lg p-1" style={{ borderColor: thumbnail === img ? '#2563eb' : 'transparent' }}>
              <img src={img} alt="" className="w-24 h-24 object-cover rounded shadow cursor-pointer" onClick={() => handleSelectThumbnail(img)} />
              <button type="button" onClick={() => handleRemoveNewImage(idx)} className="absolute top-1 right-1 bg-white/80 rounded-full px-2 py-1 text-red-600 text-xs opacity-0 group-hover:opacity-100 transition">X</button>
              {thumbnail === img && <div className="absolute bottom-1 left-1 bg-blue-600 text-white text-xs px-2 py-0.5 rounded">Thumbnail</div>}
            </div>
          ))}
        </div>
      </div>
      {/* Nội dung */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nội dung (Tiếng Việt) *</label>
          <textarea name="content.vi" value={form.content.vi} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2" rows={4} required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nội dung (English) *</label>
          <textarea name="content.en" value={form.content.en} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2" rows={4} required />
        </div>
      </div>
      {/* Tags */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tags (Tiếng Việt, cách nhau dấu phẩy)</label>
          <input type="text" name="tags.vi" value={form.tags.vi} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2" placeholder="tour, trải nghiệm, review" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tags (English, comma separated)</label>
          <input type="text" name="tags.en" value={form.tags.en} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2" placeholder="tour, experience, review" />
        </div>
      </div>
      {/* Tác giả và trạng thái */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tác giả *</label>
          <input type="text" name="author" value={form.author} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
          <select name="status" value={form.status} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2">
            {statusOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </select>
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

export default AdminBlogForm; 