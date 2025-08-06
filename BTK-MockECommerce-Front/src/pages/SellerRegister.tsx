import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff, Store } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const SellerRegister = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "", // Changed from businessEmail to match API
    password: "",
    confirmPassword: "",
    storeName: "", // Changed from businessName to match API
    acceptTerms: false,
    acceptSellerAgreement: false,
    acceptMarketing: false,
  });
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const { registerSeller } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Reset errors
    setErrors({});

    // Validation
    const newErrors: { [key: string]: string } = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

    if (!formData.storeName.trim()) {
      newErrors.storeName = "Store name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!formData.acceptTerms) {
      newErrors.acceptTerms = "You must accept the terms and conditions";
    }

    if (!formData.acceptSellerAgreement) {
      newErrors.acceptSellerAgreement = "You must accept the seller agreement";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    
    console.log('Form data before processing:', formData);

    try {
      // Prepare seller data according to API requirements
      const sellerData: {
        firstName: string;
        lastName: string;
        email: string;
        password: string;
        storeName: string;
        logoUrl?: string;
      } = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        storeName: formData.storeName
      };
      
      // Handle logo file upload
      if (logoFile) {
        // Convert file to base64 or handle file upload
        // For now, we'll create a placeholder URL
        // In a real app, you'd upload to a file storage service first
        const reader = new FileReader();
        const logoDataUrl = await new Promise<string>((resolve) => {
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(logoFile);
        });
        sellerData.logoUrl = logoDataUrl;
      }

      console.log('Attempting seller registration with data:', sellerData);
      await registerSeller(sellerData);
      console.log('Registration completed successfully!');
      
      toast.success('Registration Successful!', {
        description: 'Your seller account has been created. You are now logged in!'
      });
      
      // Instead of redirecting to login, redirect to seller dashboard since they're already logged in
      setTimeout(() => {
        navigate('/seller/dashboard');
      }, 2000);
    } catch (error) {
      console.error('Seller registration error:', error);
      toast.error('Registration Failed', {
        description: error instanceof Error ? error.message : 'Failed to create seller account. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({ ...prev, logo: 'Please select a valid image file' }));
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, logo: 'Image size must be less than 5MB' }));
        return;
      }
      
      setLogoFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      
      // Clear any previous errors
      if (errors.logo) {
        setErrors(prev => ({ ...prev, logo: '' }));
      }
    }
  };

  const removeLogo = () => {
    setLogoFile(null);
    setLogoPreview(null);
    // Clear the file input
    const fileInput = document.getElementById('logo') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
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
            <Link
              to="/login"
              className="nav-link text-muted-foreground hover:text-primary"
            >
              User Login
            </Link>
            <Link
              to="/seller-login"
              className="nav-link text-muted-foreground hover:text-primary"
            >
              Seller Login
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-2xl animate-fade-in">
          {/* Registration Card */}
          <div className="bg-card rounded-lg shadow-large border p-8 space-y-6">
            <div className="text-center space-y-2">
              <div className="mx-auto w-16 h-16 bg-secondary rounded-full flex items-center justify-center mb-4">
                <Store className="w-8 h-8 text-secondary-foreground" />
              </div>
              <h1 className="text-3xl font-bold text-card-foreground">
                Become a Seller
              </h1>
              <p className="text-muted-foreground">
                Start selling your products on our platform
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-card-foreground border-b pb-2">
                  Personal Information
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      type="text"
                      placeholder="Enter your first name"
                      value={formData.firstName}
                      onChange={(e) =>
                        handleInputChange("firstName", e.target.value)
                      }
                      className={errors.firstName ? "border-destructive" : ""}
                    />
                    {errors.firstName && (
                      <p className="text-sm text-destructive">
                        {errors.firstName}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      type="text"
                      placeholder="Enter your last name"
                      value={formData.lastName}
                      onChange={(e) =>
                        handleInputChange("lastName", e.target.value)
                      }
                      className={errors.lastName ? "border-destructive" : ""}
                    />
                    {errors.lastName && (
                      <p className="text-sm text-destructive">
                        {errors.lastName}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Store Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-card-foreground border-b pb-2">
                  Store Information
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="storeName">Store Name</Label>
                    <Input
                      id="storeName"
                      type="text"
                      placeholder="Enter your store name"
                      value={formData.storeName}
                      onChange={(e) =>
                        handleInputChange("storeName", e.target.value)
                      }
                      className={
                        errors.storeName ? "border-destructive" : ""
                      }
                    />
                    {errors.storeName && (
                      <p className="text-sm text-destructive">
                        {errors.storeName}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="logo">Store Logo (Optional)</Label>
                    <div className="space-y-3">
                      <Input
                        id="logo"
                        type="file"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                      />
                      {errors.logo && (
                        <p className="text-sm text-destructive">{errors.logo}</p>
                      )}
                      {logoPreview && (
                        <div className="relative inline-block">
                          <img
                            src={logoPreview}
                            alt="Logo preview"
                            className="w-20 h-20 object-cover rounded-lg border"
                          />
                          <button
                            type="button"
                            onClick={removeLogo}
                            className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-destructive/90"
                          >
                            ×
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email address"
                    value={formData.email}
                    onChange={(e) =>
                      handleInputChange("email", e.target.value)
                    }
                    className={
                      errors.email ? "border-destructive" : ""
                    }
                  />
                  {errors.email && (
                    <p className="text-sm text-destructive">
                      {errors.email}
                    </p>
                  )}
                </div>
              </div>

              {/* Account Security */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-card-foreground border-b pb-2">
                  Account Security
                </h3>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a password"
                      value={formData.password}
                      onChange={(e) =>
                        handleInputChange("password", e.target.value)
                      }
                      className={
                        errors.password ? "border-destructive pr-10" : "pr-10"
                      }
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
                    <p className="text-sm text-destructive">
                      {errors.password}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={(e) =>
                        handleInputChange("confirmPassword", e.target.value)
                      }
                      className={
                        errors.confirmPassword
                          ? "border-destructive pr-10"
                          : "pr-10"
                      }
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={20} />
                      ) : (
                        <Eye size={20} />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-sm text-destructive">
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>
              </div>

              {/* Terms and Agreements */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-card-foreground border-b pb-2">
                  Terms & Agreements
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="acceptTerms"
                      checked={formData.acceptTerms}
                      onCheckedChange={(checked) =>
                        handleInputChange("acceptTerms", checked as boolean)
                      }
                      className="mt-1"
                    />
                    <div className="space-y-1">
                      <Label
                        htmlFor="acceptTerms"
                        className="text-sm font-normal leading-relaxed"
                      >
                        I agree to the{" "}
                        <Link
                          to="/terms"
                          className="text-secondary hover:underline"
                        >
                          Terms of Service
                        </Link>{" "}
                        and{" "}
                        <Link
                          to="/privacy"
                          className="text-secondary hover:underline"
                        >
                          Privacy Policy
                        </Link>
                      </Label>
                      {errors.acceptTerms && (
                        <p className="text-sm text-destructive">
                          {errors.acceptTerms}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="acceptSellerAgreement"
                      checked={formData.acceptSellerAgreement}
                      onCheckedChange={(checked) =>
                        handleInputChange(
                          "acceptSellerAgreement",
                          checked as boolean
                        )
                      }
                      className="mt-1"
                    />
                    <div className="space-y-1">
                      <Label
                        htmlFor="acceptSellerAgreement"
                        className="text-sm font-normal leading-relaxed"
                      >
                        I agree to the{" "}
                        <Link
                          to="/seller-terms"
                          className="text-secondary hover:underline"
                        >
                          Seller Agreement
                        </Link>{" "}
                        and understand my responsibilities as a seller
                      </Label>
                      {errors.acceptSellerAgreement && (
                        <p className="text-sm text-destructive">
                          {errors.acceptSellerAgreement}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="acceptMarketing"
                      checked={formData.acceptMarketing}
                      onCheckedChange={(checked) =>
                        handleInputChange("acceptMarketing", checked as boolean)
                      }
                      className="mt-1"
                    />
                    <Label
                      htmlFor="acceptMarketing"
                      className="text-sm font-normal leading-relaxed"
                    >
                      I would like to receive updates about seller features and
                      opportunities
                    </Label>
                  </div>
                </div>
              </div>

              {/* Register Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-accent hover:opacity-90 text-secondary-foreground font-semibold py-3 transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Creating Account...' : 'Create Seller Account'}
              </Button>
            </form>

            {/* Sign In Link */}
            <div className="text-center pt-4 border-t">
              <p className="text-muted-foreground">
                Already have a seller account?{" "}
                <Link
                  to="/seller-login"
                  className="text-secondary hover:underline font-medium"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-muted/30 py-6">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center space-x-6 text-sm text-muted-foreground">
            <Link
              to="/seller-support"
              className="hover:text-foreground transition-colors"
            >
              Seller Support
            </Link>
            <Link
              to="/seller-terms"
              className="hover:text-foreground transition-colors"
            >
              Seller Terms
            </Link>
            <Link
              to="/contact"
              className="hover:text-foreground transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default SellerRegister;
