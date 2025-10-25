export interface GalleryImage {
  id: string;
  description: string;
  imageUrl: string;
  imageHint: string;
}

export interface GalleryContent {
  title: string;
  description: string;
  galleryImages: GalleryImage[];
}

export async function getGalleryContent(): Promise<GalleryContent | null> {
  try {
    const response = await fetch('/api/gallery');
    if (!response.ok) {
      throw new Error('Failed to fetch gallery content');
    }
    return await response.json();
  } catch (error) {
    console.error('Error reading gallery content:', error);
    return null;
  }
}

export async function saveGalleryContent(content: GalleryContent): Promise<void> {
  try {
    const response = await fetch('/api/gallery', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(content),
    });
    if (!response.ok) {
      throw new Error('Failed to save gallery content');
    }
  } catch (error) {
    console.error('Error saving gallery content:', error);
  }
}
