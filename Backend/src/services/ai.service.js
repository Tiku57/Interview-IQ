const { GoogleGenerativeAI } = require("@google/generative-ai");
const { interviewReportSchema } = require("./ai.schema");
const logger = require("../utils/logger");

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
            logger.info(`Attempting generation with model: ${modelName}`);
            const model = genAI.getGenerativeModel({ 
                model: modelName, 
                generationConfig: {
                    responseMimeType: "application/json",
                    responseSchema: interviewReportSchema,
                }
            });

            const prompt = `
                You are an expert interviewer and career coach. Based on the candidate's resume, self-description, and the job description provided, generate a comprehensive interview preparation report.

                Job Description: ${jobDescription || "Not provided"}
                Candidate Resume: ${resume || "Not provided"}
                Self Description: ${selfDescription || "Not provided"}
            `;

            logger.info(`Sending prompt to Gemini ${modelName}...`);
            const result = await model.generateContent(prompt);
            logger.info(`Received response from Gemini ${modelName}.`);
            
            const response = await result.response;
            const text = response.text();

            if (!text) throw new Error("Empty response received from Gemini.");

            logger.info(`JSON parsed successfully.`);
            return JSON.parse(text);

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