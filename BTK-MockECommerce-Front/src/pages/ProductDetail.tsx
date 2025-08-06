import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { 
  Heart, 
  ShoppingCart, 
  Star, 
  Plus, 
  Minus, 
  Share2, 
  ArrowLeft,
  Truck,
  Shield,
  RotateCcw
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { useCart } from "@/contexts/CartContext";
import { api, Review, Product } from "@/lib/api";

// We'll fetch real product data from the API

const ProductDetail = () => {
  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoadingReviews, setIsLoadingReviews] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 5, comment: "" });
  const [isFavorite, setIsFavorite] = useState(false);
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [isLoadingProduct, setIsLoadingProduct] = useState(true);
  const [productError, setProductError] = useState<string | null>(null);
  const { addToCart } = useCart();

  const handleQuantityChange = (change: number) => {
    if (!product) return;
    setQuantity(prev => Math.max(1, Math.min(product.stock, prev + change)));
  };

  const handleAddToCart = () => {
    if (!product) return;
    
    // Add the selected quantity to cart
    for (let i = 0; i < quantity; i++) {
      addToCart({
        id: product.id,
        title: product.title,
        price: product.price,
        image: getPrimaryImageUrl(product.images),
        sellerId: product.sellerId,
        sellerName: product.sellerName,
        stock: product.stock,
        categoryName: product.categoryName
      });
    }
  };
  
  // Helper function to get primary image URL
  const getPrimaryImageUrl = (images: { imageUrl: string }[] | undefined) => {
    if (!images || images.length === 0) {
      return '/placeholder-product.jpg';
    }
    return images[0]?.imageUrl || '/placeholder-product.jpg';
  };

  // Fetch product data when component mounts
  useEffect(() => {
    const fetchProductData = async () => {
      if (!id) return;
      
      setIsLoadingProduct(true);
      setProductError(null);
      
      try {
        const [productResponse, allProductsResponse] = await Promise.all([
          api.getProductById(id),
          api.getActiveProducts()
        ]);
        
        setProduct(productResponse.data);
        
        // Set related products (exclude current product)
        const related = (allProductsResponse.data || [])
          .filter(p => p.id !== id)
          .slice(0, 4);
        setRelatedProducts(related);
        
      } catch (error) {
        console.error("Failed to fetch product:", error);
        setProductError("Failed to load product. Please try again later.");
      } finally {
        setIsLoadingProduct(false);
      }
    };

    fetchProductData();
  }, [id]);
  
  // Fetch reviews when component mounts
  useEffect(() => {
    const fetchReviews = async () => {
      if (!id) return;
      
      setIsLoadingReviews(true);
      try {
        const reviewsResponse = await api.getReviewsByProduct(id);
        setReviews(reviewsResponse.data || []);
      } catch (error) {
        console.error("Failed to fetch reviews:", error);
      } finally {
        setIsLoadingReviews(false);
      }
    };

    fetchReviews();
  }, [id]);

  const handleSubmitReview = async () => {
    if (!id || !newReview.comment.trim()) return;
    
    try {
      const reviewData = {
        productId: id,
        userId: "current-user-id", // In a real implementation, this would come from auth context
        rating: newReview.rating,
        comment: newReview.comment
      };
      
      await api.addReview(reviewData);
      
      // Refresh reviews
      const updatedReviewsResponse = await api.getReviewsByProduct(id);
      setReviews(updatedReviewsResponse.data || []);
      
      // Reset form
      setNewReview({ rating: 5, comment: "" });
      setShowReviewForm(false);
    } catch (error) {
      console.error("Failed to submit review:", error);
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(rating) 
            ? "fill-premium text-premium" 
            : "text-muted-foreground"
        }`}
      />
    ));
  };

  // Loading state
  if (isLoadingProduct) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-sm text-muted-foreground">Loading product...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  // Error state
  if (productError || !product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <p className="text-xl text-destructive mb-4">{productError || "Product not found"}</p>
            <Link to="/products">
              <Button>Back to Products</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
          <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
          <span>/</span>
          <Link to="/products" className="hover:text-foreground transition-colors">Products</Link>
          <span>/</span>
          <span className="text-foreground">{product.title}</span>
        </div>

        {/* Back Button */}
        <Button variant="ghost" size="sm" className="mb-6" asChild>
          <Link to="/products">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Products
          </Link>
        </Button>

        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="aspect-square bg-muted rounded-lg overflow-hidden">
              <img
                src={product.images && product.images.length > 0 ? product.images[selectedImage]?.imageUrl || '/placeholder-product.jpg' : '/placeholder-product.jpg'}
                alt={product.title}
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
              />
            </div>
            
            {/* Thumbnail Images */}
            <div className="flex gap-4">
              {product.images && product.images.length > 0 && product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImage === index 
                      ? "border-primary shadow-medium" 
                      : "border-transparent hover:border-muted-foreground"
                  }`}
                >
                  <img
                    src={image.imageUrl || '/placeholder-product.jpg'}
                    alt={`${product.title} view ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Title & Rating */}
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">{product.title}</h1>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  {renderStars(4.5)}
                  <span className="text-sm text-muted-foreground ml-2">
                    4.5 ({reviews.length} reviews)
                  </span>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {product.stock > 0 ? "In Stock" : "Out of Stock"}
                </Badge>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-center gap-4">
              <span className="text-3xl font-bold price-highlight">${product.price}</span>
            </div>

            {/* Description */}
            <p className="text-muted-foreground leading-relaxed">{product.description}</p>

            {/* Quantity & Actions */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="font-medium">Quantity:</span>
                <div className="flex items-center border rounded-lg">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                    className="px-3"
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="px-4 py-2 min-w-[60px] text-center">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= product.stock}
                    className="px-3"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <span className="text-sm text-muted-foreground">
                  {product.stock} available
                </span>
              </div>

              <div className="flex gap-4">
                <Button
                  onClick={handleAddToCart}
                  className="flex-1 bg-gradient-primary hover:opacity-90 text-primary-foreground font-semibold py-3 transition-all duration-300 hover:scale-[1.02]"
                  disabled={product.stock === 0}
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Add to Cart
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setIsFavorite(!isFavorite)}
                  className={`px-4 ${isFavorite ? "text-destructive border-destructive" : ""}`}
                >
                  <Heart className={`w-5 h-5 ${isFavorite ? "fill-current" : ""}`} />
                </Button>
                <Button variant="outline" className="px-4">
                  <Share2 className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Shipping Info */}
            <div className="bg-muted/50 rounded-lg p-4 space-y-3">
              <div className="flex items-center gap-3">
                <Truck className="w-5 h-5 text-success" />
                <span className="text-sm">Free shipping on orders over $50</span>
              </div>
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-success" />
                <span className="text-sm">2-year warranty included</span>
              </div>
              <div className="flex items-center gap-3">
                <RotateCcw className="w-5 h-5 text-success" />
                <span className="text-sm">30-day return policy</span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <Tabs defaultValue="description" className="mb-16">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="specifications">Specifications</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>
          
          <TabsContent value="description" className="mt-6">
            <div className="prose max-w-none">
              <h3 className="text-xl font-semibold mb-4">Product Description</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                {product.description}
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="specifications" className="mt-6">
            <h3 className="text-xl font-semibold mb-4">Product Information</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex justify-between py-2 border-b">
                <span className="font-medium">Category:</span>
                <span className="text-muted-foreground">{product.categoryName}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="font-medium">Seller:</span>
                <span className="text-muted-foreground">{product.sellerName}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="font-medium">Stock:</span>
                <span className="text-muted-foreground">{product.stock} units</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="font-medium">Status:</span>
                <span className="text-muted-foreground">{product.isActive ? 'Active' : 'Inactive'}</span>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="reviews" className="mt-6">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold">Customer Reviews</h3>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowReviewForm(!showReviewForm)}
                >
                  {showReviewForm ? "Cancel" : "Write a Review"}
                </Button>
              </div>
              
              {/* Review Form */}
              {showReviewForm && (
                <div className="border rounded-lg p-4 space-y-4">
                  <h4 className="font-semibold">Write Your Review</h4>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Rating</label>
                    <div className="flex space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setNewReview(prev => ({ ...prev, rating: star }))}
                          className={`w-6 h-6 ${star <= newReview.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                        >
                          <Star className="w-full h-full fill-current" />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Comment</label>
                    <textarea
                      value={newReview.comment}
                      onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
                      placeholder="Share your experience with this product..."
                      className="w-full p-3 border rounded-md resize-none"
                      rows={4}
                    />
                  </div>
                  <div className="flex space-x-2">
                    <Button onClick={handleSubmitReview} disabled={!newReview.comment.trim()}>
                      Submit Review
                    </Button>
                    <Button variant="outline" onClick={() => setShowReviewForm(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
              
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center space-y-2">
                  <div className="text-4xl font-bold">
                    {reviews.length > 0 
                      ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
                      : '4.5'
                    }
                  </div>
                  <div className="flex justify-center">
                    {renderStars(
                      reviews.length > 0 
                        ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
                        : 4.5
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Based on {reviews.length} reviews
                  </div>
                </div>
                
                <div className="md:col-span-2 space-y-4">
                  {isLoadingReviews ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                      <p className="mt-2 text-sm text-muted-foreground">Loading reviews...</p>
                    </div>
                  ) : reviews.length > 0 ? (
                    reviews.map((review) => (
                      <div key={review.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">User {review.userId.slice(-4)}</span>
                            <div className="flex">{renderStars(review.rating)}</div>
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {review.comment}
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">No reviews yet. Be the first to review this product!</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Related Products */}
        <section>
          <h2 className="text-2xl font-bold mb-8">You Might Also Like</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((relatedProduct) => (
              <ProductCard
                key={relatedProduct.id}
                id={relatedProduct.id}
                name={relatedProduct.title}
                price={relatedProduct.price}
                image={getPrimaryImageUrl(relatedProduct.images)}
                rating={4.5}
                reviews={0}
              />
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetail;