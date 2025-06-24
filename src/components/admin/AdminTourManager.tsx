import React, { useState } from 'react';
import { tours } from '../../data/tours';
import { Tour } from '../../types/TourType';
import AdminTourFormModal from './AdminTourFormModal';
import ToastNotification, { Toast } from './ToastNotification';

function exportToCSV(data: Tour[], notify?: (msg: string) => void) {
  const header = ['ID', 'Tên Tour', 'Giá', 'Địa điểm', 'Mô tả', 'Đánh giá'];
  const rows = data.map(tour => [
    tour.id,
    tour.name,
    typeof tour.price === 'object' ? tour.price.perSlot : tour.price,
    (tour.locations || []).join('; '),
    tour.description || '',
    tour.rating || '',
  ]);
  const csvContent = [header, ...rows].map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', 'tours_report.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  if (notify) notify('Xuất file CSV thành công!');
}

const AdminTourManager: React.FC = () => {
  const [tourList, setTourList] = useState<Tour[]>(tours);
  const [modalOpen, setModalOpen] = useState(false);
  const [editTour, setEditTour] = useState<Tour | null>(null);
  const [search, setSearch] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Lấy danh sách địa điểm duy nhất
  const allLocations = Array.from(new Set(tours.flatMap(t => t.locations || [])));

  const showToast = (message: string, type: Toast['type'] = 'success') => {
    setToasts((prev) => [
      ...prev,
      { id: Math.random().toString(36).slice(2), type, message },
    ]);
  };
  const removeToast = (id: string) => setToasts((prev) => prev.filter(t => t.id !== id));

  const handleAdd = () => {
    setEditTour(null);
    setModalOpen(true);
  };
  const handleEdit = (id: string) => {
    const tour = tourList.find(t => t.id === id);
    if (tour) {
      setEditTour(tour);
      setModalOpen(true);
    }
  };
  const handleDelete = (id: string) => {
    setTourList(tourList.filter(t => t.id !== id));
    showToast('Xóa tour thành công!', 'success');
  };

  const handleModalSubmit = (data: any) => {
    if (editTour) {
      setTourList(tourList.map(t => t.id === editTour.id ? { ...t, ...data } : t));
      showToast('Cập nhật tour thành công!', 'success');
    } else {
      setTourList([
        ...tourList,
        {
          ...data,
          id: (Math.random() * 1000000).toFixed(0),
          price: { perSlot: data.price, currency: 'VND' },
          locations: data.locations,
        },
      ]);
      showToast('Thêm tour mới thành công!', 'success');
    }
    setModalOpen(false);
  };

  // Lọc danh sách tour theo tìm kiếm và địa điểm
  const filteredTours = tourList.filter(tour => {
    const matchName = tour.name.toLowerCase().includes(search.toLowerCase());
    const matchLocation = locationFilter ? (tour.locations?.includes(locationFilter)) : true;
    return matchName && matchLocation;
  });

  return (
    <div className="space-y-6">
      <ToastNotification toasts={toasts} onRemove={removeToast} />
      <AdminTourFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleModalSubmit}
        initialData={editTour}
      />
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Quản lý Tour</h2>
          <p className="text-gray-600 mt-1">Quản lý danh sách các tour du lịch</p>
        </div>
        <button 
          onClick={handleAdd}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200"
        >
          <span>➕</span>
          <span>Thêm Tour</span>
        </button>
      </div>

      {/* Search & Filter & Export */}
      <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-2 md:space-y-0">
        <input
          type="text"
          placeholder="Tìm kiếm theo tên tour..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full md:w-64 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <select
          value={locationFilter}
          onChange={e => setLocationFilter(e.target.value)}
          className="w-full md:w-56 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="">Tất cả địa điểm</option>
          {allLocations.map(loc => (
            <option key={loc} value={loc}>{loc}</option>
          ))}
        </select>
        <button
          onClick={() => exportToCSV(filteredTours, (msg) => showToast(msg, 'success'))}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold ml-0 md:ml-4"
        >
          ⬇️ Export CSV
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <span className="text-blue-600 text-xl">🗺️</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Tổng số Tour</p>
              <p className="text-2xl font-bold text-gray-900">{tourList.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <span className="text-green-600 text-xl">✅</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Đang hoạt động</p>
              <p className="text-2xl font-bold text-gray-900">{tourList.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <span className="text-yellow-600 text-xl">⭐</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Đánh giá TB</p>
              <p className="text-2xl font-bold text-gray-900">4.5</p>
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
              <p className="text-2xl font-bold text-gray-900">$12.5K</p>
            </div>
          </div>
        </div>
      </div>
      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên Tour</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Giá</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Địa điểm</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Đánh giá</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hành động</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTours.map((tour, index) => (
                <tr key={tour.id} className="hover:bg-gray-50 transition-colors duration-200">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{tour.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{tour.name}</div>
                      <div className="text-sm text-gray-500">{tour.duration}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {typeof tour.price === 'object' ? `${tour.price.perSlot?.toLocaleString()} ${tour.price.currency}` : tour.price}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{tour.locations?.join(', ')}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className="text-yellow-400">⭐</span>
                      <span className="ml-1 text-sm text-gray-900">{tour.rating}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => handleEdit(tour.id)}
                        className="text-blue-600 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded-md transition-colors duration-200"
                      >
                        ✏️ Sửa
                      </button>
                      <button 
                        onClick={() => handleDelete(tour.id)}
                        className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 px-3 py-1 rounded-md transition-colors duration-200"
                      >
                        🗑️ Xóa
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminTourManager; 