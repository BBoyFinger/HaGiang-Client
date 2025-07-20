import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiMapPin, FiCalendar, FiHome, FiTruck, FiFileText } from 'react-icons/fi';
import { FaSearch, FaTimes } from 'react-icons/fa';
import axiosInstance from '@/config/axiosConfig';

interface SearchResult {
  id: string;
  type: 'tour' | 'blog' | 'destination' | 'rent' | 'stay';
  title: string;
  description: string;
  image?: string;
  url: string;
  rating?: number;
  price?: number;
}

export default function SearchBar() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'tour' | 'blog' | 'destination' | 'rent' | 'stay'>('all');
  const searchRef = useRef<HTMLDivElement>(null);

  // Đóng kết quả khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Tìm kiếm khi query thay đổi
  useEffect(() => {
    const searchData = async () => {
      if (query.trim().length < 2) {
        setResults([]);
        setShowResults(false);
        return;
      }

      setIsLoading(true);
      setShowResults(true);

      try {
        const searchPromises = [];

        // Tìm kiếm tours
        if (activeTab === 'all' || activeTab === 'tour') {
          searchPromises.push(
            axiosInstance.get(`/tours?search=${encodeURIComponent(query)}`)
              .then(res => res.data.tours?.map((tour: any) => ({
                id: tour._id,
                type: 'tour' as const,
                title: tour.name,
                description: tour.description,
                image: tour.images?.[0],
                url: `/tours/${tour._id}`,
                rating: tour.rating,
                price: tour.price
              })) || [])
              .catch(() => [])
          );
        }

        // Tìm kiếm destinations
        if (activeTab === 'all' || activeTab === 'destination') {
          searchPromises.push(
            axiosInstance.get(`/destinations?search=${encodeURIComponent(query)}`)
              .then(res => res.data.destinations?.map((dest: any) => {
                const lang = 'vi'; // Default to Vietnamese
                const name = typeof dest.name === 'object' ? dest.name[lang] || dest.name.vi : dest.name;
                const description = typeof dest.description === 'object' ? dest.description[lang] || dest.description.vi : dest.description;
                
                return {
                  id: dest._id,
                  type: 'destination' as const,
                  title: name || '',
                  description: description || '',
                  image: dest.images?.[0],
                  url: `/destinations/${dest.slug}`,
                  rating: dest.rating
                };
              }) || [])
              .catch(() => [])
          );
        }

        // Tìm kiếm blogs
        if (activeTab === 'all' || activeTab === 'blog') {
          searchPromises.push(
            axiosInstance.get(`/blogs?search=${encodeURIComponent(query)}`)
              .then(res => res.data.blogs?.map((blog: any) => {
                const lang = 'vi'; // Default to Vietnamese
                const title = typeof blog.title === 'object' ? blog.title[lang] || blog.title.vi : blog.title;
                const content = typeof blog.content === 'object' ? blog.content[lang] || blog.content.vi : blog.content;
                const excerpt = typeof blog.excerpt === 'object' ? blog.excerpt[lang] || blog.excerpt.vi : blog.excerpt;
                
                return {
                  id: blog._id,
                  type: 'blog' as const,
                  title: title || '',
                  description: excerpt || content?.substring(0, 100) || '',
                  image: blog.featuredImage,
                  url: `/blogs/${blog.slug}`,
                  rating: blog.rating
                };
              }) || [])
              .catch(() => [])
          );
        }

        // Tìm kiếm accommodations (stay)
        if (activeTab === 'all' || activeTab === 'stay') {
          searchPromises.push(
            axiosInstance.get(`/accommodations?search=${encodeURIComponent(query)}`)
              .then(res => res.data.accommodations?.map((stay: any) => ({
                id: stay._id,
                type: 'stay' as const,
                title: stay.name,
                description: stay.description,
                image: stay.images?.[0],
                url: `/stays/${stay._id}`,
                rating: stay.rating,
                price: stay.price
              })) || [])
              .catch(() => [])
          );
        }

        // Tìm kiếm vehicles (rent)
        if (activeTab === 'all' || activeTab === 'rent') {
          searchPromises.push(
            axiosInstance.get(`/vehicles?search=${encodeURIComponent(query)}`)
              .then(res => res.data.vehicles?.map((vehicle: any) => ({
                id: vehicle._id,
                type: 'rent' as const,
                title: vehicle.name,
                description: vehicle.description,
                image: vehicle.images?.[0],
                url: `/rents/${vehicle._id}`,
                rating: vehicle.rating,
                price: vehicle.price
              })) || [])
              .catch(() => [])
          );
        }

        const allResults = await Promise.all(searchPromises);
        const combinedResults = allResults.flat().slice(0, 10); // Giới hạn 10 kết quả
        setResults(combinedResults);

      } catch (error) {
        console.error('Search error:', error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimer = setTimeout(searchData, 300);
    return () => clearTimeout(debounceTimer);
  }, [query, activeTab]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query)}&type=${activeTab}`);
      setShowResults(false);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'tour': return <FiCalendar className="text-blue-500" />;
      case 'destination': return <FiMapPin className="text-green-500" />;
      case 'blog': return <FiFileText className="text-purple-500" />;
      case 'stay': return <FiHome className="text-orange-500" />;
      case 'rent': return <FiTruck className="text-red-500" />;
      default: return <FiSearch className="text-gray-500" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'tour': return t('search.types.tour') || 'Tour';
      case 'destination': return t('search.types.destination') || 'Destination';
      case 'blog': return t('search.types.blog') || 'Blog';
      case 'stay': return t('search.types.stay') || 'Stay';
      case 'rent': return t('search.types.rent') || 'Rent';
      default: return type;
    }
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto" ref={searchRef}>
      {/* Search Input */}
      <form onSubmit={handleSearch} className="relative">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('search.placeholder') || 'Tìm kiếm tour, điểm đến, blog, homestay, xe...'}
            className="w-full px-6 py-4 pl-14 pr-20 text-lg bg-white rounded-2xl shadow-lg border-2 border-transparent focus:border-purple-500 focus:outline-none transition-all duration-300"
          />
          <FiSearch className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
          <button
            type="submit"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300"
          >
            {t('search.search') || 'Tìm'}
          </button>
        </div>
      </form>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 mt-4 justify-center">
        {[
          { key: 'all', label: t('search.tabs.all') || 'Tất cả', icon: <FiSearch /> },
          { key: 'tour', label: t('search.tabs.tour') || 'Tour', icon: <FiCalendar /> },
          { key: 'destination', label: t('search.tabs.destination') || 'Điểm đến', icon: <FiMapPin /> },
          { key: 'blog', label: t('search.tabs.blog') || 'Blog', icon: <FiFileText /> },
          { key: 'stay', label: t('search.tabs.stay') || 'Homestay', icon: <FiHome /> },
          { key: 'rent', label: t('search.tabs.rent') || 'Thuê xe', icon: <FiTruck /> }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
              activeTab === tab.key
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Search Results */}
      <AnimatePresence>
        {showResults && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-200 max-h-96 overflow-y-auto z-50"
          >
            {isLoading ? (
              <div className="p-6 text-center text-gray-500">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-2"></div>
                {t('search.loading') || 'Đang tìm kiếm...'}
              </div>
            ) : results.length > 0 ? (
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {t('search.results') || 'Kết quả tìm kiếm'} ({results.length})
                  </h3>
                  <button
                    onClick={() => setShowResults(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <FaTimes />
                  </button>
                </div>
                <div className="space-y-3">
                  {results.map((result) => (
                    <Link
                      key={`${result.type}-${result.id}`}
                      to={result.url}
                      onClick={() => setShowResults(false)}
                      className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-all duration-200 group"
                    >
                      <div className="flex-shrink-0">
                        {result.image ? (
                          <img
                            src={result.image}
                            alt={result.title}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-lg bg-gray-200 flex items-center justify-center">
                            {getTypeIcon(result.type)}
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs px-2 py-1 rounded-full bg-purple-100 text-purple-600 font-medium">
                            {getTypeLabel(result.type)}
                          </span>
                          {result.rating && (
                            <div className="flex items-center gap-1 text-yellow-500">
                              <span className="text-sm">★</span>
                              <span className="text-xs">{result.rating}</span>
                            </div>
                          )}
                        </div>
                        <h4 
                          className="font-semibold text-gray-800 group-hover:text-purple-600 transition-colors truncate"
                          dangerouslySetInnerHTML={{
                            __html: typeof result.title === 'object' && result.title !== null 
                              ? ((result.title as any).vi || (result.title as any).en || JSON.stringify(result.title))
                              : result.title || 'Không có tiêu đề'
                          }}
                        />
                        <p 
                          className="text-sm text-gray-600 line-clamp-2"
                          dangerouslySetInnerHTML={{
                            __html: typeof result.description === 'object' && result.description !== null 
                              ? ((result.description as any).vi || (result.description as any).en || JSON.stringify(result.description))
                              : result.description || 'Không có mô tả'
                          }}
                        />
                        {result.price && (
                          <div className="text-sm font-semibold text-green-600 mt-1">
                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(result.price)}
                          </div>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <Link
                    to={`/search?q=${encodeURIComponent(query)}&type=${activeTab}`}
                    onClick={() => setShowResults(false)}
                    className="text-center block text-purple-600 hover:text-purple-700 font-medium"
                  >
                    {t('search.viewAll') || 'Xem tất cả kết quả'}
                  </Link>
                </div>
              </div>
            ) : query.trim().length >= 2 ? (
              <div className="p-6 text-center text-gray-500">
                <FiSearch className="mx-auto text-4xl mb-2 text-gray-300" />
                <p>{t('search.noResults') || 'Không tìm thấy kết quả'}</p>
                <p className="text-sm mt-1">{t('search.tryDifferent') || 'Thử từ khóa khác'}</p>
              </div>
            ) : null}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 