import React, { useState, useEffect } from 'react';
import { Tour } from '../../types/TourType';
import { toast } from 'react-toastify';
import { useGetToursQuery, useAddTourMutation, useUpdateTourMutation, useDeleteTourMutation } from '../../services/api';
import axios from 'axios';
import TourForm from './TourForm';
import axiosInstance from '@/config/axiosConfig';
import LoadingSpinner, { TableLoading } from '../LoadingSpinner';

function exportToCSV(data: Tour[], notify?: (msg: string) => void) {
  const header = ['ID', 'Tên Tour', 'Giá', 'Địa điểm', 'Mô tả', 'Đánh giá'];
  const rows = data.map(tour => [
    tour._id,
    tour.name,
    typeof tour.price === 'object' ? tour.price.VND?.perSlot : tour.price,
    (tour.destination || []).join('; '),
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
  const [tourReviews, setTourReviews] = useState<Record<string, { averageRating: number, reviewCount: number }>>({});

  // Lấy danh sách địa điểm duy nhất
  const alldestination = Array.from(
    new Set(
      (tours as any[]).flatMap((t: any) => Array.isArray(t.destination?.vi) ? t.destination.vi : [])
    )
  );

  // Lấy reviews cho tất cả tours
  useEffect(() => {
    if (tours.length > 0) {
      Promise.all(
        tours.map(async (tour: any) => {
          try {
            const res = await axiosInstance.get(`/reviews?tourId=${tour._id}`);
            const reviews = res.data.reviews || [];
            const averageRating = reviews.length > 0 ? (reviews.reduce((sum: number, r: any) => sum + (r.rating || 0), 0) / reviews.length) : 0;
            return { tourId: tour._id, averageRating: Number(averageRating.toFixed(1)), reviewCount: reviews.length };
          } catch {
            return { tourId: tour._id, averageRating: 0, reviewCount: 0 };
          }
        })
      ).then(results => {
        const reviewMap: Record<string, { averageRating: number, reviewCount: number }> = {};
        results.forEach(r => { reviewMap[r.tourId] = { averageRating: r.averageRating, reviewCount: r.reviewCount }; });
        setTourReviews(reviewMap);
      });
    }
  }, [tours]);



  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    if (type === 'success') {
      toast.success(message);
    } else {
      toast.error(message);
    }
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


  const handleInlineAdd = async (data: any, selectedFiles?: File[], imageData?: any) => {
  
    
    try {
  
      const formData = new FormData();
      formData.append('name', JSON.stringify(data.name));
      formData.append('type', JSON.stringify(data.type));
      formData.append('price', JSON.stringify(data.price));
      formData.append('destination', JSON.stringify(data.destination));
      formData.append('description', JSON.stringify(data.description));
      formData.append('shortDescription', JSON.stringify(data.shortDescription));
      formData.append('duration', JSON.stringify(data.duration));
      formData.append('guideLanguage', JSON.stringify(data.guideLanguage));
      formData.append('includedServices', JSON.stringify(data.includedServices));
      formData.append('excludedServices', JSON.stringify(data.excludedServices));
      formData.append('schedule', JSON.stringify(data.schedule));
      

      // Kiểm tra xem có phải đang edit tour không
      if (editTour && showEditForm) {
     
        // Update tour
        const response = await axiosInstance.put(`/tours/${editTour._id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
       
        showToast('Cập nhật tour thành công!', 'success');
        setShowEditForm(false);
        setEditTour(null);
      } else {
      
        
        // Thêm tour mới
        const response = await axiosInstance.post('/tours', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      
        
        showToast('Thêm tour mới thành công!', 'success');
        setShowAddForm(false);
      }
      
      
      refetch();
      
    } catch (error: any) {
      const action = editTour && showEditForm ? 'cập nhật' : 'thêm';
      const errorMessage = error?.response?.data?.message || error?.message || 'Unknown error';
      showToast(`Lỗi khi ${action} tour: ${errorMessage}`, 'error');
    }
  };

  // Lọc danh sách tour theo tìm kiếm và địa điểm
  const filteredTours = (tours as any[]).filter((tour: any) => {
    const matchName =
      (tour.name?.vi?.toLowerCase() || '').includes(search.toLowerCase()) ||
      (tour.name?.en?.toLowerCase() || '').includes(search.toLowerCase());
    const matchLocation = locationFilter ? (Array.isArray(tour.destination?.vi) ? tour.destination.vi.includes(locationFilter) : false) : true;
    return matchName && matchLocation;
  });


  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Quản lý Tour</h2>
            <p className="text-gray-600 mt-1">Quản lý danh sách các tour du lịch</p>
          </div>
        </div>
        <LoadingSpinner 
          type="hash" 
          size={60} 
          color="#3B82F6" 
          text="Đang tải dữ liệu tours..." 
          fullScreen={false}
          className="py-20"
        />
      </div>
    );
  }

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
          <TourForm
            inlineMode={true}
            onSubmit={handleInlineAdd}
            onClose={() => { setShowEditForm(false); setEditTour(null); }}
            initialData={editTour}
          />
        </div>
      )}
      {/* Inline Add Form */}
      {showAddForm && (
        <TourForm
          inlineMode
          onSubmit={handleInlineAdd}
          onClose={() => setShowAddForm(false)}
        />
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
          {alldestination.map(loc => (
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
       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                               <p className="text-2xl font-bold text-gray-900">
                  {(() => {
                    const allRatings = Object.values(tourReviews).map(r => r.averageRating).filter(r => r > 0);
                    if (allRatings.length === 0) return '0.0';
                    const avgRating = allRatings.reduce((sum, rating) => sum + rating, 0) / allRatings.length;
                    return avgRating.toFixed(1);
                  })()}
                </p>
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
                      {Array.isArray(tour.destination)
                        ? tour.destination.map((loc: any) => loc.vi).join(', ')
                        : ''}
                    </div>
                  </td>
                                     <td className="px-6 py-4 whitespace-nowrap">
                     <div className="flex items-center">
                       <span className="text-yellow-400">⭐</span>
                       <span className="ml-1 text-sm text-gray-900">
                         {tourReviews[tour._id]?.averageRating || '0.0'} ({tourReviews[tour._id]?.reviewCount || 0})
                       </span>
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