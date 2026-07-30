import { Request, Response } from "express";
import {
  createVehicle,
  deleteVehicle,
  listVehicles,
  purchaseVehicle,
  restockVehicle,
  searchVehicles,
  updateVehicle
} from "../services/vehicle.service";
import { AppError } from "../utils/AppError";

function getId(request: Request): string {
  const id = request.params.id;

  if (typeof id !== "string") {
    throw new AppError(400, "Invalid vehicle ID");
  }

  return id;
}

export async function create(request: Request, response: Response) {
  const vehicle = await createVehicle(request.body);

  response.status(201).json({
    success: true,
    message: "Vehicle added successfully",
    vehicle
  });
}

export async function list(_request: Request, response: Response) {
  const vehicles = await listVehicles();

  response.status(200).json({
    success: true,
    vehicles
  });
}

export async function search(request: Request, response: Response) {
  const vehicles = await searchVehicles(request.query);

  response.status(200).json({
    success: true,
    vehicles
  });
}

export async function update(request: Request, response: Response) {
  const id = getId(request);
  const vehicle = await updateVehicle(id, request.body);

  response.status(200).json({
    success: true,
    message: "Vehicle updated successfully",
    vehicle
  });
}

export async function remove(request: Request, response: Response) {
  const id = getId(request);

  await deleteVehicle(id);

  response.status(200).json({
    success: true,
    message: "Vehicle deleted successfully"
  });
}

export async function purchase(request: Request, response: Response) {
  const id = getId(request);

  if (!request.user) {
    throw new AppError(401, "Authentication is required");
  }

  const result = await purchaseVehicle(
    id,
    request.user.id,
    request.body.quantity
  );

  response.status(200).json({
    success: true,
    message: "Vehicle purchased successfully",
    ...result
  });
}

export async function restock(request: Request, response: Response) {
  const id = getId(request);

  const vehicle = await restockVehicle(id, request.body.quantity);

  response.status(200).json({
    success: true,
    message: "Vehicle restocked successfully",
    vehicle
  });
}