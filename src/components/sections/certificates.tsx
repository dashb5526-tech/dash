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
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogClose } from '@/components/ui/dialog';
import { useEffect, useRef, useState, WheelEvent } from 'react';
import { getCertificates, Certificate } from '@/lib/certificates';
import { getCertificatesSection, CertificatesSection } from '@/lib/certificates-section';
import Autoplay from "embla-carousel-autoplay";
import { X, ZoomIn, ZoomOut } from "lucide-react";

function CertificateLightbox({
  isOpen,
  setIsOpen,
  imageUrl,
  imageName,
}: {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  imageUrl: string;
  imageName: string;
}) {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Reset zoom and position when the dialog opens
    if (isOpen) {
      setScale(1);
      setPosition({ x: 0, y: 0 });
    }
  }, [isOpen]);

  const handleWheel = (e: WheelEvent) => {
    e.preventDefault();
    const newScale = Math.max(1, Math.min(scale - e.deltaY * 0.001, 5));
    setScale(newScale);

    if (newScale === 1) {
        setPosition({ x: 0, y: 0 });
    }
  };

  const handleZoomIn = () => {
    setScale(prev => Math.min(prev + 0.2, 5));
  };
  
  const handleZoomOut = () => {
    const newScale = Math.max(scale - 0.2, 1);
    setScale(newScale);
     if (newScale === 1) {
        setPosition({ x: 0, y: 0 });
    }
  };

  const handleDragStart = (e: React.MouseEvent<HTMLImageElement>) => {
    if (scale <= 1) return;
    e.preventDefault();
    const startX = e.pageX - position.x;
    const startY = e.pageY - position.y;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const newX = moveEvent.pageX - startX;
      const newY = moveEvent.pageY - startY;

      // Restrict movement within boundaries
      if (imgRef.current && containerRef.current) {
        const imgRect = imgRef.current.getBoundingClientRect();
        const containerRect = containerRef.current.getBoundingClientRect();

        const maxX = (imgRect.width - containerRect.width) / 2;
        const maxY = (imgRect.height - containerRect.height) / 2;

        const boundedX = Math.max(-maxX, Math.min(newX, maxX));
        const boundedY = Math.max(-maxY, Math.min(newY, maxY));
        
        setPosition({ x: boundedX, y: boundedY });
      } else {
        setPosition({ x: newX, y: newY });
      }
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent 
        className="max-w-5xl w-full h-[90vh] bg-transparent border-none shadow-none flex items-center justify-center p-0"
        onWheel={handleWheel}
      >
        <div ref={containerRef} className="relative w-full h-full flex items-center justify-center overflow-hidden">
            <Image
                ref={imgRef}
                src={imageUrl}
                alt={imageName}
                fill
                className="object-contain cursor-grab"
                style={{
                  transform: `scale(${scale}) translateX(${position.x}px) translateY(${position.y}px)`,
                  transition: 'transform 0.2s ease-out',
                }}
                onMouseDown={handleDragStart}
            />
        </div>
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 rounded-full bg-background/80 p-2 shadow-md">
            <Button variant="ghost" size="icon" onClick={handleZoomOut} disabled={scale <= 1}><ZoomOut/></Button>
            <Button variant="ghost" size="icon" onClick={handleZoomIn} disabled={scale >= 5}><ZoomIn/></Button>
        </div>
        <DialogClose className="absolute right-4 top-4 rounded-full p-2 bg-background/80 opacity-100 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
          <X className="h-6 w-6" />
          <span className="sr-only">Close</span>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}

export function Certificates() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [sectionContent, setSectionContent] = useState<CertificatesSection | null>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<{url: string, name: string} | null>(null);
  
  const plugin = useRef(
    Autoplay({ delay: 4000, stopOnInteraction: true })
  );

  useEffect(() => {
    getCertificates().then(setCertificates);
    getCertificatesSection().then(setSectionContent);
  }, []);
  
  const openLightbox = (cert: Certificate) => {
    setSelectedImage({ url: cert.imageUrl, name: cert.name });
    setLightboxOpen(true);
  }

  if (certificates.length === 0) {
    return null; // Don't render the section if there are no certificates
  }

  return (
    <>
    <section id="certificates" className="bg-secondary">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-headline text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {sectionContent?.title || "Our Certifications"}
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            {sectionContent?.description || "We are committed to quality and safety, backed by industry-standard certifications."}
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
                         <button type="button" onClick={() => openLightbox(cert)} className="relative aspect-[4/3] w-full block">
                            <Image
                                src={cert.imageUrl}
                                alt={cert.name}
                                fill
                                className="object-contain p-4 transition-transform duration-300 hover:scale-105"
                            />
                        </button>
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
    {selectedImage && (
        <CertificateLightbox 
          isOpen={lightboxOpen}
          setIsOpen={setLightboxOpen}
          imageUrl={selectedImage.url}
          imageName={selectedImage.name}
        />
    )}
    </>
  );
}