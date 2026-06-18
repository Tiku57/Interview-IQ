const express = require("express")
const cookieParser = require("cookie-parser")
const cors = require("cors")

const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin: (origin, callback) => {
        const allowedOrigins = process.env.FRONTEND_URL ? process.env.FRONTEND_URL.split(",") : [];
        if (!origin || allowedOrigins.includes(origin) || origin.endsWith(".vercel.app") || origin === "http://localhost:5173") {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}))

/* require all the routes here */
const authRouter = require("./routes/auth.routes")
const interviewRouter = require("./routes/interview.routes")


/* using all the routes here */
app.use("/api/auth", authRouter)
app.use("/api/interview", interviewRouter)

app.get("/api/debug/gemini", async (req, res) => {
    try {
        const { GoogleGenerativeAI } = require("@google/generative-ai");
        const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_GENAI_API_KEY;
        if (!apiKey) throw new Error("No API key configured");
        
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); // Testing with default valid model
        
        // Lightweight call
        const result = await model.generateContent("ping");
        
        return res.json({
            success: true,
            apiKeyPresent: true,
            model: "gemini-1.5-flash",
            geminiConnection: "working"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message,
            stack: error.stack
        });
    }
});



module.exports = app