import React, { useState } from 'react';
import { toast } from 'react-toastify';
import AdminBlogForm from './AdminBlogForm';
import {
  useGetBlogsQuery,
  useAddBlogMutation,
  useUpdateBlogMutation,
  useDeleteBlogMutation,
} from '../../services/api';

function slugify(str: string) {
  return str
    .toString()
    .normalize('NFD')
    .replace(/\[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

const AdminBlogManager: React.FC = () => {
  const { data, refetch, isLoading } = useGetBlogsQuery() as { data: { blogs: any[] } | undefined; refetch: () => void; isLoading: boolean };
  const blogs = data?.blogs || [];
  const [addBlog] = useAddBlogMutation();
  const [updateBlog] = useUpdateBlogMutation();
  const [deleteBlog] = useDeleteBlogMutation();
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editBlog, setEditBlog] = useState<any | null>(null);

  const handleAdd = () => {
    setShowAddForm((prev) => !prev);
    setEditBlog(null);
    setShowEditForm(false);
  };
  const handleEdit = (slug: string) => {
    const blog = blogs.find(b => b.slug === slug);
    if (blog) {
      setEditBlog(blog);
      setShowEditForm(true);
      setShowAddForm(false);
    }
  };
  const handleDelete = async (id: string) => {
    await deleteBlog(id);
    toast.success('Xóa blog thành công!');
    refetch();
  };
  const handleAddSubmit = async (data: any, newFiles?: File[]) => {
    try {
      const slug = slugify(data.title?.vi || data.title?.en || '');
      if (newFiles && newFiles.length > 0) {
        const formData = new FormData();
        formData.append('title.vi', data.title.vi);
        formData.append('title.en', data.title.en);
        formData.append('content.vi', data.content.vi);
        formData.append('content.en', data.content.en);
        formData.append('tags', JSON.stringify(data.tags));
        formData.append('author', data.author);
        formData.append('status', data.status);
        formData.append('thumbnail', data.thumbnail);
        formData.append('slug', slug);
        data.imagesToKeep && formData.append('imagesToKeep', JSON.stringify(data.imagesToKeep));
        newFiles.forEach(file => formData.append('images', file));
        await addBlog(formData).unwrap();
      } else {
        await addBlog({ ...data, slug }).unwrap();
      }
      toast.success('Thêm blog mới thành công!');
      setShowAddForm(false);
      refetch();
    } catch (error: any) {
      toast.error('Lỗi khi thêm blog!');
    }
  };
  const handleEditSubmit = async (data: any, newFiles?: File[]) => {
    try {
      const slug = slugify(data.title?.vi || data.title?.en || '');
      if (newFiles && newFiles.length > 0) {
        const formData = new FormData();
        formData.append('title.vi', data.title.vi);
        formData.append('title.en', data.title.en);
        formData.append('content.vi', data.content.vi);
        formData.append('content.en', data.content.en);
        formData.append('tags', JSON.stringify(data.tags));
        formData.append('author', data.author);
        formData.append('status', data.status);
        formData.append('thumbnail', data.thumbnail);
        formData.append('slug', slug);
        data.imagesToKeep && formData.append('imagesToKeep', JSON.stringify(data.imagesToKeep));
        newFiles.forEach(file => formData.append('images', file));
        await updateBlog({ id: editBlog._id || editBlog.id, data: formData }).unwrap();
      } else {
        await updateBlog({ id: editBlog._id || editBlog.id, data: { ...data, slug } }).unwrap();
      }
      toast.success('Cập nhật blog thành công!');
      setShowEditForm(false);
      setEditBlog(null);
      refetch();
    } catch (error: any) {
      toast.error('Lỗi khi cập nhật blog!');
    }
  };

  

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Quản lý Blog</h2>
          <p className="text-gray-600 mt-1">Quản lý danh sách bài viết, review, tin tức</p>
        </div>
        <button
          onClick={handleAdd}
          className={`bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200 ${showAddForm ? 'bg-gray-400 hover:bg-gray-500' : ''}`}
        >
          <span>{showAddForm ? '✖️' : '➕'}</span>
          <span>{showAddForm ? 'Hủy' : 'Thêm Blog'}</span>
        </button>
      </div>
      {/* Inline Edit Form */}
      {showEditForm && editBlog && (
        <div className="bg-white p-6 rounded-lg shadow border border-yellow-200 mb-4">
          <AdminBlogForm
            initialData={editBlog}
            onSubmit={handleEditSubmit}
            onCancel={() => { setShowEditForm(false); setEditBlog(null); }}
          />
        </div>
      )}
      {/* Inline Add Form */}
      {showAddForm && (
        <div className="bg-white p-6 rounded-lg shadow border border-blue-200">
          <AdminBlogForm
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
              <span className="text-blue-600 text-xl">📝</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Tổng số Bài viết</p>
              <p className="text-2xl font-bold text-gray-900">{blogs.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <span className="text-green-600 text-xl">✅</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Đã xuất bản</p>
              <p className="text-2xl font-bold text-gray-900">{blogs.filter(b => b.status === 'published').length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <span className="text-yellow-600 text-xl">🕒</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Bản nháp</p>
              <p className="text-2xl font-bold text-gray-900">{blogs.filter(b => b.status === 'draft').length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <span className="text-purple-600 text-xl">💬</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Tổng bình luận</p>
              <p className="text-2xl font-bold text-gray-900">{blogs.reduce((sum, b) => sum + (Array.isArray(b.comments) ? b.comments.length : 0), 0)}</p>
            </div>
          </div>
        </div>
      </div>
      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="p-6 text-center text-gray-500">Đang tải dữ liệu...</div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tiêu đề</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tác giả</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày tạo</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hành động</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {blogs.map((blog, idx) => (
                  <tr key={blog._id || blog.id || blog.slug} className="hover:bg-gray-50 transition-colors duration-200">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{idx + 1}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{blog.title?.vi || ''}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{blog.author}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-xs px-2 py-1 rounded bg-gray-100 border border-gray-200">{blog.status}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{blog.createdAt ? new Date(blog.createdAt).toLocaleDateString() : ''}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleEdit(blog.slug)}
                          className="text-blue-600 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded-md transition-colors duration-200"
                        >
                          ✏️ Sửa
                        </button>
                        <button
                          onClick={() => handleDelete(blog._id || blog.id)}
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
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminBlogManager; 