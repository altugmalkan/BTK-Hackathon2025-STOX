#!/usr/bin/env python3
"""
Simple test script to verify logging functionality
"""

import sys
import os

# Add the project root to the Python path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from src.logger_config import get_logger, log_performance, log_api_call

def test_logging():
    """Test basic logging functionality"""
    print("🧪 Testing logging system...")
    
    # Get a logger
    logger = get_logger("test_logging")
    
    # Test basic logging
    logger.info("✅ Basic info message")
    logger.warning("⚠️ Warning message")
    logger.error("❌ Error message")
    logger.debug("🔍 Debug message (should only appear in log files)")
    
    # Test performance logging
    log_performance(logger, "test_operation", 1.5, test_param="value")
    
    # Test API call logging
    log_api_call(logger, "test_api", 0.8, True, endpoint="/test")
    
    print("✅ Logging test completed!")
    print("📁 Check the logs/ directory for log files")

if __name__ == "__main__":
    test_logging() 