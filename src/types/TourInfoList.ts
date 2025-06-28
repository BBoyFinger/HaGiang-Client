export interface TourInfoListProps {
    tour?: {
        price?: { perSlot?: number; groupPrice?: number; currency?: string };
        departure?: string;
        duration?: string;
        schedule?: string;
        type?: string;
        groupSize?: string;
        routeLength?: string;
        difficulty?: string;
    };
}