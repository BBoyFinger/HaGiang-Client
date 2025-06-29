import React, { useState } from 'react';
import logo from '@/assets/logo.jpg';
import image from '@/assets/1.jpg';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { FaEye, FaEyeSlash, FaUser, FaLock, FaEnvelope, FaGoogle, FaFacebook, FaGithub } from 'react-icons/fa';

const Login: React.FC = () => {
  const { t } = useTranslation();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    rememberMe: false
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
  };

  return (
    <>
      <Helmet>
        <title>{t('login.title')}</title>
        <meta name="description" content={t('login.description')} />
        <meta property="og:title" content={t('login.title')} />
        <meta property="og:description" content={t('login.description')} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://homieTravel.vn/login" />
        <meta property="og:image" content="https://homieTravel.vn/og-image.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={t('login.title')} />
        <meta name="twitter:description" content={t('login.description')} />
        <meta name="twitter:image" content="https://homieTravel.vn/og-image.jpg" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 flex items-center justify-center p-4">
        <div className="w-full max-w-6xl mx-auto">
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
            <div className="flex flex-col lg:flex-row min-h-[700px]">
              {/* Left: Image Section */}
              <div className="lg:w-1/2 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/90 to-pink-600/90 z-10"></div>
                <img
                  src={image}
                  alt="Travel Background"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 z-20 flex items-center justify-center">
                  <div className="text-center text-white p-8">
                    <img src={logo} alt="Homie Travel" className="w-24 h-24 rounded-full mx-auto mb-6 border-4 border-white/30 shadow-lg" />
                    <h1 className="text-4xl font-bold mb-4">Homie Travel</h1>
                    <p className="text-xl opacity-90 mb-6">
                      {isLogin ? 'Chào mừng bạn trở lại!' : 'Tham gia cùng chúng tôi!'}
                    </p>
                    <p className="text-lg opacity-80 leading-relaxed">
                      {isLogin 
                        ? 'Đăng nhập để khám phá những điểm đến tuyệt vời và tạo ra những kỷ niệm đáng nhớ.'
                        : 'Tạo tài khoản để lưu trữ những chuyến đi yêu thích và nhận thông tin mới nhất.'
                      }
                    </p>
                  </div>
                </div>
              </div>

              {/* Right: Form Section */}
              <div className="lg:w-1/2 p-8 lg:p-12 flex items-center">
                <div className="w-full max-w-md mx-auto">
                  {/* Header */}
                  <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">
                      {isLogin ? 'Đăng nhập' : 'Đăng ký'}
                    </h2>
                    <p className="text-gray-600">
                      {isLogin ? 'Đăng nhập vào tài khoản của bạn' : 'Tạo tài khoản mới'}
                    </p>
                  </div>

                  {/* Social Login Buttons */}
                  <div className="grid grid-cols-3 gap-3 mb-8">
                    <button className="flex items-center justify-center p-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors">
                      <FaGoogle className="text-red-500 text-lg" />
                    </button>
                    <button className="flex items-center justify-center p-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors">
                      <FaFacebook className="text-blue-600 text-lg" />
                    </button>
                    <button className="flex items-center justify-center p-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors">
                      <FaGithub className="text-gray-800 text-lg" />
                    </button>
                  </div>

                  {/* Divider */}
                  <div className="flex items-center mb-8">
                    <div className="flex-1 border-t border-gray-300"></div>
                    <span className="px-4 text-gray-500 text-sm">hoặc</span>
                    <div className="flex-1 border-t border-gray-300"></div>
                  </div>

                  {/* Form */}
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Username/Email Field */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {isLogin ? 'Tên đăng nhập' : 'Tên đăng nhập'}
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaUser className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          name="username"
                          value={formData.username}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                          placeholder={isLogin ? 'Nhập tên đăng nhập' : 'Tạo tên đăng nhập'}
                          required
                        />
                      </div>
                    </div>

                    {/* Email Field (Register only) */}
                    {!isLogin && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FaEnvelope className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                            placeholder="Nhập email của bạn"
                            required
                          />
                        </div>
                      </div>
                    )}

                    {/* Password Field */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Mật khẩu
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaLock className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type={showPassword ? "text" : "password"}
                          name="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                          placeholder="Nhập mật khẩu"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        >
                          {showPassword ? (
                            <FaEyeSlash className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                          ) : (
                            <FaEye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Confirm Password Field (Register only) */}
                    {!isLogin && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Xác nhận mật khẩu
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FaLock className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            type={showConfirmPassword ? "text" : "password"}
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                            placeholder="Nhập lại mật khẩu"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          >
                            {showConfirmPassword ? (
                              <FaEyeSlash className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                            ) : (
                              <FaEye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                            )}
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Remember Me & Forgot Password */}
                    {isLogin && (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            name="rememberMe"
                            checked={formData.rememberMe}
                            onChange={handleInputChange}
                            className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                          />
                          <label className="ml-2 text-sm text-gray-700">
                            Ghi nhớ đăng nhập
                          </label>
                        </div>
                        <a href="#" className="text-sm text-purple-600 hover:text-purple-500 font-medium">
                          Quên mật khẩu?
                        </a>
                      </div>
                    )}

                    {/* Submit Button */}
                    <button
                      type="submit"
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-3 px-4 rounded-xl hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                      {isLogin ? 'Đăng nhập' : 'Đăng ký'}
                    </button>
                  </form>

                  {/* Toggle Form */}
                  <div className="mt-8 text-center">
                    <p className="text-gray-600">
                      {isLogin ? 'Chưa có tài khoản?' : 'Đã có tài khoản?'}
                      <button
                        onClick={() => setIsLogin(!isLogin)}
                        className="ml-1 text-purple-600 hover:text-purple-500 font-semibold transition-colors"
                      >
                        {isLogin ? 'Đăng ký ngay' : 'Đăng nhập'}
                      </button>
                    </p>
                  </div>

                  {/* Terms (Register only) */}
                  {!isLogin && (
                    <div className="mt-6 text-center">
                      <p className="text-xs text-gray-500">
                        Bằng cách đăng ký, bạn đồng ý với{' '}
                        <a href="#" className="text-purple-600 hover:text-purple-500">
                          Điều khoản sử dụng
                        </a>{' '}
                        và{' '}
                        <a href="#" className="text-purple-600 hover:text-purple-500">
                          Chính sách bảo mật
                        </a>
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;