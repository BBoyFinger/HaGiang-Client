import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { 
  useGetToursQuery,
  useGetDestinationsQuery,
  useGetBlogsQuery,
  useGetCurrentUserQuery
} from '../services/api';

// Hook để prefetch data quan trọng
export const usePrefetchData = () => {
  const dispatch = useDispatch();

  // Prefetch tours data
  const { data: toursData, isLoading: toursLoading } = useGetToursQuery(undefined, {
    // Chỉ fetch nếu chưa có data trong cache
    skip: false,
  });

  // Prefetch destinations data
  const { data: destinationsData, isLoading: destinationsLoading } = useGetDestinationsQuery(undefined, {
    skip: false,
  });

  // Prefetch blogs data
  const { data: blogsData, isLoading: blogsLoading } = useGetBlogsQuery(undefined, {
    skip: false,
  });

  // Prefetch user data nếu đã đăng nhập
  const { data: userData, isLoading: userLoading } = useGetCurrentUserQuery(undefined, {
    skip: false,
  });

  return {
    toursData,
    destinationsData,
    blogsData,
    userData,
    isLoading: toursLoading || destinationsLoading || blogsLoading || userLoading,
  };
};

// Hook để prefetch data cho trang cụ thể
export const usePrefetchPageData = (pageName: string) => {
  const dispatch = useDispatch();

  useEffect(() => {
    // Prefetch data dựa trên trang hiện tại
    switch (pageName) {
      case 'home':
        // Home page cần tours, destinations, blogs
        break;
      case 'tours':
        // Tours page chỉ cần tours data
        break;
      case 'destinations':
        // Destinations page chỉ cần destinations data
        break;
      case 'blogs':
        // Blogs page chỉ cần blogs data
        break;
      default:
        break;
    }
  }, [pageName, dispatch]);
};

// Hook để optimize data loading
export const useOptimizedDataLoading = () => {
  const dispatch = useDispatch();

  // Strategy: Load critical data first, then non-critical
  const loadCriticalData = () => {
    // Tours và destinations là critical data
    // Blogs và user data có thể load sau
  };

  const loadNonCriticalData = () => {
    // Load blogs, user data, etc.
  };

  return {
    loadCriticalData,
    loadNonCriticalData,
  };
}; 