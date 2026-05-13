import React, { useState } from 'react';
import { ReportData } from '../types';

interface ReportFormProps {
  onSubmit: (data: ReportData) => void;
  onClose: () => void;
  userLocation: { lat: number; lng: number } | null;
}

export const ReportForm: React.FC<ReportFormProps> = ({ onSubmit, onClose, userLocation }) => {
  const [formData, setFormData] = useState<ReportData>({
    name: '',
    address: '',
    lat: userLocation?.lat || 39.9087,
    lng: userLocation?.lng || 116.3975,
    openTime: '全天开放',
    hasBabyRoom: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.address) {
      alert('请填写完整信息');
      return;
    }
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end z-50">
      <div className="bg-white w-full rounded-t-3xl max-h-[80vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">上报厕所</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">厕所名称 *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              placeholder="请输入厕所名称"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">详细地址 *</label>
            <textarea
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
              rows={3}
              placeholder="请输入详细地址"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">开放时间</label>
            <select
              value={formData.openTime}
              onChange={(e) => setFormData({ ...formData, openTime: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            >
              <option value="全天开放">全天开放</option>
              <option value="06:00-22:00">06:00-22:00</option>
              <option value="07:00-21:00">07:00-21:00</option>
              <option value="08:00-18:00">08:00-18:00</option>
              <option value="09:00-17:00">09:00-17:00</option>
              <option value="10:00-22:00">10:00-22:00</option>
              <option value="其他">其他</option>
            </select>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="hasBabyRoom"
              checked={formData.hasBabyRoom}
              onChange={(e) => setFormData({ ...formData, hasBabyRoom: e.target.checked })}
              className="w-4 h-4 text-blue-500 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="hasBabyRoom" className="text-sm font-medium text-gray-700">
              有无母婴室
            </label>
          </div>

          <div className="pt-4 border-t">
            <button
              type="submit"
              className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-full font-medium transition-colors"
            >
              提交上报
            </button>
            <p className="text-xs text-gray-500 text-center mt-2">
              您的上报将在审核通过后显示在地图上
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
