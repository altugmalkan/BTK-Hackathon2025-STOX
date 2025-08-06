import { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import { api, Product } from '@/lib/api';

const FeaturedProducts = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch featured products from API
  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await api.getActiveProducts();
        // Take first 6 products as featured
        setFeaturedProducts((response.data || []).slice(0, 6));
      } catch (err) {
        console.error('Failed to fetch featured products:', err);
        setError('Failed to load featured products.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchFeaturedProducts();
  }, []);
  
  // Helper function to get primary image URL
  const getPrimaryImageUrl = (images: any[]) => {
    if (!images || images.length === 0) {
      return '/placeholder-product.jpg';
    }
    return images[0]?.imageUrl || '/placeholder-product.jpg';
  };
  
  // Transform Product to ProductCard props
  const transformProductToCardProps = (product: Product) => ({
    id: product.id,
    name: product.title,
    price: product.price,
    image: getPrimaryImageUrl(product.images),
    rating: 4.5, // Default rating
    reviews: 0, // Default reviews count
    isOnSale: false,
    isFavorite: false
  });

  return (
    <section className="py-16 bg-gradient-surface">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">
            Featured
            <span className="bg-gradient-primary bg-clip-text text-transparent ml-2">
              Products
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover our carefully curated collection of premium products, 
            handpicked for quality and style.
          </p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-sm text-muted-foreground">Loading featured products...</p>
          </div>
        )}
        
        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <p className="text-destructive mb-4">{error}</p>
          </div>
        )}
        
        {/* Products Grid */}
        {!isLoading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} {...transformProductToCardProps(product)} />
            ))}
          </div>
        )}

        {/* View All Button */}
        <div className="text-center mt-12">
          <button className="hero-button px-8 py-3 rounded-lg font-semibold transition-all duration-300">
            View All Products
          </button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;