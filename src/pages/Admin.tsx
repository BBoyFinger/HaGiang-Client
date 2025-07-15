import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminTourManager from '../components/admin/AdminTourManager';
import AdminDestinationManager from '../components/admin/AdminDestinationManager';
import AdminBlogManager from '../components/admin/AdminBlogManager';
import AdminUserManager from '../components/admin/AdminUserManager';
import AdminBookingManager from '../components/admin/AdminBookingManager';
import AdminDashboard from '../components/admin/AdminDashboard';
import AdminProfileModal from '../components/admin/AdminProfileModal';
import AdminCommentManager from '../components/admin/AdminCommentManager';
import { Menu } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { useGetCurrentUserQuery, useUpdateProfileMutation } from '../services/api';
import logo from "@/assets/logo.jpg"

const menuItems = [
  { key: 'dashboard', label: 'Dashboard', icon: '📊' },
  { key: 'tour', label: 'Quản lý Tour', icon: '🗺️' },
  { key: 'destination', label: 'Quản lý Điểm đến', icon: '📍' },
  { key: 'blog', label: 'Quản lý Blog', icon: '📝' },
  { key: 'comment', label: 'Quản lý Bình luận', icon: '💬' },
  { key: 'user', label: 'Quản lý Người dùng', icon: '👥' },
  { key: 'booking', label: 'Quản lý Booking', icon: '📅' },
];

const Admin: React.FC = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState('dashboard');
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const { data: currentUserData } = useGetCurrentUserQuery();
  const [updateProfile] = useUpdateProfileMutation();
  const adminInfo = currentUserData?.user || { name: 'Admin', email: '' };


  const handleLogout = () => {
    if (confirm('Bạn có chắc muốn đăng xuất?')) {
      // Redirect to home page using React Router
      navigate('/');
    }
  };

  const handleGoHome = () => {
    navigate('/');
  };



  const handleProfileSave = async (data: { name: string; email: string; password?: string }) => {
    try {
      await updateProfile(data).unwrap();
      setProfileModalOpen(false);
    } catch (err) {
      alert('Lỗi khi cập nhật thông tin!');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">

      <AdminProfileModal
        open={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
        onSave={handleProfileSave}
        initialData={{ name: adminInfo.name, email: adminInfo.email }}
      />
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
        <div className="px-6 py-3 flex items-center justify-between">
          {/* Left: Logo + Name */}
          <div className="flex items-center space-x-3">
            <a href="/" className="flex items-center space-x-2 group">
              <img src={logo} alt="Logo" className="w-10 h-10 rounded-full border border-blue-200 shadow-sm object-cover" />
              <span className="text-2xl font-bold text-blue-700 tracking-tight group-hover:underline">Homie Travel Admin</span>
            </a>
          </div>
          {/* Right: Actions */}
          <div className="flex items-center space-x-4">
            <button
              onClick={handleGoHome}
              className="bg-blue-50 hover:bg-blue-100 text-blue-700 px-4 py-2 rounded-lg flex items-center space-x-2 border border-blue-100 transition-colors duration-200"
            >
              <span>🏠</span>
              <span className="hidden sm:inline">Trang chủ</span>
            </button>
            {/* User Dropdown */}
            <Menu as="div" className="relative inline-block text-left">
              <Menu.Button className="flex items-center space-x-2 focus:outline-none">
                <span className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg border-2 border-blue-300 shadow">{adminInfo.name?.charAt(0).toUpperCase() || 'A'}</span>
                <span className="text-gray-900 font-medium hidden sm:inline">{adminInfo.name}</span>
                <ChevronDownIcon className="w-5 h-5 text-gray-400" />
              </Menu.Button>
              <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right bg-white border border-gray-200 divide-y divide-gray-100 rounded-lg shadow-lg focus:outline-none z-50">
                <div className="py-1">
                  <Menu.Item>
                    {({ active }: { active: boolean }) => (
                      <button
                        onClick={() => setProfileModalOpen(true)}
                        className={`w-full text-left px-4 py-2 text-sm ${active ? 'bg-blue-50 text-blue-700' : 'text-gray-700'}`}
                      >
                        Thông tin cá nhân
                      </button>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }: { active: boolean }) => (
                      <button
                        onClick={handleLogout}
                        className={`w-full text-left px-4 py-2 text-sm ${active ? 'bg-red-50 text-red-700' : 'text-gray-700'}`}
                      >
                        Đăng xuất
                      </button>
                    )}
                  </Menu.Item>
                </div>
              </Menu.Items>
            </Menu>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-sm border-r border-gray-200 min-h-screen">
          <nav className="p-4">
            <div className="space-y-2">
              {menuItems.map((item) => (
                <button
                  key={item.key}
                  onClick={() => setSelected(item.key)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors duration-200 ${selected === item.key
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : 'text-gray-700 hover:bg-gray-50'
                    }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                </button>
              ))}
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            {selected === 'dashboard' && <AdminDashboard setSelected={setSelected} />}
            {selected === 'tour' && <AdminTourManager />}
            {selected === 'destination' && <AdminDestinationManager />}
            {selected === 'blog' && <AdminBlogManager />}
            {selected === 'comment' && <AdminCommentManager />}
            {selected === 'user' && <AdminUserManager />}
            {selected === 'booking' && <AdminBookingManager />}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Admin; 