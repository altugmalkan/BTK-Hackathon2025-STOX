# stox-image-service | AI-Powered Image Processing Service

A gRPC-based image processing service that uses Google's Gemini AI to transform product images into professional e-commerce listings. The service automatically removes backgrounds, adds white studio backdrops, applies subtle shadows, and optimizes images for e-commerce platforms like Amazon, Etsy, and Shopify.

## 🏗️ Project Structure

```
stox-image-service/
├── grpc_server.py              # Main gRPC server entry point
├── requirements.txt            # Python dependencies
├── logging_config.yaml         # Logging configuration file
├── __init__.py                # Python package initialization
├── logs/                       # Log files directory (auto-created)
│   ├── stox_image_service.log
│   ├── stox_image_service_errors.log
│   └── stox_image_service_performance.log
├── src/
│   ├── __init__.py            # Source package initialization
│   ├── grpc/                  # gRPC protocol buffer definitions
│   │   ├── image_service.proto
│   │   ├── image_service_pb2.py
│   │   └── image_service_pb2_grpc.py
│   ├── logger_config.py       # Logging configuration and setup
│   ├── log_utils.py           # Log management utilities
│   ├── procces_image.py       # Core image processing logic using Gemini AI
│   ├── test_images/           # Test images for development
│   │   └── image.jpg
│   └── output_images/         # Processed image outputs
│       ├── image_0.png
│       └── processed_image.jpg
└── tests/
    ├── __init__.py            # Tests package initialization
    ├── test_client.py         # Test client for the gRPC service
    ├── demo_logging.py        # Demo script for logging features
    └── test_logging.py        # Unit tests for logging functionality
```

## 🔧 Architecture & Logic

### Core Components

1. **gRPC Server** (`grpc_server.py`)
   - Runs on port 50051
   - Handles concurrent requests with ThreadPoolExecutor
   - Receives image data and returns processed images

2. **Image Processing Service** (`src/procces_image.py`)
   - Uses Google's Gemini 2.0 Flash Preview for image generation
   - Implements professional e-commerce photo retouching
   - Processes images with specific constraints for product accuracy

3. **Protocol Buffers** (`src/grpc/image_service.proto`)
   - Defines the gRPC service interface
   - Handles binary image data and metadata

### Processing Logic

The service transforms raw product images by:
- **Background Removal**: Replaces backgrounds with pure white (#FFFFFF) studio backdrop
- **Shadow Addition**: Adds subtle drop-shadows for realistic grounding
- **Color Correction**: Optimizes exposure, white balance, and contrast
- **Quality Enhancement**: Applies gentle clarity/noise control
- **Output Optimization**: Delivers 3000×3000px, 300ppi, high-quality JPEG

## 🚀 Installation & Setup

### Prerequisites

- Python 3.8 or higher
- Google Cloud account with Gemini API access
- Gemini API key

### Step 1: Clone the Repository

```bash
git clone https://github.com/BTK-Hackaton-2025/stox-image-service.git
cd stox-image-service
```

### Step 2: Set Up Virtual Environment

#### For Windows:

```powershell
# Create virtual environment
python -m venv .venv

# Activate virtual environment
.venv\Scripts\Activate.ps1

# If PowerShell execution policy is restricted, run:
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

#### For Mac/Linux:

```bash
# Create virtual environment
python3 -m venv .venv

# Activate virtual environment
source .venv/bin/activate
```

### Step 3: Install Dependencies

```bash
# Upgrade pip first
pip install --upgrade pip

# Install requirements
pip install -r requirements.txt
```

### Step 4: Set Up Environment Variables

#### For Windows (PowerShell):

```powershell
# Set Gemini API key
$env:GEMINI_API_KEY="your-gemini-api-key-here"

# To make it permanent (add to PowerShell profile)
Add-Content -Path $PROFILE -Value '$env:GEMINI_API_KEY="your-gemini-api-key-here"'
```

#### For Mac/Linux:

```bash
# Set Gemini API key
export GEMINI_API_KEY="your-gemini-api-key-here"

# To make it permanent, add to ~/.bashrc or ~/.zshrc
echo 'export GEMINI_API_KEY="your-gemini-api-key-here"' >> ~/.bashrc
source ~/.bashrc
```

### Step 5: Generate gRPC Code (if needed)

If you modify the `.proto` file, regenerate the gRPC code:

```bash
# Navigate to src/grpc directory
cd src/grpc

# Generate Python code from proto file
python -m grpc_tools.protoc -I. --python_out=. --grpc_python_out=. image_service.proto
```

## 🏃‍♂️ Running the Service

### Start the gRPC Server

```bash
# Make sure virtual environment is activated
python grpc_server.py
```

The server will start on `localhost:50051`

### Test the Service

In a separate terminal (with virtual environment activated):

```bash
python tests/test_client.py
```

This will:
1. Send a test image to the server
2. Process it using Gemini AI
3. Save the result to `src/output_images/processed_image.jpg`

### Additional Testing

The project includes comprehensive testing utilities:

```bash
# Run logging demo
python tests/demo_logging.py

# Run logging unit tests
python tests/test_logging.py
```

## 🔑 Getting Your Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated key and set it as your `GEMINI_API_KEY` environment variable

## 📁 File Descriptions

### Core Files
- **`grpc_server.py`**: Main server that handles gRPC requests
- **`requirements.txt`**: Python dependencies
- **`logging_config.yaml`**: YAML configuration for logging settings
- **`__init__.py`**: Python package initialization

### Source Code (`src/`)
- **`src/procces_image.py`**: Core image processing using Gemini AI
- **`src/grpc/image_service.proto`**: Protocol buffer service definition
- **`src/logger_config.py`**: Comprehensive logging configuration and setup
- **`src/log_utils.py`**: Log management utilities (cleanup, stats, archiving)
- **`src/test_images/`**: Directory containing test images
- **`src/output_images/`**: Directory where processed images are saved

### Testing (`tests/`)
- **`tests/test_client.py`**: Simple client for testing the service
- **`tests/demo_logging.py`**: Demo script showcasing logging features
- **`tests/test_logging.py`**: Unit tests for logging functionality

### Logs (`logs/`)
- **`logs/`**: Directory containing all log files (auto-created)

## 📊 Logging System

The project includes a comprehensive logging system with the following features:

### Log Files

- **`logs/stox_image_service.log`**: Main application log (DEBUG level)
- **`logs/stox_image_service_errors.log`**: Error-only log file
- **`logs/stox_image_service_performance.log`**: Performance metrics and API calls

### Log Levels

- **DEBUG**: Detailed debugging information
- **INFO**: General application flow and status
- **WARNING**: Warning messages for potential issues
- **ERROR**: Error messages with stack traces
- **CRITICAL**: Critical errors that may cause service failure

### Performance Monitoring

The logging system automatically tracks:
- Request processing times
- API call durations and success rates
- File operation metrics
- Error rates and types
- Memory usage patterns

### Log Management

Use the log utilities for maintenance:

```bash
# Print log statistics
python -c "from src.log_utils import print_log_stats; print_log_stats()"

# Clean up old logs (older than 30 days)
python -c "from src.log_utils import cleanup_old_logs; cleanup_old_logs()"

# Archive current logs
python -c "from src.log_utils import archive_logs; archive_logs()"
```

### Customizing Logging

Edit `logging_config.yaml` to customize:
- Log levels for different components
- Console output formatting
- File rotation settings
- Performance monitoring options

## 🛠️ Development

### Adding New Features

1. Modify the prompt in `src/procces_image.py` to change processing behavior
2. Update the `.proto` file if you need new request/response fields
3. Regenerate gRPC code if you modify the proto file
4. Test with `tests/test_client.py`
5. Add unit tests in `tests/` directory for new functionality

### Troubleshooting

#### Common Issues:

1. **Import Errors**: Ensure virtual environment is activated
2. **API Key Issues**: Verify `GEMINI_API_KEY` is set correctly
3. **Port Already in Use**: Change port in `grpc_server.py` or kill existing process
4. **Memory Issues**: Large images may require more memory allocation

#### Windows-Specific:

- Use PowerShell for better compatibility
- Ensure Python is in your PATH
- Run PowerShell as Administrator if needed for execution policies

#### Mac-Specific:

- Use `python3` instead of `python` if needed
- Ensure Xcode command line tools are installed: `xcode-select --install`