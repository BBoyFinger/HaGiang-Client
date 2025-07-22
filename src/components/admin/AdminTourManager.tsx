import React, { useState, useEffect } from 'react';
import { tours } from '../../data/tours';
import { Tour } from '../../types/TourType';
import AdminTourFormModal from './AdminTourFormModal';
import { toast } from 'react-toastify';
import * as tourApi from '../../api/tours';
import { useGetToursQuery, useAddTourMutation, useUpdateTourMutation, useDeleteTourMutation } from '../../services/api';
import axios from 'axios';

function exportToCSV(data: Tour[], notify?: (msg: string) => void) {
  const header = ['ID', 'Tên Tour', 'Giá', 'Địa điểm', 'Mô tả', 'Đánh giá'];
  const rows = data.map(tour => [
    tour._id,
    tour.name,
    typeof tour.price === 'object' ? tour.price.VND?.perSlot : tour.price,
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
  const { data, refetch, isLoading } = useGetToursQuery() as { data: { tours: Tour[] } | undefined; refetch: () => void; isLoading: boolean };
  const tours = data?.tours || [];
  const [addTour] = useAddTourMutation();
  const [updateTour] = useUpdateTourMutation();
  const [deleteTour] = useDeleteTourMutation();
  const [modalOpen, setModalOpen] = useState(false);
  const [editTour, setEditTour] = useState<Tour | null>(null);
  const [search, setSearch] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);

  // Lấy danh sách địa điểm duy nhất
  const allLocations = Array.from(
    new Set(
      (tours as any[]).flatMap((t: any) => Array.isArray(t.locations?.vi) ? t.locations.vi : [])
    )
  );



  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    if (type === 'success') {
      toast.success(message);
    } else {
      toast.error(message);
    }
  };
  const removeToast = (id: string) => {
    // No-op for react-toastify
  };

  const handleAdd = () => {
    setShowAddForm((prev) => !prev);
    setEditTour(null);
    setModalOpen(false);
    setShowEditForm(false);
  };
  const handleEdit = (id: string) => {
    const tour = (tours as Tour[]).find((t: Tour) => t._id === id);
    if (tour) {
      setEditTour(tour);
      setShowEditForm(true);
      setShowAddForm(false);
    }
  };
  const handleDelete = async (id: string) => {
    await deleteTour(id);
    showToast('Xóa tour thành công!', 'success');
    refetch();
  };

  const handleModalSubmit = async (data: any, selectedFiles?: File[]) => {
    try {
      if (editTour) {
        const formData = new FormData();
        formData.append('name', JSON.stringify(data.name));
        formData.append('type', JSON.stringify(data.type));
        formData.append('price', JSON.stringify(data.price));
        formData.append('locations', JSON.stringify(data.locations));
        formData.append('description', JSON.stringify(data.description));
        formData.append('shortDescription', JSON.stringify(data.shortDescription));
        formData.append('duration', JSON.stringify(data.duration));
        formData.append('guideLanguage', JSON.stringify(data.guideLanguage));
        formData.append('includedServices', JSON.stringify(data.includedServices));
        formData.append('excludedServices', JSON.stringify(data.excludedServices));
        formData.append('schedule', JSON.stringify(data.schedule));
        if (selectedFiles && selectedFiles.length > 0) {
          selectedFiles.forEach(file => {
            formData.append('images', file);
          });
        }
        await axios.put(`/api/tours/${editTour._id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        showToast('Cập nhật tour thành công!', 'success');
        setShowEditForm(false);
        setEditTour(null);
      } else {
        // Thêm mới (đã xử lý ở handleInlineAdd)
        await handleInlineAdd(data, selectedFiles);
        return;
      }
      setModalOpen(false);
      refetch();
    } catch (error: any) {
      showToast('Có lỗi xảy ra khi cập nhật tour!', 'error');
      console.error(error);
    }
  };

  const handleInlineAdd = async (data: any, selectedFiles?: File[]) => {
    console.log('Submit data:', data, selectedFiles)
    try {
      const formData = new FormData();
      formData.append('name', JSON.stringify(data.name));
      formData.append('type', JSON.stringify(data.type));
      formData.append('price', JSON.stringify(data.price));
      formData.append('locations', JSON.stringify(data.locations));
      formData.append('description', JSON.stringify(data.description));
      formData.append('shortDescription', JSON.stringify(data.shortDescription));
      formData.append('duration', JSON.stringify(data.duration));
      formData.append('guideLanguage', JSON.stringify(data.guideLanguage));
      formData.append('includedServices', JSON.stringify(data.includedServices));
      formData.append('excludedServices', JSON.stringify(data.excludedServices));
      formData.append('schedule', JSON.stringify(data.schedule));
      if (selectedFiles && selectedFiles.length > 0) {
        selectedFiles.forEach(file => {
          formData.append('images', file);
        });
      }
      await axios.post('/api/tours', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      showToast('Thêm tour mới thành công!', 'success');
      setShowAddForm(false);
      refetch();
    } catch (error: any) {
      console.error('Error adding tour:', error);
      showToast(`Lỗi khi thêm tour: ${error?.response?.data?.message || error?.message || 'Unknown error'}`, 'error');
    }
  };

  // Lọc danh sách tour theo tìm kiếm và địa điểm
  const filteredTours = (tours as any[]).filter((tour: any) => {
    const matchName =
      (tour.name?.vi?.toLowerCase() || '').includes(search.toLowerCase()) ||
      (tour.name?.en?.toLowerCase() || '').includes(search.toLowerCase());
    const matchLocation = locationFilter ? (Array.isArray(tour.locations?.vi) ? tour.locations.vi.includes(locationFilter) : false) : true;
    return matchName && matchLocation;
  });


  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Quản lý Tour</h2>
          <p className="text-gray-600 mt-1">Quản lý danh sách các tour du lịch</p>
        </div>
        <button
          onClick={handleAdd}
          className={`bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200 ${showAddForm ? 'bg-gray-400 hover:bg-gray-500' : ''}`}
        >
          <span>{showAddForm ? '✖️' : '➕'}</span>
          <span>{showAddForm ? 'Hủy' : 'Thêm Tour'}</span>
        </button>
      </div>
      {/* Inline Edit Form */}
      {showEditForm && editTour && (
        <div className="bg-white p-6 rounded-lg shadow border border-yellow-200 mb-4">
          <AdminTourFormModal
            open={true}
            onClose={() => { setShowEditForm(false); setEditTour(null); }}
            onSubmit={handleInlineAdd}
            initialData={editTour}
            inlineMode={true}
          />
        </div>
      )}
      {/* Inline Add Form */}
      {showAddForm && (
        <div className="bg-white p-6 rounded-lg shadow border border-blue-200">
          <AdminTourFormModal
            open={true}
            onClose={() => setShowAddForm(false)}
            onSubmit={handleInlineAdd}
            initialData={null}
            inlineMode={true}
          />
        </div>
      )}

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
              <p className="text-2xl font-bold text-gray-900">{tours.length}</p>
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
              <p className="text-2xl font-bold text-gray-900">{tours.length}</p>
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">STT</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên Tour</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Giá</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Địa điểm</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Đánh giá</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hành động</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTours.map((tour: any, index: number) => (
                <tr key={tour.id} className="hover:bg-gray-50 transition-colors duration-200">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{index + 1}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{tour.name?.vi || ''}</div>
                      <div className="text-sm text-gray-500">{tour.duration?.vi || ''}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {tour.price?.VND?.perSlot ? `${tour.price.VND.perSlot.toLocaleString('vi-VN')} VND` : 'N/A'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {Array.isArray(tour.locations)
                        ? tour.locations.map((loc: any) => loc.vi).join(', ')
                        : ''}
                    </div>
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
                        onClick={() => handleEdit(tour._id)}
                        className="text-blue-600 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded-md transition-colors duration-200"
                      >
                        ✏️ Sửa
                      </button>
                      <button
                        onClick={() => handleDelete(tour._id)}
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