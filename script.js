// Input validation and sanitization
function validateAndSanitizeInput(input) {
    // Trim whitespace
    let sanitized = input.trim();

    // Check if empty after trimming
    if (!sanitized) {
        return { valid: false, error: "Please enter a topic!" };
    }

    // Check minimum length
    if (sanitized.length < 2) {
        return { valid: false, error: "Topic must be at least 2 characters long." };
    }

    // Check maximum length (100 characters)
    if (sanitized.length > 100) {
        return { valid: false, error: "Topic is too long. Please keep it under 100 characters." };
    }

    // Remove null bytes (security)
    sanitized = sanitized.replace(/\0/g, '');

    // Check for suspicious patterns (basic security check)
    const suspiciousPatterns = [
        /<script[^>]>.?<\/script>/gi,  // Script tags
        /javascript:/gi,                  // JavaScript protocol
        /on\w+\s*=/gi,                   // Event handlers (onclick, onerror, etc.)
        /<iframe/gi,                      // Iframes
        /eval\(/gi,                       // Eval function
    ];

    let hasSuspiciousContent = false;
    for (const pattern of suspiciousPatterns) {
        if (pattern.test(sanitized)) {
            hasSuspiciousContent = true;
            break;
        }
    }

    if (hasSuspiciousContent) {
        return { valid: false, error: "Invalid characters detected. Please enter a normal topic." };
    }

    return { valid: true, value: sanitized };
}

// Safely display text (prevent XSS)
function safeDisplayText(element, text) {
    // Use textContent instead of innerHTML to prevent XSS
    element.textContent = text;
}

async function generateIdea() {
    const topicInput = document.getElementById("topicInput");
    const topic = topicInput.value;
    const resultBox = document.getElementById("result");
    const loadingText = document.getElementById("loading");

    // Validate and sanitize input
    const validation = validateAndSanitizeInput(topic);

    if (!validation.valid) {
        safeDisplayText(resultBox, validation.error);
        resultBox.style.color = "#ff6b6b"; // Red color for errors
        return;
    }

    // Reset result box styling
    resultBox.style.color = "";
    loadingText.classList.remove("hidden");
    safeDisplayText(resultBox, "");

    try {
        console.log("Sending request to backend with topic:", validation.value);

        const response = await fetch("http://127.0.0.1:5000/generate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({ topic: validation.value })
        });

        // Handle different HTTP status codes
        if (response.status === 400) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Invalid request");
        }

        if (response.status === 500) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Server error occurred");
        }

        if (!response.ok) {
            throw new Error(`Server returned ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();

        // Validate response
        if (!data || !data.idea) {
            throw new Error("Invalid response from server");
        }

        // Safely display the result
        safeDisplayText(resultBox, data.idea);
        resultBox.style.color = "#757977ff"; // Green color for success

    } catch (error) {
        console.error("Error generating idea:", error);

        // User-friendly error messages
        let errorMessage = "Error: Could not generate idea. ";

        if (error.message.includes("Failed to fetch")) {
            errorMessage += "Please make sure the Flask server is running on port 5000.";
        } else if (error.message.includes("NetworkError")) {
            errorMessage += "Network error. Check your connection.";
        } else {
            errorMessage += error.message;
        }

        safeDisplayText(resultBox, errorMessage);
        resultBox.style.color = "#ff6b6b"; // Red color for errors
    } finally {
        loadingText.classList.add("hidden");
    }
}

// Optional: Add Enter key support
document.addEventListener('DOMContentLoaded', function () {
    const topicInput = document.getElementById("topicInput");
    if (topicInput) {
        topicInput.addEventListener('keypress', function (event) {
            if (event.key === 'Enter') {
                generateIdea();
            }
        });
    }
});