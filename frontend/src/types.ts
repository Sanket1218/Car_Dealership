export type UserRole = "USER" | "ADMIN";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface Vehicle {
  id: string;
  make: string;
  model: string;
  category: string;
  price: number;
  quantity: number;
  year?: number;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface VehicleFormData {
  make: string;
  model: string;
  category: string;
  price: number;
  quantity: number;
  year?: number;
  imageUrl?: string;
}
