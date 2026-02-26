import express, { Router } from "express";
import { requireAuth } from "../../middlewares/requireAuth";
import { requireRole } from "../../middlewares/requireRole";
import { productController } from "./product.controller";
const router = Router({ mergeParams: true });

router.post("/", requireAuth, requireRole("VENDOR"), productController.create);

router.get(
  "/",
  requireAuth,
  requireRole("VENDOR"),
  productController.getStoreProducts,
);
router.put(
  "/:productId",
  requireAuth,
  requireRole("VENDOR"),
  productController.update,
);

router.delete(
  "/:productId",
  requireAuth,
  requireRole("VENDOR"),
  productController.remove,
);

export default router;
