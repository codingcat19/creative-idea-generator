```markdown
# 🚀 Creative Idea Generator

A sophisticated full-stack application that leverages **Google Gemini 1.5 Flash AI** to brainstorm creative business and project ideas. The system features a custom **MongoDB caching layer** to ensure speed and cost-efficiency.

---

## 🏗️ System Architecture



The application follows a modern decoupled architecture:
1. **Frontend**: A responsive TailwindCSS interface with strict input sanitization.
2. **Backend**: A Flask server (Python) serving as a RESTful API.
3. **Database**: MongoDB for persisting generated ideas to prevent redundant AI API calls.
4. **DevOps**: Fully containerized using Docker for "one-command" deployment.

---

## 🛠️ Tech Stack

* **Language:** Python 3.11, JavaScript (ES6+)
* **Framework:** Flask
* **AI:** Google Generative AI (Gemini SDK)
* **Database:** MongoDB 7.0
* **Styling:** TailwindCSS
* **Containerization:** Docker & Docker Compose

---

## 🚀 Getting Started

### 1. Prerequisites
Ensure you have the following installed:
* [Docker Desktop](https://www.docker.com/products/docker-desktop/)
* [Git](https://git-scm.com/)

### 2. Environment Setup
Create a file named `.env` in the root directory:
```env
GEMINI_API_KEY=your_api_key_here

```

### 3. Deployment

Simply run the following command to build the images and start the services:

```bash
docker compose up --build

```

The application will be live at: **`http://localhost:8000`**

---

## 📁 Project Structure

```text
.
├── main.py              # Entry point: Flask API & Routes
├── generator.py         # Gemini AI Logic
├── db.py                # MongoDB CRUD & Cache Logic
├── templates/
│   └── index.html       # Frontend Layout
├── static/
│   ├── script.js        # Frontend Logic & XSS Protection
│   └── styles.css       # Custom Tailwind Overrides
├── Dockerfile           # Python Environment Config
├── docker-compose.yml   # Container Orchestration
└── requirements.txt     # Python Dependencies

```

---

## 🛡️ Security Features

* **Input Sanitization:** Prevents XSS attacks by filtering `<script>`, `eval()`, and event handlers.
* **Environment Safety:** Sensitive API keys are managed via `.env` files and never hardcoded.
* **CORS Enabled:** Secure Cross-Origin Resource Sharing configuration for the Flask API.

---

## 🔌 API Reference

### Generate Idea

`POST /generate`

| Parameter | Type | Description |
| --- | --- | --- |
| `topic` | `string` | **Required**. The subject for the AI to brainstorm. |

**Example Response:**

```json
{
  "idea": {
    "business_idea": "...",
    "positive_points": ["...", "..."],
    "negative_points": ["...", "..."],
    "implementation": ["...", "..."]
  }
}

```

---

*Developed with ❤️ for creative thinkers.*

```
