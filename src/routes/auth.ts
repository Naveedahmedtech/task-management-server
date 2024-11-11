import express from "express";

import { loginUser, logout, registerUser } from "../controller/auth";
import { loginSchema, registerSchema } from "../lib/validation/auth";
import csrfProtection from "../middlewares/csrfTokenHandler";
import { validateRequest } from "../middlewares/validation";
import { ROUTES } from "../constants/routePaths";

const authRouter = express.Router();

authRouter.post(
  ROUTES.AUTH.REGISTER,
  csrfProtection,
  validateRequest(registerSchema),
  registerUser
);

authRouter.post(
  ROUTES.AUTH.SIGN_IN,
  csrfProtection,
  validateRequest(loginSchema),
  loginUser
);

authRouter.post(ROUTES.AUTH.LOGOUT, logout);

export default authRouter;
