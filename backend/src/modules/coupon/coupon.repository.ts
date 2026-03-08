import { Prisma } from "@prisma/client";

export const couponRepository = {
  async findByCode(tx: Prisma.TransactionClient, code: string) {
    return tx.coupon.findUnique({
      where: { code },
    });
  },

  async checkUserUsage(
    tx: Prisma.TransactionClient,
    userId: string,
    couponId: string,
  ) {
    return tx.couponUsage.findUnique({
      where: {
        userId_couponId: {
          userId,
          couponId,
        },
      },
    });
  },
};
