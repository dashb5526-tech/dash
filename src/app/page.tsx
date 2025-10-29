
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Hero } from "@/components/sections/hero";
import { Gallery } from "@/components/sections/gallery";
import { Products } from "@/components/sections/products";
import { About } from "@/components/sections/about";
import { Certificates } from "@/components/sections/certificates";

export default function Home() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Header />
      <main className="flex-1">
        <Hero />
        <About />
        <Products isHomePage={true} />
        <Certificates />
        <Gallery />
      </main>
      <Footer />
    </div>
  );
}
