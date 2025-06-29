import BlogCard from "@/components/BlogCard";
import { Blog as BlogType } from "@/types/BlogType";
import { Helmet } from 'react-helmet-async';
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { FaSearch, FaFilter, FaCalendar, FaUser, FaTag, FaEye, FaHeart } from 'react-icons/fa';

const blogs: BlogType[] = [
  {
    id: "1",
    title: "Khám phá Hà Giang mùa hoa tam giác mạch",
    slug: "kham-pha-ha-giang-mua-hoa-tam-giac-mach",
    content: "Hà Giang mùa hoa tam giác mạch là một trải nghiệm không thể bỏ lỡ. Những cánh đồng hoa tím hồng trải dài trên những sườn núi tạo nên khung cảnh thiên nhiên tuyệt đẹp...",
    tags: "Hà Giang,Du lịch,Phong cảnh",
    author: "Nguyễn Văn A",
    thumbnail: "src/assets/1.jpg",
    createdDate: new Date("2024-05-01"),
  },
  {
    id: "2",
    title: "Hành trình chinh phục đèo Mã Pí Lèng",
    slug: "hanh-trinh-chinh-phuc-deo-ma-pi-leng",
    content: "Đèo Mã Pí Lèng là một trong tứ đại đỉnh đèo của Việt Nam. Với độ cao 1.500m so với mực nước biển, con đèo này mang đến những trải nghiệm phượt tuyệt vời...",
    tags: "Đèo,Phượt,Trải nghiệm",
    author: "Trần Thị B",
    thumbnail: "src/assets/2.png",
    createdDate: new Date("2024-04-20"),
  },
  {
    id: "3",
    title: "Văn hóa dân tộc H'Mông tại Hà Giang",
    slug: "van-hoa-dan-toc-hmong-tai-ha-giang",
    content: "Khám phá văn hóa độc đáo của người H'Mông tại Hà Giang. Từ trang phục truyền thống đến những phong tục tập quán đặc sắc...",
    tags: "Văn hóa,Dân tộc,H'Mông",
    author: "Lê Văn C",
    thumbnail: "src/assets/3.jpg",
    createdDate: new Date("2024-04-15"),
  },
  {
    id: "4",
    title: "Ẩm thực Hà Giang - Những món ăn không thể bỏ lỡ",
    slug: "am-thuc-ha-giang-nhung-mon-an-khong-the-bo-lo",
    content: "Hà Giang không chỉ nổi tiếng với phong cảnh đẹp mà còn có nền ẩm thực phong phú với những món ăn đặc trưng của vùng núi...",
    tags: "Ẩm thực,Món ăn,Đặc sản",
    author: "Phạm Thị D",
    thumbnail: "src/assets/4.jpg",
    createdDate: new Date("2024-04-10"),
  },
  {
    id: "5",
    title: "Homestay Hà Giang - Trải nghiệm lưu trú độc đáo",
    slug: "homestay-ha-giang-trai-nghiem-luu-tru-doc-dao",
    content: "Khám phá những homestay đẹp tại Hà Giang, nơi bạn có thể trải nghiệm cuộc sống của người dân địa phương...",
    tags: "Homestay,Lưu trú,Trải nghiệm",
    author: "Vũ Văn E",
    thumbnail: "src/assets/1.jpg",
    createdDate: new Date("2024-04-05"),
  },
  {
    id: "6",
    title: "Mùa vàng Hà Giang - Khi lúa chín rực rỡ",
    slug: "mua-vang-ha-giang-khi-lua-chin-ruc-ro",
    content: "Mùa lúa chín tại Hà Giang tạo nên những cánh đồng vàng rực rỡ, là thời điểm đẹp nhất để khám phá vùng đất này...",
    tags: "Mùa vàng,Lúa chín,Phong cảnh",
    author: "Hoàng Thị F",
    thumbnail: "src/assets/2.png",
    createdDate: new Date("2024-03-30"),
  },
];

const categories = [
  { id: "all", name: "Tất cả", icon: FaTag },
  { id: "travel", name: "Du lịch", icon: FaEye },
  { id: "culture", name: "Văn hóa", icon: FaHeart },
  { id: "food", name: "Ẩm thực", icon: FaTag },
  { id: "experience", name: "Trải nghiệm", icon: FaEye },
];

function Blog() {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("latest");

  // Filter blogs based on search and category
  const filteredBlogs = blogs.filter((blog) => {
    const matchesSearch = blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         blog.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         blog.tags.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || 
                           blog.tags.toLowerCase().includes(selectedCategory);
    return matchesSearch && matchesCategory;
  });

  // Sort blogs
  const sortedBlogs = [...filteredBlogs].sort((a, b) => {
    if (sortBy === "latest") {
      return new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime();
    } else if (sortBy === "oldest") {
      return new Date(a.createdDate).getTime() - new Date(b.createdDate).getTime();
    }
    return 0;
  });

  return (
    <>
      <Helmet>
        <title>{t('blog.title')}</title>
        <meta name="description" content={t('blog.description')} />
        <meta property="og:title" content={t('blog.title')} />
        <meta property="og:description" content={t('blog.description')} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://homieTravel.vn/blog" />
        <meta property="og:image" content="https://homieTravel.vn/og-image.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={t('blog.title')} />
        <meta name="twitter:description" content={t('blog.description')} />
        <meta name="twitter:image" content="https://homieTravel.vn/og-image.jpg" />
      </Helmet>

      {/* Hero Section */}
      <section className="relative h-80 bg-gradient-to-r from-purple-600 to-pink-600 overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-40"></div>
        <div className="relative z-10 flex items-center justify-center h-full">
          <div className="text-center text-white">
            <h1 className="text-5xl font-bold mb-4">Blog Du Lịch Hà Giang</h1>
            <p className="text-xl max-w-2xl mx-auto px-4">
              Khám phá những câu chuyện, trải nghiệm và bí kíp du lịch Hà Giang từ những người yêu du lịch
            </p>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent"></div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-8 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            {/* Search Bar */}
            <div className="mb-6">
              <div className="relative w-full">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Tìm kiếm bài viết..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                />
              </div>
            </div>

            {/* Filters Container */}
            <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">
              {/* Category Filter */}
              <div className="flex-1">
                <div className="flex items-center text-gray-600 mb-3">
                  <FaFilter className="mr-2" />
                  <span className="font-medium text-sm">Danh mục:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => {
                    const Icon = category.icon;
                    return (
                      <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.id)}
                        className={`flex items-center px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-300 whitespace-nowrap ${
                          selectedCategory === category.id
                            ? 'bg-purple-600 text-white shadow-lg'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        <Icon className="mr-1.5 text-xs" />
                        {category.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Sort Options */}
              <div className="flex items-center gap-3 xl:flex-shrink-0">
                <div className="flex items-center text-gray-600">
                  <FaCalendar className="mr-2" />
                  <span className="font-medium text-sm">Sắp xếp:</span>
                </div>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="block px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors text-sm min-w-[120px]"
                >
                  <option value="latest">Mới nhất</option>
                  <option value="oldest">Cũ nhất</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Posts Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Bài Viết Mới Nhất</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Khám phá những câu chuyện thú vị và kinh nghiệm du lịch Hà Giang từ cộng đồng
            </p>
          </div>

          {/* Results Count */}
          <div className="mb-8">
            <p className="text-gray-600">
              Tìm thấy <span className="font-semibold text-purple-600">{sortedBlogs.length}</span> bài viết
            </p>
          </div>

          {/* Blog Grid */}
          {sortedBlogs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {sortedBlogs.map((blog) => (
                <div key={blog.id} className="group">
                  <BlogCard blog={blog} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaSearch className="text-3xl text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Không tìm thấy bài viết</h3>
              <p className="text-gray-600 mb-6">
                Hãy thử thay đổi từ khóa tìm kiếm hoặc danh mục
              </p>
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("all");
                }}
                className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
              >
                Xóa bộ lọc
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-gradient-to-r from-purple-600 to-pink-600">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl font-bold text-white mb-4">Đăng Ký Nhận Tin</h2>
          <p className="text-xl text-purple-100 mb-8">
            Nhận những bài viết mới nhất về du lịch Hà Giang qua email
          </p>
          <div className="flex max-w-md mx-auto">
            <input
              type="email"
              placeholder="Email của bạn"
              className="flex-1 px-4 py-3 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-white"
            />
            <button className="bg-white text-purple-600 px-6 py-3 rounded-r-lg font-semibold hover:bg-gray-100 transition-colors">
              Đăng Ký
            </button>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Danh Mục Nổi Bật</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Khám phá các chủ đề du lịch Hà Giang được quan tâm nhất
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {categories.slice(1).map((category) => {
              const Icon = category.icon;
              return (
                <div key={category.id} className="text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="text-2xl text-purple-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">{category.name}</h3>
                  <p className="text-gray-600">
                    {category.id === "travel" && "Khám phá những địa điểm du lịch đẹp"}
                    {category.id === "culture" && "Tìm hiểu văn hóa dân tộc độc đáo"}
                    {category.id === "food" && "Thưởng thức ẩm thực đặc sắc"}
                    {category.id === "experience" && "Chia sẻ trải nghiệm thực tế"}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}

export default Blog;