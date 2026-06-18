const pdfParse = require("pdf-parse")
const { generateInterviewReport } = require("../services/ai.service")
const interviewReportModel = require("../models/interviewReport.model")




/**
 * @description Controller to generate interview report based on user self description, resume and job description.
 */
async function generateInterViewReportController(req, res) {
    let currentStep = "STEP 1: Request received";
    try {
        console.log("Gemini Key Present:", !!process.env.GOOGLE_GENAI_API_KEY);
        console.log("Mongo URI Present:", !!process.env.MONGODB_URI);
        
        console.log(currentStep);
        console.log("=== REQUEST DETAILS ===");
        console.log("req.user:", req.user);
        console.log("req.body:", req.body);
        console.log("req.file:", req.file ? {
            originalname: req.file.originalname,
            mimetype: req.file.mimetype,
            size: req.file.size
        } : "No file uploaded");
        console.log("=======================");

        let resumeText = "";

        if (req.file) {
            currentStep = "STEP 2: PDF uploaded";
            console.log(currentStep);
            try {
                const pdfParser = new pdfParse.PDFParse(Uint8Array.from(req.file.buffer));
                await pdfParser.load();
                currentStep = "STEP 3: PDF parsed";
                console.log(currentStep);
                const parsedContent = await pdfParser.getText();
                resumeText = parsedContent.text || "";
            } catch (err) {
                console.error("FAILED AT STEP 3: PDF Parsing");
                throw new Error("Failed to parse the uploaded PDF resume.");
            }
        }

        const { selfDescription, jobDescription } = req.body;

        if (!resumeText && (!selfDescription || !selfDescription.trim())) {
            return res.status(400).json({ message: "Either a resume or a self description must be provided." });
        }

        currentStep = "STEP 4: Prompt generated & STEP 5: Calling Gemini";
        console.log(currentStep);
        const interViewReportByAi = await generateInterviewReport({
            resume: resumeText,
            selfDescription,
            jobDescription
        });

        currentStep = "STEP 6: Gemini response received & STEP 7: JSON parsed";
        console.log(currentStep);

        // Sanitize matchScore (ensure it's a number)
        if (interViewReportByAi.matchScore && typeof interViewReportByAi.matchScore === "string") {
            interViewReportByAi.matchScore = parseInt(interViewReportByAi.matchScore.replace(/[^0-9]/g, "")) || 0;
        }

        currentStep = "STEP 8: MongoDB save";
        console.log(currentStep);
        const interviewReport = await interviewReportModel.create({
            user: req.user.id,
            resume: resumeText,
            selfDescription,
            jobDescription,
            ...interViewReportByAi
        });
        
        console.log("STEP 8: MongoDB save successful");

        currentStep = "STEP 9: Response sent";
        console.log(currentStep);

        res.status(201).json({
            message: "Interview report generated successfully.",
            interviewReport
        });
    } catch (error) {
        console.error("INTERVIEW ROUTE FAILURE");
        console.error(`FAILED AT ${currentStep}`);
        console.error(error);
        console.error(error.message);
        console.error(error.stack);
        
        res.status(500).json({ 
            step: currentStep,
            error: error.message,
            stack: process.env.NODE_ENV !== "production" ? error.stack : undefined
        });
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