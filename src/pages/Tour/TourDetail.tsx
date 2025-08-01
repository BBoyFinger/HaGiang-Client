import { useParams, useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";
import { tours } from "@/data/tours";
import type { Tour } from "@/types/TourType";
import ReactStars from 'react-rating-stars-component';
import TourRatingForm from '@/components/TourRatingForm';
import TourInfoList from "@/components/TourInfoList";
import { motion } from "framer-motion";
import { FiShare2, FiMessageSquare, FiFacebook, FiTwitter, FiInstagram, FiMail, FiChevronDown, FiChevronUp, FiCheck, FiX, FiArrowLeft, FiHeart, FiMapPin, FiClock, FiUsers, FiStar, FiPhone, FiMessageCircle } from "react-icons/fi";
import { FaHeart } from "react-icons/fa";
import { Helmet } from 'react-helmet-async';
import { useGetTourByIdQuery, useGetCommentsQuery, useAddCommentMutation, useGetReviewsQuery, useAddReviewMutation } from '@/services/api';
import { useTranslation } from 'react-i18next';
import { useSelector } from "react-redux";
import LoadingSpinner from '@/components/LoadingSpinner';
import ModalBookingForm from '@/components/ModalBookingForm';

export default function TourDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, error } = useGetTourByIdQuery(slug || '');
  const tour = data?.tour;
  const { t, i18n } = useTranslation();
  const lang = i18n.language === 'en' ? 'en' : 'vi';
  // Thêm state cho tab
  const [activeTab, setActiveTab] = useState<'review' | 'comment'>('review');
  const [showShareDropdown, setShowShareDropdown] = useState(false);
  const [showSchedule, setShowSchedule] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  // Thêm state cho thông báo
  const [commentSuccessMsg, setCommentSuccessMsg] = useState<string | null>(null);
  // State cho modal booking
  const [showBookingModal, setShowBookingModal] = useState(false);
  // State cho modal contact
  const [showContactModal, setShowContactModal] = useState(false);

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

  const handleContact = () => {
    setShowContactModal(true);
  };


  if (isLoading) {
    return (
      <div className="min-h-screen bg-light flex items-center justify-center">
        <LoadingSpinner 
          type="hash" 
          size={60} 
          color="#3B82F6" 
          text="Đang tải thông tin tour..." 
          fullScreen={false}
        />
      </div>
    );
  }

  if (error || !tour) {
    return (
      <div className="min-h-screen bg-light flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😞</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Không tìm thấy tour</h2>
          <p className="text-gray-600 mb-4">Tour bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.</p>
          <button
            onClick={() => navigate('/tour')}
            className="bg-gradient-to-r from-primary to-accent text-white px-6 py-2 rounded-lg hover:from-accent hover:to-primary transition-colors"
          >
            Quay lại danh sách tour
          </button>
        </div>
      </div>
    );
  }

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

      <div className="min-h-screen bg-light">
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
          <section className="py-8 bg-light">
            <div className="max-w-6xl mx-auto px-4">
              <div className="flex gap-4 overflow-x-auto pb-4">
                {tour.imageUrls.map((image: string, index: number) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden border-2 transition-all duration-300 ${selectedImage === index
                      ? "border-primary"
                      : "border-earth hover:border-accent"
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
                  className="bg-light rounded-2xl shadow-lg p-8 mb-8 border border-earth/40"
                >
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <span className="inline-block px-4 py-2 rounded-full bg-secondary/20 text-primary text-sm font-semibold">
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
                        <span className="text-sm text-[#555]">{averageRating}</span>
                        <span className="text-sm text-[#555] ml-2">({reviews.length} đánh giá)</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <div className="relative">
                        <button
                          onClick={() => setShowShareDropdown(!showShareDropdown)}
                          className="w-10 h-10 bg-secondary/20 rounded-full flex items-center justify-center hover:bg-accent transition-colors"
                        >
                          <FiShare2 className="text-primary" />
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

                  <h2 className="text-2xl font-bold text-[#1a1a1a] mb-4">{t('tour.detail.description')}</h2>
                  <div className="text-[#555] leading-relaxed mb-6 prose max-w-none"
                    dangerouslySetInnerHTML={{ __html: tour.description?.[lang] || tour.description?.vi || '' }} />

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center gap-3 p-4 bg-light rounded-xl">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <FiMapPin className="text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-[#1a1a1a]">{t('tour.detail.location')}</h3>
                        <p className="text-sm text-[#555]">{mapMultiLangArray(tour.locations, lang).join(', ')}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-light rounded-xl">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <FiClock className="text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-[#1a1a1a]">{t('tour.detail.duration')}</h3>
                        <p className="text-sm text-[#555]">{tour.duration?.[lang] || tour.duration?.vi}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-light rounded-xl">
                      <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                        <FiUsers className="text-purple-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-[#1a1a1a]">{t('tour.detail.group')}</h3>
                        <p className="text-sm text-[#555]">2-8</p>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Tour Schedule */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="bg-light rounded-2xl shadow-lg p-8 mb-8 border border-earth/40"
                >
                  <h2 className="text-2xl font-bold text-[#1a1a1a] mb-6">{t('tour.detail.schedule')}</h2>
                  <button
                    onClick={() => setShowSchedule(!showSchedule)}
                    className="flex w-full justify-between items-center gap-4 p-6 bg-gradient-to-r from-primary to-accent text-[#1a1a1a] rounded-xl hover:from-accent hover:to-primary transition-all duration-300"
                  >
                    <span className="text-xl font-bold">{mapMultiLangArray(tour.destination, lang).join(" - ")}</span>
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
                  className="bg-light rounded-2xl shadow-lg p-8 mb-8 border border-earth/40"
                >
                  <h2 className="text-2xl font-bold text-[#1a1a1a] mb-6">{t('tour.detail.services')}</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-lg font-semibold mb-4 text-green-600 flex items-center gap-2">
                        <FiCheck className="text-green-600" />
                        {t('tour.detail.included')}
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
                        {t('tour.detail.excluded')}
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
                  className="bg-light rounded-2xl shadow-lg p-8 border border-earth/40"
                >
                  {/* Tabs cho Review/Comment */}
                  <div className="flex gap-4 mb-8">
                    <button onClick={() => setActiveTab('review')} className={`px-4 py-2 rounded-lg font-semibold ${activeTab === 'review' ? 'bg-gradient-to-r from-primary to-accent text-[#1a1a1a]' : 'bg-light text-[#555] border border-earth'}`}>{t('tour.detail.review')}</button>
                    <button onClick={() => setActiveTab('comment')} className={`px-4 py-2 rounded-lg font-semibold ${activeTab === 'comment' ? 'bg-gradient-to-r from-primary to-accent text-[#1a1a1a]' : 'bg-light text-[#555] border border-earth'}`}>{t('tour.detail.comment')}</button>
                  </div>

                  {activeTab === 'review' && (
                    <div>
                      {/* Tổng điểm rating */}
                      <div className="flex items-center gap-2 mb-4">
                        <span className="text-2xl font-bold text-accent">{averageRating}</span>
                        <ReactStars count={5} value={averageRating} size={24} isHalf={true} edit={false} color="#e4e5e9" activeColor="#ffd700" />
                        <span className="text-[#555]">({reviews.length} đánh giá)</span>
                      </div>
                      {/* Form gửi review */}
                      <div className="bg-light rounded-xl p-6 mb-8">
                        <h3 className="text-lg font-semibold mb-4 text-[#1a1a1a]">{t('tour.detail.writeReview')}</h3>
                        {!isAuthenticated && (
                          <>
                            <input
                              type="text"
                              placeholder={t('tour.detail.namePlaceholder')}
                              value={reviewInput.name}
                              onChange={e => setReviewInput(prev => ({ ...prev, name: e.target.value }))}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 mb-2"
                            />
                            <input
                              type="email"
                              placeholder={t('tour.detail.emailPlaceholder')}
                              value={reviewInput.email}
                              onChange={e => setReviewInput(prev => ({ ...prev, email: e.target.value }))}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 mb-4"
                            />
                          </>
                        )}
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-[#555] mb-2">{t("tour.detail.pickStar")}</label>
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
                          placeholder={t('tour.detail.reviewPlaceholder')}
                          rows={4}
                          value={reviewInput.comment}
                          onChange={e => setReviewInput(prev => ({ ...prev, comment: e.target.value }))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none mb-4"
                        />
                        <button
                          onClick={handlePostReview}
                          className="bg-gradient-to-r from-primary to-accent text-[#1a1a1a] px-6 py-3 rounded-lg hover:from-accent hover:to-primary transition-all duration-300 font-semibold"
                          disabled={isAddingReview}
                        >
                          {t('tour.detail.sendReview')}
                        </button>
                      </div>
                      {/* Danh sách review */}
                      {isReviewsLoading ? <div>{t('tour.detail.loadingReviews')}</div> : (
                        <div className="space-y-6">
                          {reviews.length === 0 && <div className="text-center py-8 text-gray-500"><div className="text-4xl mb-2">⭐</div><p>{t('tour.detail.noReview')}</p></div>}
                          {reviews.map((review: any) => (
                            <div key={review._id} className="border border-gray-200 rounded-xl p-6">
                              <div className="flex justify-between items-start mb-4">
                                <div>
                                  <h4 className="font-semibold text-lg text-[#1a1a1a]">{review.userId?.name || 'Ẩn danh'}</h4>
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
                      <div className="bg-light rounded-xl p-6 mb-8">
                        <h3 className="text-lg font-semibold mb-4 text-[#1a1a1a]">{t('tour.detail.writeComment')}</h3>
                        {commentSuccessMsg && (
                          <div className="mb-4 text-green-600 font-semibold bg-green-50 border border-green-200 rounded-lg p-3">
                            {commentSuccessMsg}
                          </div>
                        )}
                        {!isAuthenticated && (
                          <>
                            <input
                              type="text"
                              placeholder={t('tour.detail.namePlaceholder')}
                              value={commentInput.name}
                              onChange={e => setCommentInput(prev => ({ ...prev, name: e.target.value }))}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 mb-2"
                            />
                            <input
                              type="email"
                              placeholder={t('tour.detail.emailPlaceholder')}
                              value={commentInput.email}
                              onChange={e => setCommentInput(prev => ({ ...prev, email: e.target.value }))}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 mb-4"
                            />
                          </>
                        )}
                        <textarea
                          placeholder={t('tour.detail.commentPlaceholder')}
                          rows={4}
                          value={commentInput.content}
                          onChange={e => setCommentInput({ ...commentInput, content: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none mb-4"
                        />
                        <button
                          onClick={handlePostComment}
                          className="bg-gradient-to-r from-primary to-accent text-[#1a1a1a] px-6 py-3 rounded-lg hover:from-accent hover:to-primary transition-all duration-300 font-semibold"
                          disabled={isAddingComment}
                        >
                          {t('tour.detail.sendComment')}
                        </button>
                      </div>
                      {/* Danh sách comment */}
                      {isCommentsLoading ? <div>{t('tour.detail.loadingComments')}</div> : (
                        <div className="space-y-6">
                          {comments.length === 0 && <div className="text-center py-8 text-gray-500"><div className="text-4xl mb-2">💬</div><p>{t('tour.detail.noComment')}</p></div>}
                          {comments.map((comment: any) => (
                            <div key={comment._id} className="border border-gray-200 rounded-xl p-6">
                              <div className="flex justify-between items-start mb-4">
                                <div>
                                  <h4 className="font-semibold text-lg text-[#1a1a1a]">{comment.user?.name || 'Ẩn danh'}</h4>
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
                  className="bg-light rounded-2xl shadow-lg p-6 mb-6 sticky top-6 border border-earth/40"
                >
                  <h3 className="text-xl font-bold text-[#1a1a1a] mb-4">{t('tour.detail.price')}</h3>
                  <div className="text-center mb-6 space-y-2">
                    {/* VND Price */}
                    {tour.price?.VND && (
                      <div className="space-y-2">
                        <div className="flex items-baseline justify-center gap-2">
                          <div className="text-2xl font-bold text-primary">
                            {tour.price.VND.perSlot?.toLocaleString('vi-VN')} VND
                          </div>
                          <div className="text-[#555] text-base">/slot</div>
                        </div>
                        {tour.price.VND.groupPrice && (
                          <div className="flex items-baseline justify-center gap-2">
                            <div className="text-base font-semibold text-accent">
                              {tour.price.VND.groupPrice.toLocaleString('vi-VN')} VND
                            </div>
                            <div className="text-sm text-[#555]">/{t('tour.detail.groupPrice')}</div>
                          </div>
                        )}
                        {tour.price.VND.discountPrice && (
                          <div className="flex items-baseline justify-center gap-2">
                            <div className="text-base font-semibold text-secondary">
                              {tour.price.VND.discountPrice.toLocaleString('vi-VN')} VND
                            </div>
                            <div className="text-sm text-[#555]">/{t('tour.detail.discountPrice')}</div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    <button 
                      onClick={() => setShowBookingModal(true)}
                      className="w-full bg-gradient-to-r from-primary to-accent text-[#1a1a1a] font-semibold py-3 rounded-xl hover:from-accent hover:to-primary transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      <FiMessageCircle className="text-lg" />
                      {t('tour.detail.bookNow')}
                    </button>
                    <button 
                      onClick={handleContact}
                      className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold py-3 rounded-xl hover:from-emerald-600 hover:to-green-500 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                    >
                      <FiPhone className="text-lg" />
                      {t('tour.detail.contact')}
                    </button>
                  </div>
                </motion.div>

                {/* Quick Info */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  className="bg-gradient-to-r from-primary to-accent rounded-2xl shadow-lg p-6 text-light"
                >
                  <h3 className="text-xl font-bold mb-4">{t('tour.detail.quickInfo')}</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <FiStar className="text-accent" />
                      <span>{t('tour.detail.rating')}: {averageRating}/5 ({reviews.length})</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <FiMapPin className="text-primary" />
                      <span>{mapMultiLangArray(tour.locations, lang).length} {t('tour.detail.location')}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <FiClock className="text-secondary" />
                      <span>{tour.duration?.[lang] || tour.duration?.vi}</span>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Modal Booking Form */}
      <ModalBookingForm
        open={showBookingModal}
        onClose={() => setShowBookingModal(false)}
        selectedTourId={tour?._id || ''}
      />

      {/* Modal Contact */}
      {showContactModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 w-full max-w-md relative"
          >
            <button
              onClick={() => setShowContactModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-red-500 text-xl font-bold"
            >
              ×
            </button>
            
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiPhone className="text-white text-2xl" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                Liên hệ với chúng tôi
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Hãy liên hệ để được tư vấn chi tiết về tour này
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                  <FiPhone className="text-blue-600 dark:text-blue-400 text-xl" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 dark:text-white">Hotline</h3>
                  <p className="text-blue-600 dark:text-blue-400 font-medium">+84 123 456 789</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                  <FiMessageCircle className="text-green-600 dark:text-green-400 text-xl" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 dark:text-white">Zalo</h3>
                  <p className="text-green-600 dark:text-green-400 font-medium">homietravel</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                  <FiMail className="text-purple-600 dark:text-purple-400 text-xl" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 dark:text-white">Email</h3>
                  <p className="text-purple-600 dark:text-purple-400 font-medium">info@homietravel.com</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center">
                  <FiMapPin className="text-orange-600 dark:text-orange-400 text-xl" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 dark:text-white">Văn phòng</h3>
                  <p className="text-orange-600 dark:text-orange-400 font-medium">Hà Giang, Việt Nam</p>
                </div>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <button
                onClick={() => window.open('tel:+84123456789', '_self')}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold py-3 rounded-xl hover:from-emerald-600 hover:to-green-500 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <FiPhone className="text-lg" />
                Gọi ngay
              </button>
              
              <button
                onClick={() => navigate('/contact')}
                className="w-full border-2 border-green-500 text-green-600 font-semibold py-3 rounded-xl hover:bg-green-500 hover:text-white transition-all duration-300"
              >
                Xem thêm thông tin
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
} 