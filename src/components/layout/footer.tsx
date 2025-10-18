
"use client";

import Link from "next/link";
import Image from "next/image";
import { RiceBowl } from "@/components/icons";
import { useEffect, useState } from "react";
import { getContactInfo, ContactInfo } from "@/lib/contact-info";
import { getHomeContent, HomeContent } from "@/lib/home";

const sections = [
  { name: "Home", href: "/" },
  { name: "About Us", href: "/about" },
  { name: "Products", href: "/products" },
  { name: "Gallery", href: "/#gallery" },
  { name: "Contact", href: "/contact" },
];

export function Footer() {
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  const [homeContent, setHomeContent] = useState<HomeContent | null>(null);

  useEffect(() => {
    getContactInfo().then(setContactInfo);
    getHomeContent().then(setHomeContent);
  }, []);

  return (
    <footer className="bg-secondary text-secondary-foreground">
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between space-y-6 md:flex-row md:space-y-0">
          <Link href="/" className="flex items-center gap-2">
            {homeContent?.brand.logoUrl ? (
                <Image src={homeContent.brand.logoUrl} alt={homeContent.brand.name} width={32} height={32} className="h-8 w-auto object-contain" />
            ) : (
                <RiceBowl className="h-8 w-8 text-primary" />
            )}
            <span className="font-headline text-2xl font-semibold">
              {homeContent?.brand.name || "Dash Rice Traders"}
            </span>
          </Link>
          <nav className="flex flex-wrap justify-center gap-4 sm:gap-6">
            {sections.map((section) => (
              <Link
                key={section.name}
                href={section.href}
                className="text-sm font-medium hover:text-primary hover:underline"
              >
                {section.name}
              </Link>
            ))}
          </nav>
        </div>
        <div className="mt-8 border-t border-border pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} {homeContent?.brand.name || "Dash Rice Traders"}. All rights reserved.</p>
          {contactInfo && (
            <p className="mt-1">
              {contactInfo.address} | {contactInfo.phone} | {contactInfo.email}
            </p>
          )}
        </div>
      </div>
    </footer>
  );
}
