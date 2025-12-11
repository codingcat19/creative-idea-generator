from flask import Flask, request, jsonify, render_template
from generator import generate_idea
from flask_cors import CORS

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

        idea = generate_idea(topic)
        return jsonify({"idea": idea})
    except Exception as e:
        print(f"Error generating idea: {str(e)}")
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)