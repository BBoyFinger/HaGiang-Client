import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminTourManager from '../components/admin/AdminTourManager';
import AdminDestinationManager from '../components/admin/AdminDestinationManager';
import AdminBlogManager from '../components/admin/AdminBlogManager';
import AdminUserManager from '../components/admin/AdminUserManager';
import AdminBookingManager from '../components/admin/AdminBookingManager';
import AdminDashboard from '../components/admin/AdminDashboard';
import AdminProfileModal from '../components/admin/AdminProfileModal';
import ToastNotification, { Toast } from '../components/admin/ToastNotification';

const menuItems = [
  { key: 'dashboard', label: 'Dashboard', icon: '📊' },
  { key: 'tour', label: 'Quản lý Tour', icon: '🗺️' },
  { key: 'destination', label: 'Quản lý Điểm đến', icon: '📍' },
  { key: 'blog', label: 'Quản lý Blog', icon: '📝' },
  { key: 'user', label: 'Quản lý Người dùng', icon: '👥' },
  { key: 'booking', label: 'Quản lý Booking', icon: '📅' },
];

const Admin: React.FC = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState('dashboard');
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [adminInfo, setAdminInfo] = useState({ name: 'Admin User', email: 'admin@example.com' });
  const [toasts, setToasts] = useState<Toast[]>([]);

  const handleLogout = () => {
    if (confirm('Bạn có chắc muốn đăng xuất?')) {
      // Redirect to home page using React Router
      navigate('/');
    }
  };

  const handleGoHome = () => {
    navigate('/');
  };

  const showToast = (message: string, type: Toast['type'] = 'success') => {
    setToasts((prev) => [
      ...prev,
      { id: Math.random().toString(36).slice(2), type, message },
    ]);
  };
  const removeToast = (id: string) => setToasts((prev) => prev.filter(t => t.id !== id));

  const handleProfileSave = (data: { name: string; email: string; password?: string }) => {
    setAdminInfo({ name: data.name, email: data.email });
    setProfileModalOpen(false);
    showToast('Cập nhật thông tin admin thành công!', 'success');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ToastNotification toasts={toasts} onRemove={removeToast} />
      <AdminProfileModal
        open={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
        onSave={handleProfileSave}
        initialData={adminInfo}
      />
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center cursor-pointer" onClick={() => setProfileModalOpen(true)}>
                <span className="text-white font-bold text-sm">{adminInfo.name.charAt(0).toUpperCase()}</span>
              </div>
              <a href="/">
                <h1 className="text-xl font-semibold text-gray-900">Admin Dashboard</h1>
              </a>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleGoHome}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200"
              >
                <span>🏠</span>
                <span>Về trang chủ</span>
              </button>
              <button
                className="flex items-center space-x-2 group"
                onClick={() => setProfileModalOpen(true)}
              >
                <span className="text-sm text-gray-600 group-hover:underline">{adminInfo.name}</span>
                <span className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 text-sm">👤</span>
              </button>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200"
              >
                <span>🚪</span>
                <span>Đăng xuất</span>
              </button>
            </div>
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
            {selected === 'dashboard' && <AdminDashboard />}
            {selected === 'tour' && <AdminTourManager />}
            {selected === 'destination' && <AdminDestinationManager />}
            {selected === 'blog' && <AdminBlogManager />}
            {selected === 'user' && <AdminUserManager />}
            {selected === 'booking' && <AdminBookingManager />}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Admin; 