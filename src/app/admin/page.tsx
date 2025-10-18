
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
import { getGalleryImages, saveGalleryImages, GalleryImage } from "@/lib/gallery";
import { getTestimonials, saveTestimonials, Testimonial } from "@/lib/testimonials";
import { getPartners, savePartners, Partner } from "@/lib/partners";
import Image from 'next/image';
import { useToast } from "@/hooks/use-toast";
import { PlusCircle, Edit, Trash2, Star } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";


export default function AdminPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [partners, setPartners] = useState<Partner[]>([]);

  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
  const [isGalleryDialogOpen, setIsGalleryDialogOpen] = useState(false);
  const [isTestimonialDialogOpen, setIsTestimonialDialogOpen] = useState(false);
  const [isPartnerDialogOpen, setIsPartnerDialogOpen] = useState(false);

  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingGalleryImage, setEditingGalleryImage] = useState<GalleryImage | null>(null);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null);


  const { toast } = useToast();

  useEffect(() => {
    getProducts().then(setProducts);
    getGalleryImages().then(setGalleryImages);
    getTestimonials().then(setTestimonials);
    getPartners().then(setPartners);
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

  const openGalleryDialogForNew = () => {
    setEditingGalleryImage(null);
    setIsGalleryDialogOpen(true);
  };

  const openGalleryDialogForEdit = (image: GalleryImage) => {
    setEditingGalleryImage(image);
    setIsGalleryDialogOpen(true);
  };

  const handleGallerySave = async (imageData: Omit<GalleryImage, 'imageUrl'>, selectedFile: File | null) => {
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
        updatedImages = galleryImages.map(img => img.id === editingGalleryImage.id ? newImageData : img);
      } else {
        updatedImages = [...galleryImages, newImageData];
      }
      setGalleryImages(updatedImages);
      await saveGalleryImages(updatedImages);
      toast({
        title: "Changes Saved",
        description: "Gallery image has been saved successfully.",
      });
      setIsGalleryDialogOpen(false);
    } catch (error: any) {
      console.error(error);
      toast({
        title: "Save Failed",
        description: error.message || "Failed to save gallery image.",
        variant: "destructive",
      });
    }
  };

  const handleGalleryDelete = async (id: string) => {
    try {
      const updatedImages = galleryImages.filter(img => img.id !== id);
      setGalleryImages(updatedImages);
      await saveGalleryImages(updatedImages);
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

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Header />
      <main className="flex-1 bg-secondary">
        <section className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl space-y-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="font-headline text-2xl">
                    Product Management
                  </CardTitle>
                  <CardDescription>
                    Add, edit, or remove products from your store.
                  </CardDescription>
                </div>
                <Button onClick={openProductDialogForNew} style={{ backgroundColor: 'hsl(var(--accent))', color: 'hsl(var(--accent-foreground))' }}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Product
                </Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product Name</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map((product) => (
                      <TableRow key={product.name}>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell className="text-muted-foreground">{product.description}</TableCell>
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

            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="font-headline text-2xl">
                    Gallery Management
                  </CardTitle>
                  <CardDescription>
                    Add, edit, or remove images from your gallery.
                  </CardDescription>
                </div>
                <Button onClick={openGalleryDialogForNew} style={{ backgroundColor: 'hsl(var(--accent))', color: 'hsl(var(--accent-foreground))' }}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Image
                </Button>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {galleryImages.map((image) => (
                    <div key={image.id} className="relative group">
                      <Image
                        src={image.imageUrl}
                        alt={image.description}
                        width={200}
                        height={200}
                        className="rounded-lg object-cover aspect-square"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg">
                          <Button variant="ghost" size="icon" onClick={() => openGalleryDialogForEdit(image)}>
                            <Edit className="h-5 w-5 text-white" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleGalleryDelete(image.id)}>
                            <Trash2 className="h-5 w-5 text-destructive" />
                          </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="font-headline text-2xl">
                    Testimonial Management
                  </CardTitle>
                  <CardDescription>
                    Add, edit, or remove testimonials from your home page.
                  </CardDescription>
                </div>
                <Button onClick={openTestimonialDialogForNew} style={{ backgroundColor: 'hsl(var(--accent))', color: 'hsl(var(--accent-foreground))' }}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Testimonial
                </Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Author</TableHead>
                      <TableHead>Quote</TableHead>
                      <TableHead>Rating</TableHead>
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
                        <TableCell className="text-muted-foreground truncate max-w-sm">{testimonial.quote}</TableCell>
                        <TableCell>
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

            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="font-headline text-2xl">
                    Partner Management
                  </CardTitle>
                  <CardDescription>
                    Manage your proud partner logos.
                  </CardDescription>
                </div>
                <Button onClick={openPartnerDialogForNew} style={{ backgroundColor: 'hsl(var(--accent))', color: 'hsl(var(--accent-foreground))' }}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Partner
                </Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Partner Name</TableHead>
                      <TableHead>Logo</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {partners.map((partner) => (
                      <TableRow key={partner.id}>
                        <TableCell className="font-medium">{partner.name}</TableCell>
                        <TableCell>
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

          </div>
        </section>
      </main>
      <Footer />
      <ProductEditDialog 
        isOpen={isProductDialogOpen}
        setIsOpen={setIsProductDialogOpen}
        product={editingProduct}
        onSave={handleProductSave}
      />
      <GalleryEditDialog
        isOpen={isGalleryDialogOpen}
        setIsOpen={setIsGalleryDialogOpen}
        image={editingGalleryImage}
        onSave={handleGallerySave}
      />
      <TestimonialEditDialog
        isOpen={isTestimonialDialogOpen}
        setIsOpen={setIsTestimonialDialogOpen}
        testimonial={editingTestimonial}
        onSave={handleTestimonialSave}
      />
      <PartnerEditDialog
        isOpen={isPartnerDialogOpen}
        setIsOpen={setIsPartnerDialogOpen}
        partner={editingPartner}
        onSave={handlePartnerSave}
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
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const { toast } = useToast();

    useEffect(() => {
        if (isOpen) {
            if (product) {
                setName(product.name);
                setDescription(product.description);
                setImageId(product.imageId);
                setPreviewUrl(product.imageUrl);
            } else {
                setName("");
                setDescription("");
                setImageId("");
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

    const handleSubmit = async () => {
        if (!name || !description || !imageId) {
            toast({
                title: "Missing Fields",
                description: "Please fill out all fields before saving.",
                variant: "destructive",
            });
            return;
        }

        const productData: Product = {
            name,
            description,
            imageId,
            imageUrl: product?.imageUrl || previewUrl
        };
        
        onSave(productData, selectedFile);
    }
    
    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{product ? 'Edit Product' : 'Add New Product'}</DialogTitle>
                    <DialogDescription>
                        {product ? 'Update the details for this product.' : 'Fill in the details for the new product.'}
                    </DialogDescription>
                </DialogHeader>
                <ScrollArea className="h-[60vh] pr-6">
                    <div className="grid gap-4 py-4">
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
                    </div>
                </ScrollArea>
                <DialogFooter>
                    <Button type="button" onClick={handleSubmit}>Save Changes</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

interface GalleryEditDialogProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    image: GalleryImage | null;
    onSave: (imageData: Omit<GalleryImage, 'imageUrl'>, selectedFile: File | null) => void;
}

function GalleryEditDialog({ isOpen, setIsOpen, image, onSave }: GalleryEditDialogProps) {
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

    
