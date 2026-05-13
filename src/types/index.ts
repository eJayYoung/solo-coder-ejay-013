export interface Toilet {
  id: string;
  name: string;
  lat: number;
  lng: number;
  address: string;
  distance?: number;
  openTime: string;
  hasBabyRoom: boolean;
  status: 'approved' | 'pending';
  createdAt?: string;
}

export interface UserLocation {
  lat: number;
  lng: number;
}

export interface ReportData {
  name: string;
  address: string;
  lat: number;
  lng: number;
  openTime: string;
  hasBabyRoom: boolean;
}
