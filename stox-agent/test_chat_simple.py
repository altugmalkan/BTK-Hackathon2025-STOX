#!/usr/bin/env python3
"""
Simple test script focused on the gRPC Chat endpoint
"""

import grpc
import seo_agent_pb2
import seo_agent_pb2_grpc

def test_chat_simple():
    """Simple test for the Chat endpoint."""
    print("🚀 Testing gRPC Chat Endpoint")
    print("-" * 40)
    
    try:
        # Connect to the gRPC server
        print("Connecting to gRPC server at localhost:50081...")
        channel = grpc.insecure_channel('localhost:50081')
        stub = seo_agent_pb2_grpc.SEOAgentServiceStub(channel)
        
        # Wait for connection
        grpc.channel_ready_future(channel).result(timeout=5)
        print("✅ Connected!")
        
        # Test messages
        messages = [
            "Hello! Can you help me with SEO?",
            "What are the best practices for image optimization?",
            "How do I improve my website's search ranking?",
        ]
        
        for i, message in enumerate(messages, 1):
            print(f"\n📝 Test {i}: {message}")
            
            # Create request
            request = seo_agent_pb2.ChatRequest(message=message)
            
            # Send request
            response = stub.Chat(request)
            
            # Print response
            if response.success:
                print("✅ Success!")
                print(f"Response: {response.response}")
                if response.intermediate_steps:
                    print(f"Steps: {len(response.intermediate_steps)} intermediate steps")
            else:
                print("❌ Failed!")
                print(f"Error: {response.error}")
            
            print("-" * 40)
        
        # Close connection
        channel.close()
        print("🔌 Disconnected")
        
    except Exception as e:
        print(f"❌ Error: {e}")
        print("Make sure the gRPC server is running on localhost:50081")

if __name__ == "__main__":
    test_chat_simple()