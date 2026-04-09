export type EventResponse = {
  id: number;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  price: number;
  status: 'INCOMING' | 'ONGOING' | 'COMPLETED';
  adminStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
  locationId: number;
  address: string;
  category: string;
  createdBy: number;
  images: string[];
  isBookmarked: boolean;
  latitude?: number;
  longitude?: number;
};

export type EventFilterParams = {
  keyword?: string;
  category?: string;
  isFree?: boolean;
  minPrice?: number;
  maxPrice?: number;
  startDate?: string;
  endDate?: string;
  status?: string; // lifecycle status
  lat?: number;
  lng?: number;
  radius?: number;
  page?: number;
  size?: number;
};

export type EventCreateRequest = {
  title: string;
  categoryId: number;
  description?: string;
  startTime: string;
  endTime: string;
  price?: number;
  locationId?: number;
  latitude?: number;
  longitude?: number;
  address?: string;
  images?: string[];
};
