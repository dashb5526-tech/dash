

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
      <Link href={productUrl}>
        {imageSrc && (
            <div className="relative h-56 w-full">
              <Image
                src={imageSrc}
                alt={product.name}
                fill
                className="object-cover"
                data-ai-hint={imageHint}
              />
            </div>
          )}
      </Link>
      <div className="p-4 flex flex-col flex-1">
        <CardHeader className="p-0">
          <CardTitle className="font-headline text-xl">
             <Link href={productUrl} className="hover:text-primary transition-colors">
                {product.name}
              </Link>
          </CardTitle>
          <CardDescription className="pt-2">
            {product.description}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0 pt-4 flex-1 flex flex-col gap-4">
           {product.specifications && product.specifications.length > 0 && (
                <div>
                  <h3 className="font-semibold text-base mb-2">Specifications:</h3>
                  <ul className="space-y-1 text-sm text-muted-foreground list-disc list-inside">
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
                  <h3 className="font-semibold text-base mb-2">Available Varieties:</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.varieties.map((variety) => (
                      <Badge key={variety} variant="secondary">{variety}</Badge>
                    ))}
                  </div>
                </div>
              )}

              {product.certifications && product.certifications.length > 0 && (
                <div>
                  <h3 className="font-semibold text-base mb-2">Certifications:</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.certifications.map((cert) => (
                      <Badge key={cert} className="bg-green-100 text-green-800 border-green-200 hover:bg-green-200">
                        <CheckCircle2 className="h-3.5 w-3.5 mr-1"/>
                        {cert}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
        </CardContent>
        <div className="!mt-auto pt-4">
          <Button asChild className="w-full" style={{ backgroundColor: 'hsl(var(--accent))', color: 'hsl(var(--accent-foreground))' }}>
              <Link href="/contact">Request a Quote</Link>
          </Button>
        </div>
      </div>
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

  const displayedProducts = isHomePage ? products.slice(0, 3) : products;

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

        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {displayedProducts.map((product) => (
            <ProductCard key={product.name} product={product} />
          ))}
        </div>
        {isHomePage && products.length > 3 && (
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
