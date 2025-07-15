import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useGetBookingsQuery, useDeleteBookingMutation, useUpdateBookingMutation, useGetUsersQuery } from '../../services/api';

const statusOptions = [
  { value: 'pending', label: 'Chờ xác nhận' },
  { value: 'confirmed', label: 'Đã xác nhận' },
  { value: 'cancelled', label: 'Đã hủy' },
];

const AdminBookingManager: React.FC = () => {
  const { data, refetch, isLoading } = useGetBookingsQuery();
  const bookings = data?.bookings || [];
  const [deleteBooking] = useDeleteBookingMutation();
  const [updateBooking] = useUpdateBookingMutation();
  const [editBooking, setEditBooking] = useState<any | null>(null);
  const [form, setForm] = useState<any | null>(null);
  const { data: usersData } = useGetUsersQuery();
  const guides = (usersData?.users || []).filter((u: any) => u.role === 'guide');

  const handleEdit = (booking: any) => {
    setEditBooking(booking);
    setForm({
      status: booking.status || 'pending',
      travelDate: booking.travelDate ? booking.travelDate.slice(0, 10) : '',
      numberOfPeople: booking.numberOfPeople || 1,
      guideId: booking.guideId?._id || booking.guideId || '',
      contactInfo: {
        fullName: booking.contactInfo?.fullName || '',
        phone: booking.contactInfo?.phone || '',
        email: booking.contactInfo?.email || '',
      },
    });
  };
  const handleDelete = async (id: string) => {
    await deleteBooking(id);
    toast.success('Xóa booking thành công!');
    refetch();
  };
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editBooking) return;
    try {
      await updateBooking({ id: editBooking._id || editBooking.id, data: form }).unwrap();
      toast.success('Cập nhật booking thành công!');
      setEditBooking(null);
      setForm(null);
      refetch();
    } catch (err) {
      toast.error('Lỗi khi cập nhật booking!');
    }
  };
  const confirmedCount = bookings.filter((b: any) => b.status === 'Đã đặt' || b.status === 'confirmed').length;
  const cancelledCount = bookings.filter((b: any) => b.status === 'Đã hủy' || b.status === 'cancelled').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Quản lý Booking</h2>
          <p className="text-gray-600 mt-1">Quản lý danh sách đặt tour và đặt phòng</p>
        </div>
      </div>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <span className="text-blue-600 text-xl">📅</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Tổng số Booking</p>
              <p className="text-2xl font-bold text-gray-900">{bookings.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <span className="text-green-600 text-xl">✅</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Đã xác nhận</p>
              <p className="text-2xl font-bold text-gray-900">{confirmedCount}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <span className="text-red-600 text-xl">❌</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Đã hủy</p>
              <p className="text-2xl font-bold text-gray-900">{cancelledCount}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <span className="text-purple-600 text-xl">💰</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Doanh thu</p>
              <p className="text-2xl font-bold text-gray-900">$8.2K</p>
            </div>
          </div>
        </div>
      </div>
      {/* Inline Edit Form */}
      {editBooking && form && (
        <form onSubmit={handleEditSubmit} className="bg-white p-6 rounded-lg shadow border border-yellow-200 mb-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
              <select
                value={form.status}
                onChange={e => setForm((f: any) => ({ ...f, status: e.target.value }))}
                className="w-full border border-gray-300 rounded px-3 py-2"
              >
                {statusOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ngày đi</label>
              <input
                type="date"
                value={form.travelDate}
                onChange={e => setForm((f: any) => ({ ...f, travelDate: e.target.value }))}
                className="w-full border border-gray-300 rounded px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Số người</label>
              <input
                type="number"
                min={1}
                value={form.numberOfPeople}
                onChange={e => setForm((f: any) => ({ ...f, numberOfPeople: Number(e.target.value) }))}
                className="w-full border border-gray-300 rounded px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Hướng dẫn viên</label>
              <select
                value={form.guideId || ''}
                onChange={e => setForm((f: any) => ({ ...f, guideId: e.target.value }))}
                className="w-full border border-gray-300 rounded px-3 py-2"
              >
                <option value="">-- Không chọn --</option>
                {guides.map((g: any) => (
                  <option key={g._id || g.id} value={g._id || g.id}>{g.name} ({g.email})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tên liên hệ</label>
              <input
                type="text"
                value={form.contactInfo.fullName}
                onChange={e => setForm((f: any) => ({ ...f, contactInfo: { ...f.contactInfo, fullName: e.target.value } }))}
                className="w-full border border-gray-300 rounded px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
              <input
                type="text"
                value={form.contactInfo.phone}
                onChange={e => setForm((f: any) => ({ ...f, contactInfo: { ...f.contactInfo, phone: e.target.value } }))}
                className="w-full border border-gray-300 rounded px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={form.contactInfo.email}
                onChange={e => setForm((f: any) => ({ ...f, contactInfo: { ...f.contactInfo, email: e.target.value } }))}
                className="w-full border border-gray-300 rounded px-3 py-2"
                required
              />
            </div>
          </div>
          <div className="flex space-x-2 mt-2">
            <button type="submit" className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg">Lưu</button>
            <button type="button" onClick={() => { setEditBooking(null); setForm(null); }} className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg">Hủy</button>
          </div>
        </form>
      )}
      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">STT</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tour</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hướng dẫn viên</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hành động</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                <tr><td colSpan={7} className="p-6 text-center text-gray-500">Đang tải dữ liệu...</td></tr>
              ) : (
                bookings.map((booking: any, idx: number) => (
                  <tr key={booking._id || booking.id} className="hover:bg-gray-50 transition-colors duration-200">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{idx + 1}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                          <span className="text-gray-600 text-sm font-medium">
                            {booking.user?.name ? booking.user.name.charAt(0).toUpperCase() : '?'}
                          </span>
                        </div>
                        <div className="text-sm font-medium text-gray-900">{booking.user?.name || booking.user || 'Ẩn danh'}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{booking.tour?.name || booking.tour || 'Ẩn danh'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{booking.travelDate ? booking.travelDate.slice(0, 10) : booking.date || booking.createdAt || ''}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        booking.status === 'Đã đặt' || booking.status === 'confirmed'
                          ? 'bg-green-100 text-green-800'
                          : booking.status === 'Đã hủy' || booking.status === 'cancelled'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {statusOptions.find(opt => opt.value === booking.status)?.label || booking.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {booking.guideId && (booking.guideId.name || booking.guideId.email) ? (
                        <div>
                          <div className="font-medium text-gray-900">{booking.guideId.name}</div>
                          <div className="text-xs text-gray-600">{booking.guideId.email}</div>
                          {booking.guideId.phone && <div className="text-xs text-gray-600">{booking.guideId.phone}</div>}
                        </div>
                      ) : (
                        <span className="text-gray-400">--</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleEdit(booking)}
                          className="text-blue-600 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded-md transition-colors duration-200"
                        >
                          ✏️ Sửa
                        </button>
                        <button
                          onClick={() => handleDelete(booking._id || booking.id)}
                          className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 px-3 py-1 rounded-md transition-colors duration-200"
                        >
                          🗑️ Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminBookingManager; 