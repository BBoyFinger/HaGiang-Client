import React, { useState } from 'react';
import { destinations } from '../../data/destinations';
import AdminDestinationFormModal from './AdminDestinationFormModal';
import ToastNotification, { Toast } from './ToastNotification';

const AdminDestinationManager: React.FC = () => {
  const [destinationList, setDestinationList] = useState(destinations);
  const [modalOpen, setModalOpen] = useState(false);
  const [editDestination, setEditDestination] = useState<any | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (message: string, type: Toast['type'] = 'success') => {
    setToasts((prev) => [
      ...prev,
      { id: Math.random().toString(36).slice(2), type, message },
    ]);
  };
  const removeToast = (id: string) => setToasts((prev) => prev.filter(t => t.id !== id));

  const handleAdd = () => {
    setEditDestination(null);
    setModalOpen(true);
  };
  const handleEdit = (id: number) => {
    const dest = destinationList.find(d => d.id === id);
    if (dest) {
      setEditDestination(dest);
      setModalOpen(true);
    }
  };
  const handleDelete = (id: number) => {
    setDestinationList(destinationList.filter(d => d.id !== id));
    showToast('Xóa điểm đến thành công!', 'success');
  };
  const handleModalSubmit = (data: any) => {
    if (editDestination) {
      setDestinationList(destinationList.map(d => d.id === editDestination.id ? { ...d, ...data } : d));
      showToast('Cập nhật điểm đến thành công!', 'success');
    } else {
      setDestinationList([
        ...destinationList,
        {
          ...data,
          id: Math.floor(Math.random() * 1000000),
        },
      ]);
      showToast('Thêm điểm đến mới thành công!', 'success');
    }
    setModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <ToastNotification toasts={toasts} onRemove={removeToast} />
      <AdminDestinationFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleModalSubmit}
        initialData={editDestination}
      />
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Quản lý Điểm đến</h2>
          <p className="text-gray-600 mt-1">Quản lý danh sách các điểm đến du lịch</p>
        </div>
        <button 
          onClick={handleAdd}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200"
        >
          <span>➕</span>
          <span>Thêm Điểm đến</span>
        </button>
      </div>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <span className="text-blue-600 text-xl">📍</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Tổng số Điểm đến</p>
              <p className="text-2xl font-bold text-gray-900">{destinationList.length}</p>
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mô tả</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Giá từ</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hành động</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {destinationList.map((dest) => (
                <tr key={dest.id} className="hover:bg-gray-50 transition-colors duration-200">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{dest.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{dest.name}</div>
                      <div className="text-sm text-gray-500">{dest.currency}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 max-w-xs truncate">
                      {dest.shortDescription}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {dest.priceFrom?.toLocaleString()} {dest.currency}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => handleEdit(dest.id)}
                        className="text-blue-600 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded-md transition-colors duration-200"
                      >
                        ✏️ Sửa
                      </button>
                      <button 
                        onClick={() => handleDelete(dest.id)}
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