const pino = require("pino");

// Configure the logger
const logger = pino({
  level: process.env.LOG_LEVEL || "info", // Default to 'info' level, but can be overridden by an environment variable
  transport:
    process.env.NODE_ENV !== "production"
      ? {
          target: "pino-pretty", // Use 'pino-pretty' for pretty-printing logs in non-production environments
          options: {
            colorize: true, // Add colors for better readability in the console
            translateTime: "SYS:standard", // Include timestamps in logs
          },
        }
      : undefined,
});

module.exports = logger;
