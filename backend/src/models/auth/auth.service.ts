import bcrypt from "bcryptjs";
import argon2 from "argon2";

import { prisma } from "../../config/prisma";
import { generateToken } from "../../utils/jwt";

export async function registerUser(
  name: string,
  email: string,
  password: string,
) {
  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) {
    throw new Error("Email already in use.");
  }
  const hashed = await argon2.hash(password);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashed,
    },
  });

  const token = generateToken({
    id: user.id,
    tole: user.role,
  });

  return { user, token };
}

export async function loginUser(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new Error("Invalid credentials");
  }

  const valid = await argon2.verify(user.password, password);
  if (!valid) {
    throw new Error("invalid credentials");
  }
  const token = generateToken({ id: user.id, role: user.role });

  return { user, token };
}
