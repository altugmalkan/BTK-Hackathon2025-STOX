# Testing Your Chat Endpoint

## Method 1: Using the Test Script
```bash
python test_chat_endpoint.py
```

## Method 2: Using curl Commands

### Health Check
```bash
curl -X GET http://localhost:8080/health
```

### Basic Chat Request
```bash
curl -X POST http://localhost:8080/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Please analyze the SEO for this image: https://example.com/image.jpg",
    "session_id": "test_session"
  }'
```

### Chat with Different Session
```bash
curl -X POST http://localhost:8080/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Analyze this product image: https://images.unsplash.com/photo-1505740420928-5e560c06d30e",
    "session_id": "product_analysis"
  }'
```

### Test with Invalid Input
```bash
curl -X POST http://localhost:8080/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "This is not an image URL, just text",
    "session_id": "invalid_test"
  }'
```

## Method 3: Using Python Requests (Interactive)

```python
import requests

# Test the chat endpoint
response = requests.post(
    "http://localhost:8080/chat",
    json={
        "message": "Please analyze the SEO for this image: https://example.com/image.jpg",
        "session_id": "test_session"
    }
)

print(f"Status: {response.status_code}")
print(f"Response: {response.json()}")
```

## Method 4: Using FastAPI's Built-in Documentation

1. Start your server: `python server.py`
2. Open your browser and go to: `http://localhost:8080/docs`
3. You'll see the interactive API documentation where you can test endpoints directly

## Method 5: Using Postman or Similar Tools

1. Create a new POST request to `http://localhost:8080/chat`
2. Set Content-Type header to `application/json`
3. Add body (raw JSON):
```json
{
  "message": "Please analyze the SEO for this image: https://example.com/image.jpg",
  "session_id": "test_session"
}
```

## Expected Responses

### Successful Response
```json
{
  "response": "Analysis result from the agent...",
  "session_id": "test_session"
}
```

### Error Response
```json
{
  "detail": "Error message from the server"
}
```

## Troubleshooting

1. **Server not running**: Make sure to start the server with `python server.py`
2. **Connection refused**: Check if the server is running on port 8080
3. **Import errors**: Make sure all dependencies are installed (`pip install -r requirements.txt`)
4. **gRPC errors**: Ensure the gRPC service is running on localhost:50071 