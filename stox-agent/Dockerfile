# Use Python 3.11 slim image
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements first for better layer caching
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the entire application
COPY . .

# Create a non-root user for security
RUN useradd --create-home --shell /bin/bash appuser && \
    chown -R appuser:appuser /app
USER appuser

# Expose the gRPC port
EXPOSE 50081

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD python -c "import grpc; import seo_agent_pb2_grpc; import seo_agent_pb2; \
    channel = grpc.insecure_channel('localhost:50081'); \
    stub = seo_agent_pb2_grpc.SEOAgentServiceStub(channel); \
    stub.HealthCheck(seo_agent_pb2.HealthCheckRequest(), timeout=5); \
    print('Healthy')" || exit 1

# Set environment variables
ENV PYTHONPATH=/app
ENV PYTHONUNBUFFERED=1

# Run the gRPC server
CMD ["python", "grpc_server.py"]