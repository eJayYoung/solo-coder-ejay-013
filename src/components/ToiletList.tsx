import React from 'react';
import { Toilet } from '../types';

interface ToiletListProps {
  toilets: Toilet[];
  onToiletClick: (toilet: Toilet) => void;
  selectedToilet: Toilet | null;
}

export const ToiletList: React.FC<ToiletListProps> = ({ toilets, onToiletClick, selectedToilet }) => {
  if (toilets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-500">
        <svg className="w-16 h-16 mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
        <p>暂无附近厕所数据</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {toilets.map((toilet) => (
        <div
          key={toilet.id}
          onClick={() => onToiletClick(toilet)}
          className={`p-4 rounded-xl cursor-pointer transition-all duration-200 ${
            selectedToilet?.id === toilet.id
              ? 'bg-blue-50 border-2 border-blue-500'
              : 'bg-white border-2 border-transparent hover:bg-gray-50'
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-gray-800">{toilet.name}</h3>
                {toilet.hasBabyRoom && (
                  <span className="px-2 py-0.5 bg-pink-100 text-pink-600 text-xs rounded-full">
                    母婴室
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-500 mt-1 truncate">{toilet.address}</p>
              <div className="flex items-center gap-3 mt-2">
                <span className="text-xs text-gray-400">
                  <svg className="w-3 h-3 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {toilet.openTime}
                </span>
                <span className="text-xs text-gray-400">
                  <svg className="w-3 h-3 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                  </svg>
                  {toilet.distance !== undefined ? `${toilet.distance}米` : '未知'}
                </span>
              </div>
            </div>
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      ))}
    </div>
  );
};
