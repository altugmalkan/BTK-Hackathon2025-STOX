import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Eye, EyeOff, ShoppingBag, ArrowLeft } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const UserLogin = () => {
  const navigate = useNavigate();
  const { login, state } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
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
      await login(formData.email, formData.password);
      toast.success("Login successful!");
      navigate("/"); // Redirect to home page after successful login
    } catch (error) {
      toast.error(state.error || "Login failed. Please try again.");
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
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
              <Link
                to="/seller-login"
                className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
              >
                Seller Login
              </Link>
              <Link
                to="/register"
                className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 py-12 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Welcome Message */}
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
                  Welcome Back!
                </h1>
                <p className="text-xl text-gray-600">
                  Sign in to your account to continue shopping and manage your
                  orders.
                </p>
              </div>

              {/* Demo Credentials */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 space-y-4">
                <h3 className="font-semibold text-blue-900 mb-3">
                  Demo Credentials
                </h3>
                <div className="space-y-3">
                  <div className="bg-white/70 rounded-lg p-3">
                    <p className="text-sm font-medium text-blue-800">
                      Admin Account:
                    </p>
                    <p className="text-sm text-blue-700">
                      admin@example.com / Admin123!
                    </p>
                  </div>
                  <div className="bg-white/70 rounded-lg p-3">
                    <p className="text-sm font-medium text-blue-800">
                      Customer Account:
                    </p>
                    <p className="text-sm text-blue-700">
                      customer@example.com / Customer123!
                    </p>
                  </div>
                </div>
              </div>

              {/* Features */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">
                  What you can do:
                </h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                    Browse thousands of products
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                    Track your orders and purchases
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                    Save items to your wishlist
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                    Get personalized recommendations
                  </li>
                </ul>
              </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="w-full max-w-md mx-auto lg:mx-0">
              <Card className="shadow-xl border-0">
                <CardHeader className="space-y-1 text-center">
                  <CardTitle className="text-2xl font-bold">Sign In</CardTitle>
                  <CardDescription className="text-gray-600">
                    Enter your credentials to access your account
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Email Field */}
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-medium">
                        Email Address
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
                        }
                        className={
                          errors.email
                            ? "border-red-500 focus:ring-red-500"
                            : ""
                        }
                      />
                      {errors.email && (
                        <p className="text-xs text-red-600">{errors.email}</p>
                      )}
                    </div>

                    {/* Password Field */}
                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-sm font-medium">
                        Password
                      </Label>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          value={formData.password}
                          onChange={(e) =>
                            handleInputChange("password", e.target.value)
                          }
                          className={
                            errors.password
                              ? "border-red-500 focus:ring-red-500 pr-10"
                              : "pr-10"
                          }
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          {showPassword ? (
                            <EyeOff size={18} />
                          ) : (
                            <Eye size={18} />
                          )}
                        </button>
                      </div>
                      {errors.password && (
                        <p className="text-xs text-red-600">
                          {errors.password}
                        </p>
                      )}
                    </div>

                    {/* Remember Me & Forgot Password */}
                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="rememberMe"
                          checked={formData.rememberMe}
                          onCheckedChange={(checked) =>
                            handleInputChange("rememberMe", checked as boolean)
                          }
                        />
                        <Label
                          htmlFor="rememberMe"
                          className="text-sm text-gray-600"
                        >
                          Remember me
                        </Label>
                      </div>
                      <Link
                        to="/forgot-password"
                        className="text-sm text-blue-600 hover:text-blue-700 hover:underline"
                      >
                        Forgot password?
                      </Link>
                    </div>

                    {/* Login Button */}
                    <Button
                      type="submit"
                      disabled={state.isLoading}
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                      {state.isLoading ? (
                        <div className="flex items-center justify-center space-x-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Signing In...</span>
                        </div>
                      ) : (
                        "Sign In"
                      )}
                    </Button>
                  </form>

                  {/* Sign Up Link */}
                  <div className="text-center pt-6 mt-6 border-t border-gray-100">
                    <p className="text-sm text-gray-600">
                      Don't have an account?{" "}
                      <Link
                        to="/register"
                        className="text-blue-600 hover:text-blue-700 font-medium hover:underline"
                      >
                        Create account
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
              <Link
                to="/privacy"
                className="hover:text-blue-600 transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                to="/terms"
                className="hover:text-blue-600 transition-colors"
              >
                Terms of Service
              </Link>
              <Link
                to="/contact"
                className="hover:text-blue-600 transition-colors"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default UserLogin;
