const winston = require('winston');

const logConfiguration = {
    transports: [
        new winston.transports.Console({
            level: 'info',
            filename: 'logs/server.log',
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
                winston.format.simple()
            )
        }),
        new winston.transports.File({
            level: 'error',
            filename: 'logs/server.log',
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
                winston.format.json()
            )
        })
    ]
};

const logger = winston.createLogger(logConfiguration);

module.exports = logger;
