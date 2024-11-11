import { Request, Response, router } from "@/config/express.config";

// ** routes
import roleRouter from "./roles";
import permissionRouter from "./permissions";
import authRouter from "./auth";
import userRouter from "./users";
import tasksRouter from "./tasks";
import { csrfTokenHandler } from "@/middlewares/csrfTokenHandler";
import { ROUTES } from "@/constants/routePaths";

router.use(ROUTES.AUTH.BASE, authRouter);
router.use(ROUTES.USERS.BASE, userRouter);
router.use(ROUTES.ROLES.BASE, roleRouter);
router.use(ROUTES.PERMISSIONS.BASE, permissionRouter);
router.use(ROUTES.TASK.BASE, tasksRouter);

router.get("/csrf-token", csrfTokenHandler, (req: Request, res: Response) => {
  const csrfToken = res.locals.csrfToken; 
  res.cookie("xsrf-token", csrfToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production" ? true : false,
    sameSite: process.env.NODE_ENV === "production" ? "strict" : false,
  });
  res.json({ csrfToken: csrfToken });
});

export default router;
