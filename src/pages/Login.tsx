import React from 'react';
import logo from '@/assets/logo.jpg';
import image from '@/assets/1.jpg';

const Login: React.FC = () => {
  return (
    <div className="bg-sky-100 flex justify-center items-center min-h-screen">
      <div className="flex w-full max-w-4xl mx-auto shadow-2xl rounded-2xl overflow-hidden">
        {/* Left: Image */}
        <div className="w-1/2 h-[600px] hidden lg:block">
          <img
            src={image}
            alt="Placeholder"
            className="object-cover w-full h-full"
          />
        </div>
        {/* Right: Login Form */}
        <div className="flex w-full lg:w-1/2 justify-center items-center">
          <div className="bg-white bg-opacity-95 rounded-none lg:rounded-r-2xl shadow-2xl p-10 max-w-md w-full border border-gray-100">
            <div className="flex flex-col items-center mb-6">
              <img src={logo} alt="logo" className="w-20 h-20 rounded-full shadow-md mb-2 border-4 border-blue-100 object-cover" />
              <h1 className="text-2xl font-bold text-gray-800 mb-1 tracking-wide">Homie Travel</h1>
              <span className="text-blue-500 font-semibold text-lg">Đăng nhập tài khoản</span>
            </div>
            <form action="#" method="POST" className="space-y-4">
              {/* Username Input */}
              <div>
                <label htmlFor="username" className="block text-gray-600 font-medium mb-1">
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  className="w-full border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
                  autoComplete="off"
                />
              </div>
              {/* Password Input */}
              <div>
                <label htmlFor="password" className="block text-gray-800 font-medium mb-1">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  className="w-full border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
                  autoComplete="off"
                />
              </div>
              {/* Remember Me Checkbox */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="remember"
                    name="remember"
                    className="text-blue-500 focus:ring-blue-400 rounded"
                  />
                  <label htmlFor="remember" className="text-gray-700 ml-2 text-sm">
                    Remember Me
                  </label>
                </div>
                <a href="#" className="text-blue-500 text-sm hover:underline">
                  Forgot Password?
                </a>
              </div>
              {/* Login Button */}
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg py-2 px-4 w-full shadow transition-colors"
              >
                Login
              </button>
            </form>
            {/* Sign up Link */}
            <div className="mt-6 text-blue-500 text-center">
              <a href="#" className="hover:underline font-medium">
                Sign up Here
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;