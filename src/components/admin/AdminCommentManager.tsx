import React, { useState, useMemo } from 'react';
import {
  useGetCommentsQuery,
  useApproveCommentMutation,
  useRejectCommentMutation,
  useDeleteCommentMutation,
  useUpdateCommentMutation,
  useGetBlogsQuery,
  useGetToursQuery,
  useGetDestinationsQuery,
} from '../../services/api';
import { toast } from 'react-toastify';

const statusLabels: Record<string, string> = {
  pending: 'Chờ duyệt',
  approved: 'Đã duyệt',
  rejected: 'Từ chối',
};

const refTypeLabels: Record<string, string> = {
  blog: 'Blog',
  tour: 'Tour',
  destination: 'Điểm đến',
};

const AdminCommentManager: React.FC = () => {
  const [statusFilter, setStatusFilter] = useState('pending');
  const [refTypeFilter, setRefTypeFilter] = useState('');
  const [search, setSearch] = useState('');
  const { data, refetch, isLoading } = useGetCommentsQuery({ status: statusFilter, refType: refTypeFilter || undefined });
  const comments = data?.comments || [];
  const [approveComment] = useApproveCommentMutation();
  const [rejectComment] = useRejectCommentMutation();
  const [deleteComment] = useDeleteCommentMutation();
  const [updateComment] = useUpdateCommentMutation();
  const [editId, setEditId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');

  // Lấy dữ liệu liên kết
  const { data: blogData } = useGetBlogsQuery();
  const { data: tourData } = useGetToursQuery();
  const { data: destData } = useGetDestinationsQuery();
  const blogs = blogData?.blogs || [];
  const tours = tourData?.tours || [];
  const destinations = destData?.destinations || [];

  // Map id -> tên liên kết
  const refMap = useMemo(() => {
    const map: Record<string, { name: string; url: string }> = {};
    blogs.forEach((b: any) => map[b._id || b.id] = { name: b.title?.vi || b.title || '', url: `/admin/blog/${b.slug || b._id || b.id}` });
    tours.forEach((t: any) => map[t._id || t.id] = { name: t.name?.vi || t.name || '', url: `/admin/tour/${t.slug || t._id || t.id}` });
    destinations.forEach((d: any) => map[d._id || d.id] = { name: d.name?.vi || d.name || '', url: `/admin/destination/${d.slug || d._id || d.id}` });
    return map;
  }, [blogs, tours, destinations]);

  // Lọc theo nội dung
  const filteredComments = useMemo(() => {
    return comments.filter((c: any) =>
      (!search || c.content.toLowerCase().includes(search.toLowerCase()))
    );
  }, [comments, search]);

  const handleApprove = async (id: string) => {
    await approveComment(id);
    refetch();
    toast.success('Duyệt bình luận thành công!');
  };
  const handleReject = async (id: string) => {
    await rejectComment(id);
    refetch();
    toast.success('Từ chối bình luận thành công!');
  };
  const handleDelete = async (id: string) => {
    await deleteComment(id);
    refetch();
    toast.success('Xóa bình luận thành công!');
  };
  const handleEdit = (id: string, content: string) => {
    setEditId(id);
    setEditContent(content);
  };
  const handleEditSave = async () => {
    if (editId) {
      await updateComment({ id: editId, content: editContent });
      setEditId(null);
      setEditContent('');
      refetch();
      toast.success('Cập nhật bình luận thành công!');
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <span className="text-blue-600 text-xl">💬</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Tổng bình luận</p>
              <p className="text-2xl font-bold text-gray-900">{comments.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <span className="text-yellow-600 text-xl">⏳</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Chờ duyệt</p>
              <p className="text-2xl font-bold text-gray-900">{comments.filter((c: any) => c.status === 'pending').length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <span className="text-green-600 text-xl">✅</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Đã duyệt</p>
              <p className="text-2xl font-bold text-gray-900">{comments.filter((c: any) => c.status === 'approved').length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <span className="text-red-600 text-xl">❌</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Từ chối</p>
              <p className="text-2xl font-bold text-gray-900">{comments.filter((c: any) => c.status === 'rejected').length}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 md:gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Quản lý Bình luận</h2>
          <p className="text-gray-600 mt-1">Kiểm duyệt, chỉnh sửa, xóa bình luận của người dùng</p>
        </div>
        <div className="flex flex-col md:flex-row gap-2 md:gap-4 items-center">
          <input
            type="text"
            placeholder="Tìm nội dung..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2"
          />
          <select
            value={refTypeFilter}
            onChange={e => setRefTypeFilter(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2"
          >
            <option value="">Tất cả loại</option>
            <option value="blog">Blog</option>
            <option value="tour">Tour</option>
            <option value="destination">Điểm đến</option>
          </select>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2"
          >
            <option value="pending">Chờ duyệt</option>
            <option value="approved">Đã duyệt</option>
            <option value="rejected">Từ chối</option>
          </select>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="p-6 text-center text-gray-500">Đang tải dữ liệu...</div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nội dung</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Loại</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Liên kết</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hành động</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredComments.map((c: any, idx: number) => {
                  const ref = refMap[c.refId] || { name: c.refId, url: '#' };
                  return (
                    <tr key={c._id} className="hover:bg-gray-50 transition-colors duration-200">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{idx + 1}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{c.user?.name || c.user || 'Ẩn danh'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap max-w-xs">
                        {editId === c._id ? (
                          <div className="flex items-center gap-2">
                            <input
                              value={editContent}
                              onChange={e => setEditContent(e.target.value)}
                              className="border border-gray-300 rounded px-2 py-1 w-full"
                            />
                            <button onClick={handleEditSave} className="text-green-600 px-2">Lưu</button>
                            <button onClick={() => setEditId(null)} className="text-gray-500 px-2">Hủy</button>
                          </div>
                        ) : (
                          <div className="text-sm text-gray-900 max-w-xs truncate">{c.content}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-xs px-2 py-1 rounded bg-gray-100 border border-gray-200">{refTypeLabels[c.refType] || c.refType}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap max-w-xs">
                        <a href={ref.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline" title={ref.name}>{ref.name}</a>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-xs px-2 py-1 rounded bg-gray-100 border border-gray-200">{statusLabels[c.status] || c.status}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{c.createdAt ? new Date(c.createdAt).toLocaleString() : ''}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          {c.status === 'pending' && (
                            <>
                              <button onClick={() => handleApprove(c._id)} className="text-green-600 hover:text-green-900 bg-green-50 hover:bg-green-100 px-3 py-1 rounded-md">Duyệt</button>
                              <button onClick={() => handleReject(c._id)} className="text-yellow-600 hover:text-yellow-900 bg-yellow-50 hover:bg-yellow-100 px-3 py-1 rounded-md">Từ chối</button>
                            </>
                          )}
                          <button onClick={() => handleEdit(c._id, c.content)} className="text-blue-600 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded-md">Sửa</button>
                          <button onClick={() => handleDelete(c._id)} className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 px-3 py-1 rounded-md">Xóa</button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminCommentManager; 