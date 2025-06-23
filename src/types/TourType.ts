export interface Tour {
    id: string;
    name: string;
    type: 'trekking' | 'luxury' | 'hang_dong' | 'song' | 'nui';
    slug: string;
    description: string;
    locations: string[];
    price: {
        perSlot: number;
        groupPrice?: number;
        currency: string;
    };
    duration: string;
    guideLanguage: string[];
    includedServices: string[];
    imageUrls: string[];
    createdAt: Date;
    rating: number; // 1-5
}