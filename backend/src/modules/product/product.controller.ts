import { Response } from "express";
import { AuthRequest } from "../../middlewares/requireAuth";
import { productService } from "./product.service";
import { advancedQuery } from "./product.repository";

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
    const products = await productService.getStoreProduct(
      req.params.storeId as string,
      req.user.id,
      Number(page) || 1,
      Number(limit) || 10,
    );
    res.json(products);
  },
  async getAdvanced(req: AuthRequest, res: Response) {
    const {
      page,
      limit,
      minPrice,
      maxPrice,
      catagoryId,
      search,
      sortBy,
      sortOrder,
    } = req.query;

    const result = await advancedQuery(req.params.storeId as string, {
      page: Number(page),
      limit: Number(limit),
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      categoryId: catagoryId as string,
      search: search as string,
      sortBy: sortBy as any,
      sortOrder: sortOrder as any,
    });
    res.json(result);
  },
  async update(req: AuthRequest, res: Response) {
    const product = await productService.updateProduct(
      req.params.productId,
      req.user.id,
      req.body,
    );
    res.json({
      message: "updated successfully.",
      product,
    });
  },
  async remove(req: AuthRequest, res: Response) {
    await productService.deleteProduct(
      req.params.productId as string,
      req.user.id,
    );
    res.json({
      message: "Deleted successfully",
    });
  },
};
