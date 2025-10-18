import Link from "next/link";
import { RiceBowl } from "@/components/icons";

const sections = [
  { name: "About Us", href: "#about" },
  { name: "Products", href: "#products" },
  { name: "Gallery", href: "#gallery" },
  { name: "Contact", href: "#contact" },
];

export function Footer() {
  return (
    <footer className="bg-secondary text-secondary-foreground">
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between space-y-6 md:flex-row md:space-y-0">
          <div className="flex items-center space-x-2">
            <RiceBowl className="h-8 w-8 text-primary" />
            <span className="font-headline text-2xl font-semibold">
              Dash Rice Traders
            </span>
          </div>
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
          <p>&copy; {new Date().getFullYear()} Dash Rice Traders. All rights reserved.</p>
          <p className="mt-1">
            Cuttack, Odisha, India | +91 98765 43210 | dashricetraders@gmail.com
          </p>
        </div>
      </div>
    </footer>
  );
}
