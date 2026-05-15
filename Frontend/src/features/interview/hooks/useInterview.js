import { getAllInterviewReports, generateInterviewReport, getInterviewReportById, generateResumePdf } from "../services/interview.api"
import { useContext, useEffect } from "react"
import { InterviewContext } from "../interview.context"
import { useParams } from "react-router"


export const useInterview = () => {

    const context = useContext(InterviewContext)
    const { interviewId } = useParams()

    if (!context) {
        throw new Error("useInterview must be used within an InterviewProvider")
    }

    const { loading, setLoading, report, setReport, reports, setReports } = context

    const generateReport = async ({ jobDescription, selfDescription, resumeFile }) => {
        setLoading(true)
        let response = null
        try {
            response = await generateInterviewReport({ jobDescription, selfDescription, resumeFile })
            setReport(response.interviewReport)
        } catch (error) {
            console.log(error)
            alert(error.response?.data?.message || "An error occurred while generating the report.");
        } finally {
            setLoading(false)
        }

        return response ? response.interviewReport : null
    }

    const getReportById = async (interviewId) => {
        setLoading(true)
        let response = null
        try {
            response = await getInterviewReportById(interviewId)
            setReport(response.interviewReport)
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
        return response.interviewReport
    }

    const getReports = async () => {
        setLoading(true)
        let response = null
        try {
            response = await getAllInterviewReports()
            setReports(response.interviewReports)
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }

        return response ? response.interviewReports : [];
    }

    const getResumePdf = async (reportData) => {
        if (!reportData?.resume) return;
        
        setLoading(true)
        try {
            const { jsPDF } = await import('jspdf');
            const doc = new jsPDF();
            
            // Basic formatting
            doc.setFontSize(20);
            doc.text("Resume - Tailored by InterviewIQ", 20, 20);
            
            doc.setFontSize(12);
            doc.setFont("helvetica", "normal");
            
            // Split text to fit page width
            const splitResume = doc.splitTextToSize(reportData.resume, 170);
            doc.text(splitResume, 20, 40);
            
            doc.save(`resume_${reportData._id || 'download'}.pdf`);
        }
        catch (error) {
            console.log("PDF Error:", error)
            alert("Failed to generate PDF. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getReports()
    }, [])

    useEffect(() => {
        if (interviewId) {
            getReportById(interviewId)
        }
    }, [ interviewId ])

    return { loading, report, reports, generateReport, getReportById, getReports, getResumePdf }

}