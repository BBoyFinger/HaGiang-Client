import React, { useState } from 'react';
import { toast } from 'react-toastify';
import {
  useGetDestinationsQuery,
  useAddDestinationMutation,
  useUpdateDestinationMutation,
  useDeleteDestinationMutation,
} from '../../services/api';
import { useTranslation } from 'react-i18next';
import AdminDestinationForm from './AdminDestinationForm';

const AdminDestinationManager: React.FC = () => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language === 'en' ? 'en' : 'vi';
  const { data, refetch, isLoading } = useGetDestinationsQuery() as { data: { destinations: any[] } | undefined; refetch: () => void; isLoading: boolean };
  const destinations = data?.destinations || [];
  const [addDestination] = useAddDestinationMutation();
  const [updateDestination] = useUpdateDestinationMutation();
  const [deleteDestination] = useDeleteDestinationMutation();
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editDestination, setEditDestination] = useState<any | null>(null);

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
    setEditDestination(null);
    setShowEditForm(false);
  };
  const handleEdit = (id: string) => {
    const dest = destinations.find(d => d._id === id || d.id === id);
    if (dest) {
      setEditDestination(dest);
      setShowEditForm(true);
      setShowAddForm(false);
    }
  };
  const handleDelete = async (id: string) => {
    await deleteDestination(Number(id));
    showToast('Xóa điểm đến thành công!', 'success');
    refetch();
  };
  const handleAddSubmit = async (data: any) => {
    try {
      await addDestination(data).unwrap();
      showToast('Thêm điểm đến mới thành công!', 'success');
      setShowAddForm(false);
      refetch();
    } catch (error: any) {
      showToast('Lỗi khi thêm điểm đến!', 'error');
    }
  };
  const handleEditSubmit = async (data: any, newFiles?: File[]) => {
    try {
      // Nếu có file mới hoặc imagesToKeep, gửi dạng multipart/form-data
      if (newFiles && newFiles.length > 0) {
        const formData = new FormData();
        formData.append('name', JSON.stringify(data.name));
        formData.append('type', data.type);
        formData.append('shortDescription', JSON.stringify(data.shortDescription));
        formData.append('description', JSON.stringify(data.description));
        formData.append('location', JSON.stringify(data.location));
        formData.append('imagesToKeep', JSON.stringify(data.imagesToKeep || []));
        newFiles.forEach(file => formData.append('images', file));
        await updateDestination({ id: editDestination._id || editDestination.id, data: formData }).unwrap();
      } else {
        // Không có file mới, chỉ gửi JSON bình thường
        await updateDestination({ id: editDestination._id || editDestination.id, data }).unwrap();
      }
      showToast('Cập nhật điểm đến thành công!', 'success');
      setShowEditForm(false);
      setEditDestination(null);
      refetch();
    } catch (error: any) {
      showToast('Lỗi khi cập nhật điểm đến!', 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Quản lý Điểm đến</h2>
          <p className="text-gray-600 mt-1">Quản lý danh sách các điểm đến du lịch</p>
        </div>
        <button
          onClick={handleAdd}
          className={`bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200 ${showAddForm ? 'bg-gray-400 hover:bg-gray-500' : ''}`}
        >
          <span>{showAddForm ? '✖️' : '➕'}</span>
          <span>{showAddForm ? 'Hủy' : 'Thêm Điểm đến'}</span>
        </button>
      </div>
      {/* Inline Edit Form */}
      {showEditForm && editDestination && (
        <div className="bg-white p-6 rounded-lg shadow border border-yellow-200 mb-4">
          <AdminDestinationForm
            initialData={editDestination}
            onSubmit={handleEditSubmit}
            onCancel={() => { setShowEditForm(false); setEditDestination(null); }}
          />
        </div>
      )}
      {/* Inline Add Form */}
      {showAddForm && (
        <div className="bg-white p-6 rounded-lg shadow border border-blue-200">
          <AdminDestinationForm
            onSubmit={handleAddSubmit}
            onCancel={() => setShowAddForm(false)}
          />
        </div>
      )}
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <span className="text-blue-600 text-xl">📍</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Tổng số Điểm đến</p>
              <p className="text-2xl font-bold text-gray-900">{destinations.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <span className="text-green-600 text-xl">🌿</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Thiên nhiên</p>
              <p className="text-2xl font-bold text-gray-900">3</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <span className="text-yellow-600 text-xl">🏛️</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Văn hóa</p>
              <p className="text-2xl font-bold text-gray-900">1</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <span className="text-purple-600 text-xl">📸</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Lượt xem</p>
              <p className="text-2xl font-bold text-gray-900">2.4K</p>
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mô tả</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hành động</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {destinations.map((dest, idx) => (
                <tr key={dest._id || dest.id} className="hover:bg-gray-50 transition-colors duration-200">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{idx + 1}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{dest.name?.[lang] || ''}</div>
                      <div className="text-sm text-gray-500">{dest.currency}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 max-w-xs truncate">
                      {dest.shortDescription?.[lang] || ''}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEdit(dest._id || dest.id)}
                        className="text-blue-600 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded-md transition-colors duration-200"
                      >
                        ✏️ Sửa
                      </button>
                      <button
                        onClick={() => handleDelete(dest._id || dest.id)}
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

export default AdminDestinationManager; 