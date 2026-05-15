const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENAI_API_KEY);

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
    // Use the exact alias confirmed by the diagnostic list
    const model = genAI.getGenerativeModel({ 
        model: "gemini-flash-latest", 
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