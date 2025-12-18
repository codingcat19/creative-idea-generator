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

    const validation = validateAndSanitizeInput(topic);

    if (!validation.valid) {
        safeDisplayText(resultBox, validation.error);
        resultBox.style.color = "#ff6b6b"; 
        return;
    }

    resultBox.style.color = "";
    loadingText.classList.remove("hidden");
    resultBox.innerHTML = ""; // Clear previous content

    try {
        const response = await new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open("POST", "http://127.0.0.1:5000/generate", true);
            xhr.setRequestHeader("Content-Type", "application/json");
            xhr.onreadystatechange = function() {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        resolve(JSON.parse(xhr.responseText));
                    } else {
                        reject(new Error("Server error or invalid request"));
                    }
                }
            };
            xhr.send(JSON.stringify({ topic: validation.value }));
        });

        // --- NEW JSON PARSING BLOCK START ---
        try {
            // Check if response.idea is already an object or needs parsing
            const ideaData = typeof response.idea === 'string' 
                ? JSON.parse(response.idea) 
                : response.idea;

            let formattedHtml = `
                <h3 class="font-bold text-blue-700 text-lg mt-2">Business Idea</h3>
                <p class="mb-4 text-gray-800">${ideaData.business_idea}</p>
                
                <h3 class="font-bold text-green-700 text-lg">Pros</h3>
                <ul class="list-disc ml-5 mb-4 text-gray-700">
                    ${ideaData.positive_points.map(p => `<li>${p}</li>`).join('')}
                </ul>
                
                <h3 class="font-bold text-red-700 text-lg">Cons</h3>
                <ul class="list-disc ml-5 mb-4 text-gray-700">
                    ${ideaData.negative_points.map(p => `<li>${p}</li>`).join('')}
                </ul>
                
                <h3 class="font-bold text-blue-700 text-lg">Next Steps</h3>
                <ul class="list-decimal ml-5 text-gray-700">
                    ${ideaData.implementation.map(step => `<li>${step}</li>`).join('')}
                </ul>
            `;
            
            resultBox.innerHTML = formattedHtml;
            resultBox.style.color = "#1a202c";
        } catch (parseErr) {
            // Fallback if the AI fails to send perfect JSON
            console.error("JSON Parse Error:", parseErr);
            safeDisplayText(resultBox, response.idea);
        }
        // --- NEW JSON PARSING BLOCK END ---

    } catch (error) {
        console.error("Error:", error);
        safeDisplayText(resultBox, "Error: " + error.message);
        resultBox.style.color = "#ff6b6b";
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