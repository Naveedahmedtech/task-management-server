import { createLogger, transports, format } from "winston";

const logger = createLogger({
  level: process.env.NODE_ENV === "production" ? "info" : "debug",
  format: format.simple(), // Simple format: just level and message
  transports: [
    new transports.Console(), // Logs to console
  ],
});

export default logger;
