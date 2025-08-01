import React from 'react';
import { 
  ClipLoader, 
  PulseLoader, 
  BeatLoader, 
  SyncLoader, 
  RingLoader, 
  ScaleLoader,
  HashLoader,
  MoonLoader,
  FadeLoader,
  GridLoader
} from 'react-spinners';

interface LoadingSpinnerProps {
  type?: 'clip' | 'pulse' | 'beat' | 'sync' | 'ring' | 'scale' | 'hash' | 'moon' | 'fade' | 'grid';
  size?: number;
  color?: string;
  loading?: boolean;
  text?: string;
  fullScreen?: boolean;
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  type = 'hash',
  size = 50,
  color = '#3B82F6',
  loading = true,
  text,
  fullScreen = false,
  className = ''
}) => {
  const renderSpinner = () => {
    const commonProps = {
      size: size,
      color: color,
      loading: loading
    };

    switch (type) {
      case 'clip':
        return <ClipLoader {...commonProps} />;
      case 'pulse':
        return <PulseLoader {...commonProps} />;
      case 'beat':
        return <BeatLoader {...commonProps} />;
      case 'sync':
        return <SyncLoader {...commonProps} />;
      case 'ring':
        return <RingLoader {...commonProps} />;
      case 'scale':
        return <ScaleLoader {...commonProps} />;
      case 'hash':
        return <HashLoader {...commonProps} />;
      case 'moon':
        return <MoonLoader {...commonProps} />;
      case 'fade':
        return <FadeLoader {...commonProps} />;
      case 'grid':
        return <GridLoader {...commonProps} />;
      default:
        return <HashLoader {...commonProps} />;
    }
  };

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-90 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="text-center">
          {renderSpinner()}
          {text && (
            <p className="mt-4 text-gray-600 font-medium animate-pulse">{text}</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      {renderSpinner()}
      {text && (
        <p className="mt-3 text-gray-600 font-medium text-sm">{text}</p>
      )}
    </div>
  );
};

// Component loading cho table
export const TableLoading: React.FC<{ rows?: number }> = ({ rows = 5 }) => {
  return (
    <div className="animate-pulse">
      <div className="bg-gray-50 h-12 rounded-t-lg"></div>
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className="border-b border-gray-200">
          <div className="h-16 flex items-center px-6">
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
            </div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            </div>
            <div className="flex-1 space-y-2">
              <div className="h-8 bg-gray-200 rounded w-20"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Component loading cho card
export const CardLoading: React.FC = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 animate-pulse">
      <div className="flex items-center mb-4">
        <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
        <div className="ml-4 flex-1">
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-1/3"></div>
        </div>
      </div>
      <div className="space-y-3">
        <div className="h-4 bg-gray-200 rounded"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        <div className="h-4 bg-gray-200 rounded w-4/6"></div>
      </div>
    </div>
  );
};

// Component loading cho skeleton
export const Skeleton: React.FC<{ className?: string }> = ({ className = "h-4 bg-gray-200 rounded" }) => {
  return <div className={`animate-pulse ${className}`}></div>;
};

export default LoadingSpinner; 