import { Response, NextFunction } from "express";
import { AuthRequest } from "./requireAuth";
import { prisma } from "../config/prisma";

export async function requireOwnership(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) {
  const storeId = req.params.id;
  const store = await prisma.store.findUnique({
    where: { id: storeId as string },
  });
  if (!store) {
    return res.status(404).json({
      message: "Store not found.",
    });
  }

  if (req.user.role === "ADMIN") {
    return next();
  }

  if (store.ownerId !== req.user.id) {
    return res.status(403).json({
      message: "You do not have permission to perform this action.",
    });
  }
}
