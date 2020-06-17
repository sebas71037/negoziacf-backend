import { Request, Response, NextFunction } from 'express';
import * as winston from 'winston';
import { ErrorManage } from '@libs/error-manage';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    //
    // - Write to all logs with level `info` and below to `combined.log`
    // - Write all logs error (and below) to `error.log`.
    //
    new winston.transports.File({
      filename: 'src/storage/logs/error.log',
      level: 'error',
    }),
    new winston.transports.File({ filename: 'src/storage/logs/combined.log' }),
  ],
});

//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    }),
  );
}

export function unCoughtErrorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const errorManage = new ErrorManage();

  console.error(err);
  logger.log(errorManage.loggerLevel, JSON.stringify(err));
  res
    .status(errorManage.status)
    .json({ slug: errorManage.slug, message: errorManage.message });
}

export function apiErrorHandler(err: any, req: Request, res: Response) {
  let errorManage: ErrorManage;
  if (err.slug) {
    errorManage = err;
  } else {
    console.error(err);
    errorManage = new ErrorManage();
  }

  const error: object = {
    slug: errorManage.slug,
    message: errorManage.message,
    Request: {
      url: req.url,
      method: req.method,
    },
    Stack: errorManage.stack,
  };

  logger.log(errorManage.loggerLevel, JSON.stringify(error));
  res
    .status(errorManage.status)
    .json({ slug: errorManage.slug, message: errorManage.message });
}
