import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/contexts/CartContext';

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  reviews: number;
  isOnSale?: boolean;
  isFavorite?: boolean;
}

const ProductCard = ({ 
  id,
  name, 
  price, 
  originalPrice, 
  image, 
  rating, 
  reviews, 
  isOnSale = false,
  isFavorite = false 
}: ProductCardProps) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      id,
      name,
      price,
      originalPrice,
      image
    });
  };

  return (
    <div className="product-card group bg-card rounded-lg overflow-hidden shadow-soft border">
      {/* Image Container */}
      <Link to={`/product/${id}`} className="block">
        <div className="relative aspect-square overflow-hidden bg-muted">
          <img 
            src={image} 
            alt={name}
            className="product-card-image w-full h-full object-cover"
          />
        
        {/* Sale Badge */}
        {isOnSale && (
          <Badge className="absolute top-3 left-3 bg-destructive text-destructive-foreground">
            Sale
          </Badge>
        )}

        {/* Favorite Button */}
        <Button
          size="icon"
          variant="outline"
          className="absolute top-3 right-3 h-8 w-8 bg-white/90 backdrop-blur-sm border-white/20 hover:bg-white"
        >
          <Heart 
            className={`h-4 w-4 ${isFavorite ? 'fill-destructive text-destructive' : 'text-muted-foreground'}`}
          />
        </Button>

        {/* Quick Add Overlay */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <Button 
            className="hero-button"
            onClick={handleAddToCart}
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            Quick Add
          </Button>
        </div>
        </div>
      </Link>

      {/* Content */}
      <div className="p-4">
        {/* Rating */}
        <div className="flex items-center gap-1 mb-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-3 w-3 ${
                  i < Math.floor(rating)
                    ? 'text-premium fill-premium'
                    : 'text-muted-foreground'
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-muted-foreground">({reviews})</span>
        </div>

        {/* Product Name */}
        <Link to={`/product/${id}`}>
          <h3 className="font-semibold text-foreground mb-2 line-clamp-2 hover:text-primary transition-colors cursor-pointer">
            {name}
          </h3>
        </Link>

        {/* Price */}
        <div className="flex items-center gap-2 mb-4">
          <span className="price-highlight">
            ${price.toFixed(2)}
          </span>
          {originalPrice && (
            <span className="text-sm text-muted-foreground line-through">
              ${originalPrice.toFixed(2)}
            </span>
          )}
        </div>

        {/* Add to Cart Button */}
        <Button className="w-full" variant="outline" onClick={handleAddToCart}>
          <ShoppingCart className="h-4 w-4 mr-2" />
          Add to Cart
        </Button>
      </div>
    </div>
  );
};

export default ProductCard;