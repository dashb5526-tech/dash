import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, Truck, Globe, Award } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const services = [
  {
    icon: <Truck className="h-8 w-8 text-accent" />,
    title: 'Bulk Rice Supply',
    description: 'Reliable supply to wholesalers, retailers, and hotels with consistent quality.',
  },
  {
    icon: <Package className="h-8 w-8 text-accent" />,
    title: 'Custom Packaging',
    description: 'Packaging and branding services for custom orders to meet your market needs.',
  },
  {
    icon: <Globe className="h-8 w-8 text-accent" />,
    title: 'Nationwide Delivery',
    description: 'Efficient local and national delivery network ensuring timely supply.',
  },
  {
    icon: <Award className="h-8 w-8 text-accent" />,
    title: 'Export Quality',
    description: 'Premium, export-quality rice for our international clients across the globe.',
  },
];

const aboutImage = PlaceHolderImages.find(p => p.id === 'about');

export function About() {
  return (
    <section id="about" className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
        <div className="space-y-6">
          <h2 className="font-headline text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            A Legacy of Quality Rice
          </h2>
          <p className="text-lg text-muted-foreground">
            Dash Rice Traders is a trusted rice trading and distribution company rooted in the rich agricultural heritage of India. We are dedicated to providing high-quality rice varieties, including Basmati, Sona Masoori, and Parboiled rice.
          </p>
          <p className="text-lg text-muted-foreground">
            Our strength lies in sourcing directly from a network of dedicated farmers, ensuring that every grain is 100% pure and fresh. We deliver this quality to wholesalers, retailers, and households, building relationships based on trust and excellence.
          </p>
        </div>
        <div className="flex items-center justify-center">
            {aboutImage && (
                <Image
                    src={aboutImage.imageUrl}
                    alt={aboutImage.description}
                    width={600}
                    height={400}
                    className="rounded-lg object-cover shadow-lg"
                    data-ai-hint={aboutImage.imageHint}
                />
            )}
        </div>
      </div>

      <div className="mt-16 sm:mt-20">
        <h3 className="font-headline text-center text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          Our Services
        </h3>
        <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service) => (
            <Card key={service.title} className="text-center">
              <CardHeader>
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  {service.icon}
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
