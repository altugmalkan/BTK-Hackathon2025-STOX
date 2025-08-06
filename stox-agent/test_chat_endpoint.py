import requests
import json
import time

# Test configuration
BASE_URL = "http://localhost:5000"

def test_health_endpoint():
    """Test the health check endpoint"""
    print("🔍 Testing health endpoint...")
    try:
        response = requests.get(f"{BASE_URL}/health")
        print(f"✅ Health check: {response.status_code} - {response.json()}")
        return True
    except requests.exceptions.ConnectionError:
        print("❌ Server not running. Please start the server first.")
        return False
    except Exception as e:
        print(f"❌ Health check failed: {e}")
        return False

def test_chat_endpoint(message, session_id="test_session"):
    """Test the chat endpoint with a given message and handle SSE stream"""
    print(f"\n💬 Testing chat endpoint with message: '{message}'")
    
    payload = {
        "message": message,
        "session_id": session_id
    }
    
    try:
        with requests.post(
            f"{BASE_URL}/chat",
            json=payload,
            headers={"Content-Type": "application/json", "Accept": "text/event-stream"},
            stream=True
        ) as response:
            print(f"📤 Request: {json.dumps(payload, indent=2)}")
            print(f"📥 Response Status: {response.status_code}")
            
            if response.status_code == 200:
                print("✅ Success! Streaming response:")
                for line in response.iter_lines():
                    if line:
                        decoded_line = line.decode('utf-8')
                        if decoded_line.startswith('data:'):
                            try:
                                json_data = json.loads(decoded_line[5:])
                                print(f"Received data: {json.dumps(json_data, indent=2)}")
                            except json.JSONDecodeError:
                                print(f"Could not decode JSON: {decoded_line}")
                return True
            else:
                print(f"❌ Error: {response.status_code}")
                print(f"Error details: {response.text}")
                return False
            
    except requests.exceptions.ConnectionError:
        print("❌ Server not running. Please start the server first.")
        return False
    except Exception as e:
        print(f"❌ Request failed: {e}")
        return False

def run_comprehensive_tests():
    """Run a series of tests"""
    print("🚀 Starting comprehensive chat endpoint tests...")
    
    # Test 1: Health check
    if not test_health_endpoint():
        return
    
    # Test 2: Basic chat with a valid image URL
    test_chat_endpoint(
        "Please analyze the SEO for this image: https://images.unsplash.com/photo-1505740420928-5e560c06d30e"
    )

if __name__ == "__main__":
    print("🧪 Chat Endpoint Test Suite")
    print("=" * 50)
    
    # Wait a moment for server to start
    print("⏳ Waiting for server to be ready...")
    time.sleep(2)
    
    run_comprehensive_tests()
    
    print("\n" + "=" * 50)
    print("✅ Test suite completed!")
