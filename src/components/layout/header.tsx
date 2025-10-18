"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { RiceBowl } from "@/components/icons";
import { cn } from "@/lib/utils";

const sections = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Products", href: "/products" },
  { name: "Gallery", href: "/#gallery" },
  { name: "Testimonials", href: "/#testimonials" },
  { name: "Contact", href: "/contact" },
];

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        isScrolled
          ? "border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
          : "bg-transparent"
      )}
    >
      <div className="container mx-auto flex h-20 items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <RiceBowl className="h-8 w-8 text-primary" />
          <span className="font-headline text-2xl font-bold text-foreground">
            Dash Rice
          </span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {sections.map((section) => (
            <Link
              key={section.name}
              href={section.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              {section.name}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
           <Button asChild className="hidden md:inline-flex" style={{ backgroundColor: 'hsl(var(--accent))', color: 'hsl(var(--accent-foreground))' }}>
            <Link href="/contact">Order Now</Link>
          </Button>

          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <div className="flex h-full flex-col">
                <div className="flex items-center justify-between border-b pb-4">
                  <Link href="/" className="flex items-center gap-2" onClick={() => setIsMobileMenuOpen(false)}>
                    <RiceBowl className="h-8 w-8 text-primary" />
                    <span className="font-headline text-xl font-bold text-foreground">
                      Dash Rice Traders
                    </span>
                  </Link>
                  <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)}>
                     <X className="h-6 w-6" />
                     <span className="sr-only">Close menu</span>
                  </Button>
                </div>
                <nav className="mt-8 flex flex-1 flex-col gap-6">
                  {sections.map((section) => (
                    <Link
                      key={section.name}
                      href={section.href}
                      className="text-lg font-medium text-foreground transition-colors hover:text-primary"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {section.name}
                    </Link>
                  ))}
                </nav>
                <Button asChild className="w-full" size="lg" style={{ backgroundColor: 'hsl(var(--accent))', color: 'hsl(var(--accent-foreground))' }}>
                  <Link href="/contact" onClick={() => setIsMobileMenuOpen(false)}>Order Now</Link>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
