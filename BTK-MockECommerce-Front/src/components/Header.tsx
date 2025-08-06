import { useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, User, Search, Menu, X, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { state: cartState } = useCart();
  const { state: authState, logout } = useAuth();
  const { itemCount } = cartState;

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <Link
              to="/"
              className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent"
            >
              BTKshop
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="nav-link">
              Home
            </Link>
            <Link to="/products" className="nav-link">
              Products
            </Link>
            <Link to="/about" className="nav-link">
              About
            </Link>
            <Link to="/contact" className="nav-link">
              Contact
            </Link>
          </nav>

          {/* Search Bar - Hidden on mobile */}
          <div className="hidden md:flex items-center space-x-4 flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-4">
            {/* Cart */}
            <Button
              variant="outline"
              size="icon"
              className="relative cart-icon"
              asChild
            >
              <Link to="/cart">
                <ShoppingCart className="h-5 w-5" />
                {itemCount > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
                  >
                    {itemCount}
                  </Badge>
                )}
              </Link>
            </Button>

            {/* User Authentication */}
            <div className="hidden md:flex items-center space-x-2">
              {authState.isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <User className="h-4 w-4 mr-2" />
                      {authState.user?.firstName || "User"}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <div className="px-2 py-1.5">
                        <div className="text-sm font-medium">
                          {authState.user?.firstName} {authState.user?.lastName}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {authState.user?.email}
                        </div>
                        <div className="text-xs text-muted-foreground capitalize">
                          {authState.user?.role}
                        </div>
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    {authState.user?.role === "Seller" && (
                      <>
                        <DropdownMenuItem asChild>
                          <Link to="/seller-dashboard">Dashboard</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link to="/my-products">My Products</Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                      </>
                    )}
                    <DropdownMenuItem onClick={logout}>
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <>
                  <Button variant="outline" size="sm" asChild>
                    <Link to="/login">
                      <User className="h-4 w-4 mr-2" />
                      Login
                    </Link>
                  </Button>
                  <Button variant="secondary" size="sm" asChild>
                    <Link to="/seller-login">Seller Login</Link>
                  </Button>
                </>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <Button
              variant="outline"
              size="icon"
              className="md:hidden"
              onClick={toggleMenu}
            >
              {isMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col space-y-4">
              {/* Mobile Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search products..."
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Mobile Navigation */}
              <nav className="flex flex-col space-y-3">
                <Link to="/" className="nav-link">
                  Home
                </Link>
                <Link to="/products" className="nav-link">
                  Products
                </Link>
                <Link to="/about" className="nav-link">
                  About
                </Link>
                <Link to="/contact" className="nav-link">
                  Contact
                </Link>
              </nav>

              {/* Mobile Login Buttons */}
              <div className="flex flex-col space-y-2 pt-4 border-t">
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/login">
                    <User className="h-4 w-4 mr-2" />
                    Login (User)
                  </Link>
                </Button>
                <Button variant="secondary" className="w-full" asChild>
                  <Link to="/seller-login">Seller Login</Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
