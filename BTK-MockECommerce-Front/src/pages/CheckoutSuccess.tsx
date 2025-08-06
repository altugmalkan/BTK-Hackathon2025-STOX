import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Package, Truck, Mail, ArrowRight } from "lucide-react";

const CheckoutSuccess = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/" className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                BTKshop
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Success Message */}
          <div className="text-center space-y-6 mb-8">
            <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-card-foreground">Order Confirmed!</h1>
              <p className="text-muted-foreground">
                Thank you for your purchase. Your order has been successfully placed.
              </p>
            </div>
          </div>

          {/* Order Details */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Order Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Order Number</span>
                <span className="font-medium">#ORD-{Date.now().toString().slice(-8)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Order Date</span>
                <span className="font-medium">{new Date().toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Payment Status</span>
                <span className="text-green-600 font-medium">Paid</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Estimated Delivery</span>
                <span className="font-medium">
                  {new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Next Steps */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>What's Next?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Package className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium">Order Processing</h3>
                  <p className="text-sm text-muted-foreground">
                    We're preparing your order for shipment. This usually takes 1-2 business days.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Truck className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <h3 className="font-medium">Shipping</h3>
                  <p className="text-sm text-muted-foreground">
                    You'll receive a shipping confirmation email with tracking information.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Mail className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-medium">Email Confirmation</h3>
                  <p className="text-sm text-muted-foreground">
                    Check your email for order confirmation and shipping updates.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button asChild className="flex-1">
              <Link to="/">
                Continue Shopping
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/orders">
                View Order Status
              </Link>
            </Button>
          </div>

          {/* Additional Info */}
          <div className="mt-8 p-6 bg-muted/50 rounded-lg">
            <h3 className="font-medium mb-3">Need Help?</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>• Track your order with the order number above</p>
              <p>• Contact our support team for any questions</p>
              <p>• Check our FAQ for common questions</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CheckoutSuccess; 