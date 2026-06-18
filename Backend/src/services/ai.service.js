const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || process.env.GOOGLE_GENAI_API_KEY);

/**
 * @name generateInterviewReport
 * @description Service to generate interview report with automatic model failover.
 */
async function generateInterviewReport({ resume, selfDescription, jobDescription }) {
    const modelsToTry = ["gemini-3.5-flash", "gemini-2.5-flash", "gemini-flash-latest", "gemini-1.5-flash"];
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

            console.log(`[AI Service] Sending prompt to Gemini ${modelName}...`);
            const result = await model.generateContent(prompt);
            console.log(`[AI Service] Received response from Gemini ${modelName}.`);
            
            const response = await result.response;
            const text = response.text();

            if (!text) throw new Error("Empty response received from Gemini.");

            console.log(`[AI Service] Parsing JSON response...`);
            const jsonStr = text.includes("```json") 
                ? text.split("```json")[1].split("```")[0].trim() 
                : text.trim();
            
            try {
                const parsedJSON = JSON.parse(jsonStr);
                console.log(`[AI Service] JSON parsed successfully.`);
                return parsedJSON;
            } catch (jsonError) {
                console.error(`[AI Service] JSON Parsing failed. Raw string:`, jsonStr);
                throw new Error(`JSON Parse Error: ${jsonError.message}`);
            }

        } catch (error) {
            console.error(`>>> Model ${modelName} failed:`);
            console.error(`Status Code: ${error?.status || 'Unknown'}`);
            console.error(`Message: ${error.message}`);
            console.error(`Stack: ${error.stack}`);
            
            lastError = error;
            if (error.message.includes("503") || error.message.includes("429") || error.message.includes("location is not supported")) {
                console.log(`>>> Retrying with next model due to infrastructure/quota limits...`);
                continue;
            } else {
                throw error;
            }
        }
    }

    throw lastError || new Error("All AI models failed to respond");
}

module.exports = {
    generateInterviewReport
};