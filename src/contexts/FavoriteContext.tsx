import React, { createContext, useContext, useState, useEffect } from "react";
import axiosInstance from "@/config/axiosConfig";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

interface FavoriteContextType {
  tourFavorites: string[];
  addFavorite: (id: string) => Promise<boolean>;
  removeFavorite: (id: string) => Promise<boolean>;
  isFavorite: (id: string) => boolean;
}

const FavoriteContext = createContext<FavoriteContextType | undefined>(undefined);

export function FavoriteProvider({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated } = useSelector((state: RootState) => state.user);
  const userId = user?._id;
  const [tourFavorites, setTourFavorites] = useState<string[]>([]);

  // Fetch wishlist khi user thay đổi
  useEffect(() => {
    if (userId) {
      axiosInstance.get(`/users/${userId}/wishlist`).then(res => {
        setTourFavorites(res.data.wishlist.map((t: any) => t._id));
      }).catch(() => setTourFavorites([]));
    } else {
      setTourFavorites([]);
    }
  }, [userId]);

  // Thêm vào wishlist
  const addFavorite = async (id: string) => {
    if (!userId) return false;
    try {
      const res = await axiosInstance.post(`/users/${userId}/wishlist`, { tourId: id });
      setTourFavorites(res.data.wishlist.map((t: any) => t._id));
      return true;
    } catch {
      return false;
    }
  };
  // Xoá khỏi wishlist
  const removeFavorite = async (id: string) => {
    if (!userId) return false;
    try {
      const res = await axiosInstance.delete(`/users/${userId}/wishlist/${id}`);
      setTourFavorites(res.data.wishlist.map((t: any) => t._id));
      return true;
    } catch {
      return false;
    }
  };
  const isFavorite = (id: string) => tourFavorites.includes(id);

  return (
    <FavoriteContext.Provider value={{ tourFavorites, addFavorite, removeFavorite, isFavorite }}>
      {children}
    </FavoriteContext.Provider>
  );
}

export function useFavorite() {
  const ctx = useContext(FavoriteContext);
  if (!ctx) throw new Error("useFavorite must be used within FavoriteProvider");
  return ctx;
} 