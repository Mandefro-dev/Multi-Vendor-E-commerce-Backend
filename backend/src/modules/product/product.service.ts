import { productRepository } from "./product.repository";
import { prisma } from "../../config/prisma";
import { privateDecrypt } from "node:crypto";

export const productService = {
  async createProduct(
    storeId: string,
    vendorId: string,
    data: {
      name: string;
      description?: string;
      price: number;
      stock: number;
    },
  ) {
    const store = await prisma.store.findUnique({
      where: { id: storeId },
    });
    if (!store) {
      throw new Error("store not found");
    }
    if (store.ownerId !== vendorId) {
      throw new Error("Unauthorized to add product to this store");
    }
    return productRepository.create({
      ...data,
      storeId,
    });
  },

  async getStoreProduct(storeId: string, vendorId: string, page: 1, limit: 10) {
    const store = await prisma.store.findUnique({
      where: { id: storeId },
    });
    if (!store || store.ownerId !== vendorId) {
      throw new Error("unautorized acesss");
    }
    const skip = (page - 1) * limit;
    return productRepository.findByStore(storeId, skip, limit);
  },
  async updatePrduct(productId: string, vendorId: string, data: any) {
    const product = await productRepository.findById(productId);
    if (!product) {
      throw new Error("Product not found");
    }
    const store = await prisma.store.findUnique({
      where: { id: product.storeId },
    });
    if (store?.ownerId !== vendorId) {
      throw new Error("unauthorized");
    }
    return productRepository.update(productId, data);
  },
  async deleteProduct(productId: string, vendorId: string) {
    const product = await productRepository.findById(productId);
    if (!product) {
      throw new Error("product  not found");
    }
    const store = await prisma.store.findUnique({
      where: { id: product.storeId },
    });
    if (store?.ownerId !== vendorId) {
      throw new Error("unauthorized");
    }
    return productRepository.softDelete(productId);
  },
};
