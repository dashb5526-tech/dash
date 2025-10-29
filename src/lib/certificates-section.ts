export interface CertificatesSection {
  title: string;
  description: string;
}

export async function getCertificatesSection(): Promise<CertificatesSection | null> {
  try {
    const response = await fetch('/api/certificates-section');
    if (!response.ok) {
      throw new Error('Failed to fetch certificates section content');
    }
    return await response.json();
  } catch (error) {
    console.error('Error reading certificates section content:', error);
    return null;
  }
}

export async function saveCertificatesSection(content: CertificatesSection): Promise<void> {
  try {
    const response = await fetch('/api/certificates-section', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(content),
    });
    if (!response.ok) {
      throw new Error('Failed to save certificates section content');
    }
  } catch (error) {
    console.error('Error saving certificates section content:', error);
  }
}
