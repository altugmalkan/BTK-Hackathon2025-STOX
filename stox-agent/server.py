from flask import Flask, request, jsonify
from multi_tool_agent.langchain_agent import create_seo_agent
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)

# Initialize the Langchain agent
seo_agent = None

def get_agent():
    global seo_agent
    if seo_agent is None:
        google_key = ""
        if not google_key:
            raise ValueError("GOOGLE_API_KEY environment variable is required")
        seo_agent = create_seo_agent(google_api_key=google_key)
    return seo_agent

@app.route("/health", methods=["GET"])
def health():
    """Health check endpoint."""
    return jsonify({"status": "healthy", "service": "SEO Analysis Agent"})

@app.route("/analyze-seo", methods=["POST"])
def analyze_seo():
    """
    Analyze an image URL for SEO purposes using Langchain agent.
    
    Expected JSON payload:
    {
        "image_url": "https://example.com/image.jpg"
    }
    """
    try:
        data = request.get_json()
        
        if not data or "image_url" not in data:
            return jsonify({
                "error": "Missing 'image_url' in request body"
            }), 400
        
        image_url = data["image_url"]
        
        # Get the agent and analyze the image
        agent = get_agent()
        result = agent.analyze_image_seo(image_url)
        
        return jsonify({
            "success": True,
            "image_url": image_url,
            "analysis": result["output"],
            "intermediate_steps": result.get("intermediate_steps", [])
        })
        
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@app.route("/chat", methods=["POST"])
def chat():
    """
    General chat endpoint for the SEO agent.
    
    Expected JSON payload:
    {
        "message": "Please analyze this image: https://example.com/image.jpg"
    }
    """
    try:
        data = request.get_json()
        
        if not data or "message" not in data:
            return jsonify({
                "error": "Missing 'message' in request body"
            }), 400
        
        message = data["message"]
        
        # Get the agent and process the message
        agent = get_agent()
        result = agent.chat(message)
        
        return jsonify({
            "success": True,
            "response": result["output"],
            "intermediate_steps": result.get("intermediate_steps", [])
        })
        
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
