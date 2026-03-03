import { prisma } from "../../config/prisma";
import { Prisma } from "@prisma/client";

interface OrderInput {
  items: {
    productId: string;
    quantity: number;
  }[];
  couponCode?: string;
}

export const orderService = {
  async createOrder(userId: string, input: OrderInput) {
    return prisma.$transaction(async (tx) => {
      let total = new Prisma.Decimal(0);
    });
  },
};
