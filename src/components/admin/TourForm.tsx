import { useForm } from 'react-hook-form';
import React, { useMemo, useRef } from "react"
import { z } from 'zod';
import { zodResolver } from "@hookform/resolvers/zod"
import { useState, useEffect } from "react"
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

interface TourFormProps {
    onSubmit: (data: any, selectedFiles: File[]) => void;
    onClose: () => void;
    initialData?: any;
    inlineMode?: boolean;
}



const tourSchema = z.object({
    name: z.object({
        vi: z.string().min(1, "Tên tour (Tiếng việt) là bắt buộc"),
        en: z.string().min(1, "Tên tour (English) là bắt buộc")
    }),
    type: z.object({
        vi: z.string().min(1, 'Loại tour (Tiếng Việt) là bắt buộc'),
        en: z.string().min(1, 'Loại tour (English) là bắt buộc'),
    }),
    destination: z.object({
        vi: z.string().min(1, 'Điểm đến (Tiếng Việt) là bắt buộc'),
        en: z.string().min(1, 'Điểm đến (English) là bắt buộc'),
    }),
    shortDescription: z.object({
        vi: z.string().min(1, 'Mô tả ngắn (Tiếng Việt) là bắt buộc'),
        en: z.string().min(1, 'Mô tả ngắn (English) là bắt buộc'),
    }),
    description: z.object({
        vi: z.string().optional(),
        en: z.string().optional(),
    }),
    duration: z.object({ vi: z.string().optional(), en: z.string().optional() }),
    guideLanguage: z.object({ vi: z.string().optional(), en: z.string().optional() }),
})

const defaultForm = {
    name: {
        vi: "", en: ""
    },
    type: {
        vi: "", en: ""
    },
    destination: {
        vi: "", en: ""
    },
    shortDescription: {
        vi: "", en: ""
    },
    description: {
        vi: "", en: ""
    },
    duration: {
        vi: "", en: ""
    },
    guideLanguage: {
        vi: "", en: ""
    }
}


type TourFormZod = z.infer<typeof tourSchema>
const TourForm: React.FC<TourFormProps> = ({ onSubmit, onClose, initialData, inlineMode }) => {
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
    })

    const imageHandler = async (quillRef: any) => {
        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');
        input.click();
        input.onchange = async () => {
            const files = input.files;
            if (files && files.length > 0) {
                const file = files[0];
                const url = URL.createObjectURL(file);
                const quill = quillRef.current.getEditor();
                const range = quill.getSelection();
                quill.insertEmbed(range.index, 'image', url);
            }
        };
    };

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

    const quillRefVi = useRef<any>(null);
    const quillRefEn = useRef<any>(null);

    const modulesVi = useMemo(() => ({
        ...getModules(quillRefVi),
        clipboard: { matchVisual: false }
    }), [quillRefVi]);
    const modulesEn = useMemo(() => ({
        ...getModules(quillRefEn),
        clipboard: { matchVisual: false }
    }), [quillRefEn]);

    type PriceInput = {
        VND: { perSlot: string, groupPrice: string, discountPrice: string }
        USD: { perSlot: string, groupPrice: string, discountPrice: string }
        EUR: { perSlot: string, groupPrice: string, discountPrice: string }
    }

    const [price, setPrice] = useState<PriceInput>({
        VND: { perSlot: "", groupPrice: "", discountPrice: "" },
        USD: { perSlot: "", groupPrice: "", discountPrice: "" },
        EUR: { perSlot: "", groupPrice: "", discountPrice: "" }
    })

    useEffect(() => {
        if (initialData?.price) {
            setPrice({
                VND: { perSlot: initialData.price.VND.perSlot?.toString() || "", groupPrice: initialData.price.VND.groupPrice?.toString() || "", discountPrice: initialData.price.VND.discountPrice?.toString() || "" },
                USD: { perSlot: initialData.price.USD.perSlot?.toString() || "", groupPrice: initialData.price.USD.groupPrice?.toString() || "", discountPrice: initialData.price.USD.discountPrice?.toString() || "" },
                EUR: { perSlot: initialData.price.EUR.perSlot?.toString() || "", groupPrice: initialData.price.EUR.groupPrice?.toString() || "", discountPrice: initialData.price.EUR.discountPrice?.toString() || "" }
            })
        }

        // Xử lý ảnh có sẵn từ initialData
        if (initialData?.images && initialData.images.length > 0) {
            setExistingImages(initialData.images);
        }
    }, [initialData])

    const handlePriceChange = (currency: keyof PriceInput, field: keyof PriceInput[keyof PriceInput], value: string) => {
        setPrice((prev) => ({
            ...prev,
            [currency]: {
                ...prev[currency],
                [field]: value
            }
        }))
    }

    const [imageUrls, setImageUrls] = useState<string[]>([]);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [existingImages, setExistingImages] = useState<string[]>([]);

    const removeImage = (idx: number) => {
        setImageUrls(prev => prev.filter((_, i) => i !== idx));
        setSelectedFiles(prev => prev.filter((_, i) => i !== idx));
        setExistingImages(prev => prev.filter((_, i) => i !== idx));
    };

    // Tạo URL preview cho các file đã chọn
    useEffect(() => {
        const newUrls = selectedFiles.map(file => URL.createObjectURL(file));
        const allUrls = [...existingImages, ...newUrls];
        setImageUrls(allUrls);

        // Cleanup URLs khi component unmount hoặc selectedFiles thay đổi
        return () => {
            newUrls.forEach(url => URL.revokeObjectURL(url));
        };
    }, [selectedFiles, existingImages]);

    const onFormSubmit = async (data: TourFormZod) => {
        console.log("Submit form: ", data);

        const priceObj = {
            VND: {
                perSlot: price.VND.perSlot ? Number(price.VND.perSlot) : undefined,
                groupPrice: price.VND.groupPrice ? Number(price.VND.groupPrice) : undefined,
                discountPrice: price.VND.discountPrice ? Number(price.VND.discountPrice) : undefined
            },
            USD: {
                perSlot: price.USD.perSlot ? Number(price.USD.perSlot) : undefined,
                groupPrice: price.USD.groupPrice ? Number(price.USD.groupPrice) : undefined,
                discountPrice: price.USD.discountPrice ? Number(price.USD.discountPrice) : undefined
            },
            EUR: {
                perSlot: price.EUR.perSlot ? Number(price.EUR.perSlot) : undefined,
                groupPrice: price.EUR.groupPrice ? Number(price.EUR.groupPrice) : undefined,
                discountPrice: price.EUR.discountPrice ? Number(price.EUR.discountPrice) : undefined
            }
        }

        await onSubmit({
            ...data,
            price: priceObj,
        }, selectedFiles)

    }
    const formContent = (
        <>
            <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-5">
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Tên tour <span className='text-red-500'>*</span></label>
                    <div className="flex gap-2">
                        <div className='w-full'>
                            <input {...register("name.vi")} className={`w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-400 ${errors.name?.vi ? 'border-red-400' : 'border-gray-300'}`} placeholder="Tên tour (Tiếng Việt)" />
                            {errors.name?.vi && (
                                <div className="mt-1 text-red-500 text-xs">{errors.name.vi.message}</div>
                            )}
                        </div>

                        <div className='w-full'>
                            <input {...register('name.en')}
                                className={`w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 ${errors.name?.en ? 'border-red-400' : 'border-gray-300'}`} />
                            {errors.name?.en && (
                                <div className="mt-1 text-red-500 text-xs">{errors.name.en.message}</div>
                            )}
                        </div>
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Loại Tour <span className='text-red-500'>*</span></label>
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
                {/* price */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Giá tour</label>
                    <div className="space-y-4">
                        {/* VND */}
                        <div className="bg-red-50 border border-red-200 rounded-xl p-4 shadow-sm">
                            <h3 className="text-lg font-semibold text-red-700 mb-3 flex items-center">
                                <span className="text-xl mr-2">🇻🇳</span> VND (Việt Nam Đồng)
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">Giá lẻ / slot</label>
                                    <input
                                        value={price.VND.perSlot}
                                        onChange={e => handlePriceChange('VND', 'perSlot', e.target.value)}
                                        placeholder="Nhập giá VND..."
                                        className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-400"
                                        type="number"
                                        min="0"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">Giá nhóm</label>
                                    <input
                                        value={price.VND.groupPrice}
                                        onChange={e => handlePriceChange('VND', 'groupPrice', e.target.value)}
                                        placeholder="Giá nhóm VND (tùy chọn)"
                                        className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-400"
                                        type="number"
                                        min="0"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">Giá khuyến mãi</label>
                                    <input
                                        value={price.VND.discountPrice}
                                        onChange={e => handlePriceChange('VND', 'discountPrice', e.target.value)}
                                        placeholder="Giá khuyến mãi VND (tùy chọn)"
                                        className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-400"
                                        type="number"
                                        min="0"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* USD */}
                        <div className="bg-green-50 border border-green-200 rounded-xl p-4 shadow-sm">
                            <h3 className="text-lg font-semibold text-green-700 mb-3 flex items-center">
                                <span className="text-xl mr-2">🇺🇸</span> USD (US Dollar)
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">Giá lẻ / slot</label>
                                    <input
                                        value={price.USD.perSlot}
                                        onChange={e => handlePriceChange('USD', 'perSlot', e.target.value)}
                                        placeholder="Nhập giá USD..."
                                        className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-400"
                                        type="number"
                                        min="0"
                                        step="0.01"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">Giá nhóm</label>
                                    <input
                                        value={price.USD.groupPrice}
                                        onChange={e => handlePriceChange('USD', 'groupPrice', e.target.value)}
                                        placeholder="Giá nhóm USD (tùy chọn)"
                                        className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-400"
                                        type="number"
                                        min="0"
                                        step="0.01"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">Giá khuyến mãi</label>
                                    <input
                                        value={price.USD.discountPrice}
                                        onChange={e => handlePriceChange('USD', 'discountPrice', e.target.value)}
                                        placeholder="Giá khuyến mãi USD (tùy chọn)"
                                        className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-400"
                                        type="number"
                                        min="0"
                                        step="0.01"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* EUR */}
                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 shadow-sm">
                            <h3 className="text-lg font-semibold text-blue-700 mb-3 flex items-center">
                                <span className="text-xl mr-2">E🇺</span> EUR (Euro)
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">Giá lẻ / slot</label>
                                    <input
                                        value={price.EUR.perSlot}
                                        onChange={e => handlePriceChange('EUR', 'perSlot', e.target.value)}
                                        placeholder="Nhập giá EUR..."
                                        className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400"
                                        type="number"
                                        min="0"
                                        step="0.01"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">Giá nhóm</label>
                                    <input
                                        value={price.EUR.groupPrice}
                                        onChange={e => handlePriceChange('EUR', 'groupPrice', e.target.value)}
                                        placeholder="Giá nhóm EUR (tùy chọn)"
                                        className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400"
                                        type="number"
                                        min="0"
                                        step="0.01"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">Giá khuyến mãi</label>
                                    <input
                                        value={price.EUR.discountPrice}
                                        onChange={e => handlePriceChange('EUR', 'discountPrice', e.target.value)}
                                        placeholder="Giá khuyến mãi EUR (tùy chọn)"
                                        className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400"
                                        type="number"
                                        min="0"
                                        step="0.01"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* location */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Điểm đến (cách nhau bằng dấu phẩy) *</label>
                    <div className="flex gap-2">
                        <div className="w-full">
                            <input
                                {...register('destination.vi')}
                                className={`w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-400 ${errors.destination?.vi ? 'border-red-400' : 'border-gray-300'}`}
                                placeholder="Hà Giang, Đồng Văn... (Tiếng Việt)"
                            />
                            {errors.destination?.vi && (
                                <div className="mt-1 text-red-500 text-xs">{errors.destination.vi.message}</div>
                            )}
                        </div>
                        <div className="w-full">
                            <input
                                {...register('destination.en')}
                                className={`w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 ${errors.destination?.en ? 'border-red-400' : 'border-gray-300'}`}
                                placeholder="Ha Giang, Dong Van... (English)"
                            />
                            {errors.destination?.en && (
                                <div className="mt-1 text-red-500 text-xs">{errors.destination.en.message}</div>
                            )}
                        </div>
                    </div>
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
                                onChange={e => {
                                    if (e.target.files) setSelectedFiles(Array.from(e.target.files));
                                }}
                                className="hidden"
                                id="image-upload"
                            />
                            <label
                                htmlFor="image-upload"
                                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200 cursor-pointer text-sm font-medium"
                            >
                                Chọn ảnh
                            </label>
                        </div>
                    </div>

                    {/* Preview Images */}
                    {imageUrls.length > 0 && (
                        <div className="mt-4">
                            <h4 className="text-sm font-medium text-gray-700 mb-3">Ảnh đã chọn ({imageUrls.length})</h4>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                                {imageUrls.map((url, idx) => (
                                    <div key={idx} className="relative group">
                                        <div className="aspect-square rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                                            <img
                                                src={url}
                                                alt={`Preview ${idx + 1}`}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                                            />
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => removeImage(idx)}
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
                {/* Short description */}
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
                {/* Long description */}
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

                {/* Duration */}
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
                {/* Language */}
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

                <div className='flex justify-end gap-2'>
                    <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400">Hủy</button>
                    <button type="submit" className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">{initialData ? "Cập nhật Tour" : "Thêm Tour"}</button>
                </div>


            </form>
        </>
    )
    return (
        <>
            <div className="inline-block bg-white p-6 rounded-lg shadow border border-blue-200 w-full">
                {formContent}
            </div>
        </>
    )
}

export default TourForm;