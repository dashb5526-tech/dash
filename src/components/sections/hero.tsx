import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const heroImage = PlaceHolderImages.find(p => p.id === 'hero');

export function Hero() {
  return (
    <section id="home" className="relative h-[80vh] min-h-[600px] w-full">
      {heroImage && (
        <Image
          src={heroImage.imageUrl}
          alt={heroImage.description}
          fill
          className="object-cover"
          priority
          data-ai-hint={heroImage.imageHint}
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/20" />
      <div className="relative z-10 flex h-full items-center justify-center text-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <h1 className="font-headline text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              From Our Farms to Your Table
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-200 sm:text-xl">
              Dash Rice Traders: Delivering pure, fresh, and trusted quality rice, sourced directly from the heart of India&apos;s farmlands.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <Link href="/products">View Our Products</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-accent text-accent hover:bg-accent hover:text-accent-foreground">
                <Link href="/contact">Contact Us</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
