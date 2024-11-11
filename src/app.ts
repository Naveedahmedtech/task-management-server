import express from "./config/express.config";

// ** middlewares
import { requestLogger } from "./middlewares/requestLogger";
import { notFoundHandler } from "./middlewares/notFountHandler";
import { errorHandler } from "./middlewares/errorHandler";
import { rateLimiterMiddleware } from "./middlewares/rateLimit";

// ** routes
import routes from "./routes";

// ** external libraries
import helmet from "helmet";
import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import { LIMITS } from "./constants";
import { csrfTokenHandler } from "./middlewares/csrfTokenHandler";
import session from "express-session";
import { ROUTES } from "./constants/routePaths";

export const createApp = () => {
  const app = express();
  const allowedOrigins = [
    "http://localhost:5173",
    "https://task-mananger-naveed.netlify.app",
  ];
  app.use(
    cors({
      origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error("Not allowed by CORS"));
        }
      },
      credentials: true,
    })
  );

  app.use(cors());
  app.use(
    session({
      secret: "session-secret-key",
      resave: false,
      saveUninitialized: true,
      cookie: { secure: false },
    })
  );
  app.use(csrfTokenHandler);
  app.set("trust proxy", 1);
  app.use(requestLogger);
  app.use(cookieParser());
  app.use(express.json({ limit: LIMITS.BODY_SIZE }));
  app.use(express.urlencoded({ limit: LIMITS.BODY_SIZE, extended: true }));
  app.use(express.static("public"));
  app.use(helmet());
  app.use(compression());
  app.disable("x-powered-by");
  app.use(rateLimiterMiddleware);
  app.use(ROUTES.APP.VERSION_1, routes);
  app.use(notFoundHandler);
  app.use(errorHandler);
  return app;
};
