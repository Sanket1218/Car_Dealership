import { Request, Response } from "express";
import { loginUser, registerUser } from "../services/auth.service";

export async function register(request: Request, response: Response) {
  const user = await registerUser(request.body);
  response.status(201).json({
    success: true,
    message: "User registered successfully",
    user
  });
}

export async function login(request: Request, response: Response) {
  const result = await loginUser(request.body);
  response.status(200).json({
    success: true,
    message: "Login successful",
    ...result
  });
}
