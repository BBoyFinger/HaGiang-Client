import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { useAddBookingMutation, useGetTourByIdQuery } from "@/services/api";
import { useSelector } from "react-redux";
import LoadingSpinner from "./LoadingSpinner";

interface ModalBookingFormProps {
    open: boolean;
    onClose: () => void;
    selectedTourId: string;
}

export default function ModalBookingForm({ open, onClose, selectedTourId }: ModalBookingFormProps) {
    const { t, i18n } = useTranslation();
    const user = useSelector((state: any) => state.user.user);
    const isAuthenticated = useSelector((state: any) => state.user.isAuthenticated);
    const [addBooking, { isLoading }] = useAddBookingMutation();
    const { data: tourData } = useGetTourByIdQuery(selectedTourId, {
        skip: !selectedTourId
    });
    const tour = tourData?.tour;

    const [form, setForm] = useState({
        fullName: "",
        email: "",
        phone: "",
        numberOfPeople: 1,
        travelDate: "",
        note: ""
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    // Reset form when modal opens/closes
    useEffect(() => {
        if (open) {
            setForm({
                fullName: user?.name || "",
                email: user?.email || "",
                phone: user?.phone || "",
                numberOfPeople: 1,
                travelDate: "",
                note: ""
            });
            setErrors({});
        }
    }, [open, user]);

    if (!open) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
        
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: "" }));
        }
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!form.fullName.trim()) {
            newErrors.fullName = t('booking.errors.nameRequired');
        }

        if (!form.email.trim()) {
            newErrors.email = t('booking.errors.emailRequired');
        } else if (!/\S+@\S+\.\S+/.test(form.email)) {
            newErrors.email = t('booking.errors.emailInvalid');
        }

        if (!form.phone.trim()) {
            newErrors.phone = t('booking.errors.phoneRequired');
        }

        if (!form.travelDate) {
            newErrors.travelDate = t('booking.errors.dateRequired');
        } else {
            const selectedDate = new Date(form.travelDate);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            if (selectedDate < today) {
                newErrors.travelDate = t('booking.errors.datePast');
            }
        }

        if (form.numberOfPeople < 1) {
            newErrors.numberOfPeople = t('booking.errors.peopleMin');
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        if (!isAuthenticated) {
            toast.error(t('booking.errors.loginRequired'));
            return;
        }

        try {
            const bookingData = {
                tourId: selectedTourId,
                numberOfPeople: form.numberOfPeople,
                travelDate: form.travelDate,
                contactInfo: {
                    fullName: form.fullName,
                    phone: form.phone,
                    email: form.email
                },
                note: form.note
            };

            await addBooking(bookingData).unwrap();
            
            toast.success(t('booking.success'));
            onClose();
        } catch (error: any) {
            console.error('Booking error:', error);
            toast.error(error?.data?.message || t('booking.errors.serverError'));
        }
    };

    // Get tour name in current language
    const tourName = tour?.name ? tour.name[i18n.language as keyof typeof tour.name] || tour.name.vi : '';
    
    // Get tour pricing information
    const vndPrice = tour?.price?.get?.('VND') || tour?.price?.VND;
    const perSlotPrice = vndPrice?.perSlot || 0;
    const groupPrice = vndPrice?.groupPrice || 0;
    const discountPrice = vndPrice?.discountPrice || 0;
    
    // Calculate total price based on pricing logic
    let totalPrice = 0;
    let priceType = 'perSlot';
    
    if (discountPrice && discountPrice > 0) {
        totalPrice = discountPrice * form.numberOfPeople;
        priceType = 'discount';
    } else if (groupPrice && form.numberOfPeople >= 2) {
        totalPrice = groupPrice * form.numberOfPeople;
        priceType = 'group';
    } else {
        totalPrice = perSlotPrice * form.numberOfPeople;
        priceType = 'perSlot';
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-lg relative max-h-[90vh] overflow-y-auto">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-red-500 text-xl font-bold"
                    disabled={isLoading}
                >
                    ×
                </button>
                
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-white">
                    {t('booking.title')}
                </h2>

                {tour && (
                    <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <h3 className="font-semibold text-lg mb-2">{tourName}</h3>
                        
                        {/* Pricing Information */}
                        <div className="space-y-2 mb-3">
                            <p className="text-gray-600 dark:text-gray-300 text-sm">
                                <span className="font-medium">Giá cơ bản:</span> {perSlotPrice.toLocaleString()} VND/người
                            </p>
                            
                            {groupPrice > 0 && (
                                <p className="text-gray-600 dark:text-gray-300 text-sm">
                                    <span className="font-medium">Giá nhóm (2+ người):</span> {groupPrice.toLocaleString()} VND/người
                                </p>
                            )}
                            
                            {discountPrice > 0 && (
                                <p className="text-green-600 dark:text-green-400 text-sm">
                                    <span className="font-medium">Giá khuyến mãi:</span> {discountPrice.toLocaleString()} VND/người
                                </p>
                            )}
                        </div>
                        
                        {/* Applied Price */}
                        <div className="border-t pt-3">
                            <p className="text-gray-600 dark:text-gray-300 text-sm mb-1">
                                <span className="font-medium">Áp dụng giá:</span> {
                                    priceType === 'discount' ? 'Khuyến mãi' :
                                    priceType === 'group' ? 'Nhóm' : 'Cơ bản'
                                }
                            </p>
                            <p className="text-gray-600 dark:text-gray-300 text-sm">
                                {t('booking.totalPrice')}: <span className="font-bold text-primary text-lg">{totalPrice.toLocaleString()} VND</span>
                            </p>
                        </div>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300">
                            {t('booking.name')} *
                        </label>
                        <input
                            name="fullName"
                            type="text"
                            value={form.fullName}
                            onChange={handleChange}
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                                errors.fullName ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder={t('booking.namePlaceholder')}
                            disabled={isLoading}
                        />
                        {errors.fullName && (
                            <p className="mt-1 text-sm text-red-500">{errors.fullName}</p>
                        )}
                    </div>

                    <div>
                        <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300">
                            {t('booking.email')} *
                        </label>
                        <input
                            name="email"
                            type="email"
                            value={form.email}
                            onChange={handleChange}
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                                errors.email ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder={t('booking.emailPlaceholder')}
                            disabled={isLoading}
                        />
                        {errors.email && (
                            <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                        )}
                    </div>

                    <div>
                        <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300">
                            {t('booking.phone')} *
                        </label>
                        <input
                            name="phone"
                            type="tel"
                            value={form.phone}
                            onChange={handleChange}
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                                errors.phone ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder={t('booking.phonePlaceholder')}
                            disabled={isLoading}
                        />
                        {errors.phone && (
                            <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
                        )}
                    </div>

                    <div>
                        <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300">
                            {t('booking.date')} *
                        </label>
                        <input
                            name="travelDate"
                            type="date"
                            value={form.travelDate}
                            onChange={handleChange}
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                                errors.travelDate ? 'border-red-500' : 'border-gray-300'
                            }`}
                            disabled={isLoading}
                        />
                        {errors.travelDate && (
                            <p className="mt-1 text-sm text-red-500">{errors.travelDate}</p>
                        )}
                    </div>

                    <div>
                        <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300">
                            {t('booking.people')} *
                        </label>
                        <input
                            name="numberOfPeople"
                            type="number"
                            min="1"
                            max="20"
                            value={form.numberOfPeople}
                            onChange={handleChange}
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                                errors.numberOfPeople ? 'border-red-500' : 'border-gray-300'
                            }`}
                            disabled={isLoading}
                        />
                        {errors.numberOfPeople && (
                            <p className="mt-1 text-sm text-red-500">{errors.numberOfPeople}</p>
                        )}
                    </div>

                    <div>
                        <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300">
                            {t('booking.note')}
                        </label>
                        <textarea
                            name="note"
                            value={form.note}
                            onChange={handleChange}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                            placeholder={t('booking.notePlaceholder')}
                            disabled={isLoading}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-gradient-to-r from-primary to-accent text-white font-semibold py-3 rounded-lg hover:from-accent hover:to-primary transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                        {isLoading ? (
                            <>
                                <LoadingSpinner type="ring" size={20} color="#ffffff" />
                                <span className="ml-2">{t('booking.processing')}</span>
                            </>
                        ) : (
                            t('booking.submit')
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}