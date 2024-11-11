"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = require("winston");
const logger = (0, winston_1.createLogger)({
    level: process.env.NODE_ENV === "production" ? "info" : "debug",
    format: winston_1.format.simple(), // Simple format: just level and message
    transports: [
        new winston_1.transports.Console(), // Logs to console
    ],
});
exports.default = logger;
