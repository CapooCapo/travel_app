/**
 * Khớp BE AttractionResponse:
 * { id, name, address, description, latitude, longitude, ratingAverage }
 *
 * Các trường FE thêm vào (images, isBookmarked…) được
 * bổ sung ở service layer sau khi gọi thêm endpoint images.
 */
export type AttractionResponse = {
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

/** Khớp BE AttractionImageResponse */
export type AttractionImageResponse = {
  id: number;
  imageUrl: string;
};

/**
 * PlaceDTO — kiểu dùng nội bộ FE, được map từ AttractionResponse.
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
  imageUrls: string[];       // từ /api/attraction-images/{id}/images
  isBookmarked?: boolean;
  reviewCount?: number;
  category?: string;
  distance?: number;
};

// ─── Request / Response wrappers ─────────────────────────────────────────────

export type AttractionListRequest = {
  keyword?: string;
  rating?: number;
  page?: number;
  size?: number;             // BE dùng "size", không phải "limit"
};

/** Dùng tên cũ để không phải đổi tất cả service calls */
export type PlaceListRequest = AttractionListRequest;

export type NearbyRequest = {
  lat: number;
  lng: number;
  page?: number;
  size?: number;
};

export type CreateAttractionRequest = {
  name: string;
  address: string;
  description: string;
  latitude: number;
  longitude: number;
};

/** Helper: map BE AttractionResponse → FE PlaceDTO */
export function mapAttraction(a: AttractionResponse, images: string[] = []): PlaceDTO {
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
