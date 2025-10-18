
"use client";

import { useState } from "react";
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
import { products as initialProducts } from "@/components/sections/products";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import Image from 'next/image';
import { toast } from "@/hooks/use-toast";
import { PlusCircle, Edit, Trash2 } from "lucide-react";

type Product = typeof initialProducts[0];

export default function AdminPage() {
  const [products, setProducts] = useState(initialProducts);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const openDialogForNew = () => {
    setEditingProduct(null);
    setIsDialogOpen(true);
  };

  const openDialogForEdit = (product: Product) => {
    setEditingProduct(product);
    setIsDialogOpen(true);
  };
  
  const handleSaveChanges = (productData: Product) => {
    toast({
        title: "Changes Not Saved",
        description: "This is a demo. Changes are not saved without a database.",
        variant: "destructive",
    });
    // This is where you would save to a database.
    // For now, we just close the dialog.
    setIsDialogOpen(false);
  };

  const handleDelete = (productName: string) => {
     toast({
        title: "Product Not Deleted",
        description: "This is a demo. Deleting products is not enabled without a database.",
        variant: "destructive",
    });
    // This is where you would delete from a database.
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

    React.useEffect(() => {
        if (product) {
            setName(product.name);
            setDescription(product.description);
            setImageId(product.imageId);
        } else {
            setName("");
            setDescription("");
            setImageId("");
        }
    }, [product, isOpen]);

    const handleSubmit = () => {
        if (!name || !description || !imageId) {
            toast({
                title: "Missing Fields",
                description: "Please fill out all fields before saving.",
                variant: "destructive",
            });
            return;
        }
        onSave({ name, description, imageId });
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
                            <input type="file" className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20" disabled/>
                             <p className="text-xs text-muted-foreground mt-2">File uploads are disabled in this demo.</p>
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

