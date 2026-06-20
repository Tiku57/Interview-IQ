const Redis = require('ioredis');
const logger = require('../utils/logger');

const redisOptions = {
    maxRetriesPerRequest: null,
    enableReadyCheck: false
};

const connection = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', redisOptions);

connection.on('error', (err) => {
    logger.error('Redis connection error:', err);
});

module.exports = { connection };
