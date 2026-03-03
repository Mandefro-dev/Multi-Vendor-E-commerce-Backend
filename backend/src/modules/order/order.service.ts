import { Decimal } from "@prisma/client/runtime/client";
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
      const productIds = input.items.map((i) => i.productId);
      const products = await tx.product.findMany({
        where: {
          id: {
            in: productIds,
          },
          isDeleted: false,
        },
      });
      if (products.length !== productIds.length) {
        throw new Error("One or more products not found");
      }
      for (const item of input.items) {
        const product = products.find((p) => p.id === item.productId);

        if (!product) throw new Error("Product not found");
        if (product.stock < item.quantity) {
          throw new Error(`Insufficent stock for ${product.name}`);
        }

        total = total.plus(product.price.mul(item.quantity));
      }

      if (input.couponCode) {
        const coupon = await tx.coupon.findUnique({
          where: {
            code: input.couponCode,
          },
        });
        if (
          !coupon ||
          !coupon.isActive ||
          (coupon.expiresAt && coupon.expiresAt < new Date())
        ) {
          throw new Error("Invalid or expired coupon");
        }
        const discount = total.mul(coupon.discountPct / 10);
        total = total.minus(discount);
      }
      //create order
      const order = await tx.order.create({
        data: {
          userId,
          totalAmount: total,
        },
      });

      for (const item of input.items) {
        const product = products.find((p) => p.id === item.productId)!;

        await tx.orderItem.create({
          data: {
            orderId: order.id,
            productId: product.id,
            quantity: item.quantity,
            price: product.price,
          },
        });

        await tx.product.update({
          where: { id: product.id },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });
      }

      return order;
    });
  },
};
