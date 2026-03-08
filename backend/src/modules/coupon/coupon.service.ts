import { Coupon } from "@prisma/client";

export function calculateDiscount(coupon: Coupon, amount: number) {
  if (coupon.discountType === "PERCENT") {
    return (coupon.discountValue / 100) * amount;
  }

  if (coupon.discountType === "FIXED") {
    return coupon.discountValue;
  }

  return 0;
}
