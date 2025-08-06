import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { X, Upload, Plus, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { api, Category, CreateProductRequest } from "@/lib/api";

interface ProductImage {
  imageUrl: string;
  altText: string;
  isPrimary: boolean;
  displayOrder: number;
}

const AddProductForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState({
    categoryId: "",
    title: "",
    description: "",
    price: "",
    stock: "",
    status: "0" as "0" | "1" | "2"
  });
  const [images, setImages] = useState<ProductImage[]>([]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Load categories on component mount
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await api.getCategories();
        if (response.success) {
          setCategories(response.data);
        }
      } catch (error) {
        toast.error("Failed to load categories", {
          description: "Please try again later."
        });
      }
    };

    loadCategories();
  }, []);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const addImage = () => {
    const newImage: ProductImage = {
      imageUrl: "",
      altText: "",
      isPrimary: images.length === 0, // First image is primary by default
      displayOrder: images.length
    };
    setImages(prev => [...prev, newImage]);
  };

  const removeImage = (index: number) => {
    setImages(prev => {
      const newImages = prev.filter((_, i) => i !== index);
      // Update display order and primary status
      return newImages.map((img, i) => ({
        ...img,
        displayOrder: i,
        isPrimary: i === 0 // First remaining image becomes primary
      }));
    });
  };

  const updateImage = (index: number, field: keyof ProductImage, value: string | boolean | number) => {
    setImages(prev => prev.map((img, i) => 
      i === index ? { ...img, [field]: value } : img
    ));
  };

  const setPrimaryImage = (index: number) => {
    setImages(prev => prev.map((img, i) => ({
      ...img,
      isPrimary: i === index
    })));
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.categoryId) {
      newErrors.categoryId = "Category is required";
    }

    if (!formData.title.trim()) {
      newErrors.title = "Product title is required";
    } else if (formData.title.trim().length < 3) {
      newErrors.title = "Title must be at least 3 characters";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Product description is required";
    } else if (formData.description.trim().length < 10) {
      newErrors.description = "Description must be at least 10 characters";
    }

    if (!formData.price) {
      newErrors.price = "Price is required";
    } else if (isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
      newErrors.price = "Price must be a positive number";
    }

    if (!formData.stock) {
      newErrors.stock = "Stock quantity is required";
    } else if (isNaN(Number(formData.stock)) || Number(formData.stock) < 0) {
      newErrors.stock = "Stock must be a non-negative number";
    }

    if (images.length === 0) {
      newErrors.images = "At least one product image is required";
    } else {
      // Validate each image
      images.forEach((image, index) => {
        if (!image.imageUrl.trim()) {
          newErrors[`image${index}Url`] = "Image URL is required";
        }
        if (!image.altText.trim()) {
          newErrors[`image${index}Alt`] = "Image alt text is required";
        }
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const productData: CreateProductRequest = {
        categoryId: formData.categoryId,
        title: formData.title.trim(),
        description: formData.description.trim(),
        price: Number(formData.price),
        stock: Number(formData.stock),
        status: Number(formData.status) as 0 | 1 | 2,
        images: images.map(img => ({
          imageUrl: img.imageUrl.trim(),
          altText: img.altText.trim(),
          isPrimary: img.isPrimary,
          displayOrder: img.displayOrder
        }))
      };

      const response = await api.createProduct(productData);
      
      if (response.success) {
        toast.success("Product created successfully!", {
          description: "Your product has been added to your store."
        });
        
        // Reset form
        setFormData({
          categoryId: "",
          title: "",
          description: "",
          price: "",
          stock: "",
          status: "0"
        });
        setImages([]);
        setErrors({});
      }
    } catch (error) {
      toast.error("Failed to create product", {
        description: error instanceof Error ? error.message : "Please try again."
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="category">Category *</Label>
          <Select
            value={formData.categoryId}
            onValueChange={(value) => handleInputChange("categoryId", value)}
          >
            <SelectTrigger className={errors.categoryId ? "border-destructive" : ""}>
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.categoryName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.categoryId && (
            <p className="text-sm text-destructive">{errors.categoryId}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select
            value={formData.status}
            onValueChange={(value) => handleInputChange("status", value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">Draft</SelectItem>
              <SelectItem value="1">Active</SelectItem>
              <SelectItem value="2">Blocked</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="title">Product Title *</Label>
        <Input
          id="title"
          placeholder="Enter product title"
          value={formData.title}
          onChange={(e) => handleInputChange("title", e.target.value)}
          className={errors.title ? "border-destructive" : ""}
        />
        {errors.title && (
          <p className="text-sm text-destructive">{errors.title}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description *</Label>
        <Textarea
          id="description"
          placeholder="Enter product description"
          value={formData.description}
          onChange={(e) => handleInputChange("description", e.target.value)}
          className={errors.description ? "border-destructive" : ""}
          rows={4}
        />
        {errors.description && (
          <p className="text-sm text-destructive">{errors.description}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="price">Price *</Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
            value={formData.price}
            onChange={(e) => handleInputChange("price", e.target.value)}
            className={errors.price ? "border-destructive" : ""}
          />
          {errors.price && (
            <p className="text-sm text-destructive">{errors.price}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="stock">Stock Quantity *</Label>
          <Input
            id="stock"
            type="number"
            min="0"
            placeholder="0"
            value={formData.stock}
            onChange={(e) => handleInputChange("stock", e.target.value)}
            className={errors.stock ? "border-destructive" : ""}
          />
          {errors.stock && (
            <p className="text-sm text-destructive">{errors.stock}</p>
          )}
        </div>
      </div>

      {/* Product Images */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>Product Images *</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addImage}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Image
          </Button>
        </div>

        {errors.images && (
          <p className="text-sm text-destructive">{errors.images}</p>
        )}

        {images.length === 0 && (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-8">
              <ImageIcon className="w-12 h-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground text-center mb-4">
                No images added yet. Add at least one product image.
              </p>
              <Button
                type="button"
                variant="outline"
                onClick={addImage}
                className="flex items-center gap-2"
              >
                <Upload className="w-4 h-4" />
                Add First Image
              </Button>
            </CardContent>
          </Card>
        )}

        {images.map((image, index) => (
          <Card key={index} className="p-4">
            <div className="flex items-start gap-4">
              <div className="flex-1 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`imageUrl-${index}`}>Image URL *</Label>
                    <Input
                      id={`imageUrl-${index}`}
                      placeholder="https://example.com/image.jpg"
                      value={image.imageUrl}
                      onChange={(e) => updateImage(index, "imageUrl", e.target.value)}
                      className={errors[`image${index}Url`] ? "border-destructive" : ""}
                    />
                    {errors[`image${index}Url`] && (
                      <p className="text-sm text-destructive">{errors[`image${index}Url`]}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`altText-${index}`}>Alt Text *</Label>
                    <Input
                      id={`altText-${index}`}
                      placeholder="Product image description"
                      value={image.altText}
                      onChange={(e) => updateImage(index, "altText", e.target.value)}
                      className={errors[`image${index}Alt`] ? "border-destructive" : ""}
                    />
                    {errors[`image${index}Alt`] && (
                      <p className="text-sm text-destructive">{errors[`image${index}Alt`]}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      id={`primary-${index}`}
                      name="primaryImage"
                      checked={image.isPrimary}
                      onChange={() => setPrimaryImage(index)}
                      className="w-4 h-4"
                    />
                    <Label htmlFor={`primary-${index}`} className="text-sm">
                      Primary Image
                    </Label>
                  </div>

                  <Badge variant="secondary">
                    Order: {image.displayOrder + 1}
                  </Badge>

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeImage(index)}
                    className="flex items-center gap-2 text-destructive hover:text-destructive"
                  >
                    <X className="w-4 h-4" />
                    Remove
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Separator />

      {/* Submit Button */}
      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={isLoading}
          className="min-w-[120px]"
        >
          {isLoading ? "Creating..." : "Create Product"}
        </Button>
      </div>
    </form>
  );
};

export default AddProductForm; 