require('dotenv').config({ path: './.env' });
const { GoogleGenerativeAI } = require('@google/generative-ai');
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENAI_API_KEY);

(async () => {
    try {
        const fetch = require('node-fetch');
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GOOGLE_GENAI_API_KEY}`);
        const data = await response.json();
        console.log("Models:");
        console.log(data.models.map(m => m.name).join("\n"));
    } catch (e) {
        console.error("Failed:", e.message);
    }
})();
