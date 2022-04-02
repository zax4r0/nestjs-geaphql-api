import * as winston from 'winston';
import {
  WinstonModule,
  utilities as nestWinstonModuleUtilities,
} from 'nest-winston';
import winstonDaily from 'winston-daily-rotate-file';
import { join } from 'path';
import { existsSync, mkdirSync } from 'fs';

const logDir: string = join(__dirname, '../logs');

if (!existsSync(logDir)) {
  mkdirSync(logDir);
}

/*
 * Log Level
 * error: 0, warn: 1, info: 2, http: 3, verbose: 4, debug: 5, silly: 6
 */
export const logFormat = winston.format.printf(
  ({ timestamp, level, message }) =>
    `[ShopX 🛒 🛍] ${timestamp} ${level}: ${message}`,
);

const logger = WinstonModule.createLogger({
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.colorize(),
        winston.format.ms(),
        winston.format.splat(),
        nestWinstonModuleUtilities.format.nestLike('ShopX 🛒 🛍]', {
          prettyPrint: true,
        }),
        // logFormat,
      ),
    }),
    new winstonDaily({
      level: 'debug',
      filename: 'application-%DATE%.log',
      datePattern: 'YYYY-MM-DD-HH',
      dirname: logDir + '/debug', // log file /logs/debug/*.log in save
      maxFiles: 30, // 30 Days saved
      json: false,
      maxSize: '20m',
      zippedArchive: true,
    }),
    new winstonDaily({
      level: 'error',
      datePattern: 'YYYY-MM-DD-HH',
      dirname: logDir + '/error', // log file /logs/error/*.log in save
      filename: 'application-%DATE%.log',
      maxFiles: 30, // 30 Days saved
      maxSize: '20m',
      handleExceptions: true,
      json: false,
      zippedArchive: true,
    }),
  ],
  exitOnError: false,
});

const stream = {
  write: (message: any) => {
    logger.log(message);
  },
};
export { logger, stream };
