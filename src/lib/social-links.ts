
export interface SocialLink {
  id: string;
  name: string;
  url: string;
  icon: string;
}

export async function getSocialLinks(): Promise<SocialLink[]> {
  try {
    const response = await fetch('/api/social-links');
    if (!response.ok) {
      throw new Error('Failed to fetch social links');
    }
    return await response.json();
  } catch (error) {
    console.error('Error reading social links:', error);
    return [];
  }
}

export async function saveSocialLinks(links: SocialLink[]): Promise<void> {
  try {
    const response = await fetch('/api/social-links', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(links),
    });
    if (!response.ok) {
      throw new Error('Failed to save social links');
    }
  } catch (error) {
    console.error('Error saving social links:', error);
  }
}
