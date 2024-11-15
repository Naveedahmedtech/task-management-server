"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyTokenMiddleware = void 0;
const checkDecoded_1 = require("../utils/checkDecoded");
const responseHandler_1 = require("../utils/responseHandler");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const routePaths_1 = require("../constants/routePaths");
const prisma_1 = __importDefault(require("../prisma"));
const constants_1 = require("../constants");
const verifyTokenMiddleware = async (req, res, next) => {
    const token = req.cookies?.accessToken;
    console.log("tokentokentoken===-=-=-=-=-=-***", token);
    if (!token) {
        return (0, responseHandler_1.sendErrorResponse)(res, "Access token is not provided.", 401);
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, constants_1.ENV.JWT.SECRET);
        if ((0, checkDecoded_1.isDecodedWithId)(decoded)) {
            const user = await prisma_1.default.user.findUnique({
                where: { id: decoded.id },
                include: { role: true },
            });
            console.log("decoded", decoded, user);
            if (!user) {
                return (0, responseHandler_1.sendErrorResponse)(res, "Account deleted. Your account has been deleted.", 404);
            }
            req.user = {
                token,
                decoded,
            };
            const userRole = user.role.name;
            const endpointKey = `${req.method} ${req.baseUrl}${req.path}`;
            const allowedRoles = routePaths_1.ACCESS_CONTROL[endpointKey] || [];
            console.log(",********", endpointKey, allowedRoles, userRole);
            if (allowedRoles.length && !allowedRoles.includes(userRole)) {
                return (0, responseHandler_1.sendErrorResponse)(res, "You do not have permission to access this resource.", 403);
            }
            next();
        }
        else {
            return (0, responseHandler_1.sendErrorResponse)(res, "Invalid token format.", 403);
        }
    }
    catch (error) {
        console.log("error", error);
        return (0, responseHandler_1.sendErrorResponse)(res, "Access token is expired or invalid.", 403);
    }
};
exports.verifyTokenMiddleware = verifyTokenMiddleware;
