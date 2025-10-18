export interface Product {
  name: string;
  description: string;
  imageId: string;
  imageUrl: string | null;
}

export async function getProducts(): Promise<Product[]> {
  try {
    const response = await fetch('/api/products');
    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }
    return await response.json();
  } catch (error) {
    console.error('Error reading products:', error);
    return [];
  }
}

export async function saveProducts(products: Product[]): Promise<void> {
  try {
    const response = await fetch('/api/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(products),
    });
    if (!response.ok) {
      throw new Error('Failed to save products');
    }
  } catch (error) {
    console.error('Error saving products:', error);
  }
}