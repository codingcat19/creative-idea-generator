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
    data = request.get_json()
    topic = data.get("topic")

    idea = generate_idea(topic)
    return jsonify({"idea": idea})

if __name__ == "__main__":
    app.run(debug=True)
