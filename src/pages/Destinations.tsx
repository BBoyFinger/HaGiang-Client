import React, { useState } from "react";
import { destinations } from "../data/destinations";
import type { DestinationType } from "../data/destinations";
import DestinationCard from "../components/DestinationCard";

const types: DestinationType[] = ["thiên nhiên", "văn hóa", "lịch sử"];

export default function Destinations() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<DestinationType | "">("");

  const filtered = destinations.filter((d) => {
    const matchType = filter ? d.type === filter : true;
    const matchName = d.name.toLowerCase().includes(search.toLowerCase());
    return matchType && matchName;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">Các điểm du lịch Hà Giang</h2>
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Tìm kiếm theo tên..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded px-3 py-2 flex-1"
        />
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as DestinationType | "")}
          className="border rounded px-3 py-2 w-48"
        >
          <option value="">Tất cả loại</option>
          {types.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filtered.map((d) => (
          <DestinationCard key={d.id} destination={d} />
        ))}
        {filtered.length === 0 && <div>Không tìm thấy điểm du lịch phù hợp.</div>}
      </div>
    </div>
  );
} 