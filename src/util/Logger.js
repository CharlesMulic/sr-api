const winston = require("winston");
const { format, transports } = winston;

const logger = winston.createLogger({
  format: format.combine(
    format.label({ label: "[my-label]" }),
    format.timestamp({
      format: "YYYY-MM-DD HH:mm:ss"
    }),

    // format.simple()
    format.printf(info => `${info.timestamp} ${info.level.toUpperCase()}: ${info.message}`)
  ),
  transports: [
    new transports.Console({
      json: false,
      timestamp: true,
      depth: true,
      colorize: true
    })
    // new winston.transports.File({ filename: "combined.log" })
  ]
});

module.exports = logger;
