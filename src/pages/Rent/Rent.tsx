import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { vehicles } from "@/data/vehicles";
import ModalRentForm from "@/components/ModalRentForm";
import { Helmet } from "react-helmet-async";
import VehicleCard from "@/components/VehicleCard";
import { FaMotorcycle, FaCar, FaBicycle, FaSearch, FaFilter } from 'react-icons/fa';

export default function Rent() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedVehicleType, setSelectedVehicleType] = useState(vehicles[0].slug);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const handleBook = (slug: string) => {
    setSelectedVehicleType(slug);
    setModalOpen(true);
  };

  const handleDetail = (slug: string) => {
    navigate(`/rent/${slug}`);
  };

  // Filter vehicles based on search and category
  const filteredVehicles = vehicles.filter((vehicle: any) => {
    const matchesSearch = vehicle.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || vehicle.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [
    { id: "all", name: "Tất cả", icon: FaMotorcycle },
    { id: "motorcycle", name: "Xe máy", icon: FaMotorcycle },
    { id: "bicycle", name: "Xe đạp", icon: FaBicycle },
  ];

  return (
    <>
      <Helmet>
        <title>{t('rent.title')}</title>
        <meta name="description" content={t('rent.description')} />
        <meta property="og:title" content={t('rent.title')} />
        <meta property="og:description" content={t('rent.description')} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://homieTravel.vn/rent" />
        <meta property="og:image" content="https://homieTravel.vn/og-image.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={t('rent.title')} />
        <meta name="twitter:description" content={t('rent.description')} />
        <meta name="twitter:image" content="https://homieTravel.vn/og-image.jpg" />
      </Helmet>

      {/* Hero Section */}
      <section className="relative h-80 bg-gradient-to-r from-blue-600 to-purple-600 overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-40"></div>
        <div className="relative z-10 flex items-center justify-center h-full">
          <div className="text-center text-white">
            <h1 className="text-5xl font-bold mb-4">{t('rent.title')}</h1>
            <p className="text-xl max-w-2xl mx-auto px-4">
              Thuê phương tiện di chuyển tại Hà Giang - Khám phá vùng đất hoang dã một cách tự do
            </p>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent"></div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-8 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Search Bar */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Tìm kiếm phương tiện..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                />
              </div>

              {/* Category Filter */}
              <div className="flex items-center space-x-4">
                <div className="flex items-center text-gray-600">
                  <FaFilter className="mr-2" />
                  <span className="font-medium">Loại xe:</span>
                </div>
                <div className="flex space-x-2">
                  {categories.map((category) => {
                    const Icon = category.icon;
                    return (
                      <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.id)}
                        className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${selectedCategory === category.id
                            ? 'bg-blue-600 text-white shadow-lg'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                      >
                        <Icon className="mr-2" />
                        {category.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vehicles Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Phương Tiện Có Sẵn</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Chọn phương tiện phù hợp để khám phá Hà Giang một cách thuận tiện và an toàn
            </p>
          </div>

          {/* Results Count */}
          <div className="mb-8">
            <p className="text-gray-600">
              Tìm thấy <span className="font-semibold text-blue-600">{filteredVehicles.length}</span> phương tiện
            </p>
          </div>

          {/* Vehicles Grid */}
          {filteredVehicles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredVehicles.map((vehicle) => (
                <div key={vehicle.slug} className="group">
                  <VehicleCard
                    vehicle={vehicle}
                    onBook={() => handleBook(vehicle.slug)}
                    onDetail={() => handleDetail(vehicle.slug)}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaSearch className="text-3xl text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Không tìm thấy phương tiện</h3>
              <p className="text-gray-600 mb-6">
                Hãy thử thay đổi từ khóa tìm kiếm hoặc loại phương tiện
              </p>
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("all");
                }}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Xóa bộ lọc
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Tại Sao Chọn Thuê Xe Tại Homie Travel?</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Chúng tôi cam kết mang đến dịch vụ thuê xe chất lượng cao với giá cả hợp lý
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaMotorcycle className="text-2xl text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Đa Dạng Phương Tiện</h3>
              <p className="text-gray-600">
                Từ xe máy, ô tô đến xe đạp, chúng tôi có đầy đủ các loại phương tiện phù hợp với nhu cầu của bạn
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaSearch className="text-2xl text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Chất Lượng Đảm Bảo</h3>
              <p className="text-gray-600">
                Tất cả phương tiện đều được kiểm tra kỹ lưỡng, đảm bảo an toàn và vận hành tốt
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaCar className="text-2xl text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Giá Cả Hợp Lý</h3>
              <p className="text-gray-600">
                Giá thuê cạnh tranh, minh bạch, không phát sinh chi phí ẩn
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl font-bold text-white mb-4">Sẵn Sàng Khám Phá Hà Giang?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Hãy chọn phương tiện phù hợp và bắt đầu hành trình khám phá vùng đất hoang dã
          </p>
          <button
            onClick={() => setModalOpen(true)}
            className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Đặt Thuê Ngay
          </button>
        </div>
      </section>

      <ModalRentForm open={modalOpen} onClose={() => setModalOpen(false)} selectedVehicleType={selectedVehicleType} />
    </>
  );
}