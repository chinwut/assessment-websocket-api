const logger = require('./logger');

const errorHandler = (error, req, res, next) => {
    logger.error(error.message);

    res.status(500).json({
        error: {
            message: error.message,
            status: 500,
            timestamp: new Date().toISOString()
        }
    });
};

module.exports = errorHandler;
