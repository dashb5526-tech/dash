
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
import Image from 'next/image';
import { useToast } from "@/hooks/use-toast";
import { PlusCircle, Edit, Trash2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";


export default function AdminPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const { toast } = useToast();

  useEffect(() => {
    getProducts().then(setProducts);
  }, []);

  const openDialogForNew = () => {
    setEditingProduct(null);
    setIsDialogOpen(true);
  };

  const openDialogForEdit = (product: Product) => {
    setEditingProduct(product);
    setIsDialogOpen(true);
  };
  
  const handleSaveChanges = async (productData: Product) => {
    try {
      let updatedProducts;
      if (editingProduct) {
        // Update existing product
        updatedProducts = products.map(p => p.name === editingProduct.name ? productData : p);
      } else {
        // Add new product
        updatedProducts = [...products, productData];
      }
      setProducts(updatedProducts);
      await saveProducts(updatedProducts);
      toast({
        title: "Changes Saved",
        description: "Product has been saved successfully.",
      });
    } catch (error) {
      toast({
        title: "Save Failed",
        description: "Failed to save product changes.",
        variant: "destructive",
      });
    }
    setIsDialogOpen(false);
  };

  const handleDelete = async (productName: string) => {
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

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Header />
      <main className="flex-1 bg-secondary">
        <section className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
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
                <Button onClick={openDialogForNew} style={{ backgroundColor: 'hsl(var(--accent))', color: 'hsl(var(--accent-foreground))' }}>
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
                          <Button variant="ghost" size="icon" onClick={() => openDialogForEdit(product)}>
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDelete(product.name)}>
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
        isOpen={isDialogOpen}
        setIsOpen={setIsDialogOpen}
        product={editingProduct}
        onSave={handleSaveChanges}
      />
    </div>
  );
}

interface ProductEditDialogProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    product: Product | null;
    onSave: (productData: Product) => void;
}

function ProductEditDialog({ isOpen, setIsOpen, product, onSave }: ProductEditDialogProps) {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [imageId, setImageId] = useState("");
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const { toast } = useToast();

    useEffect(() => {
        if (product) {
            setName(product.name);
            setDescription(product.description);
            setImageId(product.imageId);
            setImageUrl(product.imageUrl);
            setPreviewUrl(product.imageUrl);
        } else {
            setName("");
            setDescription("");
            setImageId("");
            setImageUrl(null);
            setPreviewUrl(null);
        }
        setSelectedFile(null);
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

        let finalImageUrl = imageUrl;

        if (selectedFile) {
            try {
                const formData = new FormData();
                formData.append('file', selectedFile);

                const response = await fetch('/api/upload', {
                    method: 'POST',
                    body: formData,
                });

                if (!response.ok) {
                    throw new Error('Upload failed');
                }

                const result = await response.json();
                finalImageUrl = result.imageUrl;
            } catch (error) {
                toast({
                    title: "Upload Failed",
                    description: "Failed to upload image. Please try again.",
                    variant: "destructive",
                });
                return;
            }
        }

        onSave({ name, description, imageId, imageUrl: finalImageUrl });
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
                            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="col-span-3" />
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
