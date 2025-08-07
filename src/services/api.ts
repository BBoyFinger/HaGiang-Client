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
  // Thêm caching configuration
  keepUnusedDataFor: 300, // Cache data trong 5 phút
  tagTypes: ['Tour', 'Destination', 'Blog', 'User', 'Booking', 'Review', 'Comment'],
  endpoints: (builder) => ({
    // Destinations
    getDestinations: builder.query<ApiResponse<Destination[]>, void>({
      query: () => '/destinations',
      providesTags: ['Destination'],
      // Cache trong 10 phút vì destinations ít thay đổi
      keepUnusedDataFor: 600,
    }),
    addDestination: builder.mutation<ApiResponse<Destination>, Partial<Destination> | FormData>({
      query: (body) => ({
        url: '/destinations',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Destination'],
    }),
    updateDestination: builder.mutation<ApiResponse<Destination>, { id: string; data: Partial<Destination> | FormData }>({
      query: ({ id, data }) => ({
        url: `/destinations/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Destination'],
    }),
    deleteDestination: builder.mutation<ApiResponse<void>, string>({
      query: (id) => ({
        url: `/destinations/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Destination'],
    }),

    // Auth & User
    getCurrentUser: builder.query<ApiResponse<User>, void>({
      query: () => '/auth/me',
      providesTags: ['User'],
      // Cache user data lâu hơn
      keepUnusedDataFor: 1800, // 30 phút
    }),
    updateProfile: builder.mutation<ApiResponse<User>, ProfileForm>({
      query: (body) => ({
        url: '/auth/profile',
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['User'],
    }),

    // Tours
    getTours: builder.query<ApiResponse<Tour[]>, void>({
      query: () => '/tours',
      providesTags: ['Tour'],
      keepUnusedDataFor: 600, // 10 phút
    }),
    getTourById: builder.query<ApiResponse<Tour>, string>({
      query: (id) => `/tours/${id}`,
      providesTags: (result, error, id) => [{ type: 'Tour', id }],
      keepUnusedDataFor: 600,
    }),
    addTour: builder.mutation<ApiResponse<Tour>, Partial<Tour> | FormData>({
      query: (body) => ({
        url: '/tours',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Tour'],
    }),
    updateTour: builder.mutation<ApiResponse<Tour>, { id: string; data: Partial<Tour> | FormData }>({
      query: ({ id, data }) => ({
        url: `/tours/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Tour', id }, 'Tour'],
    }),
    deleteTour: builder.mutation<ApiResponse<void>, string>({
      query: (id) => ({
        url: `/tours/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Tour'],
    }),

    // Blogs
    getBlogs: builder.query<ApiResponse<Blog[]>, void>({
      query: () => '/blogs',
      providesTags: ['Blog'],
      keepUnusedDataFor: 900, // 15 phút
    }),
    addBlog: builder.mutation<ApiResponse<Blog>, Partial<Blog>>({
      query: (body) => ({
        url: '/blogs',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Blog'],
    }),
    updateBlog: builder.mutation<ApiResponse<Blog>, { id: string; data: Partial<Blog> }>({
      query: ({ id, data }) => ({
        url: `/blogs/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Blog', id }, 'Blog'],
    }),
    deleteBlog: builder.mutation<ApiResponse<void>, string>({
      query: (id) => ({
        url: `/blogs/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Blog'],
    }),

    // Comments
    getComments: builder.query<ApiResponse<Comment[]>, { status?: string; refType?: string; refId?: string }>({
      query: (params) => ({
        url: '/comments',
        params,
      }),
      providesTags: ['Comment'],
      keepUnusedDataFor: 300, // 5 phút
    }),
    approveComment: builder.mutation<ApiResponse<Comment>, string>({
      query: (id) => ({
        url: `/comments/${id}/approve`,
        method: 'PUT',
      }),
      invalidatesTags: ['Comment'],
    }),
    rejectComment: builder.mutation<ApiResponse<Comment>, string>({
      query: (id) => ({
        url: `/comments/${id}/reject`,
        method: 'PUT',
      }),
      invalidatesTags: ['Comment'],
    }),
    deleteComment: builder.mutation<ApiResponse<void>, string>({
      query: (id) => ({
        url: `/comments/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Comment'],
    }),
    updateComment: builder.mutation<ApiResponse<Comment>, { id: string; content: string }>({
      query: ({ id, content }) => ({
        url: `/comments/${id}`,
        method: 'PUT',
        body: { content },
      }),
      invalidatesTags: ['Comment'],
    }),

    // Users
    getUsers: builder.query<ApiResponse<User[]>, void>({
      query: () => '/users',
      providesTags: ['User'],
      keepUnusedDataFor: 300,
    }),
    addUser: builder.mutation<ApiResponse<User>, Partial<User>>({
      query: (body) => ({
        url: '/users',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['User'],
    }),
    updateUser: builder.mutation<ApiResponse<User>, { id: string; data: Partial<User> }>({
      query: ({ id, data }) => ({
        url: `/users/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['User'],
    }),
    deleteUser: builder.mutation<ApiResponse<void>, string>({
      query: (id) => ({
        url: `/users/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['User'],
    }),
    changeUserRole: builder.mutation<ApiResponse<User>, { id: string; role: string }>({
      query: ({ id, role }) => ({
        url: `/users/${id}/role`,
        method: 'PUT',
        body: { role },
      }),
      invalidatesTags: ['User'],
    }),
    toggleUserActive: builder.mutation<ApiResponse<User>, string>({
      query: (id) => ({
        url: `/users/${id}/toggle-active`,
        method: 'PUT',
      }),
      invalidatesTags: ['User'],
    }),

    // Bookings
    getBookings: builder.query<ApiResponse<Booking[]>, void>({
      query: () => '/bookings',
      providesTags: ['Booking'],
      keepUnusedDataFor: 300,
    }),
    addBooking: builder.mutation<ApiResponse<Booking>, BookingForm>({
      query: (body) => ({
        url: '/bookings',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Booking'],
    }),
    updateBooking: builder.mutation<ApiResponse<Booking>, { id: string; data: Partial<Booking> }>({
      query: ({ id, data }) => ({
        url: `/bookings/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Booking', id }, 'Booking'],
    }),
    deleteBooking: builder.mutation<ApiResponse<void>, string>({
      query: (id) => ({
        url: `/bookings/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Booking'],
    }),

    // Reviews
    getReviews: builder.query<ApiResponse<Review[]>, { tourId: string }>({
      query: ({ tourId }) => `/reviews?tourId=${tourId}`,
      providesTags: (result, error, { tourId }) => [{ type: 'Review', id: tourId }],
      keepUnusedDataFor: 600, // 10 phút
    }),
    addReview: builder.mutation<ApiResponse<Review>, ReviewForm>({
      query: (body) => ({
        url: '/reviews',
        method: 'POST',
        body,
      }),
      invalidatesTags: (result, error, { tourId }) => [{ type: 'Review', id: tourId }, 'Review'],
    }),

    // Comments
    addComment: builder.mutation<ApiResponse<Comment>, CommentForm>({
      query: (body) => ({
        url: '/comments',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Comment'],
    }),
  }),
});

export const { useGetDestinationsQuery, useAddDestinationMutation, useUpdateDestinationMutation, useDeleteDestinationMutation, useGetCurrentUserQuery, useUpdateProfileMutation, useGetToursQuery, useGetTourByIdQuery, useAddTourMutation, useUpdateTourMutation, useDeleteTourMutation, useGetBlogsQuery, useAddBlogMutation, useUpdateBlogMutation, useDeleteBlogMutation, useGetCommentsQuery, useApproveCommentMutation, useRejectCommentMutation, useDeleteCommentMutation, useUpdateCommentMutation, useGetUsersQuery, useAddUserMutation, useUpdateUserMutation, useDeleteUserMutation, useChangeUserRoleMutation, useToggleUserActiveMutation, useGetBookingsQuery, useAddBookingMutation, useUpdateBookingMutation, useDeleteBookingMutation, useGetReviewsQuery, useAddReviewMutation, useAddCommentMutation } = api; 