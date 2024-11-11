import { loadEnv } from "./src/config";
import { createApp } from "./src/app";
import logger from "./src/utils/logger";

loadEnv();

const app = createApp();

const PORT = process.env.PORT || 8001;

const startServer = async () => {
  try {
    app.listen(PORT, () => {
      console.info(`\n
        *************************
          ------->  APP IS RUNNING ON PORT [${PORT}]
        *************************************
        `);
    }); 

    // catch application error here...
    process.on("uncaughtException", (error) => {
      logger.error("Uncaught Exception thrown:", error);
      process.exit(1);
    });
    // process.on("uncaughtExceptionMonitor", () => {});
    process.on("unhandledRejection", (reason, promise) => {
      logger.error("Unhandled Rejection at:", promise, "reason:", reason);
      console.error("Promise:", promise, "Reason:", reason);
    });
  } catch (error) {
    logger.error("Error starting server:", error);
    process.exit(1);
  }
};

startServer();
