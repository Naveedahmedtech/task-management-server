"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadEnv = void 0;
const dotenv_1 = require("dotenv");
const loadEnv = () => {
    process.env.NODE_ENV = process.env.NODE_ENV || "local";
    const ENV_FILE = `.env.${process.env.NODE_ENV}`;
    (0, dotenv_1.config)({ path: ENV_FILE });
};
exports.loadEnv = loadEnv;
