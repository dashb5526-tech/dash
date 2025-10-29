

export interface Service {
    id: string;
    icon: string;
    title: string;
    description: string;
}

export interface AboutContent {
    main: {
        title: string;
        paragraph1: string;
        paragraph2: string;
        imageUrl: string;
        imageHint: string;
    };
    services: {
        title: string;
        items: Service[];
    };
    seo: {
        title: string;
        description: string;
        keywords: string;
    };
}

export async function getAboutContent(): Promise<AboutContent | null> {
    try {
        const baseUrl = typeof window === 'undefined' ? (process.env.NEXT_PUBLIC_VERCEL_URL ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}` : 'http://localhost:9002') : '';
        const response = await fetch(`${baseUrl}/api/about`);
        if (!response.ok) {
            throw new Error('Failed to fetch about content');
        }
        return await response.json();
    } catch (error) {
        console.error('Error reading about content:', error);
        return null;
    }
}

export async function saveAboutContent(content: AboutContent): Promise<void> {
    try {
        const response = await fetch('/api/about', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(content),
        });
        if (!response.ok) {
            throw new Error('Failed to save about content');
        }
    } catch (error) {
        console.error('Error saving about content:', error);
    }
}
