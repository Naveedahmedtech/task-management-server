import { loadEnv } from "./config";
import { createApp } from "./app";
import logger from "./utils/logger";
import "module-alias/register";


loadEnv();

const app = createApp();


// Optional: Health check route to verify deployment
app.get("/health", (req: any, res: any) => {
  console.log(req.query)
  return res.send("Server is healthy");
});


const PORT = process.env.PORT || 8001;

app.listen(PORT, () => console.log(`App listening on ${PORT}`));

// Export the app instead of listening on a port
export default app;

// Error handling and logging
process.on("uncaughtException", (error) => {
  logger.error("Uncaught Exception thrown:", error);
});

process.on("unhandledRejection", (reason, promise) => {
  logger.error("Unhandled Rejection at:", promise, "reason:", reason);
});
