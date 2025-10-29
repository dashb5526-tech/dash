export interface Certificate {
  id: string;
  name: string;
  imageUrl: string;
}

export async function getCertificates(): Promise<Certificate[]> {
  try {
    const response = await fetch('/api/certificates');
    if (!response.ok) {
      throw new Error('Failed to fetch certificates');
    }
    return await response.json();
  } catch (error) {
    console.error('Error reading certificates:', error);
    return [];
  }
}

export async function saveCertificates(certificates: Certificate[]): Promise<void> {
  try {
    const response = await fetch('/api/certificates', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(certificates),
    });
    if (!response.ok) {
      throw new Error('Failed to save certificates');
    }
  } catch (error) {
    console.error('Error saving certificates:', error);
  }
}

    