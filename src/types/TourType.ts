export interface Tour {
    _id: string;
    name: { vi: string; en: string };
    type: { vi: string; en: string };
    slug: string;
    description: { vi: string; en: string };
    shortDescription?: { vi: string; en: string };
    destination: Array<{ vi: string; en: string }>;
    price: {
        VND?: {
            perSlot: number;
            groupPrice?: number;
            discountPrice?: number;
        };
        USD?: {
            perSlot: number;
            groupPrice?: number;
            discountPrice?: number;
        };
        EUR?: {
            perSlot: number;
            groupPrice?: number;
            discountPrice?: number;
        };
    };
    duration: { vi: string; en: string };
    guideLanguage: Array<{ vi: string; en: string }>;
    includedServices: Array<{ vi: string; en: string }>;
    excludedServices?: Array<{ vi: string; en: string }>;
    imageUrls: string[];
    createdAt: string | Date;
    updatedAt?: string | Date;
    rating: number; // 1-5
    reviews?: any[];
    schedule?: {
        vi: Array<{ day: number; title: string; activities: string[] }>;
        en: Array<{ day: number; title: string; activities: string[] }>;
    };
}