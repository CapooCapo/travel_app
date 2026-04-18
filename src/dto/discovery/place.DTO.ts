/**
 * Khớp BE LocationResponse:
 * { id, name, address, description, latitude, longitude, ratingAverage }
 *
 * Các trường FE thêm vào (images, isBookmarked…) được
 * bổ sung ở service layer sau khi gọi thêm endpoint images.
 */
export type LocationResponse = {
  id: number;
  name: string;
  address: string;
  description: string;
  latitude: number;
  longitude: number;
  ratingAverage: number;
  category?: string;
  imageUrls?: string[];
};

/** Khớp BE LocationImageResponse */
export type LocationImageResponse = {
  id: number;
  imageUrl: string;
};

/**
 * PlaceDTO — kiểu dùng nội bộ FE, được map từ LocationResponse.
 * Các trường optional là những thứ BE chưa có hoặc lấy từ
 * endpoint riêng (images, bookmark…).
 */
export type PlaceDTO = {
  id: number;
  name: string;
  address: string;
  description: string;
  latitude: number;
  longitude: number;
  rating: number;            // mapped từ ratingAverage
  imageUrls: string[];       // từ /api/location-images/{id}/images
  isBookmarked?: boolean;
  reviewCount?: number;
  category?: string;
  distance?: number;
};

// ─── Request / Response wrappers ─────────────────────────────────────────────

export interface LocationListRequest {
  keyword?: string;
  categories?: string[];
  lat?: number;
  lng?: number;
  radius?: number;
  page?: number;
  size?: number;
}

/** Dùng tên cũ để không phải đổi tất cả service calls */
export type PlaceListRequest = LocationListRequest;

export type NearbyRequest = {
  lat: number;
  lng: number;
  page?: number;
  size?: number;
};

export type CreateLocationRequest = {
  name: string;
  address: string;
  description: string;
  latitude: number;
  longitude: number;
  externalId?: string;
  source?: string;
  phone?: string;
  website?: string;
};

/** Helper: map BE LocationResponse → FE PlaceDTO */
export function mapLocation(a: LocationResponse, images: string[] = []): PlaceDTO {
  return {
    id:          a.id,
    name:        a.name,
    address:     a.address,
    description: a.description,
    latitude:    a.latitude,
    longitude:   a.longitude,
    rating:      a.ratingAverage ?? 0,
    imageUrls:   images,
  };
}
