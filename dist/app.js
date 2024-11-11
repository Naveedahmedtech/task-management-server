"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApp = void 0;
const express_config_1 = __importDefault(require("./config/express.config"));
// ** middlewares
const requestLogger_1 = require("./middlewares/requestLogger");
const notFountHandler_1 = require("./middlewares/notFountHandler");
const errorHandler_1 = require("./middlewares/errorHandler");
const rateLimit_1 = require("./middlewares/rateLimit");
// ** routes
const routes_1 = __importDefault(require("./routes"));
// ** external libraries
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const constants_1 = require("./constants");
const csrfTokenHandler_1 = require("./middlewares/csrfTokenHandler");
const express_session_1 = __importDefault(require("express-session"));
const routePaths_1 = require("./constants/routePaths");
const createApp = () => {
    const app = (0, express_config_1.default)();
    app.use((0, express_session_1.default)({
        secret: "session-secret-key",
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false },
    }));
    app.use(csrfTokenHandler_1.csrfTokenHandler);
    app.set("trust proxy", 1);
    app.use(requestLogger_1.requestLogger);
    app.use((0, cookie_parser_1.default)());
    app.use(express_config_1.default.json({ limit: constants_1.LIMITS.BODY_SIZE }));
    app.use(express_config_1.default.urlencoded({ limit: constants_1.LIMITS.BODY_SIZE, extended: true }));
    app.use(express_config_1.default.static("public"));
    app.use((0, helmet_1.default)());
    app.use((0, compression_1.default)());
    app.disable("x-powered-by");
    app.use(rateLimit_1.rateLimiterMiddleware);
    app.use(routePaths_1.ROUTES.APP.VERSION_1, routes_1.default);
    app.use(notFountHandler_1.notFoundHandler);
    app.use(errorHandler_1.errorHandler);
    return app;
};
exports.createApp = createApp;
