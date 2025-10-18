
"use client";

import Image from 'next/image';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useEffect, useState } from 'react';
import { getTestimonials, Testimonial } from '@/lib/testimonials';

const partnerLogos = PlaceHolderImages.filter(p => p.id.startsWith('partner-logo-'));

export function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

  useEffect(() => {
    getTestimonials().then(setTestimonials);
  }, []);

  return (
    <section id="testimonials" className="bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-headline text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Trusted by the Best
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Hear what our valued clients have to say about our products and services.
          </p>
        </div>

        <div className="mt-16">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent>
              {testimonials.map((testimonial, index) => (
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                  <div className="p-1">
                    <Card className="h-full">
                      <CardContent className="flex h-full flex-col items-center justify-center p-6 text-center">
                        <div className="flex text-accent">
                          {[...Array(5)].map((_, i) => <Star key={i} className="h-5 w-5 fill-current" />)}
                        </div>
                        <p className="mt-4 flex-1 text-muted-foreground">"{testimonial.quote}"</p>
                        <div className="mt-4">
                          <p className="font-semibold text-foreground">{testimonial.name}</p>
                          <p className="text-sm text-muted-foreground">{testimonial.title}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
        
        <div className="mt-24">
          <h3 className="text-center text-lg font-semibold text-muted-foreground">
            Our Proud Partners
          </h3>
          <div className="mt-8 flow-root">
            <div className="-mt-4 -ml-8 flex flex-wrap justify-center lg:-ml-4">
              {partnerLogos.map((logo) => (
                <div key={logo.id} className="mt-4 ml-8 flex flex-shrink-0 flex-grow justify-center lg:ml-4 lg:flex-grow-0">
                  <Image
                    className="h-12 object-contain"
                    src={logo.imageUrl}
                    alt={logo.description}
                    width={158}
                    height={48}
                    data-ai-hint={logo.imageHint}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
