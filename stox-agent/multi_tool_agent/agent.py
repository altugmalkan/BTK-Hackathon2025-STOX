import requests
from .grpcclients import product_image_analyzer_pb2
from .grpcclients import product_image_analyzer_pb2_grpc
import grpc
import base64
import os
from google import genai
from google.genai import types

# Define a tool function for SEO analysis
def seo_analysis(url: str) -> str:
    """Analyzes the SEO of a given image URL.
    
    Args:
        url: The image URL to analyze
        
    Returns:
        A formatted string with the SEO analysis results
    """
    try:
        channel = grpc.insecure_channel('localhost:50071')
        stub = product_image_analyzer_pb2_grpc.ProductImageAnalyzerStub(channel)

        request = product_image_analyzer_pb2.ImageUrlRequest(
            image_url=url
        )
        
        response = stub.GenerateFromImageUrl(request)
        
        # Format the response as a readable string
        return response
    except Exception as e:
        return f"Error analyzing image URL: {str(e)}"

def generate(input_text):
    client = genai.Client(
        api_key="AIzaSyA-sHkYRHzylKaTx8bDT7VkLf4B96Yno9o",
    )

    model = "gemini-2.0-flash"
    contents = [
        types.Content(
            role="user",
            parts=[
                types.Part.from_text(text=input_text),
            ],
        ),
    ]
    tools = [
        types.Tool(
            function_declarations=[
                types.FunctionDeclaration(
                    name="seo_analysis",
                    description="Analyze the SEO of a single image URL and return a short report.",
                    parameters=genai.types.Schema(
                        type = genai.types.Type.OBJECT,
                        required = ["url"],
                        properties = {
                            "url": genai.types.Schema(
                                type = genai.types.Type.STRING,
                                description = "Absolute URL of the image to be analyzed",
                            ),
                        },
                    ),
                ),
            ])
    ]
    generate_content_config = types.GenerateContentConfig(
        tools=tools,
        system_instruction=[
            types.Part.from_text(text="""USE THE TOOLS TO ANALYZE THE IMAGE AND RETURN THE SEO ANALYSIS"""),
        ],
    )

    for chunk in client.models.generate_content_stream(
        model=model,
        contents=contents,
        config=generate_content_config,
    ):
        print(chunk.text if chunk.function_calls is None else chunk.function_calls[0])

    
if __name__ == "__main__":
    generate("https://dc9a2118r4lqa.cloudfront.net/users/b3a45f8c-5473-4a9a-9b48-35731c36125e/enhanced/enhanced_test-image_0d56bda0-ad35-45ab-a901-a206e54018ea_enhanced_a0fd79c3-6965-4dd4-9e8c-88f6273b193b.jpg")
