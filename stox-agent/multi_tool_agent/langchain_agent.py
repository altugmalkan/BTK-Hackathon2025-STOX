import os
from typing import Dict, Any
from langchain.tools import BaseTool
from langchain.agents import create_tool_calling_agent, AgentExecutor
from langchain.prompts import ChatPromptTemplate
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import SystemMessage
from .agent import seo_analysis


class SEOAnalysisTool(BaseTool):
    """Custom Langchain tool that wraps the seo_analysis function."""
    
    name: str = "seo_analysis"
    description: str = "Analyze the SEO of a single image URL and return a detailed report."
    
    def _run(self, url: str) -> str:
        """Execute the SEO analysis for the given URL."""
        try:
            result = seo_analysis(url)
            return str(result)
        except Exception as e:
            return f"Error during SEO analysis: {str(e)}"
    
    async def _arun(self, url: str) -> str:
        """Async version of the SEO analysis."""
        return self._run(url)


class SEOLangChainAgent:
    """Langchain agent that uses SEO analysis tools."""
    
    def __init__(self, google_api_key: str = None):
        """
        Initialize the SEO Langchain agent.
        
        Args:
            google_api_key: Google API key. If not provided, will look for GOOGLE_API_KEY env var.
        """
        # Set up Google API key
        if google_api_key:
            os.environ["GOOGLE_API_KEY"] = google_api_key
        elif not os.getenv("GOOGLE_API_KEY"):
            raise ValueError("Google API key must be provided either as parameter or GOOGLE_API_KEY env var")
        
        # Initialize the language model
        self.llm = ChatGoogleGenerativeAI(
            model="gemini-2.0-flash",
            temperature=0,
            google_api_key=" "
        )
        
        # Create tools
        self.tools = [SEOAnalysisTool()]
        
        # Create prompt template
        self.prompt = ChatPromptTemplate.from_messages([
            SystemMessage(content="""You are an SEO analysis assistant. Your primary function is to analyze images for SEO purposes.

When a user provides an image URL, use the seo_analysis tool to analyze the image and provide insights about:
- Image content and relevance
- SEO optimization suggestions
- Alt text recommendations
- Any other SEO-related observations

Always use the available tools to perform the analysis rather than making assumptions."""),
            ("human", "{input}"),
            ("placeholder", "{agent_scratchpad}")
        ])
        
        # Create agent
        self.agent = create_tool_calling_agent(
            llm=self.llm,
            tools=self.tools,
            prompt=self.prompt
        )
        
        # Create executor
        self.executor = AgentExecutor(
            agent=self.agent,
            tools=self.tools,
            verbose=True,
            return_intermediate_steps=True
        )
    
    def analyze_image_seo(self, image_url: str) -> Dict[str, Any]:
        """
        Analyze an image URL for SEO purposes.
        
        Args:
            image_url: The URL of the image to analyze
            
        Returns:
            Dictionary containing the analysis results and intermediate steps
        """
        try:
            result = self.executor.invoke({
                "input": f"Please analyze this image URL for SEO purposes: {image_url}"
            })
            # Convert intermediate steps to string for JSON serialization
            if "intermediate_steps" in result:
                result["intermediate_steps"] = [str(step) for step in result["intermediate_steps"]]
            return result
        except Exception as e:
            return {
                "output": f"Error during analysis: {str(e)}",
                "intermediate_steps": []
            }
    
    def chat(self, message: str) -> Dict[str, Any]:
        """
        General chat interface for the agent.
        
        Args:
            message: User message/query
            
        Returns:
            Dictionary containing the agent's response and intermediate steps
        """
        try:
            result = self.executor.invoke({"input": message})
            if "intermediate_steps" in result:
                result["intermediate_steps"] = [str(step) for step in result["intermediate_steps"]]
            return result
        except Exception as e:
            return {
                "output": f"Error: {str(e)}",
                "intermediate_steps": []
            }


def create_seo_agent(google_api_key: str = None) -> SEOLangChainAgent:
    """
    Factory function to create a new SEO Langchain agent.
    
    Args:
        google_api_key: Optional Google API key
        
    Returns:
        Configured SEOLangChainAgent instance
    """
    return SEOLangChainAgent(google_api_key=google_api_key)


if __name__ == "__main__":
    # Example usage
    agent = create_seo_agent()
    
    # Test with the same URL from the original agent.py
    test_url = "https://dc9a2118r4lqa.cloudfront.net/users/b3a45f8c-5473-4a9a-9b48-35731c36125e/enhanced/enhanced_test-image_0d56bda0-ad35-45ab-a901-a206e54018ea_enhanced_a0fd79c3-6965-4dd4-9e8c-88f6273b193b.jpg"
    
    result = agent.analyze_image_seo(test_url)
    print("SEO Analysis Result:")
    print(result["output"])
    
    if result.get("intermediate_steps"):
        print("\nIntermediate Steps:")
        for step in result["intermediate_steps"]:
            print(f"- {step}")