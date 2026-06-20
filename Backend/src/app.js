const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const logger = require("./utils/logger");
const errorHandler = require("./middlewares/errorHandler");
const AppError = require("./utils/appError");

const app = express();

// Set security HTTP headers
app.use(helmet());

// Limit requests from same API
const limiter = rateLimit({
    max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
    windowMs: 15 * 60 * 1000,
    message: 'Too many requests from this IP, please try again in 15 minutes!'
});
app.use('/api', limiter);

app.use(express.json());
app.use(cookieParser());
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
}));

// Basic request logger
app.use((req, res, next) => {
    logger.info(`${req.method} ${req.url}`);
    next();
});

/* require all the routes here */
const authRouter = require("./routes/auth.routes");
const interviewRouter = require("./routes/interview.routes");

/* using all the routes here */
app.use("/api/auth", authRouter);
app.use("/api/interview", interviewRouter);

app.get("/api/debug/gemini", async (req, res, next) => {
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
        return next(new AppError(error.message, 500));
    }
});

// Handle undefined routes
app.use((req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global Error Handler
app.use(errorHandler);

module.exports = app;