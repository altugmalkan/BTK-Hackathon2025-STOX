# STOX Servisleri - Gelişmiş Görsel İşleme Platformu

## 🌟 Genel Bakış

STOX Servisleri, yapay zeka destekli görsel iyileştirme, güvenli kullanıcı kimlik doğrulaması ve kesintisiz bulut entegrasyonu sunan kapsamlı bir mikroservis platformudur.

## 🏗️ Mimari

### Servisler

1. **🔐 Auth Servisi** (Node.js/NestJS)
   - JWT tabanlı kimlik doğrulama
   - Kullanıcı yönetimi
   - PostgreSQL veritabanı
   - gRPC iletişimi

2. **🖼️ Görsel Servisi** (Python)
   - Gemini AI ile yapay zeka destekli görsel iyileştirme
   - Görsel işleme ve optimizasyon
   - gRPC sunucusu

3. **🌐 Gateway Servisi** (Go)
   - API Gateway ve yönlendirme
   - AWS S3 entegrasyonu
   - CloudFront CDN
   - Kimlik doğrulama middleware'i

## 🚀 Özellikler

- **🤖 AI Görsel İyileştirme**: Google Gemini AI ile desteklenmektedir
- **☁️ Bulut Depolama**: CloudFront CDN ile AWS S3
- **🔒 Güvenli Kimlik Doğrulama**: Rol tabanlı erişim ile JWT token'ları
- **📊 Görsel Yönetimi**: Kullanıcıya özel görsel galerileri
- **🎯 RESTful API'ler**: Temiz ve dokümante edilmiş endpoint'ler
- **🐳 Docker Desteği**: Tamamen konteynerize edilmiş servisler

## 📋 Gereksinimler

- Docker & Docker Compose
- AWS Hesabı (S3 ve CloudFront için)
- Google AI API Anahtarı (Gemini için)

## 🛠️ Kurulum

1. **Repository'yi klonlayın**
   ```bash
   git clone <repository-url>
   cd stox-services
   ```

2. **Ortam değişkenlerini yapılandırın**
   ```bash
   cd stox-gateway
   cp .env.example .env
   # .env dosyasını gerçek değerlerinizle düzenleyin
   ```

3. **Servisleri derleyin ve çalıştırın**
   ```bash
   docker-compose build
   docker-compose up -d
   ```

## 🔧 Yapılandırma

### Gerekli Ortam Değişkenleri

`stox-gateway` dizininde bir `.env` dosyası oluşturun:

```env
# AWS Yapılandırması
AWS_ACCESS_KEY_ID=aws_erişim_anahtarınız
AWS_SECRET_ACCESS_KEY=aws_gizli_anahtarınız
AWS_REGION=us-east-1

# AI Servisleri
GEMINI_API_KEY=gemini_api_anahtarınız

# Veritabanı
DB_PASSWORD=güvenli_şifreniz

# JWT Gizli Anahtarları (32+ karakter güçlü gizli anahtarlar oluşturun)
JWT_ACCESS_SECRET=jwt_erişim_gizli_anahtarınız
JWT_REFRESH_SECRET=jwt_yenileme_gizli_anahtarınız
```

## 🧪 Test Etme

Kapsamlı test paketini çalıştırın:

```bash
cd stox-gateway
chmod +x test-enhanced-image.sh
./test-enhanced-image.sh
```

## 📚 API Dokümantasyonu

### Kimlik Doğrulama

#### Kullanıcı Kaydı
```bash
POST /api/v1/auth/register
Content-Type: application/json

{
  "email": "kullanici@ornek.com",
  "password": "GüvenliŞifre123!",
  "firstName": "Ahmet",
  "lastName": "Yılmaz",
  "role": "user"
}
```

#### Giriş
```bash
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "kullanici@ornek.com",
  "password": "GüvenliŞifre123!"
}
```

### Görsel İşlemleri

#### Görsel Yükleme ve İyileştirme
```bash
POST /api/v1/images/upload
Authorization: Bearer <token>
Content-Type: multipart/form-data

image: <görsel_dosyası>
```

#### Kullanıcı Görsellerini Getirme
```bash
GET /api/v1/images/list
Authorization: Bearer <token>
```

## 📁 Proje Yapısı

```
stox-services/
├── stox-auth/           # Kimlik doğrulama servisi (NestJS)
├── stox-gateway/        # API Gateway (Go)
├── stox-image-service/  # Görsel işleme (Python)
└── README.md
```

## 🔄 İş Akışı

1. Kullanıcı kayıt olur/giriş yapar → JWT token alır
2. Kullanıcı görsel yükler → Gateway isteği doğrular
3. Görsel S3'te saklanır → Orijinal görsel URL'si oluşturulur
4. Görsel AI servisine gönderilir → Gemini AI ile iyileştirilir
5. İyileştirilmiş görsel S3'te saklanır → İyileştirilmiş URL oluşturulur
6. Her iki URL de CloudFront CDN üzerinden döndürülür

## 🛡️ Güvenlik

- Yenileme token'ları ile JWT tabanlı kimlik doğrulama
- Rol tabanlı erişim kontrolü
- Ortam değişkeni yapılandırması
- AWS IAM en iyi uygulamaları
- Girdi doğrulama ve temizleme

## 🌍 Üretim Dağıtımı

Üretim dağıtımı için:

1. Erişim anahtarları yerine AWS IAM rollerini kullanın
2. HTTPS/TLS sertifikalarını yapılandırın
3. Uygun izleme ve günlükleme kurun
4. Servisler için otomatik ölçeklendirme yapılandırın
5. Yönetilen veritabanları (RDS) kullanın

## 🤝 Katkıda Bulunma

1. Repository'yi fork edin
2. Özellik branch'i oluşturun
3. Değişikliklerinizi commit edin
4. Branch'e push edin
5. Pull Request oluşturun

## 📄 Lisans

Bu proje MIT Lisansı altında lisanslanmıştır.

## 🆘 Destek

Destek ve sorular için lütfen repository'de bir issue açın.

---

**BTK Hackathon 2025 için ❤️ ile geliştirilmiştir**
