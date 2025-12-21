from pymongo import MongoClient
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()
# Get MongoDB connection URI from environment; fallback to local MongoDB if not set
mongo_uri = os.getenv("MONGO_URI", "mongodb://mongodb:27017/")
# Create a MongoDB client instance
client = MongoClient(mongo_uri)


# Select the database for storing cached ideas
db = client["creative_idea_generator"]

# Select the collection where ideas will be stored
ideas_collection = db["ideas"]

def get_cached_idea(topic: str) -> str:
    """Retrieve cached idea for a given topic."""
    result = ideas_collection.find_one({"topic": topic})
    return result["idea"] if result else None

def set_cached_idea(topic: str, idea: str):
    """Store idea in cache for a given topic."""
    ideas_collection.insert_one({"topic": topic, "idea": idea})
