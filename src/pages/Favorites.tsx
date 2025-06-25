import React from "react";
import { useFavorite } from "../contexts/FavoriteContext";
import { destinations } from "../data/destinations";
import DestinationCard from "../components/DestinationCard";

export default function Favorites() {
  const { favorites } = useFavorite();
  const favDest = destinations.filter((d: any) => favorites.includes(d.id));
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">Điểm du lịch yêu thích</h2>
      {favDest.length === 0 ? (
        <div>Bạn chưa lưu điểm du lịch nào.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {favDest.map((d) => (
            <DestinationCard key={d.id} destination={d} />
          ))}
        </div>
      )}
    </div>
  );
} 