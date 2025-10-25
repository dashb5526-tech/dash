

"use client";

import Image from "next/image";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { getProducts, Product } from "@/lib/products";
import Link from "next/link";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2 } from "lucide-react";

function ProductCard({ product }: { product: Product }) {
  const imageSrc = product.imageUrl || PlaceHolderImages.find(p => p.id === product.imageId)?.imageUrl;
  const imageHint = product.imageUrl ? undefined : PlaceHolderImages.find(p => p.id === product.imageId)?.imageHint;

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
        <CardTitle className="font-headline text-base sm:text-xl line-clamp-2">{product.name}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col p-2 pt-0 sm:p-4 sm:pt-0 space-y-4">
        <CardDescription className="text-xs sm:text-sm">
          {product.description}
        </CardDescription>

        {product.specifications && product.specifications.length > 0 && (
          <div>
            <h4 className="font-semibold text-sm mb-2">Specifications:</h4>
            <ul className="space-y-1 text-xs text-muted-foreground list-disc list-inside">
              {product.specifications.map((spec, i) => (
                <li key={i}>
                  <span className="font-medium text-foreground/80">{spec.key}:</span> {spec.value}
                </li>
              ))}
            </ul>
          </div>
        )}

        {product.varieties && product.varieties.length > 0 && (
          <div>
            <h4 className="font-semibold text-sm mb-2">Available Varieties:</h4>
            <div className="flex flex-wrap gap-2">
              {product.varieties.map((variety) => (
                <Badge key={variety} variant="secondary" className="text-xs">{variety}</Badge>
              ))}
            </div>
          </div>
        )}

        {product.certifications && product.certifications.length > 0 && (
          <div>
            <h4 className="font-semibold text-sm mb-2">Certifications:</h4>
            <div className="flex flex-wrap gap-2">
              {product.certifications.map((cert) => (
                <Badge key={cert} className="bg-green-100 text-green-800 border-green-200 text-xs hover:bg-green-200">
                  <CheckCircle2 className="h-3 w-3 mr-1"/>
                  {cert}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <div className="!mt-auto pt-4">
          <Button asChild variant="outline" size="sm" className="w-full border-accent text-accent hover:bg-accent hover:text-accent-foreground">
              <Link href="/contact">Request Quote</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export function Products() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    getProducts().then(setProducts);
  }, []);
  return (
    <section id="products" className="bg-secondary py-16 sm:py-20 lg:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-headline text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Our Premium Rice Selection
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            We offer a diverse range of high-quality rice to meet the needs of every customer, from households to large-scale businesses.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.name} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
