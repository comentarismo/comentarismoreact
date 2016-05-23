var winston = require('winston');

function getLogger() {
    var logger = new (winston.Logger)({
        transports: [
            new winston.transports.Console(),
            new winston.transports.File({filename: '/tmp/comentarismoreact-all-logs.log'})
        ],
        exceptionHandlers: [
            new winston.transports.Console(),
            new winston.transports.File({filename: '/tmp/comentarismoreact-exceptions.log'})
        ]
    });
    return logger;
}

module.exports = {
    getLogger: getLogger
}