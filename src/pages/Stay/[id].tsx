import { useParams } from "react-router-dom";
import { stays } from "@/data/stays";
import { useTranslation } from "react-i18next";

export default function StayDetail() {
    const { id } = useParams();
    const { t } = useTranslation();

    // Tìm stay theo id
    const stay = stays.find((item) => item.id === id);

    if (!stay) {
        return <div>{t("stay.notFound", "Không tìm thấy chỗ ở này.")}</div>;
    }

    return (
        <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow mt-8">
            <img src={stay.images[0]} alt={stay.name} className="w-full h-64 object-cover rounded mb-4" />
            <h1 className="text-2xl font-bold mb-2">{stay.name}</h1>
            <div className="text-gray-600 mb-2">{stay.address}, {stay.city}, {stay.country}</div>
            <div className="text-gray-700 mb-4">{stay.description}</div>
            <div className="flex gap-4 mb-4">
                <span>{t("stay.price", "Giá")}: {stay.price_per_night} VND</span>
                <span>{t("stay.rating", "Đánh giá")}: {stay.rating}/5</span>
                <span>{t("stay.star", "Sao")}: {stay.star_rating}</span>
            </div>
            <div className="mb-2">{t("stay.phone", "SĐT")}: {stay.phone}</div>
            <div className="mb-2">{t("stay.email", "Email")}: {stay.email}</div>
            <div className="mb-2">{t("stay.website", "Website")}: <a href={stay.website_url} className="text-blue-500 underline" target="_blank" rel="noopener noreferrer">{stay.website_url}</a></div>
        </div>
    );
}
