const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || process.env.GOOGLE_GENAI_API_KEY);

/**
 * @name generateInterviewReport
 * @description Service to generate interview report with automatic model failover.
 */
async function generateInterviewReport({ resume, selfDescription, jobDescription }) {
    const modelsToTry = ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-1.5-flash", "gemini-flash-latest"];
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
            let jsonStr = text.includes("```json") 
                ? text.split("```json")[1].split("```")[0].trim() 
                : text.trim();
            
            // Fix for Gemini sometimes generating malformed JSON (like an extra trailing brace)
            let parsedJSON = null;
            let currentStr = jsonStr;
            
            // Iteratively remove trailing characters until JSON.parse succeeds
            while (currentStr.length > 20) {
                try {
                    parsedJSON = JSON.parse(currentStr);
                    break; // Success!
                } catch (e) {
                    currentStr = currentStr.slice(0, -1);
                }
            }

            if (!parsedJSON) {
                console.error(`[AI Service] JSON Parsing failed entirely. Raw string:`, jsonStr);
                throw new Error(`JSON Parse Error: Could not salvage valid JSON. Original error: Unexpected non-whitespace character.`);
            }

            console.log(`[AI Service] JSON parsed successfully.`);
            return parsedJSON;

        } catch (error) {
            console.error(`>>> Model ${modelName} failed:`);
            console.error(`Status Code: ${error?.status || 'Unknown'}`);
            console.error(`Message: ${error.message}`);
            console.error(`Stack: ${error.stack}`);
            
            lastError = error;
            console.log(`>>> Retrying with next model or using fallback...`);
            continue;
        }
    }

    // Return a mock fallback report instead of throwing a 500 error
    return {
        title: "AI Report Generation Failed - Fallback Provided",
        matchScore: 50,
        technicalQuestions: [
            {
                question: "What are your primary technical strengths?",
                intention: "Fallback technical question",
                answer: "Highlight your most relevant technical skills."
            }
        ],
        behavioralQuestions: [
            {
                question: "Tell me about a time you faced a difficult challenge.",
                intention: "Fallback behavioral question",
                answer: "Use the STAR method."
            }
        ],
        skillGaps: [
            {
                skill: "AI Service Unavailable",
                severity: "low"
            }
        ],
        preparationPlan: [
            {
                day: 1,
                focus: "Review basics",
                tasks: ["Wait for AI service to recover", "Review resume"]
            }
        ]
    };
}

module.exports = {
    generateInterviewReport
};