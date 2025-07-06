import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axiosInstance from '../../config/axiosConfig';
import { api } from '../../services/api';

interface UserState {
  user: any;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

// Load initial state from localStorage
const loadState = () => {
  try {
    const serializedState = localStorage.getItem('userState');
    if (serializedState === null) {
      return {
        user: null,
        isAuthenticated: false,
        loading: false,
        error: null,
      };
    }
    return JSON.parse(serializedState);
  } catch (err) {
    return {
      user: null,
      isAuthenticated: false,
      loading: false,
      error: null,
    };
  }
};

const initialState: UserState = loadState();

export const login = createAsyncThunk(
  'user/login',
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/auth/login', credentials);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Login failed');
    }
  }
);

export const register = createAsyncThunk(
  'user/register',
  async (data: { name: string; email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/auth/register', data);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Register failed');
    }
  }
);

export const checkAuthStatus = createAsyncThunk(
  'user/checkAuthStatus',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/auth/me');
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Auth check failed');
    }
  }
);

export const logoutUser = createAsyncThunk(
  'user/logoutUser',
  async (_, { rejectWithValue }) => {
    try {
      await axiosInstance.post('/auth/logout');
      return true;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Logout failed');
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
      // Clear from localStorage
      localStorage.removeItem('userState');
    },
    setUser(state, action) {
      state.user = { ...state.user, ...action.payload };
      // Cập nhật localStorage luôn
      localStorage.setItem('userState', JSON.stringify({
        ...state,
        user: { ...state.user, ...action.payload },
      }));
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.error = null;
        // Save to localStorage
        localStorage.setItem('userState', JSON.stringify({
          user: action.payload.user,
          isAuthenticated: true,
          loading: false,
          error: null,
        }));
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.error = null;
        // Save to localStorage
        localStorage.setItem('userState', JSON.stringify({
          user: action.payload.user,
          isAuthenticated: true,
          loading: false,
          error: null,
        }));
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(checkAuthStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkAuthStatus.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.error = null;
        // Save to localStorage
        localStorage.setItem('userState', JSON.stringify({
          user: action.payload.user,
          isAuthenticated: true,
          loading: false,
          error: null,
        }));
      })
      .addCase(checkAuthStatus.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = action.payload as string;
        // Clear from localStorage
        localStorage.removeItem('userState');
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.error = null;
        // Clear from localStorage
        localStorage.removeItem('userState');
      })
      .addCase(logoutUser.rejected, (state, action) => {
        // Even if logout API fails, clear local state
        state.user = null;
        state.isAuthenticated = false;
        state.error = action.payload as string;
        localStorage.removeItem('userState');
      });
  },
});

export const { logout, setUser } = userSlice.actions;

export default userSlice.reducer; 