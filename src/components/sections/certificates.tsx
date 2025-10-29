"use client";

import Image from 'next/image';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useEffect, useRef, useState } from 'react';
import { getCertificates, Certificate } from '@/lib/certificates';
import Autoplay from "embla-carousel-autoplay";

export function Certificates() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const plugin = useRef(
    Autoplay({ delay: 4000, stopOnInteraction: true })
  );

  useEffect(() => {
    getCertificates().then(setCertificates);
  }, []);

  if (certificates.length === 0) {
    return null; // Don't render the section if there are no certificates
  }

  return (
    <section id="certificates" className="bg-secondary">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-headline text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Our Certifications
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            We are committed to quality and safety, backed by industry-standard certifications.
          </p>
        </div>

        <div className="mt-16">
          <Carousel
            plugins={[plugin.current]}
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
            onMouseEnter={plugin.current.stop}
            onMouseLeave={plugin.current.reset}
          >
            <CarouselContent>
              {certificates.map((cert) => (
                <CarouselItem key={cert.id} className="sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
                  <div className="p-2">
                    <Card className="overflow-hidden">
                      <CardContent className="p-0">
                         <div className="relative aspect-[4/3] w-full">
                            <Image
                                src={cert.imageUrl}
                                alt={cert.name}
                                fill
                                className="object-contain p-4"
                            />
                        </div>
                      </CardContent>
                      <CardHeader className="p-4 pt-0 text-center">
                        <CardTitle className="font-headline text-lg">{cert.name}</CardTitle>
                      </CardHeader>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-2 sm:-left-12"/>
            <CarouselNext className="right-2 sm:-right-12"/>
          </Carousel>
        </div>
      </div>
    </section>
  );
}

    