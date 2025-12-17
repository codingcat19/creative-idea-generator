import os
from dotenv import load_dotenv
import google.generativeai as genai

# Load the environment variables from the .env file into the system environment
load_dotenv()
# Retrieve the Gemini API key from the environment
api_key = os.getenv("GEMINI_API_KEY")

# If the key is missing, raise an error immediately
if not api_key:
    raise ValueError("GEMINI_API_KEY not found in .env")

# Configure the Gemini API using the retrieved key
genai.configure(api_key=api_key)

def generate_idea(topic: str) -> str:

    
    # Initialize the generative model
    model = genai.GenerativeModel("models/gemini-2.5-flash") 
    
    # Build the prompt with instructions for style and format

    prompt = f"""
        You are a business idea generator.

        Generate a business idea for the topic: "{topic}"

        VERY IMPORTANT RULES:
        - Output MUST be in bullet points
        - Each bullet point MUST be on a new line
        - Do NOT merge sections into a paragraph
        - Do NOT write sentences outside bullet points
        - Do NOT add extra explanations
        - Follow the format EXACTLY

        OUTPUT FORMAT (do not change):

        Business Idea:
        - Sentence 1.
        - Sentence 2.

        Positive Points:
        - Point 1
        - Point 2
        - Point 3

        Negative Points:
        - Point 1
        - Point 2
        - Point 3

        Implementation:
        - Step 1
        - Step 2
        - Step 3
        """


    
    # Send the request to Gemini and get the response
    response = model.generate_content(prompt)
        # Return the clean text output
    text = response.text.strip()
    return text