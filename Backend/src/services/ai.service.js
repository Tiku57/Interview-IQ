const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENAI_API_KEY);

/**
 * @name generateInterviewReport
 * @description Service to generate interview report based on user resume, self description and job description.
 */
async function generateInterviewReport({ resume, selfDescription, jobDescription }) {
    // Use gemini-flash-latest for stable free tier quota
    const model = genAI.getGenerativeModel({ 
        model: "gemini-flash-latest", 
        generationConfig: {
            responseMimeType: "application/json",
        }
    });

    const prompt = `
        You are an expert interviewer and career coach. Based on the candidate's resume, self-description, and the job description provided, generate a comprehensive interview preparation report.

        Job Description: ${jobDescription || "Not provided"}
        Candidate Resume: ${resume || "Not provided"}
        Self Description: ${selfDescription || "Not provided"}

        The response MUST be a valid JSON object matching this EXACT structure:
        {
            "title": "A concise title like 'Senior Developer Interview Prep'",
            "matchScore": 85, // Integer between 0-100
            "technicalQuestions": [
                {
                    "question": "The technical question text",
                    "intention": "Why the interviewer is asking this",
                    "answer": "The ideal answer the candidate should give"
                }
            ],
            "behavioralQuestions": [
                {
                    "question": "The behavioral question text",
                    "intention": "What they are looking for (e.g. leadership)",
                    "answer": "Strategy for answering (e.g. use STAR method)"
                }
            ],
            "skillGaps": [
                {
                    "skill": "The specific missing skill",
                    "severity": "high" // Must be 'low', 'medium', or 'high'
                }
            ],
            "preparationPlan": [
                {
                    "day": 1,
                    "focus": "Focus area for this day",
                    "tasks": ["Actionable task 1", "Actionable task 2"]
                }
            ]
        }

        Requirements:
        - Generate 5-7 technical questions.
        - Generate 3-5 behavioral questions.
        - List all relevant skill gaps.
        - Create a 3-day preparation plan.
        - Return ONLY the raw JSON object.
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