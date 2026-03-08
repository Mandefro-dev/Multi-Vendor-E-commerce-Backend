import { prisma } from "../config/prisma";
import { couponService } from "./coupon.service";
import { calculateDiscount } from "../utils/calculate-discount";

export const orderService = {
  async createOrder(userId: string, items: any[], couponCode?: string) {
    return prisma.$transaction(async (tx) => {
      let total = 0;
      const products = [];

      for (const item of items) {
        const product = await tx.product.findUnique({
          where: { id: item.productId },
        });

        if (!product) throw new Error("Product not found");

        if (product.stock < item.quantity)
          throw new Error("Insufficient stock");

        total += product.price * item.quantity;

        products.push(product);
      }

      let discount = 0;
      let coupon = null;

      if (couponCode) {
        coupon = await couponService.validateCoupon(
          tx,
          couponCode,
          userId,
          total,
        );

        discount = calculateDiscount(coupon, total);

        total -= discount;
      }

      const order = await tx.order.create({
        data: {
          userId,
          totalAmount: total,
          couponId: coupon?.id,
        },
      });

      if (coupon) {
        await tx.coupon.update({
          where: { id: coupon.id },
          data: {
            usedCount: { increment: 1 },
          },
        });

        await tx.couponUsage.create({
          data: {
            userId,
            couponId: coupon.id,
            orderId: order.id,
          },
        });
      }

      return order;
    });
  },
};
