import React, { useState, useEffect, useRef } from 'react';
import logo from '@/assets/logo.jpg';
import image from '@/assets/1.jpg';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { FaEye, FaEyeSlash, FaUser, FaLock, FaEnvelope, FaGoogle, FaFacebook, FaGithub } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { login, register, checkAuthStatus } from '../store/slice/userSlice';
import type { RootState } from '../store';
import { useNavigate } from 'react-router-dom';
import { api } from "../services/api";




const Login: React.FC = () => {
  const { t } = useTranslation();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    rememberMe: false
  });
  const [formError, setFormError] = useState<string | null>(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated, user } = useSelector((state: RootState) => state.user);

  // Thêm ref để chỉ chạy reset/refetch 1 lần
  const hasRefetched = useRef(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (isLogin) {
      dispatch(login({ email: formData.email, password: formData.password }) as any);
    } else {
      if (formData.password !== formData.confirmPassword) {
        setFormError('Mật khẩu xác nhận không khớp!');
        return;
      }
      dispatch(register({ name: formData.name, email: formData.email, password: formData.password }) as any);
    }
  };

  useEffect(() => {
    if (isAuthenticated && user && !hasRefetched.current) {
      hasRefetched.current = true;
      dispatch(api.util.resetApiState());
      dispatch(checkAuthStatus() as any);
      navigate('/');
    }
  }, [isAuthenticated, user, navigate, dispatch]);

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

      <div className="min-h-screen bg-gradient-to-br from-light via-secondary/20 to-accent/10 flex items-center justify-center p-4">
        <div className="w-full max-w-6xl mx-auto">
          <div className="bg-light rounded-3xl shadow-2xl overflow-hidden">
            <div className="flex flex-col lg:flex-row min-h-[700px]">
              {/* Left: Image Section */}
              <div className="lg:w-1/2 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/90 to-accent/90 z-10"></div>
                <img
                  src={image}
                  alt="Travel Background"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 z-20 flex items-center justify-center">
                  <div className="text-center text-light p-8">
                    <img src={logo} alt="Homie Travel" className="w-24 h-24 rounded-full mx-auto mb-6 border-4 border-light/30 shadow-lg" />
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
                    <h2 className="text-3xl font-bold text-[#1a1a1a] mb-2">
                      {isLogin ? t('login.title') : t('login.signupLink')}
                    </h2>
                    <p className="text-[#555]">
                      {isLogin ? t('login.description') : t('login.noAccount')}
                    </p>
                  </div>

                  {/* Social Login Buttons */}
                  <div className="grid grid-cols-3 gap-3 mb-8">
                    <button className="flex items-center justify-center p-3 border border-earth rounded-xl hover:bg-secondary transition-colors">
                      <FaGoogle className="text-accent text-lg" />
                    </button>
                    <button className="flex items-center justify-center p-3 border border-earth rounded-xl hover:bg-secondary transition-colors">
                      <FaFacebook className="text-primary text-lg" />
                    </button>
                    <button className="flex items-center justify-center p-3 border border-earth rounded-xl hover:bg-secondary transition-colors">
                      <FaGithub className="text-[#1a1a1a] text-lg" />
                    </button>
                  </div>

                  {/* Divider */}
                  <div className="flex items-center mb-8">
                    <div className="flex-1 border-t border-earth"></div>
                    <span className="px-4 text-[#555] text-sm">hoặc</span>
                    <div className="flex-1 border-t border-earth"></div>
                  </div>

                  {/* Form */}
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Name Field (Register only) */}
                    {!isLogin && (
                      <div>
                        <label className="block text-sm font-medium text-[#555] mb-2">
                          {t('login.nameLabel', 'Tên người dùng')}
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FaUser className="h-5 w-5 text-earth" />
                          </div>
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="w-full pl-10 pr-4 py-3 border border-earth rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-[#1a1a1a]"
                            placeholder={t('login.placeholderName', 'Nhập tên người dùng')}
                            required
                          />
                        </div>
                      </div>
                    )}

                    {/* Email Field (dùng cho cả login và register) */}
                    <div>
                      <label className="block text-sm font-medium text-[#555] mb-2">
                        {t('login.emailLabel')}
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaEnvelope className="h-5 w-5 text-earth" />
                        </div>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-4 py-3 border border-earth rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-[#1a1a1a]"
                          placeholder={t('login.placeholderEmail')}
                          required
                        />
                      </div>
                    </div>

                    {/* Password Field */}
                    <div>
                      <label className="block text-sm font-medium text-[#555] mb-2">
                        {t('login.passwordLabel')}
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaLock className="h-5 w-5 text-earth" />
                        </div>
                        <input
                          type={showPassword ? "text" : "password"}
                          name="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-12 py-3 border border-earth rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-[#1a1a1a]"
                          placeholder={t('login.placeholderPassword')}
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        >
                          {showPassword ? (
                            <FaEyeSlash className="h-5 w-5 text-earth hover:text-primary" />
                          ) : (
                            <FaEye className="h-5 w-5 text-earth hover:text-primary" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Confirm Password Field (Register only) */}
                    {!isLogin && (
                      <div>
                        <label className="block text-sm font-medium text-[#555] mb-2">
                          {t('login.confirmPasswordLabel', 'Xác nhận mật khẩu')}
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FaLock className="h-5 w-5 text-earth" />
                          </div>
                          <input
                            type={showConfirmPassword ? "text" : "password"}
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            className="w-full pl-10 pr-12 py-3 border border-earth rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-[#1a1a1a]"
                            placeholder={t('login.placeholderConfirmPassword', 'Nhập lại mật khẩu')}
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          >
                            {showConfirmPassword ? (
                              <FaEyeSlash className="h-5 w-5 text-earth hover:text-primary" />
                            ) : (
                              <FaEye className="h-5 w-5 text-earth hover:text-primary" />
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
                            className="h-4 w-4 text-primary focus:ring-primary border-earth rounded"
                          />
                          <label className="ml-2 text-sm text-[#555]">
                            {t('login.rememberMe', 'Ghi nhớ đăng nhập')}
                          </label>
                        </div>
                        <a href="#" className="text-sm text-primary hover:text-accent font-medium">
                          {t('login.forgotPassword')}
                        </a>
                      </div>
                    )}

                    {/* Submit Button */}
                    <button
                      type="submit"
                      className="w-full bg-gradient-to-r from-primary to-accent text-[#1a1a1a] font-semibold py-3 px-4 rounded-xl hover:from-accent hover:to-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                      {isLogin ? t('login.loginButton') : t('login.signupLink')}
                    </button>
                  </form>

                  {/* Toggle Form */}
                  <div className="mt-8 text-center">
                    <p className="text-[#555]">
                      {isLogin ? t('login.noAccount') : t('login.haveAccount', 'Đã có tài khoản?')}
                      <button
                        onClick={() => setIsLogin(!isLogin)}
                        className="ml-1 text-primary hover:text-accent font-semibold transition-colors"
                      >
                        {isLogin ? t('login.signupLink') : t('login.loginButton')}
                      </button>
                    </p>
                  </div>

                  {/* Terms (Register only) */}
                  {!isLogin && (
                    <div className="mt-6 text-center">
                      <p className="text-xs text-[#555]">
                        {t('login.termsText', 'Bằng cách đăng ký, bạn đồng ý với')}{' '}
                        <a href="#" className="text-primary hover:text-accent">
                          {t('login.termsOfUse', 'Điều khoản sử dụng')}
                        </a>{' '}
                        {t('login.and', 'và')}{' '}
                        <a href="#" className="text-primary hover:text-accent">
                          {t('login.privacyPolicy', 'Chính sách bảo mật')}
                        </a>
                      </p>
                    </div>
                  )}

                  {/* Hiển thị lỗi xác nhận mật khẩu hoặc lỗi server */}
                  {(formError || error) && (
                    <div className="text-red-500 text-center mb-2">
                      {formError || t('login.errorInvalid')}
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