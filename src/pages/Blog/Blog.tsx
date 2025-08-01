import BlogCard from "@/components/BlogCard";
import { Helmet } from 'react-helmet-async';
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import { FaSearch, FaFilter, FaCalendar, FaUser, FaTag, FaEye, FaHeart } from 'react-icons/fa';
import axiosInstance from "@/config/axiosConfig";
import { mockBlogs } from "@/data/mockBlogs";
import LoadingSpinner, { CardLoading } from "@/components/LoadingSpinner";

function Blog() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language === 'en' ? 'en' : 'vi';
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("latest");
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const categories = [
    { id: "all", name: t("blog.all"), icon: FaTag },
    { id: "travel", name: t("blog.travel"), icon: FaEye },
    { id: "culture", name: t("blog.culture"), icon: FaHeart },
    { id: "food", name: t("blog.food"), icon: FaTag },
    { id: "experience", name: t("blog.experience"), icon: FaEye },
  ];

  useEffect(() => {
    axiosInstance.get("/blogs")
      .then(res => {
        setBlogs(res.data.blogs || res.data);
      })
      .catch(() => {
        setBlogs(mockBlogs);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Filter blogs based on search and category
  const filteredBlogs = blogs.filter((blog) => {
    const tags = blog.tags && blog.tags[lang] ? blog.tags[lang].join(",") : (blog.tags?.vi || []).join(",");
    const matchesSearch = (blog.title?.[lang] || blog.title?.vi || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (blog.content?.[lang] || blog.content?.vi || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      tags.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" ||
      tags.toLowerCase().includes(selectedCategory);
    return matchesSearch && matchesCategory;
  });

  // Sort blogs
  const sortedBlogs = [...filteredBlogs].sort((a, b) => {
    const aDate = new Date(a.createdAt || a.createdDate);
    const bDate = new Date(b.createdAt || b.createdDate);
    if (sortBy === "latest") {
      return bDate.getTime() - aDate.getTime();
    } else if (sortBy === "oldest") {
      return aDate.getTime() - bDate.getTime();
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
      <section className="relative h-80 bg-gradient-to-r from-primary to-accent overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-40"></div>
        <div className="relative z-10 flex items-center justify-center h-full">
          <div className="text-center text-light">
            <h1 className="text-5xl font-bold mb-4">{t('blog.title')}</h1>
            <p className="text-xl max-w-2xl mx-auto px-4">
              {t('blog.description')}
            </p>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-light to-transparent"></div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-8 bg-secondary/20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-light rounded-2xl shadow-lg p-6">
            {/* Search Bar */}
            <div className="mb-6">
              <div className="relative w-full">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="h-5 w-5 text-earth" />
                </div>
                <input
                  type="text"
                  placeholder={t('blog.searchPlaceholder')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-earth rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors text-[#1a1a1a] placeholder:text-[#555]"
                />
              </div>
            </div>

            {/* Filters Container */}
            <div className="flex flex-col xl:flex-row xl:items-center justify-center gap-6">
              {/* Category Filter */}
              <div className="flex-1">
                <div className="flex items-center text-[#555] mb-3">
                  <FaFilter className="mr-2 text-primary" />
                  <span className="font-medium text-sm">{t('blog.categoryLabel')}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => {
                    const Icon = category.icon;
                    return (
                      <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.id)}
                        className={`flex items-center px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-300 whitespace-nowrap ${selectedCategory === category.id
                            ? 'bg-gradient-to-r from-primary to-accent text-[#1a1a1a] shadow-lg font-semibold'
                            : 'bg-light text-[#555] hover:bg-secondary border border-earth font-medium'
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
                <div className="flex items-center text-[#555]">
                  <FaCalendar className="mr-2 text-primary" />
                  <span className="font-medium text-sm">{t('blog.sortLabel')}</span>
                </div>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="block px-3 py-2 border border-earth rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors text-sm min-w-[120px] text-[#1a1a1a]"
                >
                  <option value="latest">{t('blog.sortLatest')}</option>
                  <option value="oldest">{t('blog.sortOldest')}</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Posts Section */}
      <section className="py-16 bg-light">
        <div className="max-w-7xl mx-auto px-4">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#1a1a1a] mb-4">{t('blog.latestPosts')}</h2>
            <p className="text-lg text-[#555] max-w-2xl mx-auto">
              {t('blog.latestPostsDesc')}
            </p>
          </div>

          {/* Results Count */}
          <div className="mb-8">
            <p className="text-[#555]">
            {t('blog.found', { count: sortedBlogs.length, interpolation: { escapeValue: false }, 1: (chunks: any) => <span className="font-semibold text-primary">{chunks}</span> })}
            </p>
          </div>

          {/* Blog Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <CardLoading />
              <CardLoading />
              <CardLoading />
              <CardLoading />
              <CardLoading />
              <CardLoading />
            </div>
          ) : sortedBlogs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {sortedBlogs.map((blog) => (
                <div key={blog.slug} className="group">
                  <BlogCard blog={blog} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-light rounded-full flex items-center justify-center mx-auto mb-4">
                <FaSearch className="text-3xl text-secondary" />
              </div>
              <h3 className="text-xl font-semibold text-[#1a1a1a] mb-2">{t('blog.notFoundTitle')}</h3>
              <p className="text-[#555] mb-6">
                {t('blog.notFoundDesc')}
              </p>
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("all");
                }}
                className="bg-gradient-to-r from-primary to-accent text-[#1a1a1a] px-6 py-2 rounded-lg hover:from-accent hover:to-primary transition-colors font-semibold"
              >
                {t('blog.clearFilter')}
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-gradient-to-r from-primary to-accent">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl font-bold text-[#1a1a1a] mb-4">{t('blog.newsletterTitle')}</h2>
          <p className="text-xl text-[#555] mb-8">
            {t('blog.newsletterDesc')}
          </p>
          <div className="flex max-w-md mx-auto">
            <input
              type="email"
              placeholder={t('blog.newsletterPlaceholder')}
              className="flex-1 px-4 py-3 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-primary text-[#1a1a1a]"
            />
            <button className="bg-light text-primary px-6 py-3 rounded-r-lg font-semibold hover:bg-secondary transition-colors">
              {t('blog.newsletterButton')}
            </button>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-16 bg-secondary/20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#1a1a1a] mb-4">{t('blog.featuredTitle')}</h2>
            <p className="text-lg text-[#555] max-w-2xl mx-auto">
              {t('blog.featuredDesc')}
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {categories.slice(1).map((category) => {
              const Icon = category.icon;
              return (
                <div key={category.id} className="text-center">
                  <div className="w-16 h-16 bg-secondary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="text-2xl text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-[#1a1a1a] mb-2">{category.name}</h3>
                  <p className="text-[#555]">
                    {category.id === "travel" && t('blog.featuredTravel')}
                    {category.id === "culture" && t('blog.featuredCulture')}
                    {category.id === "food" && t('blog.featuredFood')}
                    {category.id === "experience" && t('blog.featuredExperience')}
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