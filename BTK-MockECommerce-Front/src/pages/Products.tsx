import { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Filter, SortAsc, SortDesc, Grid, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ProductCard from "@/components/ProductCard";
import { api, Product, Category } from "@/lib/api";

const Products = () => {
  const [sortBy, setSortBy] = useState("featured");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch products and categories from API
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const [productsResponse, categoriesResponse] = await Promise.all([
          api.getActiveProducts(),
          api.getCategories(),
        ]);

        setProducts(productsResponse.data || []);
        setCategories(categoriesResponse.data || []);
      } catch (err) {
        console.error("Failed to fetch data:", err);
        setError("Failed to load products. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Helper function to get primary image URL from product images
  const getPrimaryImageUrl = (images: any[]) => {
    if (!images || images.length === 0) {
      return "/placeholder-product.jpg"; // fallback image
    }
    return images[0]?.imageUrl || "/placeholder-product.jpg";
  };

  // Transform Product to ProductCard props
  const transformProductToCardProps = (product: Product) => ({
    id: product.id,
    name: product.title,
    price: product.price,
    image: getPrimaryImageUrl(product.images),
    rating: 4.5, // Default rating since API doesn't provide this
    reviews: 0, // Default reviews count
    isOnSale: false, // Could be determined by comparing with original price
    isFavorite: false, // Would need user favorites data
  });

  // Filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
    const filtered = products.filter((product) => {
      const inPriceRange =
        product.price >= priceRange[0] && product.price <= priceRange[1];
      const inCategory =
        selectedCategory === "all" || product.categoryId === selectedCategory;
      return inPriceRange && inCategory;
    });

    // Sort products
    switch (sortBy) {
      case "price-low":
        return filtered.sort((a, b) => a.price - b.price);
      case "price-high":
        return filtered.sort((a, b) => b.price - a.price);
      case "newest":
        return filtered.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      default:
        return filtered;
    }
  }, [products, sortBy, priceRange, selectedCategory]);

  // Build categories list from API data
  const categoriesWithAll = useMemo(() => {
    const allOption = { id: "all", categoryName: "All Categories" };
    return [allOption, ...categories];
  }, [categories]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button variant="outline" size="sm" asChild>
            <Link to="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
          </Button>
        </div>

        {/* Page Title */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-4">
            All Products
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover our complete collection of premium products, carefully
            curated for quality and style.
          </p>
        </div>

        {/* Filters and Controls */}
        <div className="flex flex-col lg:flex-row gap-6 mb-8">
          {/* Category Filters */}
          <div className="flex items-center gap-2 flex-wrap">
            {categoriesWithAll.map((category) => (
              <Button
                key={category.id}
                variant={
                  selectedCategory === category.id ? "default" : "outline"
                }
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
              >
                {category.categoryName}
              </Button>
            ))}
          </div>

          {/* Sort and View Controls */}
          <div className="flex items-center gap-4 ml-auto">
            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <SortAsc className="h-4 w-4 text-muted-foreground" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-1 border rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="reviews">Most Reviewed</option>
                <option value="newest">Newest First</option>
              </select>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-1 border rounded-md p-1">
              <Button
                size="sm"
                variant={viewMode === "grid" ? "default" : "ghost"}
                onClick={() => setViewMode("grid")}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant={viewMode === "list" ? "default" : "ghost"}
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Price Range Filter */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Price Range:</span>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={priceRange[0]}
                  onChange={(e) =>
                    setPriceRange([
                      parseInt(e.target.value) || 0,
                      priceRange[1],
                    ])
                  }
                  className="w-20 px-2 py-1 border rounded text-sm"
                  placeholder="Min"
                />
                <span className="text-muted-foreground">-</span>
                <input
                  type="number"
                  value={priceRange[1]}
                  onChange={(e) =>
                    setPriceRange([
                      priceRange[0],
                      parseInt(e.target.value) || 2000,
                    ])
                  }
                  className="w-20 px-2 py-1 border rounded text-sm"
                  placeholder="Max"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-sm text-muted-foreground">
              Loading products...
            </p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <p className="text-xl text-destructive mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </div>
        )}

        {/* Results Count */}
        {!isLoading && !error && (
          <div className="flex items-center justify-between mb-6">
            <p className="text-muted-foreground">
              Showing {filteredAndSortedProducts.length} of {products.length}{" "}
              products
            </p>
            {filteredAndSortedProducts.length !== products.length && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSelectedCategory("all");
                  setPriceRange([0, 2000]);
                }}
              >
                Clear Filters
              </Button>
            )}
          </div>
        )}

        {/* Products Grid/List */}
        {!isLoading && !error && (
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                : "space-y-4"
            }
          >
            {filteredAndSortedProducts.map((product) => (
              <ProductCard
                key={product.id}
                {...transformProductToCardProps(product)}
              />
            ))}
          </div>
        )}

        {/* No Results */}
        {filteredAndSortedProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-xl text-muted-foreground mb-4">
              No products found matching your criteria.
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSelectedCategory("all");
                setPriceRange([0, 2000]);
              }}
            >
              Clear All Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
