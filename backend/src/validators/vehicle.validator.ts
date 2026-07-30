import { z } from "zod";

const currentYear = new Date().getFullYear();

export const vehicleBodySchema = z.object({
  make: z.string().trim().min(1).max(60),
  model: z.string().trim().min(1).max(60),
  category: z.string().trim().min(1).max(40),
  price: z.coerce.number().positive().max(100000000),
  quantity: z.coerce.number().int().min(0),
  year: z.coerce.number().int().min(1900).max(currentYear + 2).optional(),
  imageUrl: z.string().url().optional().or(z.literal(""))
});

export const createVehicleSchema = z.object({
  body: vehicleBodySchema
});

export const updateVehicleSchema = z.object({
  body: vehicleBodySchema.partial().refine((value) => Object.keys(value).length > 0, {
    message: "At least one field is required"
  }),
  params: z.object({ id: z.string().uuid() })
});

export const idSchema = z.object({
  params: z.object({ id: z.string().uuid() })
});

export const stockSchema = z.object({
  params: z.object({ id: z.string().uuid() }),
  body: z.object({
    quantity: z.coerce.number().int().positive()
  })
});

export const searchSchema = z.object({
  query: z
    .object({
      make: z.string().trim().optional(),
      model: z.string().trim().optional(),
      category: z.string().trim().optional(),
      minPrice: z.coerce.number().min(0).optional(),
      maxPrice: z.coerce.number().min(0).optional()
    })
    .refine(
      (query) =>
        query.minPrice === undefined ||
        query.maxPrice === undefined ||
        query.minPrice <= query.maxPrice,
      {
        message: "Minimum price cannot exceed maximum price"
      }
    )
});
