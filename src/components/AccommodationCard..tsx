// AccommodationCard.tsx
import { Link } from "react-router-dom";
import ReactStars from 'react-rating-stars-component'
import { HiOutlineMapPin } from "react-icons/hi2";
import { MdArrowRightAlt } from "react-icons/md";
// import { formatPrice } from "../utils/format"; // tuỳ chỗ bạn import
import { Accommodation } from "@/types/AccommodationType"; // interface bạn sẽ định nghĩa
import { useTranslation } from "react-i18next";

interface AccommodationCardProps {
    stay: Accommodation;
    resolveStayImage: (path: string) => string;
}

export default function AccommodationCard({
    stay,
    resolveStayImage,
}: AccommodationCardProps) {
    const { t } = useTranslation()
    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow flex flex-col items-center">
            <img
                src={resolveStayImage(stay.images[0])}
                alt={stay.name}
                className="w-full h-40 object-cover rounded"
            />
            <div className="p-5 w-full">
                <div className="text-xl font-semibold mb-2">{stay.name}</div>
                <ReactStars
                    count={5}
                    value={Number(stay.rating) || 0}
                    size={24}
                    isHalf={true}
                    edit={false}
                    activeColor="#ffd700"
                />
                <div className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                    {stay.description}
                </div>
                <div className="font-semibold text-blue-600 mb-2">
                    Giá từ:
                    {/* {formatPrice(Number(stay.price_per_night), "VND")} */}
                </div>
                <div className="flex items-center justify-between border-t border-solid border-[#e2dFEB] p-[10px_0] mt-[20px]">
                    <div className="flex justify-center items-center gap-1">
                        <HiOutlineMapPin />
                        <span>{t("vehicle.location")}</span>
                    </div>

                    <Link
                        to={`/stay/${stay.id}`}
                        className="flex items-center gap-1 rounded-full hover:text-blue-400 transition-colors"
                    >
                        Explore
                        <MdArrowRightAlt />
                    </Link>
                </div>
            </div>
        </div>
    );
}
