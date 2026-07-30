import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { env } from "./config/env";
import { authRouter } from "./routes/auth.routes";
import { vehicleRouter } from "./routes/vehicle.routes";
import { errorHandler, notFound } from "./middleware/error";

export const app = express();

app.use(helmet());
app.use(
  cors({
    origin: env.FRONTEND_URL,
    credentials: false
  })
);
app.use(express.json({ limit: "1mb" }));

app.use(
  "/api/auth",
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    standardHeaders: true,
    legacyHeaders: false
  }),
  authRouter
);

app.get("/api/health", (_request, response) => {
  response.status(200).json({ success: true, status: "ok" });
});

app.use("/api/vehicles", vehicleRouter);

app.use(notFound);
app.use(errorHandler);
