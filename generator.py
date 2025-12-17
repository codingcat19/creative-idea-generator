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
            Generate a structured business idea based on the topic: {topic}

             Follow this format strictly:

                Business Idea:
                - Describe the idea in 2–3 clear, simple sentences.

                Positive Points:
                - List 2–3 advantages of this idea.

                Negative Points:
                - List 2–3 challenges or risks.

                Implementation:
                - Explain briefly how this idea can be implemented in practical steps.

                Use simple language. Avoid fluff words. Be concise and clear.
                """
    
    # Send the request to Gemini and get the response
    response = model.generate_content(prompt)
        # Return the clean text output
    text = response.text.strip()
    return text