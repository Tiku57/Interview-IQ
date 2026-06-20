const { Worker } = require('bullmq');
const { connection } = require('../config/redis');
const { generateInterviewReport } = require('../services/ai.service');
const InterviewReport = require('../models/interviewReport.model');
const logger = require('../utils/logger');

const interviewWorker = new Worker('interviewGeneration', async job => {
    logger.info(`Processing job ${job.id} for user ${job.data.userId}`);
    
    const { interviewId, userId, jobDescription, selfDescription, resumeText } = job.data;
    
    // Update status to processing
    await InterviewReport.findByIdAndUpdate(interviewId, { status: 'processing' });
    
    try {
        // Generate report
        const reportData = await generateInterviewReport({
            resume: resumeText,
            selfDescription,
            jobDescription
        });
        
        // Save to DB
        const updatedInterview = await InterviewReport.findByIdAndUpdate(
            interviewId, 
            { ...reportData, status: 'completed' },
            { new: true }
        );
        
        return updatedInterview;
    } catch (error) {
        logger.error(`Error processing job ${job.id}:`, error);
        await InterviewReport.findByIdAndUpdate(interviewId, { status: 'failed' });
        throw error;
    }
}, { connection });

interviewWorker.on('completed', (job) => {
    logger.info(`Job ${job.id} has completed!`);
});

interviewWorker.on('failed', (job, err) => {
    logger.error(`Job ${job.id} has failed with ${err.message}`);
});

module.exports = { interviewWorker };
