import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { FiSearch, FiMapPin, FiCalendar, FiHome, FiTruck, FiFileText, FiFilter } from 'react-icons/fi';
import { FaStar, FaTimes } from 'react-icons/fa';
import axiosInstance from '@/config/axiosConfig';
import TourCard from '@/components/TourCard';
import DestinationCard from '@/components/DestinationCard';
import BlogCard from '@/components/BlogCard';
// import AccommodationCard from '@/components/AccommodationCard..tsx';
import VehicleCard from '@/components/VehicleCard';

interface SearchResult {
    id: string;
    type: 'tour' | 'blog' | 'destination' | 'rent' | 'stay';
    title: string;
    description: string;
    image?: string;
    url: string;
    rating?: number;
    price?: number;
    data: any; // Original data
}

export default function Search() {
    const { t } = useTranslation();
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q') || '';
    const type = searchParams.get('type') || 'all';

    const [results, setResults] = useState<SearchResult[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'all' | 'tour' | 'blog' | 'destination' | 'rent' | 'stay'>(type as any);
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        if (query) {
            performSearch();
        }
    }, [query, activeTab]);

    const performSearch = async () => {
        setLoading(true);
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
                            price: tour.price.VND.perSlot,
                            data: tour
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
                                rating: dest.rating,
                                data: dest
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
                                rating: blog.rating,
                                data: blog
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
                            price: stay.price,
                            data: stay
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
                            price: vehicle.price,
                            data: vehicle
                        })) || [])
                        .catch(() => [])
                );
            }

            const allResults = await Promise.all(searchPromises);
            const combinedResults = allResults.flat();
            setResults(combinedResults);

        } catch (error) {
            console.error('Search error:', error);
            setResults([]);
        } finally {
            setLoading(false);
        }
    };


    const renderResult = (result: SearchResult) => {
        switch (result.type) {
            case 'tour':
                return <TourCard key={result.id} tour={result.data} />;
            case 'destination':
                return <DestinationCard key={result.id} destination={result.data} isDark={false} />;
            case 'blog':
                return <BlogCard key={result.id} blog={result.data} />;
            case 'stay':
                // Temporarily return a simple div instead of AccommodationCard
                return (
                    <div key={result.id} className="bg-white rounded-lg shadow-md p-4">
                        <h3 className="font-semibold text-lg">{result.title}</h3>
                        <p className="text-gray-600">{result.description}</p>
                    </div>
                );
            case 'rent':
                return <VehicleCard key={result.id} vehicle={result.data} />;
            default:
                return null;
        }
    };

    const filteredResults = results.filter(result =>
        activeTab === 'all' || result.type === activeTab
    );

    return (
        <>
            <Helmet>
                <title>{t('search.results')} - {query} | Ha Giang Travel</title>
                <meta name="description" content={`Kết quả tìm kiếm cho "${query}" trên Ha Giang Travel`} />
            </Helmet>

            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50">
                {/* Header */}
                <div className="bg-white shadow-sm border-b">
                    <div className="max-w-7xl mx-auto px-4 py-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-800">
                                    {t('search.results')} "{query}"
                                </h1>
                                <p className="text-gray-600 mt-2">
                                    {loading ? t('search.loading') : `${filteredResults.length} kết quả tìm thấy`}
                                </p>
                            </div>
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                <FiFilter />
                                {t('search.filters') || 'Bộ lọc'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                {showFilters && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-white border-b"
                    >
                        <div className="max-w-7xl mx-auto px-4 py-4">
                            <div className="flex flex-wrap gap-2">
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
                                        className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${activeTab === tab.key
                                            ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                                            : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                                            }`}
                                    >
                                        {tab.icon}
                                        {tab.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Results */}
                <div className="max-w-7xl mx-auto px-4 py-8">
                    {loading ? (
                        <div className="text-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
                            <p className="text-gray-600">{t('search.loading')}</p>
                        </div>
                    ) : filteredResults.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredResults.map((result) => (
                                <motion.div
                                    key={`${result.type}-${result.id}`}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    
                                    {renderResult(result)}
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <FiSearch className="mx-auto text-6xl text-gray-300 mb-4" />
                            <h3 className="text-xl font-semibold text-gray-600 mb-2">
                                {t('search.noResults')}
                            </h3>
                            <p className="text-gray-500">
                                {t('search.tryDifferent')}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
} 