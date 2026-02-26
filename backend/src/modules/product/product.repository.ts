import { prisma } from "../../config/prisma";

export const productRepository = {
  create(data: any) {
    return prisma.product.create({ data });
  },

  findById(id: string) {
    return prisma.product.findFirst({
      where: {
        id,
        isDeleted: false,
      },
    });
  },

  findByStore(storeId: string, skip: number, take: number) {
    return prisma.product.findMany({
      where: {
        storeId,
        isDeleted: false,
      },
      skip,
      take,
      orderBy: { createdAt: "desc" },
    });
  },

  update(id: string, data: any) {
    return prisma.product.update({
      where: { id },
      data,
    });
  },
  softDelete(id: string) {
    return prisma.product.update({
      where: { id },
      data: { isDeleted: true },
    });
  },
};
