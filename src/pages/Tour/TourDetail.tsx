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
import { useGetTourByIdQuery, useGetCommentsQuery, useAddCommentMutation, useGetReviewsQuery, useAddReviewMutation } from '@/services/api';
import { useTranslation } from 'react-i18next';
import { useSelector } from "react-redux";

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
  const { data, isLoading, error } = useGetTourByIdQuery(slug || '');
  const tour = data?.tour;
  const { i18n } = useTranslation();
  const lang = i18n.language === 'en' ? 'en' : 'vi';
  // Thêm state cho tab
  const [activeTab, setActiveTab] = useState<'review' | 'comment'>('review');
  const [showShareDropdown, setShowShareDropdown] = useState(false);
  const [showSchedule, setShowSchedule] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  // Thêm state cho thông báo
  const [commentSuccessMsg, setCommentSuccessMsg] = useState<string | null>(null);

  // Lấy review từ API
  const { data: reviewsData, isLoading: isReviewsLoading, refetch: refetchReviews } = useGetReviewsQuery({ tourId: tour?._id });
  const reviews = reviewsData?.reviews || [];
  // Lấy comment từ API (chỉ lấy comment đã duyệt)
  const { data: commentsData, isLoading: isCommentsLoading } = useGetCommentsQuery({ refType: 'tour', refId: tour?._id, status: 'approved' });
  const comments = commentsData?.comments || [];

  // Form review
  const [reviewInput, setReviewInput] = useState({ name: '', email: '', rating: 0, comment: '' });
  const [addReview, { isLoading: isAddingReview }] = useAddReviewMutation();
  // Form comment
  const [commentInput, setCommentInput] = useState({ name: '', email: '', content: '' });
  const [addComment, { isLoading: isAddingComment }] = useAddCommentMutation();

  const user = useSelector((state: any) => state.user.user);
  const isAuthenticated = useSelector((state: any) => state.user.isAuthenticated);

  // Tính điểm trung bình review
  const averageRating = useMemo(() => {
    if (!reviews.length) return 0;
    const total = reviews.reduce((sum: number, r: any) => sum + (r.rating || 0), 0);
    return (total / reviews.length).toFixed(1);
  }, [reviews]);

  // Gửi review
  const handlePostReview = async () => {
    if (!isAuthenticated) {
      if (!reviewInput.name || !reviewInput.email || !reviewInput.comment || !reviewInput.rating) {
        alert('Vui lòng nhập đủ thông tin đánh giá!');
        return;
      }
      await addReview({
        name: reviewInput.name,
        email: reviewInput.email,
        rating: reviewInput.rating,
        comment: reviewInput.comment,
        tourId: tour._id
      } as any);
      setReviewInput({ name: '', email: '', rating: 0, comment: '' });
      if (typeof refetchReviews === 'function') refetchReviews();
    } else {
      if (!reviewInput.comment || !reviewInput.rating) {
        alert('Vui lòng nhập đủ thông tin đánh giá!');
        return;
      }
      await addReview({
        userId: user._id,
        rating: reviewInput.rating,
        comment: reviewInput.comment,
        tourId: tour._id
      } as any);
      setReviewInput({ ...reviewInput, rating: 0, comment: '' });
      if (typeof refetchReviews === 'function') refetchReviews();
    }
  };
  // Gửi comment
  const handlePostComment = async () => {
    if (!isAuthenticated) {
      if (!commentInput.name || !commentInput.email || !commentInput.content) {
        alert('Vui lòng nhập đủ thông tin!');
        return;
      }
      await addComment({
        name: commentInput.name,
        email: commentInput.email,
        content: commentInput.content,
        refType: 'tour',
        refId: tour._id
      } as any);
      setCommentInput({ name: '', email: '', content: '' });
      setCommentSuccessMsg('Bình luận của bạn đã được gửi và đang chờ duyệt bởi admin.');
    } else {
      if (!commentInput.content) {
        alert('Vui lòng nhập nội dung bình luận!');
        return;
      }
      await addComment({
        user: user._id,
        content: commentInput.content,
        refType: 'tour',
        refId: tour._id
      } as any);
      setCommentInput({ name: commentInput.name, email: commentInput.email, content: '' });
      setCommentSuccessMsg('Bình luận của bạn đã được gửi và đang chờ duyệt bởi admin.');
    }
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50">Đang tải dữ liệu tour...</div>;
  }
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

  // Helper: map mảng object đa ngôn ngữ sang chuỗi
  const mapMultiLangArray = (arr: any[] = [], lang: string) => arr.map(item => item?.[lang] || item?.vi || '').filter(Boolean);

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const text = `Check out this amazing tour: ${tour.name?.[lang] || tour.name?.vi}`;

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
        window.open(`mailto:?subject=${encodeURIComponent(tour.name?.[lang] || tour.name?.vi)}&body=${encodeURIComponent(`${text} ${url}`)}`, '_blank');
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


  return (
    <>
      <Helmet>
        <title>
          {(tour && (tour.name?.[lang] || tour.name?.vi))
            ? `${tour.name?.[lang] || tour.name?.vi} - Chi tiết tour | Homie Travel`
            : 'Chi tiết tour | Homie Travel'}
        </title>
        <meta
          name="description"
          content={
            (tour && (tour.description?.[lang] || tour.description?.vi))
              ? tour.description?.[lang] || tour.description?.vi
              : 'Thông tin chi tiết tour du lịch Hà Giang'
          }
        />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="relative h-96 md:h-[500px] overflow-hidden">
          <img
            src={tour.imageUrls?.[selectedImage] || tour.imageUrls?.[0]}
            alt={tour.name?.[lang] || tour.name?.vi}
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
            className={`absolute top-6 right-6 z-10 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${isFavorite
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
                  {tour.name?.[lang] || tour.name?.vi}
                </h1>
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                    <FiMapPin className="text-white" />
                    <span className="text-white font-medium">
                      {mapMultiLangArray(tour.locations, lang).join(' - ')}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                    <FiStar className="text-yellow-400" />
                    <span className="text-white font-medium">{averageRating}</span>
                    <span className="text-white font-medium ml-2">({reviews.length} đánh giá)</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Image Gallery */}
        {tour.imageUrls?.length > 1 && (
          <section className="py-8 bg-white">
            <div className="max-w-6xl mx-auto px-4">
              <div className="flex gap-4 overflow-x-auto pb-4">
                {tour.imageUrls.map((image: string, index: number) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden border-2 transition-all duration-300 ${selectedImage === index
                      ? "border-purple-500"
                      : "border-gray-200 hover:border-purple-300"
                      }`}
                  >
                    <img
                      src={image}
                      alt={`${tour.name?.[lang] || tour.name?.vi} ${index + 1}`}
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
                        {tour.type?.[lang] || tour.type?.vi}
                      </span>
                      <div className="flex items-center gap-2">
                        <ReactStars
                          count={5}
                          value={Number(averageRating)}
                          size={20}
                          isHalf={true}
                          edit={false}
                          color="#e4e5e9"
                          activeColor="#ffd700"
                        />
                        <span className="text-sm text-gray-600">{averageRating}</span>
                        <span className="text-sm text-gray-600 ml-2">({reviews.length} đánh giá)</span>
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
                  <div className="text-gray-600 leading-relaxed mb-6 prose max-w-none"
                    dangerouslySetInnerHTML={{ __html: tour.description?.[lang] || tour.description?.vi || '' }} />

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <FiMapPin className="text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">Địa điểm</h3>
                        <p className="text-sm text-gray-600">{mapMultiLangArray(tour.locations, lang).join(', ')}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <FiClock className="text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">Thời gian</h3>
                        <p className="text-sm text-gray-600">{tour.duration?.[lang] || tour.duration?.vi}</p>
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
                    <span className="text-xl font-bold">{mapMultiLangArray(tour.locations, lang).join(" - ")}</span>
                    {showSchedule ? <FiChevronUp /> : <FiChevronDown />}
                  </button>
                  {showSchedule && (
                    <div className="mt-6 space-y-6">
                      {tour.schedule && tour.schedule[lang] && tour.schedule[lang].length > 0 ? (
                        tour.schedule[lang].map((day: any) => (
                          <div key={day.day} className="border border-gray-200 rounded-xl overflow-hidden">
                            <div className="bg-gray-50 p-4 border-b border-gray-200">
                              <h3 className="text-xl font-bold text-purple-600">{day.title}</h3>
                            </div>
                            <div className="p-6">
                              <div className="space-y-4">
                                {day.activities.map((activity: string, activityIndex: number) => (
                                  <div key={activityIndex} className="flex items-start gap-4">
                                    <div className="w-3 h-3 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                                    <p className="text-gray-700">{activity}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-500">Chưa có lịch trình chi tiết.</p>
                      )}
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
                        {mapMultiLangArray(tour.includedServices, lang).map((service: string, index: number) => (
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
                        {mapMultiLangArray(tour.excludedServices, lang).map((service: string, index: number) => (
                          <div key={index} className="flex items-center gap-3">
                            <FiX className="text-red-600 flex-shrink-0" />
                            <span className="text-gray-700">{service}</span>
                          </div>
                        ))}
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
                  {/* Tabs cho Review/Comment */}
                  <div className="flex gap-4 mb-8">
                    <button onClick={() => setActiveTab('review')} className={`px-4 py-2 rounded-lg font-semibold ${activeTab === 'review' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700'}`}>Đánh giá</button>
                    <button onClick={() => setActiveTab('comment')} className={`px-4 py-2 rounded-lg font-semibold ${activeTab === 'comment' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700'}`}>Bình luận</button>
                  </div>

                  {activeTab === 'review' && (
                    <div>
                      {/* Tổng điểm rating */}
                      <div className="flex items-center gap-2 mb-4">
                        <span className="text-2xl font-bold text-yellow-500">{averageRating}</span>
                        <ReactStars count={5} value={averageRating} size={24} isHalf={true} edit={false} color="#e4e5e9" activeColor="#ffd700" />

                        <span className="text-gray-600">({reviews.length} đánh giá)</span>
                      </div>
                      {/* Form gửi review */}
                      <div className="bg-gray-50 rounded-xl p-6 mb-8">
                        <h3 className="text-lg font-semibold mb-4 text-gray-800">Viết đánh giá</h3>
                        {!isAuthenticated && (
                          <>
                            <input
                              type="text"
                              placeholder="Tên của bạn"
                              value={reviewInput.name}
                              onChange={e => setReviewInput(prev => ({ ...prev, name: e.target.value }))}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 mb-2"
                            />
                            <input
                              type="email"
                              placeholder="Email của bạn"
                              value={reviewInput.email}
                              onChange={e => setReviewInput(prev => ({ ...prev, email: e.target.value }))}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 mb-4"
                            />
                          </>
                        )}
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 mb-2">Chọn số sao</label>
                          <ReactStars
                            count={5}
                            value={reviewInput.rating}
                            size={24}
                            isHalf={true}
                            edit={true}
                            color="#e4e5e9"
                            activeColor="#ffd700"
                            onChange={(newValue: number) => setReviewInput(prev => ({ ...prev, rating: newValue }))}
                          />
                        </div>
                        <textarea
                          placeholder="Viết đánh giá của bạn..."
                          rows={4}
                          value={reviewInput.comment}
                          onChange={e => setReviewInput(prev => ({ ...prev, comment: e.target.value }))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none mb-4"
                        />
                        <button
                          onClick={handlePostReview}
                          className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300 font-semibold"
                          disabled={isAddingReview}
                        >
                          Gửi đánh giá
                        </button>
                      </div>
                      {/* Danh sách review */}
                      {isReviewsLoading ? <div>Đang tải đánh giá...</div> : (
                        <div className="space-y-6">
                          {reviews.length === 0 && <div className="text-center py-8 text-gray-500"><div className="text-4xl mb-2">⭐</div><p>Chưa có đánh giá nào. Hãy là người đầu tiên đánh giá!</p></div>}
                          {reviews.map((review: any) => (
                            <div key={review._id} className="border border-gray-200 rounded-xl p-6">
                              <div className="flex justify-between items-start mb-4">
                                <div>
                                  <h4 className="font-semibold text-lg text-gray-800">{review.userId?.name || 'Ẩn danh'}</h4>
                                  <p className="text-sm text-gray-500">{new Date(review.createdAt).toLocaleDateString('vi-VN')}</p>
                                </div>
                                <ReactStars count={5} value={review.rating} size={16} isHalf={true} edit={false} color="#e4e5e9" activeColor="#ffd700" />
                              </div>
                              <p className="text-gray-700">{review.comment}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === 'comment' && (
                    <div>
                      {/* Form gửi comment */}
                      <div className="bg-gray-50 rounded-xl p-6 mb-8">
                        <h3 className="text-lg font-semibold mb-4 text-gray-800">Viết bình luận</h3>
                        {commentSuccessMsg && (
                          <div className="mb-4 text-green-600 font-semibold bg-green-50 border border-green-200 rounded-lg p-3">
                            {commentSuccessMsg}
                          </div>
                        )}
                        {!isAuthenticated && (
                          <>
                            <input
                              type="text"
                              placeholder="Tên của bạn"
                              value={commentInput.name}
                              onChange={e => setCommentInput(prev => ({ ...prev, name: e.target.value }))}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 mb-2"
                            />
                            <input
                              type="email"
                              placeholder="Email của bạn"
                              value={commentInput.email}
                              onChange={e => setCommentInput(prev => ({ ...prev, email: e.target.value }))}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 mb-4"
                            />
                          </>
                        )}
                        <textarea
                          placeholder="Viết bình luận của bạn..."
                          rows={4}
                          value={commentInput.content}
                          onChange={e => setCommentInput({ ...commentInput, content: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none mb-4"
                        />
                        <button
                          onClick={handlePostComment}
                          className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300 font-semibold"
                          disabled={isAddingComment}
                        >
                          Gửi bình luận
                        </button>
                      </div>
                      {/* Danh sách comment */}
                      {isCommentsLoading ? <div>Đang tải bình luận...</div> : (
                        <div className="space-y-6">
                          {comments.length === 0 && <div className="text-center py-8 text-gray-500"><div className="text-4xl mb-2">💬</div><p>Chưa có bình luận nào. Hãy là người đầu tiên bình luận!</p></div>}
                          {comments.map((comment: any) => (
                            <div key={comment._id} className="border border-gray-200 rounded-xl p-6">
                              <div className="flex justify-between items-start mb-4">
                                <div>
                                  <h4 className="font-semibold text-lg text-gray-800">{comment.user?.name || 'Ẩn danh'}</h4>
                                  <p className="text-sm text-gray-500">{new Date(comment.createdAt).toLocaleDateString('vi-VN')}</p>
                                </div>
                              </div>
                              <p className="text-gray-700">{comment.content}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
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
                  <div className="text-center mb-6 space-y-2">
                    {/* VND Price */}
                    {tour.price?.VND && (
                      <div className="space-y-2">
                        <div className="flex items-baseline justify-center gap-2">
                          <div className="text-2xl font-bold text-gray-800">
                            {tour.price.VND.perSlot?.toLocaleString('vi-VN')} VND
                          </div>
                          <div className="text-gray-600 text-base">/slot</div>
                        </div>
                        {tour.price.VND.groupPrice && (
                          <div className="flex items-baseline justify-center gap-2">
                            <div className="text-base font-semibold text-purple-600">
                              {tour.price.VND.groupPrice.toLocaleString('vi-VN')} VND
                            </div>
                            <div className="text-sm text-gray-500">/giá nhóm</div>
                          </div>
                        )}
                        {tour.price.VND.discountPrice && (
                          <div className="flex items-baseline justify-center gap-2">
                            <div className="text-base font-semibold text-green-600">
                              {tour.price.VND.discountPrice.toLocaleString('vi-VN')} VND
                            </div>
                            <div className="text-sm text-gray-500">/khuyến mãi</div>
                          </div>
                        )}
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
                      <span>Đánh giá: {averageRating}/5 ({reviews.length})</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <FiMapPin className="text-purple-200" />
                      <span>{mapMultiLangArray(tour.locations, lang).length} địa điểm</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <FiClock className="text-purple-200" />
                      <span>{tour.duration?.[lang] || tour.duration?.vi}</span>
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