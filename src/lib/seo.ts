
export interface SeoContent {
  title: string;
  description: string;
  keywords: string;
}

function getBaseUrl() {
  if (process.env.NEXT_PUBLIC_VERCEL_URL) {
    return `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`;
  }
  // Assume localhost for development
  return 'http://localhost:9002';
}

export async function getSeoContent(): Promise<SeoContent | null> {
  try {
    const baseUrl = getBaseUrl();
    // Using fetch with an absolute URL is required for server-side fetching during build.
    const response = await fetch(`${baseUrl}/api/seo`, { next: { revalidate: 60 } });
    
    if (!response.ok) {
       console.error(`Failed to fetch SEO content: ${response.status} ${response.statusText}`);
       return null;
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching SEO content:', error);
    return null;
  }
}

export async function saveSeoContent(content: SeoContent): Promise<void> {
  try {
    const response = await fetch('/api/seo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(content),
    });
    if (!response.ok) {
      throw new Error('Failed to save SEO content');
    }
  } catch (error) {
    console.error('Error saving SEO content:', error);
    throw error;
  }
}
