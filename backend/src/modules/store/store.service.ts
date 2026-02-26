import { prisma } from "../../config/prisma";

export async function createStore(name: string, ownerId: string) {
  return prisma.store.create({
    data: {
      name,
      ownerId,
    },
  });
}

export async function getVendorStores(ownerId: string) {
  return prisma.store.findMany({
    where: { ownerId },
  });
}
export async function getStoreById(storeId: string) {
  return prisma.store.findUnique({ where: { id: storeId } });
}

export async function getAllStores() {
  return prisma.store.findMany();
}

export async function updateStore(storeId: string, name: string) {
  return prisma.store.update({
    where: { id: storeId },
    data: { name },
  });
}
export async function deleteStore(storeId: string) {
  return prisma.store.delete({
    where: { id: storeId },
  });
}
