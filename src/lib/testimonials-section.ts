export interface TestimonialsSection {
  title: string;
  description: string;
}

export async function getTestimonialsSection(): Promise<TestimonialsSection | null> {
  try {
    const response = await fetch('/api/testimonials-section');
    if (!response.ok) {
      throw new Error('Failed to fetch testimonials section content');
    }
    return await response.json();
  } catch (error) {
    console.error('Error reading testimonials section content:', error);
    return null;
  }
}

export async function saveTestimonialsSection(content: TestimonialsSection): Promise<void> {
  try {
    const response = await fetch('/api/testimonials-section', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(content),
    });
    if (!response.ok) {
      throw new Error('Failed to save testimonials section content');
    }
  } catch (error) {
    console.error('Error saving testimonials section content:', error);
  }
}
