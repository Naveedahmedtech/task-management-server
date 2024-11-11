"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sessionHandler = void 0;
const express_session_1 = __importDefault(require("express-session"));
const sessionHandler = () => {
    const expiryDate = new Date(Date.now() + 60 * 60 * 1000);
    (0, express_session_1.default)({
        secret: "s3Cur3",
        name: "sessionId",
        resave: false,
        saveUninitialized: true,
        cookie: {
            secure: true,
            httpOnly: true,
            expires: expiryDate,
        },
    });
};
exports.sessionHandler = sessionHandler;
