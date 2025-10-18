export interface Partner {
  id: string;
  name: string;
  logoUrl: string | null;
}

export async function getPartners(): Promise<Partner[]> {
  try {
    const response = await fetch('/api/partners');
    if (!response.ok) {
      throw new Error('Failed to fetch partners');
    }
    return await response.json();
  } catch (error) {
    console.error('Error reading partners:', error);
    return [];
  }
}

export async function savePartners(partners: Partner[]): Promise<void> {
  try {
    const response = await fetch('/api/partners', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(partners),
    });
    if (!response.ok) {
      throw new Error('Failed to save partners');
    }
  } catch (error) {
    console.error('Error saving partners:', error);
  }
}
