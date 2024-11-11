import { createLogger, transports, format } from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
import fs from "fs";
import path from "path";
const { combine, timestamp, errors, json, printf, colorize } = format;

// Ensure logs directory exists
const logDir = path.join(__dirname, "..", "..", "logs");
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
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

const logger = createLogger({
  level: process.env.NODE_ENV === "production" ? "info" : "debug",
  format: combine(
    timestamp(),
    errors({ stack: true }),
    json() // Use JSON format for all logs
  ),
  defaultMeta: { service: "user-service", environment: process.env.NODE_ENV },
  transports: [
    new transports.Console({
      format: combine(
        colorize(),
        timestamp(),
        logFormat // Use custom format for console output
      ),
    }),
    new DailyRotateFile({
      filename: "logs/error-%DATE%.log",
      datePattern: "YYYY-MM-DD",
      level: "error",
      maxSize: "20m",
      maxFiles: "14d",
      format: combine(
        timestamp(),
        errors({ stack: true }),
        aggregateJsonFormat // Aggregate errors in a single error object
      ),
    }),
    new DailyRotateFile({
      filename: "logs/combined-%DATE%.log",
      datePattern: "YYYY-MM-DD",
      maxSize: "20m",
      maxFiles: "14d",
      format: combine(
        timestamp(),
        errors({ stack: true }),
        aggregateJsonFormat // Aggregate errors in a single error object
      ),
    }),
  ],
  exceptionHandlers: [
    new transports.File({
      filename: "logs/exceptions.log",
      format: combine(
        timestamp(),
        errors({ stack: true }),
        aggregateJsonFormat // Aggregate exceptions in a single error object
      ),
    }),
  ],
  rejectionHandlers: [
    new transports.File({
      filename: "logs/rejections.log",
      format: combine(
        timestamp(),
        errors({ stack: true }),
        aggregateJsonFormat // Aggregate rejections in a single error object
      ),
    }),
  ],
});

export default logger;
