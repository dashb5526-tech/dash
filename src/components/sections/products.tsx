import Image from "next/image";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import Link from "next/link";

export const products = [
  {
    name: "Premium Basmati Rice",
    description: "Long, slender grains with a distinct aroma and fluffy texture. Perfect for biryani and pulao.",
    imageId: "basmati-grain"
  },
  {
    name: "Sona Masoori Rice",
    description: "Lightweight and aromatic medium-grain rice. Ideal for everyday meals and South Indian dishes.",
    imageId: "sona-masoori-grain"
  },
  {
    name: "Parboiled Rice",
    description: "Partially boiled in the husk, which helps lock in nutrients. Firm texture and separate grains after cooking.",
    imageId: "parboiled-grain"
  },
  {
    name: "Brown Rice",
    description: "Whole-grain rice with the outer bran layer intact, offering a nutty flavor and higher fiber content.",
    imageId: "brown-rice-grain"
  },
  {
    name: "Broken Rice (Wholesale)",
    description: "Fragments of rice grains, broken during processing. An economical choice for various dishes and industries.",
    imageId: "broken-rice-grain"
  },
];

export function Products() {
  return (
    <section id="products" className="bg-secondary">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-headline text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Our Premium Rice Selection
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            We offer a diverse range of high-quality rice to meet the needs of every customer, from households to large-scale businesses.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
          {products.map((product) => {
            const image = PlaceHolderImages.find(p => p.id === product.imageId);
            return (
              <Card key={product.name} className="flex flex-col overflow-hidden transition-shadow duration-300 hover:shadow-xl">
                {image && (
                   <div className="relative h-56 w-full">
                     <Image
                       src={image.imageUrl}
                       alt={product.name}
                       fill
                       className="object-cover"
                       data-ai-hint={image.imageHint}
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
                       <Link href="#contact">Inquire for Pricing</Link>
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
