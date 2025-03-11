const fetch = require("node-fetch");
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const API_KEY = process.env.GEMINI_API_KEY;

app.post("/generate-script", async (req, res) => {
    const { topic, videoType } = req.body;

    // Use the v1beta endpoint and gemini-2.0-flash model as requested
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

    const prompt = `You are a professional scriptwriter. Write a structured and engaging ${videoType} script about "${topic}". 
    Follow this format:
    1. Catchy Hook
    2. Introduction
    3. Main Content (3 key sections)
    4. Conclusion & Call-to-Action
    Keep it engaging and well-structured.`;

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: prompt }]
                }]
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("API Error:", errorData);
            return res.status(response.status).json({ error: "API request failed", details: errorData });
        }

        const data = await response.json();

        console.log("Google API Response:", data);

        if (data && data.candidates && data.candidates.length > 0 && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts.length > 0) {
            let scriptText = data.candidates[0].content.parts[0].text;

            // Example: Wrap "HOST" with bold and italic tags
            scriptText = scriptText.replace(/HOST/g, '<b><i>HOST</i></b>'); // Change "HOST" to any keyword you'd like to style.

            res.json({ script: scriptText });
        } else if (data && data.error) {
            console.error("Gemini API Error:", data.error);
            res.status(500).json({ error: "Gemini API Error", details: data.error });
        } else {
            console.error("Error: No valid content in API response", data);
            res.status(500).json({ error: "Failed to generate script", details: data });
        }
    } catch (error) {
        console.error("Error connecting to API:", error);
        res.status(500).json({ error: "Error connecting to API", details: error.message });
    }
});

app.listen(5000, () => console.log("Server running on port 5000"));
