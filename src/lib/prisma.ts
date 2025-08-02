import { PrismaClient } from "@/generated/prisma";

export const prisma = new PrismaClient({
  // log: ["query"],
});

// Setup Prisma Client with Accelerate
// const prismaClientSingleton = () => {
//   return new PrismaClient({}).$extends(withAccelerate());
// };

// type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

// const globalForPrisma = globalThis as unknown as {
//   prisma: PrismaClientSingleton | undefined;
// };

// export const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

// // Access NODE_ENV directly without Zod
// if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
