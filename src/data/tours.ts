import { Tour } from "@/types/TourType";


export const tours: Tour[] = [
  {
    _id: '1',
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
    _id: '2',
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
    _id: '3',
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
    _id: '4',
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
    _id: '5',
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

export const mockTours = [
  {
    name: {
      vi: "Tour Khám Phá Thiên Nhiên - Tour rừng",
      en: "Nature Exploration Tour - Forest Trek"
    },
    type: {
      vi: "Trekking",
      en: "Trekking"
    },
    description: {
      vi: `<h2>Tour rừng :</h2><p><span style="color: rgb(68, 69, 69);">Chuyến trekking khám phá Hà Giang trong rừng là một trải nghiệm tuyệt vời để khám phá vẻ đẹp hoang sơ và hùng vĩ của thiên nhiên. Hãy cùng nhau bước vào thế giới rừng rậm, hít thở không khí trong lành và ngắm nhìn những cảnh đẹp hùng vĩ mà chỉ có ở Hà Giang.</span></p><h2>Địa điểm : Ma Ú – Rừng Thiên Hương cổ thụ - Má tìa – Lài cò – Pố Lỗ</h2><p><br></p><p><span style="color: rgb(68, 69, 69);">Khi bắt đầu hành trình, bạn sẽ được đắm chìm trong khung cảnh của rừng xanh ngút ngàn, với những dải sương mù bồng bềnh, tạo nên bức tranh huyền bí và đẹp mắt. Điều đặc biệt ở chuyến trekking này chính là sự gần gũi với thiên nhiên hoang dã và cảm giác thư thái, yên bình mà nơi đây mang lại.</span></p><p><br></p><p><span style="color: rgb(68, 69, 69);">Hành trình sẽ đưa bạn qua những con đường đồi núi hiểm trở, những cánh rừng rậm nguyên sinh, và những dòng suối trong xanh mát lạnh. Đừng quên dừng chân, thư giãn và thưởng thức bữa ăn ngon lành với đặc sản của vùng miền tại những bản làng rừng sâu.</span></p><p><br></p><p><span style="color: rgb(68, 69, 69);">Cuối cùng, khi hoàn thành chuyến trekking, bạn sẽ mang theo những kỷ niệm đẹp và những trải nghiệm đáng nhớ về vùng đất Hà Giang hoang sơ và thơ mộng.</span></p><p><br></p><p><span style="color: rgb(68, 69, 69);">Hãy chuẩn bị tinh thần và trang bị cho mình những trải nghiệm đầy ý nghĩa và thú vị trong chuyến đi rừng này nhé! Chúc bạn có một chuyến trekking thật tuyệt vời!</span></p>`,
      en: `<h2><strong>Forest Tour:</strong></h2><p>The trekking journey to explore Ha Giang's forests is a wonderful experience to discover the pristine and majestic beauty of nature. Let's step into the world of dense forests, breathe in the fresh air, and admire the magnificent sceneries unique to Ha Giang.</p><h2><strong>Destinations:</strong> Ma Ú – Thiên Hương Ancient Forest – Má Tìa – Lài Cò – Pố Lỗ</h2><p><br></p><p>At the start of the journey, you'll be immersed in the vast green forest landscape, with layers of floating mist creating a mystical and captivating picture. The highlight of this trekking trip lies in the closeness to the wild nature and the sense of relaxation and tranquility that this place offers.</p><p><br></p><p>The journey will lead you through rugged mountain trails, pristine dense forests, and cool, clear streams. Don't forget to pause, relax, and enjoy a delicious meal featuring local specialties in the remote forest villages.</p><p><br></p><p>Finally, upon completing the trek, you'll carry with you beautiful memories and unforgettable experiences of the wild and poetic land of Ha Giang.</p><p><br></p><p>Get ready in spirit and equip yourself for a meaningful and exciting adventure in the forest! Wishing you an amazing trekking trip!</p>`
    },
    shortDescription: {
      vi: "Tour trekking rừng Hà Giang 1 ngày",
      en: "1-day forest trekking tour in Ha Giang"
    },
    duration: {
      vi: "1 ngày",
      en: "1 day"
    },
    schedule: {
      vi: [
        {
          day: 1,
          title: "Khám phá rừng Thiên Hương",
          activities: [
            "Khởi hành từ Hà Giang",
            "Trekking qua rừng Thiên Hương cổ thụ",
            "Tham quan Ma Ú và Má tìa",
            "Ăn trưa tại bản làng",
            "Tiếp tục trekking qua Lài cò và Pố Lỗ",
            "Quay về Hà Giang"
          ]
        }
      ],
      en: [
        {
          day: 1,
          title: "Thien Huong Forest Exploration",
          activities: [
            "Depart from Ha Giang",
            "Trek through ancient Thien Huong forest",
            "Visit Ma U and Ma Tia",
            "Lunch at village",
            "Continue trekking through Lai Co and Po Lo",
            "Return to Ha Giang"
          ]
        }
      ]
    },
    slug: "tour-kham-pha-thien-nhien-tour-rung",
    locations: [
      { vi: "Ma Ú", en: "Ma U" },
      { vi: "Rừng Thiên Hương cổ thụ", en: "Ancient Thien Huong Forest" },
      { vi: "Má tìa", en: "Ma Tia" },
      { vi: "Lài cò", en: "Lai Co" },
      { vi: "Pố Lỗ", en: "Po Lo" }
    ],
    imageUrls: [
      "https://res.cloudinary.com/du8wxuzhr/image/upload/v1752167949/hagiangtravel/1752167947846-thienhuong.jpg.jpg"
    ],
    price: {
      VND: {
        perSlot: 2500000,
        groupPrice: 2200000,
        discountPrice: 2000000
      },
      USD: {
        perSlot: 100,
        groupPrice: 90,
        discountPrice: 80
      },
      EUR: {
        perSlot: 85,
        groupPrice: 75,
        discountPrice: 70
      }
    },
    guideLanguage: [
      { vi: "Tiếng Anh", en: "English" }
    ],
    includedServices: [
      { vi: "Nước uống suốt hành trình", en: "Drinking water throughout the journey" },
      { vi: "Đồ ăn (trưa nhẹ và picnic) được nấu bởi bếp trưởng hàng đầu Việt Nam", en: "Meals (light lunch and picnic) prepared by a top Vietnamese chef" },
      { vi: "Xe máy đưa đón khi cần thiết", en: "Motorbike transfers when needed" },
      { vi: "Dựng video, chụp ảnh hành trình full HD", en: "Full HD video shooting and photography during the trip" },
      { vi: "Hướng dẫn viên tiếng Anh", en: "English-speaking tour guide" }
    ],
    excludedServices: [
      { vi: "Chi phí cá nhân", en: "Personal expenses" }
    ],
    rating: 0,
    reviews: [],
    createdAt: "2025-07-10T00:00:00.000Z",
    updatedAt: "2025-07-12T01:55:17.997Z"
  },
  {
    name: {
      vi: "Tour Hang Động or Hố Sụt",
      en: "Cave and Sinkhole Exploration Tour"
    },
    type: {
      vi: "Hang Động",
      en: "Cave"
    },
    description: {
      vi: `<h2><strong>Hang Tả Lủng or Hố Sụt Sủng Là</strong></h2><p>Chuyến đi khám phá hang động tại Hà Giang sẽ mang đến cho bạn những trải nghiệm đầy kỳ diệu và hấp dẫn. Hang động ẩn chứa những hệ thống đá và hình thạch độc đáo, tạo nên một không gian kỳ bí và huyền bí.</p><h3><strong>HANG TẢ LỦNG</strong></h3><p>Hang Mây thuộc xã Tả Lủng – huyện Đồng Văn, nằm cạnh tuyến đường nối huyện Đồng Văn và huyện Mèo Vạc. Cửa Hang Mây có hình dạng tựa búp sen khổng lồ. Những tia nắng mặt trời chiếu qua cửa hang gặp hơi nước bốc lên, tạo thành làn sương huyền ảo. Chính vì thế, người bản địa gọi tên hang động này là Hang Mây.</p><h3><strong>HỐ SỤT SỦNG LÀ</strong></h3><p>Hố sụt là một hiện tượng tương tác tự nhiên, và có những nguyên nhân khác nhau. Thông thường, tại vùng xảy ra sụt đất thường có cấu trúc địa chất đặc thù và một quá trình vận động lâu dài làm rỗng dần đất đá bên dưới.</p><h2>Hãy để hướng dẫn viên dẫn dắt bạn khám phá bí ẩn của hang động, cùng tìm hiểu về lịch sử và địa chất đặc biệt của địa điểm.</h2>`,
      en: `<h2><strong>Hang Tả Lủng or Hố Sụt Sủng Là</strong></h2><p>A trip to explore the caves in Ha Giang will bring you magical and fascinating experiences. The caves harbor unique rock formations and stalactites, creating a mystical and mysterious atmosphere.</p><h3><strong>HANG TẢ LỦNG</strong></h3><p>Hang May (Cloud Cave) is located in Ta Lung Commune, Dong Van District, right beside the road connecting Dong Van and Meo Vac districts. The entrance of Hang May is shaped like a giant lotus bud. When sunlight streams through the cave entrance and meets rising mist, it creates a dreamy, mystical scene. That’s why locals call this cave “Hang May” or “Cloud Cave.”</p><h3><strong>HỐ SỤT SỦNG LÀ</strong></h3><p>A sinkhole is a natural phenomenon resulting from various causes. Typically, areas where sinkholes occur have distinctive geological structures, and a long-term process gradually hollows out the rock and soil beneath the surface.</p><p>Let the tour guide lead you on an adventure to uncover the secrets of these caves, while learning about the unique history and geology of these remarkable sites.</p>`
    },
    shortDescription: {
      vi: "Tour khám phá hang động và hố sụt kỳ bí tại Hà Giang.",
      en: "Explore the mysterious caves and sinkholes in Ha Giang."
    },
    duration: {
      vi: "1 ngày",
      en: "1 day"
    },
    schedule: {
      vi: [
        {
          day: 1,
          title: "Khám phá Hang Tả Lủng và Hố Sụt Sủng Là",
          activities: [
            "Khởi hành từ Hà Giang",
            "Tham quan Hang Tả Lủng (Hang Mây), ngắm nhìn các khối đá và thạch nhũ độc đáo",
            "Tìm hiểu hiện tượng tự nhiên tại Hố Sụt Sủng Là",
            "Ăn trưa picnic tại bản làng gần hang",
            "Tiếp tục khám phá các cảnh quan xung quanh khu vực hang động",
            "Quay về Hà Giang"
          ]
        }
      ],
      en: [
        {
          day: 1,
          title: "Exploration of Hang Ta Lung and Ho Sut Sung La",
          activities: [
            "Depart from Ha Giang",
            "Visit Hang Ta Lung (Cloud Cave) and admire unique rock formations and stalactites",
            "Learn about the natural phenomenon at Ho Sut Sung La",
            "Picnic lunch at a nearby village",
            "Continue exploring surrounding landscapes and cave areas",
            "Return to Ha Giang"
          ]
        }
      ]
    },
    slug: "tour-hang-dong-or-ho-sut",
    locations: [
      { vi: "Hang Tả Lủng", en: "Hang Ta Lung" },
      { vi: "Hố Sụt Sủng Là", en: "Ho Sut Sung La" }
    ],
    imageUrls: [
      "https://res.cloudinary.com/du8wxuzhr/image/upload/v1752246095/hagiangtravel/1752246091910-hangtalung.jpg.jpg"
    ],
    price: {
      VND: {
        perSlot: 2800000,
        groupPrice: 2500000,
        discountPrice: 2300000
      },
      USD: {
        perSlot: 115,
        groupPrice: 100,
        discountPrice: 90
      },
      EUR: {
        perSlot: 100,
        groupPrice: 90,
        discountPrice: 80
      }
    },
    guideLanguage: [
      { vi: "Tiếng Việt", en: "Vietnamese" }
    ],
    includedServices: [
      { vi: "Nước uống suốt hành trình", en: "Drinking water throughout the journey" },
      { vi: "Đồ ăn (trưa nhẹ và picnic) được nấu bởi bếp trưởng hàng đầu Việt Nam", en: "Meals (light lunch and picnic) prepared by a top Vietnamese chef" },
      { vi: "Xe máy đưa đón khi cần thiết", en: "Motorbike transfers when needed" },
      { vi: "Dựng video, chụp ảnh hành trình full HD", en: "Full HD video shooting and photography during the trip" },
      { vi: "Hướng dẫn viên tiếng Anh", en: "English-speaking tour guide" }
    ],
    excludedServices: [
      { vi: "Chi phí ăn uống ngoài chương trình", en: "Meals and drinks outside the program" },
      { vi: "TIP cho Hướng Dẫn Viên / Tài xế nếu quý khách cảm thấy hài lòng", en: "Tips for the guide/driver if you are satisfied" },
      { vi: "Thuế VAT", en: "VAT" }
    ],
    rating: 0,
    reviews: [],
    createdAt: "2025-07-10T00:00:00.000Z",
    updatedAt: "2025-07-12T02:05:23.775Z"
  },
  {
    name: {
      vi: "Tour Núi Vách Đá Trắng",
      en: "White Cliff Mountain Tour"
    },
    type: {
      vi: "Núi",
      en: "Mountain"
    },
    description: {
      vi: `<p>Vách Đá Trắng được biết đến với khung cảnh hùng vĩ, đáng kinh ngạc với độ dốc lên đến hàng trăm mét và dòng sông Nho Quế xanh biếc chảy quanh núi đá. Trên hành trình trekking này, du khách sẽ được chìm đắm trong không gian hùng vĩ của vách đá cao vút, ngắm nhìn cảnh quan đẹp như tranh vẽ và thách thức bản thân với địa hình đồi núi hiểm trở. Điều đặc biệt là từ đỉnh vách đá, du khách sẽ có cơ hội ngắm nhìn toàn cảnh hùng vĩ của thung lũng Mã Pì Lèng, nơi được ví như 'Grand Canyon của Việt Nam'. Ngoài ra, trên hành trình trekking này, du khách cũng sẽ được hòa mình vào không gian hoang sơ, yên bình của vùng núi cao Hà Giang, tận hưởng không khí trong lành và tìm hiểu về văn hóa, đời sống của người dân địa phương. Đây sẽ là cơ hội tuyệt vời để khám phá và trải nghiệm vẻ đẹp tự nhiên tuyệt vời của vùng đất này.</p>`,
      en: `<p>White Cliff (Vách Đá Trắng) is known for its majestic and breathtaking scenery, with slopes reaching hundreds of meters high and the emerald Nho Que River winding around the rocky mountains. On this trekking journey, visitors will be immersed in the grandeur of towering cliffs, admire picture-perfect landscapes, and challenge themselves with the rugged mountainous terrain. Especially from the top of the cliff, visitors will have the opportunity to take in the panoramic view of the majestic Ma Pi Leng Valley, often called the 'Grand Canyon of Vietnam'. Additionally, on this trek, travelers can immerse themselves in the pristine, peaceful atmosphere of Ha Giang's highlands, enjoy the fresh air, and learn about the culture and daily life of the local people. This will be a wonderful opportunity to explore and experience the stunning natural beauty of this region.</p>`
    },
    shortDescription: {
      vi: "Trekking chinh phục Vách Đá Trắng và chiêm ngưỡng thung lũng Mã Pì Lèng.",
      en: "Trek to conquer White Cliff and admire the Ma Pi Leng Valley."
    },
    duration: {
      vi: "1 ngày",
      en: "1 day"
    },
    schedule: {
      vi: [
        {
          day: 1,
          title: "Chinh phục Vách Đá Trắng",
          activities: [
            "Khởi hành từ trung tâm thành phố Hà Giang",
            "Di chuyển đến chân đèo Mã Pì Lèng",
            "Trekking lên Vách Đá Trắng với độ cao hàng trăm mét",
            "Dừng chân ngắm cảnh và chụp ảnh tại các điểm đẹp",
            "Ăn trưa picnic trên đỉnh núi",
            "Ngắm toàn cảnh thung lũng sông Nho Quế và Mã Pì Lèng",
            "Trekking quay về điểm xuất phát",
            "Quay lại trung tâm Hà Giang"
          ]
        }
      ],
      en: [
        {
          day: 1,
          title: "Conquer White Cliff",
          activities: [
            "Depart from Ha Giang city center",
            "Travel to the base of Ma Pi Leng Pass",
            "Trek up the White Cliff with steep elevation",
            "Stop for scenic views and photography",
            "Picnic lunch on the mountain top",
            "Admire panoramic views of Nho Que River and Ma Pi Leng Valley",
            "Trek back down the trail",
            "Return to Ha Giang center"
          ]
        }
      ]
    },
    slug: "tour-nui-vach-da-trang",
    locations: [
      { vi: "Vách Đá Trắng", en: "White Cliff" },
      { vi: "Mã Pì Lèng", en: "Ma Pi Leng" }
    ],
    imageUrls: [
      "https://res.cloudinary.com/du8wxuzhr/image/upload/v1752248730/hagiangtravel/1752248728790-chinh-phuc-vach-da-trang-ha-giang-vach-da-tren-deo-ma-pi-leng-01-1644415742.jpg.jpg"
    ],
    price: {
      VND: {
        perSlot: 2700000,
        groupPrice: 2400000,
        discountPrice: 2200000
      },
      USD: {
        perSlot: 115,
        groupPrice: 100,
        discountPrice: 90
      },
      EUR: {
        perSlot: 100,
        groupPrice: 85,
        discountPrice: 75
      }
    },
    guideLanguage: [
      { vi: "Tiếng Việt", en: "Vietnamese" },
      { vi: "Tiếng Anh", en: "English" }
    ],
    includedServices: [
      { vi: "Nước uống suốt hành trình", en: "Drinking water throughout the journey" },
      { vi: "Đồ ăn (trưa nhẹ và picnic) được nấu bởi bếp trưởng hàng đầu Việt Nam", en: "Meals (light lunch and picnic) prepared by a top Vietnamese chef" },
      { vi: "Xe máy đưa đón khi cần thiết", en: "Motorbike transfers when needed" },
      { vi: "Dựng video, chụp ảnh hành trình full HD", en: "Full HD video shooting and photography during the trip" },
      { vi: "Hướng dẫn viên tiếng Anh", en: "English-speaking tour guide" }
    ],
    excludedServices: [
      { vi: "Chi phí ăn uống ngoài chương trình", en: "Meals and drinks outside the program" },
      { vi: "TIP cho Hướng Dẫn Viên / Tài xế nếu quý khách cảm thấy hài lòng", en: "Tips for the guide/driver if you are satisfied" },
      { vi: "Thuế VAT", en: "VAT" }
    ],
    rating: 0,
    reviews: [],
    createdAt: "2025-07-10T00:00:00.000Z",
    updatedAt: "2025-07-12T02:10:46.756Z"
  },
  {
    name: {
      vi: "Tour Luxury 4 Ngày 3 Đêm - Khám Phá Cao Nguyên Đá Đồng Văn",
      en: "Luxury Tour 4 Days 3 Nights - Discover Dong Van Karst Plateau"
    },
    type: {
      vi: "Luxury",
      en: "luxury"
    },
    description: {
      vi: `<p>Tour Khám Phá Cao Nguyên Đá Đồng Văn là hành trình trải nghiệm đẳng cấp trong 4 ngày 3 đêm. Bạn sẽ được chiêm ngưỡng vẻ đẹp hùng vĩ của sông Nho Quế, vách đá trắng và đèo Mã Pì Lèng, thưởng thức các món đặc sản vùng cao được chế biến đảm bảo vệ sinh và nguyên liệu tươi ngon. Bên cạnh đó, du khách còn có cơ hội thăm các bản làng H’Mong, giao lưu cùng người dân địa phương, trekking ngắm núi và rừng nguyên sinh, khám phá các hang động nguyên sơ. Một điểm nhấn đặc biệt là trải nghiệm nấu ăn ngoài trời theo set menu Á - Âu do top chef Việt Nam trực tiếp thực hiện. Tour đi kèm hướng dẫn viên tiếng Anh chuyên nghiệp, phương tiện di chuyển tiện nghi, đồ bảo hộ đầy đủ và nước uống suốt hành trình, đảm bảo mang đến cho bạn một kỳ nghỉ đáng nhớ và sang trọng tại Hà Giang.</p>`,
      en: `<p>The Discover Dong Van Karst Plateau Tour offers a premium 4-day, 3-night experience. You will admire the majestic beauty of the Nho Que River, White Cliff, and Ma Pi Leng Pass, savor delicious highland specialties prepared with fresh, hygienic ingredients. Additionally, visitors will have the chance to visit H’Mong villages, interact with local people, go trekking through mountains and primeval forests, and explore pristine caves. A highlight of the tour is the outdoor cooking experience with an Asian-European set menu, prepared by a top Vietnamese chef. The tour includes a professional English-speaking guide, comfortable transportation, safety gear, and sufficient drinking water throughout the journey, promising a memorable and luxurious holiday in Ha Giang.</p>`
    },
    shortDescription: {
      vi: "Hành trình luxury 4N3Đ khám phá Cao nguyên đá Đồng Văn với trải nghiệm ẩm thực và thiên nhiên độc đáo.",
      en: "A 4-day, 3-night luxury journey exploring Dong Van Karst Plateau with unique culinary and natural experiences."
    },
    duration: {
      vi: "4 ngày 3 đêm",
      en: "4 days 3 nights"
    },
    schedule: {
      vi: [
        {
          day: 1,
          title: "Hà Giang - Sông Nho Quế",
          activities: [
            "Đón khách tại thành phố Hà Giang",
            "Di chuyển đến Sông Nho Quế",
            "Trekking ven sông, chụp ảnh check-in",
            "Thưởng thức đặc sản vùng cao",
            "Về khách sạn nghỉ ngơi"
          ]
        },
        {
          day: 2,
          title: "Khám phá Vách Đá Trắng - Đèo Mã Pì Lèng",
          activities: [
            "Ăn sáng tại khách sạn",
            "Khởi hành đến Vách Đá Trắng",
            "Trekking chinh phục Vách Đá Trắng",
            "Tiếp tục di chuyển qua đèo Mã Pì Lèng, chiêm ngưỡng toàn cảnh thung lũng sông Nho Quế",
            "Ăn trưa picnic ngoài trời",
            "Trở về Đồng Văn nghỉ đêm"
          ]
        },
        {
          day: 3,
          title: "Khám phá bản làng H’Mong - Hang động nguyên sơ",
          activities: [
            "Tham quan các bản làng người H’Mong",
            "Giao lưu văn hóa, tìm hiểu đời sống người dân địa phương",
            "Khám phá hang động nguyên sơ",
            "Trải nghiệm nấu ăn ngoài trời cùng top chef Việt Nam",
            "Ăn tối tại homestay hoặc khách sạn"
          ]
        },
        {
          day: 4,
          title: "Trekking rừng nguyên sinh - Trở về Hà Giang",
          activities: [
            "Trekking rừng nguyên sinh ngắm cảnh",
            "Thưởng thức bữa trưa đặc sản",
            "Tự do mua sắm đặc sản địa phương",
            "Trả khách tại Hà Giang, kết thúc tour"
          ]
        }
      ],
      en: [
        {
          day: 1,
          title: "Ha Giang - Nho Que River",
          activities: [
            "Pick up guests in Ha Giang city",
            "Travel to Nho Que River",
            "Trek along the river, take check-in photos",
            "Enjoy highland specialties",
            "Return to hotel for rest"
          ]
        },
        {
          day: 2,
          title: "Explore White Cliff - Ma Pi Leng Pass",
          activities: [
            "Breakfast at the hotel",
            "Depart for White Cliff",
            "Trek to conquer White Cliff",
            "Continue through Ma Pi Leng Pass, admire panoramic views of Nho Que River valley",
            "Outdoor picnic lunch",
            "Return to Dong Van for overnight stay"
          ]
        },
        {
          day: 3,
          title: "Explore H’Mong villages - Pristine caves",
          activities: [
            "Visit H’Mong ethnic villages",
            "Cultural exchange and learn about local life",
            "Explore pristine caves",
            "Outdoor cooking experience with a top Vietnamese chef",
            "Dinner at homestay or hotel"
          ]
        },
        {
          day: 4,
          title: "Trekking primeval forest - Return to Ha Giang",
          activities: [
            "Trek through the primeval forest and admire the scenery",
            "Enjoy local specialty lunch",
            "Free time for local specialty shopping",
            "Drop off guests in Ha Giang, end of tour"
          ]
        }
      ]
    },
    slug: "tour-luxury-4-ngay-3-dem-kham-pha-cao-nguyen-da-dong-van",
    locations: [
      { vi: "Sông Nho Quế", en: "Nho Que River" },
      { vi: "Vách Đá Trắng", en: "White Cliff" },
      { vi: "Mã Pì Lèng", en: "Ma Pi Leng Pass" },
      { vi: "Cao nguyên đá Đồng Văn", en: "Dong Van Karst Plateau" }
    ],
    imageUrls: [
      "https://res.cloudinary.com/du8wxuzhr/image/upload/v1752248768/hagiangtravel/1752248765781-chinh-phuc-vach-da-trang-ha-giang-vach-da-tren-deo-ma-pi-leng-01-1644415742.jpg.jpg"
    ],
    price: {
      VND: {
        perSlot: 12500000,
        groupPrice: 11200000,
        discountPrice: 9800000
      },
      USD: {
        perSlot: 520,
        groupPrice: 470,
        discountPrice: 420
      },
      EUR: {
        perSlot: 480,
        groupPrice: 430,
        discountPrice: 390
      }
    },
    guideLanguage: [
      { vi: "Tiếng Anh", en: "English" }
    ],
    includedServices: [
      { vi: "Khám phá sông Nho Quế, vách đá trắng, đèo Mã Pì Lèng", en: "Explore Nho Que River, White Cliff, and Ma Pi Leng Pass" },
      { vi: "Thưởng thức đặc sản vùng cao, đảm bảo vệ sinh, nguyên liệu tươi ngon", en: "Enjoy highland specialties prepared with fresh, hygienic ingredients" },
      { vi: "Thăm các bản làng H’Mong, giao lưu với người bản địa", en: "Visit H’Mong villages and interact with local people" },
      { vi: "Trekking ngắm núi và rừng nguyên sinh", en: "Trekking to admire mountains and primeval forests" },
      { vi: "Khám phá hang động nguyên sơ", en: "Explore pristine caves" },
      { vi: "Nấu ăn ngoài trời theo set menu Á - Âu bởi top chef Việt Nam", en: "Outdoor cooking with Asian-European set menu by a top Vietnamese chef" },
      { vi: "Hướng dẫn viên tiếng Anh chuyên nghiệp", en: "Professional English-speaking tour guide" },
      { vi: "Phương tiện đi lại cần thiết", en: "Necessary transportation" },
      { vi: "Đồ bảo hộ", en: "Safety gear" },
      { vi: "Nước uống đầy đủ trong hành trình", en: "Drinking water throughout the journey" }
    ],
    excludedServices: [
      { vi: "Chi phí cá nhân ngoài chương trình", en: "Personal expenses outside the program" },
      { vi: "TIP cho Hướng Dẫn Viên / Tài xế nếu quý khách cảm thấy hài lòng", en: "Tips for the guide/driver if you are satisfied" },
      { vi: "Thuế VAT", en: "VAT" }
    ],
    rating: 0,
    reviews: [],
    createdAt: "2025-07-10T00:00:00.000Z",
    updatedAt: "2025-07-12T02:13:52.005Z"
  },
  {
    name: {
      vi: "Tour Sông Nho Quế",
      en: "Nho Que River Tour"
    },
    type: {
      vi: "Sông",
      en: "River"
    },
    description: {
      vi: `<p>Trekking khám phá Sông Nho Quế ở Hà Giang là một trải nghiệm tuyệt vời cho những ai yêu thích khám phá thiên nhiên và văn hóa địa phương. Trên hành trình trekking này, bạn sẽ được tham gia vào các hoạt động như đi bộ ven sông, ngắm nhìn cảnh quan hùng vĩ của dòng sông Nho Quế, cảm nhận hơi thở của thiên nhiên hoang sơ và yên bình. Ngoài ra, bạn cũng sẽ có cơ hội thăm quan các bản làng truyền thống ở gần đó, tìm hiểu văn hóa, phong tục của người dân địa phương và thưởng thức những món ăn ngon đặc sản của vùng miền. Đây sẽ là cơ hội tuyệt vời để kết nối với thiên nhiên và con người, đồng thời tận hưởng những khoảnh khắc bình yên và thư giãn giữa không gian tự nhiên tuyệt đẹp của Hà Giang. Chắc chắn, chuyến trekking khám phá Sông Nho Quế sẽ để lại trong lòng bạn những ấn tượng đẹp và khó quên về vẻ đẹp hoang sơ và tinh khiết của vùng đất này. Hãy để chúng tôi cùng bạn khám phá và trải nghiệm những điều tuyệt vời nhất tại Hà Giang!</p>`,
      en: `<p>Trekking to explore the Nho Que River in Ha Giang is a wonderful experience for nature and culture lovers. On this trekking journey, you will participate in activities such as walking along the river, admiring the magnificent scenery of the Nho Que River, and feeling the pure, peaceful breath of pristine nature. In addition, you will also have the opportunity to visit traditional villages nearby, learn about the culture and customs of local people, and enjoy delicious regional specialties. This will be a great opportunity to connect with nature and people, while enjoying moments of peace and relaxation amidst the stunning natural landscapes of Ha Giang. Certainly, the trekking tour to the Nho Que River will leave you with unforgettable impressions of the wild and pure beauty of this land. Let us accompany you to discover and experience the best of Ha Giang!</p>`
    },
    shortDescription: {
      vi: "Trekking khám phá vẻ đẹp hoang sơ của Sông Nho Quế và văn hóa bản địa Hà Giang.",
      en: "Trekking to discover the pristine beauty of the Nho Que River and local culture in Ha Giang."
    },
    duration: {
      vi: "1 ngày",
      en: "1 day"
    },
    schedule: {
      vi: [
        {
          day: 1,
          title: "Khám phá Sông Nho Quế và văn hóa địa phương",
          activities: [
            "Khởi hành từ thành phố Hà Giang",
            "Di chuyển tới Sông Nho Quế",
            "Trekking ven bờ sông, chụp ảnh khung cảnh hùng vĩ",
            "Tham quan các bản làng gần sông",
            "Ăn trưa picnic bên bờ sông",
            "Trải nghiệm đi thuyền trên sông Nho Quế (nếu điều kiện cho phép)",
            "Quay trở về thành phố Hà Giang"
          ]
        }
      ],
      en: [
        {
          day: 1,
          title: "Exploring Nho Que River and local culture",
          activities: [
            "Depart from Ha Giang city",
            "Travel to Nho Que River",
            "Trek along the riverbank and take photos of stunning landscapes",
            "Visit traditional villages near the river",
            "Enjoy a picnic lunch by the riverside",
            "Experience a boat ride on the Nho Que River (weather permitting)",
            "Return to Ha Giang city"
          ]
        }
      ]
    },
    slug: "tour-song-nho-que",
    locations: [
      { vi: "Sông Nho Quế", en: "Nho Que River" }
    ],
    imageUrls: [
      "https://res.cloudinary.com/du8wxuzhr/image/upload/v1752248540/hagiangtravel/1752248537388-du-lich-mien-bac-song-nho-que-2.jpg.jpg"
    ],
    price: {
      VND: {
        perSlot: 2600000,
        groupPrice: 2300000,
        discountPrice: 2100000
      },
      USD: {
        perSlot: 105,
        groupPrice: 95,
        discountPrice: 85
      },
      EUR: {
        perSlot: 95,
        groupPrice: 85,
        discountPrice: 75
      }
    },
    guideLanguage: [
      { vi: "Tiếng Việt", en: "Vietnamese" },
      { vi: "Tiếng Anh", en: "English" }
    ],
    includedServices: [
      { vi: "Nước uống suốt hành trình", en: "Drinking water throughout the journey" },
      { vi: "Đồ ăn (trưa nhẹ và picnic) được nấu bởi bếp trưởng hàng đầu Việt Nam", en: "Meals (light lunch and picnic) prepared by a top Vietnamese chef" },
      { vi: "Xe máy đưa đón khi cần thiết", en: "Motorbike transfers when needed" },
      { vi: "Dựng video, chụp ảnh hành trình full HD", en: "Full HD video shooting and photography during the trip" },
      { vi: "Hướng dẫn viên tiếng Anh", en: "English-speaking tour guide" }
    ],
    excludedServices: [
      { vi: "Chi phí ăn uống ngoài chương trình", en: "Meals and drinks outside the program" },
      { vi: "TIP cho Hướng Dẫn Viên / Tài xế nếu quý khách cảm thấy hài lòng", en: "Tips for the guide/driver if you are satisfied" },
      { vi: "Thuế VAT", en: "VAT" }
    ],
    rating: 0,
    reviews: [],
    createdAt: "2025-07-10T00:00:00.000Z",
    updatedAt: "2025-07-12T02:07:15.553Z"
  }
  // ... (các tour còn lại, chuyển đổi tương tự, loại bỏ _id, __v, id)
]; 