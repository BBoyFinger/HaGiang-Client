import { Hotel } from "@/types/HotelType"


export const hotels: Hotel[] = [
    {
        id: "hotel_001",
        name: "Phoenix Hotel Ha Giang",
        description: "A modern 4-star hotel located in the heart of Ha Giang City, perfect for relaxing before or after your Ha Giang Loop journey.",
        address: "No. 92B Nguyen Trai Street, Ha Giang City",
        city: "Ha Giang",
        country: "Vietnam",
        price_per_night: "45.00",
        rating: 4.5,
        star_rating: 4,
        images: [
            "@/assets/hotels/hotel3.jpg",
            "https://example.com/images/phoenix2.jpg"
        ],
        phone: "+84 219 3899 888",
        email: "info@phoenixhotelhg.com",
        website_url: "http://phoenixhotelhagiang.com/",
        created_at: new Date("2022-06-15T10:00:00Z"),
        updated_at: new Date("2023-12-01T08:30:00Z")
    },
    {
        id: "hotel_002",
        name: "Yen Bien Luxury Hotel",
        description: "A luxurious hotel offering comfortable rooms, city views, and excellent amenities, just steps from Ha Giang city center.",
        address: "209 Ly Tu Trong, Ha Giang City",
        city: "Ha Giang",
        country: "Vietnam",
        price_per_night: "42.00",
        rating: 4.6,
        star_rating: 4,
        images: [
            "@/assets/hotels/hotel2.jpg",
            "https://example.com/images/yenbien2.jpg"
        ],
        phone: "+84 219 382 1234",
        email: "booking@yenbienhotel.vn",
        website_url: "https://yenbienluxury.myharavan.com/",
        created_at: new Date("2021-11-01T09:00:00Z"),
        updated_at: new Date("2024-02-14T15:45:00Z")
    },
    {
        id: "hotel_003",
        name: "Ha Giang Riverside Hostel",
        description: "Budget-friendly hostel ideal for backpackers, with cozy rooms and easy access to motorbike rentals for Ha Giang Loop.",
        address: "Km0, Ha Giang City",
        city: "Ha Giang",
        country: "Vietnam",
        price_per_night: "5.00",
        rating: 4.4,
        star_rating: 2,
        images: [
            "@/assets/hotels/hotel-3.jpg",
        ],
        phone: "+84 936 123 456",
        email: "riversidehostel@gmail.com",
        website_url: "https://hagiangriverside.com/",
        created_at: new Date("2023-01-10T14:00:00Z"),
        updated_at: new Date("2024-06-01T10:00:00Z")
    },
    {
        id: "homestay_001",
        name: "Dao Lodge Homestay",
        description: "Trải nghiệm văn hóa bản địa tại Dao Lodge Homestay, nằm giữa thiên nhiên hùng vĩ của Hà Giang. Phù hợp cho nhóm bạn, gia đình hoặc du khách muốn khám phá bản sắc dân tộc Dao.",
        address: "Nam Dam Village, Quan Ba, Ha Giang",
        city: "Ha Giang",
        country: "Vietnam",
        price_per_night: "18.00",
        rating: 4.8,
        star_rating: 3,
        images: [
            "@/assets/hotels/hotel4.jpg",
            "https://www.booking.com/hotel/vn/dao-lodge-homestay.html"
        ],
        phone: "+84 912 345 678",
        email: "contact@daolodge.com",
        website_url: "https://daolodge.com/",
        created_at: new Date("2023-05-20T12:00:00Z"),
        updated_at: new Date("2024-06-01T10:00:00Z")
    }
];