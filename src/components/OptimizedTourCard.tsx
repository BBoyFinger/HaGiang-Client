import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { Tour } from '../types';

interface OptimizedTourCardProps {
  tour: Tour;
  className?: string;
}

const OptimizedTourCard: React.FC<OptimizedTourCardProps> = memo(({ tour, className = '' }) => {
  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 ${className}`}>
      <div className="relative">
        <img
          src={tour.images[0] || '/placeholder-tour.jpg'}
          alt={tour.title}
          className="w-full h-48 object-cover"
          loading="lazy"
        />
        <div className="absolute top-4 right-4 bg-green-500 text-white px-2 py-1 rounded-full text-sm font-semibold">
          {tour.price?.toLocaleString('vi-VN')} VNĐ
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          {tour.title}
        </h3>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-3">
          {tour.description}
        </p>
        
        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <span>⏱️ {tour.duration} ngày</span>
          {tour.averageRating && (
            <span>⭐ {tour.averageRating.toFixed(1)} ({tour.reviewCount || 0})</span>
          )}
        </div>
        
        <Link
          to={`/tour/${tour.slug}`}
          className="block w-full bg-green-500 hover:bg-green-600 text-white text-center py-2 px-4 rounded-lg font-medium transition-colors duration-200"
        >
          Xem chi tiết
        </Link>
      </div>
    </div>
  );
});

OptimizedTourCard.displayName = 'OptimizedTourCard';

export default OptimizedTourCard; 