import React, { useState } from 'react';
import LoadingSpinner, { TableLoading, CardLoading, Skeleton } from './LoadingSpinner';

const LoadingDemo: React.FC = () => {
  const [selectedType, setSelectedType] = useState<'hash' | 'pulse' | 'beat' | 'sync' | 'ring' | 'scale' | 'moon' | 'fade' | 'grid'>('hash');
  const [size, setSize] = useState(50);
  const [color, setColor] = useState('#3B82F6');
  const [text, setText] = useState('Đang tải...');
  const [fullScreen, setFullScreen] = useState(false);

  const spinnerTypes = [
    { value: 'hash', label: 'Hash Loader', color: '#3B82F6' },
    { value: 'pulse', label: 'Pulse Loader', color: '#10B981' },
    { value: 'beat', label: 'Beat Loader', color: '#F59E0B' },
    { value: 'sync', label: 'Sync Loader', color: '#8B5CF6' },
    { value: 'ring', label: 'Ring Loader', color: '#EF4444' },
    { value: 'scale', label: 'Scale Loader', color: '#06B6D4' },
    { value: 'moon', label: 'Moon Loader', color: '#EC4899' },
    { value: 'fade', label: 'Fade Loader', color: '#84CC16' },
    { value: 'grid', label: 'Grid Loader', color: '#F97316' },
  ];

  const handleTypeChange = (type: any) => {
    setSelectedType(type);
    const selectedSpinner = spinnerTypes.find(s => s.value === type);
    if (selectedSpinner) {
      setColor(selectedSpinner.color);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Loading Components Demo</h1>

        {/* Controls */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-8">
          <h2 className="text-xl font-semibold mb-4">Controls</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Spinner Type</label>
              <select
                value={selectedType}
                onChange={(e) => handleTypeChange(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {spinnerTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Size</label>
              <input
                type="range"
                min="20"
                max="100"
                value={size}
                onChange={(e) => setSize(Number(e.target.value))}
                className="w-full"
              />
              <span className="text-sm text-gray-500">{size}px</span>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-full h-10 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Text</label>
              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="mt-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={fullScreen}
                onChange={(e) => setFullScreen(e.target.checked)}
                className="mr-2"
              />
              <span className="text-sm font-medium text-gray-700">Full Screen</span>
            </label>
          </div>
        </div>

        {/* Spinner Demo */}
        <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 mb-8">
          <h2 className="text-xl font-semibold mb-4">Spinner Demo</h2>
          <div className="flex justify-center">
            <LoadingSpinner
              type={selectedType}
              size={size}
              color={color}
              text={text}
              fullScreen={fullScreen}
            />
          </div>
        </div>

        {/* All Spinners */}
        <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 mb-8">
          <h2 className="text-xl font-semibold mb-6">All Spinner Types</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {spinnerTypes.map((type) => (
              <div key={type.value} className="text-center p-4 border border-gray-200 rounded-lg">
                <LoadingSpinner
                  type={type.value as any}
                  size={40}
                  color={type.color}
                  text={type.label}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Table Loading */}
        <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 mb-8">
          <h2 className="text-xl font-semibold mb-4">Table Loading</h2>
          <TableLoading rows={3} />
        </div>

        {/* Card Loading */}
        <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 mb-8">
          <h2 className="text-xl font-semibold mb-4">Card Loading</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <CardLoading />
            <CardLoading />
            <CardLoading />
          </div>
        </div>

        {/* Skeleton Loading */}
        <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold mb-4">Skeleton Loading</h2>
          <div className="space-y-4">
            <Skeleton className="h-8 bg-gray-200 rounded w-3/4" />
            <Skeleton className="h-4 bg-gray-200 rounded w-1/2" />
            <Skeleton className="h-4 bg-gray-200 rounded w-5/6" />
            <Skeleton className="h-4 bg-gray-200 rounded w-2/3" />
            <div className="flex space-x-4">
              <Skeleton className="h-12 w-12 bg-gray-200 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 bg-gray-200 rounded w-1/2" />
                <Skeleton className="h-3 bg-gray-200 rounded w-1/3" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingDemo; 