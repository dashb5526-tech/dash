export interface ContactInfo {
  address: string;
  phone: string;
  email: string;
}

export async function getContactInfo(): Promise<ContactInfo | null> {
  try {
    const response = await fetch('/api/contact-info');
    if (!response.ok) {
      throw new Error('Failed to fetch contact info');
    }
    return await response.json();
  } catch (error) {
    console.error('Error reading contact info:', error);
    return null;
  }
}

export async function saveContactInfo(info: ContactInfo): Promise<void> {
  try {
    const response = await fetch('/api/contact-info', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(info),
    });
    if (!response.ok) {
      throw new Error('Failed to save contact info');
    }
  } catch (error) {
    console.error('Error saving contact info:', error);
  }
}
