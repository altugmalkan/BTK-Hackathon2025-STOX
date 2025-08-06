import grpc
import time
import sys
import os

# Add the project root to the Python path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from src.grpc import image_service_pb2, image_service_pb2_grpc
from src.logger_config import get_logger, log_performance

def test_image_processing():
    logger = get_logger("test_client")
    start_time = time.time()
    
    logger.info("Starting image processing test...")
    
    try:
        # Create a gRPC channel
        logger.info("Creating gRPC channel to localhost:50061...")
        channel = grpc.insecure_channel('localhost:50061')
        stub = image_service_pb2_grpc.ImageServiceStub(channel)
        
        # Read test image file from the correct location
        image_path = 'src/test_images/image.jpg'
        logger.info(f"Reading test image from: {image_path}")
        
        with open(image_path, 'rb') as f:
            image_data = f.read()
        
        logger.info(f"Loaded test image: {len(image_data)} bytes")
        
        # Create request
        request = image_service_pb2.ProcessImageRequest(
            image_data=image_data,
            mime_type="image/jpeg",
            product_name="Test Product"
        )
        
        logger.info("Sending image to server...")
        
        # Call the gRPC service
        response = stub.ProcessImage(request)
        
        duration = time.time() - start_time
        
        logger.info("✅ Response received successfully!")
        logger.info(f"Message: {response.message}")
        logger.info(f"MIME Type: {response.mime_type}")
        logger.info(f"Processed image size: {len(response.processed_image_data)} bytes")
        
        # Log performance metrics
        log_performance(
            logger,
            "test_client_request",
            duration,
            input_size_bytes=len(image_data),
            output_size_bytes=len(response.processed_image_data),
            mime_type=response.mime_type
        )
        
        # Save the processed image
        output_path = 'src/output_images/processed_image.jpg'
        logger.info(f"Saving processed image to: {output_path}")
        
        with open(output_path, 'wb') as f:
            f.write(response.processed_image_data)
        
        logger.info("✅ Processed image saved successfully")
        
    except grpc.RpcError as e:
        duration = time.time() - start_time
        logger.error(f"❌ gRPC Error after {duration:.3f}s: {e.code()}: {e.details()}")
        raise
    except Exception as e:
        duration = time.time() - start_time
        logger.error(f"❌ Error after {duration:.3f}s: {str(e)}", exc_info=True)
        raise

if __name__ == "__main__":
    logger = get_logger("test_client_main")
    
    try:
        logger.info("🚀 Starting test client...")
        test_image_processing()
        logger.info("✅ Test completed successfully!")
        
    except Exception as e:
        logger.error(f"❌ Test failed: {str(e)}", exc_info=True)
        exit(1) 