
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
    const response = await fetch(`${baseUrl}/api/seo`, { next: { revalidate: 60 } }); // Add revalidation
    if (!response.ok) {
      throw new Error('Failed to fetch SEO content');
    }
    return await response.json();
  } catch (error) {
    console.error('Error reading SEO content:', error);
    // Fallback for build time or error
     try {
      const fs = require('fs').promises;
      const path = require('path');
      const seoFilePath = path.join(process.cwd(), 'src/lib/seo.json');
      const data = await fs.readFile(seoFilePath, 'utf8');
      return JSON.parse(data);
    } catch (fsError) {
      console.error('Error reading SEO fallback file:', fsError);
      return null;
    }
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
