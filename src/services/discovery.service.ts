import { apiRequest } from "../api/client";
import { PlaceDTO, mapAttraction, AttractionListRequest } from "../dto/discovery/place.DTO";

export const discoveryService = {

  /** GET /api/attractions — search/filter danh sách */
  async getAttractions(params: AttractionListRequest): Promise<{ places: PlaceDTO[]; totalPages: number }> {
    const res = await apiRequest.getAttractions(params);
    const page = res.data?.data;
    const places = (page?.content ?? []).map((a) => mapAttraction(a));
    return { places, totalPages: page?.totalPages ?? 0 };
  },

  /** GET /api/attractions/popular */
  async getPopular(page = 0, size = 10): Promise<PlaceDTO[]> {
    const res = await apiRequest.getPopularAttractions(page, size);
    return (res.data?.data?.content ?? []).map((a) => mapAttraction(a));
  },

  /** GET /api/attractions/{id} + images */
  async getAttractionById(id: number): Promise<PlaceDTO | null> {
    const [attrRes, imgRes] = await Promise.allSettled([
      apiRequest.getAttractionById(id),
      apiRequest.getAttractionImages(id),
    ]);

    if (attrRes.status === "rejected") return null;

    const attraction = attrRes.value.data?.data;
    if (!attraction) return null;

    const images =
      imgRes.status === "fulfilled"
        ? (imgRes.value.data?.data ?? []).map((i) => i.imageUrl)
        : [];

    return mapAttraction(attraction, images);
  },

  /** GET /api/attractions/nearby */
  async getNearbyAttractions(lat: number, lng: number, page = 0, size = 10): Promise<PlaceDTO[]> {
    const res = await apiRequest.getNearbyAttractions(lat, lng, page, size);
    return (res.data?.data?.content ?? []).map((a) => mapAttraction(a));
  },

  /** GET /api/attraction-images/{id}/images */
  async getImages(attractionId: number): Promise<string[]> {
    const res = await apiRequest.getAttractionImages(attractionId);
    return (res.data?.data ?? []).map((i) => i.imageUrl);
  },

  // ─── Bookmarks ──────────────────────────────────────────────────────────

  /** POST /api/bookmarks/{attractionId} */
  async addBookmark(attractionId: number): Promise<void> {
    await apiRequest.addBookmark(attractionId);
  },

  /** DELETE /api/bookmarks/{attractionId} */
  async removeBookmark(attractionId: number): Promise<void> {
    await apiRequest.removeBookmark(attractionId);
  },

  /** GET /api/bookmarks */
  async getBookmarks(): Promise<PlaceDTO[]> {
    const res = await apiRequest.getBookmarks();
    return (res.data?.data ?? []).map((a) => mapAttraction(a));
  },

  /** Toggle helper — gọi add hoặc remove tuỳ trạng thái */
  async toggleBookmark(attractionId: number, currentlyBookmarked: boolean): Promise<boolean> {
    if (currentlyBookmarked) {
      await apiRequest.removeBookmark(attractionId);
      return false;
    } else {
      await apiRequest.addBookmark(attractionId);
      return true;
    }
  },
};
