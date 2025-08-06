import React, { useState } from "react";
import { Settings2, User, Store, Key, Save, Eye, EyeOff, Plus, Trash2, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface MarketplaceCredential {
  id: string;
  marketplace: string;
  apiKey: string;
  secretKey: string;
  status: 'active' | 'inactive' | 'error';
  lastSync?: string;
}

export default function Settings() {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [showApiKeys, setShowApiKeys] = useState<Record<string, boolean>>({});
  const [userSettings, setUserSettings] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: '',
    timezone: 'UTC',
    language: 'en',
    emailNotifications: true,
    pushNotifications: true,
    marketingEmails: false,
  });

  const [marketplaceCredentials, setMarketplaceCredentials] = useState<MarketplaceCredential[]>([
    {
      id: '1',
      marketplace: 'Amazon',
      apiKey: 'AKIAI***************',
      secretKey: '************************',
      status: 'active',
      lastSync: '2 hours ago'
    },
    {
      id: '2',
      marketplace: 'Trendyol',
      apiKey: '',
      secretKey: '',
      status: 'inactive'
    }
  ]);

  const [newCredential, setNewCredential] = useState({
    marketplace: '',
    apiKey: '',
    secretKey: '',
    additionalFields: {} as Record<string, string>
  });

  const availableMarketplaces = [
    { 
      value: 'amazon', 
      label: 'Amazon',
      fields: [
        { key: 'sellerId', label: 'Seller ID', required: true },
        { key: 'marketplaceId', label: 'Marketplace ID', required: true }
      ]
    },
    { 
      value: 'trendyol', 
      label: 'Trendyol',
      fields: [
        { key: 'supplierId', label: 'Supplier ID', required: true }
      ]
    },
    { 
      value: 'hepsiburada', 
      label: 'Hepsiburada',
      fields: [
        { key: 'merchantId', label: 'Merchant ID', required: true }
      ]
    },
    { 
      value: 'ebay', 
      label: 'eBay',
      fields: [
        { key: 'devId', label: 'Developer ID', required: true },
        { key: 'certId', label: 'Certificate ID', required: true }
      ]
    },
    { 
      value: 'etsy', 
      label: 'Etsy',
      fields: [
        { key: 'shopId', label: 'Shop ID', required: true }
      ]
    }
  ];

  const toggleApiKeyVisibility = (credentialId: string) => {
    setShowApiKeys(prev => ({
      ...prev,
      [credentialId]: !prev[credentialId]
    }));
  };

  const handleUserSettingsChange = (field: string, value: string) => {
    setUserSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveUserSettings = async () => {
    try {
      // Here you would typically make an API call to save user settings
      toast({
        title: "Ayarlar kaydedildi",
        description: "Kullanıcı ayarlarınız başarıyla güncellendi.",
      });
    } catch (error) {
      toast({
        title: "Hata",
        description: "Ayarlar kaydedilemedi. Lütfen tekrar deneyiniz.",
        variant: "destructive",
      });
    }
  };

  const handleAddCredential = async () => {
    if (!newCredential.marketplace || !newCredential.apiKey || !newCredential.secretKey) {
      toast({
        title: "Hata",
        description: "Lütfen tüm alanları doldurunuz.",
        variant: "destructive",
      });
      return;
    }

    const selectedMarketplace = availableMarketplaces.find(m => m.value === newCredential.marketplace);
    
    const newCred: MarketplaceCredential = {
      id: Date.now().toString(),
      marketplace: selectedMarketplace?.label || newCredential.marketplace,
      apiKey: newCredential.apiKey,
      secretKey: newCredential.secretKey,
      status: 'inactive'
    };

    setMarketplaceCredentials(prev => [...prev, newCred]);
    setNewCredential({
      marketplace: '',
      apiKey: '',
      secretKey: '',
      additionalFields: {}
    });

    toast({
      title: "Kimlik bilgileri eklendi",
      description: "Yeni pazaryerleri kimlik bilgileri başarıyla eklendi.",
    });
  };

  const handleRemoveCredential = (id: string) => {
    setMarketplaceCredentials(prev => prev.filter(cred => cred.id !== id));
    toast({
      title: "Kimlik bilgileri silindi",
      description: "Pazaryerleri kimlik bilgileri silindi.",
    });
  };

  const handleTestCredential = async (id: string) => {
    const credential = marketplaceCredentials.find(c => c.id === id);
    if (!credential) return;

    // Simulate API test
    setTimeout(() => {
      setMarketplaceCredentials(prev =>
        prev.map(cred =>
          cred.id === id
            ? { ...cred, status: Math.random() > 0.3 ? 'active' : 'error', lastSync: 'Just now' }
            : cred
        )
      );
    }, 1000);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Aktif</Badge>;
      case 'error':
        return <Badge variant="destructive">Hata</Badge>;
      default:
        return <Badge variant="secondary">Pasif</Badge>;
    }
  };

  const selectedMarketplace = availableMarketplaces.find(m => m.value === newCredential.marketplace);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold flex items-center">
          <Settings2 className="w-8 h-8 mr-3" />
          Ayarlar
        </h1>
        <p className="text-muted-foreground mt-1">
          Hesap tercihlerinizi ve pazaryerleri entegrasyonlarını yönetin
        </p>
      </div>

      <Tabs defaultValue="user" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="user" className="flex items-center">
            <User className="w-4 h-4 mr-2" />
            Kullanıcı Ayarları
          </TabsTrigger>
          <TabsTrigger value="marketplace" className="flex items-center">
            <Store className="w-4 h-4 mr-2" />
            Pazaryerleri Ayarları
          </TabsTrigger>
        </TabsList>

        {/* User Settings Tab */}
        <TabsContent value="user" className="space-y-6">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="w-5 h-5 mr-2" />
                Profil Bilgileri
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">Adınız</Label>
                  <Input
                    id="firstName"
                    value={userSettings.firstName}
                    onChange={(e) => handleUserSettingsChange('firstName', e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Soyadınız</Label>
                  <Input
                    id="lastName"
                    value={userSettings.lastName}
                    onChange={(e) => handleUserSettingsChange('lastName', e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">E-posta Adresiniz</Label>
                  <Input
                    id="email"
                    type="email"
                    value={userSettings.email}
                    onChange={(e) => handleUserSettingsChange('email', e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Telefon Numaranız</Label>
                  <Input
                    id="phone"
                    value={userSettings.phone}
                    onChange={(e) => handleUserSettingsChange('phone', e.target.value)}
                    placeholder="+1 (555) 123-4567"
                    className="mt-1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="timezone">Zaman Dilimi</Label>
                  <Select value={userSettings.timezone} onValueChange={(value) => handleUserSettingsChange('timezone', value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UTC">UTC</SelectItem>
                      <SelectItem value="EST">Eastern Time</SelectItem>
                      <SelectItem value="PST">Pacific Time</SelectItem>
                      <SelectItem value="CET">Central European Time</SelectItem>
                      <SelectItem value="JST">Japan Standard Time</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="language">Dil</Label>
                  <Select value={userSettings.language} onValueChange={(value) => handleUserSettingsChange('language', value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                      <SelectItem value="de">German</SelectItem>
                      <SelectItem value="tr">Turkish</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Bildirim Tercihleri</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="email-notifications" className="font-medium text-foreground">E-posta Bildirimleri</Label>
                  <p className="text-sm text-muted-foreground">Siparişler ve güncellemeler hakkında bildirim alın</p>
                </div>
                <Switch
                  id="email-notifications"
                  checked={userSettings.emailNotifications}
                  onCheckedChange={(checked) => handleUserSettingsChange('emailNotifications', checked.toString())}
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="push-notifications" className="font-medium text-foreground">Push Bildirimleri</Label>
                  <p className="text-sm text-muted-foreground">Tarayıcınızda anında uyarılar alın</p>
                </div>
                <Switch
                  id="push-notifications"
                  checked={userSettings.pushNotifications}
                  onCheckedChange={(checked) => handleUserSettingsChange('pushNotifications', checked.toString())}
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="marketing-emails" className="font-medium text-foreground">Pazaryerleri Bildirimleri</Label>
                  <p className="text-sm text-muted-foreground">Promosyonel içerik ve özellik güncellemeleri alın</p>
                </div>
                <Switch
                  id="marketing-emails"
                  checked={userSettings.marketingEmails}
                  onCheckedChange={(checked) => handleUserSettingsChange('marketingEmails', checked.toString())}
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button onClick={handleSaveUserSettings} className="bg-primary hover:bg-primary/90">
              <Save className="w-4 h-4 mr-2" />
              Değişiklikleri Kaydet
            </Button>
          </div>
        </TabsContent>

        {/* Marketplace Settings Tab */}
        <TabsContent value="marketplace" className="space-y-6">
          {/* Existing Credentials */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Key className="w-5 h-5 mr-2" />
                Entegre Pazaryerleri
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Pazaryerleri API kimlik bilgilerinizi ve bağlantı durumunuzu yönetin
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {marketplaceCredentials.map((credential) => (
                  <div key={credential.id} className="p-4 border border-border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <h3 className="font-medium">{credential.marketplace}</h3>
                        {getStatusBadge(credential.status)}
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleTestCredential(credential.id)}
                        >
                          Bağlantıyı Test Et
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveCredential(credential.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-xs font-medium text-foreground">API Anahtarı</Label>
                        <div className="flex items-center space-x-2 mt-1">
                          <Input
                            type={showApiKeys[credential.id] ? "text" : "password"}
                            value={credential.apiKey}
                            readOnly
                            className="font-mono text-sm"
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleApiKeyVisibility(credential.id)}
                          >
                            {showApiKeys[credential.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </Button>
                        </div>
                      </div>
                      <div>
                        <Label className="text-xs font-medium text-foreground">Gizli Anahtar</Label>
                        <div className="flex items-center space-x-2 mt-1">
                          <Input
                            type="password"
                            value={credential.secretKey}
                            readOnly
                            className="font-mono text-sm"
                          />
                        </div>
                      </div>
                    </div>
                    
                    {credential.lastSync && (
                      <p className="text-xs text-muted-foreground mt-2">
                        Son eşitleme: {credential.lastSync}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Add New Marketplace Credentials */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Plus className="w-5 h-5 mr-2" />
                Yeni Pazaryerleri Entegre Et
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Yeni pazaryerleri için geliştirici kimlik bilgilerini ekleyin
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="marketplace-select">Pazaryerleri Seçin</Label>
                <Select 
                  value={newCredential.marketplace} 
                  onValueChange={(value) => setNewCredential(prev => ({ ...prev, marketplace: value, additionalFields: {} }))}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Bir pazaryerini seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableMarketplaces.map((marketplace) => (
                      <SelectItem key={marketplace.value} value={marketplace.value}>
                        {marketplace.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {newCredential.marketplace && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="api-key">API Anahtarı *</Label>
                      <Input
                        id="api-key"
                        value={newCredential.apiKey}
                        onChange={(e) => setNewCredential(prev => ({ ...prev, apiKey: e.target.value }))}
                        placeholder="API anahtarınızı giriniz"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="secret-key">Gizli Anahtar *</Label>
                      <Input
                        id="secret-key"
                        type="password"
                        value={newCredential.secretKey}
                        onChange={(e) => setNewCredential(prev => ({ ...prev, secretKey: e.target.value }))}
                        placeholder="Gizli anahtarınızı giriniz"
                        className="mt-1"
                      />
                    </div>
                  </div>

                  {/* Additional marketplace-specific fields */}
                  {selectedMarketplace && selectedMarketplace.fields.length > 0 && (
                    <div className="space-y-4">
                      <Separator />
                      <h4 className="font-medium text-sm">Ekstra Gerekli Bilgiler</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {selectedMarketplace.fields.map((field) => (
                          <div key={field.key}>
                            <Label htmlFor={field.key} className="font-medium text-foreground">
                              {field.label} {field.required && '*'}
                            </Label>
                            <Input
                              id={field.key}
                              value={newCredential.additionalFields[field.key] || ''}
                              onChange={(e) => setNewCredential(prev => ({
                                ...prev,
                                additionalFields: {
                                  ...prev.additionalFields,
                                  [field.key]: e.target.value
                                }
                              }))}
                              placeholder={`Enter your ${field.label.toLowerCase()}`}
                              className="mt-1"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex justify-end pt-4">
                    <Button onClick={handleAddCredential} className="bg-primary hover:bg-primary/90">
                      <Plus className="w-4 h-4 mr-2" />
                      Kimlik Bilgilerini Ekle
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Integration Guide */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Entegrasyon Rehberi</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-sm">
                <div>
                  <h4 className="font-medium mb-2">API kimlik bilgilerinizi nasıl alınır:</h4>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-start">
                      <span className="font-medium text-foreground mr-2">Amazon:</span>
                      Satıcı Merkezi → Ayarlar → Kullanıcı İzinleri → Geliştirici Merkezi
                    </li>
                    <li className="flex items-start">
                      <span className="font-medium text-foreground mr-2">Trendyol:</span>
                      Pazaryerleri Entegrasyon bölümünüzdeki erişim
                    </li>
                    <li className="flex items-start">
                      <span className="font-medium text-foreground mr-2">Hepsiburada:</span>
                      Pazaryer Merkezi → API Yönetimi
                    </li>
                    <li className="flex items-start">
                      <span className="font-medium text-foreground mr-2">eBay:</span>
                      eBay Geliştirici Programında bir uygulama oluşturun
                    </li>
                    <li className="flex items-start">
                      <span className="font-medium text-foreground mr-2">Etsy:</span>
                      Etsy Geliştirici Portalında uygulamanızı kaydedin
                    </li>
                  </ul>
                </div>
                <Separator />
                <div>
                  <h4 className="font-medium mb-2">Güvenlik Notları:</h4>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• Kimlik bilgileriniz şifrelenmiş ve güvenli bir şekilde saklanır</li>
                    <li>• API anahtarlarınızı yetkisiz taraflara paylaşmayın</li>
                    <li>• Kimlik bilgilerinizi düzenli olarak değiştirin</li>
                    <li>• Pazaryerleri hesaplarınızın normal işlemleri için izleyin</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}