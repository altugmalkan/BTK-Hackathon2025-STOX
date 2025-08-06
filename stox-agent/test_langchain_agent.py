#!/usr/bin/env python3
"""
Test script for the Langchain SEO Agent
"""

import requests
import json
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def test_health_endpoint():
    """Test the health check endpoint."""
    print("Testing health endpoint...")
    try:
        response = requests.get("http://localhost:5000/health")
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.json()}")
        return response.status_code == 200
    except Exception as e:
        print(f"Error testing health endpoint: {e}")
        return False

def test_seo_analysis():
    """Test the SEO analysis endpoint."""
    print("\nTesting SEO analysis endpoint...")
    
    # Test URL from the original agent.py
    test_url = "https://dc9a2118r4lqa.cloudfront.net/users/b3a45f8c-5473-4a9a-9b48-35731c36125e/enhanced/enhanced_test-image_0d56bda0-ad35-45ab-a901-a206e54018ea_enhanced_a0fd79c3-6965-4dd4-9e8c-88f6273b193b.jpg"
    
    payload = {
        "image_url": test_url
    }
    
    try:
        response = requests.post(
            "http://localhost:5000/analyze-seo",
            json=payload,
            headers={"Content-Type": "application/json"}
        )
        
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            print(f"Success: {result['success']}")
            print(f"Image URL: {result['image_url']}")
            print(f"Analysis: {result['analysis']}")
            if result.get('intermediate_steps'):
                print(f"Intermediate Steps: {result['intermediate_steps']}")
        else:
            print(f"Error Response: {response.text}")
        
        return response.status_code == 200
        
    except Exception as e:
        print(f"Error testing SEO analysis: {e}")
        return False

def test_chat_endpoint():
    """Test the general chat endpoint."""
    print("\nTesting chat endpoint...")
    
    test_url = "https://dc9a2118r4lqa.cloudfront.net/users/b3a45f8c-5473-4a9a-9b48-35731c36125e/enhanced/enhanced_test-image_0d56bda0-ad35-45ab-a901-a206e54018ea_enhanced_a0fd79c3-6965-4dd4-9e8c-88f6273b193b.jpg"
    
    payload = {
        "message": f"Please analyze this image for SEO optimization: {test_url}"
    }
    
    try:
        response = requests.post(
            "http://localhost:5000/chat",
            json=payload,
            headers={"Content-Type": "application/json"}
        )
        
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            print(f"Success: {result['success']}")
            print(f"Response: {result['response']}")
            if result.get('intermediate_steps'):
                print(f"Intermediate Steps: {result['intermediate_steps']}")
        else:
            print(f"Error Response: {response.text}")
        
        return response.status_code == 200
        
    except Exception as e:
        print(f"Error testing chat endpoint: {e}")
        return False


def main():
    """Run all tests."""
    print("Starting Langchain SEO Agent Tests")
    print("=" * 50)
    
    # Check environment
    if not os.getenv("GOOGLE_API_KEY"):
        print("Warning: GOOGLE_API_KEY environment variable not found.")
        print("Make sure to set it before running the server or direct agent tests.")
    
    print("\n" + "=" * 50)
    print("Server-based tests (make sure server.py is running on localhost:5000)")
    
    # Test server endpoints
    health_passed = test_health_endpoint()
    seo_passed = test_seo_analysis()
    chat_passed = test_chat_endpoint()
    
    print("\n" + "=" * 50)
    print("Test Summary:")
    print(f"Health Endpoint: {'✅ PASSED' if health_passed else '❌ FAILED'}")
    print(f"SEO Analysis: {'✅ PASSED' if seo_passed else '❌ FAILED'}")
    print(f"Chat Endpoint: {'✅ PASSED' if chat_passed else '❌ FAILED'}")

if __name__ == "__main__":
    main()