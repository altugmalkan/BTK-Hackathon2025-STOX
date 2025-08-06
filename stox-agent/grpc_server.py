import grpc
from concurrent import futures
import time
from dotenv import load_dotenv
import os

# Import generated protobuf classes
import seo_agent_pb2
import seo_agent_pb2_grpc

# Import the agent
from multi_tool_agent.langchain_agent import create_seo_agent

# Load environment variables
load_dotenv()


class SEOAgentServicer(seo_agent_pb2_grpc.SEOAgentServiceServicer):
    """Implementation of the SEOAgentService."""
    
    def __init__(self):
        """Initialize the servicer with the agent."""
        self.seo_agent = None
    
    def get_agent(self):
        """Get or create the SEO agent instance."""
        if self.seo_agent is None:
            google_key = os.getenv("GOOGLE_API_KEY", " ")
            if not google_key:
                raise ValueError("GOOGLE_API_KEY environment variable is required")
            self.seo_agent = create_seo_agent(google_api_key=google_key)
        return self.seo_agent
    
    def HealthCheck(self, request, context):
        """Handle health check requests."""
        return seo_agent_pb2.HealthCheckResponse(
            status="healthy",
            service="SEO Analysis Agent"
        )
    
    def Chat(self, request, context):
        """Handle general chat requests."""
        try:
            # Extract message from protobuf request
            message = request.message
            
            if not message:
                return seo_agent_pb2.ChatResponse(
                    success=False,
                    error="Missing message in request"
                )
            
            # Get the agent and process the message
            agent = self.get_agent()
            result = agent.chat(message)
            
            return seo_agent_pb2.ChatResponse(
                success=True,
                response=result["output"],
                intermediate_steps=result.get("intermediate_steps", [])
            )
            
        except Exception as e:
            return seo_agent_pb2.ChatResponse(
                success=False,
                error=str(e)
            )
    
    def AnalyzeSEO(self, request, context):
        """Handle SEO analysis requests."""
        try:
            # Extract image URL from protobuf request
            image_url = request.image_url
            
            if not image_url:
                return seo_agent_pb2.AnalyzeSEOResponse(
                    success=False,
                    error="Missing image_url in request"
                )
            
            # Get the agent and process the analysis
            agent = self.get_agent()
            result = agent.analyze_seo(image_url)
            
            return seo_agent_pb2.AnalyzeSEOResponse(
                success=True,
                image_url=image_url,
                analysis=result["output"],
                intermediate_steps=result.get("intermediate_steps", [])
            )
            
        except Exception as e:
            return seo_agent_pb2.AnalyzeSEOResponse(
                success=False,
                image_url=request.image_url,
                error=str(e)
            )


def serve(port=50081):
    """Start the gRPC server."""
    # Create gRPC server
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    
    # Add the servicer to the server
    seo_agent_pb2_grpc.add_SEOAgentServiceServicer_to_server(
        SEOAgentServicer(), server
    )
    
    # Listen on the specified port (use 0.0.0.0 for better Windows compatibility)
    listen_addr = f'0.0.0.0:{port}'
    server.add_insecure_port(listen_addr)
    
    print(f"Starting gRPC server on {listen_addr}")
    server.start()
    
    try:
        # Keep the server running
        while True:
            time.sleep(86400)  # Sleep for a day
    except KeyboardInterrupt:
        print("Shutting down gRPC server...")
        server.stop(0)


if __name__ == '__main__':
    serve()