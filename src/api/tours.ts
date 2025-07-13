import axiosInstance from '../config/axiosConfig';
import { Tour } from '../types/TourType';

export const getTours = async () => {
  const res = await axiosInstance.get('/tours');
  return res.data.tours;
};

export const getTourById = async (id: string) => {
  const res = await axiosInstance.get(`/tours/${id}`);
  return res.data.tour;
};

export const createTour = async (data: Partial<Tour>) => {
  const res = await axiosInstance.post('/tours', data);
  return res.data.tour;
};

export const updateTour = async (id: string, data: Partial<Tour>) => {
  const res = await axiosInstance.put(`/tours/${id}`, data);
  return res.data.tour;
};

export const deleteTour = async (id: string) => {
  const res = await axiosInstance.delete(`/tours/${id}`);
  return res.data;
}; 