import { PrismaClient } from "./generated/prisma";
import { config } from "dotenv";
config({ path: "../../.env" })

const globalForPrisma = global as unknown as { prisma: PrismaClient };

const prisma =
  globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;