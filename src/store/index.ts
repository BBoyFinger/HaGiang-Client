import { configureStore } from '@reduxjs/toolkit';
import { api } from '../services/api';
import userReducer from './slice/userSlice';

// Import các slice reducer ở đây (nếu có)
// import userReducer from '../features/user/userSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    [api.reducerPath]: api.reducer,
    // Thêm các reducer khác ở đây
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});

// Gán store lên window để có thể dispatch từ slice
if (typeof window !== 'undefined') {
  (window as any).store = store;
}

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 