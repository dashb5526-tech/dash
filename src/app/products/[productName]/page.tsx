
import { promises as fs } from 'fs';
import path from 'path';
import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2 } from 'lucide-react';
import { Product } from '@/lib/products';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { HomeContent, getHomeContent } from '@/lib/home';

const productsFilePath = path.join(process.cwd(), 'src/lib/products.json');

function getBaseUrl() {
  if (process.env.NEXT_PUBLIC_VERCEL_URL) {
    return `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`;
  }
  return 'http://localhost:9002';
}

async function getProducts(): Promise<Product[]> {
  try {
    const data = await fs.readFile(productsFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading products file:', error);
    return [];
  }
}

async function getProduct(slug: string): Promise<Product | undefined> {
  const products = await getProducts();
  const productName = decodeURIComponent(slug).replace(/-/g, ' ');
  return products.find(p => p.name.toLowerCase() === productName.toLowerCase());
}

type Props = {
  params: { productName: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await getProduct(params.productName);
  const homeContent = await getHomeContent();

  if (!product) {
    return {
      title: 'Product Not Found',
    };
  }

  const title = product.seoTitle || product.name;
  const description = product.seoDescription || product.description;
  const keywords = product.seoKeywords || product.name;
  const baseUrl = getBaseUrl();
  const productUrl = `${baseUrl}/products/${params.productName}`;
  const imageUrl = product.imageUrl ? `${baseUrl}${product.imageUrl}` : '';


  return {
    title: title,
    description: description,
    keywords: keywords,
    openGraph: {
      title: title,
      description: description,
      url: productUrl,
      siteName: homeContent?.brand.name || 'Dash Rice Traders',
      images: imageUrl ? [
        {
          url: imageUrl,
          width: 800,
          height: 600,
          alt: product.name,
        },
      ] : [],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: title,
      description: description,
      images: imageUrl ? [imageUrl] : [],
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const product = await getProduct(params.productName);
  const homeContent = await getHomeContent();

  if (!product) {
    notFound();
  }
  
  const baseUrl = getBaseUrl();
  const productUrl = `${baseUrl}/products/${params.productName}`;
  const imageUrl = product.imageUrl ? `${baseUrl}${product.imageUrl}` : undefined;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: imageUrl,
    url: productUrl,
    brand: {
      '@type': 'Brand',
      name: homeContent?.brand.name || 'Dash Rice Traders',
    },
    sku: product.imageId, // Using imageId as a stand-in for SKU
    // If you add pricing, you can include offers
    // "offers": {
    //   "@type": "Offer",
    //   "url": productUrl,
    //   "priceCurrency": "INR",
    //   "price": "100.00",
    //   "availability": "https://schema.org/InStock"
    // }
  };

  return (
    <>
    <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Header />
      <main className="flex-1 bg-secondary py-16 sm:py-20 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16">
            <div>
              {product.imageUrl && (
                <div className="aspect-square relative w-full overflow-hidden rounded-lg shadow-lg">
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
            </div>
            <div className="space-y-6">
              <h1 className="font-headline text-3xl font-bold tracking-tight text-foreground sm:text-4xl">{product.name}</h1>
              <p className="text-lg text-muted-foreground">{product.description}</p>
              
              {product.specifications && product.specifications.length > 0 && (
                <div>
                  <h2 className="font-semibold text-xl mb-3">Specifications:</h2>
                  <ul className="space-y-2 text-muted-foreground list-disc list-inside">
                    {product.specifications.map((spec, i) => (
                      <li key={i}>
                        <span className="font-medium text-foreground">{spec.key}:</span> {spec.value}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {product.varieties && product.varieties.length > 0 && (
                <div>
                  <h2 className="font-semibold text-xl mb-3">Available Varieties:</h2>
                  <div className="flex flex-wrap gap-2">
                    {product.varieties.map((variety) => (
                      <Badge key={variety} variant="secondary" className="text-base">{variety}</Badge>
                    ))}
                  </div>
                </div>
              )}

              {product.certifications && product.certifications.length > 0 && (
                <div>
                  <h2 className="font-semibold text-xl mb-3">Certifications:</h2>
                  <div className="flex flex-wrap gap-2">
                    {product.certifications.map((cert) => (
                      <Badge key={cert} className="bg-green-100 text-green-800 border-green-200 text-base hover:bg-green-200">
                        <CheckCircle2 className="h-4 w-4 mr-1.5"/>
                        {cert}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              <div className="pt-6">
                <Button asChild size="lg" style={{ backgroundColor: 'hsl(var(--accent))', color: 'hsl(var(--accent-foreground))' }} className="w-full sm:w-auto">
                    <Link href="/contact">Request a Quote</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
    </>
  );
}

export async function generateStaticParams() {
  const products = await getProducts();
 
  return products.map((product) => ({
    productName: product.name.toLowerCase().replace(/\s+/g, '-'),
  }));
}
