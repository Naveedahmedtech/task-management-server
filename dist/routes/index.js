"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_config_1 = require("@/config/express.config");
// ** routes
const roles_1 = __importDefault(require("./roles"));
const permissions_1 = __importDefault(require("./permissions"));
const auth_1 = __importDefault(require("./auth"));
const users_1 = __importDefault(require("./users"));
const tasks_1 = __importDefault(require("./tasks"));
const csrfTokenHandler_1 = require("@/middlewares/csrfTokenHandler");
const routePaths_1 = require("@/constants/routePaths");
express_config_1.router.use(routePaths_1.ROUTES.AUTH.BASE, auth_1.default);
express_config_1.router.use(routePaths_1.ROUTES.USERS.BASE, users_1.default);
express_config_1.router.use(routePaths_1.ROUTES.ROLES.BASE, roles_1.default);
express_config_1.router.use(routePaths_1.ROUTES.PERMISSIONS.BASE, permissions_1.default);
express_config_1.router.use(routePaths_1.ROUTES.TASK.BASE, tasks_1.default);
express_config_1.router.get("/csrf-token", csrfTokenHandler_1.csrfTokenHandler, (req, res) => {
    const csrfToken = res.locals.csrfToken;
    res.cookie("xsrf-token", csrfToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production" ? true : false,
        sameSite: process.env.NODE_ENV === "production" ? "strict" : false,
    });
    res.json({ csrfToken: csrfToken });
});
exports.default = express_config_1.router;
