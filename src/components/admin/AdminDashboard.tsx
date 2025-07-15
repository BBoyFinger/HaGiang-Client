import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetBookingsQuery, useGetUsersQuery, useGetToursQuery, useGetCommentsQuery } from '../../services/api';

const AdminDashboard: React.FC<{ setSelected?: (key: string) => void }> = ({ setSelected }) => {
  const navigate = useNavigate();
  // Fetch real data
  const { data: bookingsData, isLoading: bookingsLoading } = useGetBookingsQuery();
  const { data: usersData, isLoading: usersLoading } = useGetUsersQuery();
  const { data: toursData, isLoading: toursLoading } = useGetToursQuery();
  const { data: commentsData, isLoading: commentsLoading } = useGetCommentsQuery({});

  const bookings = bookingsData?.bookings || [];
  const users = usersData?.users || [];
  const tours = toursData?.tours || [];
  const comments = commentsData?.comments || [];

  // Calculate stats
  const totalRevenue = bookings.reduce((sum: number, b: any) => sum + (b.totalPrice || 0), 0);
  const thisMonth = new Date().getMonth();
  const thisYear = new Date().getFullYear();
  const monthlyBookings = bookings.filter((b: any) => {
    const d = new Date(b.bookingDate || b.createdAt);
    return d.getMonth() === thisMonth && d.getFullYear() === thisYear;
  });
  const monthlyRevenue = monthlyBookings.reduce((sum: number, b: any) => sum + (b.totalPrice || 0), 0);
  const newUsers = users.filter((u: any) => {
    const d = new Date(u.createdAt);
    return d.getMonth() === thisMonth && d.getFullYear() === thisYear;
  });
  // Average rating from comments (assuming comments have rating field)
  const ratings = comments.map((c: any) => c.rating).filter((r: any) => typeof r === 'number');
  const avgRating = ratings.length ? (ratings.reduce((a: number, b: number) => a + b, 0) / ratings.length).toFixed(1) : '--';

  // Tour categories (mock, or you can calculate from tours if available)
  const tourCategories = [
    { name: 'Trekking', value: 35, color: 'bg-blue-500' },
    { name: 'Hang động', value: 25, color: 'bg-green-500' },
    { name: 'Luxury', value: 20, color: 'bg-yellow-500' },
    { name: 'Văn hóa', value: 20, color: 'bg-purple-500' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
        <p className="text-gray-600 mt-1">Tổng quan hệ thống quản lý du lịch Hà Giang</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <span className="text-blue-600 text-xl">💰</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Doanh thu tháng</p>
              <p className="text-2xl font-bold text-gray-900">{bookingsLoading ? '...' : monthlyRevenue.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</p>
              <p className="text-sm text-green-600">Tổng: {totalRevenue.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <span className="text-green-600 text-xl">📅</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Booking tháng</p>
              <p className="text-2xl font-bold text-gray-900">{bookingsLoading ? '...' : monthlyBookings.length}</p>
              <p className="text-sm text-green-600">Tổng: {bookings.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <span className="text-yellow-600 text-xl">👥</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Khách hàng mới</p>
              <p className="text-2xl font-bold text-gray-900">{usersLoading ? '...' : newUsers.length}</p>
              <p className="text-sm text-green-600">Tổng: {users.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <span className="text-purple-600 text-xl">⭐</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Đánh giá TB</p>
              <p className="text-2xl font-bold text-gray-900">{commentsLoading ? '...' : avgRating}</p>
              <p className="text-sm text-green-600">Tổng: {comments.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Doanh thu theo tháng</h3>
          <div className="h-64 flex items-end justify-between space-x-2">
            {monthlyBookings.map((value: number, index: number) => {
              const height = (value / 50000) * 100;
              return (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div 
                    className="w-full bg-blue-500 rounded-t"
                    style={{ height: `${height}%` }}
                  ></div>
                  <span className="text-xs text-gray-500 mt-2">{index + 1}</span>
                </div>
              );
            })}
          </div>
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">Tháng</p>
          </div>
        </div>

        {/* Bookings Chart */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Số lượng booking theo tháng</h3>
          <div className="h-64 flex items-end justify-between space-x-2">
            {monthlyBookings.map((value: number, index: number) => {
              const height = (value / 150) * 100;
              return (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div 
                    className="w-full bg-green-500 rounded-t"
                    style={{ height: `${height}%` }}
                  ></div>
                  <span className="text-xs text-gray-500 mt-2">{index + 1}</span>
                </div>
              );
            })}
          </div>
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">Tháng</p>
          </div>
        </div>
      </div>

      {/* Tour Categories & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tour Categories */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Phân loại Tour</h3>
          <div className="space-y-4">
            {tourCategories.map((category, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`w-4 h-4 rounded-full ${category.color} mr-3`}></div>
                  <span className="text-sm font-medium text-gray-900">{category.name}</span>
                </div>
                <span className="text-sm text-gray-600">{category.value}%</span>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-900">Tổng cộng</span>
              <span className="text-sm text-gray-600">100%</span>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Hoạt động gần đây</h3>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm font-medium text-gray-900">Booking mới - Tour Luxury 4 ngày</p>
                <p className="text-xs text-gray-500">2 phút trước</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm font-medium text-gray-900">Đánh giá mới - 5 sao</p>
                <p className="text-xs text-gray-500">15 phút trước</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm font-medium text-gray-900">User đăng ký mới</p>
                <p className="text-xs text-gray-500">1 giờ trước</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm font-medium text-gray-900">Cập nhật tour - Sông Nho Quế</p>
                <p className="text-xs text-gray-500">2 giờ trước</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm font-medium text-gray-900">Booking bị hủy</p>
                <p className="text-xs text-gray-500">3 giờ trước</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Thao tác nhanh</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <button
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            onClick={() => setSelected ? setSelected('tour') : navigate('/admin')}
          >
            <div className="text-center">
              <span className="text-2xl">➕</span>
              <p className="text-sm font-medium text-gray-900 mt-2">Thêm Tour</p>
            </div>
          </button>
          <button
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            onClick={() => setSelected ? setSelected('user') : navigate('/admin')}
          >
            <div className="text-center">
              <span className="text-2xl">👥</span>
              <p className="text-sm font-medium text-gray-900 mt-2">Quản lý User</p>
            </div>
          </button>
          <button
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            onClick={() => setSelected ? setSelected('dashboard') : navigate('/admin')}
          >
            <div className="text-center">
              <span className="text-2xl">📊</span>
              <p className="text-sm font-medium text-gray-900 mt-2">Báo cáo</p>
            </div>
          </button>
          <button
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            onClick={() => setSelected ? setSelected('dashboard') : navigate('/admin')}
          >
            <div className="text-center">
              <span className="text-2xl">⚙️</span>
              <p className="text-sm font-medium text-gray-900 mt-2">Cài đặt</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 