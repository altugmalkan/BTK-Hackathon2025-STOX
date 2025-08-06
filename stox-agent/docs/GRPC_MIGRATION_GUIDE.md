# gRPC Migration Guide

This guide explains how your Flask REST API has been converted to gRPC.

## Files Created

1. **`seo_agent.proto`** - Protocol buffer definition file
2. **`seo_agent_pb2.py`** - Generated message classes (auto-generated)
3. **`seo_agent_pb2_grpc.py`** - Generated gRPC service classes (auto-generated)
4. **`grpc_server.py`** - gRPC server implementation
5. **`test_grpc_client.py`** - Test client to verify functionality

## Dependencies Updated

- Added `grpcio-tools>=1.65.0` to requirements.txt for protobuf compilation

## API Endpoints Comparison

### REST API (Flask) → gRPC Service

| REST Endpoint | HTTP Method | gRPC Method | Description |
|---------------|-------------|-------------|-------------|
| `/health` | GET | `HealthCheck()` | Health check |
| `/analyze-seo` | POST | `AnalyzeSEO()` | SEO image analysis |
| `/chat` | POST | `Chat()` | General chat |

## Usage

### Starting the gRPC Server

```bash
# Install dependencies first
pip install -r requirements.txt

# Start the gRPC server
python grpc_server.py
```

The server will run on `localhost:50081` by default.

### Testing the Server

```bash
# Run the test client
python test_grpc_client.py
```

### Client Usage Example

```python
import grpc
import seo_agent_pb2
import seo_agent_pb2_grpc

# Connect to server
channel = grpc.insecure_channel('localhost:50081')
stub = seo_agent_pb2_grpc.SEOAgentServiceStub(channel)

# Health check
health_response = stub.HealthCheck(seo_agent_pb2.HealthCheckRequest())
print(f"Status: {health_response.status}")

# SEO Analysis
seo_request = seo_agent_pb2.AnalyzeSEORequest(
    image_url="https://example.com/image.jpg"
)
seo_response = stub.AnalyzeSEO(seo_request)
print(f"Analysis: {seo_response.analysis}")

# Chat
chat_request = seo_agent_pb2.ChatRequest(
    message="Hello, analyze this image for SEO"
)
chat_response = stub.Chat(chat_request)
print(f"Response: {chat_response.response}")
```

## Message Formats

### HealthCheck
- **Request**: Empty
- **Response**: `status`, `service`

### AnalyzeSEO
- **Request**: `image_url` (string)
- **Response**: `success`, `image_url`, `analysis`, `intermediate_steps[]`, `error`

### Chat
- **Request**: `message` (string)
- **Response**: `success`, `response`, `intermediate_steps[]`, `error`

## Benefits of gRPC

1. **Performance**: Binary protocol is faster than JSON
2. **Type Safety**: Strong typing with protobuf
3. **Code Generation**: Automatic client/server code generation
4. **Streaming**: Supports bidirectional streaming (can be added later)
5. **Cross-Language**: Works with multiple programming languages
6. **HTTP/2**: Built on HTTP/2 for better performance

## Migration Steps Completed

1. ✅ Created protobuf service definition
2. ✅ Generated Python gRPC code
3. ✅ Implemented gRPC server with same functionality as Flask app
4. ✅ Added gRPC dependencies to requirements.txt  
5. ✅ Created test client for verification

## Next Steps (Optional)

- Add TLS/SSL for secure communication
- Implement server-side streaming for large responses
- Add authentication/authorization
- Create clients in other languages (Go, Java, etc.)
- Deploy with Docker/Kubernetes