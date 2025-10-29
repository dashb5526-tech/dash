

export interface HomeContent {
    brand: {
        name: string;
        logoUrl: string | null;
        footerDescription: string;
    };
    hero: {
        headline: string;
        subheadline: string;
        imageUrl: string;
        imageHint: string;
    };
}

function getBaseUrl() {
  if (typeof window !== 'undefined') return '';
  if (process.env.NEXT_PUBLIC_VERCEL_URL) return `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`;
  return 'http://localhost:9002';
}

export async function getHomeContent(): Promise<HomeContent | null> {
    try {
        const baseUrl = getBaseUrl();
        const response = await fetch(`${baseUrl}/api/home`);
        if (!response.ok) {
            throw new Error('Failed to fetch home content');
        }
        return await response.json();
    } catch (error) {
        console.error('Error reading home content:', error);
        return null;
    }
}

export async function saveHomeContent(content: HomeContent): Promise<void> {
    try {
        const response = await fetch('/api/home', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(content),
        });
        if (!response.ok) {
            throw new Error('Failed to save home content');
        }
    } catch (error) {
        console.error('Error saving home content:', error);
    }
}
