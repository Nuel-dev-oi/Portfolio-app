import { Request, Response, NextFunction } from 'express';
import { StatusCodes, getReasonPhrase } from 'http-status-codes';

export interface AppError extends Error {
  statusCode?: number;
}

// Express recognises a 4-argument function as an error handler
export function errorHandler(
  err: AppError,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  const status = err.statusCode ?? StatusCodes.INTERNAL_SERVER_ERROR;
  // Never leak internal error messages to the client on 5xx
  const message =
    status >= StatusCodes.INTERNAL_SERVER_ERROR
      ? getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR)
      : err.message;

  res.status(status).json({ success: false, message });
}
