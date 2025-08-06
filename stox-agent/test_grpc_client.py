#!/usr/bin/env python3
"""
Test script for the gRPC SEO Agent
"""

import grpc
import time
import os
from dotenv import load_dotenv

# Import generated protobuf classes
import seo_agent_pb2
import seo_agent_pb2_grpc

# Load environment variables
load_dotenv()

class GRPCTestClient:
    """Test client for the gRPC SEO Agent service."""
    
    def __init__(self, server_address='localhost:50081'):
        """Initialize the test client."""
        self.server_address = server_address
        self.channel = None
        self.stub = None
    
    def connect(self):
        """Establish connection to the gRPC server."""
        try:
            print(f"Connecting to gRPC server at {self.server_address}...")
            self.channel = grpc.insecure_channel(self.server_address)
            
            # Wait for the channel to be ready (with timeout)
            grpc.channel_ready_future(self.channel).result(timeout=10)
            
            self.stub = seo_agent_pb2_grpc.SEOAgentServiceStub(self.channel)
            print("✅ Connected successfully!")
            return True
            
        except Exception as e:
            print(f"❌ Failed to connect: {e}")
            return False
    
    def disconnect(self):
        """Close the gRPC connection."""
        if self.channel:
            self.channel.close()
            print("🔌 Disconnected from server")
    
    def test_health_check(self):
        """Test the HealthCheck endpoint."""
        print("\n🏥 Testing HealthCheck endpoint...")
        try:
            request = seo_agent_pb2.HealthCheckRequest()
            response = self.stub.HealthCheck(request)
            
            print(f"Status: {response.status}")
            print(f"Service: {response.service}")
            
            if response.status == "healthy":
                print("✅ HealthCheck passed!")
                return True
            else:
                print("❌ HealthCheck failed - unhealthy status")
                return False
                
        except Exception as e:
            print(f"❌ HealthCheck error: {e}")
            return False
    
    def test_chat_endpoint(self):
        """Test the Chat endpoint with various messages."""
        print("\n💬 Testing Chat endpoint...")
        
        test_messages = [
            "Hello, how are you?",
            "Can you help me with SEO?",
            "What is the best way to optimize images?",
            "Analyze this website for SEO improvements",
            "https://static.vecteezy.com/system/resources/thumbnails/057/068/323/small/single-fresh-red-strawberry-on-table-green-background-food-fruit-sweet-macro-juicy-plant-image-photo.jpg"
        ]
        
        results = []
        
        for i, message in enumerate(test_messages, 1):
            print(f"\n📝 Test {i}: {'Empty message' if not message else message[:50]}...")
            
            try:
                request = seo_agent_pb2.ChatRequest(message=message)
                response = self.stub.Chat(request)
                
                print(f"Success: {response.success}")
                
                if response.success:
                    print(f"Response: {response.response[:100]}{'...' if len(response.response) > 100 else ''}")
                    if response.intermediate_steps:
                        print(f"Intermediate steps: {len(response.intermediate_steps)} steps")
                    print("✅ Chat test passed!")
                    results.append(True)
                else:
                    print(f"Error: {response.error}")
                    print("❌ Chat test failed (expected for empty message)")
                    results.append(False)
                    
            except Exception as e:
                print(f"❌ Chat error: {e}")
                results.append(False)
                
            time.sleep(1)  # Brief pause between requests
        
        passed = sum(results)
        total = len(results)
        print(f"\n📊 Chat endpoint results: {passed}/{total} tests passed")
        return passed > 0  # At least one test should pass
    

def main():
    """Main test function."""
    print("🚀 Starting gRPC SEO Agent Tests")
    print("=" * 50)
    
    # Create test client
    client = GRPCTestClient()
    
    try:
        # Connect to server
        if not client.connect():
            print("❌ Cannot connect to server. Make sure the gRPC server is running.")
            return False
        
        # Run all tests
        tests_passed = []
        
        tests_passed.append(client.test_health_check())
        tests_passed.append(client.test_chat_endpoint())
        #tests_passed.append(client.test_analyze_seo_endpoint())
        
        # Summary
        print("\n" + "=" * 50)
        print("📋 TEST SUMMARY")
        print("=" * 50)
        
        total_tests = len(tests_passed)
        passed_tests = sum(tests_passed)
        
        print(f"Total test suites: {total_tests}")
        print(f"Passed test suites: {passed_tests}")
        print(f"Failed test suites: {total_tests - passed_tests}")
        
        if passed_tests == total_tests:
            print("🎉 All tests passed!")
        else:
            print("⚠️  Some tests failed. Check the logs above.")
        
        return passed_tests == total_tests
        
    except KeyboardInterrupt:
        print("\n🛑 Tests interrupted by user")
        return False
        
    finally:
        client.disconnect()


if __name__ == "__main__":
    success = main()
    exit(0 if success else 1)
    