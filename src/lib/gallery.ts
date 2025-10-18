export interface GalleryImage {
  id: string;
  description: string;
  imageUrl: string;
  imageHint: string;
}

export async function getGalleryImages(): Promise<GalleryImage[]> {
  try {
    const response = await fetch('/api/gallery');
    if (!response.ok) {
      throw new Error('Failed to fetch gallery images');
    }
    return await response.json();
  } catch (error) {
    console.error('Error reading gallery images:', error);
    return [];
  }
}

export async function saveGalleryImages(images: GalleryImage[]): Promise<void> {
  try {
    const response = await fetch('/api/gallery', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(images),
    });
    if (!response.ok) {
      throw new Error('Failed to save gallery images');
    }
  } catch (error) {
    console.error('Error saving gallery images:', error);
  }
}
