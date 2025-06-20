export type DestinationType = "thiên nhiên" | "văn hóa" | "lịch sử";

export interface Destination {
  id: string;
  name: string;
  type: DestinationType;
  image: string;
  images: string[];
  shortDesc: string;
  description: string;
  location: { lat: number; lng: number };
}

export const destinations: Destination[] = [
  {
    id: "ma-pi-leng",
    name: "Đèo Mã Pí Lèng",
    type: "thiên nhiên",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
    images: [
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=800&q=80",
    ],
    shortDesc: "Một trong tứ đại đỉnh đèo nổi tiếng nhất Việt Nam.",
    description: "Đèo Mã Pí Lèng là một trong những cung đường đèo hiểm trở và đẹp nhất miền Bắc, nổi tiếng với cảnh quan hùng vĩ và những khúc cua tay áo ngoạn mục.",
    location: { lat: 23.0841, lng: 105.4146 },
  },
  {
    id: "lung-cu",
    name: "Cột cờ Lũng Cú",
    type: "lịch sử",
    image: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=400&q=80",
    images: [
      "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=800&q=80",
    ],
    shortDesc: "Điểm cực Bắc thiêng liêng của Tổ quốc.",
    description: "Cột cờ Lũng Cú là biểu tượng thiêng liêng của chủ quyền quốc gia, nơi du khách có thể ngắm nhìn toàn cảnh vùng biên giới phía Bắc.",
    location: { lat: 23.3535, lng: 105.3047 },
  },
  {
    id: "hoang-su-phi",
    name: "Ruộng bậc thang Hoàng Su Phì",
    type: "thiên nhiên",
    image: "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80",
    images: [
      "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
    ],
    shortDesc: "Vẻ đẹp kỳ vĩ của ruộng bậc thang mùa lúa chín.",
    description: "Hoàng Su Phì nổi tiếng với những thửa ruộng bậc thang trải dài trên sườn núi, đặc biệt đẹp vào mùa lúa chín vàng rực.",
    location: { lat: 22.6666, lng: 104.6833 },
  },
  {
    id: "dong-van-old-town",
    name: "Phố cổ Đồng Văn",
    type: "văn hóa",
    image: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80",
    images: [
      "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=800&q=80",
    ],
    shortDesc: "Khu phố cổ mang đậm nét văn hóa vùng cao.",
    description: "Phố cổ Đồng Văn là nơi lưu giữ nhiều giá trị văn hóa, kiến trúc độc đáo và là điểm đến hấp dẫn cho du khách yêu thích lịch sử, văn hóa.",
    location: { lat: 23.2597, lng: 105.3831 },
  },
];

const destinations1 = [
  {
    id: 1,
    name: "Bali Paradise",
    location: "Indonesia",
    price: 1299,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4",
    type: "beach"
  },
  {
    id: 2,
    name: "Swiss Alps",
    location: "Switzerland",
    price: 1899,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a",
    type: "mountain"
  },
  {
    id: 3,
    name: "Tokyo Lights",
    location: "Japan",
    price: 1599,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26",
    type: "city"
  }
];