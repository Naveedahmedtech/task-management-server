"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("./config");
const app_1 = require("./app");
const logger_1 = __importDefault(require("./utils/logger"));
require("module-alias/register");
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const ap = (0, express_1.default)();
(0, config_1.loadEnv)();
const allowedOrigins = [
    "http://localhost:5173",
    "https://task-mananger-naveed.netlify.app",
];
ap.use((0, cors_1.default)({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
}));
const app = (0, app_1.createApp)();
// Optional: Health check route to verify deployment
app.get("/health", (req, res) => {
    console.log(req.query);
    return res.send("Server is healthy");
});
const PORT = process.env.PORT || 8001;
app.listen(PORT, () => console.log(`App listening on ${PORT}`));
// Export the app instead of listening on a port
exports.default = app;
// Error handling and logging
process.on("uncaughtException", (error) => {
    logger_1.default.error("Uncaught Exception thrown:", error);
});
process.on("unhandledRejection", (reason, promise) => {
    logger_1.default.error("Unhandled Rejection at:", promise, "reason:", reason);
});
