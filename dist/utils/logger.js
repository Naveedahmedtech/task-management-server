"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = require("winston");
const winston_daily_rotate_file_1 = __importDefault(require("winston-daily-rotate-file"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const { combine, timestamp, errors, json, printf, colorize } = winston_1.format;
// Ensure logs directory exists
const logDir = path_1.default.join(__dirname, "..", "..", "logs");
if (!fs_1.default.existsSync(logDir)) {
    fs_1.default.mkdirSync(logDir);
}
// Custom format for more readable console logs
const logFormat = printf(({ level, message, timestamp, stack }) => {
    return `${timestamp} [${level}]: ${stack || message}`;
});
// Aggregate errors in a single error object for log files
const aggregateJsonFormat = printf((info) => {
    return JSON.stringify({
        error: {
            service: info.service,
            environment: info.environment,
            statusCode: info.statusCode,
            stack: info.stack,
            level: info.level,
            message: info.message,
            timestamp: info.timestamp,
        },
    });
});
const logger = (0, winston_1.createLogger)({
    level: process.env.NODE_ENV === "production" ? "info" : "debug",
    format: combine(timestamp(), errors({ stack: true }), json() // Use JSON format for all logs
    ),
    defaultMeta: { service: "user-service", environment: process.env.NODE_ENV },
    transports: [
        new winston_1.transports.Console({
            format: combine(colorize(), timestamp(), logFormat // Use custom format for console output
            ),
        }),
        new winston_daily_rotate_file_1.default({
            filename: "logs/error-%DATE%.log",
            datePattern: "YYYY-MM-DD",
            level: "error",
            maxSize: "20m",
            maxFiles: "14d",
            format: combine(timestamp(), errors({ stack: true }), aggregateJsonFormat // Aggregate errors in a single error object
            ),
        }),
        new winston_daily_rotate_file_1.default({
            filename: "logs/combined-%DATE%.log",
            datePattern: "YYYY-MM-DD",
            maxSize: "20m",
            maxFiles: "14d",
            format: combine(timestamp(), errors({ stack: true }), aggregateJsonFormat // Aggregate errors in a single error object
            ),
        }),
    ],
    exceptionHandlers: [
        new winston_1.transports.File({
            filename: "logs/exceptions.log",
            format: combine(timestamp(), errors({ stack: true }), aggregateJsonFormat // Aggregate exceptions in a single error object
            ),
        }),
    ],
    rejectionHandlers: [
        new winston_1.transports.File({
            filename: "logs/rejections.log",
            format: combine(timestamp(), errors({ stack: true }), aggregateJsonFormat // Aggregate rejections in a single error object
            ),
        }),
    ],
});
exports.default = logger;
