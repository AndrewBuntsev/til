//We are currently using the Winston logger
//https://github.com/winstonjs/winston

const winston = require('winston');
const { format } = require('logform');
require('winston-daily-rotate-file');

const timeHelper = require('./helpers/timeHelper');

const logLevels = {
    levels: {
        error: 0,
        warn: 1,
        important: 2,
        info: 3,
        trace: 4
    },
    colors: {
        error: 'red',
        warn: 'magenta',
        important: 'green',
        info: 'white',
        trace: 'gray'
    }
};

const defaultFormat = format.combine(
    format((info, opt) => {
        info.timestamp = timeHelper.getDateTimeString(new Date());
        return info;
    })(),
    format.printf(info => `${info.timestamp} ${info.level}: ${info.message} ${info.stack ? `\n\tStack Trace: ${info.stack}` : ``}`)
);


const logger = winston.createLogger({
    levels: logLevels.levels,
    format: defaultFormat,
    transports: [
        new winston.transports.DailyRotateFile({ filename: `${process.env.LOG_PATH}error__%DATE%.log`, datePattern: 'YYYY-MM-DD', level: 'warn', handleExceptions: true }),
        new winston.transports.DailyRotateFile({ filename: `${process.env.LOG_PATH}info__%DATE%.log`, datePattern: 'YYYY-MM-DD', level: 'important', handleExceptions: true }),
        new winston.transports.DailyRotateFile({
            filename: `${process.env.LOG_PATH}trace__%DATE%.log`,
            datePattern: 'YYYY-MM-DD',
            level: 'trace',
            handleExceptions: true
        })
    ],
    exitOnError: false,
    silent: false //If true, all logs are suppressed
});

//Add custom color scheme
winston.addColors(logLevels.colors);

logger.on('error', info => {
    logger.error('Logger on error fired the exception');
    logger.error(info);
});

logger.add(
    new winston.transports.Console({
        format: format.combine(defaultFormat, format.colorize({ all: 'true' })),
        level: process.env.ENV == 'LOCAL' ? 'info' : 'important'
    })
);


//Wrapping logging methods
exports.error = function (message) {
    logger.log({ level: 'error', message: message, stack: Error().stack });
};

exports.warn = function (message) {
    logger.log({ level: 'warn', message: message });
};

exports.important = function (message) {
    logger.log({ level: 'important', message: message });
};

exports.info = function (message) {
    logger.log({ level: 'info', message: message });
};

exports.trace = function (message) {
    logger.log({ level: 'trace', message: message });
};
