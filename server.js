const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));


const GEMINI_API_KEY = "YOUR_GEMINI_API_KEY";

const app = express();
app.use(express.json());
app.use(cors());

// ----------------------
// MongoDB Connection
// ----------------------
mongoose.connect("mongodb://127.0.0.1:27017/ideaDB")
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log("MongoDB Error:", err));

// ----------------------
// Schema / Model
// ----------------------
const IdeaSchema = new mongoose.Schema({
    input: { type: String, unique: true },
    output: String,
    createdAt: { type: Date, default: Date.now }
});

const IdeaModel = mongoose.model("ideas", IdeaSchema);

// ----------------------
// Gemini API Function
// ----------------------
async function generateIdeaFromGemini(prompt) {
    const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [
                    {
                        parts: [{ text: prompt }]
                    }
                ]
            })
        }
    );

    const data = await response.json();

    if (!data.candidates) {
        throw new Error("Gemini API error");
    }

    return data.candidates[0].content.parts[0].text;
}


// ----------------------
// MAIN API → Store + Retrieve
// ----------------------
app.post("/process", async (req, res) => {
    const userInput = req.body.input;

    if (!userInput) {
        return res.json({ error: "Input is required" });
    }

    // CHECK IF INPUT ALREADY EXISTS IN DB
    const existing = await IdeaModel.findOne({ input: userInput });

    if (existing) {
        console.log("🟢 Returning from Database (Not calling Gemini)");
        return res.json({
            message: "Fetched from DB",
            data: existing
        });
    }

    // OTHERWISE → CALL GEMINI API
    console.log("🔵 Calling Gemini API...");
    const generatedOutput = await generateIdeaFromGemini(userInput);

    // SAVE IN DB
    const savedData = await IdeaModel.create({
        input: userInput,
        output: generatedOutput
    });

    return res.json({
        message: "New idea generated!",
        data: savedData
    });
});

// ----------------------
app.listen(5000, () => console.log("Server running on port 5000"));
