import { Link } from "react-router-dom";
import { Trash2, Minus, Plus, ArrowLeft, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/contexts/CartContext";

const Cart = () => {
  const { state, removeFromCart, updateQuantity, clearCart } = useCart();
  const { items, total, itemCount } = state;

  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity >= 1) {
      updateQuantity(id, newQuantity);
    }
  };

  const handleRemoveItem = (id: string) => {
    removeFromCart(id);
  };

  const handleClearCart = () => {
    clearCart();
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              <div className="flex items-center space-x-4">
                <Link
                  to="/"
                  className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent"
                >
                  BTKshop
                </Link>
              </div>
              <div className="flex items-center space-x-4">
                <Link
                  to="/"
                  className="flex items-center text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </header>

        {/* Empty Cart */}
        <main className="flex-1 flex items-center justify-center px-4 py-12">
          <div className="text-center space-y-6">
            <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center">
              <ShoppingBag className="w-12 h-12 text-muted-foreground" />
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-card-foreground">
                Your cart is empty
              </h1>
              <p className="text-muted-foreground">
                Looks like you haven't added any items to your cart yet.
              </p>
            </div>
            <Button
              asChild
              className="bg-gradient-primary hover:opacity-90 text-primary-foreground"
            >
              <Link to="/">Start Shopping</Link>
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                to="/"
                className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent"
              >
                BTKshop
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/"
                className="flex items-center text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-card-foreground">
                  Shopping Cart
                </h1>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-muted-foreground">
                    {itemCount} {itemCount === 1 ? "item" : "items"}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleClearCart}
                    className="text-destructive hover:text-destructive"
                  >
                    Clear Cart
                  </Button>
                </div>
              </div>

              {/* Cart Items */}
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="bg-card rounded-lg border p-6">
                    <div className="flex items-start space-x-4">
                      {/* Product Image */}
                      <div className="flex-shrink-0">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold text-card-foreground mb-1">
                              {item.title}
                            </h3>
                            <div className="flex items-center space-x-2">
                              <span className="text-lg font-semibold text-primary">
                                ${item.price.toFixed(2)}
                              </span>
                              {item.originalPrice && (
                                <span className="text-sm text-muted-foreground line-through">
                                  ${item.originalPrice.toFixed(2)}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Remove Button */}
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleRemoveItem(item.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() =>
                                handleQuantityChange(item.id, item.quantity - 1)
                              }
                              disabled={item.quantity <= 1}
                              className="h-8 w-8"
                            >
                              <Minus className="h-3 w-3" />
                            </Button>

                            <span className="w-12 text-center font-medium">
                              {item.quantity}
                            </span>

                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() =>
                                handleQuantityChange(item.id, item.quantity + 1)
                              }
                              className="h-8 w-8"
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>

                          <div className="text-right">
                            <span className="font-semibold text-card-foreground">
                              ${(item.price * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-lg border p-6 sticky top-24">
              <h2 className="text-xl font-semibold text-card-foreground mb-4">
                Order Summary
              </h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    Subtotal ({itemCount} items)
                  </span>
                  <span className="font-medium">${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="font-medium text-green-600">Free</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax</span>
                  <span className="font-medium">
                    ${(total * 0.08).toFixed(2)}
                  </span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span>${(total + total * 0.08).toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Button
                  className="w-full bg-gradient-primary hover:opacity-90 text-primary-foreground font-semibold py-3"
                  asChild
                >
                  <Link to="/checkout">Proceed to Checkout</Link>
                </Button>
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/">Continue Shopping</Link>
                </Button>
              </div>

              {/* Additional Info */}
              <div className="mt-6 pt-6 border-t">
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    Free shipping on orders over $50
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    30-day return policy
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    Secure checkout
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Cart;
