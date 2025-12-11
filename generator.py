import os
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    raise ValueError("GEMINI_API_KEY not found in .env")

genai.configure(api_key=api_key)

def generate_idea(topic: str) -> str:
    model = genai.GenerativeModel("models/gemini-2.5-flash")
    prompt = f"Generate a creative one sentance idea based on this topic: {topic}"
    response = model.generate_content(prompt)
    return response.text.strip()