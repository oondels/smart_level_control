const path = require("path");
const fs = require("fs");
const { createLogger, format, transports } = require("winston");
const { combine, timestamp, colorize, printf } = format;

const logDir = path.join(__dirname, "../logs");
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const combinedLogPath = path.join(logDir, "combined.log");
const errorLogPath = path.join(logDir, "error.log");

const logFormat = printf(({ level, message, timestamp, service }) => {
  return `[${timestamp}] [${service || "unknown service"}] ${level}: ${message}`;
});

const baseLogger = createLogger({
  level: "info",
  format: combine(timestamp({ format: "YYYY-MM-DD HH:mm:ss" })),
  transports: [
    new transports.Console({
      format: combine(colorize(), logFormat),
    }),
    new transports.File({
      filename: combinedLogPath,
      format: logFormat,
    }),
    new transports.File({
      filename: errorLogPath,
      level: "error",
      format: logFormat,
    }),
  ],
});

// Função wrapper para permitir passar o nome do serviço manualmente
const logger = {
  info: (service, message) => baseLogger.info({ service, message }),
  error: (service, message) => baseLogger.error({ service, message }),
  warn: (service, message) => baseLogger.warn({ service, message }),
  debug: (service, message) => baseLogger.debug({ service, message }),
};

module.exports = logger;
