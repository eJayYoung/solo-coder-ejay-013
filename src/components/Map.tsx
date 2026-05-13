import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Toilet, UserLocation } from '../types';

interface MapProps {
  toilets: Toilet[];
  userLocation: UserLocation | null;
  onToiletClick: (toilet: Toilet) => void;
  onReportClick: () => void;
  selectedToilet: Toilet | null;
}

export const Map: React.FC<MapProps> = ({
  toilets,
  userLocation,
  onToiletClick,
  onReportClick,
  selectedToilet
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    const updateDimensions = () => {
      if (mapRef.current) {
        setDimensions({
          width: mapRef.current.offsetWidth,
          height: mapRef.current.offsetHeight
        });
      }
    };
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  const zoomIn = useCallback(() => {
    setZoom(prev => Math.min(prev + 0.2, 3));
  }, []);

  const zoomOut = useCallback(() => {
    setZoom(prev => Math.max(prev - 0.2, 0.5));
  }, []);

  const getMapPosition = (lat: number, lng: number) => {
    const defaultCenter = { lat: 39.9087, lng: 116.3975 };
    const centerLat = userLocation?.lat || defaultCenter.lat;
    const centerLng = userLocation?.lng || defaultCenter.lng;

    const latDiff = (lat - centerLat) * 10000;
    const lngDiff = (lng - centerLng) * 10000;

    const scale = 3000 * zoom;
    
    const x = dimensions.width / 2 + lngDiff * (dimensions.width / scale);
    const y = dimensions.height / 2 - latDiff * (dimensions.height / scale);

    return { 
      x: Math.max(20, Math.min(dimensions.width - 20, x)), 
      y: Math.max(20, Math.min(dimensions.height - 20, y)) 
    };
  };

  return (
    <div ref={mapRef} className="relative w-full h-full bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 overflow-hidden">
      <div className="absolute inset-0 opacity-40">
        <div 
          className="w-full h-full" 
          style={{
            backgroundImage: `
              linear-gradient(to right, #94a3b8 1px, transparent 1px),
              linear-gradient(to bottom, #94a3b8 1px, transparent 1px)
            `,
            backgroundSize: `${50 / zoom}px ${50 / zoom}px`
          }} 
        />
      </div>

      <div className="absolute top-4 left-4 flex flex-col gap-2 z-20">
        <button
          onClick={zoomIn}
          className="w-10 h-10 bg-white rounded-lg shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors"
          title="放大"
        >
          <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
        <div className="w-10 h-10 bg-white rounded-lg shadow-md flex items-center justify-center text-sm font-medium text-gray-700">
          {zoom.toFixed(1)}x
        </div>
        <button
          onClick={zoomOut}
          className="w-10 h-10 bg-white rounded-lg shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors"
          title="缩小"
        >
          <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
          </svg>
        </button>
      </div>

      {userLocation && (
        <div
          className="absolute w-10 h-10 bg-blue-500 rounded-full border-4 border-white shadow-lg transform -translate-x-1/2 -translate-y-1/2 z-10"
          style={{
            left: dimensions.width / 2,
            top: dimensions.height / 2
          }}
        >
          <div className="absolute inset-0 bg-blue-500 rounded-full animate-ping opacity-75" />
          <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center">
            <div className="w-2 h-2 bg-blue-500 rounded-full" />
          </div>
        </div>
      )}

      {toilets.map((toilet) => {
        const pos = getMapPosition(toilet.lat, toilet.lng);
        const isSelected = selectedToilet?.id === toilet.id;
        const distance = toilet.distance;
        
        return (
          <div
            key={toilet.id}
            className={`absolute transform -translate-x-1/2 -translate-y-1/2 z-10 cursor-pointer transition-all duration-200 ${
              isSelected ? 'scale-125 z-20' : 'hover:scale-110'
            }`}
            style={{ left: pos.x, top: pos.y }}
            onClick={() => onToiletClick(toilet)}
          >
            <div className={`relative w-12 h-12 rounded-full flex items-center justify-center shadow-lg ${
              toilet.hasBabyRoom ? 'bg-pink-500' : 'bg-green-500'
            } ${isSelected ? 'ring-4 ring-blue-400' : ''}`}>
              <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z" />
                <path d="M7 12h2v5H7zm4-3h2v8h-2zm4-3h2v11h-2z" />
              </svg>
              {toilet.hasBabyRoom && (
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center shadow-md">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                </div>
              )}
            </div>
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 bg-white rounded-lg px-3 py-1.5 shadow-md text-xs whitespace-nowrap z-10">
              <div className="font-medium text-gray-800">{toilet.name}</div>
              {distance !== undefined && (
                <div className="text-gray-500">{distance < 1000 ? `${distance}米` : `${(distance / 1000).toFixed(1)}公里`}</div>
              )}
            </div>
          </div>
        );
      })}

      <button
        onClick={onReportClick}
        className="absolute bottom-6 right-6 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-2 transition-all duration-200 hover:scale-105 z-20"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        上报厕所
      </button>

      <div className="absolute bottom-6 left-6 bg-white bg-opacity-90 rounded-lg px-3 py-2 shadow-md z-20">
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 bg-blue-500 rounded-full" />
            <span className="text-gray-600">我的位置</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 bg-green-500 rounded-full" />
            <span className="text-gray-600">公共厕所</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 bg-pink-500 rounded-full" />
            <span className="text-gray-600">母婴室</span>
          </div>
        </div>
      </div>
    </div>
  );
};
