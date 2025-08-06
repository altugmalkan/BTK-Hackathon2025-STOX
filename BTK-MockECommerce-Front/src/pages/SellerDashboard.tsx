import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Store, Package, Key, LogOut, Plus, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import AddProductForm from "@/components/AddProductForm";
import ProductList from "@/components/ProductList";

const SellerDashboard = () => {
  const { state, logout } = useAuth();
  const navigate = useNavigate();
  const [showApiKey, setShowApiKey] = useState(false);
  const [apiKey, setApiKey] = useState<string>("");
  const [isLoadingApiKey, setIsLoadingApiKey] = useState(false);

  // Redirect if not authenticated or not a seller
  // useEffect(() => {
  //   if (!state.isAuthenticated) {
  //     navigate("/seller-login");
  //     return;
  //   }
  //   
  //   if (state.user?.role !== "Seller") {
  //     toast.error("Access Denied", {
  //       description: "This dashboard is for sellers only."
  //     });
  //     navigate("/");
  //     return;
  //   }
  // }, [state.isAuthenticated, state.user?.role, navigate]);

  // Demo mode - bypass authentication for preview
  useEffect(() => {
    console.log("Demo mode: Seller dashboard preview enabled");
  }, []);

  const handleLogout = () => {
    // logout();
    toast.success("Demo mode - Logout disabled");
    // navigate("/");
  };

  const fetchApiKey = async () => {
    setIsLoadingApiKey(true);
    try {
      const response = await fetch('https://mock-api.gdgikcu.dev/api/v1/apikeys/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${state.token}` // Include auth token if available
        },
        body: JSON.stringify({
          name: `${state.user?.firstName || 'Seller'}'s API Key - ${new Date().toISOString().slice(0, 19).replace('T', ' ')}`,
          description: "API key for seller dashboard integration",
          requestsPerMinute: 1000,
          requestsPerDay: 100000,
          expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString() // 1 year from now
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // API key field'ını kontrol et - apiKey field'ını kullan
      const responseData = data.data || data;
      const apiKeyValue = responseData.apiKey;
      
      if (apiKeyValue) {
        setApiKey(apiKeyValue);
        toast.success("API anahtarı başarıyla oluşturuldu!");
      } else {
        console.error("API Response structure:", data);
        throw new Error("Sunucudan API anahtarı alınamadı");
      }
    } catch (error) {
      console.error("API anahtarı oluşturma hatası:", error);
      
      // API'den gelen hata mesajını kontrol et
      if (error instanceof Error && error.message.includes('500')) {
        toast.error("API anahtarı oluşturulamadı", {
          description: "Bu isimde bir API anahtarı zaten mevcut. Lütfen tekrar deneyin."
        });
      } else {
        toast.error("API anahtarı oluşturulamadı", {
          description: "Lütfen daha sonra tekrar deneyin."
        });
      }
    } finally {
      setIsLoadingApiKey(false);
    }
  };

  // if (state.isLoading) {
  //   return (
  //     <div className="min-h-screen bg-gradient-surface flex items-center justify-center">
  //       <div className="text-center">
  //         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
  //         <p className="text-muted-foreground">Loading dashboard...</p>
  //       </div>
  //     </div>
  //   );
  // }

  // if (!state.isAuthenticated || state.user?.role !== "Seller") {
  //   return null;
  // }

  return (
    <div className="min-h-screen bg-gradient-surface">
      {/* Header */}
      <header className="w-full bg-background/80 backdrop-blur-sm border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Store className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Seller Dashboard</h1>
                             <p className="text-sm text-muted-foreground">
                 Welcome back, Demo Seller
               </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Badge variant="secondary" className="flex items-center gap-1">
              <Store className="w-3 h-3" />
              Seller
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Products</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">24</div>
                <p className="text-xs text-muted-foreground">
                  +2 from last month
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Products</CardTitle>
                <Badge className="h-4 w-4 bg-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">18</div>
                <p className="text-xs text-muted-foreground">
                  75% of total products
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Draft Products</CardTitle>
                <Badge className="h-4 w-4 bg-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">6</div>
                <p className="text-xs text-muted-foreground">
                  25% of total products
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Main Tabs */}
          <Tabs defaultValue="products" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="products" className="flex items-center gap-2">
                <Package className="w-4 h-4" />
                Products
              </TabsTrigger>
              <TabsTrigger value="add-product" className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Add Product
              </TabsTrigger>
              <TabsTrigger value="api-key" className="flex items-center gap-2">
                <Key className="w-4 h-4" />
                Your API Key
              </TabsTrigger>
            </TabsList>

            <TabsContent value="products" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Your Products</CardTitle>
                  <CardDescription>
                    Manage your product listings, update status, and view performance.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ProductList />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="add-product" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Add New Product</CardTitle>
                  <CardDescription>
                    Create a new product listing with images, description, and pricing.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <AddProductForm />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="api-key" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>API Anahtarınız</CardTitle>
                  <CardDescription>
                    Mağazanızı harici uygulamalarla entegre etmek için API anahtarınızı oluşturun ve yönetin.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium">API Key</label>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowApiKey(!showApiKey)}
                        className="flex items-center gap-2"
                      >
                        {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        {showApiKey ? "Hide" : "Show"}
                      </Button>
                    </div>
                    
                    {!apiKey ? (
                      <Button
                        onClick={fetchApiKey}
                        disabled={isLoadingApiKey}
                        className="w-full"
                      >
                        {isLoadingApiKey ? "Oluşturuluyor..." : "API Anahtarı Oluştur"}
                      </Button>
                    ) : (
                      <div className="space-y-3">
                        <div className="relative">
                          <input
                            type={showApiKey ? "text" : "password"}
                            value={apiKey}
                            readOnly
                            className="w-full px-3 py-2 border rounded-md bg-muted font-mono text-sm"
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigator.clipboard.writeText(apiKey)}
                            className="absolute right-2 top-1/2 transform -translate-y-1/2"
                          >
                            Copy
                          </Button>
                        </div>
                        <Button
                          variant="outline"
                          onClick={fetchApiKey}
                          disabled={isLoadingApiKey}
                          className="w-full"
                        >
                          {isLoadingApiKey ? "Yeniden oluşturuluyor..." : "API Anahtarını Yenile"}
                        </Button>
                      </div>
                    )}
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <h4 className="font-medium">API Anahtarı Kullanımı</h4>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <p>• Bu anahtarı Authorization header'ında kullanın: <code className="bg-muted px-1 rounded">Bearer YOUR_API_KEY</code></p>
                      <p>• Bu anahtarı satıcıya özel endpoint'lere erişmek için kullanın</p>
                      <p>• Bu anahtarı güvenli tutun ve herkese açık paylaşmayın</p>
                      <p>• Bu anahtarı hesap ayarlarınızdan istediğiniz zaman yenileyebilirsiniz</p>
                    </div>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h4 className="font-medium text-yellow-800 mb-2">Güvenlik Uyarısı</h4>
                    <p className="text-sm text-yellow-700">
                      API anahtarınız satıcı hesabınıza erişim sağlar. Güvenli tutun ve asla herkese açık depolarda veya istemci tarafı kodlarda paylaşmayın.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default SellerDashboard; 