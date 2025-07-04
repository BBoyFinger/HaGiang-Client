import { useEffect, useState } from "react";
import { fetchDestinations, Destination } from "@/api/destinations";
import { Link } from "react-router-dom";
import { motion } from "framer-motion"
import { FiSearch, FiUsers, FiMapPin, FiStar, FiClock, FiHeart } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import DestinationCard from "@/components/DestinationCard";
import HeroCarousel from "@/components/HeroCarousel";
import image1 from "@/assets/1.jpg";
import { tours } from "@/data/tours";
import TourCard from "@/components/TourCard";
import logo from "@/assets/logo.jpg";
import { FaHandHoldingHeart, FaHandsHelping, FaMountain, FaRegHandshake, FaArrowRight, FaUsers, FaStar, FaClock, FaMapMarkerAlt, FaHeart, FaEye } from "react-icons/fa";
import { Helmet } from 'react-helmet-async';

export default function Home() {
  const { t } = useTranslation();

  const destinations = [
    {
      id: 1,
      name: "Sông Nho Quế",
      image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
      shortDescription: "Trekking ven sông, ngắm cảnh quan hùng vĩ, thăm bản làng truyền thống.",
      priceFrom: 1800000,
      detail: {
        fullDescription: `Trekking khám phá Sông Nho Quế ở Hà Giang là một trải nghiệm tuyệt vời cho những ai yêu thích khám phá thiên nhiên và văn hóa địa phương. Trên hành trình trekking này, bạn sẽ được tham gia vào các hoạt động như đi bộ ven sông, ngắm nhìn cảnh quan hùng vĩ của dòng sông Nho Quế, cảm nhận hơi thở của thiên nhiên hoang sơ và yên bình. Ngoài ra, bạn cũng sẽ có cơ hội thăm quan các bản làng truyền thống ở gần đó, tìm hiểu văn hóa, phong tục của người dân địa phương và thưởng thức những món ăn ngon đặc sản của vùng miền. Đây sẽ là cơ hội tuyệt vời để kết nối với thiên nhiên và con người, đồng thời tận hưởng những khoảnh khắc bình yên và thư giãn giữa không gian tự nhiên tuyệt đẹp của Hà Giang.`
      }
    },
    {
      id: 2,
      name: "Vách Đá Trắng / Mã Pì Lèng",
      image: "https://images.unsplash.com/photo-1464983953574-0892a716854b",
      shortDescription: "Chinh phục vách đá trắng, Mã Pì Lèng, ngắm toàn cảnh thung lũng.",
      priceFrom: 1800000,
      detail: {
        fullDescription: `Vách Đá Trắng được biết đến với khung cảnh hùng vĩ, đáng kinh ngạc với độ dốc lên đến hàng trăm mét và dòng sông Nho Quế xanh biếc chảy quanh núi đá. Trên hành trình trekking này, du khách sẽ được chìm đắm trong không gian hùng vĩ của vách đá cao vút, ngắm nhìn cảnh quan đẹp như tranh vẽ và thách thức bản thân với địa hình đồi núi hiểm trở. Điều đặc biệt là từ đỉnh vách đá, du khách sẽ có cơ hội ngắm nhìn toàn cảnh hùng vĩ của thung lũng Mã Pì Lèng, nơi được ví như "Grand Canyon của Việt Nam".`
      }
    },
    {
      id: 3,
      name: "Hang Tả Lủng / Hố Sụt Sủng Là",
      image: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429",
      shortDescription: "Khám phá hang động kỳ bí, hệ thống đá và thạch nhũ độc đáo.",
      priceFrom: 1800000,
      detail: {
        fullDescription: `Chuyến đi khám phá hang động tại Hà Giang sẽ mang đến cho bạn những trải nghiệm đầy kỳ diệu và hấp dẫn. Hang động ẩn chứa những hệ thống đá và hình thạch độc đáo, tạo nên một không gian kỳ bí và huyền bí. Hang Mây thuộc xã Tả Lủng – Huyện Đồng Văn, nằm cạnh tuyến đường nối huyện Đồng Văn và huyện Mèo Vạc. Cửa hang mây có hình dạng tựa búp sen khổng lồ. Những tia nắng mặt trời chiếu qua cửa hang gặp hơi nước bốc lên tạo thành làn sương huyền ảo. Hố sụt là một hiện tượng tương tác tự nhiên, và có những nguyên nhân khác nhau. Hãy để hướng dẫn viên dẫn dắt bạn khám phá bí ẩn của hang động, cùng tìm hiểu về lịch sử và địa chất đặc biệt của địa điểm.`
      }
    },
    {
      id: 4,
      name: "Tour Luxury 4 ngày 3 đêm",
      image: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308",
      shortDescription: "Khám phá cao nguyên đá Đồng Văn, trải nghiệm dịch vụ cao cấp.",
      priceFrom: 400,
      currency: "EUR",
      detail: {
        fullDescription: `TOUR NAME: KHÁM PHÁ CAO NGUYÊN ĐÁ ĐỒNG VĂN\nGIÁ TRỌN GÓI : 400 EUR/ 1 SLOT\nTỐI THIỂU : 2 NGƯỜI\n\nLỊCH TRÌNH VÀ NỘI DUNG :\n- Khám phá sông Nho Quế - vách đá trắng – Mã Pì Lèng\n- Thưởng thức đặc sản vùng cao, đảm bảo vệ sinh, nguyên liệu tươi ngon\n- Thăm các bản làng H'Mong, giao lưu với người bản địa\n- Trekking ngắm núi và rừng nguyên sinh\n- Khám phá hang động nguyên sơ\n- Nấu ăn ngoài trời theo set menu Á-Âu bởi top chef Việt Nam\n- HDV: Tiếng anh chuyên nghiệp\n- Phương tiện đi lại cần thiết\n- Đồ bảo hộ\n- Nước uống đầy đủ trong hành trình`
      }
    }
  ];
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = () => setIsDark(!isDark);

  return (
    <>
      <Helmet>
        <title>{t('home.title')}</title>
        <meta name="description" content={t('home.description')} />
        <meta property="og:title" content={t('home.title')} />
        <meta property="og:description" content={t('home.description')} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://hagiangtravel.vn/" />
        <meta property="og:image" content="https://hagiangtravel.vn/og-image.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={t('home.title')} />
        <meta name="twitter:description" content={t('home.description')} />
        <meta name="twitter:image" content="https://hagiangtravel.vn/og-image.jpg" />
      </Helmet>

      <div className="bg-gradient-to-br from-gray-50 via-white to-purple-50">
        {/* Hero Section */}
        <section className="h-screen relative">
          <HeroCarousel isDark={isDark} />
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaUsers className="text-white text-2xl" />
                </div>
                <h3 className="text-3xl font-bold text-gray-800 mb-2">500+</h3>
                <p className="text-gray-600">Khách hàng hài lòng</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaStar className="text-white text-2xl" />
                </div>
                <h3 className="text-3xl font-bold text-gray-800 mb-2">4.8</h3>
                <p className="text-gray-600">Đánh giá trung bình</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaClock className="text-white text-2xl" />
                </div>
                <h3 className="text-3xl font-bold text-gray-800 mb-2">24/7</h3>
                <p className="text-gray-600">Hỗ trợ khách hàng</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaMapMarkerAlt className="text-white text-2xl" />
                </div>
                <h3 className="text-3xl font-bold text-gray-800 mb-2">50+</h3>
                <p className="text-gray-600">Điểm đến khám phá</p>
              </div>
            </div>
          </div>
        </section>

        {/* Brand Section */}
        <section className="py-20 bg-gradient-to-r from-purple-600 to-pink-600">
          <div className="max-w-7xl mx-auto px-4">
            <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12">
              <div className="flex flex-col lg:flex-row items-center gap-12">
                {/* Left: Logo */}
                <div className="flex-shrink-0">
                  <div className="relative">
                    <img src={logo} alt="Homie Travel" className="w-32 h-32 rounded-full object-cover shadow-lg" />
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <FaHeart className="text-white text-sm" />
                    </div>
                  </div>
                </div>
                
                {/* Right: Info */}
                <div className="flex-1 text-center lg:text-left">
                  <h2 className="text-3xl font-bold text-gray-800 mb-8">Tại Sao Chọn Homie Travel?</h2>
                  <div className="space-y-6">
                    <div className="flex items-center justify-center lg:justify-start gap-4">
                      <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                        <FaHandHoldingHeart className="text-red-500 text-xl" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">{t('brand.charity')}</h3>
                        <p className="text-gray-600">Cam kết đóng góp cho cộng đồng địa phương</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-center lg:justify-start gap-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <FaRegHandshake className="text-blue-500 text-xl" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">{t('brand.professional')}</h3>
                        <p className="text-gray-600">Đội ngũ hướng dẫn viên chuyên nghiệp</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-center lg:justify-start gap-4">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                        <FaMountain className="text-green-600 text-xl" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">{t('brand.experience')}</h3>
                        <p className="text-gray-600">Kinh nghiệm 10+ năm trong lĩnh vực du lịch</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Tours Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-800 mb-4">Tour Nổi Bật</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Khám phá những tour du lịch Hà Giang được yêu thích nhất với trải nghiệm độc đáo và dịch vụ chất lượng cao
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {tours.slice(0, 3).map((tour) => (
                <motion.div
                  key={tour.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                >
                  <TourCard tour={tour} />
                </motion.div>
              ))}
            </div>
            <div className="text-center mt-12">
              <Link
                to="/tour"
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Xem tất cả tour
                <FaArrowRight className="ml-2" />
              </Link>
            </div>
          </div>
        </section>

        {/* Featured Destinations Section */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-800 mb-4">
                {t("home.featuredDestinations")}
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Khám phá những điểm đến tuyệt đẹp tại Hà Giang với cảnh quan thiên nhiên hùng vĩ và văn hóa độc đáo
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
              {destinations.slice(0, 4).map((destination, index) => (
                <motion.div
                  key={destination.id}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <DestinationCard destination={destination} isDark={isDark} />
                </motion.div>
              ))}
            </div>
            <div className="text-center mt-12">
              <Link
                to="/destinations"
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Khám phá tất cả điểm đến
                <FaArrowRight className="ml-2" />
              </Link>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                <h2 className="text-4xl font-bold text-gray-800 mb-6">
                  {t("home.about.title")}
                </h2>
                <p className="text-lg leading-relaxed mb-6 text-gray-600">
                  {t("home.about.description1")}
                </p>
                <p className="text-lg leading-relaxed mb-8 text-gray-600">
                  {t("home.about.description2")}
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    to="/about"
                    className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    {t("home.about.learnMore")}
                    <FaArrowRight className="ml-2" />
                  </Link>
                  <Link
                    to="/contact"
                    className="inline-flex items-center justify-center px-8 py-4 border-2 border-purple-600 text-purple-600 font-semibold rounded-xl hover:bg-purple-600 hover:text-white transition-all duration-300"
                  >
                    Liên hệ ngay
                  </Link>
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="relative"
              >
                <img
                  src={image1}
                  alt="Ha Giang Landscape"
                  className="rounded-2xl shadow-2xl w-full h-96 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl"></div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-purple-600 to-pink-600">
          <div className="max-w-4xl mx-auto text-center px-4">
            <h2 className="text-4xl font-bold text-white mb-6">
              Sẵn sàng khám phá Hà Giang?
            </h2>
            <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
              Hãy để chúng tôi giúp bạn tạo ra những kỷ niệm đáng nhớ tại vùng đất địa đầu Tổ quốc
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/tour"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-purple-600 font-semibold rounded-xl hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Xem tour ngay
                <FaArrowRight className="ml-2" />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-purple-600 transition-all duration-300"
              >
                Tư vấn miễn phí
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}