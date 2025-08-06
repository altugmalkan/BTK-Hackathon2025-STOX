# Docker Deployment Guide for SEO Agent gRPC Service

This guide explains how to deploy your SEO Agent gRPC service using Docker.

## Files Created

- **`Dockerfile`** - Multi-stage Docker image for the gRPC server
- **`docker-compose.yml`** - Orchestration file for easy deployment
- **`.dockerignore`** - Optimizes Docker build by excluding unnecessary files

## Prerequisites

1. Docker and Docker Compose installed
2. `.env` file with your `GOOGLE_API_KEY` (recommended)

## Environment Setup

Create a `.env` file in your project root:

```bash
# .env
GOOGLE_API_KEY=your_google_api_key_here
```

## Deployment Options

### Option 1: Docker Compose (Recommended)

```bash
# Build and start the service
docker-compose up --build -d

# View logs
docker-compose logs -f seo-agent-grpc

# Stop the service
docker-compose down
```

### Option 2: Direct Docker Commands

```bash
# Build the image
docker build -t seo-agent-grpc .

# Run the container
docker run -d \
  --name seo-agent-grpc \
  -p 50081:50081 \
  --env-file .env \
  seo-agent-grpc

# View logs
docker logs -f seo-agent-grpc

# Stop and remove
docker stop seo-agent-grpc
docker rm seo-agent-grpc
```

## Service Details

- **Port**: 50081 (mapped to host port 50081)
- **Protocol**: gRPC over HTTP/2
- **Health Check**: Built-in health check every 30 seconds
- **Auto-restart**: Container restarts unless manually stopped

## Testing the Dockerized Service

### Using the Test Client

```bash
# Test the containerized service
python test_grpc_client.py
```

### Using grpcurl (if installed)

```bash
# Health check
grpcurl -plaintext localhost:50081 seo_agent.SEOAgentService/HealthCheck

# SEO Analysis
grpcurl -plaintext -d '{"image_url": "https://example.com/image.jpg"}' \
  localhost:50081 seo_agent.SEOAgentService/AnalyzeSEO

# Chat
grpcurl -plaintext -d '{"message": "Hello"}' \
  localhost:50081 seo_agent.SEOAgentService/Chat
```

## Docker Features

### Security
- Runs as non-root user (`appuser`)
- Minimal base image (Python slim)
- Only necessary ports exposed

### Performance
- Multi-layer caching for faster rebuilds
- Optimized .dockerignore for smaller build context
- Health checks for container monitoring

### Monitoring
- Built-in health checks
- Container logs via Docker
- Restart policies for high availability

## Production Considerations

### 1. Environment Variables

```yaml
# docker-compose.prod.yml
environment:
  - GOOGLE_API_KEY=${GOOGLE_API_KEY}
  - PYTHONUNBUFFERED=1
  - GRPC_VERBOSITY=ERROR  # Reduce log verbosity
```

### 2. Resource Limits

```yaml
# Add to docker-compose.yml
deploy:
  resources:
    limits:
      cpus: '1'
      memory: 1G
    reservations:
      cpus: '0.5'
      memory: 512M
```

### 3. Volume Mounts

```yaml
# For persistent logs
volumes:
  - ./logs:/app/logs
  - ./data:/app/data  # If needed for data persistence
```

### 4. Network Configuration

```yaml
# For custom networks or external access
networks:
  seo-network:
    driver: bridge
  external-network:
    external: true
```

## Troubleshooting

### Container Won't Start

```bash
# Check container logs
docker-compose logs seo-agent-grpc

# Check container status
docker-compose ps
```

### Health Check Failing

```bash
# Test health check manually
docker exec seo-agent-grpc python -c "
import grpc
import seo_agent_pb2_grpc
import seo_agent_pb2
channel = grpc.insecure_channel('localhost:50081')
stub = seo_agent_pb2_grpc.SEOAgentServiceStub(channel)
response = stub.HealthCheck(seo_agent_pb2.HealthCheckRequest())
print(f'Status: {response.status}')
"
```

### Port Conflicts

```bash
# Check what's using port 50081
netstat -tlnp | grep 50081

# Use different port if needed
docker-compose up --build -d -p 50082:50081
```

## Scaling

### Horizontal Scaling

```yaml
# docker-compose.yml
services:
  seo-agent-grpc:
    # ... existing configuration
    deploy:
      replicas: 3
    ports:
      - "50081-50083:50081"  # Multiple ports
```

### Load Balancer Integration

For production, consider using:
- Nginx with gRPC load balancing
- Kubernetes with gRPC services
- Envoy proxy for advanced gRPC features

## Commands Summary

```bash
# Development
docker-compose up --build        # Build and start
docker-compose logs -f           # Follow logs
docker-compose down             # Stop and remove

# Production
docker-compose -f docker-compose.prod.yml up -d
docker-compose exec seo-agent-grpc bash  # Shell access
docker-compose restart seo-agent-grpc    # Restart service
```