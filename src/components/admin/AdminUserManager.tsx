import React, { useState, useMemo } from 'react';
import { toast } from 'react-toastify';
import {
  useGetUsersQuery,
  useAddUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useChangeUserRoleMutation,
  useToggleUserActiveMutation,
} from '../../services/api';

const AdminUserManager: React.FC = () => {
  const { data, refetch, isLoading } = useGetUsersQuery();
  const users = data?.users || [];
  const [addUser] = useAddUserMutation();
  const [updateUser] = useUpdateUserMutation();
  const [deleteUser] = useDeleteUserMutation();
  const [changeUserRole] = useChangeUserRoleMutation();
  const [toggleUserActive] = useToggleUserActiveMutation();
  const [search, setSearch] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editUser, setEditUser] = useState<any | null>(null);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'user' });

  // Stats
  const adminCount = users.filter((u: any) => u.role === 'admin').length;
  const userCount = users.filter((u: any) => u.role === 'user').length;
  const activeCount = users.filter((u: any) => u.isActive).length;

  // Tìm kiếm
  const filteredUsers = useMemo(() => {
    return users.filter((u: any) =>
      (!search || u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()))
    );
  }, [users, search]);

  // CRUD
  const handleAdd = () => {
    setShowAddForm(true);
    setEditUser(null);
    setForm({ name: '', email: '', password: '', role: 'user' });
  };
  const handleEdit = (user: any) => {
    setEditUser(user);
    setShowAddForm(true);
    setForm({ name: user.name, email: user.email, password: '', role: user.role });
  };
  const handleDelete = async (id: string) => {
    await deleteUser(id);
    toast.success('Xóa user thành công!');
    refetch();
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editUser) {
        await updateUser({ id: editUser._id || editUser.id, data: { name: form.name, email: form.email, role: form.role } }).unwrap();
        toast.success('Cập nhật user thành công!');
      } else {
        await addUser(form).unwrap();
        toast.success('Thêm user mới thành công!');
      }
      setShowAddForm(false);
      setEditUser(null);
      refetch();
    } catch (err: any) {
      toast.error('Lỗi khi lưu user!');
    }
  };
  const handleChangeRole = async (id: string, role: string) => {
    await changeUserRole({ id, role });
    toast.success('Đổi vai trò thành công!');
    refetch();
  };
  const handleToggleActive = async (id: string) => {
    await toggleUserActive(id);
    toast.success('Cập nhật trạng thái user!');
    refetch();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Quản lý Người dùng</h2>
          <p className="text-gray-600 mt-1">Quản lý danh sách người dùng hệ thống</p>
        </div>
        <button
          onClick={handleAdd}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200"
        >
          <span>➕</span>
          <span>Thêm User</span>
        </button>
      </div>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <span className="text-blue-600 text-xl">👥</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Tổng số User</p>
              <p className="text-2xl font-bold text-gray-900">{users.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <span className="text-green-600 text-xl">👑</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Admin</p>
              <p className="text-2xl font-bold text-gray-900">{adminCount}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <span className="text-yellow-600 text-xl">👤</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">User thường</p>
              <p className="text-2xl font-bold text-gray-900">{userCount}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <span className="text-purple-600 text-xl">✅</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Đang hoạt động</p>
              <p className="text-2xl font-bold text-gray-900">{activeCount}</p>
            </div>
          </div>
        </div>
      </div>
      {/* Tìm kiếm */}
      <div className="flex items-center mb-2">
        <input
          type="text"
          placeholder="Tìm tên hoặc email..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 w-full max-w-xs"
        />
      </div>
      {/* Form thêm/sửa */}
      {showAddForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow border border-blue-200 space-y-4 mb-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tên *</label>
              <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="w-full border border-gray-300 rounded px-3 py-2" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
              <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} className="w-full border border-gray-300 rounded px-3 py-2" required />
            </div>
          </div>
          {!editUser && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu *</label>
              <input type="password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} className="w-full border border-gray-300 rounded px-3 py-2" required />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {form.role === 'guide' ? 'Tài khoản hướng dẫn viên' : 'Vai trò'}
            </label>
            <select value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))} className="w-full border border-gray-300 rounded px-3 py-2">
              <option value="user">User</option>
              <option value="admin">Admin</option>
              <option value="editor">Editor</option>
              <option value="guide">Hướng dẫn viên</option>
            </select>
          </div>
          <div className="flex space-x-2">
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">Lưu</button>
            <button type="button" onClick={() => { setShowAddForm(false); setEditUser(null); }} className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg">Hủy</button>
          </div>
        </form>
      )}
      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="p-6 text-center text-gray-500">Đang tải dữ liệu...</div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">STT</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vai trò</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tài khoản hướng dẫn viên</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hành động</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user: any, idx: number) => (
                  <tr key={user._id || user.id} className="hover:bg-gray-50 transition-colors duration-200">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{idx + 1}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                          <span className="text-gray-600 text-sm font-medium">
                            {user.name?.charAt(0).toUpperCase() || '?'}
                          </span>
                        </div>
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{user.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={user.role}
                        onChange={e => handleChangeRole(user._id || user.id, e.target.value)}
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          user.role === 'admin'
                            ? 'bg-red-100 text-red-800'
                            : user.role === 'editor'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-green-100 text-green-800'
                        }`}
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                        <option value="editor">Editor</option>
                        <option value="guide">Hướng dẫn viên</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleToggleActive(user._id || user.id)}
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${user.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-500'}`}
                      >
                        {user.isActive ? 'Hoạt động' : 'Đã khóa'}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {user.role === 'guide' ? (
                        <div>
                          <div className="font-medium text-gray-900">{user.name}</div>
                          <div className="text-xs text-gray-600">{user.email}</div>
                          {user.phone && <div className="text-xs text-gray-600">{user.phone}</div>}
                        </div>
                      ) : (
                        <span className="text-gray-400">--</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleEdit(user)}
                          className="text-blue-600 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded-md transition-colors duration-200"
                        >
                          ✏️ Sửa
                        </button>
                        <button
                          onClick={() => handleDelete(user._id || user.id)}
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

export default AdminUserManager; 