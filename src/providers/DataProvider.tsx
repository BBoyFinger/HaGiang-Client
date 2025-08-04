import React, { createContext, useContext, useEffect, useState } from 'react';
import { usePrefetchData } from '../hooks/usePrefetch';

interface DataProviderContextType {
  isDataReady: boolean;
  dataLoadingProgress: number;
  criticalDataLoaded: boolean;
}

const DataProviderContext = createContext<DataProviderContextType | undefined>(undefined);

interface DataProviderProps {
  children: React.ReactNode;
}

export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  const [isDataReady, setIsDataReady] = useState(false);
  const [dataLoadingProgress, setDataLoadingProgress] = useState(0);
  const [criticalDataLoaded, setCriticalDataLoaded] = useState(false);

  // Prefetch critical data
  const { 
    toursData, 
    destinationsData, 
    blogsData, 
    userData, 
    isLoading 
  } = usePrefetchData();

  useEffect(() => {
    // Track loading progress
    let progress = 0;
    const totalSteps = 4;
    
    if (toursData) progress += 25;
    if (destinationsData) progress += 25;
    if (blogsData) progress += 25;
    if (userData) progress += 25;

    setDataLoadingProgress(progress);

    // Mark critical data as loaded (tours + destinations)
    if (toursData && destinationsData) {
      setCriticalDataLoaded(true);
    }

    // Mark all data as ready
    if (progress === 100) {
      setIsDataReady(true);
    }
  }, [toursData, destinationsData, blogsData, userData]);

  // Show loading screen only for critical data
  if (!criticalDataLoaded && isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <div className="text-gray-600">Đang tải dữ liệu quan trọng...</div>
          <div className="mt-2 text-sm text-gray-500">
            {dataLoadingProgress}% hoàn thành
          </div>
          <div className="mt-4 w-64 bg-gray-200 rounded-full h-2 mx-auto">
            <div 
              className="bg-green-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${dataLoadingProgress}%` }}
            ></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <DataProviderContext.Provider value={{
      isDataReady,
      dataLoadingProgress,
      criticalDataLoaded,
    }}>
      {children}
    </DataProviderContext.Provider>
  );
};

export const useDataProvider = () => {
  const context = useContext(DataProviderContext);
  if (context === undefined) {
    throw new Error('useDataProvider must be used within a DataProvider');
  }
  return context;
}; 