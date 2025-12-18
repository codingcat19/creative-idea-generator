import os
from dotenv import load_dotenv
import google.generativeai as genai
from typing import TypedDict
from typing_extensions import NotRequired

# Load the environment variables from the .env file into the system environment
load_dotenv()

# Retrieve the Gemini API key from the environment
api_key = os.getenv("GEMINI_API_KEY")

# If the key is missing, raise an error immediately
if not api_key:
    raise ValueError("GEMINI_API_KEY not found in .env")

# Configure the Gemini API using the retrieved key
genai.configure(api_key=api_key)


# Define the response schema using TypedDict
class BusinessIdea(TypedDict):
    business_idea: list[str]
    positive_points: list[str]
    negative_points: list[str]
    implementation: list[str]


def generate_idea(topic: str) -> BusinessIdea:
    """
    Generate a business idea for the given topic using Gemini API.
    
    Args:
        topic: The business topic/domain to generate ideas for
        
    Returns:
        BusinessIdea dictionary with structured data
    """
    # Initialize the generative model
    model = genai.GenerativeModel("models/gemini-2.5-flash")
    
    # Build the prompt
    prompt = f"""
You are a business idea generator. Generate a comprehensive business idea for the topic: "{topic}"

Provide:
1. Business Idea: 2-3 sentences describing the core concept
2. Positive Points: 3-5 advantages or opportunities
3. Negative Points: 3-5 challenges or risks
4. Implementation: 3-5 actionable steps to get started

Be specific, practical, and insightful.
"""
    
    # Define the JSON schema for structured output
    response = model.generate_content(
        prompt,
        generation_config=genai.GenerationConfig(
            response_mime_type="application/json",
            response_schema={
                "type": "object",
                "properties": {
                    "business_idea": {
                        "type": "array",
                        "items": {"type": "string"},
                        "description": "2-3 sentences describing the business concept"
                    },
                    "positive_points": {
                        "type": "array",
                        "items": {"type": "string"},
                        "description": "List of advantages and opportunities"
                    },
                    "negative_points": {
                        "type": "array",
                        "items": {"type": "string"},
                        "description": "List of challenges and risks"
                    },
                    "implementation": {
                        "type": "array",
                        "items": {"type": "string"},
                        "description": "Actionable steps to implement the idea"
                    }
                },
                "required": ["business_idea", "positive_points", "negative_points", "implementation"]
            }
        )
    )
    
    # Parse and return the JSON response
    import json
    result = json.loads(response.text)
    return result