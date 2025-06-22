import { Tour } from "./TourType";

export interface Destination {
    id: string;
    name: string;
    slug: string;
    description: string;
    imageUrls: string[];
    createdAt: Date;
    updatedAt: Date;
    tours: Tour[];
}