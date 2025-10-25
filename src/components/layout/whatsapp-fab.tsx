
"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getContactInfo, ContactInfo } from '@/lib/contact-info';
import { cn } from '@/lib/utils';

function WhatsAppIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 32 32"
            {...props}
        >
           <path d=" M19.11 17.205c-.372 0-1.088 1.39-1.518 1.39a.63.63 0 0 1-.315-.1c-.802-.402-1.504-.817-2.163-1.447-.545-.516-1.146-1.29-1.46-1.963a.426.426 0 0 1-.073-.215c0-.33.99-.945.99-1.49 0-.143-.73-2.09-.832-2.335-.143-.372-.214-.487-.6-.487-.187 0-.36-.044-.53-.044a.765.765 0 0 0-.51.235c-.413.413-.63.952-.63 1.603 0 .612.315 1.164.43 1.36.114.198 1.088 1.67 2.63 2.75.586.413 1.043.645 1.46.826.412.18 1.15.142 1.58.05.49-.107 1.424-1.13 1.62-1.49.192-.358.192-.51.05-.51-.13-.044-1.088-.516-1.24-.516z M16 .05C7.16.05 0 7.21 0 16.05c0 4.842 2.15 9.143 5.586 11.96l-1.53 5.454 5.586-1.517c2.67.143 5.463-.645 8-2.32 8.842-8.842 8.842-23.232 0-32.073z M16 29.832c-2.45 0-4.813-.886-6.685-2.4l-.477-.42-4.96 1.34.94-4.662-.42-.49c-1.68-1.96-2.58-4.4-2.58-7.06 0-7.27 5.9-13.17 13.17-13.17 3.53 0 6.76 1.358 9.3 3.9 2.54 2.54 3.9 5.77 3.9 9.3 0 7.27-5.9 13.17-13.17 13.17z" fill="currentColor"></path>
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

    if (!contactInfo || !contactInfo.whatsappNumber) {
        return null;
    }

    const phoneNumber = contactInfo.whatsappNumber.replace(/\D/g, '');
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
