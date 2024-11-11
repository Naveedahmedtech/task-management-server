"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("@/config");
const app_1 = require("@/app");
const logger_1 = __importDefault(require("@/utils/logger"));
(0, config_1.loadEnv)();
const app = (0, app_1.createApp)();
const PORT = process.env.PORT || 8001;
const startServer = async () => {
    try {
        app.listen(PORT, () => {
            console.info(`\n
        *************************
          ------->  APP IS RUNNING ON PORT [${PORT}]
        *************************************
        `);
        });
        // catch application error here...
        process.on("uncaughtException", (error) => {
            logger_1.default.error("Uncaught Exception thrown:", error);
            process.exit(1);
        });
        // process.on("uncaughtExceptionMonitor", () => {});
        process.on("unhandledRejection", (reason, promise) => {
            logger_1.default.error("Unhandled Rejection at:", promise, "reason:", reason);
            console.error("Promise:", promise, "Reason:", reason);
        });
    }
    catch (error) {
        logger_1.default.error("Error starting server:", error);
        process.exit(1);
    }
};
startServer();
