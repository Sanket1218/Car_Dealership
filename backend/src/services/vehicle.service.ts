import { Prisma } from "@prisma/client";
import { prisma } from "../config/prisma";
import { AppError } from "../utils/AppError";

export interface VehicleInput {
  make: string;
  model: string;
  category: string;
  price: number;
  quantity: number;
  year?: number;
  imageUrl?: string;
}

export interface SearchInput {
  make?: string;
  model?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
}

const serializeVehicle = <T extends { price: Prisma.Decimal }>(vehicle: T) => ({
  ...vehicle,
  price: Number(vehicle.price)
});

function validatePurchaseQuantity(requestedQuantity: number) {
  if (requestedQuantity <= 0) {
    throw new AppError(
      400,
      "Purchase quantity must be greater than zero"
    );
  }
}

export async function createVehicle(input: VehicleInput) {
  const vehicle = await prisma.vehicle.create({
    data: {
      ...input,
      imageUrl: input.imageUrl || null
    }
  });

  return serializeVehicle(vehicle);
}

export async function listVehicles() {
  const vehicles = await prisma.vehicle.findMany({
    orderBy: { createdAt: "desc" }
  });

  return vehicles.map(serializeVehicle);
}

export async function searchVehicles(input: SearchInput) {
  const where: Prisma.VehicleWhereInput = {};

  if (input.make) {
    where.make = {
      contains: input.make,
      mode: "insensitive"
    };
  }

  if (input.model) {
    where.model = {
      contains: input.model,
      mode: "insensitive"
    };
  }

  if (input.category) {
    where.category = {
      contains: input.category,
      mode: "insensitive"
    };
  }

  if (
    input.minPrice !== undefined ||
    input.maxPrice !== undefined
  ) {
    where.price = {
      ...(input.minPrice !== undefined
        ? { gte: input.minPrice }
        : {}),
      ...(input.maxPrice !== undefined
        ? { lte: input.maxPrice }
        : {})
    };
  }

  const vehicles = await prisma.vehicle.findMany({
    where,
    orderBy: { createdAt: "desc" }
  });

  return vehicles.map(serializeVehicle);
}

export async function updateVehicle(
  id: string,
  input: Partial<VehicleInput>
) {
  const existing = await prisma.vehicle.findUnique({
    where: { id }
  });

  if (!existing) {
    throw new AppError(404, "Vehicle not found");
  }

  const vehicle = await prisma.vehicle.update({
    where: { id },
    data: {
      ...input,
      ...(input.imageUrl !== undefined
        ? { imageUrl: input.imageUrl || null }
        : {})
    }
  });

  return serializeVehicle(vehicle);
}

export async function deleteVehicle(id: string) {
  const existing = await prisma.vehicle.findUnique({
    where: { id }
  });

  if (!existing) {
    throw new AppError(404, "Vehicle not found");
  }

  try {
    await prisma.vehicle.delete({
      where: { id }
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2003"
    ) {
      throw new AppError(
        409,
        "Vehicle has purchase records and cannot be deleted"
      );
    }

    throw error;
  }
}

export async function purchaseVehicle(
  vehicleId: string,
  userId: string,
  requestedQuantity: number
) {
  return prisma.$transaction(async (transaction) => {
    const vehicle = await transaction.vehicle.findUnique({
      where: { id: vehicleId }
    });

    if (!vehicle) {
      throw new AppError(404, "Vehicle not found");
    }

    validatePurchaseQuantity(requestedQuantity);

    if (vehicle.quantity < requestedQuantity) {
      throw new AppError(
        409,
        `Only ${vehicle.quantity} vehicle(s) are available`
      );
    }

    const changed = await transaction.vehicle.updateMany({
      where: {
        id: vehicleId,
        quantity: {
          gte: requestedQuantity
        }
      },
      data: {
        quantity: {
          decrement: requestedQuantity
        }
      }
    });

    if (changed.count !== 1) {
      throw new AppError(
        409,
        "Stock changed. Please try again"
      );
    }

    const total =
      Number(vehicle.price) * requestedQuantity;

    const purchase = await transaction.purchase.create({
      data: {
        userId,
        vehicleId,
        quantity: requestedQuantity,
        unitPrice: vehicle.price,
        total
      }
    });

    const updatedVehicle =
      await transaction.vehicle.findUniqueOrThrow({
        where: { id: vehicleId }
      });

    return {
      purchase: {
        ...purchase,
        unitPrice: Number(purchase.unitPrice),
        total: Number(purchase.total)
      },
      vehicle: serializeVehicle(updatedVehicle)
    };
  });
}

export async function restockVehicle(
  id: string,
  quantity: number
) {
  const existing = await prisma.vehicle.findUnique({
    where: { id }
  });

  if (!existing) {
    throw new AppError(404, "Vehicle not found");
  }

  const vehicle = await prisma.vehicle.update({
    where: { id },
    data: {
      quantity: {
        increment: quantity
      }
    }
  });

  return serializeVehicle(vehicle);
}