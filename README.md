# STOX 🚀

**STOX**, yapay zeka destekli, çoklu‑pazaryeri entegrasyonu sunan yeni nesil e‑ticaret platformudur. Ürün görsellerinizi yükleyin; *Image Agent* fotoğrafınızı profesyonelce iyileştirir, *SEO & Market Agent* rakip analizi yapıp başlık ve açıklamaları optimize eder. API anahtarlarınızı tanımladığınızda tek tuşla birden fazla pazaryerine (Trendyol, Hepsiburada, Amazon vb.) toplu listeleme yapabilirsiniz.

---

## 🌟 Özellikler

| Kategori                         | Yetkinlik                                                                                     |
| -------------------------------- | --------------------------------------------------------------------------------------------- |
| ⚡ **AI Görsel İyileştirme**      | Gemini AI destekli gürültü azaltma, arka plan silme, renk & ışık dengesi                      |
| 🔍 **SEO & Pazar Analizi**       | Gerçek zamanlı anahtar kelime analizi, rakip fiyat takibi, otomatik başlık/açıklama oluşturma |
| 🔄 **Çoklu Pazaryeri Yayınlama** | Tek istekte birden fazla mağazada (API anahtarıyla) yayın                                     |
| 🛡️ **Güvenli Kimlik Doğrulama** | JWT + Refresh Token, NestJS Passport stratejileri                                             |
| ☁️ **Bulut Depolama & CDN**      | AWS S3 + CloudFront ile hızlı, ölçeklenir medya teslimi                                       |
| 🐳 **Tam Docker Desteği**        | Tüm servisler Docker & Docker Compose ile birkaç komutla ayağa kalkar                         |

---
## 🏗️ Mimari Genel Bakış

```
                    ┌───────────────────────────┐
                    │         Frontend          │
                    │    React + Vite (HTTPS)   │
                    └─────────────┬─────────────┘
                                  │
                                  ▼
                         ┌────────┴────────┐
                         │   Gateway (Go)  │
                         │  gRPC ⇄ REST    │
                         └─┬────┬────┬─────┘
           ┌──────────────┘    │    │
           │                   │    │
           ▼                   ▼    ▼
┌──────────────────┐ ┌──────────────────┐ ┌─────────────────────┐
│   Auth Service   │ │  Image Service   │ │  SEO‑Market Agent   │
│ NestJS + gRPC    │ │ Python + gRPC    │ │ Python + gRPC       │
└──────────────────┘ └──────────────────┘ └─────────────────────┘
                                   │
                                   ▼
                           ┌──────────────────┐
                           │    STOX Agent    │
                           │  LangChain gRPC  │
                           └──────────────────┘
```
---

### Servis Kümeleri

| # | Servis               | Dil / Çatı         | Açıklama                                                              | Repo                                                                                                               |
| - | -------------------- | ------------------ | --------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| 1 | **Gateway**          | Go                 | gRPC ⇄ REST köprüsü, S3/CloudFront proxy, rate‑limit, auth middleware | [https://github.com/BTK-Hackaton-2025/stox-gateway](https://github.com/BTK-Hackaton-2025/stox-gateway)             |
| 2 | **Auth**             | Node.js (NestJS)   | JWT & Refresh Token, Passport.js , PostgreSQL, gRPC sunucu/istemci     | [https://github.com/BTK-Hackaton-2025/stox-auth](https://github.com/BTK-Hackaton-2025/stox-auth)                   |
| 3 | **Image**            | Python             | Gemini AI ile görsel iyileştirme                                      | [https://github.com/BTK-Hackaton-2025/stox-image-service](https://github.com/BTK-Hackaton-2025/stox-image-service) |
| 4 | **SEO‑Market Agent** | Python             | Google Search + özel scraping, anahtar kelime & fiyat analizi         | [https://github.com/BTK-Hackaton-2025/stox-seo-service](https://github.com/BTK-Hackaton-2025/stox-seo-service)     |
| 5 | **STOX Agent**       | Python (LangChain) | Marketplace API entegrasyonları, çoklu servis orkestrasyonu           | [https://github.com/BTK-Hackaton-2025/stox-agent](https://github.com/BTK-Hackaton-2025/stox-agent)                 |
| 6 | **Frontend**         | React + Vite       | Yönetim paneli, gerçek zamanlı durumlar                               | [https://github.com/BTK-Hackaton-2025/stox-frontend](https://github.com/BTK-Hackaton-2025/stox-frontend)           |

> **Not:** Her servis bağımsız repodadır; ayrıntılar için bağlantıları inceleyin.

---
