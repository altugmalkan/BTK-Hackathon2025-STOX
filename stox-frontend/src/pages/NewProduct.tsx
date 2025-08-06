import React from "react";
import { Wand2, Save, Upload, Sparkles, Package, CheckCircle, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import UploadZone from "@/components/upload-zone";
import MarketplaceCard from "@/components/marketplace-card";

const categories = [
  "Electronics > Audio > Headphones",
  "Electronics > Audio > Speakers", 
  "Electronics > Computers > Laptops",
  "Electronics > Mobile > Smartphones",
  "Fashion > Clothing > T-Shirts",
  "Fashion > Accessories > Bags",
  "Home & Garden > Furniture > Chairs",
  "Home & Garden > Kitchen > Appliances",
  "Sports > Fitness > Equipment",
  "Books > Fiction > Mystery"
];

const marketplaces = [
  {
    name: "Amazon",
    logo: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg",
    status: "draft" as const,
    selected: false
  },
  {
    name: "Trendyol", 
    logo: "https://upload.wikimedia.org/wikipedia/commons/c/c7/Trendyol_logo.svg",
    status: "draft" as const,
    selected: false
  },
  {
    name: "Hepsiburada",
    logo: "https://upload.wikimedia.org/wikipedia/commons/2/20/Hepsiburada_logo_official.svg", 
    status: "draft" as const,
    selected: false
  }
];

export default function NewProduct() {
  const [files, setFiles] = React.useState<File[]>([]);
  const [enhancedImages, setEnhancedImages] = React.useState<Array<{original: string, enhanced: string, isEnhanced: boolean}>>([]);
  const [isEnhancing, setIsEnhancing] = React.useState(false);
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [selectedMarketplaces, setSelectedMarketplaces] = React.useState<string[]>([]);
  const [isPublishing, setIsPublishing] = React.useState(false);
  const [formData, setFormData] = React.useState({
    title: "",
    description: "",
    price: "",
    category: "",
    keywords: "",
    sku: "",
    inventory: "",
    weight: "",
    dimensions: ""
  });

  const handleFileSelect = (selectedFiles: File[]) => {
    setFiles(selectedFiles);
    // Initialize enhanced images array when files are selected
    const initialEnhanced = selectedFiles.map((file) => ({
      original: URL.createObjectURL(file),
      enhanced: "", // Will be filled when enhanced
      isEnhanced: false
    }));
    setEnhancedImages(initialEnhanced);
  };

  const generateAIContent = async () => {
    if (files.length === 0) {
      alert("Please upload at least one image first.");
      return;
    }
    
    setIsGenerating(true);
    // Simulate AI generation
    setTimeout(() => {
      setFormData({
        ...formData,
        title: "Premium Wireless Bluetooth Headphones with Active Noise Cancellation",
        description: "Experience crystal-clear audio with these premium wireless headphones featuring advanced active noise cancellation technology. With 30-hour battery life, premium comfort padding, and superior sound quality, these headphones are perfect for music enthusiasts, professionals, and daily commuters. Features include quick charge, multipoint connectivity, and premium build quality.",
        category: "Electronics > Audio > Headphones",
        keywords: "wireless headphones, bluetooth, noise cancelling, premium audio, long battery, comfort fit, professional headphones",
        sku: "WH-" + Math.random().toString(36).substr(2, 6).toUpperCase(),
        inventory: "50",
        weight: "250"
      });
      setIsGenerating(false);
    }, 3000);
  };

  const generateFieldContent = async (fieldType: string) => {
    if (files.length === 0) {
      alert("Please upload at least one image first.");
      return;
    }
    
    // Simulate individual field AI generation
    setTimeout(() => {
      switch (fieldType) {
        case 'title':
          setFormData({...formData, title: "Premium Wireless Bluetooth Headphones with Active Noise Cancellation"});
          break;
        case 'description':
          setFormData({...formData, description: "Experience crystal-clear audio with these premium wireless headphones featuring advanced active noise cancellation technology. Perfect for music lovers and professionals."});
          break;
        case 'keywords':
          setFormData({...formData, keywords: "wireless headphones, bluetooth, noise cancelling, premium audio, long battery"});
          break;
        case 'sku':
          setFormData({...formData, sku: "WH-" + Math.random().toString(36).substr(2, 6).toUpperCase()});
          break;
      }
    }, 1000);
  };

  const enhanceImages = async () => {
    if (files.length === 0) {
      alert("Please upload at least one image first.");
      return;
    }
    
    setIsEnhancing(true);
    
    // Simulate AI image enhancement process
    setTimeout(() => {
      // Always return enhanced chair images regardless of original upload
      const enhancedChairImages = files.map((_, index) => ({
        original: "/origin.jpg", // Use the chair origin image
        enhanced: "/enhanced (2).png", // Use the enhanced chair image
        isEnhanced: true
      }));
      
      setEnhancedImages(enhancedChairImages);
      
      // Also update form data with chair-specific information
      setFormData({
        ...formData,
        title: "Siyah Metal Tel Sırtlı Sandalye, Endüstriyel Tasarım",
        description: "Modern ve endüstriyel tasarımı bir araya getiren bu siyah metal sandalye, estetik ve dayanıklılığı mekanlarınıza taşıyor. Tamamen metalden üretilmiş sağlam iskeleti ve dikey çubuklardan oluşan ikonik tel sırt yapısı, sandalyeye hem minimalist bir hava katmakta hem de uzun ömürlü bir kullanım sunmaktadır.",
        category: "Home & Garden > Furniture > Chairs",
        keywords: "tel sandalye, metal sandalye, endüstriyel sandalye, kafe sandalyesi, siyah sandalye, modern sandalye, restoran sandalyesi",
        sku: "CH-" + Math.random().toString(36).substr(2, 6).toUpperCase(),
        inventory: "25",
        weight: "4500",
        price: "850.00",
        dimensions: "45 x 50 x 85 cm"
      });
      
      setIsEnhancing(false);
    }, 2000);
  };

  const handleMarketplaceSelect = (marketplaceName: string) => {
    setSelectedMarketplaces(prev => 
      prev.includes(marketplaceName) 
        ? prev.filter(name => name !== marketplaceName)
        : [...prev, marketplaceName]
    );
  };

  const handlePublish = async () => {
    if (selectedMarketplaces.length === 0) {
      alert("Please select at least one marketplace to publish to.");
      return;
    }
    
    setIsPublishing(true);
    // Simulate publishing
    setTimeout(() => {
      setIsPublishing(false);
      alert("Product published successfully!");
    }, 2000);
  };

        return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Yeni Ürün Oluştur</h1>
        <p className="text-muted-foreground mt-1">
          Ürün detaylarını doldurun ve AI sihirbazlarını kullanarak bireysel alanları geliştirin
              </p>
            </div>
            
      {/* AI Generation Progress */}
            {isGenerating && (
        <Card className="glass-card border-purple-200 bg-gradient-to-r from-purple-50 to-blue-50">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                <span className="text-sm font-medium">AI Resimlerinizin İşleniyor</span>
                <span className="text-sm text-muted-foreground">İşleniyor...</span>
                    </div>
                    <Progress value={65} className="h-2" />
                    <p className="text-sm text-muted-foreground">
                ✨ Resimleriniz analiz ediliyor, SEO uyumlu başlık ve açıklamalar oluşturuluyor, ürün özellikleri geliştiriliyor...
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Image Enhancement Progress */}
            {isEnhancing && (
              <Card className="glass-card border-pink-200 bg-gradient-to-r from-pink-50 to-purple-50">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">🪑 AI Görsel Geliştirme</span>
                      <span className="text-sm text-muted-foreground">Geliştiriliyor...</span>
                    </div>
                    <Progress value={75} className="h-2" />
                    <p className="text-sm text-muted-foreground">
                      ✨ Resimleriniz AI ile geliştiriliyor: ışık düzenlemesi, arka plan iyileştirmesi, renk optimizasyonu ve detay keskinleştirme uygulanıyor...
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Images Section - Left Side */}
              <div className="space-y-6">
                    {/* Product Images */}
          <Card className="glass-card relative">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <ImageIcon className="w-5 h-5 mr-2" />
                  Ürün Resimleri
                </div>
                <Button
                  onClick={enhanceImages}
                  disabled={files.length === 0 || isEnhancing}
                  variant="ghost"
                  size="sm"
                  className="text-purple-600 hover:text-purple-700 hover:bg-purple-50"
                >
                  <Wand2 className="w-4 h-4" />
                  {isEnhancing ? "Geliştiriliyor..." : "AI Geliştir"}
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <UploadZone onFileSelect={handleFileSelect} />
              {files.length > 0 && (
                <div className="mt-4 space-y-4">
                  {enhancedImages.map((imageData, index) => (
                    <div key={index}>
                      {imageData.isEnhanced ? (
                        // Show before/after comparison for enhanced images
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Resim {index + 1}</span>
                            <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                              ✨ AI Geliştirildi
                            </Badge>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <p className="text-xs font-medium text-muted-foreground">Orijinal</p>
                              <div className="aspect-square bg-background-muted rounded-lg overflow-hidden">
                                <img
                                  src={imageData.original}
                                  alt={`Original ${index + 1}`}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            </div>
                            <div className="space-y-2">
                              <p className="text-xs font-medium text-purple-600">AI Geliştirilmiş</p>
                              <div className="aspect-square bg-background-muted rounded-lg overflow-hidden relative">
                                <img
                                  src={imageData.enhanced}
                                  alt={`Enhanced ${index + 1}`}
                                  className="w-full h-full object-cover"
                                />
                                <div className="absolute top-2 right-2">
                                  <Sparkles className="w-4 h-4 text-purple-400" />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        // Show original uploaded images
                        <div className="aspect-square bg-background-muted rounded-lg overflow-hidden">
                          <img
                            src={files[index] ? URL.createObjectURL(files[index]) : imageData.original}
                            alt={`Product ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Form Fields - Right Side */}
        <div className="space-y-6">
          {/* Product Details */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Package className="w-5 h-5 mr-2" />
                Ürün Detayları
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <Label htmlFor="title">Ürün Başlığı *</Label>
                    <Button
                      onClick={() => generateFieldContent('title')}
                      disabled={files.length === 0}
                      variant="ghost"
                      size="sm"
                      className="text-purple-600 hover:text-purple-700 hover:bg-purple-50 h-6 w-6 p-0"
                    >
                      <Wand2 className="w-3 h-3" />
                    </Button>
                  </div>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder="Ürün başlığını giriniz"
                  />
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <Label htmlFor="description">Açıklama *</Label>
                    <Button
                      onClick={() => generateFieldContent('description')}
                      disabled={files.length === 0}
                      variant="ghost"
                      size="sm"
                      className="text-purple-600 hover:text-purple-700 hover:bg-purple-50 h-6 w-6 p-0"
                    >
                      <Wand2 className="w-3 h-3" />
                    </Button>
                  </div>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Ürün açıklamasını giriniz"
                    rows={4}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="price">Fiyat ($) *</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: e.target.value})}
                      placeholder="0.00"
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="category">Kategori *</Label>
                    <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Kategori seçiniz" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <Label htmlFor="sku">SKU</Label>
                      <Button
                        onClick={() => generateFieldContent('sku')}
                        disabled={files.length === 0}
                        variant="ghost"
                        size="sm"
                        className="text-purple-600 hover:text-purple-700 hover:bg-purple-50 h-6 w-6 p-0"
                      >
                        <Wand2 className="w-3 h-3" />
                      </Button>
                    </div>
                    <Input
                      id="sku"
                      value={formData.sku}
                      onChange={(e) => setFormData({...formData, sku: e.target.value})}
                      placeholder="Ürün SKU"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="inventory">Stok</Label>
                    <Input
                      id="inventory"
                      type="number"
                      value={formData.inventory}
                      onChange={(e) => setFormData({...formData, inventory: e.target.value})}
                      placeholder="Mevcut stok"
                      className="mt-1"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="weight">Ağırlık (g)</Label>
                    <Input
                      id="weight"
                      type="number"
                      value={formData.weight}
                      onChange={(e) => setFormData({...formData, weight: e.target.value})}
                      placeholder="Ürün ağırlığı"
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="dimensions">Boyutlar</Label>
                    <Input
                      id="dimensions"
                      value={formData.dimensions}
                      onChange={(e) => setFormData({...formData, dimensions: e.target.value})}
                      placeholder="Uzunluk x Genişlik x Yükseklik (cm)"
                      className="mt-1"
                    />
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <Label htmlFor="keywords">SEO Anahtar Kelimeler</Label>
                    <Button
                      onClick={() => generateFieldContent('keywords')}
                      disabled={files.length === 0}
                      variant="ghost"
                      size="sm"
                      className="text-purple-600 hover:text-purple-700 hover:bg-purple-50 h-6 w-6 p-0"
                    >
                      <Wand2 className="w-3 h-3" />
                    </Button>
                  </div>
                  <Input
                    id="keywords"
                    value={formData.keywords}
                    onChange={(e) => setFormData({...formData, keywords: e.target.value})}
                    placeholder="Virgül ile ayrılmış anahtar kelimeler daha iyi keşfedilebilirliği sağlar"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Marketplace Selection */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Pazaryerlerine Yayınla</CardTitle>
              <p className="text-sm text-muted-foreground">
                Bu ürünün yayınlanacağı pazaryerlerini seçin
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-3">
                {marketplaces.map((marketplace) => (
                  <div
                    key={marketplace.name}
                    onClick={() => handleMarketplaceSelect(marketplace.name)}
                    className={`cursor-pointer p-3 rounded-lg border-2 transition-all ${
                      selectedMarketplaces.includes(marketplace.name)
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <img 
                        src={marketplace.logo} 
                        alt={marketplace.name}
                        className="w-6 h-6 object-contain"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-sm">{marketplace.name}</p>
                      </div>
                      {selectedMarketplaces.includes(marketplace.name) ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <div className="w-5 h-5 border-2 border-border rounded-full" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button 
              onClick={handlePublish}
              disabled={!formData.title || !formData.price || selectedMarketplaces.length === 0 || isPublishing}
              className="w-full bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700"
              size="lg"
            >
              <Save className="w-5 h-5 mr-2" />
              {isPublishing ? "Yayınlanıyor..." : `Pazaryerlerine Yayınla ${selectedMarketplaces.length} Pazaryer${selectedMarketplaces.length !== 1 ? 'ler' : ''}`}
            </Button>
            
            <Button variant="outline" className="w-full">
              <Upload className="w-4 h-4 mr-2" />
              Taslak Olarak Kaydet
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}