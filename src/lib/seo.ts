
export interface SeoContent {
  title: string;
  description: string;
  keywords: string;
}

function getBaseUrl() {
  if (typeof window !== 'undefined') {
    // We're on the client, return a relative path
    return '';
  }
  if (process.env.NEXT_PUBLIC_VERCEL_URL) {
    return `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`;
  }
  // Assume localhost for development on the server
  return 'http://localhost:9002';
}

export async function getSeoContent(): Promise<SeoContent | null> {
  try {
    const baseUrl = getBaseUrl();
    const fetchUrl = `${baseUrl}/api/seo`;
    const response = await fetch(fetchUrl, { next: { revalidate: 60 } });
    
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
