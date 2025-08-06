import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      {/* Newsletter Section */}
      <div className="border-b border-white/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">Stay Updated</h3>
            <p className="text-primary-foreground/80 mb-6 max-w-2xl mx-auto">
              Subscribe to our newsletter and be the first to know about new arrivals, 
              exclusive offers, and insider updates.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-premium"
              />
              <Button className="bg-premium hover:bg-premium/90 text-premium-foreground px-8">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-white to-premium bg-clip-text text-transparent">
              BTKshop
            </h3>
            <p className="text-primary-foreground/80 mb-6">
              Your premier destination for luxury products and exceptional shopping experiences. 
              Quality, style, and sophistication in every purchase.
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-premium" />
                <span className="text-sm">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-premium" />
                <span className="text-sm">hello@btkshop.com</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-premium" />
                <span className="text-sm">123 Luxury Ave, Premium City</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <div className="space-y-3">
              <a href="#" className="block text-primary-foreground/80 hover:text-white transition-colors">Home</a>
              <a href="#" className="block text-primary-foreground/80 hover:text-white transition-colors">Products</a>
              <a href="#" className="block text-primary-foreground/80 hover:text-white transition-colors">Categories</a>
              <a href="#" className="block text-primary-foreground/80 hover:text-white transition-colors">About Us</a>
              <a href="#" className="block text-primary-foreground/80 hover:text-white transition-colors">Contact</a>
            </div>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="font-semibold mb-4">Customer Service</h4>
            <div className="space-y-3">
              <a href="#" className="block text-primary-foreground/80 hover:text-white transition-colors">Help Center</a>
              <a href="#" className="block text-primary-foreground/80 hover:text-white transition-colors">Track Your Order</a>
              <a href="#" className="block text-primary-foreground/80 hover:text-white transition-colors">Returns & Exchanges</a>
              <a href="#" className="block text-primary-foreground/80 hover:text-white transition-colors">Shipping Info</a>
              <a href="#" className="block text-primary-foreground/80 hover:text-white transition-colors">Size Guide</a>
            </div>
          </div>

          {/* Legal & Social */}
          <div>
            <h4 className="font-semibold mb-4">Connect With Us</h4>
            <div className="flex gap-4 mb-6">
              <Button size="icon" variant="outline" className="bg-white/10 border-white/20 hover:bg-white/20">
                <Facebook className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="outline" className="bg-white/10 border-white/20 hover:bg-white/20">
                <Twitter className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="outline" className="bg-white/10 border-white/20 hover:bg-white/20">
                <Instagram className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="outline" className="bg-white/10 border-white/20 hover:bg-white/20">
                <Youtube className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-3">
              <a href="#" className="block text-primary-foreground/80 hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="block text-primary-foreground/80 hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="block text-primary-foreground/80 hover:text-white transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-primary-foreground/60 text-sm">
              © 2024 BTKshop. All rights reserved.
            </p>
            <div className="flex items-center gap-6 mt-4 md:mt-0">
              <span className="text-primary-foreground/60 text-sm">Accepted Payments:</span>
              <div className="flex gap-2">
                <div className="w-8 h-5 bg-white/20 rounded flex items-center justify-center">
                  <span className="text-xs font-bold">V</span>
                </div>
                <div className="w-8 h-5 bg-white/20 rounded flex items-center justify-center">
                  <span className="text-xs font-bold">M</span>
                </div>
                <div className="w-8 h-5 bg-white/20 rounded flex items-center justify-center">
                  <span className="text-xs font-bold">P</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;