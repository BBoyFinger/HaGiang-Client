import { useParams, useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";
import { tours } from "@/data/tours";
import type { Tour } from "@/types/TourType";
import ReactStars from 'react-rating-stars-component';
import TourRatingForm from '@/components/TourRatingForm';
import TourInfoList from "@/components/TourInfoList";
import { motion } from "framer-motion";
import { FiShare2, FiMessageSquare, FiFacebook, FiTwitter, FiInstagram, FiMail, FiChevronDown, FiChevronUp, FiCheck, FiX, FiArrowLeft, FiHeart, FiMapPin, FiClock, FiUsers, FiStar } from "react-icons/fi";
import { FaHeart } from "react-icons/fa";
import { Helmet } from 'react-helmet-async';

const typeLabel: Record<Tour["type"], string> = {
  trekking: "Tour Trekking",
  luxury: "Tour Luxury",
  hang_dong: "Tour Hang Động",
  song: "Tour Sông",
  nui: "Tour Núi"
};

export default function TourDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const tour = useMemo(() => tours.find((t) => t.slug === slug), [slug]);
  const [ratings, setRatings] = useState<{ rating: number, comment: string }[]>([]);
  const [showShareDropdown, setShowShareDropdown] = useState(false);
  const [showSchedule, setShowSchedule] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);

  // New states for review form
  const [reviewForm, setReviewForm] = useState({
    name: '',
    email: '',
    comment: '',
    locationRating: 0,
    servicesRating: 0
  });
  const [comments, setComments] = useState<Array<{
    id: string;
    name: string;
    email: string;
    comment: string;
    locationRating: number;
    servicesRating: number;
    date: Date;
    replies: Array<{
      id: string;
      name: string;
      comment: string;
      date: Date;
    }>;
  }>>([]);

  // Calculate average rating
  const averageRating = useMemo(() => {
    if (comments.length === 0) return 0;
    const totalLocation = comments.reduce((sum, comment) => sum + comment.locationRating, 0);
    const totalServices = comments.reduce((sum, comment) => sum + comment.servicesRating, 0);
    return ((totalLocation + totalServices) / (comments.length * 2)).toFixed(1);
  }, [comments]);

  const handlePostComment = () => {
    if (!reviewForm.name || !reviewForm.email || !reviewForm.comment || reviewForm.locationRating === 0 || reviewForm.servicesRating === 0) {
      alert('Vui lòng điền đầy đủ thông tin và đánh giá!');
      return;
    }

    const newComment = {
      id: Date.now().toString(),
      name: reviewForm.name,
      email: reviewForm.email,
      comment: reviewForm.comment,
      locationRating: reviewForm.locationRating,
      servicesRating: reviewForm.servicesRating,
      date: new Date(),
      replies: []
    };

    setComments([newComment, ...comments]);
    setReviewForm({
      name: '',
      email: '',
      comment: '',
      locationRating: 0,
      servicesRating: 0
    });
  };

  if (!tour) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-6xl mb-4">🏔️</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Không tìm thấy tour</h1>
          <p className="text-gray-600 mb-6">Tour bạn đang tìm kiếm không tồn tại hoặc đã được di chuyển.</p>
          <button 
            onClick={() => navigate('/tour')}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300"
          >
            Xem tất cả tour
          </button>
        </div>
      </div>
    );
  }

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const text = `Check out this amazing tour: ${tour.name}`;

    switch (platform) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`, '_blank');
        break;
      case 'instagram':
        navigator.clipboard.writeText(`${text} ${url}`);
        alert('Link copied to clipboard!');
        break;
      case 'email':
        window.open(`mailto:?subject=${encodeURIComponent(tour.name)}&body=${encodeURIComponent(`${text} ${url}`)}`, '_blank');
        break;
    }
    setShowShareDropdown(false);
  };

  const scrollToReviews = () => {
    const reviewsSection = document.getElementById('reviews-section');
    if (reviewsSection) {
      reviewsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Mock schedule data
  const scheduleData = [
    {
      day: 1,
      title: "Ngày 1: Khởi hành từ Hà Giang",
      activities: [
        "08:00 - Đón khách tại điểm hẹn",
        "09:00 - Khởi hành đến Sông Nho Quế",
        "11:00 - Dừng chân ngắm cảnh và chụp ảnh",
        "12:00 - Ăn trưa tại nhà hàng địa phương",
        "14:00 - Trekking ven sông",
        "17:00 - Check-in homestay",
        "18:00 - Ăn tối và giao lưu văn hóa"
      ]
    },
    {
      day: 2,
      title: "Ngày 2: Khám phá Vách Đá Trắng",
      activities: [
        "07:00 - Ăn sáng",
        "08:00 - Khởi hành đến Vách Đá Trắng",
        "10:00 - Trekking lên đỉnh vách đá",
        "12:00 - Ăn trưa picnic",
        "14:00 - Tiếp tục khám phá Mã Pì Lèng",
        "16:00 - Trở về Hà Giang",
        "18:00 - Kết thúc tour"
      ]
    }
  ];

  return (
    <>
      <Helmet>
        <title>{tour.name} - Chi tiết tour | Homie Travel</title>
        <meta name="description" content={tour.description} />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="relative h-96 md:h-[500px] overflow-hidden">
          <img 
            src={tour.imageUrls[selectedImage] || tour.imageUrls[0]} 
            alt={tour.name} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          
          {/* Back Button */}
          <button 
            onClick={() => navigate(-1)}
            className="absolute top-6 left-6 z-10 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300"
          >
            <FiArrowLeft />
          </button>

          {/* Favorite Button */}
          <button
            onClick={() => setIsFavorite(!isFavorite)}
            className={`absolute top-6 right-6 z-10 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
              isFavorite 
                ? "bg-red-500 text-white" 
                : "bg-white/20 backdrop-blur-sm text-white hover:bg-white/30"
            }`}
          >
            <FaHeart className={`text-lg ${isFavorite ? "fill-current" : "hover:fill-red-500"}`} />
          </button>

          {/* Hero Content */}
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
            <div className="max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
                  {tour.name}
                </h1>
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                    <FiMapPin className="text-white" />
                    <span className="text-white font-medium">
                      {tour.locations.join(" - ")}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                    <FiStar className="text-yellow-400" />
                    <span className="text-white font-medium">{tour.rating}/5</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Image Gallery */}
        {tour.imageUrls.length > 1 && (
          <section className="py-8 bg-white">
            <div className="max-w-6xl mx-auto px-4">
              <div className="flex gap-4 overflow-x-auto pb-4">
                {tour.imageUrls.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                      selectedImage === index 
                        ? "border-purple-500" 
                        : "border-gray-200 hover:border-purple-300"
                    }`}
                  >
                    <img 
                      src={image} 
                      alt={`${tour.name} ${index + 1}`} 
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Main Content */}
        <section className="py-16">
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Main Content */}
              <div className="lg:col-span-2">
                {/* Tour Info */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="bg-white rounded-2xl shadow-lg p-8 mb-8"
                >
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <span className="inline-block px-4 py-2 rounded-full bg-purple-100 text-purple-700 text-sm font-semibold">
                        {typeLabel[tour.type]}
                      </span>
                      <div className="flex items-center gap-2">
                        <ReactStars
                          count={5}
                          value={tour.rating}
                          size={20}
                          isHalf={true}
                          edit={false}
                          activeColor="#ffd700"
                        />
                        <span className="text-sm text-gray-600">{tour.rating.toFixed(1)}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <div className="relative">
                        <button
                          onClick={() => setShowShareDropdown(!showShareDropdown)}
                          className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
                        >
                          <FiShare2 />
                        </button>
                        {showShareDropdown && (
                          <div className="absolute right-0 top-full mt-2 bg-white border rounded-lg shadow-lg z-50 min-w-[200px]">
                            <div className="p-2">
                              <button
                                onClick={() => handleShare('facebook')}
                                className="flex items-center gap-3 w-full px-3 py-2 text-left hover:bg-gray-100 rounded transition-colors"
                              >
                                <FiFacebook className="text-blue-600" />
                                Facebook
                              </button>
                              <button
                                onClick={() => handleShare('twitter')}
                                className="flex items-center gap-3 w-full px-3 py-2 text-left hover:bg-gray-100 rounded transition-colors"
                              >
                                <FiTwitter className="text-blue-400" />
                                Twitter
                              </button>
                              <button
                                onClick={() => handleShare('instagram')}
                                className="flex items-center gap-3 w-full px-3 py-2 text-left hover:bg-gray-100 rounded transition-colors"
                              >
                                <FiInstagram className="text-pink-600" />
                                Instagram
                              </button>
                              <button
                                onClick={() => handleShare('email')}
                                className="flex items-center gap-3 w-full px-3 py-2 text-left hover:bg-gray-100 rounded transition-colors"
                              >
                                <FiMail className="text-gray-600" />
                                Email
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                      <button
                        onClick={scrollToReviews}
                        className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center hover:bg-green-200 transition-colors"
                      >
                        <FiMessageSquare className="text-green-600" />
                      </button>
                    </div>
                  </div>

                  <h2 className="text-2xl font-bold text-gray-800 mb-4">Mô tả tour</h2>
                  <p className="text-gray-600 leading-relaxed mb-6">
                    {tour.description}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <FiMapPin className="text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">Địa điểm</h3>
                        <p className="text-sm text-gray-600">{tour.locations.length} điểm</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <FiClock className="text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">Thời gian</h3>
                        <p className="text-sm text-gray-600">2 ngày 1 đêm</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                      <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                        <FiUsers className="text-purple-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">Nhóm</h3>
                        <p className="text-sm text-gray-600">2-8 người</p>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Tour Schedule */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="bg-white rounded-2xl shadow-lg p-8 mb-8"
                >
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">Lịch trình tour</h2>
                  <button
                    onClick={() => setShowSchedule(!showSchedule)}
                    className="flex w-full justify-between items-center gap-4 p-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300"
                  >
                    <span className="text-xl font-bold">{tour.locations.join(" - ")}</span>
                    {showSchedule ? <FiChevronUp /> : <FiChevronDown />}
                  </button>

                  {showSchedule && (
                    <div className="mt-6 space-y-6">
                      {scheduleData.map((day, index) => (
                        <div key={day.day} className="border border-gray-200 rounded-xl overflow-hidden">
                          <div className="bg-gray-50 p-4 border-b border-gray-200">
                            <h3 className="text-xl font-bold text-purple-600">
                              {day.title}
                            </h3>
                          </div>
                          <div className="p-6">
                            <div className="space-y-4">
                              {day.activities.map((activity, activityIndex) => (
                                <div key={activityIndex} className="flex items-start gap-4">
                                  <div className="w-3 h-3 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                                  <p className="text-gray-700">{activity}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>

                {/* Services */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="bg-white rounded-2xl shadow-lg p-8 mb-8"
                >
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">Dịch vụ đi kèm</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-lg font-semibold mb-4 text-green-600 flex items-center gap-2">
                        <FiCheck className="text-green-600" />
                        Bao gồm
                      </h3>
                      <div className="space-y-3">
                        {tour.includedServices.map((service, index) => (
                          <div key={index} className="flex items-center gap-3">
                            <FiCheck className="text-green-600 flex-shrink-0" />
                            <span className="text-gray-700">{service}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-4 text-red-600 flex items-center gap-2">
                        <FiX className="text-red-600" />
                        Không bao gồm
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <FiX className="text-red-600 flex-shrink-0" />
                          <span className="text-gray-700">Thuế VAT</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <FiX className="text-red-600 flex-shrink-0" />
                          <span className="text-gray-700">Tip cho Hướng dẫn viên</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <FiX className="text-red-600 flex-shrink-0" />
                          <span className="text-gray-700">Ăn uống ngoài chương trình tour</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Reviews Section */}
                <motion.div
                  id="reviews-section"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="bg-white rounded-2xl shadow-lg p-8"
                >
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">Đánh giá ({comments.length})</h2>
                  
                  {/* Review Form */}
                  <div className="bg-gray-50 rounded-xl p-6 mb-8">
                    <h3 className="text-lg font-semibold mb-4 text-gray-800">Viết đánh giá</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <input
                        type="text"
                        placeholder="Tên của bạn"
                        value={reviewForm.name}
                        onChange={(e) => setReviewForm(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                      <input
                        type="email"
                        placeholder="Email của bạn"
                        value={reviewForm.email}
                        onChange={(e) => setReviewForm(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Đánh giá địa điểm</label>
                        <ReactStars
                          count={5}
                          value={reviewForm.locationRating}
                          size={24}
                          isHalf={true}
                          edit={true}
                          activeColor="#ffd700"
                          onChange={(newValue: number) => setReviewForm(prev => ({ ...prev, locationRating: newValue }))}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Đánh giá dịch vụ</label>
                        <ReactStars
                          count={5}
                          value={reviewForm.servicesRating}
                          size={24}
                          isHalf={true}
                          edit={true}
                          activeColor="#ffd700"
                          onChange={(newValue: number) => setReviewForm(prev => ({ ...prev, servicesRating: newValue }))}
                        />
                      </div>
                    </div>
                    <textarea
                      placeholder="Viết bình luận của bạn..."
                      rows={4}
                      value={reviewForm.comment}
                      onChange={(e) => setReviewForm(prev => ({ ...prev, comment: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none mb-4"
                    />
                    <button
                      onClick={handlePostComment}
                      className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300 font-semibold"
                    >
                      Gửi đánh giá
                    </button>
                  </div>

                  {/* Comments List */}
                  <div className="space-y-6">
                    {comments.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        <div className="text-4xl mb-2">⭐</div>
                        <p>Chưa có đánh giá nào. Hãy là người đầu tiên đánh giá!</p>
                      </div>
                    )}
                    {comments.map((comment) => (
                      <div key={comment.id} className="border border-gray-200 rounded-xl p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h4 className="font-semibold text-lg text-gray-800">{comment.name}</h4>
                            <p className="text-sm text-gray-500">
                              {comment.date.toLocaleDateString('vi-VN')}
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-sm text-gray-600">Địa điểm:</span>
                              <ReactStars
                                count={5}
                                value={comment.locationRating}
                                size={16}
                                isHalf={true}
                                edit={false}
                                activeColor="#ffd700"
                              />
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-gray-600">Dịch vụ:</span>
                              <ReactStars
                                count={5}
                                value={comment.servicesRating}
                                size={16}
                                isHalf={true}
                                edit={false}
                                activeColor="#ffd700"
                              />
                            </div>
                          </div>
                        </div>
                        <p className="text-gray-700">{comment.comment}</p>
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
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className="bg-white rounded-2xl shadow-lg p-6 mb-6 sticky top-6"
                >
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Giá tour</h3>
                  <div className="text-center mb-6">
                    <div className="text-3xl font-bold text-gray-800 mb-2">
                      {tour.price.perSlot.toLocaleString('vi-VN')} {tour.price.currency}
                    </div>
                    <div className="text-gray-600">mỗi slot</div>
                    {tour.price.groupPrice && (
                      <div className="mt-2">
                        <div className="text-lg font-semibold text-purple-600">
                          {tour.price.groupPrice.toLocaleString('vi-VN')} {tour.price.currency}
                        </div>
                        <div className="text-sm text-gray-500">giá nhóm</div>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-3">
                    <button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-3 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300">
                      Đặt tour ngay
                    </button>
                    <button className="w-full border-2 border-purple-600 text-purple-600 font-semibold py-3 rounded-xl hover:bg-purple-600 hover:text-white transition-all duration-300">
                      Liên hệ tư vấn
                    </button>
                  </div>
                </motion.div>

                {/* Quick Info */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl shadow-lg p-6 text-white"
                >
                  <h3 className="text-xl font-bold mb-4">Thông tin nhanh</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <FiStar className="text-yellow-300" />
                      <span>Đánh giá: {tour.rating}/5</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <FiMapPin className="text-purple-200" />
                      <span>{tour.locations.length} địa điểm</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <FiClock className="text-purple-200" />
                      <span>2 ngày 1 đêm</span>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
} 