export interface Review {
  id: string;
  destinationId: string;
  user: string;
  rating: number;
  comment: string;
  date: string;
}

export const reviews: Review[] = [
  {
    id: "1",
    destinationId: "ma-pi-leng",
    user: "Nguyen Van A",
    rating: 5,
    comment: "Cảnh đẹp tuyệt vời, rất đáng để trải nghiệm!",
    date: "2024-06-20",
  },
  {
    id: "2",
    destinationId: "lung-cu",
    user: "Le Thi B",
    rating: 4,
    comment: "Không khí trong lành, phong cảnh hữu tình.",
    date: "2024-06-19",
  },
]; 