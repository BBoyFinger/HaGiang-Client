import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from "@hookform/resolvers/zod"
import { useState, useEffect } from "react"

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
        }, [])
       
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