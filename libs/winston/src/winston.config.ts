import * as winston from 'winston';
import 'winston-daily-rotate-file';

const contextColor = '\x1b[33m';
const resetColor = '\x1b[0m';

export const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  handleExceptions: true,
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.colorize(),
        winston.format.printf(
          ({ timestamp, level, message, context, trace }) => {
            return `${timestamp} ${contextColor}[${context}]${resetColor} ${level}: ${message}${
              trace ? `\n${trace}` : ''
            }`;
          },
        ),
      ),
    }),
    new winston.transports.DailyRotateFile({
      filename: 'logs/application-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
      ),
    }),
  ],
});
