import { api } from '../services/api';

// Base types
export interface BaseEntity {
  _id: string;
  createdAt?: string;
  updatedAt?: string;
}

// User types
export interface User extends BaseEntity {
  name: string;
  email: string;
  role: 'user' | 'admin';
  avatarUrl?: string;
  phone?: string;
  address?: string;
  isActive?: boolean;
}

// Tour types
export interface Tour extends BaseEntity {
  title: string;
  description: string;
  price: number;
  duration: number;
  images: string[];
  slug: string;
  category?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  maxGroupSize?: number;
  highlights?: string[];
  itinerary?: TourItinerary[];
  included?: string[];
  excluded?: string[];
  requirements?: string[];
  reviews?: Review[];
  averageRating?: number;
  reviewCount?: number;
}

export interface TourItinerary {
  day: number;
  title: string;
  description: string;
  activities: string[];
  accommodation?: string;
  meals?: string[];
}

// Destination types
export interface Destination extends BaseEntity {
  name: string;
  description: string;
  images: string[];
  slug: string;
  location?: {
    address: string;
    coordinates: [number, number];
  };
  category?: string;
  highlights?: string[];
  bestTimeToVisit?: string;
  howToGetThere?: string;
  tours?: Tour[];
}

// Blog types
export interface Blog extends BaseEntity {
  title: string;
  content: string;
  excerpt?: string;
  images: string[];
  slug: string;
  author: User;
  category?: string;
  tags?: string[];
  publishedAt?: string;
  isPublished?: boolean;
  comments?: Comment[];
}

// Review types
export interface Review extends BaseEntity {
  tourId: string;
  userId: string;
  rating: number;
  comment: string;
  user?: User;
  tour?: Tour;
}

// Comment types
export interface Comment extends BaseEntity {
  content: string;
  refType: 'blog' | 'tour' | 'destination';
  refId: string;
  userId: string;
  user?: User;
  status: 'pending' | 'approved' | 'rejected';
}

// Booking types
export interface Booking extends BaseEntity {
  tourId: string;
  userId: string;
  guideId?: string;
  startDate: string;
  endDate: string;
  numberOfPeople: number;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  specialRequests?: string;
  tour?: Tour;
  user?: User;
  guide?: User;
}

// Accommodation types
export interface Accommodation extends BaseEntity {
  name: string;
  description: string;
  type: 'hotel' | 'homestay' | 'resort';
  price: number;
  images: string[];
  amenities: string[];
  location: {
    address: string;
    coordinates: [number, number];
  };
  rating?: number;
  reviewCount?: number;
}

// Vehicle types
export interface Vehicle extends BaseEntity {
  name: string;
  type: 'motorcycle' | 'car' | 'bicycle';
  brand: string;
  model: string;
  year: number;
  price: number;
  images: string[];
  description: string;
  features: string[];
  isAvailable: boolean;
  location?: string;
}

// Message types
export interface Message extends BaseEntity {
  from: string;
  to: string;
  content: string;
  senderName?: string;
  senderEmail?: string;
  isRead?: boolean;
  user?: User;
}

// Hero Carousel types
export interface HeroCarousel extends BaseEntity {
  title: string;
  subtitle?: string;
  image: string;
  link?: string;
  order: number;
  isActive: boolean;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Form types
export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface ProfileForm {
  name: string;
  avatarUrl?: string;
  phone?: string;
  address?: string;
}

export interface BookingForm {
  tourId: string;
  startDate: string;
  endDate: string;
  numberOfPeople: number;
  specialRequests?: string;
}

export interface ReviewForm {
  tourId: string;
  rating: number;
  comment: string;
}

export interface CommentForm {
  content: string;
  refType: 'blog' | 'tour' | 'destination';
  refId: string;
}

// Search types
export interface SearchFilters {
  query?: string;
  category?: string;
  priceRange?: [number, number];
  duration?: number;
  rating?: number;
  dateRange?: [string, string];
}

export interface SearchResult {
  tours: Tour[];
  destinations: Destination[];
  blogs: Blog[];
  total: number;
}

// Redux state types
export interface UserState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export interface RootState {
  user: UserState;
  [api.reducerPath]: ReturnType<typeof api.reducer>;
}

// Component prop types
export interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  className?: string;
}

export interface CardLoadingProps {
  count?: number;
  className?: string;
}

export interface TourCardProps {
  tour: Tour;
  className?: string;
}

export interface DestinationCardProps {
  destination: Destination;
  className?: string;
}

export interface BlogCardProps {
  blog: Blog;
  className?: string;
}

export interface AccommodationCardProps {
  accommodation: Accommodation;
  className?: string;
}

export interface VehicleCardProps {
  vehicle: Vehicle;
  className?: string;
}

export interface UserProfileProps {
  avatarUrl?: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  onProfileUpdate?: (data: { avatarUrl: string; name: string }) => void;
}

// Error types
export interface ApiError {
  message: string;
  status: number;
  errors?: Record<string, string[]>;
}

// Socket types
export interface SocketMessage {
  from: string;
  to: string;
  content: string;
  createdAt: string;
  senderName?: string;
  senderEmail?: string;
}

// Performance types
export interface PerformanceMetrics {
  pageName: string;
  timestamp: string;
  loadTime: number;
  domContentLoaded: number;
  firstPaint?: number;
  firstContentfulPaint?: number;
  userAgent: string;
  url: string;
}

// Environment types
export interface Environment {
  VITE_API_URL: string;
  VITE_SOCKET_URL: string;
  VITE_ENABLE_ANALYTICS: string;
  VITE_ENABLE_DEBUG: string;
  VITE_GOOGLE_ANALYTICS_ID?: string;
  VITE_SENTRY_DSN?: string;
} 