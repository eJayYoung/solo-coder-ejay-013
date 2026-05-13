import { Toilet } from '../types';

export const mockToilets: Toilet[] = [
  {
    id: '1',
    name: '人民公园公共厕所',
    lat: 39.9087,
    lng: 116.3975,
    address: '北京市东城区人民公园内',
    openTime: '全天开放',
    hasBabyRoom: true,
    status: 'approved'
  },
  {
    id: '2',
    name: '王府井地铁站厕所',
    lat: 39.9142,
    lng: 116.4102,
    address: '北京市东城区王府井地铁站B1层',
    openTime: '06:00-23:00',
    hasBabyRoom: true,
    status: 'approved'
  },
  {
    id: '3',
    name: '故宫博物院公共厕所',
    lat: 39.9163,
    lng: 116.3972,
    address: '北京市东城区故宫博物院内',
    openTime: '08:30-17:00',
    hasBabyRoom: false,
    status: 'approved'
  },
  {
    id: '4',
    name: '西单购物中心厕所',
    lat: 39.9138,
    lng: 116.3705,
    address: '北京市西城区西单购物中心3层',
    openTime: '10:00-22:00',
    hasBabyRoom: true,
    status: 'approved'
  },
  {
    id: '5',
    name: '天安门广场公共厕所',
    lat: 39.9042,
    lng: 116.3974,
    address: '北京市东城区天安门广场东侧',
    openTime: '全天开放',
    hasBabyRoom: false,
    status: 'approved'
  },
  {
    id: '6',
    name: '三里屯太古里厕所',
    lat: 39.9371,
    lng: 116.4416,
    address: '北京市朝阳区三里屯太古里南区B1层',
    openTime: '10:00-22:00',
    hasBabyRoom: true,
    status: 'approved'
  },
  {
    id: '7',
    name: '国贸商城公共厕所',
    lat: 39.9086,
    lng: 116.4705,
    address: '北京市朝阳区国贸商城B1层',
    openTime: '10:00-22:00',
    hasBabyRoom: true,
    status: 'approved'
  },
  {
    id: '8',
    name: '奥林匹克公园公共厕所',
    lat: 39.9999,
    lng: 116.4066,
    address: '北京市朝阳区奥林匹克公园内',
    openTime: '全天开放',
    hasBabyRoom: false,
    status: 'approved'
  }
];

export const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 1000);
};

export const filterToiletsByRadius = (
  toilets: Toilet[],
  centerLat: number,
  centerLng: number,
  radius: number
): Toilet[] => {
  return toilets
    .map(toilet => ({
      ...toilet,
      distance: calculateDistance(centerLat, centerLng, toilet.lat, toilet.lng)
    }))
    .filter(toilet => toilet.distance !== undefined && toilet.distance <= radius)
    .sort((a, b) => (a.distance || 0) - (b.distance || 0));
};
