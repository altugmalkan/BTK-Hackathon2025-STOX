from concurrent import futures
import grpc
import time
import sys
import traceback
from datetime import datetime
from src.procces_image import ImageService
from src.grpc import image_service_pb2_grpc, image_service_pb2
from src.logger_config import get_logger, log_performance, log_api_call

class ImageServiceServicer(image_service_pb2_grpc.ImageServiceServicer):
    def __init__(self):
        self.logger = get_logger("grpc_server")
        self.image_service = ImageService()
        self.logger.info("ImageServiceServicer initialized successfully")

    def ProcessImage(self, request, context):
        start_time = time.time()
        request_id = f"req_{int(start_time * 1000)}"
        
        self.logger.info(f"Processing image request {request_id} - Size: {len(request.image_data)} bytes, MIME: {request.mime_type}")
        
        try:
            # Log request details
            self.logger.debug(f"Request {request_id} details: product_name={getattr(request, 'product_name', 'N/A')}")
            
            # Call generate with the binary image data and mime type from the request
            processed_data, mime_type, message = self.image_service.generate(
                request.image_data, 
                request.mime_type
            )
            
            duration = time.time() - start_time
            
            # Log success metrics
            self.logger.info(f"Request {request_id} completed successfully in {duration:.3f}s")
            log_performance(
                self.logger, 
                "image_processing", 
                duration,
                request_id=request_id,
                input_size_bytes=len(request.image_data),
                output_size_bytes=len(processed_data),
                mime_type=mime_type
            )
            
            return image_service_pb2.ProcessImageResponse(
                processed_image_data=processed_data,
                mime_type=mime_type,
                message=message
            )
            
        except Exception as e:
            duration = time.time() - start_time
            error_msg = f"Request {request_id} failed after {duration:.3f}s: {str(e)}"
            self.logger.error(error_msg, exc_info=True)
            
            # Log error metrics
            log_api_call(
                self.logger,
                "image_processing",
                duration,
                success=False,
                request_id=request_id,
                error_type=type(e).__name__,
                error_message=str(e)
            )
            
            # Set gRPC error context
            context.set_code(grpc.StatusCode.INTERNAL)
            context.set_details(f"Image processing failed: {str(e)}")
            
            # Return empty response on error
            return image_service_pb2.ProcessImageResponse(
                processed_image_data=b"",
                mime_type="",
                message=f"Error: {str(e)}"
            )

if __name__ == "__main__":
    logger = get_logger("grpc_server_main")
    
    try:
        logger.info("Starting gRPC server...")
        logger.info("Server configuration: max_workers=10, port=50061")
        
        server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
        image_service_pb2_grpc.add_ImageServiceServicer_to_server(
            ImageServiceServicer(), server
        )
        server.add_insecure_port('[::]:50061')
        
        logger.info("Starting server on port 50061...")
        server.start()
        logger.info("✅ gRPC server started successfully on port 50061")
        logger.info("Server is ready to accept requests")
        
        server.wait_for_termination()
        
    except KeyboardInterrupt:
        logger.info("🛑 Server shutdown requested by user")
    except Exception as e:
        logger.critical(f"❌ Server failed to start: {str(e)}", exc_info=True)
        sys.exit(1)