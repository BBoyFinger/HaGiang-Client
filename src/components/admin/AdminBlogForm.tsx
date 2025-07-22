import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

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
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
    defaultValues: {
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
    }
  });
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
    const newPreviews = fileArr.map(file => URL.createObjectURL(file));
    setNewImagePreviews(prev => {
      const updated = [...prev, ...newPreviews];
      // Nếu chưa có thumbnail, tự động chọn ảnh đầu tiên vừa thêm
      if (!thumbnail && (imagesToKeep.length + updated.length) > 0) {
        setThumbnail(imagesToKeep[0] || updated[0]);
      }
      return updated;
    });
  };
  // Xóa ảnh cũ khỏi danh sách giữ lại
  const handleRemoveOldImage = (url: string) => {
    setImagesToKeep(prev => {
      const newArr = prev.filter(img => img !== url);
      // Nếu thumbnail bị xóa, chọn lại thumbnail mới
      if (thumbnail === url) {
        setThumbnail(newArr[0] || newImagePreviews[0] || '');
      }
      return newArr;
    });
  };
  // Xóa ảnh mới khỏi danh sách upload
  const handleRemoveNewImage = (idx: number) => {
    setNewImageFiles(prev => prev.filter((_, i) => i !== idx));
    setNewImagePreviews(prev => {
      const newArr = prev.filter((_, i) => i !== idx);
      // Nếu thumbnail bị xóa, chọn lại thumbnail mới
      if (thumbnail === prev[idx]) {
        setThumbnail(imagesToKeep[0] || newArr[0] || '');
      }
      return newArr;
    });
  };
  // Chọn thumbnail
  const handleSelectThumbnail = (url: string) => {
    setThumbnail(url);
  };

  // Danh sách ảnh preview (cũ + mới)
  const allImages = [...imagesToKeep, ...newImagePreviews];

  // Watch fields for validation
  const titleVi = watch('title.vi');
  const titleEn = watch('title.en');
  const contentVi = watch('content.vi');
  const contentEn = watch('content.en');
  const author = watch('author');

  // Validate images and thumbnail on submit
  const onFormSubmit = (form: any) => {
    if ((imagesToKeep.length + newImageFiles.length === 0) || !thumbnail) {
      // eslint-disable-next-line no-alert
      alert('Vui lòng chọn ít nhất 1 ảnh và chọn thumbnail.');
      return;
    }
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

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6 mb-4">
      {/* Tiêu đề */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tiêu đề (Tiếng Việt) *</label>
          <input type="text" {...register('title.vi', { required: 'Bắt buộc nhập tiêu đề tiếng Việt' })} className="w-full border border-gray-300 rounded px-3 py-2" />
          {errors?.title?.vi && <div className="text-red-500 text-xs mt-1">{errors.title.vi.message as string}</div>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tiêu đề (English) *</label>
          <input type="text" {...register('title.en', { required: 'Required English title' })} className="w-full border border-gray-300 rounded px-3 py-2" />
          {errors?.title?.en && <div className="text-red-500 text-xs mt-1">{errors.title.en.message as string}</div>}
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
          <textarea {...register('content.vi', { required: 'Bắt buộc nhập nội dung tiếng Việt' })} className="w-full border border-gray-300 rounded px-3 py-2" rows={4} />
          {errors?.content?.vi && <div className="text-red-500 text-xs mt-1">{errors.content.vi.message as string}</div>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nội dung (English) *</label>
          <textarea {...register('content.en', { required: 'Required English content' })} className="w-full border border-gray-300 rounded px-3 py-2" rows={4} />
          {errors?.content?.en && <div className="text-red-500 text-xs mt-1">{errors.content.en.message as string}</div>}
        </div>
      </div>
      {/* Tags */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tags (Tiếng Việt, cách nhau dấu phẩy)</label>
          <input type="text" {...register('tags.vi')} className="w-full border border-gray-300 rounded px-3 py-2" placeholder="tour, trải nghiệm, review" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tags (English, comma separated)</label>
          <input type="text" {...register('tags.en')} className="w-full border border-gray-300 rounded px-3 py-2" placeholder="tour, experience, review" />
        </div>
      </div>
      {/* Tác giả và trạng thái */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tác giả *</label>
          <input type="text" {...register('author', { required: 'Bắt buộc nhập tác giả' })} className="w-full border border-gray-300 rounded px-3 py-2" />
          {errors?.author && <div className="text-red-500 text-xs mt-1">{errors.author.message as string}</div>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
          <select {...register('status')} className="w-full border border-gray-300 rounded px-3 py-2">
            {statusOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </select>
        </div>
      </div>
      <div className="flex space-x-2">
        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">Lưu</button>
        <button type="button" onClick={onCancel} className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg">Hủy</button>
      </div>
    </form>
  );
};

export default AdminBlogForm; 