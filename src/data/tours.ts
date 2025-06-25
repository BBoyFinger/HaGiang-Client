import { Tour } from "@/types/TourType";


export const tours: Tour[] = [
  {
    id: '1',
    name: 'Trekking Sông Nho Quế',
    type: 'song',
    slug: 'trekking-song-nho-que',
    description: 'Trekking ven sông, ngắm cảnh quan hùng vĩ, thăm bản làng truyền thống.',
    locations: ['Sông Nho Quế', 'Bản làng H\'Mong'],
    price: {
      perSlot: 2200000,
      groupPrice: 1800000,
      currency: 'VND',
    },
    duration: '1 ngày',
    guideLanguage: ['English', 'Vietnamese'],
    includedServices: [
      'Nước uống suốt hành trình',
      'Đồ ăn (trưa nhẹ và picnic)',
      'Xe máy đưa đón khi cần thiết',
      'Dựng video, chụp ảnh hành trình full HD',
      'Hướng dẫn viên tiếng Anh'
    ],
    imageUrls: [
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb'
    ],
    createdAt: new Date('2024-05-01'),
    rating: 4.5
  },
  {
    id: '2',
    name: 'Khám phá Hang Tả Lủng',
    type: 'hang_dong',
    slug: 'kham-pha-hang-ta-lung',
    description: 'Khám phá hang động kỳ bí, hệ thống đá và thạch nhũ độc đáo.',
    locations: ['Hang Tả Lủng', 'Hố Sụt Sủng Là'],
    price: {
      perSlot: 2200000,
      groupPrice: 1800000,
      currency: 'VND',
    },
    duration: '1 ngày',
    guideLanguage: ['English', 'Vietnamese'],
    includedServices: [
      'Nước uống suốt hành trình',
      'Đồ ăn (trưa nhẹ và picnic)',
      'Xe máy đưa đón khi cần thiết',
      'Dựng video, chụp ảnh hành trình full HD',
      'Hướng dẫn viên tiếng Anh'
    ],
    imageUrls: [
      'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429'
    ],
    createdAt: new Date('2024-05-02'),
    rating: 4.0
  },
  {
    id: '3',
    name: 'Chinh phục Vách Đá Trắng & Mã Pì Lèng',
    type: 'nui',
    slug: 'chinh-phuc-vach-da-trang-ma-pi-leng',
    description: 'Chinh phục vách đá trắng, Mã Pì Lèng, ngắm toàn cảnh thung lũng.',
    locations: ['Vách Đá Trắng', 'Mã Pì Lèng'],
    price: {
      perSlot: 2200000,
      groupPrice: 1800000,
      currency: 'VND',
    },
    duration: '1 ngày',
    guideLanguage: ['English', 'Vietnamese'],
    includedServices: [
      'Nước uống suốt hành trình',
      'Đồ ăn (trưa nhẹ và picnic)',
      'Xe máy đưa đón khi cần thiết',
      'Dựng video, chụp ảnh hành trình full HD',
      'Hướng dẫn viên tiếng Anh'
    ],
    imageUrls: [
      'https://images.unsplash.com/photo-1464983953574-0892a716854b'
    ],
    createdAt: new Date('2024-05-03'),
    rating: 5.0
  },
  {
    id: '4',
    name: 'Tour Luxury 4 ngày 3 đêm with easy ride',
    type: 'luxury',
    slug: 'tour-luxury-4-ngay-3-dem',
    description: 'Khám phá cao nguyên đá Đồng Văn, trải nghiệm dịch vụ cao cấp.',
    locations: ['Đồng Văn', 'Sông Nho Quế', 'Vách Đá Trắng', 'Mã Pì Lèng'],
    price: {
      perSlot: 6000000,
      currency: 'VNĐ',
    },
    duration: '4 ngày 3 đêm',
    guideLanguage: ['English', 'Vietnamese'],
    includedServices: [
      'Khám phá sông Nho Quế - vách đá trắng – Mã Pì Lèng',
      'Thưởng thức đặc sản vùng cao',
      'Thăm các bản làng H\'Mong',
      'Trekking ngắm núi và rừng nguyên sinh',
      'Khám phá hang động nguyên sơ',
      'Nấu ăn ngoài trời theo set menu Á-Âu bởi top chef Việt Nam',
      'HDV: Tiếng anh chuyên nghiệp',
      'Phương tiện đi lại cần thiết',
      'Đồ bảo hộ',
      'Nước uống đầy đủ trong hành trình'
    ],
    imageUrls: [
      'https://images.unsplash.com/photo-1519125323398-675f0ddb6308'
    ],
    createdAt: new Date('2024-05-04'),
    rating: 4.8
  },
  {
    id: '5',
    name: 'Tour Luxury 3 ngày 2 đêm with easy ride',
    type: 'luxury',
    slug: 'tour-luxury-3-ngay-2-dem',
    description: 'Khám phá cao nguyên đá Đồng Văn, trải nghiệm dịch vụ cao cấp.',
    locations: ['Đồng Văn', 'Sông Nho Quế', 'Vách Đá Trắng', 'Mã Pì Lèng'],
    price: {
      perSlot: 400,
      currency: 'EUR',
    },
    duration: '3 ngày 2 đêm',
    guideLanguage: ['English', 'Vietnamese'],
    includedServices: [
      'Khám phá sông Nho Quế - vách đá trắng – Mã Pì Lèng',
      'Thưởng thức đặc sản vùng cao',
      'Thăm các bản làng H\'Mong',
      'Trekking ngắm núi và rừng nguyên sinh',
      'Khám phá hang động nguyên sơ',
      'Nấu ăn ngoài trời theo set menu Á-Âu bởi top chef Việt Nam',
      'HDV: Tiếng anh chuyên nghiệp',
      'Phương tiện đi lại cần thiết',
      'Đồ bảo hộ',
      'Nước uống đầy đủ trong hành trình'
    ],
    imageUrls: [
      'https://images.unsplash.com/photo-1519125323398-675f0ddb6308'
    ],
    createdAt: new Date('2024-05-04'),
    rating: 4.8
  }

]; 