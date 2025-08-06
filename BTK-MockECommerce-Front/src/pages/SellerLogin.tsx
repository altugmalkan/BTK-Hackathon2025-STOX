import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff, Store } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const SellerLogin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const { login, state } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset errors
    setErrors({});
    
    // Validation
    const newErrors: { [key: string]: string } = {};
    
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    
    if (!formData.password) {
      newErrors.password = "Password is required";
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setIsLoading(true);
    
    try {
      await login(formData.email, formData.password);
      
      // Check if user is a seller
      if (state.user && state.user.role === 'Seller') {
        toast.success('Welcome back!', {
          description: 'Successfully logged in to your seller dashboard.'
        });
        navigate('/seller/dashboard');
      } else {
        toast.error('Access Denied', {
          description: 'This login is for sellers only. Please use the customer login.'
        });
        // Clear the login since it's not a seller
        // The auth context should handle this, but we can add extra safety
      }
    } catch (error) {
      toast.error('Login Failed', {
        description: error instanceof Error ? error.message : 'Invalid email or password'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-surface flex flex-col">
      {/* Header */}
      <header className="w-full bg-background/80 backdrop-blur-sm border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-primary">
            BTKshop
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/login" className="nav-link text-muted-foreground hover:text-primary">
              User Login
            </Link>
            <Link to="/seller-register" className="nav-link text-muted-foreground hover:text-primary">
              Seller Sign Up
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md animate-fade-in">
          {/* Login Card */}
          <div className="bg-card rounded-lg shadow-large border p-8 space-y-6">
            <div className="text-center space-y-2">
              <div className="mx-auto w-16 h-16 bg-secondary rounded-full flex items-center justify-center mb-4">
                <Store className="w-8 h-8 text-secondary-foreground" />
              </div>
              <h1 className="text-3xl font-bold text-card-foreground">Seller Portal</h1>
              <p className="text-muted-foreground">Access your dashboard to manage your store</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email">Seller Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your business email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className={errors.email ? "border-destructive" : ""}
                />
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email}</p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    className={errors.password ? "border-destructive pr-10" : "pr-10"}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-destructive">{errors.password}</p>
                )}
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="rememberMe"
                    checked={formData.rememberMe}
                    onCheckedChange={(checked) => handleInputChange("rememberMe", checked as boolean)}
                  />
                  <Label htmlFor="rememberMe" className="text-sm font-normal">
                    Keep me signed in
                  </Label>
                </div>
                <Link
                  to="/seller-forgot-password"
                  className="text-sm text-secondary hover:underline"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Login Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-accent hover:opacity-90 text-secondary-foreground font-semibold py-3 transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Signing In...' : 'Access Dashboard'}
              </Button>
            </form>

            {/* Additional Info */}
            <div className="space-y-4 pt-4 border-t">
              <div className="text-center">
                <p className="text-muted-foreground text-sm">
                  New to selling?{" "}
                  <Link to="/seller-register" className="text-secondary hover:underline font-medium">
                    Register as a seller
                  </Link>
                </p>
              </div>
              
              <div className="bg-muted/50 rounded-lg p-4">
                <h3 className="font-medium text-card-foreground mb-2">Seller Benefits:</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Manage your product listings</li>
                  <li>• Track sales and analytics</li>
                  <li>• Process orders efficiently</li>
                  <li>• Build your brand presence</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-muted/30 py-6">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center space-x-6 text-sm text-muted-foreground">
            <Link to="/seller-support" className="hover:text-foreground transition-colors">
              Seller Support
            </Link>
            <Link to="/seller-terms" className="hover:text-foreground transition-colors">
              Seller Terms
            </Link>
            <Link to="/contact" className="hover:text-foreground transition-colors">
              Contact Us
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default SellerLogin;