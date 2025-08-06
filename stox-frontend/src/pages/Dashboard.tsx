import React from "react";
import { Link } from "react-router-dom";
import { BarChart3, Package, ShoppingCart, TrendingUp, Plus, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import MarketplaceCard from "@/components/marketplace-card";
import StatusBadge from "@/components/status-badge";
import heroImage from "@/assets/hero-dashboard.jpg";

interface Product {
  id: number;
  name: string;
  image: string;
  status: "published" | "pending" | "error";
  marketplaces: number;
  lastUpdate: string;
  aiEnhanced?: boolean;
}

const recentProducts = [
  {
    id: 1,
    name: "Siyah Metal Tel Sırtlı Sandalye",
    image: "/enhanced (2).png",
    status: "published" as const,
    marketplaces: 4,
    lastUpdate: "30 minutes ago",
    aiEnhanced: true
  },
  {
    id: 2,
    name: "Premium Wireless Headphones",
    image: "/api/placeholder/80/80",
    status: "published" as const,
    marketplaces: 3,
    lastUpdate: "2 hours ago"
  },
  {
    id: 3,
    name: "Smart Fitness Tracker",
    image: "/api/placeholder/80/80",
    status: "pending" as const,
    marketplaces: 2,
    lastUpdate: "1 hour ago"
  }
] satisfies Product[];

const marketplaces = [
  {
    name: "Amazon",
    logo: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg",
    status: "published" as const,
    url: "https://amazon.com/dp/B08XYZ123",
    lastSync: "5 minutes ago"
  },
  {
    name: "Trendyol",
    logo: "https://upload.wikimedia.org/wikipedia/commons/c/c7/Trendyol_logo.svg",
    status: "pending" as const,
    lastSync: "2 minutes ago"
  },
  {
    name: "Hepsiburada",
    logo: "https://upload.wikimedia.org/wikipedia/commons/2/20/Hepsiburada_logo_official.svg",
    status: "error" as const,
    error: "Invalid product category. Please review and resubmit.",
    lastSync: "10 minutes ago"
  }
];

export default function Dashboard() {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-primary rounded-lg p-8 text-primary-foreground">
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-3xl font-bold mb-4">
            <span className="font-gotham-black">Stox</span>'a Hoş Geldiniz
          </h1>
          <p className="text-primary-foreground/90 text-lg mb-6">
            Yapay zeka destekli optimizasyon ile ürünlerinizi birden fazla pazaryerinde yayınlamak için tek durak kontrol paneliniz.
          </p>
          <div className="flex items-center space-x-4">
            <Button variant="accent" size="lg" asChild>
              <Link to="/products/new">
                <Plus className="w-5 h-5 mr-2" />
                Yeni Ürün Oluştur
              </Link>
            </Button>
            <Button variant="glass" size="lg">
              <Eye className="w-5 h-5 mr-2" />
              Demo İzle
            </Button>
          </div>
        </div>
        <div className="absolute right-0 top-0 w-1/2 h-full opacity-20">
          <img 
            src={heroImage} 
            alt="Dashboard preview" 
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Toplam Ürün</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">25</div>
            <p className="text-xs text-muted-foreground">
              Son ay için +4 (1 AI geliştirilmiş)
            </p>
          </CardContent>
        </Card>
        
        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Yayınlanmış</CardTitle>
            <TrendingUp className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">19</div>
            <p className="text-xs text-muted-foreground">
              76% başarı oranı (+1 AI)
            </p>
          </CardContent>
        </Card>
        
        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Toplam Sipariş</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">127</div>
            <p className="text-xs text-muted-foreground">
              Son hafta için +12%
            </p>
          </CardContent>
        </Card>
        
        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gelir</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$3,247</div>
            <p className="text-xs text-muted-foreground">
              Son ay için +8%
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Products */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Son Ürünler</h2>
            <Button variant="outline" size="sm">Tümünü Görüntüle</Button>
          </div>
          
          <div className="space-y-4">
            {recentProducts.map((product) => (
              <Card key={product.id} className="glass-card hover-lift">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-background-muted rounded-lg overflow-hidden">
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium truncate">{product.name}</h3>
                      <div className="flex items-center space-x-2 mt-1">
                        <StatusBadge status={product.status} />
                        {product.aiEnhanced && (
                          <Badge variant="default" className="text-xs bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                            ✨ AI Enhanced
                          </Badge>
                        )}
                        <Badge variant="outline" className="text-xs">
                          {product.marketplaces} marketplaces
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        Updated {product.lastUpdate}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Marketplace Status */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Pazaryerleri Durumu</h2>
            <Button variant="outline" size="sm">Yönet</Button>
          </div>
          
          <div className="space-y-4">
            {marketplaces.map((marketplace, index) => (
              <MarketplaceCard
                key={index}
                name={marketplace.name}
                logo={marketplace.logo}
                status={marketplace.status}
                url={marketplace.url}
                error={marketplace.error}
                lastSync={marketplace.lastSync}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}