import React, { useMemo, useRef } from "react"
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

// Simple form data interface
interface FormData {
    name: {
        vi: string;
        en: string;
    };
    type: {
        vi: string;
        en: string;
    };
    destination: {
        vi: string;
        en: string;
    };
    shortDescription: {
        vi: string;
        en: string;
    };
    description: {
        vi: string;
        en: string;
    };
    duration: {
        vi: string;
        en: string;
    };
    guideLanguage: {
        vi: string;
        en: string;
    };
    includedServices: {
        vi: string;
        en: string;
    };
    excludedServices: {
        vi: string;
        en: string;
    };
}

const defaultForm: FormData = {
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
    }
}

// Function to transform initialData to match the form format
const transformInitialData = (data: any): FormData => {
    if (!data) return defaultForm;

    return {
        name: {
            vi: data.name?.vi || '',
            en: data.name?.en || ''
        },
        type: {
            vi: data.type?.vi || '',
            en: data.type?.en || ''
        },
        destination: {
            vi: Array.isArray(data.destination)
                ? data.destination.map((loc: any) => loc.vi || loc).join(', ')
                : data.destination?.vi || '',
            en: Array.isArray(data.destination)
                ? data.destination.map((loc: any) => loc.en || loc).join(', ')
                : data.destination?.en || ''
        },
        shortDescription: {
            vi: data.shortDescription?.vi || '',
            en: data.shortDescription?.en || ''
        },
        description: {
            vi: data.description?.vi || '',
            en: data.description?.en || ''
        },
        duration: {
            vi: data.duration?.vi || '',
            en: data.duration?.en || ''
        },
        guideLanguage: {
            vi: Array.isArray(data.guideLanguage)
                ? data.guideLanguage.map((lang: any) => lang.vi || lang).join(', ')
                : data.guideLanguage?.vi || '',
            en: Array.isArray(data.guideLanguage)
                ? data.guideLanguage.map((lang: any) => lang.en || lang).join(', ')
                : data.guideLanguage?.en || ''
        },
        includedServices: {
            vi: Array.isArray(data.includedServices)
                ? data.includedServices.map((service: any) => service.vi || service).join('\n')
                : data.includedServices?.vi || '',
            en: Array.isArray(data.includedServices)
                ? data.includedServices.map((service: any) => service.en || service).join('\n')
                : data.includedServices?.en || ''
        },
        excludedServices: {
            vi: Array.isArray(data.excludedServices)
                ? data.excludedServices.map((service: any) => service.vi || service).join('\n')
                : data.excludedServices?.vi || '',
            en: Array.isArray(data.excludedServices)
                ? data.excludedServices.map((service: any) => service.en || service).join('\n')
                : data.excludedServices?.en || ''
        }
    };
}

const TourForm: React.FC<TourFormProps> = ({ onSubmit, onClose, initialData }) => {
    // Form state using useState instead of react-hook-form
    const [formData, setFormData] = useState<FormData>(transformInitialData(initialData));

    // Schedule state
    const [scheduleVi, setScheduleVi] = useState<DaySchedule[]>([{ day: 1, title: '', activities: [''] }]);
    const [scheduleEn, setScheduleEn] = useState<DaySchedule[]>([{ day: 1, title: '', activities: [''] }]);

    // Price state
    const [price, setPrice] = useState({
        VND: { perSlot: '', groupPrice: '', discountPrice: '' },
        USD: { perSlot: '', groupPrice: '', discountPrice: '' },
        EUR: { perSlot: '', groupPrice: '', discountPrice: '' }
    });

    // Image state
    const [existingImages, setExistingImages] = useState<string[]>([]);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [removedImages, setRemovedImages] = useState<string[]>([]);

    // Initialize form data when initialData changes
    useEffect(() => {
        if (initialData) {

            // Set form data
            setFormData(transformInitialData(initialData));

            // Set price data
            if (initialData.price) {
                setPrice({
                    VND: {
                        perSlot: initialData.price.VND?.perSlot?.toString() || '',
                        groupPrice: initialData.price.VND?.groupPrice?.toString() || '',
                        discountPrice: initialData.price.VND?.discountPrice?.toString() || ''
                    },
                    USD: {
                        perSlot: initialData.price.USD?.perSlot?.toString() || '',
                        groupPrice: initialData.price.USD?.groupPrice?.toString() || '',
                        discountPrice: initialData.price.USD?.discountPrice?.toString() || ''
                    },
                    EUR: {
                        perSlot: initialData.price.EUR?.perSlot?.toString() || '',
                        groupPrice: initialData.price.EUR?.groupPrice?.toString() || '',
                        discountPrice: initialData.price.EUR?.discountPrice?.toString() || ''
                    }
                });
            }

            // Set existing images
            if (initialData.images && Array.isArray(initialData.images)) {
                setExistingImages(initialData.images);
            }

            // Set schedule data
            if (initialData.schedule) {
                if (initialData.schedule.vi && Array.isArray(initialData.schedule.vi)) {
                    setScheduleVi(JSON.parse(JSON.stringify(initialData.schedule.vi)));
                }

                if (initialData.schedule.en && Array.isArray(initialData.schedule.en)) {
                    setScheduleEn(JSON.parse(JSON.stringify(initialData.schedule.en)));
                }
            }
        }
    }, [initialData]);

    // Handle form field changes
    const handleFormChange = (field: keyof FormData, lang: 'vi' | 'en', value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: {
                ...prev[field],
                [lang]: value
            }
        }));
    };

    // Schedule functions
    const addDay = (lang: 'vi' | 'en') => {
        if (lang === 'vi') {
            const newDay = { day: scheduleVi.length + 1, title: '', activities: [''] };
            setScheduleVi([...scheduleVi, newDay]);
        } else {
            const newDay = { day: scheduleEn.length + 1, title: '', activities: [''] };
            setScheduleEn([...scheduleEn, newDay]);
        }
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
            if (field === 'title') {
                newSchedule[dayIdx].title = value;
            } else if (field === 'activity' && actIdx !== undefined) {
                newSchedule[dayIdx].activities[actIdx] = value;
            }
            setScheduleVi(newSchedule);
        } else {
            const newSchedule = [...scheduleEn];
            if (field === 'title') {
                newSchedule[dayIdx].title = value;
            } else if (field === 'activity' && actIdx !== undefined) {
                newSchedule[dayIdx].activities[actIdx] = value;
            }
            setScheduleEn(newSchedule);
        }
    };

    // Price change handler
    const handlePriceChange = (currency: 'VND' | 'USD' | 'EUR', field: 'perSlot' | 'groupPrice' | 'discountPrice', value: string) => {
        setPrice(prev => ({
            ...prev,
            [currency]: {
                ...prev[currency],
                [field]: value
            }
        }));
    };

    // Image handlers
    const imageHandler = async (quillRef: any) => {
        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');
        input.click();

        input.onchange = async () => {
            const file = input.files?.[0];
            if (file) {
                setSelectedFiles(prev => [...prev, file]);
                const reader = new FileReader();
                reader.onload = () => {
                    const range = quillRef.getSelection();
                    quillRef.insertEmbed(range.index, 'image', reader.result);
                };
                reader.readAsDataURL(file);
            }
        };
    };

    const getModules = (quillRef: any) => ({
        toolbar: {
            container: [
                [{ 'header': [1, 2, false] }],
                ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
                ['link', 'image'],
                ['clean']
            ],
            handlers: {
                image: () => imageHandler(quillRef)
            }
        }
    });

    const removeImage = (idx: number) => {
        const imageToRemove = existingImages[idx];
        setRemovedImages(prev => [...prev, imageToRemove]);
        setExistingImages(prev => prev.filter((_, i) => i !== idx));
    };

    // Form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            // Basic validation
            if (!formData.name.vi.trim() || !formData.name.en.trim()) {
                alert('Vui lòng nhập tên tour');
                return;
            }

            if (!formData.type.vi.trim() || !formData.type.en.trim()) {
                alert('Vui lòng nhập loại tour');
                return;
            }

            if (!formData.destination.vi.trim() || !formData.destination.en.trim()) {
                alert('Vui lòng nhập điểm đến');
                return;
            }

            if (!formData.shortDescription.vi.trim() || !formData.shortDescription.en.trim()) {
                alert('Vui lòng nhập mô tả ngắn');
                return;
            }

            if (!formData.duration.vi.trim() || !formData.duration.en.trim()) {
                alert('Vui lòng nhập thời lượng');
                return;
            }

            // Validate price - ensure at least one currency has perSlot
            if (!price.VND.perSlot && !price.USD.perSlot && !price.EUR.perSlot) {
                alert('Vui lòng nhập ít nhất một mức giá cho một loại tiền tệ');
                return;
            }

            // Validate schedule - ensure at least one day has title and activities
            const hasValidScheduleVi = scheduleVi.some(day => day.title.trim() && day.activities.some(activity => activity.trim()));
            const hasValidScheduleEn = scheduleEn.some(day => day.title.trim() && day.activities.some(activity => activity.trim()));

            if (!hasValidScheduleVi && !hasValidScheduleEn) {
                alert('Vui lòng nhập ít nhất một ngày với tiêu đề và hoạt động cho lịch trình');
                return;
            }

            // Process price data
            const priceObj: any = {};
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

            // Process data for submission
            const processedData = {
                ...formData,
                price: priceObj,
                schedule: {
                    vi: filteredScheduleVi.length > 0 ? filteredScheduleVi : [],
                    en: filteredScheduleEn.length > 0 ? filteredScheduleEn : []
                },
                // Convert strings to arrays for backend
                destination: formData.destination.vi ?
                    formData.destination.vi.split(',').filter((loc: string) => loc.trim()).map((loc: string) => ({ vi: loc.trim(), en: loc.trim() })) : [],
                guideLanguage: formData.guideLanguage.vi && formData.guideLanguage.vi.trim() ?
                    formData.guideLanguage.vi.split(',').filter((lang: string) => lang.trim()).map((lang: string) => ({ vi: lang.trim(), en: lang.trim() })) : [],
                includedServices: formData.includedServices.vi && formData.includedServices.vi.trim() ?
                    formData.includedServices.vi.split('\n').filter((service: string) => service.trim()).map((service: string) => ({ vi: service.trim(), en: service.trim() })) : [],
                excludedServices: formData.excludedServices.vi && formData.excludedServices.vi.trim() ?
                    formData.excludedServices.vi.split('\n').filter((service: string) => service.trim()).map((service: string) => ({ vi: service.trim(), en: service.trim() })) : []
            };



            // Image data
            const imageData = {
                existingImages: existingImages,
                newImages: selectedFiles,
                removedImages: removedImages
            };
            await onSubmit(processedData, selectedFiles, imageData);
        } catch (error: any) {
            throw error;
        }
    };

    const formContent = (
        <>
            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Tên tour <span className='text-red-500'>*</span></label>
                    <div className="flex gap-2">
                        <div className='w-full'>
                            <input
                                value={formData.name.vi}
                                onChange={(e) => handleFormChange('name', 'vi', e.target.value)}
                                className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-400 border-gray-300"
                                placeholder="Tên tour (Tiếng Việt)"
                            />
                        </div>

                        <div className='w-full'>
                            <input
                                value={formData.name.en}
                                onChange={(e) => handleFormChange('name', 'en', e.target.value)}
                                className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 border-gray-300"
                                placeholder="Tour name (English)"
                            />
                        </div>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Loại Tour <span className='text-red-500'>*</span></label>
                    <div className="flex gap-2">
                        <div className="w-full">
                            <input
                                value={formData.type.vi}
                                onChange={(e) => handleFormChange('type', 'vi', e.target.value)}
                                className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-400 border-gray-300"
                                placeholder="Loại tour (Tiếng Việt)"
                            />
                        </div>
                        <div className="w-full">
                            <input
                                value={formData.type.en}
                                onChange={(e) => handleFormChange('type', 'en', e.target.value)}
                                className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 border-gray-300"
                                placeholder="Tour type (English)"
                            />
                        </div>
                    </div>
                </div>

                {/* Price section */}
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
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">Giá nhóm</label>
                                    <input
                                        value={price.VND.groupPrice}
                                        onChange={e => handlePriceChange('VND', 'groupPrice', e.target.value)}
                                        placeholder="Giá nhóm VND..."
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
                                        placeholder="Giá khuyến mãi VND..."
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
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">Giá nhóm</label>
                                    <input
                                        value={price.USD.groupPrice}
                                        onChange={e => handlePriceChange('USD', 'groupPrice', e.target.value)}
                                        placeholder="Giá nhóm USD..."
                                        className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-400"
                                        type="number"
                                        min="0"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">Giá khuyến mãi</label>
                                    <input
                                        value={price.USD.discountPrice}
                                        onChange={e => handlePriceChange('USD', 'discountPrice', e.target.value)}
                                        placeholder="Giá khuyến mãi USD..."
                                        className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-400"
                                        type="number"
                                        min="0"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* EUR */}
                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 shadow-sm">
                            <h3 className="text-lg font-semibold text-blue-700 mb-3 flex items-center">
                                <span className="text-xl mr-2">🇪🇺</span> EUR (Euro)
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
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">Giá nhóm</label>
                                    <input
                                        value={price.EUR.groupPrice}
                                        onChange={e => handlePriceChange('EUR', 'groupPrice', e.target.value)}
                                        placeholder="Giá nhóm EUR..."
                                        className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400"
                                        type="number"
                                        min="0"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">Giá khuyến mãi</label>
                                    <input
                                        value={price.EUR.discountPrice}
                                        onChange={e => handlePriceChange('EUR', 'discountPrice', e.target.value)}
                                        placeholder="Giá khuyến mãi EUR..."
                                        className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400"
                                        type="number"
                                        min="0"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Điểm đến <span className='text-red-500'>*</span></label>
                    <div className="flex gap-2">
                        <div className="w-full">
                            <input
                                value={formData.destination.vi}
                                onChange={(e) => handleFormChange('destination', 'vi', e.target.value)}
                                className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-400 border-gray-300"
                                placeholder="Điểm đến (Tiếng Việt)"
                            />
                        </div>
                        <div className="w-full">
                            <input
                                value={formData.destination.en}
                                onChange={(e) => handleFormChange('destination', 'en', e.target.value)}
                                className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 border-gray-300"
                                placeholder="Destination (English)"
                            />
                        </div>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Mô tả ngắn <span className='text-red-500'>*</span></label>
                    <div className="flex gap-2">
                        <div className="w-full">
                            <input
                                value={formData.shortDescription.vi}
                                onChange={(e) => handleFormChange('shortDescription', 'vi', e.target.value)}
                                className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-400 border-gray-300"
                                placeholder="Mô tả ngắn (Tiếng Việt)"
                            />
                        </div>
                        <div className="w-full">
                            <input
                                value={formData.shortDescription.en}
                                onChange={(e) => handleFormChange('shortDescription', 'en', e.target.value)}
                                className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 border-gray-300"
                                placeholder="Short description (English)"
                            />
                        </div>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Mô tả chi tiết</label>
                    <div className="flex gap-2">
                        <div className="w-full">
                            <ReactQuill
                                value={formData.description.vi}
                                onChange={(value) => handleFormChange('description', 'vi', value)}
                                modules={getModules(ReactQuill)}
                                placeholder="Mô tả chi tiết (Tiếng Việt)"
                                className="h-32"
                            />
                        </div>
                        <div className="w-full">
                            <ReactQuill
                                value={formData.description.en}
                                onChange={(value) => handleFormChange('description', 'en', value)}
                                modules={getModules(ReactQuill)}
                                placeholder="Detailed description (English)"
                                className="h-32"
                            />
                        </div>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Thời lượng <span className='text-red-500'>*</span></label>
                    <div className="flex gap-2">
                        <div className="w-full">
                            <input
                                value={formData.duration.vi}
                                onChange={(e) => handleFormChange('duration', 'vi', e.target.value)}
                                className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-400 border-gray-300"
                                placeholder="Thời lượng (Tiếng Việt)"
                            />
                        </div>
                        <div className="w-full">
                            <input
                                value={formData.duration.en}
                                onChange={(e) => handleFormChange('duration', 'en', e.target.value)}
                                className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 border-gray-300"
                                placeholder="Duration (English)"
                            />
                        </div>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Ngôn ngữ hướng dẫn</label>
                    <div className="flex gap-2">
                        <div className="w-full">
                            <input
                                value={formData.guideLanguage.vi}
                                onChange={(e) => handleFormChange('guideLanguage', 'vi', e.target.value)}
                                className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-400 border-gray-300"
                                placeholder="Ngôn ngữ hướng dẫn (Tiếng Việt)"
                            />
                        </div>
                        <div className="w-full">
                            <input
                                value={formData.guideLanguage.en}
                                onChange={(e) => handleFormChange('guideLanguage', 'en', e.target.value)}
                                className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 border-gray-300"
                                placeholder="Guide language (English)"
                            />
                        </div>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Dịch vụ bao gồm</label>
                    <div className="flex gap-2">
                        <div className="w-full">
                            <textarea
                                value={formData.includedServices.vi}
                                onChange={(e) => handleFormChange('includedServices', 'vi', e.target.value)}
                                className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-400 border-gray-300"
                                placeholder="Dịch vụ bao gồm (Tiếng Việt)"
                                rows={4}
                            />
                        </div>
                        <div className="w-full">
                            <textarea
                                value={formData.includedServices.en}
                                onChange={(e) => handleFormChange('includedServices', 'en', e.target.value)}
                                className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 border-gray-300"
                                placeholder="Included services (English)"
                                rows={4}
                            />
                        </div>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Dịch vụ không bao gồm</label>
                    <div className="flex gap-2">
                        <div className="w-full">
                            <textarea
                                value={formData.excludedServices.vi}
                                onChange={(e) => handleFormChange('excludedServices', 'vi', e.target.value)}
                                className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-400 border-gray-300"
                                placeholder="Dịch vụ không bao gồm (Tiếng Việt)"
                                rows={4}
                            />
                        </div>
                        <div className="w-full">
                            <textarea
                                value={formData.excludedServices.en}
                                onChange={(e) => handleFormChange('excludedServices', 'en', e.target.value)}
                                className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 border-gray-300"
                                placeholder="Excluded services (English)"
                                rows={4}
                            />
                        </div>
                    </div>
                </div>

                {/* Schedule section */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Lịch trình <span className="text-red-500">*</span></label>
                    <p className="text-xs text-gray-500 mb-3">Vui lòng nhập ít nhất một ngày với tiêu đề và hoạt động</p>

                    {/* Vietnamese Schedule */}
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold text-purple-700 mb-3 flex items-center">
                            <span className="text-xl mr-2">🇻🇳</span> Lịch trình (Tiếng Việt)
                        </h3>
                        {scheduleVi.map((day, dayIdx) => (
                            <div key={dayIdx} className="bg-purple-50 border border-purple-200 rounded-xl p-4 mb-4 shadow-sm">
                                <div className="flex items-center justify-between mb-3">
                                    <h4 className="text-lg font-semibold text-purple-800">Ngày {day.day}</h4>
                                    {scheduleVi.length > 1 && (
                                        <button type="button" onClick={() => {
                                            const newSchedule = scheduleVi.filter((_, i) => i !== dayIdx);
                                            const updatedSchedule = newSchedule.map((day, index) => ({
                                                ...day,
                                                day: index + 1
                                            }));
                                            setScheduleVi(updatedSchedule);
                                        }} className="text-red-500 hover:text-red-700 bg-white rounded-full p-1 shadow transition" title="Remove day">
                                            ×
                                        </button>
                                    )}
                                </div>
                                <input
                                    value={day.title}
                                    onChange={e => handleScheduleChange('vi', dayIdx, 'title', e.target.value)}
                                    placeholder={`Ngày ${day.day} tiêu đề *`}
                                    className="w-full mb-2 border rounded px-3 py-2 focus:ring-2 focus:ring-purple-400"
                                />
                                <div className="space-y-2">
                                    {day.activities.map((act, actIdx) => (
                                        <div key={actIdx} className="flex items-center gap-2">
                                            <input
                                                value={act}
                                                onChange={e => handleScheduleChange('vi', dayIdx, 'activity', e.target.value, actIdx)}
                                                placeholder={`Hoạt động ${actIdx + 1} *`}
                                                className="flex-1 border rounded px-3 py-2 focus:ring-2 focus:ring-purple-200"
                                            />
                                            {day.activities.length > 1 && (
                                                <button type="button" onClick={() => {
                                                    const newSchedule = [...scheduleVi];
                                                    newSchedule[dayIdx].activities = newSchedule[dayIdx].activities.filter((_, i) => i !== actIdx);
                                                    setScheduleVi(newSchedule);
                                                }} className="text-red-500 hover:text-red-700 bg-white rounded-full p-1 shadow transition" title="Remove activity">
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

                    {/* English Schedule */}
                    <div className="mt-6">
                        <h3 className="text-lg font-semibold text-blue-700 mb-3 flex items-center">
                            <span className="text-xl mr-2">🇺🇸</span> Schedule (English)
                        </h3>
                        {scheduleEn.map((day, dayIdx) => (
                            <div key={dayIdx} className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4 shadow-sm">
                                <div className="flex items-center justify-between mb-3">
                                    <h4 className="text-lg font-semibold text-blue-800">Day {day.day}</h4>
                                    {scheduleEn.length > 1 && (
                                        <button type="button" onClick={() => {
                                            const newSchedule = scheduleEn.filter((_, i) => i !== dayIdx);
                                            const updatedSchedule = newSchedule.map((day, index) => ({
                                                ...day,
                                                day: index + 1
                                            }));
                                            setScheduleEn(updatedSchedule);
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
                                />
                                <div className="space-y-2">
                                    {day.activities.map((act, actIdx) => (
                                        <div key={actIdx} className="flex items-center gap-2">
                                            <input
                                                value={act}
                                                onChange={e => handleScheduleChange('en', dayIdx, 'activity', e.target.value, actIdx)}
                                                placeholder={`Activity ${actIdx + 1} *`}
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

                <div className='flex justify-end gap-2'>
                    <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400">Hủy</button>
                    <button
                        type="submit"
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                    >
                        {initialData ? "Cập nhật Tour" : "Thêm Tour"}
                    </button>
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