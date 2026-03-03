import { prisma } from "../../config/prisma";
import { Prisma } from "@prisma/client";

interface QueryOptions {
  page?: number; //page
  limit?: number; //how many per page
  minPrice?: number; //price filtering
  maxPrice?: number;
  categoryId?: string; //by catagory
  search?: string; //name

  sortBy?: "price" | "rating" | "newest"; //what field to sort
  sortOrder?: "asc" | "desc"; // ascending and descending
}
export async function advancedQuery(storeId: string, options: QueryOptions) {
  const {
    page = 1, //page
    limit = 10, //how many per page
    minPrice, //price filtering
    maxPrice,
    categoryId, //by catagory
    search, //name search

    sortBy = "newest", //wha
    sortOrder = "desc",
  } = options;
  const skip = (page - 1) * limit;

  const where: Prisma.ProductWhereInput = {
    storeId,
    isDeleted: false,
  };

  //price filterig
  if (minPrice || maxPrice) {
    where.price = {
      gte: minPrice, //greater than or equal to minimum price
      lte: maxPrice, //less than to max price
      //so it become in a range(100-500)
    };
  }
  if (categoryId) {
    where.categoryId = categoryId; //products with that catagory will be only returned
  }
  if (search) {
    where.name = {
      contains: search,
      mode: "insensitive",
    };
  }

  let orderBy: any = {};
  if (sortBy === "price") {
    orderBy.price = sortOrder;
  } else if (sortBy === "rating") {
    orderBy.rating = sortOrder;
  } else {
    orderBy.createdAt = sortOrder;
  }

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      skip,
      take: limit,
      orderBy,
    }),
    prisma.product.count({ where }),
  ]);

  return {
    data: products,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
}

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
