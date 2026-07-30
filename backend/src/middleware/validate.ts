import { NextFunction, Request, Response } from "express";
import { ZodType } from "zod";

export const validate =
  (schema: ZodType) =>
  (request: Request, _response: Response, next: NextFunction): void => {
    const result = schema.safeParse({
      body: request.body,
      query: request.query,
      params: request.params
    });

    if (!result.success) {
      const message = result.error.issues
        .map((issue) => issue.message)
        .join(", ");
      next(Object.assign(new Error(message), { statusCode: 400 }));
      return;
    }

    const data = result.data as {
      body?: unknown;
      query?: unknown;
      params?: unknown;
    };

    if (data.body !== undefined) request.body = data.body;
    if (data.query !== undefined) request.query = data.query as Request["query"];
    if (data.params !== undefined) request.params = data.params as Request["params"];
    next();
  };
