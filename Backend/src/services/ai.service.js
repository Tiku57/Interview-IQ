const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENAI_API_KEY);

// Diagnostic: Check if API Key is loaded and list models
(async () => {
    const key = process.env.GOOGLE_GENAI_API_KEY;
    if (!key) {
        console.error(">>> [DIAGNOSTIC] CRITICAL: GOOGLE_GENAI_API_KEY is NOT found in process.env!");
    } else {
        console.log(`>>> [DIAGNOSTIC] API Key found. Starts with: ${key.substring(0, 4)}...`);
        try {
            // Using a raw fetch to check models if the SDK fails
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${key}`);
            const data = await response.json();
            if (data.models) {
                console.log(">>> [DIAGNOSTIC] Available models for this key:", data.models.map(m => m.name).join(", "));
            } else {
                console.error(">>> [DIAGNOSTIC] Could not list models. Response:", JSON.stringify(data));
            }
        } catch (err) {
            console.error(">>> [DIAGNOSTIC] Model list failed:", err.message);
        }
    }
})();

const interviewReportJsonSchema = {
    description: "Interview report schema",
    type: "object",
    properties: {
        title: { type: "string" },
        matchScore: { type: "integer" },
        technicalQuestions: {
            type: "array",
            items: { type: "string" }
        },
        behavioralQuestions: {
            type: "array",
            items: { type: "string" }
        },
        skillGaps: {
            type: "array",
            items: { type: "string" }
        },
        preparationPlan: {
            type: "array",
            items: { type: "string" }
        }
    },
    required: ["title", "matchScore", "technicalQuestions", "behavioralQuestions", "skillGaps", "preparationPlan"]
};

/**
 * @name generateInterviewReport
 * @description Service to generate interview report based on user resume, self description and job description.
 */
async function generateInterviewReport({ resume, selfDescription, jobDescription }) {
    // Use gemini-1.5-flash for speed and reliability
    const model = genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash",
        generationConfig: {
            responseMimeType: "application/json",
        }
    });

    const prompt = `
        You are an expert interviewer and career coach. Based on the following information, generate a detailed interview preparation report in JSON format.

        Job Description: ${jobDescription || "Not provided"}
        Candidate Resume: ${resume || "Not provided"}
        Self Description: ${selfDescription || "Not provided"}

        The report MUST be a JSON object with the following fields:
        1. title: A concise title for the report (e.g. "Software Engineer Interview Prep")
        2. matchScore: A number from 0 to 100 representing how well the candidate fits the job.
        3. technicalQuestions: An array of 5-10 technical questions the candidate should prepare for.
        4. behavioralQuestions: An array of 3-5 behavioral questions relevant to the role.
        5. skillGaps: An array of specific skills the candidate is missing or needs to improve based on the job description.
        6. preparationPlan: An array of actionable steps the candidate can take to prepare.

        Return ONLY the raw JSON object.
    `;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        if (!text) {
            throw new Error("Empty response from Gemini AI");
        }

        try {
            // Robust parsing: extract JSON block if AI includes markdown backticks
            const jsonStr = text.includes("```json") 
                ? text.split("```json")[1].split("```")[0].trim() 
                : text.trim();
            
            return JSON.parse(jsonStr);
        } catch (parseError) {
            console.error("Failed to parse Gemini response as JSON:", text);
            throw new Error("Invalid JSON format from AI");
        }
    } catch (error) {
        console.error("Error in generateInterviewReport service:", error.message);
        throw error;
    }
}

module.exports = {
    generateInterviewReport
};