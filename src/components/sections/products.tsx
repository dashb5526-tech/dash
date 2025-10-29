

"use client";

import Image from "next/image";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { getProducts, Product } from "@/lib/products";
import { getProductsSection, ProductsSection } from "@/lib/products-section";
import Link from "next/link";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2 } from "lucide-react";

function ProductCard({ product }: { product: Product }) {
  const imageSrc = product.imageUrl || PlaceHolderImages.find(p => p.id === product.imageId)?.imageUrl;
  const imageHint = product.imageUrl ? undefined : PlaceHolderImages.find(p => p.id === product.imageId)?.imageHint;
  const productUrl = `/products/${encodeURIComponent(product.name.toLowerCase().replace(/\s+/g, '-'))}`;

  return (
    <Card className="flex flex-col overflow-hidden transition-shadow duration-300 hover:shadow-xl">
      {imageSrc && (
          <div className="relative h-32 sm:h-56 w-full">
            <Image
              src={imageSrc}
              alt={product.name}
              fill
              className="object-cover"
              data-ai-hint={imageHint}
            />
          </div>
        )}
      <CardHeader className="p-2 sm:p-4">
        <CardTitle className="font-headline text-base sm:text-xl line-clamp-2">
          <Link href={productUrl} className="hover:text-primary transition-colors">
            {product.name}
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col p-2 pt-0 sm:p-4 sm:pt-0 space-y-4">
        <CardDescription className="text-xs sm:text-sm line-clamp-3">
          {product.description}
        </CardDescription>

        <div className="!mt-auto pt-4 flex flex-col sm:flex-row gap-2">
          <Button asChild className="w-full" style={{ backgroundColor: 'hsl(var(--accent))', color: 'hsl(var(--accent-foreground))' }}>
              <Link href={productUrl}>View Details</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export function Products({ isHomePage = false }: { isHomePage?: boolean }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [sectionContent, setSectionContent] = useState<ProductsSection | null>(null);

  useEffect(() => {
    getProducts().then(setProducts);
    getProductsSection().then(setSectionContent);
  }, []);

  const displayedProducts = isHomePage ? products.slice(0, 4) : products;

  return (
    <section id="products" className="bg-secondary py-16 sm:py-20 lg:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-headline text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {sectionContent?.title || "Our Premium Rice Selection"}
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            {sectionContent?.description || "We offer a diverse range of high-quality rice to meet the needs of every customer, from households to large-scale businesses."}
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {displayedProducts.map((product) => (
            <ProductCard key={product.name} product={product} />
          ))}
        </div>
        {isHomePage && products.length > 4 && (
          <div className="mt-16 text-center">
            <Button asChild size="lg" style={{ backgroundColor: 'hsl(var(--accent))', color: 'hsl(var(--accent-foreground))' }}>
              <Link href="/products">See All Products</Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
