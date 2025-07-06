import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { checkAuthStatus } from '../store/slice/userSlice';
import { RootState } from '../store';

const AuthInitializer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    // Only check auth status if we're not already authenticated
    if (!isAuthenticated) {
      const storedState = localStorage.getItem('userState');
      if (storedState) {
        try {
          const parsedState = JSON.parse(storedState);
          if (parsedState.isAuthenticated && parsedState.user) {
            // Verify with backend
            dispatch(checkAuthStatus() as any);
          }
        } catch (error) {
          // Clear invalid stored state
          localStorage.removeItem('userState');
        }
      }
    }
  }, [dispatch, isAuthenticated]);

  return <>{children}</>;
};

export default AuthInitializer; 