import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff, ShoppingBag, Users, Shield, ArrowLeft } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const UserRegister = () => {
  const navigate = useNavigate();
  const { registerUser, state } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false,
    acceptMarketing: false
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
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
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = "Password must contain at least one uppercase letter, one lowercase letter, and one number";
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    
    if (!formData.acceptTerms) {
      newErrors.acceptTerms = "You must accept the terms and conditions";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      await registerUser({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
      });
      toast.success("Registration successful! Welcome!");
      navigate("/"); // Redirect to home page after successful registration
    } catch (error) {
      toast.error(state.error || "Registration failed. Please try again.");
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="w-full bg-white/80 backdrop-blur-sm border-b shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2">
              <ShoppingBag className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                MockECommerce
              </span>
            </Link>
            <div className="flex items-center space-x-4">
              <Link to="/seller-register" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                Become a Seller
              </Link>
              <Link to="/login" className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors">
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Side - Benefits */}
            <div className="space-y-8">
              <div className="space-y-4">
                <Link 
                  to="/" 
                  className="inline-flex items-center text-sm text-gray-600 hover:text-blue-600 transition-colors"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Home
                </Link>
                <h1 className="text-4xl lg:text-5xl font-bold text-gray-900">
                  Join MockECommerce
                </h1>
                <p className="text-xl text-gray-600">
                  Create your account and start shopping from thousands of products
                </p>
              </div>

              {/* Benefits */}
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <ShoppingBag className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Wide Product Selection</h3>
                    <p className="text-gray-600">Access thousands of products from verified sellers across multiple categories.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <Shield className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Secure Shopping</h3>
                    <p className="text-gray-600">Your personal information and payments are protected with industry-standard security.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                    <Users className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Community Driven</h3>
                    <p className="text-gray-600">Connect with a community of shoppers and sellers, read reviews, and share experiences.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Registration Form */}
            <div className="w-full max-w-md mx-auto lg:mx-0">
              <Card className="shadow-xl border-0">
                <CardHeader className="space-y-1 text-center">
                  <CardTitle className="text-2xl font-bold">Create Account</CardTitle>
                  <CardDescription className="text-gray-600">
                    Enter your information to get started
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Name Fields */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label htmlFor="firstName" className="text-sm font-medium">First Name</Label>
                        <Input
                          id="firstName"
                          type="text"
                          placeholder="John"
                          value={formData.firstName}
                          onChange={(e) => handleInputChange("firstName", e.target.value)}
                          className={errors.firstName ? "border-red-500 focus:ring-red-500" : ""}
                        />
                        {errors.firstName && (
                          <p className="text-xs text-red-600">{errors.firstName}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName" className="text-sm font-medium">Last Name</Label>
                        <Input
                          id="lastName"
                          type="text"
                          placeholder="Doe"
                          value={formData.lastName}
                          onChange={(e) => handleInputChange("lastName", e.target.value)}
                          className={errors.lastName ? "border-red-500 focus:ring-red-500" : ""}
                        />
                        {errors.lastName && (
                          <p className="text-xs text-red-600">{errors.lastName}</p>
                        )}
                      </div>
                    </div>

                    {/* Email Field */}
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="john.doe@example.com"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        className={errors.email ? "border-red-500 focus:ring-red-500" : ""}
                      />
                      {errors.email && (
                        <p className="text-xs text-red-600">{errors.email}</p>
                      )}
                    </div>

                    {/* Password Field */}
                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Create a strong password"
                          value={formData.password}
                          onChange={(e) => handleInputChange("password", e.target.value)}
                          className={errors.password ? "border-red-500 focus:ring-red-500 pr-10" : "pr-10"}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                      {errors.password && (
                        <p className="text-xs text-red-600">{errors.password}</p>
                      )}
                    </div>

                    {/* Confirm Password Field */}
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword" className="text-sm font-medium">Confirm Password</Label>
                      <div className="relative">
                        <Input
                          id="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Confirm your password"
                          value={formData.confirmPassword}
                          onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                          className={errors.confirmPassword ? "border-red-500 focus:ring-red-500 pr-10" : "pr-10"}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                      {errors.confirmPassword && (
                        <p className="text-xs text-red-600">{errors.confirmPassword}</p>
                      )}
                    </div>

                    {/* Terms and Conditions */}
                    <div className="space-y-3 pt-2">
                      <div className="flex items-start space-x-2">
                        <Checkbox
                          id="acceptTerms"
                          checked={formData.acceptTerms}
                          onCheckedChange={(checked) => handleInputChange("acceptTerms", checked as boolean)}
                          className={errors.acceptTerms ? "border-red-500" : ""}
                        />
                        <div className="space-y-1 leading-none">
                          <Label htmlFor="acceptTerms" className="text-xs text-gray-600 leading-relaxed">
                            I agree to the{" "}
                            <Link to="/terms" className="text-blue-600 hover:underline font-medium">
                              Terms of Service
                            </Link>{" "}
                            and{" "}
                            <Link to="/privacy" className="text-blue-600 hover:underline font-medium">
                              Privacy Policy
                            </Link>
                          </Label>
                          {errors.acceptTerms && (
                            <p className="text-xs text-red-600">{errors.acceptTerms}</p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="acceptMarketing"
                          checked={formData.acceptMarketing}
                          onCheckedChange={(checked) => handleInputChange("acceptMarketing", checked as boolean)}
                        />
                        <Label htmlFor="acceptMarketing" className="text-xs text-gray-600">
                          Send me promotional emails and updates
                        </Label>
                      </div>
                    </div>

                    {/* Register Button */}
                    <Button
                      type="submit"
                      disabled={state.isLoading}
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                      {state.isLoading ? (
                        <div className="flex items-center justify-center space-x-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Creating Account...</span>
                        </div>
                      ) : (
                        "Create Account"
                      )}
                    </Button>
                  </form>

                  {/* Sign In Link */}
                  <div className="text-center pt-6 mt-6 border-t border-gray-100">
                    <p className="text-sm text-gray-600">
                      Already have an account?{" "}
                      <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium hover:underline">
                        Sign in here
                      </Link>
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 border-t py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-2">
              <ShoppingBag className="h-5 w-5 text-blue-600" />
              <span className="font-semibold text-gray-700">MockECommerce</span>
            </div>
            <div className="flex space-x-6 text-sm text-gray-600">
              <Link to="/privacy" className="hover:text-blue-600 transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="hover:text-blue-600 transition-colors">
                Terms of Service
              </Link>
              <Link to="/contact" className="hover:text-blue-600 transition-colors">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default UserRegister;
