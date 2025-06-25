
export interface Hotel {
    id: string;
    name: string;
    description: string;
    address: string;
    city: string;
    country: string;
    price_per_night: string;
    rating: number;
    star_rating: number;
    images: string[];
    phone: string;
    email: string;
    website_url: string;
    created_at: Date;
    updated_at: Date;
}