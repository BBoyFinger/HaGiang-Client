import React from "react";
import UserProfile from "../components/UserProfile";
import { useGetCurrentUserQuery } from "../services/api";
import { useDispatch } from "react-redux";
import { setUser } from "../store/slice/userSlice";

const Profile: React.FC = () => {
  const { data: user, isLoading, error } = useGetCurrentUserQuery(undefined, { refetchOnMountOrArgChange: true });
  const dispatch = useDispatch();

  console.log(user);

  if (isLoading) return <div className="text-center mt-10 text-lg">Đang tải thông tin...</div>;
  if (error || !user) return <div className="text-center mt-10 text-red-500">Không thể tải thông tin người dùng.</div>;

  const handleProfileUpdate = (data: { avatarUrl: string; name: string }) => {
    dispatch(setUser({ ...user.user, ...data }));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <UserProfile
        avatarUrl={user.user.avatarUrl || "/assets/user/tri.jpg"}
        name={user.user.name || "Chưa có tên"}
        email={user.user.email || "Chưa có email"}
        phone={user.user.phone || "Chưa có số điện thoại"}
        address={user.user.address || "Chưa có địa chỉ"}
        onProfileUpdate={handleProfileUpdate}
      />
    </div>
  );
};

export default Profile; 