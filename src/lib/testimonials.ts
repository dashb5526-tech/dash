
export interface Testimonial {
  id: string;
  quote: string;
  name: string;
  title: string;
  rating: number;
}

export async function getTestimonials(): Promise<Testimonial[]> {
  try {
    const response = await fetch('/api/testimonials');
    if (!response.ok) {
      throw new Error('Failed to fetch testimonials');
    }
    return await response.json();
  } catch (error) {
    console.error('Error reading testimonials:', error);
    return [];
  }
}

export async function saveTestimonials(testimonials: Testimonial[]): Promise<void> {
  try {
    const response = await fetch('/api/testimonials', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testimonials),
    });
    if (!response.ok) {
      throw new Error('Failed to save testimonials');
    }
  } catch (error) {
    console.error('Error saving testimonials:', error);
  }
}
