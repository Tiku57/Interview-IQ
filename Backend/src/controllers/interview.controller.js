const pdfParse = require("pdf-parse")
const { generateInterviewReport, generateResumePdf } = require("../services/ai.service")
const interviewReportModel = require("../models/interviewReport.model")




/**
 * @description Controller to generate interview report based on user self description, resume and job description.
 */
async function generateInterViewReportController(req, res) {
    console.log(">>> [DEBUG] generateInterViewReportController started");
    console.log(">>> [DEBUG] User:", req.user);
    console.log(">>> [DEBUG] Body Keys:", Object.keys(req.body));
    console.log(">>> [DEBUG] File Present:", !!req.file);

    try {
        let resumeText = "";

        if (req.file) {
            console.log(">>> [DEBUG] Parsing PDF...");
            try {
                const pdfParser = new pdfParse.PDFParse(Uint8Array.from(req.file.buffer));
                await pdfParser.load();
                const parsedContent = await pdfParser.getText();
                resumeText = parsedContent.text || "";
                console.log(">>> [DEBUG] PDF parsed, length:", resumeText.length);
            } catch (err) {
                console.error(">>> [ERROR] PDF parse error:", err);
                return res.status(400).json({ message: "Failed to parse the uploaded PDF resume." });
            }
        }

        const { selfDescription, jobDescription } = req.body;

        if (!resumeText && (!selfDescription || !selfDescription.trim())) {
            console.log(">>> [DEBUG] Validation failed: No content provided");
            return res.status(400).json({ message: "Either a resume or a self description must be provided." });
        }

        console.log(">>> [DEBUG] Calling AI service...");
        const interViewReportByAi = await generateInterviewReport({
            resume: resumeText,
            selfDescription,
            jobDescription
        });
        console.log(">>> [DEBUG] AI responded successfully");

        // Sanitize matchScore
        if (interViewReportByAi.matchScore && typeof interViewReportByAi.matchScore === "string") {
            interViewReportByAi.matchScore = parseInt(interViewReportByAi.matchScore.replace(/[^0-9]/g, "")) || 0;
        }

        console.log(">>> [DEBUG] Saving to database...");
        const interviewReport = await interviewReportModel.create({
            user: req.user.id,
            resume: resumeText,
            selfDescription,
            jobDescription,
            ...interViewReportByAi
        });
        console.log(">>> [DEBUG] Report saved, ID:", interviewReport._id);

        res.status(201).json({
            message: "Interview report generated successfully.",
            interviewReport
        });
    } catch (error) {
        console.error(">>> [CRITICAL ERROR] Controller failed:", error.message);
        console.error(error.stack);
        res.status(500).json({ message: "Failed to generate interview report. Check server logs." });
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
    const { interviewReportId } = req.params

    const interviewReport = await interviewReportModel.findById(interviewReportId)

    if (!interviewReport) {
        return res.status(404).json({
            message: "Interview report not found."
        })
    }

    const { resume, jobDescription, selfDescription } = interviewReport

    const pdfBuffer = await generateResumePdf({ resume, jobDescription, selfDescription })

    res.set({
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=resume_${interviewReportId}.pdf`
    })

    res.send(pdfBuffer)
}

module.exports = { generateInterViewReportController, getInterviewReportByIdController, getAllInterviewReportsController, generateResumePdfController }