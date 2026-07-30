import { NextFunction, Request, Response } from "express";
import { UserRole } from "@prisma/client";
import { AppError } from "../utils/AppError";
import { verifyToken } from "../utils/jwt";

export function authenticate(
  request: Request,
  _response: Response,
  next: NextFunction
): void {
  const authorization = request.headers.authorization;

  if (!authorization?.startsWith("Bearer ")) {
    next(new AppError(401, "Authentication token is required"));
    return;
  }

  try {
    const token = authorization.slice(7);
    request.user = verifyToken(token);
    next();
  } catch {
    next(new AppError(401, "Invalid or expired authentication token"));
  }
}

export function requireAdmin(
  request: Request,
  _response: Response,
  next: NextFunction
): void {
  if (!request.user) {
    next(new AppError(401, "Authentication is required"));
    return;
  }

  if (request.user.role !== UserRole.ADMIN) {
    next(new AppError(403, "Administrator access is required"));
    return;
  }

  next();
}
