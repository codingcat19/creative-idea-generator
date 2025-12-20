from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv()

# Get MongoDB connection URI; fallback to local instance if not provided
mongo_uri = os.getenv("MONGO_URI", "mongodb://localhost:27017/")

# Create MongoDB client

client = MongoClient(mongo_uri)
# Select database for storing generated ideas
db = client["creative_idea_generator"]

# Select the collection that holds idea documents
ideas_collection = db["ideas"]

def check_db_store():
    """Check and print all documents in the ideas collection."""
    try:
        # Fetch all documents from the collection
        documents = list(ideas_collection.find())
        if documents:
            print(f"Found {len(documents)} cached ideas:")
             # Loop through all stored ideas and print details
            for doc in documents:
                print(f"Topic: {doc.get('topic')}")
                print(f"Idea: {doc.get('idea')}")
                print("-" * 40)
        else:
            print("No cached ideas found in the database.")
    except Exception as e:
        # Catch and display unexpected errors (e.g., connection issues)
        print(f"Error checking database: {str(e)}")
# Execute only when the script is run directly (not imported)
if __name__ == "__main__":
    check_db_store()
