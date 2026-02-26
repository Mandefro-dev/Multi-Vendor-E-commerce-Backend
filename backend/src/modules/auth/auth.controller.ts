import { Request, Response } from "express";
import { registerUser, loginUser } from "./auth.service";
import { success } from "zod";

export async function register(req: Request, res: Response) {
  try {
    const { name, email, password } = req.body;
    const result = await registerUser(name, email, password);

    res.status(201).json({
      success: true,
      message: "user created successfully.",
      result,
    });
  } catch (error: any) {
    res.status(400).json({
      message: error.message,
    });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;
    const result = await loginUser(email, password);
    res.status(200).json({
      success: true,
      message: "user logged in successfully.",
      result,
    });
  } catch (error: any) {
    res.status(400).json({
      message: error.message,
    });
  }
}
