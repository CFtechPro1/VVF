import { PexelsPhoto } from '../types';

const PEXELS_API_KEY = process.env.PEXELS_API_KEY;

if (!PEXELS_API_KEY) {
  console.warn("Pexels API key not found. B-roll images will not be loaded. Please set PEXELS_API_KEY environment variable.");
}

const PEXELS_API_URL = 'https://api.pexels.com/v1/search';

export async function fetchBrollImages(keywords: string[]): Promise<PexelsPhoto[]> {
  if (!PEXELS_API_KEY) {
    return [];
  }

  // Use a Set to ensure unique image URLs
  const imageUrls = new Set<string>();
  const fetchedPhotos: PexelsPhoto[] = [];

  try {
    // We fetch 1 image per keyword to get a variety
    const promises = keywords.map(keyword =>
      fetch(`${PEXELS_API_URL}?query=${encodeURIComponent(keyword)}&per_page=1&orientation=portrait`, {
        headers: {
          Authorization: PEXELS_API_KEY,
        },
      }).then(res => {
        if (!res.ok) {
          throw new Error(`Pexels API error for keyword "${keyword}": ${res.statusText}`);
        }
        return res.json();
      })
    );

    const results = await Promise.allSettled(promises);

    for (const result of results) {
      if (result.status === 'fulfilled' && result.value.photos && result.value.photos.length > 0) {
        const photo = result.value.photos[0] as PexelsPhoto;
        // Ensure we don't add duplicate images
        if (!imageUrls.has(photo.src.portrait)) {
          imageUrls.add(photo.src.portrait);
          fetchedPhotos.push(photo);
        }
      } else if (result.status === 'rejected') {
        console.error("Failed to fetch from Pexels:", result.reason);
      }
    }
    
    return fetchedPhotos;

  } catch (error) {
    console.error("An error occurred while fetching B-roll images:", error);
    return [];
  }
}