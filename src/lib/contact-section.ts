export interface ContactSection {
  title: string;
  description: string;
}

export async function getContactSection(): Promise<ContactSection | null> {
  try {
    const response = await fetch('/api/contact-section');
    if (!response.ok) {
      throw new Error('Failed to fetch contact section content');
    }
    return await response.json();
  } catch (error) {
    console.error('Error reading contact section content:', error);
    return null;
  }
}

export async function saveContactSection(content: ContactSection): Promise<void> {
  try {
    const response = await fetch('/api/contact-section', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(content),
    });
    if (!response.ok) {
      throw new Error('Failed to save contact section content');
    }
  } catch (error) {
    console.error('Error saving contact section content:', error);
  }
}
