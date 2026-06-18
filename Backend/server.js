require("dotenv").config()

console.log("GEMINI_API_KEY EXISTS:", !!process.env.GEMINI_API_KEY);
console.log("GOOGLE_GENAI_API_KEY EXISTS:", !!process.env.GOOGLE_GENAI_API_KEY);

if (!process.env.GEMINI_API_KEY && !process.env.GOOGLE_GENAI_API_KEY) {
    throw new Error("No Gemini API key configured");
}

const app = require("./src/app")
const connectToDB = require("./src/config/database")

connectToDB()


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})