export interface Review {
    id: string;
    userId: string;
    tourId: string;
    rating: number;
    comment: string;
    createdAt: Date;
}