"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getContactInfo, ContactInfo } from '@/lib/contact-info';
import { cn } from '@/lib/utils';

function WhatsAppIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            {...props}
        >
            <path
                d="M16.75 13.96c.25.25.25.66 0 .91l-1.5 1.5c-.25.25-.66.25-.91 0s-.25-.66 0-.91l1.5-1.5c.25-.25.66-.25.91 0z"
                fill="currentColor"
            />
            <path
                d="M19.34 4.66a10.4 10.4 0 00-14.68 0 10.4 10.4 0 000 14.68A10.4 10.4 0 0012 22.4a10.34 10.34 0 007.34-3.06l1.59-1.59a.63.63 0 00-.9-.9L18.4 18.4a8.42 8.42 0 01-11.88 0 8.42 8.42 0 010-11.88 8.42 8.42 0 0111.88 0l3.06 3.06a.63.63 0 00.9-.9zM12 20.4a8.4 8.4 0 110-16.8 8.4 8.4 0 010 16.8z"
                fill="currentColor"
            />
            <path
                d="M12.01 6.55a5.45 5.45 0 00-5.45 5.45 5.34 5.34 0 001.5 3.82l-1 3.56a.64.64 0 00.81.8l3.58-1a5.45 5.45 0 005.45-5.45 5.47 5.47 0 00-5.39-5.43zm3.5 6.84a1.35 1.35 0 01-1.92.5l-1-1.12a.63.63 0 00-.77-.13l-1.39.7a.64.64 0 01-.6-.24 2.83 2.83 0 01-.6-1.56.63.63 0 01.63-.63h1.25a.63.63 0 100-1.25H9.88a.63.63 0 010-1.25h.44a.63.63 0 100-1.25h-.44a.63.63 0 01-.63-.63 2.79 2.79 0 011.51-2.48.63.63 0 01.7.1l.73.73a.63.63 0 00.9 0l1.45-1.45a.63.63 0 01.9 0 2.82 2.82 0 010 4 .63.63 0 01-.9 0l-1.45-1.45a.63.63 0 00-.9 0L12.5 9.7a.63.63 0 000 .9l1.12 1.12a1.35 1.35 0 01.5 1.92.63.63 0 00.24.6l.7 1.39a.63.63 0 00.13.77z"
                fill="currentColor"
            />
        </svg>
    )
}

export function WhatsAppFAB() {
    const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        getContactInfo().then(setContactInfo);

        const toggleVisibility = () => {
            if (window.pageYOffset > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener('scroll', toggleVisibility);

        return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);

    if (!contactInfo || !contactInfo.phone) {
        return null;
    }

    const phoneNumber = contactInfo.phone.replace(/\D/g, '');
    const whatsappUrl = `https://wa.me/${phoneNumber}`;

    return (
        <Link 
            href={whatsappUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className={cn(
                "fixed bottom-6 right-6 z-50 flex h-16 w-16 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-opacity duration-300 hover:bg-[#128C7E]",
                isVisible ? 'opacity-100' : 'opacity-0'
            )}
            aria-label="Chat on WhatsApp"
        >
            <WhatsAppIcon className="h-8 w-8" />
        </Link>
    );
}
