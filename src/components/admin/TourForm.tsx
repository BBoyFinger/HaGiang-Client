import { useForm } from 'react-hook-form';
import React, { useMemo, useRef } from "react"
import { z } from 'zod';
import { zodResolver } from "@hookform/resolvers/zod"
import { useState, useEffect } from "react"
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

interface TourFormProps {
    onSubmit: (data: any, selectedFiles: File[], imageData?: any) => void;
    onClose: () => void;
    initialData?: any;
    inlineMode?: boolean;
}

interface DaySchedule {
    day: number;
    title: string;
    activities: string[];
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
    duration: z.object({ 
        vi: z.string().min(1, "Thời lượng (Tiếng Việt) là bắt buộc").trim(),
        en: z.string().min(1, "Duration (English) is required").trim()
    }),
    guideLanguage: z.object({ vi: z.string().optional(), en: z.string().optional() }),
    includedServices: z.object({ vi: z.string().optional(), en: z.string().optional() }),
    excludedServices: z.object({ vi: z.string().optional(), en: z.string().optional() }),
    schedule: z.object({ vi: z.string().optional(), en: z.string().optional() }),
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
    },
    includedServices: {
        vi: "", en: ""
    },
    excludedServices: {
        vi: "", en: ""
    },
    schedule: {
        vi: "", en: ""
    }
}


type TourFormZod = z.infer<typeof tourSchema>
const TourForm: React.FC<TourFormProps> = ({ onSubmit, onClose, initialData }) => {
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
            console.log("Processing price from initialData:", initialData.price);
            setPrice({
                VND: { perSlot: initialData.price.VND?.perSlot?.toString() || "", groupPrice: initialData.price.VND?.groupPrice?.toString() || "", discountPrice: initialData.price.VND?.discountPrice?.toString() || "" },
                USD: { perSlot: initialData.price.USD?.perSlot?.toString() || "", groupPrice: initialData.price.USD?.groupPrice?.toString() || "", discountPrice: initialData.price.USD?.discountPrice?.toString() || "" },
                EUR: { perSlot: initialData.price.EUR?.perSlot?.toString() || "", groupPrice: initialData.price.EUR?.groupPrice?.toString() || "", discountPrice: initialData.price.EUR?.discountPrice?.toString() || "" }
            });
            console.log("Price state set to:", {
                VND: { perSlot: initialData.price.VND?.perSlot?.toString() || "", groupPrice: initialData.price.VND?.groupPrice?.toString() || "", discountPrice: initialData.price.VND?.discountPrice?.toString() || "" },
                USD: { perSlot: initialData.price.USD?.perSlot?.toString() || "", groupPrice: initialData.price.USD?.groupPrice?.toString() || "", discountPrice: initialData.price.USD?.discountPrice?.toString() || "" },
                EUR: { perSlot: initialData.price.EUR?.perSlot?.toString() || "", groupPrice: initialData.price.EUR?.groupPrice?.toString() || "", discountPrice: initialData.price.EUR?.discountPrice?.toString() || "" }
            });
        }

        // Xử lý ảnh có sẵn từ initialData
        if (initialData?.imageUrls && initialData.imageUrls.length > 0) {
            setExistingImages(initialData.imageUrls);
        }

        // Xử lý schedule từ initialData
        if (initialData?.schedule) {
            console.log("Processing schedule from initialData:", initialData.schedule);
            if (initialData.schedule.vi && initialData.schedule.vi.length > 0) {
                console.log("Setting scheduleVi:", initialData.schedule.vi);
                setScheduleVi(initialData.schedule.vi);
            }
            if (initialData.schedule.en && initialData.schedule.en.length > 0) {
                console.log("Setting scheduleEn:", initialData.schedule.en);
                setScheduleEn(initialData.schedule.en);
            }
        }

        // Xử lý guideLanguage từ initialData (chuyển từ array sang string)
        if (initialData?.guideLanguage && initialData.guideLanguage.length > 0) {
            const guideLanguagesVi = initialData.guideLanguage.map((lang: any) => lang.vi).join(', ');
            const guideLanguagesEn = initialData.guideLanguage.map((lang: any) => lang.en).join(', ');
            setValue('guideLanguage.vi', guideLanguagesVi);
            setValue('guideLanguage.en', guideLanguagesEn);
        }

        // Xử lý includedServices từ initialData (chuyển từ array sang string)
        if (initialData?.includedServices && initialData.includedServices.length > 0) {
            const includedServicesVi = initialData.includedServices.map((service: any) => service.vi).join('\n');
            const includedServicesEn = initialData.includedServices.map((service: any) => service.en).join('\n');
            setValue('includedServices.vi', includedServicesVi);
            setValue('includedServices.en', includedServicesEn);
        }

        // Xử lý excludedServices từ initialData (chuyển từ array sang string)
        if (initialData?.excludedServices && initialData.excludedServices.length > 0) {
            const excludedServicesVi = initialData.excludedServices.map((service: any) => service.vi).join('\n');
            const excludedServicesEn = initialData.excludedServices.map((service: any) => service.en).join('\n');
            setValue('excludedServices.vi', excludedServicesVi);
            setValue('excludedServices.en', excludedServicesEn);
        }

        // Xử lý destination từ initialData (chuyển từ array sang string cho destination)
        if (initialData?.destination && initialData.destination.length > 0) {
            const destinationVi = initialData.destination.map((loc: any) => loc.vi).join(', ');
            const destinationEn = initialData.destination.map((loc: any) => loc.en).join(', ');
            setValue('destination.vi', destinationVi);
            setValue('destination.en', destinationEn);
        }

        // Reset các state khác khi không có initialData
        if (!initialData) {
            setPrice({
                VND: { perSlot: "", groupPrice: "", discountPrice: "" },
                USD: { perSlot: "", groupPrice: "", discountPrice: "" },
                EUR: { perSlot: "", groupPrice: "", discountPrice: "" }
            });
            setExistingImages([]);
            setSelectedFiles([]);
            setRemovedImages([]);
            setScheduleVi([{ day: 1, title: '', activities: [''] }]);
            setScheduleEn([{ day: 1, title: '', activities: [''] }]);
        }

    }, [initialData, setValue])

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
    const [removedImages, setRemovedImages] = useState<string[]>([]);

    const removeImage = (idx: number) => {
        const allImages = [...existingImages, ...selectedFiles.map(file => URL.createObjectURL(file))];
        const removedImage = allImages[idx];
        
        setImageUrls(prev => prev.filter((_, i) => i !== idx));
        setSelectedFiles(prev => prev.filter((_, i) => i !== idx));
        setExistingImages(prev => prev.filter((_, i) => i !== idx));
        
        // Nếu ảnh bị xóa là ảnh có sẵn, thêm vào danh sách ảnh đã xóa
        if (idx < existingImages.length) {
            setRemovedImages(prev => [...prev, existingImages[idx]]);
        }
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
        console.log("onFormSubmit called with data:", data);
        console.log("initialData exists:", !!initialData);
        console.log("price state:", price);
        console.log("scheduleVi state:", scheduleVi);
        console.log("scheduleEn state:", scheduleEn);

        // Validate price - ensure at least one currency has perSlot
        console.log("Validating price:", { VND: price.VND.perSlot, USD: price.USD.perSlot, EUR: price.EUR.perSlot });
        if (!price.VND.perSlot && !price.USD.perSlot && !price.EUR.perSlot) {
            console.log("Price validation failed");
            alert('Vui lòng nhập ít nhất một mức giá cho một loại tiền tệ');
            return;
        }
        console.log("Price validation passed");

        // Validate schedule - ensure at least one day has title and activities
        const hasValidScheduleVi = scheduleVi.some(day => day.title.trim() && day.activities.some(activity => activity.trim()));
        const hasValidScheduleEn = scheduleEn.some(day => day.title.trim() && day.activities.some(activity => activity.trim()));
        
        console.log("Schedule validation:", { hasValidScheduleVi, hasValidScheduleEn, scheduleVi, scheduleEn });
        
        if (!hasValidScheduleVi && !hasValidScheduleEn) {
            console.log("Schedule validation failed");
            alert('Vui lòng nhập ít nhất một ngày với tiêu đề và hoạt động cho lịch trình');
            return;
        }
        console.log("Schedule validation passed");

        const priceObj: any = {};
        
        // Only include currencies that have perSlot values
        if (price.VND.perSlot) {
            priceObj.VND = {
                perSlot: Number(price.VND.perSlot),
                ...(price.VND.groupPrice && { groupPrice: Number(price.VND.groupPrice) }),
                ...(price.VND.discountPrice && { discountPrice: Number(price.VND.discountPrice) })
            };
        }
        
        if (price.USD.perSlot) {
            priceObj.USD = {
                perSlot: Number(price.USD.perSlot),
                ...(price.USD.groupPrice && { groupPrice: Number(price.USD.groupPrice) }),
                ...(price.USD.discountPrice && { discountPrice: Number(price.USD.discountPrice) })
            };
        }
        
        if (price.EUR.perSlot) {
            priceObj.EUR = {
                perSlot: Number(price.EUR.perSlot),
                ...(price.EUR.groupPrice && { groupPrice: Number(price.EUR.groupPrice) }),
                ...(price.EUR.discountPrice && { discountPrice: Number(price.EUR.discountPrice) })
            };
        }

        // Filter out empty schedule days
        const filteredScheduleVi = scheduleVi.filter(day => day.title.trim() && day.activities.some(activity => activity.trim()));
        const filteredScheduleEn = scheduleEn.filter(day => day.title.trim() && day.activities.some(activity => activity.trim()));

        // Xử lý chuyển đổi format cho các trường array
        const processedData = {
            ...data,
            price: priceObj,
            schedule: {
                vi: filteredScheduleVi.length > 0 ? filteredScheduleVi : undefined,
                en: filteredScheduleEn.length > 0 ? filteredScheduleEn : undefined
            },
            // Chuyển đổi destination từ string sang array cho destination
            destination: data.destination.vi ?
                data.destination.vi.split(',').map((loc: string) => ({ vi: loc.trim(), en: loc.trim() })) : [],
            // Chuyển đổi guideLanguage từ string sang array nếu cần
            guideLanguage: data.guideLanguage.vi ?
                data.guideLanguage.vi.split(',').map((lang: string) => ({ vi: lang.trim(), en: lang.trim() })) : [],
            // Chuyển đổi includedServices từ string sang array nếu cần
            includedServices: data.includedServices.vi ?
                data.includedServices.vi.split('\n').filter((service: string) => service.trim()).map((service: string) => ({ vi: service.trim(), en: service.trim() })) : [],
            // Chuyển đổi excludedServices từ string sang array nếu cần
            excludedServices: data.excludedServices.vi ?
                data.excludedServices.vi.split('\n').filter((service: string) => service.trim()).map((service: string) => ({ vi: service.trim(), en: service.trim() })) : []
        };

        // Gửi thông tin về ảnh
        const imageData = {
            existingImages: existingImages,
            newImages: selectedFiles,
            removedImages: removedImages
        };
        
        console.log("About to call onSubmit with:", { processedData, selectedFiles, imageData });
        await onSubmit(processedData, selectedFiles, imageData);
        console.log("onSubmit completed");

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
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Giá tour <span className="text-red-500">*</span></label>
                    <p className="text-xs text-gray-500 mb-3">Vui lòng nhập ít nhất một mức giá cho một loại tiền tệ</p>
                    <div className="space-y-4">
                        {/* VND */}
                        <div className="bg-red-50 border border-red-200 rounded-xl p-4 shadow-sm">
                            <h3 className="text-lg font-semibold text-red-700 mb-3 flex items-center">
                                <span className="text-xl mr-2">🇻🇳</span> VND (Việt Nam Đồng)
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">Giá lẻ / slot <span className="text-red-500">*</span></label>
                                    <input
                                        value={price.VND.perSlot}
                                        onChange={e => handlePriceChange('VND', 'perSlot', e.target.value)}
                                        placeholder="Nhập giá VND..."
                                        className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-400"
                                        type="number"
                                        min="0"
                                        required
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
                                    <label className="block text-xs font-medium text-gray-600 mb-1">Giá lẻ / slot <span className="text-red-500">*</span></label>
                                    <input
                                        value={price.USD.perSlot}
                                        onChange={e => handlePriceChange('USD', 'perSlot', e.target.value)}
                                        placeholder="Nhập giá USD..."
                                        className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-400"
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        required
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
                                    <label className="block text-xs font-medium text-gray-600 mb-1">Giá lẻ / slot <span className="text-red-500">*</span></label>
                                    <input
                                        value={price.EUR.perSlot}
                                        onChange={e => handlePriceChange('EUR', 'perSlot', e.target.value)}
                                        placeholder="Nhập giá EUR..."
                                        className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400"
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        required
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
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Thời lượng <span className="text-red-500">*</span>
                    </label>
                    <div className="flex gap-2">
                        <div className="w-full">
                            <input
                                type="text"
                                {...register('duration.vi')}
                                className={`w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-200 ${
                                    errors.duration?.vi ? 'border-red-500' : 'border-gray-300'
                                }`}
                                placeholder="VD: 3 ngày 2 đêm, 1 ngày, 5 ngày 4 đêm"
                            />
                            {errors.duration?.vi && <p className="text-red-500 text-xs mt-1">{errors.duration.vi.message}</p>}
                        </div>
                        <div className="w-full">
                            <input
                                type="text"
                                {...register('duration.en')}
                                className={`w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-200 ${
                                    errors.duration?.en ? 'border-red-500' : 'border-gray-300'
                                }`}
                                placeholder="E.g: 3 days 2 nights, 1 day, 5 days 4 nights"
                            />
                            {errors.duration?.en && <p className="text-red-500 text-xs mt-1">{errors.duration.en.message}</p>}
                        </div>
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
                {/* Included services */}
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
                {/* Excluded services */}
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
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Lịch trình (Tiếng Việt) <span className="text-red-500">*</span></label>
                    <p className="text-xs text-gray-500 mb-3">Vui lòng nhập ít nhất một ngày với tiêu đề và hoạt động</p>
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
                                    placeholder={`Tiêu đề ngày ${day.day} *`}
                                    className="w-full mb-2 border rounded px-3 py-2 focus:ring-2 focus:ring-purple-400"
                                    required
                                />
                                <div className="space-y-2">
                                    {day.activities.map((act, actIdx) => (
                                        <div key={actIdx} className="flex items-center gap-2">
                                            <input
                                                value={act}
                                                onChange={e => handleScheduleChange('vi', dayIdx, 'activity', e.target.value, actIdx)}
                                                placeholder={`Hoạt động ${actIdx + 1} *`}
                                                className="flex-1 border rounded px-3 py-2 focus:ring-2 focus:ring-purple-200"
                                                required
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
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Lịch trình (English) <span className="text-red-500">*</span></label>
                    <p className="text-xs text-gray-500 mb-3">Please enter at least one day with title and activities</p>
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
                                    placeholder={`Day ${day.day} title *`}
                                    className="w-full mb-2 border rounded px-3 py-2 focus:ring-2 focus:ring-purple-400"
                                    required
                                />
                                <div className="space-y-2">
                                    {day.activities.map((act, actIdx) => (
                                        <div key={actIdx} className="flex items-center gap-2">
                                            <input
                                                value={act}
                                                onChange={e => handleScheduleChange('en', dayIdx, 'activity', e.target.value, actIdx)}
                                                placeholder={`Activity ${actIdx + 1} *`}
                                                className="flex-1 border rounded px-3 py-2 focus:ring-2 focus:ring-purple-200"
                                                required
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