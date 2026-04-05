/**
 * ── Curated Unsplash photo pools per travel category ────────────────────────
 * Used to provide consistent, high-quality images for various travel categories.
 */

export const PHOTO_POOLS: Record<string, string[]> = {
    food: [
        "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=500",
        "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=500",
        "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=500",
    ],
    restaurant: [
        "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=500",
        "https://images.unsplash.com/photo-1424847651672-bf20a4b0982b?q=80&w=500",
        "https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?q=80&w=500",
    ],
    nature: [
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=500",
        "https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=500",
        "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?q=80&w=500",
    ],
    beach: [
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=500",
        "https://images.unsplash.com/photo-1519046904884-53103b34b206?q=80&w=500",
        "https://images.unsplash.com/photo-1473116763249-2faaef81ccda?q=80&w=500",
    ],
    culture: [
        "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80&w=500",
        "https://images.unsplash.com/photo-1533929736458-ca588d08c8be?q=80&w=500",
        "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?q=80&w=500",
    ],
    museum: [
        "https://images.unsplash.com/photo-1554907984-15263bfd63bd?q=80&w=500",
        "https://images.unsplash.com/photo-1516979187457-637abb4f9353?q=80&w=500",
        "https://images.unsplash.com/photo-1503152394-c571994fd383?q=80&w=500",
    ],
    shopping: [
        "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=500",
        "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?q=80&w=500",
        "https://images.unsplash.com/photo-1472851294608-062f824d29cc?q=80&w=500",
    ],
    adventure: [
        "https://images.unsplash.com/photo-1501555088652-021faa106b9b?q=80&w=500",
        "https://images.unsplash.com/photo-1533130061792-64b345e4a833?q=80&w=500",
        "https://images.unsplash.com/photo-1452421822248-d4c2b47f0c81?q=80&w=500",
    ],
    park: [
        "https://images.unsplash.com/photo-1437622368342-7a3d73a34c8f?q=80&w=500",
        "https://images.unsplash.com/photo-1568515045052-f9a854d70bfd?q=80&w=500",
        "https://images.unsplash.com/photo-1559827260-dc66d52bef19?q=80&w=500",
    ],
    default: [
        "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=500",
        "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=500",
        "https://images.unsplash.com/photo-1488085061387-422e29b40080?q=80&w=500",
    ],
};

/** 
 * Pick a consistent (non-random) photo based on attraction name + category 
 * Ensuring a deterministic image based on the content of the string.
 */
export function getPlaceImage(name: string, category?: string): string {
    const key = category?.toLowerCase() ?? "";
    const pool =
        PHOTO_POOLS[key] ??
        Object.entries(PHOTO_POOLS).find(([k]) => key.includes(k))?.[1] ??
        PHOTO_POOLS.default;
    
    // Deterministic index based on character code sum
    const index = name.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0) % pool.length;
    return pool[index];
}
