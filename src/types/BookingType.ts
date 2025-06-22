export interface Booking{
    id: string;
    userId: string;
    tourId: string;
    numberOfPeople: number;
    totalPrice: number;
    status: 'pending' | 'confirmed' | 'cancelled';
    bookingDate: Date;
    travelDate: Date;
    contactInfo: {
        fullName: string;
        phone: string;
        email: string;
    }
}