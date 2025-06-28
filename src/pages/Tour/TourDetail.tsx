import { useParams, useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";
import { tours } from "@/data/tours";
import type { Tour } from "@/types/TourType";
import ReactStars from 'react-rating-stars-component';
import TourRatingForm from '@/components/TourRatingForm';
import TourInfoList from "@/components/TourInfoList";
import { FiShare2, FiMessageSquare, FiFacebook, FiTwitter, FiInstagram, FiMail, FiChevronDown, FiChevronUp, FiCheck, FiX } from "react-icons/fi";

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

  if (!tour) return <div className="p-8">Không tìm thấy tour.</div>;

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
        // Instagram doesn't support direct sharing via URL, so we'll copy to clipboard
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

  // Mock schedule data - có thể lấy từ database
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
    <div>
      <div className="container mx-auto px-6">
        <div className="pt-20">
          <div className="flex justify-between flex-col md:flex-row items-center mb-4">
            <h1 className="text-3xl font-bold mb-4 dark:text-white">{tour.name}</h1>
            <div className="flex gap-3">
              {/* Share Button */}
              <div className="relative">
                <button
                  onClick={() => setShowShareDropdown(!showShareDropdown)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <FiShare2 />
                  Share
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

              {/* Review Button */}
              <button
                onClick={scrollToReviews}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <FiMessageSquare />
                Review
              </button>
            </div>
          </div>
        </div>
        <TourInfoList tour={tour} />
        <button onClick={() => navigate(-1)} className=" mb-6 text-blue-500 hover:underline">← Quay lại</button>
      </div>
      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="mb-6 flex flex-col gap-4">
          {tour.imageUrls.map((url, i) => (
            <img key={i} src={url} alt={tour.name + '-' + i} className="w-full h-64 object-cover rounded-lg" />
          ))}
        </div>

        <div className="mb-2 flex items-center flex-row" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
          <ReactStars
            count={5}
            value={tour.rating}
            size={24}
            isHalf={true}
            edit={false}
            activeColor="#ffd700"
          />
          <span className="ml-2 text-sm text-yellow-600 font-medium align-middle">{tour.rating.toFixed(1)}</span>
        </div>
        <div className="mb-2">
          <span className="inline-block px-3 py-1 rounded bg-blue-100 text-blue-700 text-xs font-semibold mr-2">{typeLabel[tour.type]}</span>
          <span className="inline-block px-3 py-1 rounded bg-gray-100 text-gray-700 text-xs font-semibold">Slug: {tour.slug}</span>
        </div>

        {/* Tour Introduction */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4 dark:text-white">Tour Introduction</h2>
          <div className="text-lg text-gray-700 dark:text-gray-300 mb-4">{tour.description}</div>
        </div>

        {/* Tour Schedule */}
        <div className="mb-8">
          <div className="flex flex-col gap-4 mb-4">
            <h2 className="text-2xl font-bold dark:text-white">Lịch Trình Tour</h2>
          </div>
          <button
            onClick={() => setShowSchedule(!showSchedule)}
            className="flex w-full h-16 justify-between items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <span className="text-xl font-bold">{tour.locations.join(" - ")}</span>
            {showSchedule ? <FiChevronUp /> : <FiChevronDown />}
          </button>

          {showSchedule && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
              {scheduleData.map((day, index) => (
                <div key={day.day} className={`border-b ${index === scheduleData.length - 1 ? 'border-b-0' : 'border-gray-200 dark:border-gray-700'}`}>
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-4 text-blue-600 dark:text-blue-400">
                      {day.title}
                    </h3>
                    <div className="space-y-3">
                      {day.activities.map((activity, activityIndex) => (
                        <div key={activityIndex} className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                          <p className="text-gray-700 dark:text-gray-300">{activity}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Dịch vụ đi kèm */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4 dark:text-white">Dịch vụ đi kèm</h2>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Dịch vụ có */}
              <div>
                <h3 className="text-lg font-semibold mb-3 text-green-600 dark:text-green-400 flex items-center gap-2">
                  <FiCheck className="text-green-600" />
                  Bao gồm
                </h3>
                <div className="space-y-2">
                  {tour.includedServices.map((service, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <FiCheck className="text-green-600 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300">{service}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Dịch vụ không có */}
              <div>
                <h3 className="text-lg font-semibold mb-3 text-red-600 dark:text-red-400 flex items-center gap-2">
                  <FiX className="text-red-600" />
                  Không bao gồm
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <FiX className="text-red-600 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">Thuế VAT</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FiX className="text-red-600 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">Tip cho Hướng dẫn viên</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FiX className="text-red-600 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">Ăn uống ngoài chương trình tour</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-xs text-gray-500 mt-6">Ngày tạo: {tour.createdAt.toLocaleDateString()}</div>

        {/* Review Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4 dark:text-white">Đánh giá</h2>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border p-6">
            <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">1 thoughts on {tour.name}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Left side - Rating categories */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700 dark:text-gray-300 font-medium">Location</span>
                  <ReactStars
                    count={5}
                    value={reviewForm.locationRating}
                    size={20}
                    isHalf={true}
                    edit={true}
                    activeColor="#ffd700"
                    onChange={(newValue: number) => setReviewForm(prev => ({ ...prev, locationRating: newValue }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700 dark:text-gray-300 font-medium">Services</span>
                  <ReactStars
                    count={5}
                    value={reviewForm.servicesRating}
                    size={20}
                    isHalf={true}
                    edit={true}
                    activeColor="#ffd700"
                    onChange={(newValue: number) => setReviewForm(prev => ({ ...prev, servicesRating: newValue }))}
                  />
                </div>
              </div>

              {/* Right side - Average rating */}
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">{averageRating}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Average Rating</div>
              </div>
            </div>

            {/* Comment form */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <h3 className="text-lg font-semibold mb-4 dark:text-white">Viết đánh giá</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Your email address will not be published.</p>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Your name"
                    value={reviewForm.name}
                    onChange={(e) => setReviewForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                  <input
                    type="email"
                    placeholder="Your email"
                    value={reviewForm.email}
                    onChange={(e) => setReviewForm(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <textarea
                  placeholder="Write your comment..."
                  rows={4}
                  value={reviewForm.comment}
                  onChange={(e) => setReviewForm(prev => ({ ...prev, comment: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white resize-none"
                ></textarea>
                <button
                  onClick={handlePostComment}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Post Comment
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Display Comments */}
        {comments.length > 0 && (
          <div className="mb-8">
            <h3 className="text-xl font-bold mb-4 dark:text-white">Đánh giá của khách hàng</h3>
            <div className="space-y-6">
              {comments.map((comment) => (
                <div key={comment.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="font-semibold text-lg dark:text-white">{comment.name}</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {comment.date.toLocaleDateString('vi-VN')}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Location:</span>
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
                        <span className="text-sm text-gray-600 dark:text-gray-400">Services:</span>
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
                  <p className="text-gray-700 dark:text-gray-300 mb-4">{comment.comment}</p>

                  {/* Reply button */}
                  <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                    Reply
                  </button>

                  {/* Replies */}
                  {comment.replies.length > 0 && (
                    <div className="mt-4 pl-4 border-l-2 border-gray-200 dark:border-gray-700">
                      {comment.replies.map((reply) => (
                        <div key={reply.id} className="mb-3">
                          <div className="flex justify-between items-start">
                            <h5 className="font-medium dark:text-white">{reply.name}</h5>
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              {reply.date.toLocaleDateString('vi-VN')}
                            </span>
                          </div>
                          <p className="text-gray-600 dark:text-gray-400 text-sm">{reply.comment}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 