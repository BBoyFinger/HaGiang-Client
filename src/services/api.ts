import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import axiosInstance from '../config/axiosConfig';
import type { 
  Tour, 
  Destination, 
  Blog, 
  Comment, 
  User, 
  Booking, 
  Review, 
  ApiResponse, 
  PaginatedResponse,
  LoginForm,
  RegisterForm,
  ProfileForm,
  BookingForm,
  ReviewForm,
  CommentForm
} from '../types';

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: axiosInstance.defaults.baseURL, credentials: 'include' }),
  endpoints: (builder) => ({
    // Destinations
    getDestinations: builder.query<ApiResponse<Destination[]>, void>({
      query: () => '/destinations',
    }),
    addDestination: builder.mutation<ApiResponse<Destination>, Partial<Destination>>({
      query: (body) => ({
        url: '/destinations',
        method: 'POST',
        body,
      }),
    }),
    updateDestination: builder.mutation<ApiResponse<Destination>, { id: string; data: Partial<Destination> }>({
      query: ({ id, data }) => ({
        url: `/destinations/${id}`,
        method: 'PUT',
        body: data,
      }),
    }),
    deleteDestination: builder.mutation<ApiResponse<void>, string>({
      query: (id) => ({
        url: `/destinations/${id}`,
        method: 'DELETE',
      }),
    }),

    // Auth & User
    getCurrentUser: builder.query<ApiResponse<User>, void>({
      query: () => '/auth/me',
    }),
    updateProfile: builder.mutation<ApiResponse<User>, ProfileForm>({
      query: (body) => ({
        url: '/auth/profile',
        method: 'PUT',
        body,
      }),
    }),

    // Tours
    getTours: builder.query<ApiResponse<Tour[]>, void>({
      query: () => '/tours',
    }),
    getTourById: builder.query<ApiResponse<Tour>, string>({
      query: (id) => `/tours/${id}`,
    }),
    addTour: builder.mutation<ApiResponse<Tour>, Partial<Tour>>({
      query: (body) => ({
        url: '/tours',
        method: 'POST',
        body,
      }),
    }),
    updateTour: builder.mutation<ApiResponse<Tour>, { id: string; data: Partial<Tour> }>({
      query: ({ id, data }) => ({
        url: `/tours/${id}`,
        method: 'PUT',
        body: data,
      }),
    }),
    deleteTour: builder.mutation<ApiResponse<void>, string>({
      query: (id) => ({
        url: `/tours/${id}`,
        method: 'DELETE',
      }),
    }),

    // Blogs
    getBlogs: builder.query<ApiResponse<Blog[]>, void>({
      query: () => '/blogs',
    }),
    addBlog: builder.mutation<ApiResponse<Blog>, Partial<Blog>>({
      query: (body) => ({
        url: '/blogs',
        method: 'POST',
        body,
      }),
    }),
    updateBlog: builder.mutation<ApiResponse<Blog>, { id: string; data: Partial<Blog> }>({
      query: ({ id, data }) => ({
        url: `/blogs/${id}`,
        method: 'PUT',
        body: data,
      }),
    }),
    deleteBlog: builder.mutation<ApiResponse<void>, string>({
      query: (id) => ({
        url: `/blogs/${id}`,
        method: 'DELETE',
      }),
    }),

    // Comments
    getComments: builder.query<ApiResponse<Comment[]>, { status?: string; refType?: string; refId?: string }>({
      query: (params) => ({
        url: '/comments',
        params,
      }),
    }),
    approveComment: builder.mutation<ApiResponse<Comment>, string>({
      query: (id) => ({
        url: `/comments/${id}/approve`,
        method: 'PUT',
      }),
    }),
    rejectComment: builder.mutation<ApiResponse<Comment>, string>({
      query: (id) => ({
        url: `/comments/${id}/reject`,
        method: 'PUT',
      }),
    }),
    deleteComment: builder.mutation<ApiResponse<void>, string>({
      query: (id) => ({
        url: `/comments/${id}`,
        method: 'DELETE',
      }),
    }),
    updateComment: builder.mutation<ApiResponse<Comment>, { id: string; content: string }>({
      query: ({ id, content }) => ({
        url: `/comments/${id}`,
        method: 'PUT',
        body: { content },
      }),
    }),

    // Users
    getUsers: builder.query<ApiResponse<User[]>, void>({
      query: () => '/users',
    }),
    addUser: builder.mutation<ApiResponse<User>, Partial<User>>({
      query: (body) => ({
        url: '/users',
        method: 'POST',
        body,
      }),
    }),
    updateUser: builder.mutation<ApiResponse<User>, { id: string; data: Partial<User> }>({
      query: ({ id, data }) => ({
        url: `/users/${id}`,
        method: 'PUT',
        body: data,
      }),
    }),
    deleteUser: builder.mutation<ApiResponse<void>, string>({
      query: (id) => ({
        url: `/users/${id}`,
        method: 'DELETE',
      }),
    }),
    changeUserRole: builder.mutation<ApiResponse<User>, { id: string; role: string }>({
      query: ({ id, role }) => ({
        url: `/users/${id}/role`,
        method: 'PUT',
        body: { role },
      }),
    }),
    toggleUserActive: builder.mutation<ApiResponse<User>, string>({
      query: (id) => ({
        url: `/users/${id}/toggle-active`,
        method: 'PUT',
      }),
    }),

    // Bookings
    getBookings: builder.query<ApiResponse<Booking[]>, void>({
      query: () => '/bookings',
    }),
    addBooking: builder.mutation<ApiResponse<Booking>, BookingForm>({
      query: (body) => ({
        url: '/bookings',
        method: 'POST',
        body,
      }),
    }),
    updateBooking: builder.mutation<ApiResponse<Booking>, { id: string; data: Partial<Booking> }>({
      query: ({ id, data }) => ({
        url: `/bookings/${id}`,
        method: 'PUT',
        body: data,
      }),
    }),
    deleteBooking: builder.mutation<ApiResponse<void>, string>({
      query: (id) => ({
        url: `/bookings/${id}`,
        method: 'DELETE',
      }),
    }),

    // Reviews
    getReviews: builder.query<ApiResponse<Review[]>, { tourId: string }>({
      query: ({ tourId }) => `/reviews?tourId=${tourId}`,
    }),
    addReview: builder.mutation<ApiResponse<Review>, ReviewForm>({
      query: (body) => ({
        url: '/reviews',
        method: 'POST',
        body,
      }),
    }),

    // Comments
    addComment: builder.mutation<ApiResponse<Comment>, CommentForm>({
      query: (body) => ({
        url: '/comments',
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const { useGetDestinationsQuery, useAddDestinationMutation, useUpdateDestinationMutation, useDeleteDestinationMutation, useGetCurrentUserQuery, useUpdateProfileMutation, useGetToursQuery, useGetTourByIdQuery, useAddTourMutation, useUpdateTourMutation, useDeleteTourMutation, useGetBlogsQuery, useAddBlogMutation, useUpdateBlogMutation, useDeleteBlogMutation, useGetCommentsQuery, useApproveCommentMutation, useRejectCommentMutation, useDeleteCommentMutation, useUpdateCommentMutation, useGetUsersQuery, useAddUserMutation, useUpdateUserMutation, useDeleteUserMutation, useChangeUserRoleMutation, useToggleUserActiveMutation, useGetBookingsQuery, useAddBookingMutation, useUpdateBookingMutation, useDeleteBookingMutation, useGetReviewsQuery, useAddReviewMutation, useAddCommentMutation } = api; 