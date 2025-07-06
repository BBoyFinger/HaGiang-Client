import React, { useState } from "react";
import { useUpdateProfileMutation } from "../services/api";

interface UserProfileProps {
  avatarUrl: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  onProfileUpdate?: (data: { avatarUrl: string; name: string }) => void;
}

const UserProfile: React.FC<UserProfileProps> = ({
  avatarUrl,
  name,
  email,
  phone,
  address,
  onProfileUpdate,
}) => {
  const [editOpen, setEditOpen] = useState(false);
  const [form, setForm] = useState({ name, avatarUrl, phone, address });
  const [updateProfile, { isLoading }] = useUpdateProfileMutation();
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleEdit = () => {
    setForm({ name, avatarUrl, phone, address });
    setEditOpen(true);
    setSuccess("");
    setError("");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const updated = await updateProfile(form).unwrap();
      setSuccess("Cập nhật thành công!");
      setEditOpen(false);
      if (onProfileUpdate) {
        onProfileUpdate({ avatarUrl: form.avatarUrl, name: form.name });
      } else {
        window.location.reload();
      }
    } catch (err: any) {
      setError(err?.data?.message || "Có lỗi xảy ra");
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-xl p-8 mt-8 flex flex-col items-center gap-6">
      <div className="relative">
        <img
          src={avatarUrl}
          alt="Avatar"
          className="w-32 h-32 rounded-full object-cover border-4 border-blue-500 shadow-md"
        />
        <button
          onClick={handleEdit}
          className="absolute bottom-2 right-2 bg-blue-500 text-white rounded-full p-2 shadow hover:bg-blue-600 transition"
          title="Chỉnh sửa thông tin"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487a2.1 2.1 0 1 1 2.97 2.97L7.5 19.79l-4 1 1-4 13.362-13.303z" />
          </svg>
        </button>
      </div>
      <div className="text-center w-full">
        <h2 className="text-2xl font-bold text-gray-800 mb-1">{name}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 text-left">
          <div>
            <p className="text-gray-700 font-semibold">Email:</p>
            <p className="text-gray-600">{email}</p>
          </div>
          <div>
            <p className="text-gray-700 font-semibold">Số điện thoại:</p>
            <p className="text-gray-600">{phone}</p>
          </div>
          <div className="sm:col-span-2">
            <p className="text-gray-700 font-semibold">Địa chỉ:</p>
            <p className="text-gray-600">{address}</p>
          </div>
        </div>
      </div>
      <button
        onClick={handleEdit}
        className="mt-6 px-6 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition text-lg font-semibold"
      >
        Chỉnh sửa thông tin
      </button>

      {/* Modal chỉnh sửa */}
      {editOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md relative animate-fade-in">
            <button type="button" onClick={() => setEditOpen(false)} className="absolute top-3 right-3 text-gray-400 hover:text-red-500 text-xl">×</button>
            <h3 className="text-xl font-bold mb-4 text-blue-600">Chỉnh sửa thông tin cá nhân</h3>
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-1">Tên</label>
              <input name="name" value={form.name} onChange={handleChange} className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-1">Số điện thoại</label>
              <input name="phone" value={form.phone} onChange={handleChange} className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-1">Avatar URL</label>
              <input name="avatarUrl" value={form.avatarUrl} onChange={handleChange} className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-1">Địa chỉ</label>
              <input name="address" value={form.address} onChange={handleChange} className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" />
            </div>
            {error && <div className="text-red-500 mb-2">{error}</div>}
            {success && <div className="text-green-600 mb-2">{success}</div>}
            <button type="submit" disabled={isLoading} className="w-full bg-blue-500 text-white py-2 rounded-lg font-semibold hover:bg-blue-600 transition">
              {isLoading ? "Đang lưu..." : "Lưu thay đổi"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default UserProfile; 