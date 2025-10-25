export interface ProductsSection {
  title: string;
  description: string;
}

export async function getProductsSection(): Promise<ProductsSection | null> {
  try {
    const response = await fetch('/api/products-section');
    if (!response.ok) {
      throw new Error('Failed to fetch products section content');
    }
    return await response.json();
  } catch (error) {
    console.error('Error reading products section content:', error);
    return null;
  }
}

export async function saveProductsSection(content: ProductsSection): Promise<void> {
  try {
    const response = await fetch('/api/products-section', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(content),
    });
    if (!response.ok) {
      throw new Error('Failed to save products section content');
    }
  } catch (error) {
    console.error('Error saving products section content:', error);
  }
}

    