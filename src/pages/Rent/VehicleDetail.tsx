import { useParams, useNavigate } from 'react-router-dom';
import { vehicles } from '@/data/vehicles';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaMotorcycle, FaGasPump, FaCog, FaShieldAlt, FaStar, FaMapMarkerAlt, FaClock, FaUsers, FaCheckCircle, FaPhone, FaWhatsapp } from 'react-icons/fa';
import { Helmet } from 'react-helmet-async';

export default function VehicleDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const vehicle = vehicles.find((v) => v.slug === slug);

  if (!vehicle) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-6xl mb-4">🏍️</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Không tìm thấy xe</h1>
          <p className="text-gray-600 mb-6">Xe bạn đang tìm kiếm không tồn tại hoặc đã được di chuyển.</p>
          <button 
            onClick={() => navigate('/rent')}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300"
          >
            Xem tất cả xe
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{vehicle.name} - Chi tiết xe thuê | Homie Travel</title>
        <meta name="description" content={vehicle.shortSpecs} />
      </Helmet>

      <div className="min-h-screen bg-light">
        {/* Hero Section */}
        <section className="relative h-96 md:h-[500px] overflow-hidden">
          <img 
            src={vehicle.image} 
            alt={vehicle.name} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          
          {/* Back Button */}
          <button 
            onClick={() => navigate(-1)}
            className="absolute top-6 left-6 z-10 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300"
          >
            <FaArrowLeft />
          </button>

          {/* Hero Content */}
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
            <div className="max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h1 className="text-3xl font-bold text-[#1a1a1a] mb-4">
                  {vehicle.name}
                </h1>
                <div className="flex items-center gap-4 mb-6">
                  
                </div>
                <p className="text-lg md:text-xl text-white/90 mb-6 max-w-2xl">
                  {vehicle.shortSpecs}
                </p>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                    <FaMotorcycle className="text-white" />
                    <span className="text-white font-medium">Xe máy</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                    <FaStar className="text-yellow-400" />
                    <span className="text-white font-medium">4.8/5</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-16">
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Main Content */}
              <div className="lg:col-span-2">
                {/* Description */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="bg-white rounded-2xl shadow-lg p-8 mb-8"
                >
                  <h2 className="text-2xl font-bold text-[#1a1a1a] mb-6">Mô tả chi tiết</h2>
                  <div className="prose max-w-none text-[#555]" dangerouslySetInnerHTML={{ __html: vehicle.description }} />
                </motion.div>

                {/* Specifications */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="bg-white rounded-2xl shadow-lg p-8 mb-8"
                >
                  <h2 className="text-2xl font-bold text-[#1a1a1a] mb-6">Thông số kỹ thuật</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <FaMotorcycle className="text-blue-600 text-xl" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-[#1a1a1a]">Loại xe</h3>
                        <p className="text-[#555]">Xe máy</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                        <FaGasPump className="text-green-600 text-xl" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-[#1a1a1a]">Nhiên liệu</h3>
                        <p className="text-[#555]">Xăng</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                      <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                        <FaCog className="text-purple-600 text-xl" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-[#1a1a1a]">Truyền động</h3>
                        <p className="text-[#555]">Tự động</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                      <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                        <FaUsers className="text-orange-600 text-xl" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-[#1a1a1a]">Sức chứa</h3>
                        <p className="text-[#555]">2 người</p>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Features */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="bg-white rounded-2xl shadow-lg p-8"
                >
                  <h2 className="text-2xl font-bold text-[#1a1a1a] mb-6">Tính năng & Dịch vụ</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      'Bảo hiểm đầy đủ',
                      'Hỗ trợ 24/7',
                      'Giao xe tận nơi',
                      'Hướng dẫn sử dụng',
                      'Bảo dưỡng định kỳ',
                      'Thiết bị an toàn',
                      'Bản đồ du lịch',
                      'Tư vấn lộ trình'
                    ].map((feature, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <FaCheckCircle className="text-green-500 flex-shrink-0" />
                        <span className="text-[#555]">{feature}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>

              {/* Right Column - Sidebar */}
              <div className="lg:col-span-1">
                {/* Pricing Card */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="bg-white rounded-2xl shadow-lg p-6 mb-6 sticky top-6"
                >
                  <h3 className="text-xl font-bold text-[#1a1a1a] mb-4">Giá thuê</h3>
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-[#555]">1 ngày</span>
                      <span className="font-semibold text-[#1a1a1a]">500.000 VNĐ</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-[#555]">1 tuần</span>
                      <span className="font-semibold text-[#1a1a1a]">3.000.000 VNĐ</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg border-2 border-purple-200">
                      <span className="text-purple-800 font-medium">1 tháng</span>
                      <span className="font-bold text-purple-800">10.000.000 VNĐ</span>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <button className="w-full bg-gradient-to-r from-primary to-accent text-[#1a1a1a] font-semibold py-3 rounded-xl hover:from-primary/80 hover:to-accent/80 transition-all duration-300 flex items-center justify-center gap-2">
                      <FaPhone />
                      Đặt xe ngay
                    </button>
                    <button className="w-full bg-green-500 text-white font-semibold py-3 rounded-xl hover:bg-green-600 transition-all duration-300 flex items-center justify-center gap-2">
                      <FaWhatsapp />
                      Chat WhatsApp
                    </button>
                  </div>
                </motion.div>

                {/* Contact Info */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className="bg-gradient-to-r from-primary to-accent rounded-2xl shadow-lg p-6 text-white"
                >
                  <h3 className="text-xl font-bold mb-4">Liên hệ thuê xe</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <FaPhone className="text-purple-200" />
                      <span>+84 123 456 789</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <FaMapMarkerAlt className="text-purple-200" />
                      <span>Hà Giang, Việt Nam</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <FaClock className="text-purple-200" />
                      <span>24/7 - Hỗ trợ khách hàng</span>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-primary to-accent">
          <div className="max-w-4xl mx-auto text-center px-4">
            <h2 className="text-3xl font-bold text-white mb-4">
              Sẵn sàng khám phá Hà Giang?
            </h2>
            <p className="text-xl text-purple-100 mb-8">
              Thuê xe ngay hôm nay và bắt đầu hành trình khám phá vùng đất địa đầu Tổ quốc
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-4 bg-white text-primary font-semibold rounded-xl hover:bg-gray-100 transition-all duration-300">
                Xem tất cả xe
              </button>
              <button className="px-8 py-4 border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-primary transition-all duration-300">
                Tư vấn miễn phí
              </button>
            </div>
          </div>
        </section>
      </div>
    </>
  );
} 