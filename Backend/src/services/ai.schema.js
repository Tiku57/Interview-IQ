const { SchemaType } = require("@google/generative-ai");

const interviewReportSchema = {
    type: SchemaType.OBJECT,
    properties: {
        title: {
            type: SchemaType.STRING,
            description: "A concise title like 'Senior Developer Interview Prep'"
        },
        matchScore: {
            type: SchemaType.NUMBER,
            description: "A score from 0 to 100 indicating the match between the resume and job description"
        },
        technicalQuestions: {
            type: SchemaType.ARRAY,
            description: "5-7 technical questions based on the job requirements and candidate skills",
            items: {
                type: SchemaType.OBJECT,
                properties: {
                    question: { type: SchemaType.STRING, description: "The technical question text" },
                    intention: { type: SchemaType.STRING, description: "Why the interviewer is asking this" },
                    answer: { type: SchemaType.STRING, description: "The ideal answer the candidate should give" }
                },
                required: ["question", "intention", "answer"]
            }
        },
        behavioralQuestions: {
            type: SchemaType.ARRAY,
            description: "3-5 behavioral questions using the STAR method",
            items: {
                type: SchemaType.OBJECT,
                properties: {
                    question: { type: SchemaType.STRING, description: "The behavioral question text" },
                    intention: { type: SchemaType.STRING, description: "What they are looking for" },
                    answer: { type: SchemaType.STRING, description: "Strategy for answering (e.g. STAR method)" }
                },
                required: ["question", "intention", "answer"]
            }
        },
        skillGaps: {
            type: SchemaType.ARRAY,
            description: "Specific missing skills required by the job description but absent from the resume",
            items: {
                type: SchemaType.OBJECT,
                properties: {
                    skill: { type: SchemaType.STRING, description: "The specific missing skill" },
                    severity: { type: SchemaType.STRING, description: "High, medium, or low" }
                },
                required: ["skill", "severity"]
            }
        },
        preparationPlan: {
            type: SchemaType.ARRAY,
            description: "A 3-day preparation roadmap",
            items: {
                type: SchemaType.OBJECT,
                properties: {
                    day: { type: SchemaType.NUMBER, description: "Day number (1, 2, 3)" },
                    focus: { type: SchemaType.STRING, description: "Focus area for this day" },
                    tasks: {
                        type: SchemaType.ARRAY,
                        items: { type: SchemaType.STRING },
                        description: "Actionable tasks"
                    }
                },
                required: ["day", "focus", "tasks"]
            }
        }
    },
    required: ["title", "matchScore", "technicalQuestions", "behavioralQuestions", "skillGaps", "preparationPlan"]
};

module.exports = {
    interviewReportSchema
};
