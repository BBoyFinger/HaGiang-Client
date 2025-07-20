import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion"
import { useTranslation } from "react-i18next";
import DestinationCard from "@/components/DestinationCard";
import HeroCarousel from "@/components/HeroCarousel";
import SearchBar from "@/components/SearchBar";
import image1 from "@/assets/1.jpg";
import TourCard from "@/components/TourCard";
import logo from "@/assets/logo.jpg";
import { FaHandHoldingHeart, FaHandsHelping, FaMountain, FaRegHandshake, FaArrowRight, FaUsers, FaStar, FaClock, FaMapMarkerAlt, FaHeart, FaEye } from "react-icons/fa";
import { Helmet } from 'react-helmet-async';
import { mockTours } from "../data/tours";
import axiosInstance from "../config/axiosConfig";
import { mockDestinations } from "@/data/mockDestinations";
import { mockBlogs } from "@/data/mockBlogs";
import BlogCard from "@/components/BlogCard";

export default function Home() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language === 'en' ? 'en' : 'vi';
  const [tours, setTours] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [destinations, setDestinations] = useState<any[]>([]);
  const [blogs, setBlogs] = useState<any[]>([]);
  const [tourReviews, setTourReviews] = useState<Record<string, { averageRating: number, reviewCount: number }>>({});

  useEffect(() => {
    axiosInstance.get("/tours")
      .then(res => {
        setTours(res.data.tours);
      })
      .catch(() => {
        setTours(mockTours);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (tours.length > 0) {
      Promise.all(
        tours.map(async (tour: any) => {
          try {
            const res = await axiosInstance.get(`/reviews?tourId=${tour._id}`);
            const reviews = res.data.reviews || [];
            const averageRating = reviews.length > 0 ? (reviews.reduce((sum: number, r: any) => sum + (r.rating || 0), 0) / reviews.length) : 0;
            return { tourId: tour._id, averageRating: Number(averageRating.toFixed(1)), reviewCount: reviews.length };
          } catch {
            return { tourId: tour._id, averageRating: 0, reviewCount: 0 };
          }
        })
      ).then(results => {
        const reviewMap: Record<string, { averageRating: number, reviewCount: number }> = {};
        results.forEach(r => { reviewMap[r.tourId] = { averageRating: r.averageRating, reviewCount: r.reviewCount }; });
        setTourReviews(reviewMap);
      });
    }
  }, [tours]);

  useEffect(() => {
    axiosInstance.get("/destinations")
      .then(res => {
        setDestinations(res.data.destinations);
      })
      .catch(() => {
        setDestinations(mockDestinations);
      });
  }, []);

  useEffect(() => {
    axiosInstance.get("/blogs")
      .then(res => {
        setBlogs(res.data.blogs || res.data);
      })
      .catch(() => {
        setBlogs(mockBlogs);
      });
  }, []);

  const [isDark, setIsDark] = useState(false);
  const toggleTheme = () => setIsDark(!isDark);

  return (
    <>
      <Helmet>
        <title>{t('home.title')}</title>
        <meta name="description" content={t('home.description')} />
        <meta property="og:title" content={t('home.title')} />
        <meta property="og:description" content={t('home.description')} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://hagiangtravel.vn/" />
        <meta property="og:image" content="https://hagiangtravel.vn/og-image.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={t('home.title')} />
        <meta name="twitter:description" content={t('home.description')} />
        <meta name="twitter:image" content="https://hagiangtravel.vn/og-image.jpg" />
      </Helmet>

      <div className="bg-gradient-to-br from-gray-50 via-white to-purple-50">
        {/* Hero Section */}
        <section className="h-screen relative">
          <HeroCarousel isDark={isDark} />
          
          {/* Search Bar Overlay */}
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <div className="w-full max-w-4xl px-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="text-center mb-8"
              >
                <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
                  {t('home.hero.title') || 'Khám phá Hà Giang'}
                </h1>
                <p className="text-xl md:text-2xl text-white/90 drop-shadow-md max-w-2xl mx-auto">
                  {t('home.hero.subtitle') || 'Trải nghiệm vùng đất hoang dã và văn hóa độc đáo của miền núi phía Bắc'}
                </p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <SearchBar />
              </motion.div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaUsers className="text-white text-2xl" />
                </div>
                <h3 className="text-3xl font-bold text-gray-800 mb-2">{t('home.stats.satisfiedCustomersValue')}</h3>
                <p className="text-gray-600">{t('home.stats.satisfiedCustomers')}</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaStar className="text-white text-2xl" />
                </div>
                <h3 className="text-3xl font-bold text-gray-800 mb-2">{t('home.stats.averageRatingValue')}</h3>
                <p className="text-gray-600">{t('home.stats.averageRating')}</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaClock className="text-white text-2xl" />
                </div>
                <h3 className="text-3xl font-bold text-gray-800 mb-2">{t('home.stats.customerSupportValue')}</h3>
                <p className="text-gray-600">{t('home.stats.customerSupport')}</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaMapMarkerAlt className="text-white text-2xl" />
                </div>
                <h3 className="text-3xl font-bold text-gray-800 mb-2">{t('home.stats.destinationsValue')}</h3>
                <p className="text-gray-600">{t('home.stats.destinations')}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Brand Section */}
        <section className="py-20 bg-gradient-to-r from-purple-600 to-pink-600">
          <div className="max-w-7xl mx-auto px-4">
            <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12">
              <div className="flex flex-col lg:flex-row items-center gap-12">
                {/* Left: Logo */}
                <div className="flex-shrink-0">
                  <div className="relative">
                    <img src={logo} alt="Homie Travel" className="w-32 h-32 rounded-full object-cover shadow-lg" />
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <FaHeart className="text-white text-sm" />
                    </div>
                  </div>
                </div>

                {/* Right: Info */}
                <div className="flex-1 text-center lg:text-left">
                  <h2 className="text-3xl font-bold text-gray-800 mb-8">{t('home.whyChooseUsTitle')}</h2>
                  <div className="space-y-6">
                    <div className="flex items-center justify-center lg:justify-start gap-4">
                      <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                        <FaHandHoldingHeart className="text-red-500 text-xl" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">{t('brand.charity')}</h3>
                        <p className="text-gray-600">{t('home.whyChooseUsCharity')}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-center lg:justify-start gap-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <FaRegHandshake className="text-blue-500 text-xl" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">{t('brand.professional')}</h3>
                        <p className="text-gray-600">{t('home.whyChooseUsProfessional')}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-center lg:justify-start gap-4">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                        <FaMountain className="text-green-600 text-xl" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">{t('brand.experience')}</h3>
                        <p className="text-gray-600">{t('home.experienceDesc')}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Tours Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-800 mb-4">{t('home.featuredToursTitle')}</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                {t('home.featuredToursDesc')}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {tours.slice(0, 3).map((tour) => (
                <motion.div
                  key={tour.id || tour._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                >
                  <TourCard
                    tour={tour}
                    averageRating={tourReviews[tour._id]?.averageRating}
                    reviewCount={tourReviews[tour._id]?.reviewCount}
                  />
                </motion.div>
              ))}
            </div>
            <div className="text-center mt-12">
              <Link
                to="/tour"
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                {t('home.seeAllTours')}
                <FaArrowRight className="ml-2" />
              </Link>
            </div>
          </div>
        </section>

        {/* Featured Destinations Section */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-800 mb-4">
                {t("home.featuredDestinations")}
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                {t('home.featuredDestinationsDesc')}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
              {destinations.slice(0, 4).map((destination, index) => (
                <motion.div
                  key={destination.slug || destination.id || index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <DestinationCard destination={destination} isDark={isDark} />
                </motion.div>
              ))}
            </div>
            <div className="text-center mt-12">
              <Link
                to="/destinations"
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                {t('home.seeAllDestinations')}
                <FaArrowRight className="ml-2" />
              </Link>
            </div>
          </div>
        </section>

        {/* Featured Blogs Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-800 mb-4">{t('home.featuredBlogsTitle')}</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                {t('home.featuredBlogsDesc')}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogs.slice(0, 3).map((blog) => (
                <BlogCard key={blog.slug} blog={blog} />
              ))}
            </div>
            <div className="text-center mt-12">
              <Link
                to="/blogs"
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                {t('home.seeAllBlogs')}
                <FaArrowRight className="ml-2" />
              </Link>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                <h2 className="text-4xl font-bold text-gray-800 mb-6">
                  {t("home.about.title")}
                </h2>
                <p className="text-lg leading-relaxed mb-6 text-gray-600">
                  {t("home.about.description1")}
                </p>
                <p className="text-lg leading-relaxed mb-8 text-gray-600">
                  {t("home.about.description2")}
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    to="/about"
                    className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    {t("home.about.learnMore")}
                    <FaArrowRight className="ml-2" />
                  </Link>
                  <Link
                    to="/contact"
                    className="inline-flex items-center justify-center px-8 py-4 border-2 border-purple-600 text-purple-600 font-semibold rounded-xl hover:bg-purple-600 hover:text-white transition-all duration-300"
                  >
                    {t('home.contactNow')}
                  </Link>
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="relative"
              >
                <img
                  src={image1}
                  alt="Ha Giang Landscape"
                  className="rounded-2xl shadow-2xl w-full h-96 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl"></div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-purple-600 to-pink-600">
          <div className="max-w-4xl mx-auto text-center px-4">
            <h2 className="text-4xl font-bold text-white mb-6">
              {t('home.ctaTitle')}
            </h2>
            <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
              {t('home.ctaDesc')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/tour"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-purple-600 font-semibold rounded-xl hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                {t('home.seeToursNow')}
                <FaArrowRight className="ml-2" />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-purple-600 transition-all duration-300"
              >
                {t('home.freeConsult')}
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}