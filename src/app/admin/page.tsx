

"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { getProducts, saveProducts, Product } from "@/lib/products";
import { getGalleryContent, saveGalleryContent, GalleryContent, GalleryImage } from "@/lib/gallery";
import { getTestimonials, saveTestimonials, Testimonial } from "@/lib/testimonials";
import { getPartners, savePartners, Partner } from "@/lib/partners";
import { getAboutContent, saveAboutContent, AboutContent } from "@/lib/about";
import { getContactInfo, saveContactInfo, ContactInfo } from "@/lib/contact-info";
import { getHomeContent, saveHomeContent, HomeContent } from "@/lib/home";
import { getSocialLinks, saveSocialLinks, SocialLink } from "@/lib/social-links";
import { getProductsSection, saveProductsSection, ProductsSection } from "@/lib/products-section";
import { getTestimonialsSection, saveTestimonialsSection, TestimonialsSection } from "@/lib/testimonials-section";
import { getContactSection, saveContactSection, ContactSection } from "@/lib/contact-section";
import { getTermsContent, saveTermsContent, TermsContent } from "@/lib/terms";
import { getCertificates, saveCertificates, Certificate } from "@/lib/certificates";
import Image from 'next/image';
import { useToast } from "@/hooks/use-toast";
import { PlusCircle, Edit, Trash2, Star, Facebook, Instagram, Linkedin } from "lucide-react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { XIcon } from "@/components/icons";


const iconMap: { [key: string]: React.ReactNode } = {
    Facebook: <Facebook className="h-5 w-5" />,
    X: <XIcon className="h-5 w-5" />,
    Instagram: <Instagram className="h-5 w-5" />,
    Linkedin: <Linkedin className="h-5 w-5" />,
};


export default function AdminPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [galleryContent, setGalleryContent] = useState<GalleryContent | null>(null);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [aboutContent, setAboutContent] = useState<AboutContent | null>(null);
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  const [homeContent, setHomeContent] = useState<HomeContent | null>(null);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [productsSection, setProductsSection] = useState<ProductsSection | null>(null);
  const [testimonialsSection, setTestimonialsSection] = useState<TestimonialsSection | null>(null);
  const [contactSection, setContactSection] = useState<ContactSection | null>(null);
  const [termsContent, setTermsContent] = useState<TermsContent | null>(null);
  const [certificates, setCertificates] = useState<Certificate[]>([]);


  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
  const [isGalleryImageDialogOpen, setIsGalleryImageDialogOpen] = useState(false);
  const [isGallerySectionDialogOpen, setIsGallerySectionDialogOpen] = useState(false);
  const [isTestimonialDialogOpen, setIsTestimonialDialogOpen] = useState(false);
  const [isTestimonialsSectionDialogOpen, setIsTestimonialsSectionDialogOpen] = useState(false);
  const [isPartnerDialogOpen, setIsPartnerDialogOpen] = useState(false);
  const [isAboutDialogOpen, setIsAboutDialogOpen] = useState(false);
  const [isContactInfoDialogOpen, setIsContactInfoDialogOpen] = useState(false);
  const [isHomeDialogOpen, setIsHomeDialogOpen] = useState(false);
  const [isSocialLinkDialogOpen, setIsSocialLinkDialogOpen] = useState(false);
  const [isProductsSectionDialogOpen, setIsProductsSectionDialogOpen] = useState(false);
  const [isContactSectionDialogOpen, setIsContactSectionDialogOpen] = useState(false);
  const [isTermsDialogOpen, setIsTermsDialogOpen] = useState(false);
  const [isCertificateDialogOpen, setIsCertificateDialogOpen] = useState(false);


  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingGalleryImage, setEditingGalleryImage] = useState<GalleryImage | null>(null);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null);
  const [editingSocialLink, setEditingSocialLink] = useState<SocialLink | null>(null);
  const [editingCertificate, setEditingCertificate] = useState<Certificate | null>(null);


  const { toast } = useToast();

  useEffect(() => {
    getProducts().then(setProducts);
    getGalleryContent().then(setGalleryContent);
    getTestimonials().then(setTestimonials);
    getPartners().then(setPartners);
    getAboutContent().then(setAboutContent);
    getContactInfo().then(setContactInfo);
    getHomeContent().then(setHomeContent);
    getSocialLinks().then(setSocialLinks);
    getProductsSection().then(setProductsSection);
    getTestimonialsSection().then(setTestimonialsSection);
    getContactSection().then(setContactSection);
    getTermsContent().then(setTermsContent);
    getCertificates().then(setCertificates);
  }, []);

  const openProductDialogForNew = () => {
    setEditingProduct(null);
    setIsProductDialogOpen(true);
  };

  const openProductDialogForEdit = (product: Product) => {
    setEditingProduct(product);
    setIsProductDialogOpen(true);
  };
  
  const handleProductSave = async (productData: Product, selectedFile: File | null) => {
    try {
      let finalImageUrl = productData.imageUrl;

      if (selectedFile) {
          const formData = new FormData();
          formData.append('file', selectedFile);

          const response = await fetch('/api/upload', {
              method: 'POST',
              body: formData,
          });

          if (!response.ok) {
              const errorText = await response.text();
              throw new Error(`Upload failed: ${errorText}`);
          }

          const result = await response.json();
          finalImageUrl = result.imageUrl;
      }

      const newProductData = { ...productData, imageUrl: finalImageUrl };

      let updatedProducts;
      if (editingProduct) {
        // Update existing product
        updatedProducts = products.map(p => p.name === editingProduct.name ? newProductData : p);
      } else {
        // Add new product
        if (products.find(p => p.name === newProductData.name)) {
          toast({
            title: "Save Failed",
            description: "A product with this name already exists.",
            variant: "destructive",
          });
          return;
        }
        updatedProducts = [...products, newProductData];
      }
      setProducts(updatedProducts);
      await saveProducts(updatedProducts);
      toast({
        title: "Changes Saved",
        description: "Product has been saved successfully.",
      });
      setIsProductDialogOpen(false);
    } catch (error: any) {
      console.error(error);
      toast({
        title: "Save Failed",
        description: error.message || "Failed to save product changes.",
        variant: "destructive",
      });
    }
  };

  const handleProductDelete = async (productName: string) => {
    try {
      const updatedProducts = products.filter(p => p.name !== productName);
      setProducts(updatedProducts);
      await saveProducts(updatedProducts);
      toast({
        title: "Product Deleted",
        description: "Product has been deleted successfully.",
      });
    } catch (error) {
      toast({
        title: "Delete Failed",
        description: "Failed to delete product.",
        variant: "destructive",
      });
    }
  }

  const openGalleryImageDialogForNew = () => {
    setEditingGalleryImage(null);
    setIsGalleryImageDialogOpen(true);
  };

  const openGalleryImageDialogForEdit = (image: GalleryImage) => {
    setEditingGalleryImage(image);
    setIsGalleryImageDialogOpen(true);
  };

  const handleGalleryImageSave = async (imageData: Omit<GalleryImage, 'imageUrl'>, selectedFile: File | null) => {
    if (!galleryContent) return;
    try {
      let finalImageUrl = editingGalleryImage?.imageUrl || "";

      if (selectedFile) {
        const formData = new FormData();
        formData.append('file', selectedFile);

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Upload failed: ${errorText}`);
        }

        const result = await response.json();
        finalImageUrl = result.imageUrl;
      }
      
      if (!finalImageUrl) {
        toast({
            title: "Save Failed",
            description: "An image is required.",
            variant: "destructive",
        });
        return;
      }

      const newImageData = { ...imageData, imageUrl: finalImageUrl };

      let updatedImages;
      if (editingGalleryImage) {
        updatedImages = galleryContent.galleryImages.map(img => img.id === editingGalleryImage.id ? newImageData : img);
      } else {
        updatedImages = [...galleryContent.galleryImages, newImageData];
      }

      const updatedContent = { ...galleryContent, galleryImages: updatedImages };
      setGalleryContent(updatedContent);
      await saveGalleryContent(updatedContent);
      toast({
        title: "Changes Saved",
        description: "Gallery image has been saved successfully.",
      });
      setIsGalleryImageDialogOpen(false);
    } catch (error: any) {
      console.error(error);
      toast({
        title: "Save Failed",
        description: error.message || "Failed to save gallery image.",
        variant: "destructive",
      });
    }
  };

  const handleGalleryImageDelete = async (id: string) => {
    if (!galleryContent) return;
    try {
      const updatedImages = galleryContent.galleryImages.filter(img => img.id !== id);
      const updatedContent = { ...galleryContent, galleryImages: updatedImages };
      setGalleryContent(updatedContent);
      await saveGalleryContent(updatedContent);
      toast({
        title: "Image Deleted",
        description: "Gallery image has been deleted successfully.",
      });
    } catch (error) {
      toast({
        title: "Delete Failed",
        description: "Failed to delete gallery image.",
        variant: "destructive",
      });
    }
  };

  const handleGallerySectionSave = async (newGallerySection: Pick<GalleryContent, 'title' | 'description'>) => {
    if (!galleryContent) return;
    try {
      const updatedContent = { ...galleryContent, ...newGallerySection };
      setGalleryContent(updatedContent);
      await saveGalleryContent(updatedContent);
      toast({
        title: "Changes Saved",
        description: "Gallery section has been saved successfully.",
      });
      setIsGallerySectionDialogOpen(false);
    } catch (error: any) {
      toast({
        title: "Save Failed",
        description: error.message || "Failed to save gallery section.",
        variant: "destructive",
      });
    }
  };


  const openTestimonialDialogForNew = () => {
    setEditingTestimonial(null);
    setIsTestimonialDialogOpen(true);
  };

  const openTestimonialDialogForEdit = (testimonial: Testimonial) => {
    setEditingTestimonial(testimonial);
    setIsTestimonialDialogOpen(true);
  };

  const handleTestimonialSave = async (testimonialData: Testimonial, selectedFile: File | null) => {
    try {
      let finalAuthorImageUrl = testimonialData.authorImageUrl;

      if (selectedFile) {
        const formData = new FormData();
        formData.append('file', selectedFile);
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Image upload failed');
        }
        const result = await response.json();
        finalAuthorImageUrl = result.imageUrl;
      }
      
      const newTestimonialData = { ...testimonialData, authorImageUrl: finalAuthorImageUrl };

      let updatedTestimonials;
      if (editingTestimonial) {
        updatedTestimonials = testimonials.map(t => t.id === editingTestimonial.id ? newTestimonialData : t);
      } else {
        updatedTestimonials = [...testimonials, { ...newTestimonialData, id: `testimonial-${Date.now()}` }];
      }
      setTestimonials(updatedTestimonials);
      await saveTestimonials(updatedTestimonials);
      toast({
        title: "Changes Saved",
        description: "Testimonial has been saved successfully.",
      });
      setIsTestimonialDialogOpen(false);
    } catch (error: any) {
      console.error(error);
      toast({
        title: "Save Failed",
        description: error.message || "Failed to save testimonial.",
        variant: "destructive",
      });
    }
  };

  const handleTestimonialDelete = async (id: string) => {
    try {
      const updatedTestimonials = testimonials.filter(t => t.id !== id);
      setTestimonials(updatedTestimonials);
      await saveTestimonials(updatedTestimonials);
      toast({
        title: "Testimonial Deleted",
        description: "Testimonial has been deleted successfully.",
      });
    } catch (error) {
      toast({
        title: "Delete Failed",
        description: "Failed to delete testimonial.",
        variant: "destructive",
      });
    }
  };

  const handleTestimonialsSectionSave = async (newTestimonialsSection: TestimonialsSection) => {
    try {
      setTestimonialsSection(newTestimonialsSection);
      await saveTestimonialsSection(newTestimonialsSection);
      toast({
        title: "Changes Saved",
        description: "Testimonials section has been saved successfully.",
      });
      setIsTestimonialsSectionDialogOpen(false);
    } catch (error: any) {
      toast({
        title: "Save Failed",
        description: error.message || "Failed to save testimonials section.",
        variant: "destructive",
      });
    }
  };


  const openPartnerDialogForNew = () => {
    setEditingPartner(null);
    setIsPartnerDialogOpen(true);
  };

  const openPartnerDialogForEdit = (partner: Partner) => {
    setEditingPartner(partner);
    setIsPartnerDialogOpen(true);
  };

  const handlePartnerSave = async (partnerData: Partner, selectedFile: File | null) => {
    try {
      let finalLogoUrl = partnerData.logoUrl;

      if (selectedFile) {
        const formData = new FormData();
        formData.append('file', selectedFile);
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Image upload failed');
        }
        const result = await response.json();
        finalLogoUrl = result.imageUrl;
      }
      
      const newPartnerData = { ...partnerData, logoUrl: finalLogoUrl };

      let updatedPartners;
      if (editingPartner) {
        updatedPartners = partners.map(p => p.id === editingPartner.id ? newPartnerData : p);
      } else {
        updatedPartners = [...partners, { ...newPartnerData, id: `partner-${Date.now()}` }];
      }
      setPartners(updatedPartners);
      await savePartners(updatedPartners);
      toast({
        title: "Changes Saved",
        description: "Partner has been saved successfully.",
      });
      setIsPartnerDialogOpen(false);
    } catch (error: any) {
      console.error(error);
      toast({
        title: "Save Failed",
        description: error.message || "Failed to save partner.",
        variant: "destructive",
      });
    }
  };

  const handlePartnerDelete = async (id: string) => {
    try {
      const updatedPartners = partners.filter(p => p.id !== id);
      setPartners(updatedPartners);
      await savePartners(updatedPartners);
      toast({
        title: "Partner Deleted",
        description: "Partner has been deleted successfully.",
      });
    } catch (error) {
      toast({
        title: "Delete Failed",
        description: "Failed to delete partner.",
        variant: "destructive",
      });
    }
  };

  const handleAboutSave = async (newAboutContent: AboutContent, selectedFile: File | null) => {
    try {
        let finalImageUrl = newAboutContent.main.imageUrl;

        if (selectedFile) {
            const formData = new FormData();
            formData.append('file', selectedFile);
            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });
            if (!response.ok) throw new Error('Image upload failed');
            const result = await response.json();
            finalImageUrl = result.imageUrl;
        }

        const updatedContent = {
            ...newAboutContent,
            main: {
                ...newAboutContent.main,
                imageUrl: finalImageUrl,
            }
        };

        setAboutContent(updatedContent);
        await saveAboutContent(updatedContent);
        toast({
            title: "Changes Saved",
            description: "About page content has been saved successfully.",
        });
        setIsAboutDialogOpen(false);
    } catch (error: any) {
        toast({
            title: "Save Failed",
            description: error.message || "Failed to save about page content.",
            variant: "destructive",
        });
    }
  };
  
    const handleContactInfoSave = async (newContactInfo: ContactInfo, selectedFile: File | null) => {
        try {
            let finalImageUrl = newContactInfo.imageUrl;

            if (selectedFile) {
                const formData = new FormData();
                formData.append('file', selectedFile);
                const response = await fetch('/api/upload', {
                    method: 'POST',
                    body: formData,
                });
                if (!response.ok) throw new Error('Image upload failed');
                const result = await response.json();
                finalImageUrl = result.imageUrl;
            }

            const updatedInfo = { ...newContactInfo, imageUrl: finalImageUrl };

            setContactInfo(updatedInfo);
            await saveContactInfo(updatedInfo);
            toast({
                title: "Changes Saved",
                description: "Contact information has been saved successfully.",
            });
            setIsContactInfoDialogOpen(false);
        } catch (error: any) {
            toast({
                title: "Save Failed",
                description: error.message || "Failed to save contact information.",
                variant: "destructive",
            });
        }
    };
    
    const handleHomeSave = async (newHomeContent: HomeContent, files: { heroImage?: File | null, brandLogo?: File | null }) => {
        try {
            let heroImageUrl = newHomeContent.hero.imageUrl;
            let brandLogoUrl = newHomeContent.brand.logoUrl;

            if (files.heroImage) {
                const formData = new FormData();
                formData.append('file', files.heroImage);
                const response = await fetch('/api/upload', { method: 'POST', body: formData });
                if (!response.ok) throw new Error('Hero image upload failed');
                heroImageUrl = (await response.json()).imageUrl;
            }

            if (files.brandLogo) {
                const formData = new FormData();
                formData.append('file', files.brandLogo);
                const response = await fetch('/api/upload', { method: 'POST', body: formData });
                if (!response.ok) throw new Error('Brand logo upload failed');
                brandLogoUrl = (await response.json()).imageUrl;
            }

            const updatedContent: HomeContent = {
                ...newHomeContent,
                hero: { ...newHomeContent.hero, imageUrl: heroImageUrl },
                brand: { ...newHomeContent.brand, logoUrl: brandLogoUrl },
            };

            setHomeContent(updatedContent);
            await saveHomeContent(updatedContent);
            toast({
                title: "Changes Saved",
                description: "Homepage content has been saved successfully.",
            });
            setIsHomeDialogOpen(false);
        } catch (error: any) {
            toast({
                title: "Save Failed",
                description: error.message || "Failed to save homepage content.",
                variant: "destructive",
            });
        }
    };
    
    const openSocialLinkDialogForNew = () => {
        setEditingSocialLink(null);
        setIsSocialLinkDialogOpen(true);
    };

    const openSocialLinkDialogForEdit = (link: SocialLink) => {
        setEditingSocialLink(link);
        setIsSocialLinkDialogOpen(true);
    };
    
    const handleSocialLinkSave = async (linkData: SocialLink) => {
        try {
            let updatedLinks;
            if (editingSocialLink) {
                updatedLinks = socialLinks.map(l => l.id === editingSocialLink.id ? linkData : l);
            } else {
                if (socialLinks.find(l => l.name === linkData.name)) {
                    toast({
                        title: "Save Failed",
                        description: "A social link with this name already exists.",
                        variant: "destructive",
                    });
                    return;
                }
                updatedLinks = [...socialLinks, { ...linkData, id: `social-${Date.now()}` }];
            }
            setSocialLinks(updatedLinks);
            await saveSocialLinks(updatedLinks);
            toast({
                title: "Changes Saved",
                description: "Social link has been saved successfully.",
            });
            setIsSocialLinkDialogOpen(false);
        } catch (error: any) {
            console.error(error);
            toast({
                title: "Save Failed",
                description: error.message || "Failed to save social link.",
                variant: "destructive",
            });
        }
    };

    const handleSocialLinkDelete = async (id: string) => {
        try {
            const updatedLinks = socialLinks.filter(l => l.id !== id);
            setSocialLinks(updatedLinks);
            await saveSocialLinks(updatedLinks);
            toast({
                title: "Social Link Deleted",
                description: "Social link has been deleted successfully.",
            });
        } catch (error) {
            toast({
                title: "Delete Failed",
                description: "Failed to delete social link.",
                variant: "destructive",
            });
        }
    };

    const handleProductsSectionSave = async (newProductsSection: ProductsSection) => {
      try {
        setProductsSection(newProductsSection);
        await saveProductsSection(newProductsSection);
        toast({
          title: "Changes Saved",
          description: "Products section has been saved successfully.",
        });
        setIsProductsSectionDialogOpen(false);
      } catch (error: any) {
        toast({
          title: "Save Failed",
          description: error.message || "Failed to save products section.",
          variant: "destructive",
        });
      }
    };

    const handleContactSectionSave = async (newContactSection: ContactSection) => {
      try {
        setContactSection(newContactSection);
        await saveContactSection(newContactSection);
        toast({
          title: "Changes Saved",
          description: "Contact section has been saved successfully.",
        });
        setIsContactSectionDialogOpen(false);
      } catch (error: any) {
        toast({
          title: "Save Failed",
          description: error.message || "Failed to save contact section.",
          variant: "destructive",
        });
      }
    };

    const handleTermsSave = async (newTermsContent: TermsContent) => {
        try {
            setTermsContent(newTermsContent);
            await saveTermsContent(newTermsContent);
            toast({
                title: "Changes Saved",
                description: "Terms and Conditions have been saved successfully.",
            });
            setIsTermsDialogOpen(false);
        } catch (error: any) {
            toast({
                title: "Save Failed",
                description: error.message || "Failed to save Terms and Conditions.",
                variant: "destructive",
            });
        }
    };

    const openCertificateDialogForNew = () => {
        setEditingCertificate(null);
        setIsCertificateDialogOpen(true);
    };

    const openCertificateDialogForEdit = (cert: Certificate) => {
        setEditingCertificate(cert);
        setIsCertificateDialogOpen(true);
    };

    const handleCertificateSave = async (certData: Certificate, selectedFile: File | null) => {
        try {
            let finalImageUrl = certData.imageUrl;

            if (selectedFile) {
                const formData = new FormData();
                formData.append('file', selectedFile);
                const response = await fetch('/api/upload', {
                    method: 'POST',
                    body: formData,
                });
                if (!response.ok) throw new Error('Image upload failed');
                const result = await response.json();
                finalImageUrl = result.imageUrl;
            }

            if (!finalImageUrl) {
                toast({
                    title: "Save Failed",
                    description: "An image is required.",
                    variant: "destructive",
                });
                return;
            }
            
            const newCertData = { ...certData, imageUrl: finalImageUrl };

            let updatedCerts;
            if (editingCertificate) {
                updatedCerts = certificates.map(c => c.id === editingCertificate.id ? newCertData : c);
            } else {
                updatedCerts = [...certificates, newCertData];
            }
            setCertificates(updatedCerts);
            await saveCertificates(updatedCerts);
            toast({
                title: "Changes Saved",
                description: "Certificate has been saved successfully.",
            });
            setIsCertificateDialogOpen(false);
        } catch (error: any) {
            console.error(error);
            toast({
                title: "Save Failed",
                description: error.message || "Failed to save certificate.",
                variant: "destructive",
            });
        }
    };

    const handleCertificateDelete = async (id: string) => {
        try {
            const updatedCerts = certificates.filter(c => c.id !== id);
            setCertificates(updatedCerts);
            await saveCertificates(updatedCerts);
            toast({
                title: "Certificate Deleted",
                description: "Certificate has been deleted successfully.",
            });
        } catch (error) {
            toast({
                title: "Delete Failed",
                description: "Failed to delete certificate.",
                variant: "destructive",
            });
        }
    };


  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Header />
      <main className="flex-1 bg-secondary">
        <section className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <Tabs defaultValue="home" className="mx-auto max-w-4xl">
            <ScrollArea className="w-full whitespace-nowrap rounded-lg">
              <TabsList className="inline-flex w-auto">
                <TabsTrigger value="home">Home</TabsTrigger>
                <TabsTrigger value="about">About</TabsTrigger>
                <TabsTrigger value="products">Products</TabsTrigger>
                <TabsTrigger value="gallery">Gallery</TabsTrigger>
                <TabsTrigger value="testimonials">Testimonials</TabsTrigger>
                <TabsTrigger value="certificates">Certificates</TabsTrigger>
                <TabsTrigger value="partners">Partners</TabsTrigger>
                <TabsTrigger value="contact">Contact</TabsTrigger>
                <TabsTrigger value="social">Social Media</TabsTrigger>
                <TabsTrigger value="legal">Legal</TabsTrigger>
              </TabsList>
              <ScrollBar orientation="horizontal" className="h-2" />
            </ScrollArea>
            <TabsContent value="home" className="pt-6">
                <Card>
                    <CardHeader className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex-1">
                            <CardTitle className="font-headline text-2xl">
                                Home Page Management
                            </CardTitle>
                            <CardDescription>
                                Edit the content of your home page.
                            </CardDescription>
                        </div>
                        <Button onClick={() => setIsHomeDialogOpen(true)} className="w-full sm:w-auto" style={{ backgroundColor: 'hsl(var(--accent))', color: 'hsl(var(--accent-foreground))' }} disabled={!homeContent}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Content
                        </Button>
                    </CardHeader>
                    <CardContent>
                        {homeContent ? (
                            <div className="space-y-4">
                                <div>
                                    <h4 className="font-semibold">Brand Name</h4>
                                    <p className="text-sm text-muted-foreground">{homeContent.brand.name}</p>
                                </div>
                                <div>
                                    <h4 className="font-semibold">Hero Headline</h4>
                                    <p className="text-sm text-muted-foreground">{homeContent.hero.headline}</p>
                                </div>
                            </div>
                        ) : (
                            <p>Loading home page content...</p>
                        )}
                    </CardContent>
                </Card>
            </TabsContent>
            <TabsContent value="about" className="pt-6">
                <Card>
                    <CardHeader className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex-1">
                            <CardTitle className="font-headline text-2xl">
                                About Page Management
                            </CardTitle>
                            <CardDescription>
                                Edit the content of your "About Us" page.
                            </CardDescription>
                        </div>
                        <Button onClick={() => setIsAboutDialogOpen(true)} className="w-full sm:w-auto" style={{ backgroundColor: 'hsl(var(--accent))', color: 'hsl(var(--accent-foreground))' }} disabled={!aboutContent}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Content
                        </Button>
                    </CardHeader>
                    <CardContent>
                        {aboutContent ? (
                            <div className="space-y-4">
                                <div>
                                    <h4 className="font-semibold">Main Content</h4>
                                    <p className="text-sm text-muted-foreground">{aboutContent.main.title}</p>
                                </div>
                                <div>
                                    <h4 className="font-semibold">Services</h4>
                                    <p className="text-sm text-muted-foreground">{aboutContent.services.items.length} services listed.</p>
                                </div>
                            </div>
                        ) : (
                            <p>Loading about page content...</p>
                        )}
                    </CardContent>
                </Card>
            </TabsContent>
            <TabsContent value="products" className="pt-6">
                <Card>
                  <CardHeader className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex-1">
                      <CardTitle className="font-headline text-2xl">
                        Product Management
                      </CardTitle>
                      <CardDescription>
                        Add, edit, or remove products from your store.
                      </CardDescription>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                        <Button onClick={() => setIsProductsSectionDialogOpen(true)} className="w-full sm:w-auto" variant="outline" disabled={!productsSection}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Section Text
                        </Button>
                        <Button onClick={openProductDialogForNew} className="w-full sm:w-auto" style={{ backgroundColor: 'hsl(var(--accent))', color: 'hsl(var(--accent-foreground))' }}>
                          <PlusCircle className="mr-2 h-4 w-4" />
                          Add Product
                        </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Product Name</TableHead>
                          <TableHead className="hidden sm:table-cell">Description</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {products.map((product) => (
                          <TableRow key={product.name}>
                            <TableCell className="font-medium">{product.name}</TableCell>
                            <TableCell className="hidden text-muted-foreground sm:table-cell">{product.description}</TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="icon" onClick={() => openProductDialogForEdit(product)}>
                                <Edit className="h-4 w-4" />
                                <span className="sr-only">Edit</span>
                              </Button>
                              <Button variant="ghost" size="icon" onClick={() => handleProductDelete(product.name)}>
                                <Trash2 className="h-4 w-4 text-destructive" />
                                 <span className="sr-only">Delete</span>
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
            </TabsContent>
            <TabsContent value="gallery" className="pt-6">
                <Card>
                  <CardHeader className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex-1">
                      <CardTitle className="font-headline text-2xl">
                        Gallery Management
                      </CardTitle>
                      <CardDescription>
                        Add, edit, or remove images from your gallery.
                      </CardDescription>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                        <Button onClick={() => setIsGallerySectionDialogOpen(true)} className="w-full sm:w-auto" variant="outline">
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Section Text
                        </Button>
                        <Button onClick={openGalleryImageDialogForNew} className="w-full sm:w-auto" style={{ backgroundColor: 'hsl(var(--accent))', color: 'hsl(var(--accent-foreground))' }}>
                          <PlusCircle className="mr-2 h-4 w-4" />
                          Add Image
                        </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {galleryContent?.galleryImages.map((image) => (
                        <div key={image.id} className="relative group">
                          <Image
                            src={image.imageUrl}
                            alt={image.description}
                            width={200}
                            height={200}
                            className="rounded-lg object-cover aspect-square"
                          />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg">
                              <Button variant="ghost" size="icon" onClick={() => openGalleryImageDialogForEdit(image)}>
                                <Edit className="h-5 w-5 text-white" />
                              </Button>
                              <Button variant="ghost" size="icon" onClick={() => handleGalleryImageDelete(image.id)}>
                                <Trash2 className="h-5 w-5 text-destructive" />
                              </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
            </TabsContent>
            <TabsContent value="testimonials" className="pt-6">
                <Card>
                  <CardHeader className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex-1">
                      <CardTitle className="font-headline text-2xl">
                        Testimonial Management
                      </CardTitle>
                      <CardDescription>
                        Add, edit, or remove testimonials from your home page.
                      </CardDescription>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                        <Button onClick={() => setIsTestimonialsSectionDialogOpen(true)} className="w-full sm:w-auto" variant="outline">
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Section Text
                        </Button>
                        <Button onClick={openTestimonialDialogForNew} className="w-full sm:w-auto" style={{ backgroundColor: 'hsl(var(--accent))', color: 'hsl(var(--accent-foreground))' }}>
                          <PlusCircle className="mr-2 h-4 w-4" />
                          Add Testimonial
                        </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Author</TableHead>
                          <TableHead className="hidden sm:table-cell">Quote</TableHead>
                          <TableHead className="hidden sm:table-cell">Rating</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {testimonials.map((testimonial) => (
                          <TableRow key={testimonial.id}>
                            <TableCell className="font-medium flex items-center gap-3">
                              <Avatar>
                                <AvatarImage src={testimonial.authorImageUrl || undefined} alt={testimonial.name} />
                                <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              {testimonial.name}
                            </TableCell>
                            <TableCell className="text-muted-foreground truncate max-w-sm hidden sm:table-cell">{testimonial.quote}</TableCell>
                            <TableCell className="hidden sm:table-cell">
                              <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={cn(
                                      "h-4 w-4",
                                      i < testimonial.rating
                                        ? "text-accent fill-accent"
                                        : "text-muted-foreground/50"
                                    )}
                                  />
                                ))}
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="icon" onClick={() => openTestimonialDialogForEdit(testimonial)}>
                                <Edit className="h-4 w-4" />
                                <span className="sr-only">Edit</span>
                              </Button>
                              <Button variant="ghost" size="icon" onClick={() => handleTestimonialDelete(testimonial.id)}>
                                <Trash2 className="h-4 w-4 text-destructive" />
                                 <span className="sr-only">Delete</span>
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
            </TabsContent>
            <TabsContent value="certificates" className="pt-6">
                <Card>
                  <CardHeader className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex-1">
                      <CardTitle className="font-headline text-2xl">
                        Certificate Management
                      </CardTitle>
                      <CardDescription>
                        Manage your company's legal and quality certificates.
                      </CardDescription>
                    </div>
                    <Button onClick={openCertificateDialogForNew} className="w-full sm:w-auto" style={{ backgroundColor: 'hsl(var(--accent))', color: 'hsl(var(--accent-foreground))' }}>
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Add Certificate
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Certificate Name</TableHead>
                          <TableHead className="hidden sm:table-cell">Image</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {certificates.map((cert) => (
                          <TableRow key={cert.id}>
                            <TableCell className="font-medium">{cert.name}</TableCell>
                            <TableCell className="hidden sm:table-cell">
                              {cert.imageUrl && (
                                <Image src={cert.imageUrl} alt={cert.name} width={100} height={70} className="object-contain rounded" />
                              )}
                            </TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="icon" onClick={() => openCertificateDialogForEdit(cert)}>
                                <Edit className="h-4 w-4" />
                                <span className="sr-only">Edit</span>
                              </Button>
                              <Button variant="ghost" size="icon" onClick={() => handleCertificateDelete(cert.id)}>
                                <Trash2 className="h-4 w-4 text-destructive" />
                                 <span className="sr-only">Delete</span>
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
            </TabsContent>
            <TabsContent value="partners" className="pt-6">
                <Card>
                  <CardHeader className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex-1">
                      <CardTitle className="font-headline text-2xl">
                        Partner Management
                      </CardTitle>
                      <CardDescription>
                        Manage your proud partner logos.
                      </CardDescription>
                    </div>
                    <Button onClick={openPartnerDialogForNew} className="w-full sm:w-auto" style={{ backgroundColor: 'hsl(var(--accent))', color: 'hsl(var(--accent-foreground))' }}>
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Add Partner
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Partner Name</TableHead>
                          <TableHead className="hidden sm:table-cell">Logo</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {partners.map((partner) => (
                          <TableRow key={partner.id}>
                            <TableCell className="font-medium">{partner.name}</TableCell>
                            <TableCell className="hidden sm:table-cell">
                              {partner.logoUrl && (
                                <Image src={partner.logoUrl} alt={partner.name} width={100} height={40} className="object-contain" />
                              )}
                            </TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="icon" onClick={() => openPartnerDialogForEdit(partner)}>
                                <Edit className="h-4 w-4" />
                                <span className="sr-only">Edit</span>
                              </Button>
                              <Button variant="ghost" size="icon" onClick={() => handlePartnerDelete(partner.id)}>
                                <Trash2 className="h-4 w-4 text-destructive" />
                                 <span className="sr-only">Delete</span>
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
            </TabsContent>
             <TabsContent value="contact" className="pt-6">
                <Card>
                    <CardHeader className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex-1">
                            <CardTitle className="font-headline text-2xl">
                                Contact Information
                            </CardTitle>
                            <CardDescription>
                                Edit the contact details and section text on your site.
                            </CardDescription>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                            <Button onClick={() => setIsContactSectionDialogOpen(true)} className="w-full sm:w-auto" variant="outline" disabled={!contactSection}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit Section Text
                            </Button>
                            <Button onClick={() => setIsContactInfoDialogOpen(true)} className="w-full sm:w-auto" style={{ backgroundColor: 'hsl(var(--accent))', color: 'hsl(var(--accent-foreground))' }} disabled={!contactInfo}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit Contact Info
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {contactInfo ? (
                            <div className="space-y-4">
                                <div>
                                    <h4 className="font-semibold">Address</h4>
                                    <p className="text-sm text-muted-foreground">{contactInfo.address}</p>
                                </div>
                                <div>
                                    <h4 className="font-semibold">Phone</h4>
                                    <p className="text-sm text-muted-foreground">{contactInfo.phone}</p>
                                </div>
                                <div>
                                    <h4 className="font-semibold">Email</h4>
                                    <p className="text-sm text-muted-foreground">{contactInfo.email}</p>
                                </div>
                                <div>
                                    <h4 className="font-semibold">WhatsApp Number</h4>
                                    <p className="text-sm text-muted-foreground">{contactInfo.whatsappNumber}</p>
                                </div>
                            </div>
                        ) : (
                            <p>Loading contact information...</p>
                        )}
                    </CardContent>
                </Card>
            </TabsContent>
            <TabsContent value="social" className="pt-6">
                <Card>
                  <CardHeader className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex-1">
                      <CardTitle className="font-headline text-2xl">
                        Social Media Management
                      </CardTitle>
                      <CardDescription>
                        Add, edit, or remove your social media links.
                      </CardDescription>
                    </div>
                    <Button onClick={openSocialLinkDialogForNew} className="w-full sm:w-auto" style={{ backgroundColor: 'hsl(var(--accent))', color: 'hsl(var(--accent-foreground))' }}>
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Add Social Link
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Platform</TableHead>
                          <TableHead className="hidden sm:table-cell">URL</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {socialLinks.map((link) => (
                          <TableRow key={link.id}>
                            <TableCell className="font-medium flex items-center gap-3">
                               {iconMap[link.icon]} {link.name}
                            </TableCell>
                            <TableCell className="hidden text-muted-foreground sm:table-cell">{link.url}</TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="icon" onClick={() => openSocialLinkDialogForEdit(link)}>
                                <Edit className="h-4 w-4" />
                                <span className="sr-only">Edit</span>
                              </Button>
                              <Button variant="ghost" size="icon" onClick={() => handleSocialLinkDelete(link.id)}>
                                <Trash2 className="h-4 w-4 text-destructive" />
                                 <span className="sr-only">Delete</span>
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
            </TabsContent>
            <TabsContent value="legal" className="pt-6">
                <Card>
                    <CardHeader className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex-1">
                            <CardTitle className="font-headline text-2xl">
                                Legal Content
                            </CardTitle>
                            <CardDescription>
                                Edit the content of your legal pages like Terms and Conditions.
                            </CardDescription>
                        </div>
                        <Button onClick={() => setIsTermsDialogOpen(true)} className="w-full sm:w-auto" style={{ backgroundColor: 'hsl(var(--accent))', color: 'hsl(var(--accent-foreground))' }} disabled={!termsContent}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Terms & Conditions
                        </Button>
                    </CardHeader>
                    <CardContent>
                        {termsContent ? (
                            <div className="space-y-4">
                                <div>
                                    <h4 className="font-semibold">Terms & Conditions</h4>
                                    <p className="text-sm text-muted-foreground truncate">{termsContent.content}</p>
                                </div>
                            </div>
                        ) : (
                            <p>Loading legal content...</p>
                        )}
                    </CardContent>
                </Card>
            </TabsContent>
          </Tabs>
        </section>
      </main>
      <Footer />
      <ProductEditDialog 
        isOpen={isProductDialogOpen}
        setIsOpen={setIsProductDialogOpen}
        product={editingProduct}
        onSave={handleProductSave}
      />
      <GalleryImageEditDialog
        isOpen={isGalleryImageDialogOpen}
        setIsOpen={setIsGalleryImageDialogOpen}
        image={editingGalleryImage}
        onSave={handleGalleryImageSave}
      />
      {galleryContent && (
        <GallerySectionEditDialog
          isOpen={isGallerySectionDialogOpen}
          setIsOpen={setIsGallerySectionDialogOpen}
          content={galleryContent}
          onSave={handleGallerySectionSave}
        />
      )}
      <TestimonialEditDialog
        isOpen={isTestimonialDialogOpen}
        setIsOpen={setIsTestimonialDialogOpen}
        testimonial={editingTestimonial}
        onSave={handleTestimonialSave}
      />
       {testimonialsSection && (
        <TestimonialsSectionEditDialog
          isOpen={isTestimonialsSectionDialogOpen}
          setIsOpen={setIsTestimonialsSectionDialogOpen}
          content={testimonialsSection}
          onSave={handleTestimonialsSectionSave}
        />
      )}
      <PartnerEditDialog
        isOpen={isPartnerDialogOpen}
        setIsOpen={setIsPartnerDialogOpen}
        partner={editingPartner}
        onSave={handlePartnerSave}
      />
      {aboutContent && (
        <AboutEditDialog
            isOpen={isAboutDialogOpen}
            setIsOpen={setIsAboutDialogOpen}
            content={aboutContent}
            onSave={handleAboutSave}
        />
      )}
       {contactInfo && (
        <ContactInfoEditDialog
            isOpen={isContactInfoDialogOpen}
            setIsOpen={setIsContactInfoDialogOpen}
            info={contactInfo}
            onSave={handleContactInfoSave}
        />
      )}
      {homeContent && (
        <HomeEditDialog
            isOpen={isHomeDialogOpen}
            setIsOpen={setIsHomeDialogOpen}
            content={homeContent}
            onSave={handleHomeSave}
        />
      )}
      <SocialLinkEditDialog
        isOpen={isSocialLinkDialogOpen}
        setIsOpen={setIsSocialLinkDialogOpen}
        socialLink={editingSocialLink}
        onSave={handleSocialLinkSave}
      />
       {productsSection && (
        <ProductsSectionEditDialog
          isOpen={isProductsSectionDialogOpen}
          setIsOpen={setIsProductsSectionDialogOpen}
          content={productsSection}
          onSave={handleProductsSectionSave}
        />
      )}
       {contactSection && (
        <ContactSectionEditDialog
          isOpen={isContactSectionDialogOpen}
          setIsOpen={setIsContactSectionDialogOpen}
          content={contactSection}
          onSave={handleContactSectionSave}
        />
      )}
      {termsContent && (
        <TermsEditDialog
            isOpen={isTermsDialogOpen}
            setIsOpen={setIsTermsDialogOpen}
            content={termsContent}
            onSave={handleTermsSave}
        />
      )}
      <CertificateEditDialog
          isOpen={isCertificateDialogOpen}
          setIsOpen={setIsCertificateDialogOpen}
          certificate={editingCertificate}
          onSave={handleCertificateSave}
      />
    </div>
  );
}

interface ProductEditDialogProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    product: Product | null;
    onSave: (productData: Product, selectedFile: File | null) => void;
}

function ProductEditDialog({ isOpen, setIsOpen, product, onSave }: ProductEditDialogProps) {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [imageId, setImageId] = useState("");
    const [specifications, setSpecifications] = useState<{ key: string; value: string }[]>([]);
    const [varieties, setVarieties] = useState<string[]>([]);
    const [certifications, setCertifications] = useState<string[]>([]);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const { toast } = useToast();

    useEffect(() => {
        if (isOpen) {
            if (product) {
                setName(product.name);
                setDescription(product.description);
                setImageId(product.imageId);
                setSpecifications(product.specifications || []);
                setVarieties(product.varieties || []);
                setCertifications(product.certifications || []);
                setPreviewUrl(product.imageUrl);
            } else {
                setName("");
                setDescription("");
                setImageId("");
                setSpecifications([{ key: "", value: "" }]);
                setVarieties([]);
                setCertifications([]);
                setPreviewUrl(null);
            }
            setSelectedFile(null);
        }
    }, [product, isOpen]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 10 * 1024 * 1024) { // 10MB
                toast({
                    title: "File Too Large",
                    description: "Please select an image smaller than 10MB.",
                    variant: "destructive",
                });
                return;
            }
            setSelectedFile(file);
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
        }
    };

    const handleSpecificationChange = (index: number, field: 'key' | 'value', value: string) => {
        const newSpecs = [...specifications];
        if (!newSpecs[index]) {
            newSpecs[index] = { key: '', value: '' };
        }
        newSpecs[index][field] = value;
        setSpecifications(newSpecs);
    };

    const addSpecification = () => setSpecifications([...specifications, { key: "", value: "" }]);
    const removeSpecification = (index: number) => {
        const newSpecs = specifications.filter((_, i) => i !== index);
        setSpecifications(newSpecs);
    };
    
    const handleTagChange = (setter: React.Dispatch<React.SetStateAction<string[]>>, value: string) => {
        setter(value.split(',').map(tag => tag.trim()).filter(tag => tag));
    };

    const handleSubmit = async () => {
        if (!name || !description || !imageId) {
            toast({
                title: "Missing Fields",
                description: "Please fill out Name, Description, and Image ID before saving.",
                variant: "destructive",
            });
            return;
        }

        const productData: Product = {
            name,
            description,
            imageId,
            imageUrl: product?.imageUrl || previewUrl,
            specifications: specifications.filter(s => s.key && s.value),
            varieties,
            certifications
        };
        
        onSave(productData, selectedFile);
    }
    
    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="sm:max-w-xl">
                <DialogHeader>
                    <DialogTitle>{product ? 'Edit Product' : 'Add New Product'}</DialogTitle>
                    <DialogDescription>
                        {product ? 'Update the details for this product.' : 'Fill in the details for the new product.'}
                    </DialogDescription>
                </DialogHeader>
                <ScrollArea className="h-[70vh] pr-6">
                    <div className="grid gap-6 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">Name</Label>
                            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="col-span-3" disabled={!!product} />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="description" className="text-right">Description</Label>
                            <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} className="col-span-3" />
                        </div>
                         <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="imageId" className="text-right">Image ID</Label>
                            <Input id="imageId" value={imageId} onChange={(e) => setImageId(e.target.value)} className="col-span-3" placeholder="e.g., basmati-grain" />
                        </div>
                         <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right">Image</Label>
                            <div className="col-span-3">
                                <input type="file" accept="image/*" onChange={handleFileChange} className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"/>
                                <p className="text-xs text-muted-foreground mt-2">Max file size: 10MB</p>
                                {previewUrl && (
                                    <div className="mt-2">
                                        <Image src={previewUrl} alt="Preview" width={100} height={100} className="object-cover rounded" />
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <Label>Specifications</Label>
                            {specifications.map((spec, index) => (
                                <div key={index} className="flex gap-2 items-center">
                                    <Input placeholder="Key" value={spec.key} onChange={(e) => handleSpecificationChange(index, 'key', e.target.value)} />
                                    <Input placeholder="Value" value={spec.value} onChange={(e) => handleSpecificationChange(index, 'value', e.target.value)} />
                                    <Button variant="ghost" size="icon" onClick={() => removeSpecification(index)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                                </div>
                            ))}
                            <Button variant="outline" size="sm" onClick={addSpecification}><PlusCircle className="mr-2 h-4 w-4" /> Add Spec</Button>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="varieties">Available Varieties</Label>
                            <Input id="varieties" value={varieties.join(', ')} onChange={(e) => handleTagChange(setVarieties, e.target.value)} placeholder="e.g., 1121 Basmati, Pusa Basmati" />
                            <p className="text-xs text-muted-foreground">Enter tags separated by commas.</p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="certifications">Certifications</Label>
                            <Input id="certifications" value={certifications.join(', ')} onChange={(e) => handleTagChange(setCertifications, e.target.value)} placeholder="e.g., Organic, Export Grade" />
                            <p className="text-xs text-muted-foreground">Enter tags separated by commas.</p>
                        </div>
                    </div>
                </ScrollArea>
                <DialogFooter>
                    <Button type="button" onClick={handleSubmit}>Save Changes</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

interface GalleryImageEditDialogProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    image: GalleryImage | null;
    onSave: (imageData: Omit<GalleryImage, 'imageUrl'>, selectedFile: File | null) => void;
}

function GalleryImageEditDialog({ isOpen, setIsOpen, image, onSave }: GalleryImageEditDialogProps) {
    const [id, setId] = useState("");
    const [description, setDescription] = useState("");
    const [imageHint, setImageHint] = useState("");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const { toast } = useToast();

    useEffect(() => {
        if (isOpen) {
            if (image) {
                setId(image.id);
                setDescription(image.description);
                setImageHint(image.imageHint);
                setPreviewUrl(image.imageUrl);
            } else {
                // Generate a new unique ID for a new image
                setId(`gallery-${Date.now()}`);
                setDescription("");
                setImageHint("");
                setPreviewUrl(null);
            }
            setSelectedFile(null);
        }
    }, [image, isOpen]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 10 * 1024 * 1024) { // 10MB
                toast({
                    title: "File Too Large",
                    description: "Please select an image smaller than 10MB.",
                    variant: "destructive",
                });
                return;
            }
            setSelectedFile(file);
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
        }
    };

    const handleSubmit = async () => {
        if (!id || !description) {
            toast({
                title: "Missing Fields",
                description: "Please fill out ID and Description before saving.",
                variant: "destructive",
            });
            return;
        }
        
        if (!previewUrl && !selectedFile) {
            toast({
                title: "Missing Image",
                description: "Please select an image before saving.",
                variant: "destructive",
            });
            return;
        }

        const imageData = { id, description, imageHint };
        onSave(imageData, selectedFile);
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{image ? 'Edit Gallery Image' : 'Add New Gallery Image'}</DialogTitle>
                    <DialogDescription>
                        {image ? 'Update the details for this image.' : 'Fill in the details for the new image.'}
                    </DialogDescription>
                </DialogHeader>
                <ScrollArea className="h-[60vh] pr-6">
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="gallery-id" className="text-right">ID</Label>
                            <Input id="gallery-id" value={id} onChange={(e) => setId(e.target.value)} className="col-span-3" disabled={!!image} />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="gallery-description" className="text-right">Description</Label>
                            <Textarea id="gallery-description" value={description} onChange={(e) => setDescription(e.target.value)} className="col-span-3" />
                        </div>
                         <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="gallery-hint" className="text-right">Image Hint</Label>
                            <Input id="gallery-hint" value={imageHint} onChange={(e) => setImageHint(e.target.value)} className="col-span-3" placeholder="e.g., rice paddy" />
                        </div>
                         <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right">Image</Label>
                            <div className="col-span-3">
                                <input type="file" accept="image/*" onChange={handleFileChange} className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"/>
                                <p className="text-xs text-muted-foreground mt-2">Max file size: 10MB</p>
                                {previewUrl && (
                                    <div className="mt-2">
                                        <Image src={previewUrl} alt="Preview" width={100} height={100} className="object-cover rounded" />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </ScrollArea>
                <DialogFooter>
                    <Button type="button" onClick={handleSubmit}>Save Changes</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

interface TestimonialEditDialogProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    testimonial: Testimonial | null;
    onSave: (testimonialData: Testimonial, selectedFile: File | null) => void;
}

function TestimonialEditDialog({ isOpen, setIsOpen, testimonial, onSave }: TestimonialEditDialogProps) {
    const [name, setName] = useState("");
    const [title, setTitle] = useState("");
    const [quote, setQuote] = useState("");
    const [rating, setRating] = useState(5);
    const [id, setId] = useState("");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const { toast } = useToast();

    useEffect(() => {
        if (isOpen) {
            if (testimonial) {
                setName(testimonial.name);
                setTitle(testimonial.title);
                setQuote(testimonial.quote);
                setRating(testimonial.rating);
                setId(testimonial.id);
                setPreviewUrl(testimonial.authorImageUrl);
            } else {
                setName("");
                setTitle("");
                setQuote("");
                setRating(5);
                setId(`testimonial-${Date.now()}`);
                setPreviewUrl(null);
            }
            setSelectedFile(null);
        }
    }, [testimonial, isOpen]);
    
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) { // 2MB
                toast({
                    title: "File Too Large",
                    description: "Please select an image smaller than 2MB.",
                    variant: "destructive",
                });
                return;
            }
            setSelectedFile(file);
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
        }
    };


    const handleSubmit = async () => {
        if (!name || !title || !quote) {
            toast({
                title: "Missing Fields",
                description: "Please fill out all fields before saving.",
                variant: "destructive",
            });
            return;
        }

        const testimonialData: Testimonial = { id, name, title, quote, rating, authorImageUrl: testimonial?.authorImageUrl || null };
        onSave(testimonialData, selectedFile);
    }
    
    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{testimonial ? 'Edit Testimonial' : 'Add New Testimonial'}</DialogTitle>
                    <DialogDescription>
                        {testimonial ? 'Update the details for this testimonial.' : 'Fill in the details for the new testimonial.'}
                    </DialogDescription>
                </DialogHeader>
                <ScrollArea className="h-[70vh] pr-6">
                  <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="testimonial-name" className="text-right">Author Name</Label>
                          <Input id="testimonial-name" value={name} onChange={(e) => setName(e.target.value)} className="col-span-3" />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="testimonial-title" className="text-right">Author Title</Label>
                          <Input id="testimonial-title" value={title} onChange={(e) => setTitle(e.target.value)} className="col-span-3" />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="testimonial-rating" className="text-right">Rating</Label>
                          <div className="col-span-3 flex items-center">
                              {[...Array(5)].map((_, i) => (
                                  <Star
                                      key={i}
                                      className={cn(
                                          "h-6 w-6 cursor-pointer",
                                          i < rating ? "text-accent fill-accent" : "text-muted-foreground/50"
                                      )}
                                      onClick={() => setRating(i + 1)}
                                  />
                              ))}
                          </div>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right">Author Image</Label>
                        <div className="col-span-3">
                            <input type="file" accept="image/*" onChange={handleFileChange} className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"/>
                            <p className="text-xs text-muted-foreground mt-2">Max file size: 2MB</p>
                            {previewUrl && (
                                <div className="mt-2">
                                    <Image src={previewUrl} alt="Preview" width={80} height={80} className="object-cover rounded-full" />
                                </div>
                            )}
                        </div>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="testimonial-quote" className="text-right">Quote</Label>
                          <Textarea id="testimonial-quote" value={quote} onChange={(e) => setQuote(e.target.value)} className="col-span-3" />
                      </div>
                  </div>
                </ScrollArea>
                <DialogFooter>
                    <Button type="button" onClick={handleSubmit}>Save Changes</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

interface PartnerEditDialogProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    partner: Partner | null;
    onSave: (partnerData: Partner, selectedFile: File | null) => void;
}

function PartnerEditDialog({ isOpen, setIsOpen, partner, onSave }: PartnerEditDialogProps) {
    const [id, setId] = useState("");
    const [name, setName] = useState("");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const { toast } = useToast();

    useEffect(() => {
        if (isOpen) {
            if (partner) {
                setId(partner.id);
                setName(partner.name);
                setPreviewUrl(partner.logoUrl);
            } else {
                setId(`partner-${Date.now()}`);
                setName("");
                setPreviewUrl(null);
            }
            setSelectedFile(null);
        }
    }, [partner, isOpen]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) { // 2MB
                toast({
                    title: "File Too Large",
                    description: "Please select an image smaller than 2MB.",
                    variant: "destructive",
                });
                return;
            }
            setSelectedFile(file);
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
        }
    };

    const handleSubmit = async () => {
        if (!name) {
            toast({
                title: "Missing Name",
                description: "Please enter the partner's name.",
                variant: "destructive",
            });
            return;
        }

        if (!previewUrl && !selectedFile) {
            toast({
                title: "Missing Image",
                description: "Please select a logo image.",
                variant: "destructive",
            });
            return;
        }

        const partnerData: Partner = { id, name, logoUrl: partner?.logoUrl || null };
        onSave(partnerData, selectedFile);
    }
    
    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{partner ? 'Edit Partner' : 'Add New Partner'}</DialogTitle>
                    <DialogDescription>
                        {partner ? 'Update the details for this partner.' : 'Fill in the details for the new partner.'}
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="partner-name" className="text-right">Partner Name</Label>
                        <Input id="partner-name" value={name} onChange={(e) => setName(e.target.value)} className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label className="text-right">Partner Logo</Label>
                      <div className="col-span-3">
                          <input type="file" accept="image/*" onChange={handleFileChange} className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"/>
                          <p className="text-xs text-muted-foreground mt-2">Max file size: 2MB</p>
                          {previewUrl && (
                              <div className="mt-2">
                                  <Image src={previewUrl} alt="Preview" width={100} height={40} className="object-contain rounded" />
                              </div>
                          )}
                      </div>
                    </div>
                </div>
                <DialogFooter>
                    <Button type="button" onClick={handleSubmit}>Save Changes</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

interface CertificateEditDialogProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    certificate: Certificate | null;
    onSave: (certData: Certificate, selectedFile: File | null) => void;
}

function CertificateEditDialog({ isOpen, setIsOpen, certificate, onSave }: CertificateEditDialogProps) {
    const [id, setId] = useState("");
    const [name, setName] = useState("");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const { toast } = useToast();

    useEffect(() => {
        if (isOpen) {
            if (certificate) {
                setId(certificate.id);
                setName(certificate.name);
                setPreviewUrl(certificate.imageUrl);
            } else {
                setId(`cert-${Date.now()}`);
                setName("");
                setPreviewUrl(null);
            }
            setSelectedFile(null);
        }
    }, [certificate, isOpen]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) { // 5MB
                toast({
                    title: "File Too Large",
                    description: "Please select an image smaller than 5MB.",
                    variant: "destructive",
                });
                return;
            }
            setSelectedFile(file);
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
        }
    };

    const handleSubmit = async () => {
        if (!name) {
            toast({ title: "Missing Name", description: "Please enter the certificate name.", variant: "destructive" });
            return;
        }

        if (!previewUrl && !selectedFile) {
            toast({ title: "Missing Image", description: "Please select an image.", variant: "destructive" });
            return;
        }

        const certData: Certificate = { id, name, imageUrl: certificate?.imageUrl || "" };
        onSave(certData, selectedFile);
    }
    
    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{certificate ? 'Edit Certificate' : 'Add New Certificate'}</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="cert-name" className="text-right">Certificate Name</Label>
                        <Input id="cert-name" value={name} onChange={(e) => setName(e.target.value)} className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label className="text-right">Certificate Image</Label>
                      <div className="col-span-3">
                          <input type="file" accept="image/*" onChange={handleFileChange} className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"/>
                          <p className="text-xs text-muted-foreground mt-2">Max file size: 5MB</p>
                          {previewUrl && (
                              <div className="mt-2">
                                  <Image src={previewUrl} alt="Preview" width={100} height={70} className="object-contain rounded" />
                              </div>
                          )}
                      </div>
                    </div>
                </div>
                <DialogFooter>
                    <Button type="button" onClick={handleSubmit}>Save Changes</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}


interface AboutEditDialogProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    content: AboutContent;
    onSave: (content: AboutContent, selectedFile: File | null) => void;
}

function AboutEditDialog({ isOpen, setIsOpen, content, onSave }: AboutEditDialogProps) {
    const [currentContent, setCurrentContent] = useState<AboutContent>(content);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(content.main.imageUrl);
    const { toast } = useToast();

    useEffect(() => {
        if(isOpen) {
            setCurrentContent(content);
            setPreviewUrl(content.main.imageUrl);
            setSelectedFile(null);
        }
    }, [isOpen, content]);

    const handleMainContentChange = (field: 'title' | 'paragraph1' | 'paragraph2' | 'imageHint', value: string) => {
        setCurrentContent(prev => ({
            ...prev,
            main: { ...prev.main, [field]: value }
        }));
    };

    const handleServiceChange = (index: number, field: 'title' | 'description', value: string) => {
        const newItems = [...currentContent.services.items];
        newItems[index] = { ...newItems[index], [field]: value };
        setCurrentContent(prev => ({
            ...prev,
            services: { ...prev.services, items: newItems }
        }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 10 * 1024 * 1024) { // 10MB
                toast({ title: "File Too Large", description: "Please select an image smaller than 10MB.", variant: "destructive" });
                return;
            }
            setSelectedFile(file);
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
        }
    };

    const handleSubmit = () => {
        onSave(currentContent, selectedFile);
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="max-w-3xl">
                <DialogHeader>
                    <DialogTitle>Edit About Page Content</DialogTitle>
                    <DialogDescription>
                        Make changes to the content of your "About Us" page.
                    </DialogDescription>
                </DialogHeader>
                <ScrollArea className="h-[75vh] pr-6">
                    <div className="space-y-6 py-4">
                        <h3 className="font-semibold text-lg border-b pb-2">Main Section</h3>
                        <div className="grid gap-4">
                            <Label>Title</Label>
                            <Input value={currentContent.main.title} onChange={e => handleMainContentChange('title', e.target.value)} />
                        </div>
                        <div className="grid gap-4">
                            <Label>Paragraph 1</Label>
                            <Textarea value={currentContent.main.paragraph1} onChange={e => handleMainContentChange('paragraph1', e.target.value)} rows={4}/>
                        </div>
                        <div className="grid gap-4">
                            <Label>Paragraph 2</Label>
                            <Textarea value={currentContent.main.paragraph2} onChange={e => handleMainContentChange('paragraph2', e.target.value)} rows={4}/>
                        </div>
                        <div className="grid gap-4">
                            <Label>Image</Label>
                            <input type="file" accept="image/*" onChange={handleFileChange} className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"/>
                            {previewUrl && <Image src={previewUrl} alt="Preview" width={200} height={133} className="rounded object-cover mt-2" />}
                        </div>
                        <div className="grid gap-4">
                            <Label>Image Hint</Label>
                            <Input value={currentContent.main.imageHint} onChange={e => handleMainContentChange('imageHint', e.target.value)} />
                        </div>

                        <h3 className="font-semibold text-lg border-b pb-2 pt-6">Services Section</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {currentContent.services.items.map((service, index) => (
                                <Card key={service.id}>
                                    <CardHeader>
                                        <CardTitle className="text-base">{`Service ${index + 1}`}</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="grid gap-2">
                                            <Label>Title</Label>
                                            <Input value={service.title} onChange={e => handleServiceChange(index, 'title', e.target.value)} />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label>Description</Label>
                                            <Textarea value={service.description} onChange={e => handleServiceChange(index, 'description', e.target.value)} rows={3}/>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </ScrollArea>
                <DialogFooter>
                    <Button type="button" onClick={handleSubmit}>Save Changes</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

interface ContactInfoEditDialogProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    info: ContactInfo;
    onSave: (info: ContactInfo, selectedFile: File | null) => void;
}

function ContactInfoEditDialog({ isOpen, setIsOpen, info, onSave }: ContactInfoEditDialogProps) {
    const [currentInfo, setCurrentInfo] = useState<ContactInfo>(info);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(info.imageUrl);
    const { toast } = useToast();

    useEffect(() => {
        if(isOpen) {
            setCurrentInfo(info);
            setPreviewUrl(info.imageUrl);
            setSelectedFile(null);
        }
    }, [isOpen, info]);

    const handleInfoChange = (field: keyof Omit<ContactInfo, 'imageUrl'>, value: string) => {
        setCurrentInfo(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 10 * 1024 * 1024) { // 10MB
                toast({ title: "File Too Large", description: "Please select an image smaller than 10MB.", variant: "destructive" });
                return;
            }
            setSelectedFile(file);
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
        }
    };

    const handleSubmit = () => {
        onSave(currentInfo, selectedFile);
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Edit Contact Information</DialogTitle>
                    <DialogDescription>
                        Update the contact details and map image for your website.
                    </DialogDescription>
                </DialogHeader>
                <ScrollArea className="h-[70vh] pr-6">
                    <div className="grid gap-6 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="address">Address</Label>
                            <Input id="address" value={currentInfo.address} onChange={(e) => handleInfoChange('address', e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phone">Phone</Label>
                            <Input id="phone" value={currentInfo.phone} onChange={(e) => handleInfoChange('phone', e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" value={currentInfo.email} onChange={(e) => handleInfoChange('email', e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="whatsappNumber">WhatsApp No.</Label>
                            <Input id="whatsappNumber" value={currentInfo.whatsappNumber} onChange={(e) => handleInfoChange('whatsappNumber', e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label>Map Image</Label>
                            <input type="file" accept="image/*" onChange={handleFileChange} className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"/>
                            <p className="text-xs text-muted-foreground mt-1">Max file size: 10MB</p>
                            {previewUrl && <Image src={previewUrl} alt="Map Preview" width={200} height={150} className="rounded object-cover mt-2" />}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="imageHint">Map Image Hint</Label>
                            <Input id="imageHint" value={currentInfo.imageHint} onChange={(e) => handleInfoChange('imageHint', e.target.value)} />
                        </div>
                    </div>
                </ScrollArea>
                <DialogFooter>
                    <Button type="button" onClick={handleSubmit}>Save Changes</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

interface HomeEditDialogProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    content: HomeContent;
    onSave: (content: HomeContent, files: { heroImage?: File | null, brandLogo?: File | null }) => void;
}

function HomeEditDialog({ isOpen, setIsOpen, content, onSave }: HomeEditDialogProps) {
    const [currentContent, setCurrentContent] = useState<HomeContent>(content);
    const [heroImageFile, setHeroImageFile] = useState<File | null>(null);
    const [brandLogoFile, setBrandLogoFile] = useState<File | null>(null);
    const [heroPreviewUrl, setHeroPreviewUrl] = useState<string | null>(content.hero.imageUrl);
    const [logoPreviewUrl, setLogoPreviewUrl] = useState<string | null>(content.brand.logoUrl);
    const { toast } = useToast();

    useEffect(() => {
        if(isOpen) {
            setCurrentContent(content);
            setHeroPreviewUrl(content.hero.imageUrl);
            setLogoPreviewUrl(content.brand.logoUrl);
            setHeroImageFile(null);
            setBrandLogoFile(null);
        }
    }, [isOpen, content]);

    const handleContentChange = (section: 'brand' | 'hero', field: string, value: string) => {
        setCurrentContent(prev => ({
            ...prev,
            [section]: { ...prev[section], [field]: value }
        }));
    };
    
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'hero' | 'logo') => {
        const file = e.target.files?.[0];
        if (file) {
            const isLogo = type === 'logo';
            const maxSize = isLogo ? 2 * 1024 * 1024 : 10 * 1024 * 1024; // 2MB for logo, 10MB for hero
            if (file.size > maxSize) {
                toast({ title: "File Too Large", description: `Please select an image smaller than ${isLogo ? '2MB' : '10MB'}.`, variant: "destructive" });
                return;
            }
            if (isLogo) {
                setBrandLogoFile(file);
                setLogoPreviewUrl(URL.createObjectURL(file));
            } else {
                setHeroImageFile(file);
                setHeroPreviewUrl(URL.createObjectURL(file));
            }
        }
    };

    const handleSubmit = () => {
        onSave(currentContent, { heroImage: heroImageFile, brandLogo: brandLogoFile });
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="max-w-3xl">
                <DialogHeader>
                    <DialogTitle>Edit Home Page Content</DialogTitle>
                    <DialogDescription>
                        Make changes to your homepage content and brand identity.
                    </DialogDescription>
                </DialogHeader>
                <ScrollArea className="h-[75vh] pr-6">
                    <div className="space-y-6 py-4">
                        <h3 className="font-semibold text-lg border-b pb-2">Brand Identity</h3>
                        <div className="grid gap-4">
                            <Label>Brand Name</Label>
                            <Input value={currentContent.brand.name} onChange={e => handleContentChange('brand', 'name', e.target.value)} />
                        </div>
                        <div className="grid gap-4">
                            <Label>Footer Description</Label>
                            <Textarea value={currentContent.brand.footerDescription} onChange={e => handleContentChange('brand', 'footerDescription', e.target.value)} />
                        </div>
                        <div className="grid gap-4">
                            <Label>Brand Logo</Label>
                            <input type="file" accept="image/*" onChange={e => handleFileChange(e, 'logo')} className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"/>
                            <p className="text-xs text-muted-foreground mt-1">Max file size: 2MB</p>
                            {logoPreviewUrl && <Image src={logoPreviewUrl} alt="Logo Preview" width={100} height={40} className="object-contain rounded mt-2" />}
                        </div>

                        <h3 className="font-semibold text-lg border-b pb-2 pt-6">Hero Section</h3>
                        <div className="grid gap-4">
                            <Label>Headline</Label>
                            <Input value={currentContent.hero.headline} onChange={e => handleContentChange('hero', 'headline', e.target.value)} />
                        </div>
                        <div className="grid gap-4">
                            <Label>Sub-headline</Label>
                            <Textarea value={currentContent.hero.subheadline} onChange={e => handleContentChange('hero', 'subheadline', e.target.value)} rows={3}/>
                        </div>
                        <div className="grid gap-4">
                            <Label>Background Image</Label>
                            <input type="file" accept="image/*" onChange={e => handleFileChange(e, 'hero')} className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"/>
                             <p className="text-xs text-muted-foreground mt-1">Max file size: 10MB</p>
                            {heroPreviewUrl && <Image src={heroPreviewUrl} alt="Hero Preview" width={200} height={112} className="rounded object-cover mt-2" />}
                        </div>
                         <div className="grid gap-4">
                            <Label>Image Hint</Label>
                            <Input value={currentContent.hero.imageHint} onChange={e => handleContentChange('hero', 'imageHint', e.target.value)} />
                        </div>
                    </div>
                </ScrollArea>
                <DialogFooter>
                    <Button type="button" onClick={handleSubmit}>Save Changes</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

interface SocialLinkEditDialogProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    socialLink: SocialLink | null;
    onSave: (linkData: SocialLink) => void;
}

function SocialLinkEditDialog({ isOpen, setIsOpen, socialLink, onSave }: SocialLinkEditDialogProps) {
    const [name, setName] = useState("");
    const [url, setUrl] = useState("");
    const [icon, setIcon] = useState("Facebook");
    const [id, setId] = useState("");
    const { toast } = useToast();

    useEffect(() => {
        if (isOpen) {
            if (socialLink) {
                setName(socialLink.name);
                setUrl(socialLink.url);
                setIcon(socialLink.icon);
                setId(socialLink.id);
            } else {
                setName("");
                setUrl("");
                setIcon("Facebook");
                setId(`social-${Date.now()}`);
            }
        }
    }, [socialLink, isOpen]);
    
    const handleSubmit = async () => {
        if (!name || !url || !icon) {
            toast({
                title: "Missing Fields",
                description: "Please fill out all fields before saving.",
                variant: "destructive",
            });
            return;
        }

        const linkData: SocialLink = { id, name, url, icon };
        onSave(linkData);
    }
    
    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{socialLink ? 'Edit Social Link' : 'Add New Social Link'}</DialogTitle>
                    <DialogDescription>
                        {socialLink ? 'Update the details for this social link.' : 'Fill in the details for the new social link.'}
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="social-name" className="text-right">Name</Label>
                        <Input id="social-name" value={name} onChange={(e) => setName(e.target.value)} className="col-span-3" />
                    </div>
                     <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="social-icon" className="text-right">Icon</Label>
                         <Select onValueChange={setIcon} defaultValue={icon}>
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Select an icon" />
                            </SelectTrigger>
                            <SelectContent>
                                {Object.keys(iconMap).map(iconKey => (
                                    <SelectItem key={iconKey} value={iconKey}>
                                        <div className="flex items-center gap-2">
                                            {iconMap[iconKey]}
                                            {iconKey}
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="social-url" className="text-right">URL</Label>
                        <Input id="social-url" value={url} onChange={(e) => setUrl(e.target.value)} className="col-span-3" />
                    </div>
                </div>
                <DialogFooter>
                    <Button type="button" onClick={handleSubmit}>Save Changes</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

interface ProductsSectionEditDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  content: ProductsSection;
  onSave: (content: ProductsSection) => void;
}

function ProductsSectionEditDialog({ isOpen, setIsOpen, content, onSave }: ProductsSectionEditDialogProps) {
  const [currentContent, setCurrentContent] = useState<ProductsSection>(content);

  useEffect(() => {
    if (isOpen) {
      setCurrentContent(content);
    }
  }, [isOpen, content]);

  const handleContentChange = (field: 'title' | 'description', value: string) => {
    setCurrentContent(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = () => {
    onSave(currentContent);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Products Section</DialogTitle>
          <DialogDescription>
            Update the title and description for the products section.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="products-title" className="text-right">Title</Label>
            <Input id="products-title" value={currentContent.title} onChange={(e) => handleContentChange('title', e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="products-description" className="text-right">Description</Label>
            <Textarea id="products-description" value={currentContent.description} onChange={(e) => handleContentChange('description', e.target.value)} className="col-span-3" />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" onClick={handleSubmit}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

interface GallerySectionEditDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  content: Pick<GalleryContent, 'title' | 'description'>;
  onSave: (content: Pick<GalleryContent, 'title' | 'description'>) => void;
}

function GallerySectionEditDialog({ isOpen, setIsOpen, content, onSave }: GallerySectionEditDialogProps) {
  const [currentContent, setCurrentContent] = useState(content);

  useEffect(() => {
    if (isOpen) {
      setCurrentContent(content);
    }
  }, [isOpen, content]);

  const handleContentChange = (field: 'title' | 'description', value: string) => {
    setCurrentContent(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = () => {
    onSave(currentContent);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Gallery Section</DialogTitle>
          <DialogDescription>
            Update the title and description for the gallery section.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="gallery-title" className="text-right">Title</Label>
            <Input id="gallery-title" value={currentContent.title} onChange={(e) => handleContentChange('title', e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="gallery-description" className="text-right">Description</Label>
            <Textarea id="gallery-description" value={currentContent.description} onChange={(e) => handleContentChange('description', e.target.value)} className="col-span-3" />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" onClick={handleSubmit}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

interface TestimonialsSectionEditDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  content: TestimonialsSection;
  onSave: (content: TestimonialsSection) => void;
}

function TestimonialsSectionEditDialog({ isOpen, setIsOpen, content, onSave }: TestimonialsSectionEditDialogProps) {
  const [currentContent, setCurrentContent] = useState<TestimonialsSection>(content);

  useEffect(() => {
    if (isOpen) {
      setCurrentContent(content);
    }
  }, [isOpen, content]);

  const handleContentChange = (field: 'title' | 'description', value: string) => {
    setCurrentContent(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = () => {
    onSave(currentContent);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Testimonials Section</DialogTitle>
          <DialogDescription>
            Update the title and description for the testimonials section.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="testimonials-title" className="text-right">Title</Label>
            <Input id="testimonials-title" value={currentContent.title} onChange={(e) => handleContentChange('title', e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="testimonials-description" className="text-right">Description</Label>
            <Textarea id="testimonials-description" value={currentContent.description} onChange={(e) => handleContentChange('description', e.target.value)} className="col-span-3" />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" onClick={handleSubmit}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

interface ContactSectionEditDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  content: ContactSection;
  onSave: (content: ContactSection) => void;
}

function ContactSectionEditDialog({ isOpen, setIsOpen, content, onSave }: ContactSectionEditDialogProps) {
  const [currentContent, setCurrentContent] = useState<ContactSection>(content);

  useEffect(() => {
    if (isOpen) {
      setCurrentContent(content);
    }
  }, [isOpen, content]);

  const handleContentChange = (field: 'title' | 'description', value: string) => {
    setCurrentContent(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = () => {
    onSave(currentContent);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Contact Section</DialogTitle>
          <DialogDescription>
            Update the title and description for the contact section.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="contact-title" className="text-right">Title</Label>
            <Input id="contact-title" value={currentContent.title} onChange={(e) => handleContentChange('title', e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="contact-description" className="text-right">Description</Label>
            <Textarea id="contact-description" value={currentContent.description} onChange={(e) => handleContentChange('description', e.target.value)} className="col-span-3" />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" onClick={handleSubmit}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

interface TermsEditDialogProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    content: TermsContent;
    onSave: (content: TermsContent) => void;
}

function TermsEditDialog({ isOpen, setIsOpen, content, onSave }: TermsEditDialogProps) {
    const [currentContent, setCurrentContent] = useState<TermsContent>(content);

    useEffect(() => {
        if(isOpen) {
            setCurrentContent(content);
        }
    }, [isOpen, content]);

    const handleContentChange = (field: keyof TermsContent, value: string) => {
        setCurrentContent(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = () => {
        onSave(currentContent);
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="max-w-3xl">
                <DialogHeader>
                    <DialogTitle>Edit Terms & Conditions</DialogTitle>
                    <DialogDescription>
                        Make changes to your Terms and Conditions page.
                    </DialogDescription>
                </DialogHeader>
                <ScrollArea className="h-[70vh] pr-6">
                    <div className="space-y-6 py-4">
                        <div className="grid gap-4">
                            <Label>Title</Label>
                            <Input value={currentContent.title} onChange={e => handleContentChange('title', e.target.value)} />
                        </div>
                        <div className="grid gap-4">
                            <Label>Content</Label>
                            <Textarea value={currentContent.content} onChange={e => handleContentChange('content', e.target.value)} rows={15}/>
                        </div>
                    </div>
                </ScrollArea>
                <DialogFooter>
                    <Button type="button" onClick={handleSubmit}>Save Changes</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

    

    