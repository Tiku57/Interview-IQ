const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENAI_API_KEY);

/**
 * @name generateInterviewReport
 * @description Service to generate interview report with automatic model failover.
 */
async function generateInterviewReport({ resume, selfDescription, jobDescription }) {
    // List of models to try in order of preference
    const modelsToTry = ["gemini-flash-latest", "gemini-2.0-flash-lite", "gemini-pro-latest"];
    let lastError = null;

    for (const modelName of modelsToTry) {
        try {
            console.log(`>>> Attempting generation with model: ${modelName}`);
            const model = genAI.getGenerativeModel({ 
                model: modelName, 
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
                    "matchScore": 85,
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
                            "intention": "What they are looking for",
                            "answer": "Strategy for answering (e.g. STAR method)"
                        }
                    ],
                    "skillGaps": [
                        {
                            "skill": "The specific missing skill",
                            "severity": "high"
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

            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();

            if (!text) throw new Error("Empty response");

            const jsonStr = text.includes("```json") 
                ? text.split("```json")[1].split("```")[0].trim() 
                : text.trim();
            
            return JSON.parse(jsonStr);

        } catch (error) {
            console.error(`>>> Model ${modelName} failed:`, error.message);
            lastError = error;
            // Continue to next model if it's a 503 or 429
            if (error.message.includes("503") || error.message.includes("429")) {
                continue;
            } else {
                throw error; // If it's a different error, stop and report
            }
        }
    }

    throw lastError || new Error("All AI models failed to respond");
}

module.exports = {
    generateInterviewReport
};