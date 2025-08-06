import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Search, Package, Eye, Edit, MoreHorizontal } from "lucide-react";
import { toast } from "sonner";
import { api, Product } from "@/lib/api";

const ProductList = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Load seller's products
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await api.getMyProducts();
        if (response.success) {
          setProducts(response.data);
          setFilteredProducts(response.data);
        }
      } catch (error) {
        toast.error("Failed to load products", {
          description: "Please try again later."
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
  }, []);

  // Filter products based on search term and status
  useEffect(() => {
    let filtered = products;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.categoryName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter(product => product.status === Number(statusFilter));
    }

    setFilteredProducts(filtered);
  }, [products, searchTerm, statusFilter]);

  const updateProductStatus = async (productId: string, newStatus: 0 | 1 | 2) => {
    try {
      const response = await api.updateProductStatus(productId, newStatus);
      if (response.success) {
        // Update the product in the local state
        setProducts(prev => prev.map(product =>
          product.id === productId ? { ...product, status: newStatus } : product
        ));
        
        const statusText = newStatus === 0 ? "Draft" : newStatus === 1 ? "Active" : "Blocked";
        toast.success(`Product status updated to ${statusText}`);
      }
    } catch (error) {
      toast.error("Failed to update product status", {
        description: "Please try again."
      });
    }
  };

  const getStatusBadge = (status: number) => {
    switch (status) {
      case 0:
        return <Badge variant="secondary">Draft</Badge>;
      case 1:
        return <Badge variant="default" className="bg-green-500">Active</Badge>;
      case 2:
        return <Badge variant="destructive">Blocked</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getStatusColor = (status: number) => {
    switch (status) {
      case 0:
        return "text-yellow-600";
      case 1:
        return "text-green-600";
      case 2:
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="0">Draft</SelectItem>
            <SelectItem value="1">Active</SelectItem>
            <SelectItem value="2">Blocked</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
        </p>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Package className="w-12 h-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No products found</h3>
            <p className="text-muted-foreground text-center mb-4">
              {searchTerm || statusFilter !== "all" 
                ? "Try adjusting your search or filter criteria."
                : "You haven't added any products yet. Start by creating your first product."
              }
            </p>
            {!searchTerm && statusFilter === "all" && (
              <Button className="flex items-center gap-2">
                <Package className="w-4 h-4" />
                Add Your First Product
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-square bg-muted relative overflow-hidden">
                {product.images && product.images.length > 0 ? (
                  <img
                    src={product.images.find(img => img.isPrimary)?.imageUrl || product.images[0].imageUrl}
                    alt={product.images.find(img => img.isPrimary)?.altText || product.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "/placeholder.svg";
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-muted">
                    <Package className="w-12 h-12 text-muted-foreground" />
                  </div>
                )}
                
                <div className="absolute top-2 right-2">
                  {getStatusBadge(product.status)}
                </div>
              </div>

              <CardHeader className="p-4">
                <div className="space-y-2">
                  <CardTitle className="text-lg line-clamp-2">{product.title}</CardTitle>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {product.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-primary">
                      ${product.price.toFixed(2)}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      Stock: {product.stock}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      {product.categoryName}
                    </span>
                    <span className="text-muted-foreground">
                      {new Date(product.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-4 pt-0">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => window.open(`/product/${product.id}`, '_blank')}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View
                  </Button>
                  
                  <Select
                    value={product.status.toString()}
                    onValueChange={(value) => updateProductStatus(product.id, Number(value) as 0 | 1 | 2)}
                  >
                    <SelectTrigger className="w-[120px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">Draft</SelectItem>
                      <SelectItem value="1">Active</SelectItem>
                      <SelectItem value="2">Blocked</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductList; 