import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiEdit, FiTrash2, FiPlus, FiEye, FiEyeOff } from 'react-icons/fi';
import { FaTimes } from 'react-icons/fa';
import axiosInstance from '@/config/axiosConfig';
import { useTranslation } from 'react-i18next';

interface HeroCarouselSlide {
  _id: string;
  image: string;
  isActive: boolean;
}

export default function AdminHeroCarouselManager() {
  const { t } = useTranslation();
  const [slides, setSlides] = useState<HeroCarouselSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingSlide, setEditingSlide] = useState<HeroCarouselSlide | null>(null);
  const [formData, setFormData] = useState<{
    image: string | File;
    isActive: boolean;
  }>({
    image: '',
    isActive: true
  });

  useEffect(() => {
    fetchSlides();
  }, []);

  const fetchSlides = async () => {
    try {
      const response = await axiosInstance.get('/hero-carousel/admin');
      setSlides(response.data.slides);
    } catch (error) {
      console.error('Error fetching slides:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      
      if (formData.image instanceof File) {
        formDataToSend.append('image', formData.image);
      } else if (typeof formData.image === 'string' && formData.image.trim()) {
        formDataToSend.append('image', formData.image);
      }
      
      formDataToSend.append('isActive', formData.isActive.toString());

      if (editingSlide) {
        await axiosInstance.put(`/hero-carousel/${editingSlide._id}`, formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      } else {
        await axiosInstance.post('/hero-carousel', formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      }
      fetchSlides();
      setShowModal(false);
      setEditingSlide(null);
      resetForm();
    } catch (error) {
      console.error('Error saving slide:', error);
    }
  };

  const handleEdit = (slide: HeroCarouselSlide) => {
    setEditingSlide(slide);
    setFormData({
      image: slide.image,
      isActive: slide.isActive
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Bạn có chắc muốn xóa slide này?')) {
      try {
        await axiosInstance.delete(`/hero-carousel/${id}`);
        fetchSlides();
      } catch (error) {
        console.error('Error deleting slide:', error);
      }
    }
  };

  const toggleActive = async (slide: HeroCarouselSlide) => {
    try {
      await axiosInstance.put(`/hero-carousel/${slide._id}`, {
        ...slide,
        isActive: !slide.isActive
      });
      fetchSlides();
    } catch (error) {
      console.error('Error toggling slide:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      image: '',
      isActive: true
    });
  };

  const handleAddNew = () => {
    setEditingSlide(null);
    resetForm();
    setShowModal(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Quản lý Hero Carousel</h2>
        <button
          onClick={handleAddNew}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300"
        >
          <FiPlus />
          Thêm Slide Mới
        </button>
      </div>

      {/* Slides Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {slides.map((slide) => (
          <motion.div
            key={slide._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            {/* Image */}
            <div className="relative h-48 overflow-hidden">
              <img
                src={slide.image}
                alt="Slide"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 right-2 flex gap-2">
                <button
                  onClick={() => toggleActive(slide)}
                  className={`p-2 rounded-full ${
                    slide.isActive 
                      ? 'bg-green-500 text-white' 
                      : 'bg-gray-500 text-white'
                  }`}
                  title={slide.isActive ? 'Đang hiển thị' : 'Đang ẩn'}
                >
                  {slide.isActive ? <FiEye /> : <FiEyeOff />}
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-4">
              <h3 className="font-semibold text-gray-800 mb-2">
                Slide
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                {slide.isActive ? 'Đang hiển thị' : 'Đang ẩn'}
              </p>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(slide)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                >
                  <FiEdit />
                  Sửa
                </button>
                <button
                  onClick={() => handleDelete(slide._id)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                >
                  <FiTrash2 />
                  Xóa
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold">
                  {editingSlide ? 'Sửa Slide' : 'Thêm Slide Mới'}
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FaTimes />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Upload Ảnh hoặc URL
                  </label>
                  <div className="space-y-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setFormData({ ...formData, image: file });
                        }
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    <div className="text-sm text-gray-500">Hoặc</div>
                    <input
                      type="url"
                      value={typeof formData.image === 'string' ? formData.image : ''}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="mr-2"
                  />
                  <label htmlFor="isActive" className="text-sm text-gray-700">
                    Hiển thị slide
                  </label>
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300"
                  >
                    {editingSlide ? 'Cập nhật' : 'Thêm mới'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Hủy
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 