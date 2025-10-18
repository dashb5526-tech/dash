
"use client";

import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, Truck, Globe, Award } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getAboutContent, AboutContent, Service } from '@/lib/about';

const iconMap: { [key: string]: React.ReactNode } = {
  Truck: <Truck className="h-8 w-8 text-accent" />,
  Package: <Package className="h-8 w-8 text-accent" />,
  Globe: <Globe className="h-8 w-8 text-accent" />,
  Award: <Award className="h-8 w-8 text-accent" />,
};

export function About() {
  const [content, setContent] = useState<AboutContent | null>(null);

  useEffect(() => {
    getAboutContent().then(setContent);
  }, []);

  if (!content) {
    return (
        <section id="about" className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">Loading...</div>
        </section>
    );
  }
  
  const { main, services } = content;

  return (
    <section id="about" className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
        <div className="space-y-6">
          <h2 className="font-headline text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {main.title}
          </h2>
          <p className="text-lg text-muted-foreground">
            {main.paragraph1}
          </p>
          <p className="text-lg text-muted-foreground">
            {main.paragraph2}
          </p>
        </div>
        <div className="flex items-center justify-center">
            {main.imageUrl && (
                <Image
                    src={main.imageUrl}
                    alt={main.title}
                    width={600}
                    height={400}
                    className="rounded-lg object-cover shadow-lg"
                    data-ai-hint={main.imageHint}
                />
            )}
        </div>
      </div>

      <div className="mt-16 sm:mt-20">
        <h3 className="font-headline text-center text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          {services.title}
        </h3>
        <div className="mt-10 grid grid-cols-2 gap-4 sm:gap-8 lg:grid-cols-4">
          {services.items.map((service) => (
            <Card key={service.id} className="text-center">
              <CardHeader>
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  {iconMap[service.icon]}
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <CardTitle className="font-headline text-xl">{service.title}</CardTitle>
                <p className="text-muted-foreground">{service.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
