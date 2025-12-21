from flask import Flask, request, jsonify, render_template
from generator import generate_idea
from flask_cors import CORS
from db import get_cached_idea, set_cached_idea

#Flask Server Setup

app = Flask(__name__, template_folder="templates", static_folder="static")
CORS(app)

@app.route("/")
def home():
    return render_template("index.html")

@app.post("/generate")
def create_idea():
    try:
            data = request.get_json()
            topic = data.get("topic")

            if not topic:
                return jsonify({"error": "Topic is required"}), 400
            
            normalized_topic=topic.lower().replace(" ","")
            # Check cache first
            cached_idea = get_cached_idea(normalized_topic)
            if cached_idea:
                return jsonify({"idea": cached_idea})

            # Generate new idea if not cached
            idea = generate_idea(normalized_topic)
            set_cached_idea(normalized_topic, idea)
            return jsonify({"idea": idea})
    except Exception as e:
            print(f"Error generating idea: {str(e)}")
            return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
        app.run(host="0.0.0.0", port=8000, debug=True)
