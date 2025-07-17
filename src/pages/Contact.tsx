import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock, FaWhatsapp, FaFacebook, FaInstagram, FaPaperPlane, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

export default function Contact() {
  const { t } = useTranslation();
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentExpert, setCurrentExpert] = useState(0);
  const [windowWidth, setWindowWidth] = useState(0);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    // Set initial width
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Auto-scroll carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentExpert((prev) => (prev + 1) % 5);
    }, 4000); // Change every 4 seconds

    return () => clearInterval(interval);
  }, []);

  // Calculate transform based on screen size
  const getTransformValue = () => {
    if (windowWidth < 768) {
      // Mobile: 1 expert per view
      return currentExpert * 100;
    } else if (windowWidth < 1024) {
      // Tablet: 2 experts per view
      return currentExpert * 50;
    } else {
      // Desktop: 3 experts per view
      return currentExpert * 33.333;
    }
  };

  const experts = [
    {
      id: 1,
      name: "Lê Đình Trí",
      position: "Senior Travel Guide",
      image: "/src/assets/user/tri.jpg",
      experience: "8 năm kinh nghiệm hướng dẫn tour Hà Giang. Chuyên gia về văn hóa dân tộc và địa lý miền núi.",
      rating: 4.9,
      reviews: 120,
      tours: 500,
      color: "blue"
    },
    {
      id: 2,
      name: "Vũ Ngọc Tú",
      position: "Website Develoment",
      image: "/src/assets/user/tu.jpg",
      experience: "Chuyên gia phát triển website với 3 năm kinh nghiệm",
      rating: 4.8,
      reviews: 95,
      tours: 300,
      color: "green"
    },
    {
      id: 3,
      name: "Lê Hoàng Nam",
      position: "Cultural Guide",
      image: "/src/assets/3.jpg",
      experience: "Chuyên gia văn hóa dân tộc Hà Giang. Am hiểu sâu sắc về phong tục, tập quán của các dân tộc.",
      rating: 4.9,
      reviews: 150,
      tours: 400,
      color: "purple"
    },
    {
      id: 4,
      name: "Phạm Thị Hương",
      position: "Photography Guide",
      image: "/src/assets/4.jpg",
      experience: "Hướng dẫn viên chuyên về nhiếp ảnh du lịch. Giúp bạn chụp được những khoảnh khắc đẹp nhất.",
      rating: 4.7,
      reviews: 80,
      tours: 200,
      color: "orange"
    },
    {
      id: 5,
      name: "Vũ Đức Minh",
      position: "Local Expert",
      image: "/src/assets/1.jpg",
      experience: "Người bản địa Hà Giang với 10 năm kinh nghiệm. Hiểu rõ mọi ngóc ngách và địa điểm bí mật.",
      rating: 5.0,
      reviews: 200,
      tours: 600,
      color: "teal"
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: "from-blue-400 to-purple-500 text-blue-600 bg-blue-100",
      green: "from-green-400 to-blue-500 text-green-600 bg-green-100",
      purple: "from-purple-400 to-pink-500 text-purple-600 bg-purple-100",
      orange: "from-orange-400 to-red-500 text-orange-600 bg-orange-100",
      teal: "from-teal-400 to-cyan-500 text-teal-600 bg-teal-100"
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  const nextExpert = () => {
    setCurrentExpert((prev) => (prev + 1) % 5);
  };

  const prevExpert = () => {
    setCurrentExpert((prev) => (prev - 1 + 5) % 5);
  };

  const goToExpert = (index: number) => {
    setCurrentExpert(index);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setSuccess(true);
      setIsSubmitting(false);
      setForm({ name: "", email: "", phone: "", subject: "", message: "" });

      // Reset success message after 5 seconds
      setTimeout(() => setSuccess(false), 5000);
    }, 1500);
  };

  return (
    <>
      <Helmet>
        <title>{t('contact.title')}</title>
        <meta name="description" content={t('contact.description')} />
        <meta property="og:title" content={t('contact.title')} />
        <meta property="og:description" content={t('contact.description')} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://homieTravel.vn/contact" />
        <meta property="og:image" content="https://homieTravel.vn/og-image.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={t('contact.title')} />
        <meta name="twitter:description" content={t('contact.description')} />
        <meta name="twitter:image" content="https://homieTravel.vn/og-image.jpg" />
      </Helmet>

      {/* Hero Section */}
      <section className="relative h-80 bg-gradient-to-r from-blue-600 to-purple-600 overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-40"></div>
        <div className="relative z-10 flex items-center justify-center h-full">
          <div className="text-center text-white">
            <h1 className="text-5xl font-bold mb-4">{t('contact.title')}</h1>
            <p className="text-xl max-w-2xl mx-auto px-4">
              {t('contact.slogan')}
            </p>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent"></div>
      </section>

      {/* Contact Information & Form */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">

            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-6">{t('contact.contactUs')}</h2>
                <p className="text-lg text-gray-600 leading-relaxed">
                  {t('contact.description')}
                </p>
              </div>

              {/* Contact Details */}
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FaPhone className="text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-1">{t('contact.phone')}</h3>
                    <p className="text-gray-600">+84 983648362</p>
                    {/* <p className="text-gray-600">+84 987 654 321</p> */}
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FaEnvelope className="text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-1">{t('contact.email')}</h3>
                    <p className="text-gray-600">Anhbuonanhkhocvianhyeuem@gmail.com</p>
                    <p className="text-gray-600">support@homietravel.com</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FaMapMarkerAlt className="text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-1">{t('contact.address')}</h3>
                    {/* <p className="text-gray-600">123 Đường ABC, Phường XYZ</p> */}
                    <p className="text-gray-600">Thành phố Hà Giang, Việt Nam</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FaClock className="text-orange-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-1">{t('contact.businessHours')}</h3>
                    <p className="text-gray-600">{t('contact.monFri')}</p>
                    <p className="text-gray-600">{t('contact.satSun')}</p>
                  </div>
                </div>
              </div>

              {/* Social Media */}
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">{t('contact.connectWithUs')}</h3>
                <div className="flex space-x-4">
                  <a href="#" className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center text-white hover:bg-blue-700 transition-colors">
                    <FaFacebook className="text-xl" />
                  </a>
                  <a href="#" className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center text-white hover:bg-green-700 transition-colors">
                    <FaWhatsapp className="text-xl" />
                  </a>
                  <a href="#" className="w-12 h-12 bg-pink-600 rounded-lg flex items-center justify-center text-white hover:bg-pink-700 transition-colors">
                    <FaInstagram className="text-xl" />
                  </a>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">{t('contact.sendMessage')}</h3>

              {success && (
                <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center mr-3">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    {t('contact.success')}
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('contact.name')} *
                    </label>
                    <input
                      name="name"
                      type="text"
                      value={form.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      placeholder={t('contact.namePlaceholder')}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('contact.email')} *
                    </label>
                    <input
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      placeholder={t('contact.emailPlaceholder')}
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('contact.phone')}
                    </label>
                    <input
                      name="phone"
                      type="tel"
                      value={form.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      placeholder={t('contact.phonePlaceholder')}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('contact.subject')}
                    </label>
                    <select
                      name="subject"
                      value={form.subject}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    >
                      <option value="">{t('contact.chooseSubject')}</option>
                      <option value="tour">{t('contact.tourConsultation')}</option>
                      <option value="booking">{t('contact.bookingTour')}</option>
                      <option value="support">{t('contact.support')}</option>
                      <option value="feedback">{t('contact.feedback')}</option>
                      <option value="other">{t('contact.other')}</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('contact.message')} *
                  </label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
                    placeholder={t('contact.messagePlaceholder')}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>{t('contact.sending')}</span>
                    </>
                  ) : (
                    <>
                      <FaPaperPlane />
                      <span>{t('contact.submit')}</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">{t('contact.ourLocation')}</h2>

          </div>

          <div className="bg-gray-200 rounded-2xl h-96 overflow-hidden">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4373.752619009959!2d104.9671324410537!3d22.80717305657003!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x36cc79b180b4239d%3A0xb7a373a73bc23544!2sH%C3%A0%20Giang%2C%20Vietnam!5e0!3m2!1sen!2s!4v1751183303394!5m2!1sen!2s"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title={t('contact.mapTitle')}
            ></iframe>
          </div>
        </div>
      </section>

      {/* Meet the Outdoor Travel Experts */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">{t('contact.meetExperts')}</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {t('contact.meetExpertsDesc')}
            </p>
          </div>

          <div className="relative">
            {/* Carousel Container */}
            <div className="relative overflow-hidden">
              <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{
                  transform: `translateX(-${getTransformValue()}%)`
                }}
              >
                {experts.map((expert, index) => (
                  <div key={expert.id} className="w-full md:w-1/2 lg:w-1/3 flex-shrink-0 px-2 md:px-3">
                    <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                      {/* Image Section */}
                      <div className="h-48 md:h-56 lg:h-64 relative overflow-hidden">
                        <img
                          src={expert.image}
                          alt={expert.name}
                          className="w-full h-full object-contain"
                        />

                      </div>

                      {/* Content Section */}
                      <div className="p-4 md:p-6">
                        <div className="flex items-center justify-between mb-3 md:mb-4">
                          <div>
                            <h4 className="text-base md:text-lg font-semibold text-gray-800 mb-1">{expert.name}</h4>
                            <p className={`text-xs md:text-sm font-medium ${getColorClasses(expert.color).split(' ')[2]}`}>
                              {expert.position}
                            </p>
                          </div>
                          <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center ${getColorClasses(expert.color).split(' ')[3]}`}>
                            <span className={`font-bold text-xs md:text-sm ${getColorClasses(expert.color).split(' ')[2]}`}>
                              {expert.name.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                        </div>

                        <p className="text-gray-600 text-xs md:text-sm leading-relaxed mb-3 md:mb-4 line-clamp-3">
                          {expert.experience}
                        </p>

                        <div className="flex items-center justify-between text-xs md:text-sm">
                          <div className="flex items-center space-x-2 md:space-x-4">
                            <span className="flex items-center">
                              <span className="text-yellow-500 mr-1">⭐</span>
                              {expert.rating} ({expert.reviews})
                            </span>
                            <span className="flex items-center">
                              <span className="text-blue-500 mr-1">🎯</span>
                              {expert.tours}+
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Navigation Arrows - Hidden on mobile */}
              <button
                onClick={prevExpert}
                className="hidden md:flex absolute left-2 md:left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-white bg-opacity-90 rounded-full items-center justify-center text-gray-800 hover:bg-opacity-100 transition-all duration-300 shadow-lg z-10"
              >
                <FaChevronLeft className="text-sm md:text-base" />
              </button>

              <button
                onClick={nextExpert}
                className="hidden md:flex absolute right-2 md:right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-white bg-opacity-90 rounded-full items-center justify-center text-gray-800 hover:bg-opacity-100 transition-all duration-300 shadow-lg z-10"
              >
                <FaChevronRight className="text-sm md:text-base" />
              </button>
            </div>

            {/* Dots Indicator */}
            <div className="flex justify-center mt-6 md:mt-8 space-x-2 md:space-x-3">
              {[0, 1, 2, 3, 4].map((index) => (
                <button
                  key={index}
                  onClick={() => goToExpert(index)}
                  className={`w-3 h-3 md:w-4 md:h-4 rounded-full transition-all duration-300 ${index === currentExpert
                    ? 'bg-blue-600 scale-125'
                    : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                />
              ))}
            </div>

            {/* Mobile Swipe Instructions */}
            <div className="md:hidden text-center mt-4">
              <p className="text-xs text-gray-500">{t('contact.swipeHint')}</p>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center mt-8 md:mt-12">
            <p className="text-base md:text-lg text-gray-600 mb-4 md:mb-6 px-4">
              {t('contact.ctaDesc')}
            </p>
            <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 md:px-8 py-2 md:py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 text-sm md:text-base">
              {t('contact.ctaButton')}
            </button>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">{t('contact.faqTitle')}</h2>
            <p className="text-lg text-gray-600">
              {t('contact.faqDesc')}
            </p>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {t('contact.howToBookTour')}
              </h3>
              <p className="text-gray-600">
                {t('contact.howToBookTourDesc')}
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {t('contact.doesTourIncludeInsurance')}
              </h3>
              <p className="text-gray-600">
                {t('contact.doesTourIncludeInsuranceDesc')}
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {t('contact.canCancelTour')}
              </h3>
              <p className="text-gray-600">
                {t('contact.canCancelTourDesc')}
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
} 