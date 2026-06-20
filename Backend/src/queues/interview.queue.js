const { Queue } = require('bullmq');
const { connection } = require('../config/redis');

const interviewQueue = new Queue('interviewGeneration', { connection });

module.exports = { interviewQueue };
