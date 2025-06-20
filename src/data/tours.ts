export interface Tour {
  id: string;
  name: string;
  description: string;
  type: string;
  destinations: string[]; // id các điểm du lịch
  price: number;
  availableDates: string[]; // ISO date
}

export const tours: Tour[] = [
  {
    id: "tour1",
    name: "Khám phá Hà Giang 3 ngày 2 đêm",
    description: "Hành trình khám phá các điểm nổi bật nhất Hà Giang.",
    type: "Trọn gói",
    destinations: ["ma-pi-leng", "lung-cu", "dong-van-old-town"],
    price: 3500000,
    availableDates: ["2024-07-01", "2024-07-10", "2024-07-20"],
  },
  {
    id: "tour2",
    name: "Chinh phục ruộng bậc thang Hoàng Su Phì",
    description: "Tour dành cho người yêu thiên nhiên và nhiếp ảnh.",
    type: "Thiên nhiên",
    destinations: ["hoang-su-phi", "ma-pi-leng"],
    price: 2800000,
    availableDates: ["2024-07-05", "2024-07-15"],
  },
]; 