#!/usr/bin/env python3
"""
Demo script for the Stox Image Service logging system
Shows different logging features and capabilities
"""

import time
import random
from src.logger_config import get_logger, log_performance, log_api_call

def demo_basic_logging():
    """Demonstrate basic logging functionality"""
    logger = get_logger("demo_basic")
    
    logger.info("🚀 Starting logging demo...")
    logger.debug("This is a debug message - only visible in log files")
    logger.info("This is an info message - visible in console and files")
    logger.warning("⚠️ This is a warning message")
    logger.error("❌ This is an error message")
    logger.critical("🚨 This is a critical error message")

def demo_performance_logging():
    """Demonstrate performance logging"""
    logger = get_logger("demo_performance")
    
    # Simulate some operations
    operations = [
        ("image_processing", 2.5),
        ("api_call", 1.8),
        ("file_save", 0.3),
        ("database_query", 0.7)
    ]
    
    for operation, duration in operations:
        # Add some randomness
        actual_duration = duration + random.uniform(-0.2, 0.2)
        
        log_performance(
            logger,
            operation,
            actual_duration,
            input_size_mb=random.uniform(1.0, 5.0),
            output_size_mb=random.uniform(0.5, 3.0),
            success=random.choice([True, True, True, False])  # 75% success rate
        )
        
        time.sleep(0.1)  # Small delay for demo

def demo_api_logging():
    """Demonstrate API call logging"""
    logger = get_logger("demo_api")
    
    # Simulate API calls
    api_calls = [
        ("gemini_ai_generation", 3.2, True),
        ("image_upload", 1.5, True),
        ("authentication", 0.8, False),
        ("data_processing", 2.1, True)
    ]
    
    for api_name, duration, success in api_calls:
        # Add some randomness
        actual_duration = duration + random.uniform(-0.3, 0.3)
        
        log_api_call(
            logger,
            api_name,
            actual_duration,
            success,
            request_id=f"req_{random.randint(1000, 9999)}",
            user_id=f"user_{random.randint(1, 100)}",
            endpoint="/api/v1/process"
        )
        
        time.sleep(0.1)  # Small delay for demo

def demo_error_logging():
    """Demonstrate error logging with different scenarios"""
    logger = get_logger("demo_errors")
    
    # Simulate different types of errors (without actually raising them)
    logger.error("Error processing image: Invalid image format provided", exc_info=False)
    
    logger.error("API connection failed: Failed to connect to Gemini AI API", exc_info=False)
    
    logger.error("File system error: Output directory not found", exc_info=False)

def demo_logger_hierarchy():
    """Demonstrate logger hierarchy and different components"""
    loggers = [
        get_logger("grpc_server"),
        get_logger("image_service"),
        get_logger("test_client"),
        get_logger("performance_monitor")
    ]
    
    for i, logger in enumerate(loggers, 1):
        logger.info(f"Component {i} initialized successfully")
        logger.debug(f"Component {i} debug information")
        time.sleep(0.1)

def main():
    """Run all logging demos"""
    print("🎭 Stox Image Service - Logging System Demo")
    print("=" * 50)
    
    try:
        # Basic logging demo
        print("\n1️⃣ Basic Logging Demo")
        demo_basic_logging()
        
        # Performance logging demo
        print("\n2️⃣ Performance Logging Demo")
        demo_performance_logging()
        
        # API logging demo
        print("\n3️⃣ API Call Logging Demo")
        demo_api_logging()
        
        # Error logging demo
        print("\n4️⃣ Error Logging Demo")
        demo_error_logging()
        
        # Logger hierarchy demo
        print("\n5️⃣ Logger Hierarchy Demo")
        demo_logger_hierarchy()
        
        print("\n✅ All logging demos completed successfully!")
        print("\n📁 Check the 'logs/' directory for generated log files:")
        print("   • stox_image_service.log (main log)")
        print("   • stox_image_service_errors.log (errors only)")
        print("   • stox_image_service_performance.log (performance metrics)")
        
    except Exception as e:
        logger = get_logger("demo_main")
        logger.error(f"Demo failed: {str(e)}", exc_info=True)
        print(f"\n❌ Demo failed: {str(e)}")

if __name__ == "__main__":
    main() 