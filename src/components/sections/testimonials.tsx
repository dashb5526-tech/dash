import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Star } from 'lucide-react';

const testimonials = [
  {
    quote: "Dash Rice Traders has been our most reliable supplier. Their Basmati rice is exceptional and our customers love it. Consistently high quality and always on time.",
    name: "Priya Sharma",
    title: "Owner, Spice Route Restaurant",
  },
  {
    quote: "We switched to Dash Rice for our hotel chain's bulk needs and couldn't be happier. The pricing is competitive, and the quality of their Sona Masoori is unmatched.",
    name: "Rajesh Kumar",
    title: "Procurement Manager, Grand Hotels Group",
  },
  {
    quote: "As a retailer, freshness and purity are key. Dash Rice delivers on both fronts. Their direct farm sourcing makes a noticeable difference. Highly recommended!",
    name: "Anita Desai",
    title: "Proprietor, Fresh Mart",
  },
];

const partnerLogos = PlaceHolderImages.filter(p => p.id.startsWith('partner-logo-'));

export function Testimonials() {
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
