import { NextFunction, Request, Response } from "express";
import { Prisma } from "@prisma/client";
import { AppError } from "../utils/AppError";
import { env } from "../config/env";

export function notFound(
  request: Request,
  _response: Response,
  next: NextFunction
): void {
  next(new AppError(404, `Route ${request.method} ${request.originalUrl} not found`));
}

export function errorHandler(
  error: unknown,
  _request: Request,
  response: Response,
  _next: NextFunction
): void {
  let statusCode = 500;
  let message = "Internal server error";

  if (error instanceof AppError) {
    statusCode = error.statusCode;
    message = error.message;
  } else if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      statusCode = 409;
      message = "A record with this value already exists";
    } else if (error.code === "P2025") {
      statusCode = 404;
      message = "Requested record was not found";
    }
  } else if (error instanceof Error) {
    const possibleStatus = (error as Error & { statusCode?: number }).statusCode;
    statusCode = possibleStatus ?? 500;
    message = error.message || message;
  }

  response.status(statusCode).json({
    success: false,
    message,
    ...(env.NODE_ENV === "development" && error instanceof Error
      ? { stack: error.stack }
      : {})
  });
}
