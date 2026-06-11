require('dotenv').config({ path: './.env' });
const { GoogleGenerativeAI } = require('@google/generative-ai');
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENAI_API_KEY);

(async () => {
    try {
        const models = ['gemini-3.5-flash', 'gemini-2.5-flash', 'gemini-2.0-flash'];
        for (const m of models) {
            console.log("Trying", m);
            try {
                const model = genAI.getGenerativeModel({ model: m });
                const result = await model.generateContent("Say 'hello world'");
                console.log(m, "Success:", result.response.text());
                break;
            } catch (e) {
                console.log(m, "Failed:", e.message);
            }
        }
    } catch (e) {
        console.error("Failed:", e.message);
    }
})();
