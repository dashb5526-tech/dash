"use client";

import Image from "next/image";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { getProducts, Product } from "@/lib/products";
import Link from "next/link";
import { useEffect, useState } from "react";

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

        <div className="mt-16 grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
          {products.map((product) => {
            const imageSrc = product.imageUrl || PlaceHolderImages.find(p => p.id === product.imageId)?.imageUrl;
            const imageHint = product.imageUrl ? undefined : PlaceHolderImages.find(p => p.id === product.imageId)?.imageHint;
            return (
              <Card key={product.name} className="flex flex-col overflow-hidden transition-shadow duration-300 hover:shadow-xl">
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
                <CardHeader>
                  <CardTitle className="font-headline text-xl">{product.name}</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-1 flex-col">
                  <CardDescription className="flex-1">{product.description}</CardDescription>
                  <div className="mt-6">
                    <Button asChild variant="outline" className="w-full border-accent text-accent hover:bg-accent hover:text-accent-foreground">
                        <Link href="/contact">Inquire for Pricing</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
