# Langchain Agent with Gemini Setup

## Overview
This project now includes a Langchain agent that uses Google's Gemini model instead of OpenAI. The agent wraps your existing `seo_analysis` function and provides conversational AI capabilities.

## Key Components

### 1. Langchain Agent (`multi_tool_agent/langchain_agent.py`)
- **SEOAnalysisTool**: Langchain tool wrapper around your existing `seo_analysis` function
- **SEOLangChainAgent**: Main agent class using Gemini 1.5 Pro
- **Factory function**: `create_seo_agent()` for easy instantiation

### 2. Flask Server (`server.py`)
- `/health` - Health check endpoint
- `/analyze-seo` - Direct SEO analysis endpoint
- `/chat` - Conversational interface with the agent

### 3. Test Suite (`test_langchain_agent.py`)
- Tests for all endpoints
- Direct agent testing
- Server-based API testing

## Setup Instructions

### 1. Install Dependencies
```bash
pip install -r requirements.txt
```

### 2. Set Environment Variables
Copy `.env.example` to `.env` and set:
```bash
# Required: Google API Key for Gemini
GOOGLE_API_KEY=your_google_api_key_here
```

### 3. Get Google API Key
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Copy the key to your `.env` file

## Usage

### Running the Server
```bash
python server.py
```
Server runs on `localhost:5000`

### API Endpoints

#### Health Check
```bash
curl http://localhost:5000/health
```

#### Analyze Image SEO
```bash
curl -X POST http://localhost:5000/analyze-seo \
  -H "Content-Type: application/json" \
  -d '{"image_url": "https://example.com/image.jpg"}'
```

#### Chat Interface
```bash
curl -X POST http://localhost:5000/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Please analyze this image: https://example.com/image.jpg"}'
```

### Using Agent Directly
```python
from multi_tool_agent.langchain_agent import create_seo_agent

# Create agent
agent = create_seo_agent()

# Analyze image
result = agent.analyze_image_seo("https://example.com/image.jpg")
print(result["output"])

# Chat with agent
result = agent.chat("Analyze this image for SEO: https://example.com/image.jpg")
print(result["response"])
```

## Testing
```bash
python test_langchain_agent.py
```

## Architecture

### How it Works
1. **User Input** → Langchain Agent (Gemini)
2. **Agent decides** to use SEO Analysis Tool
3. **Tool calls** your existing `seo_analysis(url)` function
4. **Your function** connects to gRPC container on `localhost:50071`
5. **Response flows back** through Langchain → User

### Key Features
- ✅ Uses your existing `seo_analysis` function unchanged
- ✅ Maintains gRPC connection to your container
- ✅ Adds conversational AI with Gemini
- ✅ Provides both REST API and direct Python interface
- ✅ Comprehensive error handling
- ✅ Test coverage

## Dependencies Changed
- ❌ Removed: `langchain-openai`
- ✅ Added: `langchain-google-genai`, `google-generativeai`
- ✅ Environment: `GOOGLE_API_KEY` instead of `OPENAI_API_KEY`

## Model Configuration
- **Model**: `gemini-1.5-pro`
- **Temperature**: 0 (for consistent responses)
- **Agent Type**: Tool-calling agent with function calling capabilities

The agent seamlessly integrates with your existing container architecture while providing modern conversational AI capabilities!