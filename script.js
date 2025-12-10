async function generateIdea() {
    const topic = document.getElementById("topicInput").value;
    const resultBox = document.getElementById("result");
    const loadingText = document.getElementById("loading");

    if (!topic.trim()) {
        resultBox.innerText = "Please enter a topic!";
        return;
    }

    loadingText.classList.remove("hidden");
    resultBox.innerText = "";

    try {
        console.log("Sending request to backend with topic:", topic);
        const response = await fetch("http://127.0.0.1:5000/generate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ topic })
        });

        if (!response.ok) {
            throw new Error("Server returned " + response.status);
        }

        const data = await response.json();
        resultBox.innerText = data.idea;

    } catch (error) {
        resultBox.innerText = "Error: Could not generate idea. Check backend.";
        console.error(error);
    }

    loadingText.classList.add("hidden");
}
