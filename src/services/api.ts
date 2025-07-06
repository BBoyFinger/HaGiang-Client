import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import axiosInstance from '../config/axiosConfig';

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: axiosInstance.defaults.baseURL, credentials: 'include' }),
  endpoints: (builder) => ({
    getDestinations: builder.query<any, void>({
      query: () => '/destination',
    }),
    addDestination: builder.mutation<any, Partial<any>>({
      query: (body) => ({
        url: '/destination',
        method: 'POST',
        body,
      }),
    }),
    updateDestination: builder.mutation<any, { id: number; data: Partial<any> }>({
      query: ({ id, data }) => ({
        url: `/destination/${id}`,
        method: 'PUT',
        body: data,
      }),
    }),
    deleteDestination: builder.mutation<any, number>({
      query: (id) => ({
        url: `/destination/${id}`,
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
  }),
});

export const { useGetDestinationsQuery, useAddDestinationMutation, useUpdateDestinationMutation, useDeleteDestinationMutation, useGetCurrentUserQuery, useUpdateProfileMutation } = api; 