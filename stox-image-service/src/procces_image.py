# To run this code you need to install the following dependencies:
# pip install google-genai

import base64
import mimetypes
import os
import io
import time
from google import genai
from google.genai import types
from .logger_config import get_logger, log_performance, log_api_call

class ImageService:
    def __init__(self):
        self.logger = get_logger("image_service")
        
        # Check for API key - first try environment variable, then fallback to hardcoded key
        api_key = os.getenv("GEMINI_API_KEY") 
        if not api_key:
            self.logger.error("GEMINI_API_KEY environment variable not set and no fallback key available")
            raise ValueError("GEMINI_API_KEY environment variable is required")
        
        if os.getenv("GEMINI_API_KEY"):
            self.logger.info("Using Gemini API key from environment variable")
        else:
            self.logger.info("Using fallback Gemini API key")
        
        self.logger.info("Initializing Gemini AI client...")
        self.client = genai.Client(api_key=api_key)
        self.model = "gemini-2.0-flash-preview-image-generation" # do not change this model
        
        self.logger.info(f"Using model: {self.model}")
        
        self.prompt = """
                    Role: Professional e-commerce photo retoucher
                    Task: Transform the supplied raw image of a single {Product_Image} into a studio-quality listing photo.
                    Constraints
                    Do NOT modify the product's shape, color, label, proportion, or surface texture.
                    Remove current background and replace with a pure‐white (#FFFFFF) seamless backdrop that meets Amazon / Etsy / Shopify specs.
                    Add a subtle, soft drop-shadow directly beneath the product to keep it grounded and realistic (no harsh or floating shadows).
                    Correct exposure, white balance, and contrast so true colors are accurate and vibrant—no HDR or "plastic" look.
                    Apply gentle clarity/noise control only where needed; avoid halos or sharpening artifacts.
                    Preserve natural highlights and material details.
                    Output specs: 3000 × 3000 px, sRGB, 300 ppi, high-quality JPEG (≤ 2 MB).
                    Deliverable: One finished image ready for immediate upload to e-commerce platforms.
                """
        
        self.processed_image_data = None
        self.mime_type = None
        self.message = None
        
        self.logger.info("ImageService initialized successfully")
        
    def save_binary_file(self, file_name, data):
        try:
            f = open(file_name, "wb")
            f.write(data)
            f.close()
            self.logger.debug(f"File saved successfully: {file_name} ({len(data)} bytes)")
        except Exception as e:
            self.logger.error(f"Failed to save file {file_name}: {str(e)}")
            raise

    def generate(self, image_data, mime_type="image/jpeg"):
        start_time = time.time()
        
        self.logger.info(f"Starting image generation - Input size: {len(image_data)} bytes, MIME: {mime_type}")
        
        try:
            client = self.client
            model = "gemini-2.0-flash-preview-image-generation" # do not change this model
            
            self.logger.debug("Preparing request to Gemini AI...")
            
            contents = [
                types.Content(
                    role="user",
                    parts=[
                        types.Part.from_text(text=self.prompt),
                        types.Part.from_bytes(data=image_data, mime_type=mime_type),
                    ],
                ),
            ]
            generate_content_config = types.GenerateContentConfig(
                response_modalities=[
                    "IMAGE",
                    "TEXT",
                ],
            )

            file_index = 0
            response_text = ""
            
            self.logger.info("Calling Gemini AI API...")
            api_start_time = time.time()
            
            for chunk in client.models.generate_content_stream(
                model=model,
                contents=contents,
                config=generate_content_config,
            ):
                if (
                    chunk.candidates is None
                    or chunk.candidates[0].content is None
                    or chunk.candidates[0].content.parts is None
                ):
                    continue
                
                # Process each part in the response
                for part in chunk.candidates[0].content.parts:
                    if part.inline_data and part.inline_data.data:
                        # Handle image data
                        file_name = f"image_{file_index}"
                        file_index += 1
                        inline_data = part.inline_data
                        data_buffer = inline_data.data
                        file_extension = mimetypes.guess_extension(inline_data.mime_type)
                        
                        self.logger.debug(f"Received image data: {len(data_buffer)} bytes, MIME: {inline_data.mime_type}")
                        self.save_binary_file(f"{file_name}{file_extension}", data_buffer)
                        
                        # Store the processed image data for gRPC response
                        self.processed_image_data = data_buffer
                        self.mime_type = inline_data.mime_type
                        
                    elif part.text:
                        # Handle text data
                        response_text += part.text
                        self.logger.debug(f"Received text response: {part.text}")
            
            api_duration = time.time() - api_start_time
            total_duration = time.time() - start_time
            
            # Log API call metrics
            log_api_call(
                self.logger,
                "gemini_ai_generation",
                api_duration,
                success=True,
                input_size_bytes=len(image_data),
                output_size_bytes=len(self.processed_image_data) if self.processed_image_data else 0,
                response_text_length=len(response_text)
            )
            
            # Log overall performance
            log_performance(
                self.logger,
                "image_generation_total",
                total_duration,
                api_duration=api_duration,
                file_index=file_index,
                response_text_length=len(response_text)
            )
            
            self.message = response_text.strip() if response_text else "Image processed successfully"
            
            self.logger.info(f"Image generation completed successfully in {total_duration:.3f}s")
            self.logger.info(f"Output: {len(self.processed_image_data)} bytes, MIME: {self.mime_type}")
            
            return self.processed_image_data, self.mime_type, self.message
            
        except Exception as e:
            duration = time.time() - start_time
            self.logger.error(f"Image generation failed after {duration:.3f}s: {str(e)}", exc_info=True)
            
            # Log error metrics
            log_api_call(
                self.logger,
                "gemini_ai_generation",
                duration,
                success=False,
                error_type=type(e).__name__,
                error_message=str(e),
                input_size_bytes=len(image_data)
            )
            
            raise

if __name__ == "__main__":
    logger = get_logger("image_service_test")
    
    try:
        # Test with a sample image file
        image_path = "src/test_images/image.jpg"  # Relative path from src directory
        logger.info(f"Starting test with image: {image_path}")
        
        image_service = ImageService()
        
        # Read the image file as binary data
        with open(image_path, 'rb') as f:
            image_data = f.read()
        
        logger.info(f"Loaded test image: {len(image_data)} bytes")
        
        # Test the generate method with binary data
        processed_data, mime_type, message = image_service.generate(image_data, "image/jpeg")
        logger.info(f"Test completed successfully: {message}")
        logger.info(f"Processed image: {len(processed_data)} bytes, MIME: {mime_type}")
        
    except Exception as e:
        logger.error(f"Test failed: {str(e)}", exc_info=True)
