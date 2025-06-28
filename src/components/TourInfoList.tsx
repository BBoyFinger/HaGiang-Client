import { TourInfoListProps } from "@/types/TourInfoList";
import { MdOutlinePriceChange, MdOutlineLocationOn, MdOutlineAccessTime, MdOutlineSchedule, MdOutlineCategory, MdOutlineGroup, MdOutlineRoute, MdOutlineTrendingUp } from "react-icons/md";



export default function TourInfoList({ tour }: TourInfoListProps) {
    const toursInfoItem = [
        {
            id: 1,
            icon: <MdOutlinePriceChange className="w-6 h-6 text-blue-600" />,
            name: "Price From",
            description: tour?.price?.perSlot ? `${tour.price.perSlot.toLocaleString('vi-VN')} ${tour.price.currency}` : "Liên hệ"
        },
        {
            id: 2,
            icon: <MdOutlineLocationOn className="w-6 h-6 text-green-600" />,
            name: "Departure",
            description: tour?.departure || "Ha Giang"
        },
        {
            id: 3,
            icon: <MdOutlineAccessTime className="w-6 h-6 text-orange-600" />,
            name: "Duration",
            description: tour?.duration || "1-4 days"
        },
        {
            id: 4,
            icon: <MdOutlineSchedule className="w-6 h-6 text-purple-600" />,
            name: "Schedule",
            description: tour?.schedule || "Daily"
        },
        {
            id: 5,
            icon: <MdOutlineCategory className="w-6 h-6 text-red-600" />,
            name: "Type of tour",
            description: tour?.type || "Adventure"
        },
        {
            id: 6,
            icon: <MdOutlineGroup className="w-6 h-6 text-indigo-600" />,
            name: "Group size",
            description: tour?.groupSize || "2-8 people"
        },
        {
            id: 7,
            icon: <MdOutlineRoute className="w-6 h-6 text-pink-600" />,
            name: "Route length",
            description: tour?.routeLength || "5-15km"
        },
        {
            id: 8,
            icon: <MdOutlineTrendingUp className="w-6 h-6 text-teal-600" />,
            name: "Difficulty",
            description: tour?.difficulty || "Easy"
        },
    ]

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 p-6 rounded-lg">
            {toursInfoItem.map((item) => (
                <div key={item.id} className="flex flex-col items-center text-center p-3 hover:bg-gray-50 rounded-lg transition-colors">
                    <div className="mb-2 p-2 bg-gray-100 rounded-full">
                        {item.icon}
                    </div>
                    <div className="flex flex-col">
                        <h4 className="text-xs text-gray-500 mb-1 font-medium uppercase tracking-wide">
                            {item.name}
                        </h4>
                        <span className="text-sm font-bold text-gray-800">
                            {item.description}
                        </span>
                    </div>
                </div>
            ))}
        </div>
    )
}   