import { Router } from "express";
import {
  create,
  list,
  purchase,
  remove,
  restock,
  search,
  update
} from "../controllers/vehicle.controller";
import { authenticate, requireAdmin } from "../middleware/auth";
import { validate } from "../middleware/validate";
import {
  createVehicleSchema,
  idSchema,
  searchSchema,
  stockSchema,
  updateVehicleSchema
} from "../validators/vehicle.validator";
import { asyncHandler } from "../utils/asyncHandler";

export const vehicleRouter = Router();

vehicleRouter.use(authenticate);

vehicleRouter.get("/", asyncHandler(list));
vehicleRouter.get("/search", validate(searchSchema), asyncHandler(search));
vehicleRouter.post(
  "/",
  requireAdmin,
  validate(createVehicleSchema),
  asyncHandler(create)
);
vehicleRouter.put(
  "/:id",
  requireAdmin,
  validate(updateVehicleSchema),
  asyncHandler(update)
);
vehicleRouter.delete(
  "/:id",
  requireAdmin,
  validate(idSchema),
  asyncHandler(remove)
);
vehicleRouter.post(
  "/:id/purchase",
  validate(stockSchema),
  asyncHandler(purchase)
);
vehicleRouter.post(
  "/:id/restock",
  requireAdmin,
  validate(stockSchema),
  asyncHandler(restock)
);
