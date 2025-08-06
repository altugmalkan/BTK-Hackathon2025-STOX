# STOX Services - Enhanced Image Processing Platform

## 🌟 Overview

STOX Services is a comprehensive microservices platform for enhanced image processing, featuring AI-powered image enhancement, secure user authentication, and seamless cloud integration.

## 🏗️ Architecture

### Services

1. **🔐 Auth Service** (Node.js/NestJS)
   - JWT-based authentication
   - User management
   - PostgreSQL database
   - gRPC communication

2. **🖼️ Image Service** (Python)
   - AI-powered image enhancement using Gemini AI
   - Image processing and optimization
   - gRPC server

3. **🌐 Gateway Service** (Go)
   - API Gateway and routing
   - AWS S3 integration
   - CloudFront CDN
   - Authentication middleware

## 🚀 Features

- **🤖 AI Image Enhancement**: Powered by Google Gemini AI
- **☁️ Cloud Storage**: AWS S3 with CloudFront CDN
- **🔒 Secure Authentication**: JWT tokens with role-based access
- **📊 Image Management**: User-specific image galleries
- **🎯 RESTful APIs**: Clean and documented endpoints
- **🐳 Docker Support**: Fully containerized services

## 📋 Prerequisites

- Docker & Docker Compose
- AWS Account (for S3 and CloudFront)
- Google AI API Key (for Gemini)

## 🛠️ Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd stox-services
   ```

2. **Configure environment variables**
   ```bash
   cd stox-gateway
   cp .env.example .env
   # Edit .env with your actual values
   ```

3. **Build and run services**
   ```bash
   docker-compose build
   docker-compose up -d
   ```

## 🔧 Configuration

### Required Environment Variables

Create a `.env` file in the `stox-gateway` directory:

```env
# AWS Configuration
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=us-east-1

# AI Services
GEMINI_API_KEY=your_gemini_api_key

# Database
DB_PASSWORD=your_secure_password

# JWT Secrets (generate strong 32+ character secrets)
JWT_ACCESS_SECRET=your_jwt_access_secret
JWT_REFRESH_SECRET=your_jwt_refresh_secret
```

## 🧪 Testing

Run the comprehensive test suite:

```bash
cd stox-gateway
chmod +x test-enhanced-image.sh
./test-enhanced-image.sh
```

## 📚 API Documentation

### Authentication

#### Register User
```bash
POST /api/v1/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "firstName": "John",
  "lastName": "Doe",
  "role": "user"
}
```

#### Login
```bash
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

### Image Operations

#### Upload & Enhance Image
```bash
POST /api/v1/images/upload
Authorization: Bearer <token>
Content-Type: multipart/form-data

image: <image_file>
```

#### Get User Images
```bash
GET /api/v1/images/list
Authorization: Bearer <token>
```

## 📁 Project Structure

```
stox-services/
├── stox-auth/           # Authentication service (NestJS)
├── stox-gateway/        # API Gateway (Go)
├── stox-image-service/  # Image processing (Python)
└── README.md
```

## 🔄 Workflow

1. User registers/logs in → Gets JWT token
2. User uploads image → Gateway authenticates request
3. Image stored in S3 → Original image URL generated
4. Image sent to AI service → Enhanced with Gemini AI
5. Enhanced image stored in S3 → Enhanced URL generated
6. Both URLs returned via CloudFront CDN

## 🛡️ Security

- JWT-based authentication with refresh tokens
- Role-based access control
- Environment variable configuration
- AWS IAM best practices
- Input validation and sanitization

## 🌍 Production Deployment

For production deployment:

1. Use AWS IAM roles instead of access keys
2. Configure HTTPS/TLS certificates
3. Set up proper monitoring and logging
4. Configure auto-scaling for services
5. Use managed databases (RDS)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions, please open an issue in the repository.

---

**Built with ❤️ for BTK Hackathon 2025**
