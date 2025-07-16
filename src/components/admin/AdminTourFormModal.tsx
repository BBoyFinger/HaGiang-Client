import React, { useState, useEffect, useRef, useMemo } from 'react';
import { FaSuitcase, FaMoneyBill, FaMapMarkerAlt, FaAlignLeft, FaStar } from 'react-icons/fa';
import DestinationCard from '../DestinationCard';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

// @ts-ignore
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

// Styles bắt buộc
import 'react-quill/dist/quill.snow.css';

interface TourFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  initialData?: any;
  inlineMode?: boolean;
}

// Định nghĩa type cho các trường array/object
interface MultiLangField {
  vi: string;
  en: string;
}
interface DaySchedule {
  day: number;
  title: string;
  activities: string[];
}

interface TourForm {
  name: MultiLangField;
  type: MultiLangField;
  price: string;
  groupPrice: string; // thêm trường này
  discountPrice: string; // thêm trường này
  currency: string; // thêm trường này
  locations: MultiLangField;
  description: MultiLangField;
  shortDescription: MultiLangField;
  image: string;
  duration: MultiLangField;
  guideLanguage: MultiLangField;
  includedServices: MultiLangField;
  excludedServices: MultiLangField;
  schedule: MultiLangField;
}

const defaultForm: TourForm = {
  name: { vi: '', en: '' },
  type: { vi: '', en: '' },
  price: '',
  groupPrice: '', // thêm trường này
  discountPrice: '', // thêm trường này
  currency: 'VND', // thêm trường này
  locations: { vi: '', en: '' },
  description: { vi: '', en: '' },
  shortDescription: { vi: '', en: '' },
  image: '',
  duration: { vi: '', en: '' },
  guideLanguage: { vi: '', en: '' },
  includedServices: { vi: '', en: '' },
  excludedServices: { vi: '', en: '' },
  schedule: { vi: '', en: '' },
};

const tourSchema = z.object({
  name: z.object({
    vi: z.string().min(1, 'Tên tour (Tiếng Việt) là bắt buộc'),
    en: z.string().min(1, 'Tên tour (English) là bắt buộc'),
  }),
  type: z.object({
    vi: z.string().min(1, 'Loại tour (Tiếng Việt) là bắt buộc'),
    en: z.string().min(1, 'Loại tour (English) là bắt buộc'),
  }),
  price: z.string().min(1, 'Giá là bắt buộc').refine(val => !isNaN(Number(val)) && Number(val) > 0, 'Giá phải là số dương'),
  groupPrice: z.string().optional(),
  discountPrice: z.string().optional(),
  currency: z.string().min(1),
  locations: z.object({
    vi: z.string().min(1, 'Địa điểm (Tiếng Việt) là bắt buộc'),
    en: z.string().min(1, 'Địa điểm (English) là bắt buộc'),
  }),
  description: z.object({ vi: z.string().optional(), en: z.string().optional() }),
  shortDescription: z.object({ vi: z.string().optional(), en: z.string().optional() }),
  image: z.string().optional(),
  duration: z.object({ vi: z.string().optional(), en: z.string().optional() }),
  guideLanguage: z.object({ vi: z.string().optional(), en: z.string().optional() }),
  includedServices: z.object({ vi: z.string().optional(), en: z.string().optional() }),
  excludedServices: z.object({ vi: z.string().optional(), en: z.string().optional() }),
  schedule: z.object({ vi: z.string().optional(), en: z.string().optional() }),
});

type TourFormZod = z.infer<typeof tourSchema>;

const AdminTourFormModal: React.FC<TourFormModalProps> = ({ open, onClose, onSubmit, initialData, inlineMode }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<TourFormZod>({
    resolver: zodResolver(tourSchema),
    defaultValues: initialData || defaultForm,
  });

  // Định nghĩa type cho giá VND
  type PriceInput = { perSlot: string; groupPrice: string; discountPrice: string };
  const [price, setPrice] = useState<PriceInput>({
    perSlot: '', 
    groupPrice: '', 
    discountPrice: '' 
  });

  // Khởi tạo giá từ initialData khi edit
  useEffect(() => {
    if (initialData?.price?.VND) {
      setPrice({
        perSlot: initialData.price.VND.perSlot?.toString() || '',
        groupPrice: initialData.price.VND.groupPrice?.toString() || '',
        discountPrice: initialData.price.VND.discountPrice?.toString() || ''
      });
    }
  }, [initialData]);

  const handlePriceChange = (field: keyof PriceInput, value: string) => {
    setPrice(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const removeImage = (idx: number) => {
    setImageUrls(prev => prev.filter((_, i) => i !== idx));
  };

  const quillRefVi = useRef<any>(null);
  const quillRefEn = useRef<any>(null);

  // Custom image handler for toolbar
  const imageHandler = async (quillRef: any) => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();
    input.onchange = async () => {
      const files = input.files;
      if (files && files.length > 0) {
        const file = files[0];
        // Xử lý upload ảnh ở đây nếu cần
        // Ví dụ: const url = await uploadTourImage(file);
        const url = URL.createObjectURL(file); // Tạo URL tạm thời cho ảnh
        const quill = quillRef.current.getEditor();
        const range = quill.getSelection();
        quill.insertEmbed(range.index, 'image', url);
      }
    };
  };

  // Custom paste handler for images
  const handlePaste = (quillRef: any) => async (e: ClipboardEvent) => {
    if (e.clipboardData && e.clipboardData.items) {
      for (let i = 0; i < e.clipboardData.items.length; i++) {
        const item = e.clipboardData.items[i];
        if (item.type.indexOf('image') !== -1) {
          e.preventDefault();
          const file = item.getAsFile();
          if (file) {
            // Xử lý upload ảnh ở đây nếu cần
            // Ví dụ: const url = await uploadTourImage(file);
            const url = URL.createObjectURL(file); // Tạo URL tạm thời cho ảnh
            const quill = quillRef.current.getEditor();
            const range = quill.getSelection();
            quill.insertEmbed(range.index, 'image', url);
          }
        }
      }
    }
  };

  // Định nghĩa getModules trước khi dùng useMemo
  const getModules = (quillRef: any) => ({
    toolbar: {
      container: [
        [{ 'header': [1, 2, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'font': [] }],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'align': [] }],
        ['blockquote', 'code-block'],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        ['link', 'image'],
        ['clean']
      ],
      handlers: {
        image: () => imageHandler(quillRef)
      }
    }
  });

  // Modules for ReactQuill (dùng useMemo để không tạo lại mỗi lần render)
  const modulesVi = useMemo(() => ({
    ...getModules(quillRefVi),
    clipboard: {
      matchVisual: false
    }
  }), [quillRefVi]);
  const modulesEn = useMemo(() => ({
    ...getModules(quillRefEn),
    clipboard: {
      matchVisual: false
    }
  }), [quillRefEn]);

  // Chỉ addEventListener khi ref đã mount
  useEffect(() => {
    const quillVi = quillRefVi.current?.getEditor?.();
    let handlerVi: any;
    if (quillVi) {
      handlerVi = handlePaste(quillRefVi);
      quillVi.root.addEventListener('paste', handlerVi);
    }
    const quillEn = quillRefEn.current?.getEditor?.();
    let handlerEn: any;
    if (quillEn) {
      handlerEn = handlePaste(quillRefEn);
      quillEn.root.addEventListener('paste', handlerEn);
    }
    return () => {
      if (quillVi && handlerVi) quillVi.root.removeEventListener('paste', handlerVi);
      if (quillEn && handlerEn) quillEn.root.removeEventListener('paste', handlerEn);
    };
  }, []);

  useEffect(() => {
    if (initialData) {
      // Chuyển đổi initialData từ dạng object sang dạng string cho form
      const convertArrayObjToString = (arr: MultiLangField[], joiner = ', ') => Array.isArray(arr) ? arr.map((item: MultiLangField) => item?.vi || '').join(joiner) : '';
      const convertArrayObjToStringEn = (arr: MultiLangField[], joiner = ', ') => Array.isArray(arr) ? arr.map((item: MultiLangField) => item?.en || '').join(joiner) : '';
      const convertArrayObjToMultiline = (arr: MultiLangField[]) => Array.isArray(arr) ? arr.map((item: MultiLangField) => item?.vi || '').join('\n') : '';
      const convertArrayObjToMultilineEn = (arr: MultiLangField[]) => Array.isArray(arr) ? arr.map((item: MultiLangField) => item?.en || '').join('\n') : '';
      const formData = {
        ...initialData,
        price: initialData.price?.perSlot?.toString() || '',
        groupPrice: initialData.price?.groupPrice?.toString() || '',
        discountPrice: initialData.price?.discountPrice?.toString() || '',
        currency: initialData.price?.currency || 'VND',
        locations: {
          vi: convertArrayObjToString(initialData.locations, ', '),
          en: convertArrayObjToStringEn(initialData.locations, ', '),
        },
        includedServices: {
          vi: convertArrayObjToMultiline(initialData.includedServices),
          en: convertArrayObjToMultilineEn(initialData.includedServices),
        },
        excludedServices: {
          vi: convertArrayObjToMultiline(initialData.excludedServices),
          en: convertArrayObjToMultilineEn(initialData.excludedServices),
        },
        guideLanguage: {
          vi: convertArrayObjToString(initialData.guideLanguage, ', '),
          en: convertArrayObjToStringEn(initialData.guideLanguage, ', '),
        },
        image: initialData.imageUrls?.[0] || '',
      };
      reset(formData);
    } else {
      reset(defaultForm);
    }
  }, [open, initialData, reset]);

  const onFormSubmit = async (data: TourFormZod) => {
   
    const formData = new FormData();
    formData.append('name', JSON.stringify(data.name));
    formData.append('type', JSON.stringify(data.type));
    formData.append('price', data.price);
    if (data.groupPrice) formData.append('groupPrice', data.groupPrice);
    if (data.discountPrice) formData.append('discountPrice', data.discountPrice);
    formData.append('currency', data.currency);
    formData.append('locations', JSON.stringify(data.locations));
    formData.append('description', JSON.stringify(data.description));
    formData.append('shortDescription', JSON.stringify(data.shortDescription));
    formData.append('duration', JSON.stringify(data.duration));
    formData.append('guideLanguage', JSON.stringify(data.guideLanguage));
    formData.append('includedServices', JSON.stringify(data.includedServices));
    formData.append('excludedServices', JSON.stringify(data.excludedServices));
    formData.append('schedule', JSON.stringify(data.schedule));
    selectedFiles.forEach(file => {
      formData.append('images', file);
    });
    try {
      const response = await fetch('/api/tours', {
        method: 'POST',
        body: formData,
      });
      if (response.ok) {
        // Reset form và selectedFiles
        reset();
        setSelectedFiles([]);
        // Có thể gọi onClose hoặc cập nhật danh sách tour
        if (onClose) onClose();
      } else {
        // Xử lý lỗi
        alert('Tạo tour thất bại!');
      }
    } catch (err) {
      alert('Lỗi kết nối server!');
    }
  };

  if (!open) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setValue(name as any, value);
  };

  // Đảm bảo các hàm và state scheduleVi, scheduleEn, handleScheduleChange, addActivity, addDay đã được khai báo đúng kiểu ở đầu component:
  const [scheduleVi, setScheduleVi] = useState<DaySchedule[]>([{ day: 1, title: '', activities: [''] }]);
  const [scheduleEn, setScheduleEn] = useState<DaySchedule[]>([{ day: 1, title: '', activities: [''] }]);
  const addDay = (lang: 'vi' | 'en') => {
    if (lang === 'vi') setScheduleVi([...scheduleVi, { day: scheduleVi.length + 1, title: '', activities: [''] }]);
    else setScheduleEn([...scheduleEn, { day: scheduleEn.length + 1, title: '', activities: [''] }]);
  };
  const addActivity = (lang: 'vi' | 'en', dayIdx: number) => {
    if (lang === 'vi') {
      const newSchedule = [...scheduleVi];
      newSchedule[dayIdx].activities.push('');
      setScheduleVi(newSchedule);
    } else {
      const newSchedule = [...scheduleEn];
      newSchedule[dayIdx].activities.push('');
      setScheduleEn(newSchedule);
    }
  };
  const handleScheduleChange = (lang: 'vi' | 'en', dayIdx: number, field: string, value: string, actIdx?: number) => {
    if (lang === 'vi') {
      const newSchedule = [...scheduleVi];
      if (field === 'title') newSchedule[dayIdx].title = value;
      if (field === 'activity' && actIdx !== undefined) newSchedule[dayIdx].activities[actIdx] = value;
      setScheduleVi(newSchedule);
    } else {
      const newSchedule = [...scheduleEn];
      if (field === 'title') newSchedule[dayIdx].title = value;
      if (field === 'activity' && actIdx !== undefined) newSchedule[dayIdx].activities[actIdx] = value;
      setScheduleEn(newSchedule);
    }
  };

  const formContent = (
    <>
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-purple-700">
        <FaSuitcase className="text-purple-500" /> {initialData ? 'Sửa Tour' : 'Thêm Tour'}
      </h2>
      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-5">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Tên Tour *</label>
          <div className="flex gap-2">
            <div className="w-full">
              <input
                {...register('name.vi')}
                className={`w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-400 ${errors.name?.vi ? 'border-red-400' : 'border-gray-300'}`}
                placeholder="Tên tour (Tiếng Việt)"
              />
              {errors.name?.vi && (
                <div className="mt-1 text-red-500 text-xs">{errors.name.vi.message}</div>
              )}
            </div>
            <div className="w-full">
              <input
                {...register('name.en')}
                className={`w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 ${errors.name?.en ? 'border-red-400' : 'border-gray-300'}`}
                placeholder="Tour name (English)"
              />
              {errors.name?.en && (
                <div className="mt-1 text-red-500 text-xs">{errors.name.en.message}</div>
              )}
            </div>
          </div>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Loại Tour *</label>
          <div className="flex gap-2">
            <div className="w-full">
              <input
                {...register('type.vi')}
                className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-400"
                placeholder="Loại tour (Tiếng Việt)"
              />
              {errors.type?.vi && (
                <div className="mt-1 text-red-500 text-xs">{errors.type.vi.message}</div>
              )}
            </div>
            <div className="w-full">
              <input
                {...register('type.en')}
                className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Tour type (English)"
              />
              {errors.type?.en && (
                <div className="mt-1 text-red-500 text-xs">{errors.type.en.message}</div>
              )}
            </div>
          </div>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Giá tour (VND)</label>
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 grid grid-cols-1 md:grid-cols-3 gap-3 shadow-sm">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Giá lẻ / slot *</label>
              <input
                value={price.perSlot}
                onChange={e => handlePriceChange('perSlot', e.target.value)}
                placeholder="Nhập giá..."
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-400"
                type="number"
                min="0"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Giá nhóm</label>
              <input
                value={price.groupPrice}
                onChange={e => handlePriceChange('groupPrice', e.target.value)}
                placeholder="Giá nhóm (tùy chọn)"
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-400"
                type="number"
                min="0"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Giá khuyến mãi</label>
              <input
                value={price.discountPrice}
                onChange={e => handlePriceChange('discountPrice', e.target.value)}
                placeholder="Giá khuyến mãi (tùy chọn)"
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-400"
                type="number"
                min="0"
              />
            </div>
          </div>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Địa điểm (cách nhau bằng dấu phẩy) *</label>
          <div className="flex gap-2">
            <div className="w-full">
              <input
                {...register('locations.vi')}
                className={`w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-400 ${errors.locations?.vi ? 'border-red-400' : 'border-gray-300'}`}
                placeholder="Hà Giang, Đồng Văn... (Tiếng Việt)"
              />
              {errors.locations?.vi && (
                <div className="mt-1 text-red-500 text-xs">{errors.locations.vi.message}</div>
              )}
            </div>
            <div className="w-full">
              <input
                {...register('locations.en')}
                className={`w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 ${errors.locations?.en ? 'border-red-400' : 'border-gray-300'}`}
                placeholder="Ha Giang, Dong Van... (English)"
              />
              {errors.locations?.en && (
                <div className="mt-1 text-red-500 text-xs">{errors.locations.en.message}</div>
              )}
            </div>
          </div>
        </div>
        {/* Upload nhiều ảnh */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Ảnh đại diện *</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={e => {
              if (e.target.files) setSelectedFiles(Array.from(e.target.files));
            }}
          />
          <div className="flex gap-2 mt-2">
            {imageUrls.map((url, idx) => (
              <div key={idx} className="relative">
                <img src={url} alt="" className="w-24 h-24 object-cover rounded" />
                <button type="button" onClick={() => removeImage(idx)} className="absolute top-0 right-0 bg-white/80 rounded-full px-1">X</button>
              </div>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Mô tả ngắn</label>
          <div className="flex gap-2">
            <textarea
              {...register('shortDescription.vi')}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-200"
              rows={2}
              placeholder="Mô tả ngắn (Tiếng Việt)"
            />
            {errors.shortDescription?.vi && <p className="text-red-500 text-xs">{errors.shortDescription.vi.message}</p>}
            <textarea
              {...register('shortDescription.en')}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-200"
              rows={2}
              placeholder="Short description (English)"
            />
            {errors.shortDescription?.en && <p className="text-red-500 text-xs">{errors.shortDescription.en.message}</p>}
          </div>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Mô tả chi tiết (Tiếng Việt)</label>
          {React.createElement(ReactQuill as any, {
            forwardedRef: quillRefVi,
            value: typeof watch('description.vi') === 'string' ? watch('description.vi') : '',
            onChange: (val: string) => setValue('description.vi', val),
            modules: modulesVi,
            className: 'bg-white'
          })}
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Mô tả chi tiết (English)</label>
          {React.createElement(ReactQuill as any, {
            forwardedRef: quillRefEn,
            value: typeof watch('description.en') === 'string' ? watch('description.en') : '',
            onChange: (val: string) => setValue('description.en', val),
            modules: modulesEn,
            className: 'bg-white'
          })}
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Thời lượng</label>
          <div className="flex gap-2">
            <input
              type="text"
              {...register('duration.vi')}
              className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-200"
              placeholder="Thời lượng (Tiếng Việt)"
            />
            {errors.duration?.vi && <p className="text-red-500 text-xs">{errors.duration.vi.message}</p>}
            <input
              type="text"
              {...register('duration.en')}
              className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-200"
              placeholder="Duration (English)"
            />
            {errors.duration?.en && <p className="text-red-500 text-xs">{errors.duration.en.message}</p>}
          </div>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Ngôn ngữ hướng dẫn</label>
          <div className="flex gap-2">
            <input
              type="text"
              {...register('guideLanguage.vi')}
              className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-200"
              placeholder="Ngôn ngữ (Tiếng Việt, cách nhau bằng dấu phẩy)"
            />
            {errors.guideLanguage?.vi && <p className="text-red-500 text-xs">{errors.guideLanguage.vi.message}</p>}
            <input
              type="text"
              {...register('guideLanguage.en')}
              className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-200"
              placeholder="Languages (English, comma separated)"
            />
            {errors.guideLanguage?.en && <p className="text-red-500 text-xs">{errors.guideLanguage.en.message}</p>}
          </div>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Dịch vụ bao gồm</label>
          <div className="flex gap-2">
            <textarea
              {...register('includedServices.vi')}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-200"
              rows={2}
              placeholder="Mỗi dịch vụ 1 dòng (Tiếng Việt)"
            />
            {errors.includedServices?.vi && <p className="text-red-500 text-xs">{errors.includedServices.vi.message}</p>}
            <textarea
              {...register('includedServices.en')}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-200"
              rows={2}
              placeholder="One service per line (English)"
            />
            {errors.includedServices?.en && <p className="text-red-500 text-xs">{errors.includedServices.en.message}</p>}
          </div>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Dịch vụ không bao gồm</label>
          <div className="flex gap-2">
            <textarea
              {...register('excludedServices.vi')}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-200"
              rows={2}
              placeholder="Mỗi dịch vụ 1 dòng (Tiếng Việt)"
            />
            {errors.excludedServices?.vi && <p className="text-red-500 text-xs">{errors.excludedServices.vi.message}</p>}
            <textarea
              {...register('excludedServices.en')}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-200"
              rows={2}
              placeholder="One service per line (English)"
            />
            {errors.excludedServices?.en && <p className="text-red-500 text-xs">{errors.excludedServices.en.message}</p>}
          </div>
        </div>
        {/* Lịch trình nhiều ngày, nhiều hoạt động */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Lịch trình (Tiếng Việt)</label>
          <div className="space-y-4">
            {scheduleVi.map((day, dayIdx) => (
              <div key={dayIdx} className="bg-gray-50 border border-gray-200 rounded-xl p-4 shadow-sm relative">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-purple-700">Ngày {day.day}</span>
                  {scheduleVi.length > 1 && (
                    <button type="button" onClick={() => {
                      setScheduleVi(scheduleVi.filter((_, i) => i !== dayIdx));
                    }} className="text-red-500 hover:text-red-700 bg-white rounded-full p-1 shadow transition" title="Xóa ngày">
                      ×
                    </button>
                  )}
                </div>
                <input
                  value={day.title}
                  onChange={e => handleScheduleChange('vi', dayIdx, 'title', e.target.value)}
                  placeholder={`Tiêu đề ngày ${day.day}`}
                  className="w-full mb-2 border rounded px-3 py-2 focus:ring-2 focus:ring-purple-400"
                />
                <div className="space-y-2">
                  {day.activities.map((act, actIdx) => (
                    <div key={actIdx} className="flex items-center gap-2">
                      <input
                        value={act}
                        onChange={e => handleScheduleChange('vi', dayIdx, 'activity', e.target.value, actIdx)}
                        placeholder={`Hoạt động ${actIdx + 1}`}
                        className="flex-1 border rounded px-3 py-2 focus:ring-2 focus:ring-purple-200"
                      />
                      {day.activities.length > 1 && (
                        <button type="button" onClick={() => {
                          const newSchedule = [...scheduleVi];
                          newSchedule[dayIdx].activities = newSchedule[dayIdx].activities.filter((_, i) => i !== actIdx);
                          setScheduleVi(newSchedule);
                        }} className="text-red-500 hover:text-red-700 bg-white rounded-full p-1 shadow transition" title="Xóa hoạt động">
                          ×
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <button type="button" onClick={() => addActivity('vi', dayIdx)} className="mt-2 px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-400 text-white rounded-lg font-semibold shadow hover:from-purple-600 hover:to-pink-500 transition text-sm">+ Thêm hoạt động</button>
              </div>
            ))}
          </div>
          <button type="button" onClick={() => addDay('vi')} className="mt-3 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-lg font-semibold shadow hover:from-purple-700 hover:to-pink-600 transition">+ Thêm ngày</button>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Lịch trình (English)</label>
          <div className="space-y-4">
            {scheduleEn.map((day, dayIdx) => (
              <div key={dayIdx} className="bg-gray-50 border border-gray-200 rounded-xl p-4 shadow-sm relative">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-purple-700">Day {day.day}</span>
                  {scheduleEn.length > 1 && (
                    <button type="button" onClick={() => {
                      setScheduleEn(scheduleEn.filter((_, i) => i !== dayIdx));
                    }} className="text-red-500 hover:text-red-700 bg-white rounded-full p-1 shadow transition" title="Remove day">
                      ×
                    </button>
                  )}
                </div>
                <input
                  value={day.title}
                  onChange={e => handleScheduleChange('en', dayIdx, 'title', e.target.value)}
                  placeholder={`Day ${day.day} title`}
                  className="w-full mb-2 border rounded px-3 py-2 focus:ring-2 focus:ring-purple-400"
                />
                <div className="space-y-2">
                  {day.activities.map((act, actIdx) => (
                    <div key={actIdx} className="flex items-center gap-2">
                      <input
                        value={act}
                        onChange={e => handleScheduleChange('en', dayIdx, 'activity', e.target.value, actIdx)}
                        placeholder={`Activity ${actIdx + 1}`}
                        className="flex-1 border rounded px-3 py-2 focus:ring-2 focus:ring-purple-200"
                      />
                      {day.activities.length > 1 && (
                        <button type="button" onClick={() => {
                          const newSchedule = [...scheduleEn];
                          newSchedule[dayIdx].activities = newSchedule[dayIdx].activities.filter((_, i) => i !== actIdx);
                          setScheduleEn(newSchedule);
                        }} className="text-red-500 hover:text-red-700 bg-white rounded-full p-1 shadow transition" title="Remove activity">
                          ×
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <button type="button" onClick={() => addActivity('en', dayIdx)} className="mt-2 px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-400 text-white rounded-lg font-semibold shadow hover:from-purple-600 hover:to-pink-500 transition text-sm">+ Add activity</button>
              </div>
            ))}
          </div>
          <button type="button" onClick={() => addDay('en')} className="mt-3 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-lg font-semibold shadow hover:from-purple-700 hover:to-pink-600 transition">+ Add day</button>
        </div>
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400"
          >
            Hủy
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            {initialData ? 'Cập nhật' : 'Thêm Tour'}
          </button>
        </div>
      </form>
    </>
  );

  if (inlineMode) {
    return <div className="inline-block">{formContent}</div>;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-purple-700">
            <FaSuitcase className="inline-block mr-2 text-purple-500" /> {initialData ? 'Sửa Tour' : 'Thêm Tour'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <FaAlignLeft className="text-lg" />
          </button>
        </div>
        {formContent}
      </div>
    </div>
  );
};

export default AdminTourFormModal;