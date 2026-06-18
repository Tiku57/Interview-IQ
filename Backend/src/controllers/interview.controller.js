const pdfParse = require("pdf-parse")
const { generateInterviewReport } = require("../services/ai.service")
const interviewReportModel = require("../models/interviewReport.model")




/**
 * @description Controller to generate interview report based on user self description, resume and job description.
 */
async function generateInterViewReportController(req, res) {
    try {
        let resumeText = "";

        if (req.file) {
            try {
                const pdfParser = new pdfParse.PDFParse(Uint8Array.from(req.file.buffer));
                await pdfParser.load();
                const parsedContent = await pdfParser.getText();
                resumeText = parsedContent.text || "";
            } catch (err) {
                return res.status(400).json({ message: "Failed to parse the uploaded PDF resume." });
            }
        }

        const { selfDescription, jobDescription } = req.body;

        if (!resumeText && (!selfDescription || !selfDescription.trim())) {
            return res.status(400).json({ message: "Either a resume or a self description must be provided." });
        }

        const interViewReportByAi = await generateInterviewReport({
            resume: resumeText,
            selfDescription,
            jobDescription
        });

        // Sanitize matchScore (ensure it's a number)
        if (interViewReportByAi.matchScore && typeof interViewReportByAi.matchScore === "string") {
            interViewReportByAi.matchScore = parseInt(interViewReportByAi.matchScore.replace(/[^0-9]/g, "")) || 0;
        }

        const interviewReport = await interviewReportModel.create({
            user: req.user.id,
            resume: resumeText,
            selfDescription,
            jobDescription,
            ...interViewReportByAi
        });

        res.status(201).json({
            message: "Interview report generated successfully.",
            interviewReport
        });
    } catch (error) {
        console.error("Error generating report:", error.message);
        res.status(500).json({ message: error.message || "Failed to generate interview report. Ensure you are using a US-based server region." });
    }
}

/**
 * @description Controller to get interview report by interviewId.
 */
async function getInterviewReportByIdController(req, res) {

    const { interviewId } = req.params

    const interviewReport = await interviewReportModel.findOne({ _id: interviewId, user: req.user.id })

    if (!interviewReport) {
        return res.status(404).json({
            message: "Interview report not found."
        })
    }

    res.status(200).json({
        message: "Interview report fetched successfully.",
        interviewReport
    })
}


/** 
 * @description Controller to get all interview reports of logged in user.
 */
async function getAllInterviewReportsController(req, res) {
    const interviewReports = await interviewReportModel.find({ user: req.user.id }).sort({ createdAt: -1 }).select("-resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan")

    res.status(200).json({
        message: "Interview reports fetched successfully.",
        interviewReports
    })
}


/**
 * @description Controller to generate resume PDF based on user self description, resume and job description.
 */
async function generateResumePdfController(req, res) {
    res.status(501).json({ message: "PDF generation is now handled on the frontend for better performance." });
}

module.exports = { generateInterViewReportController, getInterviewReportByIdController, getAllInterviewReportsController, generateResumePdfController }