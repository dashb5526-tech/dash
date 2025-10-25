

"use client";

import Link from "next/link";
import Image from "next/image";
import { RiceBowl, XIcon } from "@/components/icons";
import { useEffect, useState } from "react";
import { getContactInfo, ContactInfo } from "@/lib/contact-info";
import { getHomeContent, HomeContent } from "@/lib/home";
import { getSocialLinks, SocialLink } from "@/lib/social-links";
import { Facebook, Instagram, Linkedin } from "lucide-react";

const sections = [
  { name: "Home", href: "/" },
  { name: "About Us", href: "/about" },
  { name: "Products", href: "/products" },
  { name: "Gallery", href: "/#gallery" },
  { name: "Contact", href: "/contact" },
];

const socialIconMap: { [key: string]: React.ReactNode } = {
  Facebook: <Facebook className="h-5 w-5" />,
  X: <XIcon className="h-5 w-5" />,
  Instagram: <Instagram className="h-5 w-5" />,
  Linkedin: <Linkedin className="h-5 w-5" />,
};

export function Footer() {
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  const [homeContent, setHomeContent] = useState<HomeContent | null>(null);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);

  useEffect(() => {
    getContactInfo().then(setContactInfo);
    getHomeContent().then(setHomeContent);
    getSocialLinks().then(setSocialLinks);
  }, []);

  return (
    <footer className="bg-secondary text-secondary-foreground">
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div>
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
             <p className="mt-4 text-sm text-muted-foreground">
              A trusted rice trading and distribution company providing high-quality rice varieties.
            </p>
            <div className="mt-6 flex space-x-4">
              {socialLinks.map((link) => (
                <Link key={link.id} href={link.url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
                  {socialIconMap[link.icon]}
                  <span className="sr-only">{link.name}</span>
                </Link>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-8 lg:col-span-2 lg:grid-cols-3">
            <div>
              <p className="font-semibold text-foreground">Company</p>
              <nav className="mt-4 flex flex-col space-y-2">
                {sections.map((section) => (
                  <Link
                    key={section.name}
                    href={section.href}
                    className="text-sm text-muted-foreground hover:text-primary hover:underline"
                  >
                    {section.name}
                  </Link>
                ))}
              </nav>
            </div>
            <div>
              <p className="font-semibold text-foreground">Contact</p>
              {contactInfo && (
                <div className="mt-4 space-y-2 text-sm text-muted-foreground">
                  <p>{contactInfo.address}</p>
                  <p>{contactInfo.phone}</p>
                  <p>{contactInfo.email}</p>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-border pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} {homeContent?.brand.name || "Dash Rice Traders"}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
