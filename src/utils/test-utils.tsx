import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import { I18nextProvider } from 'react-i18next';
import i18n from '../i18n';
import userSlice from '../store/slice/userSlice';
import { api } from '../services/api';

// Tạo test store
const createTestStore = () => {
  return configureStore({
    reducer: {
      user: userSlice,
      [api.reducerPath]: api.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(api.middleware),
    preloadedState: {
      user: {
        user: null,
        isAuthenticated: false,
        loading: false,
        error: null,
      },
    },
  });
};

// Custom render function với providers
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  preloadedState?: any;
  store?: ReturnType<typeof createTestStore>;
  route?: string;
}

const customRender = (
  ui: ReactElement,
  {
    preloadedState = {},
    store = createTestStore(),
    route = '/',
    ...renderOptions
  }: CustomRenderOptions = {}
) => {
  // Set up router
  window.history.pushState({}, 'Test page', route);

  const Wrapper = ({ children }: { children: React.ReactNode }) => {
    return (
      <Provider store={store}>
        <I18nextProvider i18n={i18n}>
          <BrowserRouter>
            {children}
          </BrowserRouter>
        </I18nextProvider>
      </Provider>
    );
  };

  return {
    store,
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
  };
};

// Re-export everything
export * from '@testing-library/react';
export { customRender as render };

// Mock data
export const mockUser = {
  _id: '1',
  name: 'Test User',
  email: 'test@example.com',
  role: 'user',
  avatarUrl: 'https://example.com/avatar.jpg',
};

export const mockTour = {
  _id: '1',
  title: 'Test Tour',
  description: 'Test tour description',
  price: 1000000,
  duration: 3,
  images: ['https://example.com/image1.jpg'],
  slug: 'test-tour',
};

export const mockDestination = {
  _id: '1',
  name: 'Test Destination',
  description: 'Test destination description',
  images: ['https://example.com/image1.jpg'],
  slug: 'test-destination',
};

// Mock functions
export const mockNavigate = jest.fn();
export const mockUseNavigate = () => mockNavigate;

export const mockUseParams = (params: Record<string, string>) => {
  return jest.fn().mockReturnValue(params);
};

// Mock API responses
export const mockApiResponse = (data: any, status = 200) => {
  return {
    data,
    status,
    statusText: 'OK',
    headers: {},
    config: {},
  };
};

// Mock error response
export const mockApiError = (message: string, status = 400) => {
  return {
    response: {
      data: { message },
      status,
      statusText: 'Bad Request',
    },
  };
}; 