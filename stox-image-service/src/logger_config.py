import logging
import logging.handlers
import os
import sys
from datetime import datetime
from pathlib import Path

class ColoredFormatter(logging.Formatter):
    """Custom formatter with colors for console output"""
    
    COLORS = {
        'DEBUG': '\033[36m',    # Cyan
        'INFO': '\033[32m',     # Green
        'WARNING': '\033[33m',  # Yellow
        'ERROR': '\033[31m',    # Red
        'CRITICAL': '\033[35m', # Magenta
        'RESET': '\033[0m'      # Reset
    }
    
    def format(self, record):
        # Check if we're on Windows and if colors are supported
        import os
        import sys
        
        # Only use colors if we're on a terminal that supports them
        use_colors = (
            hasattr(sys.stdout, 'isatty') and sys.stdout.isatty() and
            os.name != 'nt'  # Skip colors on Windows by default
        )
        
        if use_colors and record.levelname in self.COLORS:
            record.levelname = f"{self.COLORS[record.levelname]}{record.levelname}{self.COLORS['RESET']}"
        
        return super().format(record)

def setup_logger(name: str = "stox_image_service", log_level: str = "INFO") -> logging.Logger:
    """
    Set up a comprehensive logger with console and file handlers
    
    Args:
        name: Logger name
        log_level: Logging level (DEBUG, INFO, WARNING, ERROR, CRITICAL)
    
    Returns:
        Configured logger instance
    """
    
    # Create logs directory if it doesn't exist
    logs_dir = Path("logs")
    logs_dir.mkdir(exist_ok=True)
    
    # Create logger
    logger = logging.getLogger(name)
    logger.setLevel(getattr(logging, log_level.upper()))
    
    # Prevent duplicate handlers
    if logger.handlers:
        return logger
    
    # Create formatters
    detailed_formatter = logging.Formatter(
        fmt='%(asctime)s | %(name)s | %(levelname)s | %(filename)s:%(lineno)d | %(funcName)s | %(message)s',
        datefmt='%Y-%m-%d %H:%M:%S'
    )
    
    simple_formatter = logging.Formatter(
        fmt='%(asctime)s | %(levelname)s | %(message)s',
        datefmt='%H:%M:%S'
    )
    
    colored_formatter = ColoredFormatter(
        fmt='%(asctime)s | %(levelname)s | %(name)s | %(message)s',
        datefmt='%H:%M:%S'
    )
    
    # Console handler with colors
    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setLevel(logging.INFO)
    console_handler.setFormatter(colored_formatter)
    logger.addHandler(console_handler)
    
    # File handler for all logs
    file_handler = logging.handlers.RotatingFileHandler(
        filename=logs_dir / "stox_image_service.log",
        maxBytes=10*1024*1024,  # 10MB
        backupCount=5,
        encoding='utf-8'
    )
    file_handler.setLevel(logging.DEBUG)
    file_handler.setFormatter(detailed_formatter)
    logger.addHandler(file_handler)
    
    # Error file handler
    error_handler = logging.handlers.RotatingFileHandler(
        filename=logs_dir / "stox_image_service_errors.log",
        maxBytes=5*1024*1024,  # 5MB
        backupCount=3,
        encoding='utf-8'
    )
    error_handler.setLevel(logging.ERROR)
    error_handler.setFormatter(detailed_formatter)
    logger.addHandler(error_handler)
    
    # Performance metrics handler
    perf_handler = logging.handlers.RotatingFileHandler(
        filename=logs_dir / "stox_image_service_performance.log",
        maxBytes=5*1024*1024,  # 5MB
        backupCount=3,
        encoding='utf-8'
    )
    perf_handler.setLevel(logging.INFO)
    perf_handler.setFormatter(detailed_formatter)
    
    # Create a filter for performance logs
    class PerformanceFilter(logging.Filter):
        def filter(self, record):
            return 'PERFORMANCE' in record.getMessage() or 'METRIC' in record.getMessage()
    
    perf_handler.addFilter(PerformanceFilter())
    logger.addHandler(perf_handler)
    
    return logger

def get_logger(name: str = None) -> logging.Logger:
    """
    Get a logger instance. If no name is provided, returns the default logger.
    
    Args:
        name: Optional logger name
    
    Returns:
        Logger instance
    """
    if name:
        # Check if logger already has handlers
        logger = logging.getLogger(name)
        if not logger.handlers:
            # Set up the logger if it doesn't have handlers
            return setup_logger(name)
        return logger
    return logging.getLogger("stox_image_service")

# Performance logging utilities
def log_performance(logger: logging.Logger, operation: str, duration: float, **kwargs):
    """
    Log performance metrics
    
    Args:
        logger: Logger instance
        operation: Name of the operation
        duration: Duration in seconds
        **kwargs: Additional metrics to log
    """
    metrics = {
        'operation': operation,
        'duration_seconds': round(duration, 3),
        'timestamp': datetime.now().isoformat(),
        **kwargs
    }
    logger.info(f"PERFORMANCE: {metrics}")

def log_api_call(logger: logging.Logger, api_name: str, duration: float, success: bool, **kwargs):
    """
    Log API call metrics
    
    Args:
        logger: Logger instance
        api_name: Name of the API being called
        duration: Duration in seconds
        success: Whether the call was successful
        **kwargs: Additional metrics to log
    """
    metrics = {
        'api_name': api_name,
        'duration_seconds': round(duration, 3),
        'success': success,
        'timestamp': datetime.now().isoformat(),
        **kwargs
    }
    logger.info(f"API_CALL: {metrics}")

# Initialize default logger
default_logger = setup_logger() 