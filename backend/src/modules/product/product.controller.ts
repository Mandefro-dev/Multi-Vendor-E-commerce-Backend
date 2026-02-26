import { Response } from "express";
import { AuthRequest } from "../../middlewares/requireAuth";
import { productService } from "./product.service";

export const productController = {
  async create(req: AuthRequest, res: Response) {
    const product = await productService.createProduct(
      req.params.storeId as string,
      req.user.id,
      req.body,
    );
    res.status(201).json({
      message: "Prduct created successfully,",
      product,
    });
  },
  async getStoreProducts(req: AuthRequest, res: Response) {
    const { page, limit } = req.query;
    const product = await productService.getStoreProduct(
      req.params.storeId as string,
      req.user.id,
      Number(page) || 1,
      Number(limit) || 10,
    );
  },
};
