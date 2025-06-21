import { useEffect, useState } from "react";
import { fetchDestinations, Destination } from "@/api/destinations";
import { Link } from "react-router-dom";
import { motion } from "framer-motion"
import { FiSearch } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import DestinationCard from "@/components/DestinationCard";
import HeroCarousel from "@/components/HeroCarousel";
import image1 from "@/assets/1.jpg";
import { tours } from "@/data/tours";
import TourCard from "@/components/TourCard";

export default function Home() {
  const { t } = useTranslation();

  // const [destinations, setDestinations] = useState<Destination[]>([]);
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

  // useEffect(() => {
  //   fetchDestinations().then(setDestinations);
  // }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="h-screen">
        <HeroCarousel isDark={isDark} />
      </section>

      {/* Featured Tours Section */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold mb-8 text-center">Tour nổi bật</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tours.slice(0, 3).map((tour) => (
              <TourCard key={tour.id} tour={tour} />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Destinations Section */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <h2 className={`text-3xl font-bold mb-8 text-center ${isDark ? "text-white" : "text-gray-800"}`}>
            {t("home.featuredDestinations")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {destinations.map((destination) => (
              <DestinationCard key={destination.id} destination={destination} isDark={isDark} />
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className={`py-16 ${isDark ? "bg-gray-800" : "bg-gray-50"}`}>
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className={`text-3xl font-bold mb-6 ${isDark ? "text-white" : "text-gray-800"}`}>
                {t("home.about.title")}
              </h2>
              <p className={`text-lg leading-relaxed mb-6 ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                {t("home.about.description1")}
              </p>
              <p className={`text-lg leading-relaxed mb-8 ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                {t("home.about.description2")}
              </p>
              <Link
                to="/about"
                className={`inline-block px-8 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors ${isDark ? "hover:bg-blue-400" : ""}`}
              >
                {t("home.about.learnMore")}
              </Link>
            </div>
            <div className="relative">
              <img
                src={image1}
                alt="Ha Giang Landscape"
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}