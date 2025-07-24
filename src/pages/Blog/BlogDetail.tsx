import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaArrowLeft, FaUser, FaCalendar, FaTags, FaHeart, FaShare, FaComment, FaFacebook, FaTwitter, FaLinkedin, FaBookmark } from "react-icons/fa";
import { Helmet } from 'react-helmet-async';
import axiosInstance from "@/config/axiosConfig";
import { mockBlogs } from "@/data/mockBlogs";
import { useTranslation } from "react-i18next";

interface Comment {
  id: string;
  author: string;
  content: string;
  createdAt: Date;
  avatar?: string;
}

const mockComments: Comment[] = [
  {
    id: "c1",
    author: "Minh",
    content: "Bài viết rất hay và hữu ích! Mình đã đi Hà Giang mùa hoa tam giác mạch và thực sự bị choáng ngợp bởi vẻ đẹp nơi đây. Cảm ơn tác giả đã chia sẻ kinh nghiệm quý báu.",
    createdAt: new Date("2024-06-01T10:00:00"),
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
  },
  {
    id: "c2",
    author: "Lan",
    content: "Cảm ơn bạn đã chia sẻ kinh nghiệm du lịch Hà Giang. Mình đang lên kế hoạch đi vào tháng 10 này. Bài viết giúp mình có thêm nhiều thông tin bổ ích!",
    createdAt: new Date("2024-06-02T14:30:00"),
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face"
  },
];

export default function BlogDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { t, i18n } = useTranslation();
  const lang = i18n.language === 'en' ? 'en' : 'vi';

  useEffect(() => {
    axiosInstance.get("/blogs")
      .then(res => {
        setBlogs(res.data.blogs || res.data);
      })
      .catch(() => {
        setBlogs(mockBlogs);
      })
      .finally(() => setLoading(false));
  }, []);

  const blog = blogs.find((b) => b.slug === slug);

  const [comments, setComments] = useState<Comment[]>([]);
  const [author, setAuthor] = useState("");
  const [email, setEmail] = useState("");
  const [content, setContent] = useState("");
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [commentLoading, setCommentLoading] = useState(false);
  const [commentError, setCommentError] = useState("");
  const [commentSuccess, setCommentSuccess] = useState(false);

  // Lấy comment thực tế từ API
  useEffect(() => {
    if (!blog) return;
    setCommentLoading(true);
    setCommentError("");
    axiosInstance.get(`/comments?refType=blog&refId=${blog._id || blog.slug}&status=approved`)
      .then(res => setComments(res.data.comments || []))
      .catch(() => setCommentError("Không thể tải bình luận."))
      .finally(() => setCommentLoading(false));
  }, [blog]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!author.trim() || !content.trim()) return;
    setCommentLoading(true);
    setCommentError("");
    try {
      await axiosInstance.post('/comments', {
        refType: 'blog',
        refId: blog._id || blog.slug,
        name: author,
        email,
        content
      });
      setCommentSuccess(true);
      setAuthor("");
      setEmail("");
      setContent("");
      // Reload comment list
      const res = await axiosInstance.get(`/comments?refType=blog&refId=${blog._id || blog.slug}&status=approved`);
      setComments(res.data.comments || []);
    } catch (err) {
      setCommentError("Gửi bình luận thất bại. Vui lòng thử lại.");
    } finally {
      setCommentLoading(false);
      setTimeout(() => setCommentSuccess(false), 2000);
    }
  };

  const tagsArr = blog?.tags
    ? (blog.tags[lang] || blog.tags.vi || [])
    : [];
  const relatedPosts = blogs.filter(b => b.slug !== blog.slug).slice(0, 3);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-lg">Đang tải bài viết...</div>;
  }

  if (!blog) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-6xl mb-4">📝</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Không tìm thấy bài viết</h1>
          <p className="text-gray-600 mb-6">Bài viết bạn đang tìm kiếm không tồn tại hoặc đã được di chuyển.</p>
          <button
            onClick={() => navigate('/blogs')}
            className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-400 text-white font-semibold rounded-xl hover:from-green-700 hover:to-green-500 transition-all duration-300"
          >
            Xem tất cả bài viết
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{blog.title?.[lang] || blog.title?.vi || ''} | Homie Travel Blog</title>
        <meta name="description" content={blog.content?.[lang] || blog.content?.vi || blog.content?.en || blog.content?.vi || ''} />
      </Helmet>

      <div className="min-h-screen bg-light">
        {/* Hero Section */}
        <section className="relative h-96 md:h-[500px] overflow-hidden">
          <img
            src={blog.thumbnail}
            alt={blog.title?.[lang] || blog.title?.vi || ''}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="absolute top-6 left-6 z-10 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300"
          >
            <FaArrowLeft />
          </button>

          {/* Action Buttons */}
          <div className="absolute top-6 right-6 z-10 flex gap-2">
            <button
              onClick={() => setIsBookmarked(!isBookmarked)}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${isBookmarked
                  ? "bg-green-500 text-white"
                  : "bg-white/20 backdrop-blur-sm text-white hover:bg-white/30"
                }`}
            >
              <FaBookmark className={`text-lg ${isBookmarked ? "fill-current" : "hover:fill-green-500"}`} />
            </button>
            <button className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300">
              <FaShare />
            </button>
          </div>

          {/* Hero Content */}
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
            <div className="max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">
                  {blog.title?.[lang] || blog.title?.vi || ''}
                </h1>
                <div className="flex items-center gap-6 text-white/90">
                  <div className="flex items-center gap-2">
                    <FaUser className="text-green-300" />
                    <span>{blog.author}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaCalendar className="text-green-300" />
                    <span>{new Date(blog.createdDate).toLocaleDateString('vi-VN')}</span>
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
                {/* Article Content */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="bg-white rounded-2xl shadow-lg p-8 mb-8"
                >
                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {tagsArr.map((tag: string) => (
                      <span key={tag} className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Content */}
                  <div className="prose prose-lg max-w-none">
                    <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                      {blog.content?.[lang] || blog.content?.vi || blog.content?.en || ''}
                    </p>
                  </div>

                  {/* Action Bar */}
                  <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => setIsLiked(!isLiked)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 ${isLiked
                            ? "bg-red-100 text-red-600"
                            : "bg-gray-100 text-gray-600 hover:bg-red-100 hover:text-red-600"
                          }`}
                      >
                        <FaHeart className={isLiked ? "fill-current" : ""} />
                        <span>{isLiked ? "Đã thích" : "Thích"}</span>
                      </button>
                      <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-600 rounded-full">
                        <FaComment />
                        <span>{comments.length} bình luận</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500 text-sm">Chia sẻ:</span>
                      <button className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors">
                        <FaFacebook className="text-sm" />
                      </button>
                      <button className="w-8 h-8 bg-sky-500 text-white rounded-full flex items-center justify-center hover:bg-sky-600 transition-colors">
                        <FaTwitter className="text-sm" />
                      </button>
                      <button className="w-8 h-8 bg-blue-700 text-white rounded-full flex items-center justify-center hover:bg-blue-800 transition-colors">
                        <FaLinkedin className="text-sm" />
                      </button>
                    </div>
                  </div>
                </motion.div>

                {/* Comment Section */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="bg-white rounded-2xl shadow-lg p-8"
                >
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">Bình luận ({comments.length})</h2>

                  {/* Comment Form */}
                  <form onSubmit={handleSubmit} className="mb-8 bg-gray-50 p-6 rounded-xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <input
                        type="text"
                        placeholder="Tên của bạn"
                        className="w-full p-3 rounded-lg border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-300"
                        value={author}
                        onChange={e => setAuthor(e.target.value)}
                        required
                      />
                      <input
                        type="email"
                        placeholder="Email (không bắt buộc)"
                        className="w-full p-3 rounded-lg border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-300"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                      />
                    </div>
                    <textarea
                      placeholder="Nội dung bình luận..."
                      className="w-full p-3 rounded-lg border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-300 resize-none"
                      value={content}
                      onChange={e => setContent(e.target.value)}
                      rows={4}
                      required
                    />
                    <button
                      type="submit"
                      className="mt-4 bg-gradient-to-r from-green-600 to-green-400 text-white px-6 py-3 rounded-lg hover:from-green-700 hover:to-green-500 transition-all duration-300 font-semibold"
                      disabled={commentLoading}
                    >
                      {commentLoading ? "Đang gửi..." : "Gửi bình luận"}
                    </button>
                    {commentError && <div className="text-red-500 mt-2">{commentError}</div>}
                    {commentSuccess && <div className="text-green-600 mt-2">Gửi bình luận thành công! Bình luận sẽ hiển thị sau khi được duyệt.</div>}
                  </form>

                  {/* Comments List */}
                  <div className="space-y-6">
                    {commentLoading && <div className="text-center py-8 text-gray-500">Đang tải bình luận...</div>}
                    {!commentLoading && comments.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        <div className="text-4xl mb-2">💬</div>
                        <p>Chưa có bình luận nào. Hãy là người đầu tiên bình luận!</p>
                      </div>
                    )}
                    {comments.map((comment: any) => (
                      <div key={comment._id || comment.id} className="flex gap-4 p-4 bg-gray-50 rounded-xl">
                        <img
                          src={comment.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"}
                          alt={comment.name || comment.author}
                          className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-semibold text-gray-800">{comment.name || comment.author}</span>
                            <span className="text-sm text-gray-500">
                              {comment.createdAt ? new Date(comment.createdAt).toLocaleDateString('vi-VN') : ''}
                            </span>
                          </div>
                          <p className="text-gray-700 leading-relaxed">{comment.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>

              {/* Right Column - Sidebar */}
              <div className="lg:col-span-1">
                {/* Author Info */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="bg-white rounded-2xl shadow-lg p-8 mb-6 sticky top-6"
                >
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Tác giả</h3>
                  <div className="text-center">
                    <img
                      src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
                      alt={blog.author}
                      className="w-24 h-24 rounded-full object-cover mx-auto mb-4"
                    />
                    <h4 className="font-semibold text-gray-800 mb-2 text-lg">{blog.author}</h4>
                    <p className="text-gray-600 mb-4">Travel Blogger & Photographer</p>
                    <div className="text-sm text-gray-500">
                      <p>Chuyên viết về du lịch Hà Giang</p>
                      <p>Kinh nghiệm 5+ năm</p>
                    </div>
                  </div>
                </motion.div>

                {/* Related Posts */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="bg-white rounded-2xl shadow-lg p-8"
                >
                  <h3 className="text-xl font-bold text-gray-800 mb-6">Bài viết liên quan</h3>
                  <div className="space-y-6">
                    {relatedPosts.map((post) => (
                      <div key={post.id} className="flex gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer">
                        <img
                          src={post.thumbnail}
                          alt={post.title?.[lang] || post.title?.vi || ''}
                          className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                        />
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-800 text-sm line-clamp-3 mb-2 leading-tight">
                            {post.title?.[lang] || post.title?.vi || ''}
                          </h4>
                          <p className="text-xs text-gray-500 mb-2">
                            {new Date(post.createdDate).toLocaleDateString('vi-VN')}
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {(post.tags && (post.tags[lang] || post.tags.vi) || []).slice(0, 2).map((tag: any) => (
                              <span key={tag} className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
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