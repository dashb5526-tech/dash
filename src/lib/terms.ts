export interface TermsContent {
  title: string;
  content: string;
}

export async function getTermsContent(): Promise<TermsContent | null> {
  try {
    const response = await fetch('/api/terms');
    if (!response.ok) {
      throw new Error('Failed to fetch terms content');
    }
    return await response.json();
  } catch (error) {
    console.error('Error reading terms content:', error);
    return null;
  }
}

export async function saveTermsContent(content: TermsContent): Promise<void> {
  try {
    const response = await fetch('/api/terms', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(content),
    });
    if (!response.ok) {
      throw new Error('Failed to save terms content');
    }
  } catch (error) {
    console.error('Error saving terms content:', error);
  }
}
