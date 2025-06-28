import { Vehicle } from "@/types/VehicleType";
import { useState } from "react";
import { vehicles } from "@/data/vehicles";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { MdAccessTime, MdArrowRightAlt } from "react-icons/md";
import { GoPeople } from "react-icons/go";
import { Link } from "react-router-dom";
import { HiOutlineMapPin } from "react-icons/hi2";
import { motion } from "framer-motion";

export default function VehicleCard({ vehicle }: { vehicle: Vehicle }) {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedVehicleType, setSelectedVehicleType] = useState(vehicles[0].slug);


    const handleBook = (slug: string) => {
        setSelectedVehicleType(slug);
        setModalOpen(true);
    };

    const handleDetail = (slug: string) => {
        navigate(`/rent/${slug}`);
    };


    return (
        <>
            <motion.div whileHover={{ scale: 1.03 }} key={vehicle.id} className="bg-white dark:bg-gray-800 rounded-lg shadow flex flex-col items-center">
                <img src={vehicle.image} alt={vehicle.name} className="w-full h-40 object-cover rounded" />
                <div className="p-5">
                    <div className="text-xl font-semibold mb-2">{vehicle.name}</div>
                    <div className="text-gray-600 dark:text-gray-300 text-sm mb-2">{vehicle.shortSpecs}</div>
                    <div className="text-gray-700 dark:text-gray-200 text-sm mb-4">{vehicle.description}</div>
                    <div className="flex items-center justify-between border-t border-solid border-[#e2dFEB] p-[10px_0] mt-[20px]">
                        <div className="flex justify-center items-center gap-1">
                            <HiOutlineMapPin />
                            <span>{t("vehicle.location")}</span>
                        </div>

                        <Link
                            to={`/tours/${vehicle.slug}`}
                            className="flex items-center gap-1 rounded-full hover:text-blue-400 transition-colors"
                        >
                            Explore
                            <MdArrowRightAlt />
                        </Link>
                    </div>

                </div>
            </motion.div>
        </>
    )
}