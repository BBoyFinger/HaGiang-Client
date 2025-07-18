import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import axiosInstance from '../config/axiosConfig';

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: axiosInstance.defaults.baseURL, credentials: 'include' }),
  endpoints: (builder) => ({
    getDestinations: builder.query<any, void>({
      query: () => '/destinations',
    }),
    addDestination: builder.mutation<any, Partial<any>>({
      query: (body) => ({
        url: '/destinations',
        method: 'POST',
        body,
      }),
    }),
    updateDestination: builder.mutation<any, { id: number; data: Partial<any> }>({
      query: ({ id, data }) => ({
        url: `/destinations/${id}`,
        method: 'PUT',
        body: data,
      }),
    }),
    deleteDestination: builder.mutation<any, number>({
      query: (id) => ({
        url: `/destinations/${id}`,
        method: 'DELETE',
      }),
    }),
    getCurrentUser: builder.query<any, void>({
      query: () => '/auth/me',
    }),
    updateProfile: builder.mutation<any, { name?: string; avatarUrl?: string; phone?: string }>({
      query: (body) => ({
        url: '/auth/profile',
        method: 'PUT',
        body,
      }),
    }),
    getTours: builder.query<any, void>({
      query: () => '/tours',
    }),
    getTourById: builder.query<any, string>({
      query: (id) => `/tours/${id}`,
    }),
    addTour: builder.mutation<any, Partial<any>>({
      query: (body) => ({
        url: '/tours',
        method: 'POST',
        body,
      }),
    }),
    updateTour: builder.mutation<any, { id: string; data: Partial<any> }>({
      query: ({ id, data }) => ({
        url: `/tours/${id}`,
        method: 'PUT',
        body: data,
      }),
    }),
    deleteTour: builder.mutation<any, string>({
      query: (id) => ({
        url: `/tours/${id}`,
        method: 'DELETE',
      }),
    }),
    getBlogs: builder.query<any, void>({
      query: () => '/blogs',
    }),
    addBlog: builder.mutation<any, Partial<any>>({
      query: (body) => ({
        url: '/blogs',
        method: 'POST',
        body,
      }),
    }),
    updateBlog: builder.mutation<any, { id: string; data: Partial<any> }>({
      query: ({ id, data }) => ({
        url: `/blogs/${id}`,
        method: 'PUT',
        body: data,
      }),
    }),
    deleteBlog: builder.mutation<any, string>({
      query: (id) => ({
        url: `/blogs/${id}`,
        method: 'DELETE',
      }),
    }),
    getComments: builder.query<any, { status?: string; refType?: string; refId?: string }>({
      query: (params) => ({
        url: '/comments',
        params,
      }),
    }),
    approveComment: builder.mutation<any, string>({
      query: (id) => ({
        url: `/comments/${id}/approve`,
        method: 'PUT',
      }),
    }),
    rejectComment: builder.mutation<any, string>({
      query: (id) => ({
        url: `/comments/${id}/reject`,
        method: 'PUT',
      }),
    }),
    deleteComment: builder.mutation<any, string>({
      query: (id) => ({
        url: `/comments/${id}`,
        method: 'DELETE',
      }),
    }),
    updateComment: builder.mutation<any, { id: string; content: string }>({
      query: ({ id, content }) => ({
        url: `/comments/${id}`,
        method: 'PUT',
        body: { content },
      }),
    }),
    getUsers: builder.query<any, void>({
      query: () => '/users',
    }),
    addUser: builder.mutation<any, Partial<any>>({
      query: (body) => ({
        url: '/users',
        method: 'POST',
        body,
      }),
    }),
    updateUser: builder.mutation<any, { id: string; data: Partial<any> }>({
      query: ({ id, data }) => ({
        url: `/users/${id}`,
        method: 'PUT',
        body: data,
      }),
    }),
    deleteUser: builder.mutation<any, string>({
      query: (id) => ({
        url: `/users/${id}`,
        method: 'DELETE',
      }),
    }),
    changeUserRole: builder.mutation<any, { id: string; role: string }>({
      query: ({ id, role }) => ({
        url: `/users/${id}/role`,
        method: 'PUT',
        body: { role },
      }),
    }),
    toggleUserActive: builder.mutation<any, string>({
      query: (id) => ({
        url: `/users/${id}/toggle-active`,
        method: 'PUT',
      }),
    }),
    getBookings: builder.query<any, void>({
      query: () => '/bookings',
    }),
    addBooking: builder.mutation<any, Partial<any>>({
      query: (body) => ({
        url: '/bookings',
        method: 'POST',
        body,
      }),
    }),
    updateBooking: builder.mutation<any, { id: string; data: Partial<any> }>({
      query: ({ id, data }) => ({
        url: `/bookings/${id}`,
        method: 'PUT',
        body: data,
      }),
    }),
    deleteBooking: builder.mutation<any, string>({
      query: (id) => ({
        url: `/bookings/${id}`,
        method: 'DELETE',
      }),
    }),
    getReviews: builder.query<any, { tourId: string }>({
      query: ({ tourId }) => `/reviews?tourId=${tourId}`,
    }),
    addReview: builder.mutation<any, { tourId: string; rating: number; comment: string }>({
      query: (body) => ({
        url: '/reviews',
        method: 'POST',
        body,
      }),
    }),
    addComment: builder.mutation<any, { content: string; refType: string; refId: string }>({
      query: (body) => ({
        url: '/comments',
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const { useGetDestinationsQuery, useAddDestinationMutation, useUpdateDestinationMutation, useDeleteDestinationMutation, useGetCurrentUserQuery, useUpdateProfileMutation, useGetToursQuery, useGetTourByIdQuery, useAddTourMutation, useUpdateTourMutation, useDeleteTourMutation, useGetBlogsQuery, useAddBlogMutation, useUpdateBlogMutation, useDeleteBlogMutation, useGetCommentsQuery, useApproveCommentMutation, useRejectCommentMutation, useDeleteCommentMutation, useUpdateCommentMutation, useGetUsersQuery, useAddUserMutation, useUpdateUserMutation, useDeleteUserMutation, useChangeUserRoleMutation, useToggleUserActiveMutation, useGetBookingsQuery, useAddBookingMutation, useUpdateBookingMutation, useDeleteBookingMutation, useGetReviewsQuery, useAddReviewMutation, useAddCommentMutation } = api; 