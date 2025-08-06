"""
Logging utilities for the Stox Image Service
Provides functions for log management, analysis, and cleanup
"""

import os
import glob
import shutil
from datetime import datetime, timedelta
from pathlib import Path
from src.logger_config import get_logger

def cleanup_old_logs(logs_dir: str = "logs", days_to_keep: int = 30):
    """
    Clean up log files older than specified days
    
    Args:
        logs_dir: Directory containing log files
        days_to_keep: Number of days to keep log files
    """
    logger = get_logger("log_utils")
    
    try:
        logs_path = Path(logs_dir)
        if not logs_path.exists():
            logger.warning(f"Logs directory {logs_dir} does not exist")
            return
        
        cutoff_date = datetime.now() - timedelta(days=days_to_keep)
        deleted_count = 0
        
        # Find all log files
        log_patterns = [
            "stox_image_service*.log",
            "stox_image_service*.log.*"  # Rotated logs
        ]
        
        for pattern in log_patterns:
            log_files = logs_path.glob(pattern)
            
            for log_file in log_files:
                try:
                    # Get file modification time
                    mtime = datetime.fromtimestamp(log_file.stat().st_mtime)
                    
                    if mtime < cutoff_date:
                        log_file.unlink()
                        deleted_count += 1
                        logger.info(f"Deleted old log file: {log_file}")
                        
                except Exception as e:
                    logger.error(f"Error processing log file {log_file}: {str(e)}")
        
        logger.info(f"Log cleanup completed. Deleted {deleted_count} old log files.")
        
    except Exception as e:
        logger.error(f"Error during log cleanup: {str(e)}", exc_info=True)

def get_log_stats(logs_dir: str = "logs"):
    """
    Get statistics about log files
    
    Args:
        logs_dir: Directory containing log files
    
    Returns:
        Dictionary with log statistics
    """
    logger = get_logger("log_utils")
    
    try:
        logs_path = Path(logs_dir)
        if not logs_path.exists():
            return {"error": "Logs directory does not exist"}
        
        stats = {
            "total_files": 0,
            "total_size_mb": 0,
            "files_by_type": {},
            "oldest_file": None,
            "newest_file": None
        }
        
        oldest_time = None
        newest_time = None
        
        # Find all log files
        log_files = list(logs_path.glob("*.log*"))
        
        for log_file in log_files:
            try:
                file_size = log_file.stat().st_size
                mtime = datetime.fromtimestamp(log_file.stat().st_mtime)
                
                # Update stats
                stats["total_files"] += 1
                stats["total_size_mb"] += file_size / (1024 * 1024)
                
                # Track oldest and newest files
                if oldest_time is None or mtime < oldest_time:
                    oldest_time = mtime
                    stats["oldest_file"] = {
                        "name": log_file.name,
                        "date": mtime.isoformat(),
                        "size_mb": round(file_size / (1024 * 1024), 2)
                    }
                
                if newest_time is None or mtime > newest_time:
                    newest_time = mtime
                    stats["newest_file"] = {
                        "name": log_file.name,
                        "date": mtime.isoformat(),
                        "size_mb": round(file_size / (1024 * 1024), 2)
                    }
                
                # Group by file type
                file_type = log_file.name.split('.')[0]
                if file_type not in stats["files_by_type"]:
                    stats["files_by_type"][file_type] = {
                        "count": 0,
                        "total_size_mb": 0
                    }
                
                stats["files_by_type"][file_type]["count"] += 1
                stats["files_by_type"][file_type]["total_size_mb"] += file_size / (1024 * 1024)
                
            except Exception as e:
                logger.error(f"Error processing log file {log_file}: {str(e)}")
        
        # Round total size
        stats["total_size_mb"] = round(stats["total_size_mb"], 2)
        
        # Round sizes in file type stats
        for file_type in stats["files_by_type"]:
            stats["files_by_type"][file_type]["total_size_mb"] = round(
                stats["files_by_type"][file_type]["total_size_mb"], 2
            )
        
        return stats
        
    except Exception as e:
        logger.error(f"Error getting log stats: {str(e)}", exc_info=True)
        return {"error": str(e)}

def print_log_stats(logs_dir: str = "logs"):
    """
    Print log statistics in a formatted way
    
    Args:
        logs_dir: Directory containing log files
    """
    logger = get_logger("log_utils")
    
    stats = get_log_stats(logs_dir)
    
    if "error" in stats:
        logger.error(f"Error getting log stats: {stats['error']}")
        return
    
    print("\n" + "="*50)
    print("📊 LOG STATISTICS")
    print("="*50)
    
    print(f"📁 Total log files: {stats['total_files']}")
    print(f"💾 Total size: {stats['total_size_mb']} MB")
    
    if stats['oldest_file']:
        print(f"📅 Oldest file: {stats['oldest_file']['name']} ({stats['oldest_file']['date']})")
    
    if stats['newest_file']:
        print(f"📅 Newest file: {stats['newest_file']['name']} ({stats['newest_file']['date']})")
    
    print("\n📋 Files by type:")
    for file_type, info in stats['files_by_type'].items():
        print(f"  • {file_type}: {info['count']} files, {info['total_size_mb']} MB")
    
    print("="*50 + "\n")

def archive_logs(archive_name: str = None, logs_dir: str = "logs"):
    """
    Archive current log files
    
    Args:
        archive_name: Name for the archive (defaults to timestamp)
        logs_dir: Directory containing log files
    """
    logger = get_logger("log_utils")
    
    try:
        logs_path = Path(logs_dir)
        if not logs_path.exists():
            logger.warning(f"Logs directory {logs_dir} does not exist")
            return
        
        if archive_name is None:
            archive_name = f"logs_archive_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
        
        archive_path = Path(f"{archive_name}.zip")
        
        # Create archive
        shutil.make_archive(archive_name, 'zip', logs_dir)
        
        logger.info(f"Logs archived to: {archive_path}")
        return str(archive_path)
        
    except Exception as e:
        logger.error(f"Error archiving logs: {str(e)}", exc_info=True)
        return None

if __name__ == "__main__":
    # Example usage
    logger = get_logger("log_utils_main")
    
    print("🔧 Log Management Utilities")
    print("1. Print log statistics")
    print("2. Clean up old logs")
    print("3. Archive current logs")
    
    # Print current stats
    print_log_stats()
    
    # Clean up logs older than 30 days
    cleanup_old_logs(days_to_keep=30)
    
    # Print stats after cleanup
    print_log_stats() 