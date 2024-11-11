import { loadEnv } from "./config";
import { createApp } from "./app";
import logger from "./utils/logger";
import "module-alias/register";
import cors from "cors";
import express from "express";

loadEnv();

const allowedOrigins = [
  "http://localhost:5173",
  "https://task-mananger-naveed.netlify.app",
];

const app = createApp();

// Apply CORS before any routes or middleware
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
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Explicitly specify allowed methods
    allowedHeaders: ["Content-Type", "Authorization"], // Specify headers to prevent preflight issues
  })
);

// Optional: Health check route to verify deployment
app.get("/health", (req:any, res:any) => {
  console.log(req.query);
  return res.send("Server is healthy");
});

const PORT = process.env.PORT || 8001;

app.listen(PORT, () => console.log(`App listening on ${PORT}`));

// Error handling and logging
process.on("uncaughtException", (error) => {
  logger.error("Uncaught Exception thrown:", error);
});

process.on("unhandledRejection", (reason, promise) => {
  logger.error("Unhandled Rejection at:", promise, "reason:", reason);
});

export default app;
